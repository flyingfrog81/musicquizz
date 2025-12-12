// ---------------------------------------------------------
// DOM ELEMENTS
// ---------------------------------------------------------

const categoriesContainer  = document.getElementById("categories");
const difficultiesContainer = document.getElementById("difficulties");
const challengeContainer    = document.getElementById("challenge");

// ---------------------------------------------------------
// STATE
// ---------------------------------------------------------

let songsData = {
  "sing-along": [
    { "difficulty": 1, "type": "guess-title", "song": "Song 1", "artist": "Artist 1", "spotify": "https://open.spotify.com/track/7037bX3jdaUWUAXL12CHGy?si=8f032fd38d8443e8" },
    { "difficulty": 2, "type": "guess-artist", "song": "Song 2", "artist": "Artist 2", "spotify": "https://open.spotify.com/track/STUB2" },
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
  renderCategories();
});

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
      <button id="btn-play" class="control-button play-button">▶️ Play</button>
      <button id="btn-pause" class="control-button pause-button">⏸️ Pause</button>
      <button id="btn-reveal" class="control-button reveal-button">🔍 Reveal</button>
    </div>
    
    <div id="song-info" class="song-info hidden">
      <div class="loading">Loading song information...</div>
    </div>
    
    <div id="spotify-player" class="spotify-player"></div>
    
    <button id="btn-back-difficulties">Back to difficulties</button>
  `;

  setupChallengeControls(challenge);
  document.getElementById("btn-back-difficulties").onclick = () => renderDifficulties(selectedCategory);

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

// Setup challenge control buttons
function setupChallengeControls(challenge) {
  const playBtn = document.getElementById("btn-play");
  const pauseBtn = document.getElementById("btn-pause");
  const revealBtn = document.getElementById("btn-reveal");
  const playerDiv = document.getElementById("spotify-player");
  
  playBtn.onclick = () => playSpotifyTrack(challenge.spotify, playerDiv);
  pauseBtn.onclick = () => pauseSpotifyTrack(playerDiv);
  revealBtn.onclick = () => revealSongInfo(challenge);
}

// Play Spotify track in embedded player
function playSpotifyTrack(spotifyUrl, playerDiv) {
  const trackId = extractSpotifyTrackId(spotifyUrl);
  if (!trackId) {
    showError("Invalid Spotify URL");
    return;
  }
  
  // Create embedded Spotify player
  const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&autoplay=1&theme=0`;
  
  playerDiv.innerHTML = `
    <iframe 
      src="${embedUrl}" 
      width="100%" 
      height="152" 
      frameborder="0" 
      allowtransparency="true" 
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy">
    </iframe>
  `;
  
  updateButtonStates('playing');
}

// Pause Spotify track
function pauseSpotifyTrack(playerDiv) {
  // Remove the iframe to stop playback
  playerDiv.innerHTML = '<div class="player-stopped">⏹️ Playback stopped</div>';
  updateButtonStates('paused');
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
      if (!response.ok) throw new Error('oEmbed API failed');
      
      const data = await response.json();
      console.log('Spotify oEmbed data:', data); // Debug log to see what we get
      displaySongInfo(data, challenge);
    } catch (apiError) {
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
  
  songInfoDiv.innerHTML = `
    <div class="song-details">
      <h3>🎵 Song Revealed!</h3>
      <div class="song-meta">
        <p><strong>Title:</strong> ${challenge.song || "Unknown Title"}</p>
        <p><strong>Artist:</strong> ${challenge.artist || "Unknown Artist"}</p>
        ${trackId ? `<p><strong>Track ID:</strong> ${trackId}</p>` : ''}
        <p><a href="${challenge.spotify}" target="_blank">🔗 Open in Spotify</a></p>
      </div>
    </div>
  `;
}

// Update button visual states
function updateButtonStates(state) {
  const playBtn = document.getElementById("btn-play");
  const pauseBtn = document.getElementById("btn-pause");
  
  // Reset all button states
  playBtn.classList.remove('active');
  pauseBtn.classList.remove('active');
  
  // Set active state
  if (state === 'playing') {
    playBtn.classList.add('active');
    playBtn.textContent = '▶️ Playing...';
    pauseBtn.textContent = '⏸️ Pause';
  } else if (state === 'paused') {
    pauseBtn.classList.add('active');
    playBtn.textContent = '▶️ Play';
    pauseBtn.textContent = '⏸️ Paused';
  }
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
