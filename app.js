// ---------------------------------------------------------
// DOM ELEMENTS
// ---------------------------------------------------------

const categoriesContainer  = document.getElementById("categories");
const difficultiesContainer = document.getElementById("difficulties");
const challengeContainer    = document.getElementById("challenge");

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
// 2. Create a new app
// 3. Add 'https://flyingfrog81.github.io/musicquizz/' as a Redirect URI
// 4. Copy your Client ID and replace 'YOUR_CLIENT_ID_HERE' above

let spotifyApi = {
  accessToken: null,
  player: null,
  deviceId: null
};

// ---------------------------------------------------------
// STATE
// ---------------------------------------------------------

let songsData = {
  "sing-along": [
    { "difficulty": 1, "type": "guess-title", "song": "Song 1", "artist": "Artist 1", "spotify": "https://open.spotify.com/track/7037bX3jdaUWUAXL12CHGy?si=8f032fd38d8443e8" },
    { "difficulty": 2, "type": "guess-artist", "song": "Song 2", "artist": "Artist 2", "spotify": "https://open.spotify.com/track/6oC8FuowgLT4ZSlXECLCNX?si=34328ab1b2124bc6" },
    { "difficulty": 3, "type": "continue-lyrics", "song": "Song 3", "artist": "Artist 3", "spotify": "https://open.spotify.com/track/STUB3" },
    { "difficulty": 4, "type": "guess-title", "song": "Song 4", "artist": "Artist 4", "spotify": "https://open.spotify.com/track/STUB4" },
    { "difficulty": 5, "type": "guess-artist", "song": "Song 5", "artist": "Artist 5", "spotify": "https://open.spotify.com/track/STUB5" },
    { "difficulty": 6, "type": "continue-lyrics", "song": "Song 6", "artist": "Artist 6", "spotify": "https://open.spotify.com/track/STUB6" },
    { "difficulty": 7, "type": "guess-title", "song": "Song 7", "artist": "Artist 7", "spotify": "https://open.spotify.com/track/STUB7" },
    { "difficulty": 8, "type": "guess-artist", "song": "Song 8", "artist": "Artist 8", "spotify": "https://open.spotify.com/track/STUB8" },
    { "difficulty": 9, "type": "continue-lyrics", "song": "Song 9", "artist": "Artist 9", "spotify": "https://open.spotify.com/track/STUB9" },
    { "difficulty": 10, "type": "guess-title", "song": "Song 10", "artist": "Artist 10", "spotify": "https://open.spotify.com/track/STUB10" }
  ],

  "italian": [
    { "difficulty": 1, "type": "guess-title", "song": "Song 1", "artist": "Artist 1", "spotify": "https://open.spotify.com/track/IT1" },
    { "difficulty": 2, "type": "guess-artist", "song": "Song 2", "artist": "Artist 2", "spotify": "https://open.spotify.com/track/IT2" },
    { "difficulty": 3, "type": "continue-lyrics", "song": "Song 3", "artist": "Artist 3", "spotify": "https://open.spotify.com/track/IT3" },
    { "difficulty": 4, "type": "guess-title", "song": "Song 4", "artist": "Artist 4", "spotify": "https://open.spotify.com/track/IT4" },
    { "difficulty": 5, "type": "guess-artist", "song": "Song 5", "artist": "Artist 5", "spotify": "https://open.spotify.com/track/IT5" },
    { "difficulty": 6, "type": "continue-lyrics", "song": "Song 6", "artist": "Artist 6", "spotify": "https://open.spotify.com/track/IT6" },
    { "difficulty": 7, "type": "guess-title", "song": "Song 7", "artist": "Artist 7", "spotify": "https://open.spotify.com/track/IT7" },
    { "difficulty": 8, "type": "guess-artist", "song": "Song 8", "artist": "Artist 8", "spotify": "https://open.spotify.com/track/IT8" },
    { "difficulty": 9, "type": "continue-lyrics", "song": "Song 9", "artist": "Artist 9", "spotify": "https://open.spotify.com/track/IT9" },
    { "difficulty": 10, "type": "guess-title", "song": "Song 10", "artist": "Artist 10", "spotify": "https://open.spotify.com/track/IT10" }
  ],

  "80s-90s": [
    { "difficulty": 1, "type": "guess-title", "song": "Song 1", "artist": "Artist 1", "spotify": "https://open.spotify.com/track/80_1" },
    { "difficulty": 2, "type": "guess-artist", "song": "Song 2", "artist": "Artist 2", "spotify": "https://open.spotify.com/track/80_2" },
    { "difficulty": 3, "type": "continue-lyrics", "song": "Song 3", "artist": "Artist 3", "spotify": "https://open.spotify.com/track/80_3" },
    { "difficulty": 4, "type": "guess-title", "song": "Song 4", "artist": "Artist 4", "spotify": "https://open.spotify.com/track/80_4" },
    { "difficulty": 5, "type": "guess-artist", "song": "Song 5", "artist": "Artist 5", "spotify": "https://open.spotify.com/track/80_5" },
    { "difficulty": 6, "type": "continue-lyrics", "song": "Song 6", "artist": "Artist 6", "spotify": "https://open.spotify.com/track/80_6" },
    { "difficulty": 7, "type": "guess-title", "song": "Song 7", "artist": "Artist 7", "spotify": "https://open.spotify.com/track/80_7" },
    { "difficulty": 8, "type": "guess-artist", "song": "Song 8", "artist": "Artist 8", "spotify": "https://open.spotify.com/track/80_8" },
    { "difficulty": 9, "type": "continue-lyrics", "song": "Song 9", "artist": "Artist 9", "spotify": "https://open.spotify.com/track/80_9" },
    { "difficulty": 10, "type": "guess-title", "song": "Song 10", "artist": "Artist 10", "spotify": "https://open.spotify.com/track/80_10" }
  ],

  "rock-classics": [
    { "difficulty": 1, "type": "guess-title", "song": "Song 1", "artist": "Artist 1", "spotify": "https://open.spotify.com/track/RC1" },
    { "difficulty": 2, "type": "guess-artist", "song": "Song 2", "artist": "Artist 2", "spotify": "https://open.spotify.com/track/RC2" },
    { "difficulty": 3, "type": "continue-lyrics", "song": "Song 3", "artist": "Artist 3", "spotify": "https://open.spotify.com/track/RC3" },
    { "difficulty": 4, "type": "guess-title", "song": "Song 4", "artist": "Artist 4", "spotify": "https://open.spotify.com/track/RC4" },
    { "difficulty": 5, "type": "guess-artist", "song": "Song 5", "artist": "Artist 5", "spotify": "https://open.spotify.com/track/RC5" },
    { "difficulty": 6, "type": "continue-lyrics", "song": "Song 6", "artist": "Artist 6", "spotify": "https://open.spotify.com/track/RC6" },
    { "difficulty": 7, "type": "guess-title", "song": "Song 7", "artist": "Artist 7", "spotify": "https://open.spotify.com/track/RC7" },
    { "difficulty": 8, "type": "guess-artist", "song": "Song 8", "artist": "Artist 8", "spotify": "https://open.spotify.com/track/RC8" },
    { "difficulty": 9, "type": "continue-lyrics", "song": "Song 9", "artist": "Artist 9", "spotify": "https://open.spotify.com/track/RC9" },
    { "difficulty": 10, "type": "guess-title", "song": "Song 10", "artist": "Artist 10", "spotify": "https://open.spotify.com/track/RC10" }
  ],

  "movie-soundtracks": [
    { "difficulty": 1, "type": "guess-title", "song": "Song 1", "artist": "Artist 1", "spotify": "https://open.spotify.com/track/MS1" },
    { "difficulty": 2, "type": "guess-artist", "song": "Song 2", "artist": "Artist 2", "spotify": "https://open.spotify.com/track/MS2" },
    { "difficulty": 3, "type": "continue-lyrics", "song": "Song 3", "artist": "Artist 3", "spotify": "https://open.spotify.com/track/MS3" },
    { "difficulty": 4, "type": "guess-title", "song": "Song 4", "artist": "Artist 4", "spotify": "https://open.spotify.com/track/MS4" },
    { "difficulty": 5, "type": "guess-artist", "song": "Song 5", "artist": "Artist 5", "spotify": "https://open.spotify.com/track/MS5" },
    { "difficulty": 6, "type": "continue-lyrics", "song": "Song 6", "artist": "Artist 6", "spotify": "https://open.spotify.com/track/MS6" },
    { "difficulty": 7, "type": "guess-title", "song": "Song 7", "artist": "Artist 7", "spotify": "https://open.spotify.com/track/MS7" },
    { "difficulty": 8, "type": "guess-artist", "song": "Song 8", "artist": "Artist 8", "spotify": "https://open.spotify.com/track/MS8" },
    { "difficulty": 9, "type": "continue-lyrics", "song": "Song 9", "artist": "Artist 9", "spotify": "https://open.spotify.com/track/MS9" },
    { "difficulty": 10, "type": "guess-title", "song": "Song 10", "artist": "Artist 10", "spotify": "https://open.spotify.com/track/MS10" }
  ],

  "party-anthems": [
    { "difficulty": 1, "type": "guess-title", "song": "Song 1", "artist": "Artist 1", "spotify": "https://open.spotify.com/track/PA1" },
    { "difficulty": 2, "type": "guess-artist", "song": "Song 2", "artist": "Artist 2", "spotify": "https://open.spotify.com/track/PA2" },
    { "difficulty": 3, "type": "continue-lyrics", "song": "Song 3", "artist": "Artist 3", "spotify": "https://open.spotify.com/track/PA3" },
    { "difficulty": 4, "type": "guess-title", "song": "Song 4", "artist": "Artist 4", "spotify": "https://open.spotify.com/track/PA4" },
    { "difficulty": 5, "type": "guess-artist", "song": "Song 5", "artist": "Artist 5", "spotify": "https://open.spotify.com/track/PA5" },
    { "difficulty": 6, "type": "continue-lyrics", "song": "Song 6", "artist": "Artist 6", "spotify": "https://open.spotify.com/track/PA6" },
    { "difficulty": 7, "type": "guess-title", "song": "Song 7", "artist": "Artist 7", "spotify": "https://open.spotify.com/track/PA7" },
    { "difficulty": 8, "type": "guess-artist", "song": "Song 8", "artist": "Artist 8", "spotify": "https://open.spotify.com/track/PA8" },
    { "difficulty": 9, "type": "continue-lyrics", "song": "Song 9", "artist": "Artist 9", "spotify": "https://open.spotify.com/track/PA9" },
    { "difficulty": 10, "type": "guess-title", "song": "Song 10", "artist": "Artist 10", "spotify": "https://open.spotify.com/track/PA10" }
  ]
};
let selectedCategory = null;

// ---------------------------------------------------------
// INITIAL LOAD
// ---------------------------------------------------------

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeSpotifyAuth();
  renderCategories();
  
  // Setup persistent New Challenge button
  const newChallengePersistentBtn = document.getElementById('btn-new-challenge-persistent');
  if (newChallengePersistentBtn) {
    newChallengePersistentBtn.onclick = () => renderCategories();
  }
});

// ---------------------------------------------------------
// SPOTIFY AUTHENTICATION & PLAYBACK SDK
// ---------------------------------------------------------

function initializeSpotifyAuth() {
  // Check if we have an access token in the URL (after redirect)
  const urlParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = urlParams.get('access_token');
  
  if (accessToken) {
    spotifyApi.accessToken = accessToken;
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
    // Initialize Spotify Web Playback SDK
    initializeSpotifyPlayer();
  } else {
    // Check if we have a stored token
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) {
      spotifyApi.accessToken = storedToken;
      initializeSpotifyPlayer();
    }
  }
}

function authenticateSpotify() {
  const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${SPOTIFY_CONFIG.clientId}&` +
    `response_type=token&` +
    `redirect_uri=${encodeURIComponent(SPOTIFY_CONFIG.redirectUri)}&` +
    `scope=${encodeURIComponent(SPOTIFY_CONFIG.scopes.join(' '))}`;
  
  window.location.href = authUrl;
}

function initializeSpotifyPlayer() {
  if (!spotifyApi.accessToken) return;
  
  // Store token for future use
  localStorage.setItem('spotify_access_token', spotifyApi.accessToken);
  
  // Load Spotify Web Playback SDK
  if (!window.Spotify) {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.onload = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        createSpotifyPlayer();
      };
    };
    document.head.appendChild(script);
  } else {
    createSpotifyPlayer();
  }
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
    spotifyApi.accessToken = null;
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

// Render category buttons
function renderCategories() {
  categoriesContainer.innerHTML = "";
  for (const category in songsData) {
    const btn = document.createElement("button");
    btn.textContent = formatCategoryName(category);
    btn.onclick = () => selectCategory(category);
    categoriesContainer.appendChild(btn);
  }

  // Clear any previous challenge content
  challengeContainer.innerHTML = "";
  difficultiesContainer.innerHTML = "";
  
  // Reset selected category
  selectedCategory = null;

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
    btn.onclick = () => showChallenge(challenge);
    difficultiesContainer.appendChild(btn);
  });

  showSection(difficultiesContainer);
  hideSection(challengeContainer);
}

// Render the selected challenge
function showChallenge(challenge) {
  challengeContainer.innerHTML = `
    <h2>Challenge - Difficulty ${challenge.difficulty}</h2>
    <p class="challenge-type">Type: ${formatChallengeType(challenge.type)}</p>
    
    <div class="spotify-controls">
      <button id="btn-reveal" class="control-button reveal-button">🔍 Reveal</button>
    </div>
    
    <div id="song-info" class="song-info hidden">
      <div class="loading">Loading song information...</div>
    </div>
    
    <div id="spotify-player" class="spotify-player"></div>
  `;

  // Immediately load the Spotify player with overlay
  loadSpotifyPlayer(challenge);
  setupChallengeControls(challenge);

  showSection(challengeContainer);
}

// ---------------------------------------------------------
// EVENT HANDLERS
// ---------------------------------------------------------

function selectCategory(category) {
  selectedCategory = category;
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

// Load Spotify player with Web Playback SDK
async function loadSpotifyPlayer(challenge) {
  const playerDiv = document.getElementById("spotify-player");
  const trackId = extractSpotifyTrackId(challenge.spotify);
  
  if (!trackId) {
    playerDiv.innerHTML = '<div class="error">Invalid Spotify URL</div>';
    return;
  }
  
  // Check if user is authenticated
  if (!spotifyApi.accessToken) {
    playerDiv.innerHTML = `
      <div class="auth-required">
        <h3>🎵 Spotify Authentication Required</h3>
        <p>To play full songs with complete control, please connect to Spotify:</p>
        <button onclick="authenticateSpotify()" class="auth-button">
          🎵 Connect to Spotify
        </button>
        <p class="auth-note">This will allow you to play, pause, restart, and control the music properly.</p>
      </div>
    `;
    return;
  }
  
  // Create our custom player with overlay
  playerDiv.innerHTML = `
    <div class="sdk-player-container">
      <div class="player-controls">
        <button id="play-btn" class="control-btn play" onclick="playTrack('${challenge.spotify}')">▶️</button>
        <button id="pause-btn" class="control-btn pause" onclick="pauseTrack()">⏸️</button>
        <button id="restart-btn" class="control-btn restart" onclick="restartTrack()">⏮️</button>
        <div class="volume-container">
          <span>🔊</span>
          <input type="range" id="volume-slider" min="0" max="100" value="70" onchange="setVolume(this.value)">
        </div>
      </div>
      
      <div class="player-overlay">
        <div class="mystery-content">
          <div class="mystery-icon">🎵</div>
          <p>Ready to play...</p>
          <p class="mystery-hint">Click play to start the music!</p>
        </div>
      </div>
      
      <div class="player-status" id="player-status">
        Ready to play
      </div>
    </div>
  `;
}

// Setup challenge control buttons
function setupChallengeControls(challenge) {
  const revealBtn = document.getElementById("btn-reveal");
  const playerDiv = document.getElementById("spotify-player");
  
  revealBtn.onclick = () => {
    revealSongInfo(challenge);
    revealSpotifyPlayer(playerDiv, challenge.spotify);
  };
}




// Reveal the Spotify player by removing the overlay
function revealSpotifyPlayer(playerDiv, spotifyUrl) {
  const overlay = playerDiv.querySelector('.player-overlay');
  const container = playerDiv.querySelector('.sdk-player-container');
  
  if (overlay) {
    overlay.style.display = 'none';
  }
  
  if (container) {
    container.classList.add('revealed');
  }
}

// Reveal song information
async function revealSongInfo(challenge) {
  const songInfoDiv = document.getElementById("song-info");
  songInfoDiv.classList.remove("hidden");
  
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
      displayFallbackInfo(challenge, trackId);
    }
    
  } catch (error) {
    console.error('Error revealing song info:', error);
    songInfoDiv.innerHTML = `
      <div class="error">
        <p>❌ Unable to load song information</p>
        <p class="error-detail">Showing basic info instead</p>
      </div>
    `;
    
    // Even on error, show basic challenge info
    setTimeout(() => displayFallbackInfo(challenge, null), 1000);
  }
}

// Display song information from Spotify oEmbed
function displaySongInfo(data, challenge) {
  const songInfoDiv = document.getElementById("song-info");
  
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
  
  songInfoDiv.innerHTML = `
    <div class="song-details">
      <h3>🎵 Song Revealed!</h3>
      ${thumbnail ? `<img src="${thumbnail}" alt="Album cover" class="album-cover">` : ''}
      <div class="song-meta">
        <p><strong>Title:</strong> ${songTitle}</p>
        <p><strong>Artist:</strong> ${artistName}</p>
        <p><strong>Source:</strong> Spotify</p>
      </div>
    </div>
  `;
}

// Fallback song info display
function displayFallbackInfo(challenge, trackId) {
  const songInfoDiv = document.getElementById("song-info");
  
  // Check if this is a placeholder URL
  const isPlaceholder = trackId && (trackId.startsWith('STUB') || trackId.startsWith('IT') || trackId.startsWith('80_') || trackId.startsWith('RC') || trackId.startsWith('MS') || trackId.startsWith('PA'));
  
  songInfoDiv.innerHTML = `
    <div class="song-details">
      <h3>🎵 Song Revealed!</h3>
      ${isPlaceholder ? '<div class="warning">⚠️ This is placeholder data - real Spotify data not available</div>' : ''}
      <div class="song-meta">
        <p><strong>Title:</strong> ${challenge.song || "Unknown Title"}</p>
        <p><strong>Artist:</strong> ${challenge.artist || "Unknown Artist"}</p>
        ${trackId ? `<p><strong>Track ID:</strong> ${trackId}</p>` : ''}
        ${!isPlaceholder ? `<p><a href="${challenge.spotify}" target="_blank">🔗 Open in Spotify</a></p>` : '<p>🔗 Placeholder URL - no real Spotify link</p>'}
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

// Show error message
function showError(message) {
  const songInfoDiv = document.getElementById("song-info");
  songInfoDiv.classList.remove("hidden");
  songInfoDiv.innerHTML = `
    <div class="error">
      <p>❌ ${message}</p>
    </div>
  `;
}

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
