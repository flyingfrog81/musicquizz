// ---------------------------------------------------------
// DOM ELEMENTS
// ---------------------------------------------------------

const categoriesContainer  = document.getElementById("categories");
const difficultiesContainer = document.getElementById("difficulties");
const challengeContainer    = document.getElementById("challenge");

// ---------------------------------------------------------
// VERSION INFO
// ---------------------------------------------------------

const APP_VERSION = '0.9.0';


// ---------------------------------------------------------
// PROGRESS TRACKING
// ---------------------------------------------------------

// Track completed challenges in localStorage
const STORAGE_KEY = 'musicquiz_progress';

function getProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log(`[DEBUG] Retrieved from localStorage:`, stored);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error(`[DEBUG] Failed to get progress:`, error);
    return {};
  }
}

function saveProgress(progress) {
  console.log(`[DEBUG] Saving progress to localStorage:`, progress);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    console.log(`[DEBUG] Progress saved successfully`);
  } catch (error) {
    console.error(`[DEBUG] Failed to save progress:`, error);
  }
}

function markDifficultyCompleted(category, difficulty) {
  console.log(`[DEBUG] Marking ${category} difficulty ${difficulty} as completed`);
  const progress = getProgress();
  console.log(`[DEBUG] Current progress:`, progress);
  if (!progress[category]) {
    progress[category] = [];
  }
  if (!progress[category].includes(difficulty)) {
    progress[category].push(difficulty);
    saveProgress(progress);
    console.log(`[DEBUG] Progress updated:`, progress);
  } else {
    console.log(`[DEBUG] Difficulty ${difficulty} already completed for ${category}`);
  }
}

function isDifficultyCompleted(category, difficulty) {
  const progress = getProgress();
  return progress[category] && progress[category].includes(difficulty);
}

function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
  console.log('Progress cleared');
}

// ---------------------------------------------------------
// SPOTIFY WEB PLAYBACK SDK CONFIG
// ---------------------------------------------------------

const SPOTIFY_CONFIG = {
  clientId: 'aef766288e8e41618cd90b59328a81d3', // ⚠️ REPLACE WITH YOUR SPOTIFY APP CLIENT ID
  redirectUri: 'https://flyingfrog81.github.io/musicquizz/',
  scopes: [
    'streaming',
    'user-read-email', 
    'user-read-private',
    'user-modify-playback-state',
    'user-read-playback-state'
  ]
};

// ⚠️ SETUP INSTRUCTIONS:
// 1. Go to https://developer.spotify.com/dashboard
// 2. Click on your app, then add 'https://flyingfrog81.github.io/musicquizz/' as a Redirect URI
// 3. IMPORTANT: Go to "User Management" tab and add your email address
//    (Development mode apps only work for users you explicitly add)
// 4. Client ID is already set below - no changes needed

let spotifyApi = {
  accessToken: null,
  player: null,
  deviceId: null
};

// ---------------------------------------------------------
// STATE
// ---------------------------------------------------------

// Songs data - loaded dynamically from JSON file
let songsData = {};

// Load songs data from JSON file
async function loadSongsData() {
  try {
    console.log('Loading songs data from JSON...');
    const response = await fetch('data/songs.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    songsData = await response.json();
    console.log('Songs data loaded successfully:', Object.keys(songsData));
    return true;
  } catch (error) {
    console.error('Failed to load songs data:', error);
    // Fallback: show error message to user
    document.body.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #dc3545;">
        <h2>⚠️ Unable to Load Songs Database</h2>
        <p>Failed to load songs data from server.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
    return false;
  }
}
let selectedCategory = null;

// ---------------------------------------------------------
// INITIAL LOAD
// ---------------------------------------------------------

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', async function() {
  // Log version info for debugging
  console.log(`🎵 Music Quiz App v${APP_VERSION} loaded successfully!`);
  console.log(`📅 Build: ${new Date().toISOString()}`);
  console.log(`🌐 Environment: ${window.location.hostname === 'flyingfrog81.github.io' ? 'Production (GitHub Pages)' : 'Development'}`);
  
  // Test localStorage availability
  console.log(`[DEBUG] Testing localStorage availability...`);
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log(`[DEBUG] localStorage is working`);
    
    // Show current progress
    const currentProgress = getProgress();
    console.log(`[DEBUG] Current stored progress:`, currentProgress);
  } catch (error) {
    console.error(`[DEBUG] localStorage is NOT available:`, error);
  }
  
  // Load songs data first
  const songsLoaded = await loadSongsData();
  if (!songsLoaded) {
    return; // Error message already shown by loadSongsData()
  }
  
  initializeSpotifyAuth();
  renderCategories();
  
  // Setup persistent New Challenge button
  const newChallengePersistentBtn = document.getElementById('btn-new-challenge-persistent');
  if (newChallengePersistentBtn) {
    newChallengePersistentBtn.onclick = () => {
      console.log('[DEBUG] New Challenge clicked - clearing all progress');
      clearProgress();
      renderCategories();
    };
  }
  
  // Initialize persistent Spotify player
  initializePersistentPlayer();
});

// ---------------------------------------------------------
// SPOTIFY AUTHENTICATION & PLAYBACK SDK
// ---------------------------------------------------------

function initializeSpotifyAuth() {
  console.log('Initializing Spotify auth...');
  console.log('Current URL:', window.location.href);
  console.log('Hash:', window.location.hash);
  console.log('Search params:', window.location.search);
  
  // Check for errors first (both in hash and search params)
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const searchParams = new URLSearchParams(window.location.search);
  
  const hashError = hashParams.get('error');
  const searchError = searchParams.get('error');
  
  if (hashError || searchError) {
    const error = hashError || searchError;
    const authMethod = localStorage.getItem('spotify_auth_method');
    
    console.error('Spotify auth error:', error);
    
    // If we got unsupported_response_type with implicit grant, try authorization code flow
    if (error === 'unsupported_response_type' && authMethod === 'implicit') {
      console.log('Implicit grant not supported, trying authorization code flow...');
      localStorage.setItem('spotify_auth_method', 'code');
      
      const codeAuthUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${SPOTIFY_CONFIG.clientId}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(SPOTIFY_CONFIG.redirectUri)}&` +
        `scope=${encodeURIComponent(SPOTIFY_CONFIG.scopes.join(' '))}&` +
        `show_dialog=true`;
      
      console.log('Trying authorization code Auth URL:', codeAuthUrl);
      window.location.href = codeAuthUrl;
      return;
    }
    
    // Provide specific help based on error type
    let errorMessage = `Spotify authentication error: ${error}`;
    
    if (error === 'access_denied') {
      errorMessage += '\n\n🔧 This might be because:\n' +
        '1. Your Spotify app is in Development Mode\n' +
        '2. Your email needs to be added to "User Management" in the Spotify Dashboard\n' +
        '3. Go to your app settings → User Management → Add your email';
    } else if (error === 'unsupported_response_type') {
      errorMessage += '\n\n🔧 Your Spotify app doesn\'t support this authentication method.\n' +
        'This is unusual for Development Mode apps.';
    }
    
    alert(errorMessage);
    return;
  }
  
  // Check if we have an access token in the hash (implicit grant flow)
  const accessToken = hashParams.get('access_token');
  const expiresIn = hashParams.get('expires_in');
  
  // Check if we have an authorization code (authorization code flow)
  const authCode = searchParams.get('code');
  
  console.log('Access token from hash:', accessToken ? 'Found' : 'Not found');
  console.log('Auth code from search params:', authCode ? 'Found' : 'Not found');
  
  if (accessToken) {
    console.log('Setting access token from hash (implicit grant)');
    spotifyApi.accessToken = accessToken;
    
    // Store token with expiration time
    const expirationTime = Date.now() + (parseInt(expiresIn || '3600') * 1000);
    localStorage.setItem('spotify_access_token', accessToken);
    localStorage.setItem('spotify_token_expiration', expirationTime.toString());
    
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Initialize Spotify Web Playback SDK
    initializeSpotifyPlayer();
  } else if (authCode) {
    console.log('Got authorization code, exchanging for access token...');
    exchangeAuthCodeForToken(authCode);
  } else {
    // Check if we have a stored token that's not expired
    const storedToken = localStorage.getItem('spotify_access_token');
    const tokenExpiration = localStorage.getItem('spotify_token_expiration');
    
    console.log('Stored token:', storedToken ? 'Found' : 'Not found');
    
    if (storedToken && tokenExpiration) {
      const isExpired = Date.now() > parseInt(tokenExpiration);
      console.log('Token expired:', isExpired);
      
      if (!isExpired) {
        console.log('Using stored token');
        spotifyApi.accessToken = storedToken;
        console.log('Token ready - using embed player, no SDK needed');
      } else {
        console.log('Token expired, clearing storage');
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_token_expiration');
      }
    }
  }
}

async function exchangeAuthCodeForToken(authCode) {
  try {
    console.log('Exchanging authorization code for access token...');
    
    // Try different backend URLs - update with your actual Vercel deployment URL
    const backendUrls = [
      'https://musicquizz-flyingfrog81.vercel.app/api/auth',  // Most likely URL format
      'https://musicquizz.vercel.app/api/auth',               // Alternative format
      'https://musicquizz-marcos-projects-9a10e30f.vercel.app/api/auth'
    ];
    
    let success = false;
    
    for (const backendUrl of backendUrls) {
      try {
        console.log(`Trying backend: ${backendUrl}`);
        
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: authCode
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Token exchange successful with:', backendUrl);
          
          spotifyApi.accessToken = data.access_token;
          
          // Store token with expiration time
          const expirationTime = Date.now() + (data.expires_in * 1000);
          localStorage.setItem('spotify_access_token', data.access_token);
          localStorage.setItem('spotify_token_expiration', expirationTime.toString());
          
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Initialize Spotify Web Playback SDK
          initializeSpotifyPlayer();
          
          success = true;
          break;
        } else {
          console.log(`Backend ${backendUrl} responded with status:`, response.status);
        }
      } catch (err) {
        console.log(`Backend ${backendUrl} failed:`, err.message);
        continue;
      }
    }
    
    if (!success) {
      throw new Error('All backend services failed or not deployed yet');
    }
    
  } catch (error) {
    console.error('Token exchange failed:', error);
    
    // Show helpful message about backend setup
    alert(`🎉 Spotify authentication is working perfectly!

✅ Got authorization code: ${authCode.substring(0, 20)}...

❌ Backend service not found or not configured yet.

Next steps to complete setup:
1. Deploy to Vercel successfully (check deployment status)
2. Add SPOTIFY_CLIENT_SECRET environment variable in Vercel
3. Get your deployment URL and update the code

Your Vercel deployment URL should look like:
https://musicquizz-xyz123.vercel.app

Then update the backendUrls array in the code with your actual URL.`);
    
    // Clean up URL anyway
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function authenticateSpotify() {
  console.log('Starting Spotify authentication...');
  console.log('Client ID:', SPOTIFY_CONFIG.clientId);
  console.log('Redirect URI:', SPOTIFY_CONFIG.redirectUri);
  
  // Try implicit grant flow first (works if enabled)
  const implicitAuthUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${SPOTIFY_CONFIG.clientId}&` +
    `response_type=token&` +
    `redirect_uri=${encodeURIComponent(SPOTIFY_CONFIG.redirectUri)}&` +
    `scope=${encodeURIComponent(SPOTIFY_CONFIG.scopes.join(' '))}&` +
    `show_dialog=true`;
  
  console.log('Trying implicit grant Auth URL:', implicitAuthUrl);
  
  // Store that we're trying implicit grant first
  localStorage.setItem('spotify_auth_method', 'implicit');
  
  window.location.href = implicitAuthUrl;
}

function initializeSpotifyPlayer() {
  console.log('Using Spotify embed player - no SDK initialization needed');
  // Embed player requires no complex setup
}

function createSpotifyPlayer() {
  const player = new Spotify.Player({
    name: 'Music Quiz Player',
    getOAuthToken: cb => { cb(spotifyApi.accessToken); },
    volume: 0.7
  });

  // Error handling
  player.addListener('initialization_error', ({ message }) => {
    console.error('Spotify Player Error:', message);
  });

  player.addListener('authentication_error', ({ message }) => {
    console.error('Spotify Auth Error:', message);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiration');
    spotifyApi.accessToken = null;
    
    // Show user that they need to re-authenticate
    alert('Spotify authentication expired. Please reconnect to Spotify.');
    
    // Reload current challenge to show auth prompt again
    if (window.location.pathname.includes('musicquizz')) {
      window.location.reload();
    }
  });

  player.addListener('account_error', ({ message }) => {
    console.error('Spotify Account Error:', message);
  });

  player.addListener('playback_error', ({ message }) => {
    console.error('Spotify Playback Error:', message);
  });

  // Playback status updates
  player.addListener('player_state_changed', (state) => {
    if (!state) return;
    updatePlayerUI(state);
  });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Spotify Player Ready with Device ID', device_id);
    spotifyApi.deviceId = device_id;
    spotifyApi.player = player;
    
    // Player ready - using embed player, no additional setup needed
  });

  // Connect to the player!
  player.connect();
}

// ---------------------------------------------------------
// PLAYBACK CONTROL FUNCTIONS
// ---------------------------------------------------------

async function playTrack(spotifyUrl) {
  if (!spotifyApi.player || !spotifyApi.deviceId) {
    console.error('Spotify player not ready');
    return;
  }
  
  const trackId = extractSpotifyTrackId(spotifyUrl);
  if (!trackId) return;
  
  try {
    // Start playback on our device
    const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${spotifyApi.deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({
        uris: [`spotify:track:${trackId}`]
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifyApi.accessToken}`
      }
    });
    
    if (response.status === 204) {
      updatePlayerStatus('Playing...');
    } else {
      console.error('Failed to start playback:', response.status);
    }
  } catch (error) {
    console.error('Error playing track:', error);
  }
}

async function pauseTrack() {
  if (!spotifyApi.player) return;
  
  try {
    await spotifyApi.player.pause();
    updatePlayerStatus('Paused');
  } catch (error) {
    console.error('Error pausing track:', error);
  }
}

async function restartTrack() {
  if (!spotifyApi.player) return;
  
  try {
    await spotifyApi.player.seek(0);
    updatePlayerStatus('Restarted');
  } catch (error) {
    console.error('Error restarting track:', error);
  }
}

async function setVolume(volume) {
  if (!spotifyApi.player) return;
  
  try {
    await spotifyApi.player.setVolume(volume / 100);
  } catch (error) {
    console.error('Error setting volume:', error);
  }
}

function updatePlayerStatus(status) {
  const statusElement = document.getElementById('player-status');
  if (statusElement) {
    statusElement.textContent = status;
  }
}

function updatePlayerUI(state) {
  const playBtn = document.getElementById('play-btn');
  const pauseBtn = document.getElementById('pause-btn');
  
  if (!playBtn || !pauseBtn) return;
  
  if (state.paused) {
    playBtn.style.opacity = '1';
    pauseBtn.style.opacity = '0.5';
    updatePlayerStatus('Paused');
  } else {
    playBtn.style.opacity = '0.5';
    pauseBtn.style.opacity = '1';
    updatePlayerStatus('Playing');
  }
}

// ---------------------------------------------------------
// RENDER FUNCTIONS
// ---------------------------------------------------------

// Update page title dynamically
function updateTitle(newTitle) {
  document.querySelector('h1').textContent = newTitle;
}

// Render category buttons
function renderCategories() {
  categoriesContainer.innerHTML = "";
  for (const category in songsData) {
    const btn = document.createElement("button");
    btn.textContent = formatCategoryName(category);
    btn.id = `category-${category}`;
    btn.onclick = () => selectCategory(category);
    categoriesContainer.appendChild(btn);
  }

  // Clear any previous content
  difficultiesContainer.innerHTML = "";
  
  // Reset selected category and current track
  selectedCategory = null;
  currentTrack = null;
  window.currentChallenge = null;
  
  // Reset title to original
  updateTitle('Music Quiz');
  
  // Reset Spotify embed and challenge info
  const embedContainer = document.getElementById('spotify-embed-container');
  if (embedContainer) {
    embedContainer.innerHTML = '<div class="no-track-selected"><p>Select a challenge to start playing music</p></div>';
  }
  
  const challengeInfoElement = document.getElementById('current-challenge-info');
  if (challengeInfoElement) {
    challengeInfoElement.innerHTML = 'No challenge selected';
  }
  
  // Disable reveal button
  const revealBtn = document.getElementById('btn-reveal');
  if (revealBtn) revealBtn.disabled = true;

  showSection(categoriesContainer);
  hideSection(difficultiesContainer);
  hideSection(challengeContainer);
}

// Render difficulty buttons for selected category
function renderDifficulties(category) {
  difficultiesContainer.innerHTML = "";
  songsData[category].forEach(challenge => {
    const btn = document.createElement("button");
    btn.textContent = challenge.difficulty;
    btn.id = `difficulty-${category}-${challenge.difficulty}`;
    
    // Add completed class if already done
    if (isDifficultyCompleted(category, challenge.difficulty)) {
      btn.classList.add('completed');
    }
    
    btn.onclick = () => {
      markDifficultyCompleted(category, challenge.difficulty);
      btn.classList.add('completed');
      showChallenge(challenge);
    };
    
    difficultiesContainer.appendChild(btn);
  });

  showSection(difficultiesContainer);
  // Challenge section no longer needed
}

// Select challenge and update persistent player
function showChallenge(challenge) {
  // Update Spotify embed with new track
  updateSpotifyEmbed(challenge.spotify);
  
  // Update challenge info
  updateChallengeInfo(challenge);
  
  // Store current challenge for reveal functionality
  window.currentChallenge = challenge;
  
  // Enable reveal button
  const revealBtn = document.getElementById('btn-reveal');
  if (revealBtn) revealBtn.disabled = false;
  
  // Update title with category and difficulty
  updateTitle(`${formatCategoryName(selectedCategory)} - Difficulty ${challenge.difficulty}`);
}

// ---------------------------------------------------------
// EVENT HANDLERS
// ---------------------------------------------------------

function selectCategory(category) {
  selectedCategory = category;
  updateTitle(formatCategoryName(category));
  renderDifficulties(category);
}

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------

function showSection(el) {
  el.classList.remove("hidden");
}

function hideSection(el) {
  el.classList.add("hidden");
}

function formatCategoryName(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatChallengeType(type) {
  switch(type) {
    case "guess-title": return "Guess the title";
    case "guess-artist": return "Guess the artist";
    case "continue-lyrics": return "Continue the lyrics";
    default: return type;
  }
}

// Lower player functionality removed - using only persistent player now

// Challenge controls functionality moved to persistent player




// Initialize persistent Spotify player that's always visible
function initializePersistentPlayer() {
  const playerContainer = document.createElement('div');
  playerContainer.id = 'persistent-spotify-player';
  playerContainer.innerHTML = `
    <div class="spotify-embed-player">
      <h3>🎵 Spotify Player</h3>
      <div id="spotify-embed-container">
        <div class="no-track-selected">
          <p>Select a challenge to start playing music</p>
        </div>
      </div>
      <div id="challenge-info" class="challenge-info">
        <div id="current-challenge-info">No challenge selected</div>
        <button id="btn-reveal" class="reveal-btn" onclick="revealCurrentSong()" disabled>🔍 Reveal Answer</button>
      </div>
    </div>
  `;
  
  // Add to the page
  document.body.insertBefore(playerContainer, document.body.firstChild);
}

// Simple function to update the Spotify embed with a new track
function updateSpotifyEmbed(spotifyUrl) {
  const container = document.getElementById('spotify-embed-container');
  if (!container) return;
  
  // Extract track ID from Spotify URL
  const trackId = extractSpotifyTrackId(spotifyUrl);
  if (!trackId) {
    container.innerHTML = '<div class="error">Invalid Spotify URL</div>';
    return;
  }
  
  // Create Spotify embed iframe
  container.innerHTML = `
    <iframe 
      style="border-radius:12px" 
      src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0" 
      width="100%" 
      height="152" 
      frameBorder="0" 
      allowfullscreen="" 
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
      loading="lazy">
    </iframe>
  `;
}

// Global variable to track current challenge (simplified)
let currentTrack = null;

function updateChallengeInfo(challenge) {
  const challengeInfoElement = document.getElementById('current-challenge-info');
  if (challengeInfoElement) {
    challengeInfoElement.innerHTML = `
      <div class="challenge-details">
        <strong>Challenge ${challenge.difficulty}:</strong> ${formatChallengeType(challenge.type)}
      </div>
    `;
  }
}

// Reveal function for persistent player
function revealCurrentSong() {
  if (window.currentChallenge) {
    revealSongInfo(window.currentChallenge);
  } else {
    alert('Please select a challenge first!');
  }
}

// Simplified - no auth needed for Spotify embeds

// Reveal song information in persistent player
async function revealSongInfo(challenge) {
  const trackInfoDiv = document.getElementById("current-track-info");
  if (!trackInfoDiv) {
    console.error('Track info div not found');
    return;
  }
  
  try {
    const trackId = extractSpotifyTrackId(challenge.spotify);
    if (!trackId) {
      throw new Error("Invalid Spotify URL");
    }
    
    // Try to get song info from Spotify oEmbed API
    const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(challenge.spotify)}&format=json`;
    
    try {
      const response = await fetch(oembedUrl);
      if (!response.ok) throw new Error(`oEmbed API failed with status: ${response.status}`);
      
      const data = await response.json();
      console.log('Spotify oEmbed data:', data); // Debug log to see what we get
      console.log('Track ID:', trackId); // Debug the track ID we extracted
      displaySongInfo(data, challenge);
    } catch (apiError) {
      console.error('oEmbed API error:', apiError);
      console.log('Falling back to challenge data for track:', trackId);
      // Fallback: Show the basic song info from challenge data
      displayFallbackInfoInPersistentPlayer(challenge, trackId);
    }
    
    } catch (error) {
    console.error('Error revealing song info:', error);
    trackInfoDiv.innerHTML = `
      <div class="error">
        <p>❌ Unable to load song information</p>
        <p class="error-detail">Showing basic info instead</p>
      </div>
    `;
    
    // Even on error, show basic challenge info
    setTimeout(() => displayFallbackInfoInPersistentPlayer(challenge, null), 1000);
  }
}

// Display song information from Spotify oEmbed in persistent player
function displaySongInfo(data, challenge) {
  const trackInfoDiv = document.getElementById("current-track-info");
  
  // Parse Spotify oEmbed title which usually comes in format "Song Title by Artist Name"
  let songTitle = "Unknown Title";
  let artistName = "Unknown Artist";
  
  if (data.title) {
    const titleParts = data.title.split(" by ");
    if (titleParts.length >= 2) {
      songTitle = titleParts[0];
      artistName = titleParts.slice(1).join(" by "); // In case there are multiple "by" in the title
    } else {
      // If no " by " pattern, try other common patterns
      const altPatterns = [" - ", " – ", " — "];
      let parsed = false;
      
      for (const pattern of altPatterns) {
        if (data.title.includes(pattern)) {
          const parts = data.title.split(pattern);
          if (parts.length >= 2) {
            songTitle = parts[0];
            artistName = parts.slice(1).join(pattern);
            parsed = true;
            break;
          }
        }
      }
      
      if (!parsed) {
        // If no pattern matches, use the full title as song title
        songTitle = data.title;
        artistName = challenge.artist || "Unknown Artist";
      }
    }
  } else {
    // Fallback to challenge data
    songTitle = challenge.song || "Unknown Title";
    artistName = challenge.artist || "Unknown Artist";
  }
  
  const thumbnail = data.thumbnail_url || "";
  
  trackInfoDiv.innerHTML = `
    <div class="song-details">
      <h4>🎵 Song Revealed!</h4>
      ${thumbnail ? `<img src="${thumbnail}" alt="Album cover" class="album-cover" style="width: 60px; height: 60px;">` : ''}
      <div class="song-meta">
        <p><strong>Title:</strong> ${songTitle}</p>
        <p><strong>Artist:</strong> ${artistName}</p>
      </div>
    </div>
  `;
}

// Fallback song info display in persistent player
function displayFallbackInfoInPersistentPlayer(challenge, trackId) {
  const trackInfoDiv = document.getElementById("current-track-info");
  
  // Check if this is a placeholder URL
  const isPlaceholder = trackId && (trackId.startsWith('CLASSIC') || trackId.startsWith('IT') || trackId.startsWith('SING') || trackId.startsWith('MS'));
  
  trackInfoDiv.innerHTML = `
    <div class="song-details">
      <h4>🎵 Song Revealed!</h4>
      ${isPlaceholder ? '<div class="warning">⚠️ This is placeholder data</div>' : ''}
      <div class="song-meta">
        <p><strong>Title:</strong> ${challenge.song || "Unknown Title"}</p>
        <p><strong>Artist:</strong> ${challenge.artist || "Unknown Artist"}</p>
        ${!isPlaceholder ? `<p><a href="${challenge.spotify}" target="_blank">🔗 Spotify</a></p>` : ''}
      </div>
    </div>
  `;
}



// Extract Spotify track ID from various URL formats
function extractSpotifyTrackId(url) {
  if (!url) return null;
  
  // Handle different Spotify URL formats
  const patterns = [
    /open\.spotify\.com\/track\/([a-zA-Z0-9]+)/,
    /embed\/track\/([a-zA-Z0-9]+)/,
    /track[\/:]([a-zA-Z0-9]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// Error handling now integrated into persistent player display functions

// Ensure Spotify URL is in the correct format for app linking
function getSpotifyUrl(url) {
  if (!url) return "";
  // Remove embed path if present and ensure it's a regular Spotify URL
  if (url.includes("/embed/")) {
    const parts = url.split("/embed/track/");
    if (parts.length > 1) {
      const trackId = parts[1].split("?")[0];
      return `https://open.spotify.com/track/${trackId}`;
    }
  }
  return url;
}
