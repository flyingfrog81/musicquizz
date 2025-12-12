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
    <h2>${challenge.songTitle || challenge.song}</h2>
    <p class="challenge-type">Type: ${formatChallengeType(challenge.type)}</p>
    <button id="btn-play-spotify" class="spotify-button">🎵 Play on Spotify</button>
    <button id="btn-back-difficulties">Back to difficulties</button>
  `;

  document.getElementById("btn-play-spotify").onclick = () => {
    window.open(challenge.spotify, '_blank');
  };

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
