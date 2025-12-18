// Music Quiz Editor - Frontend JavaScript

let currentSongsData = {};
let currentPlaylists = [];
let currentPlaylistTracks = [];
let selectedCategory = null;
let selectedDifficulty = null;

// Categories configuration
const CATEGORIES = ['classic', 'italian', 'sing-along', 'movie-soundtrack'];
const DIFFICULTIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Music Quiz Editor initialized');
    checkAuthStatus();
    loadSongsData();
});

// Check URL parameters for auth status
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('auth') === 'success') {
    showMessage('✅ Successfully connected to Spotify!', 'success');
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
}
if (urlParams.get('error')) {
    showMessage('❌ Authentication failed: ' + urlParams.get('error'), 'error');
    window.history.replaceState({}, document.title, window.location.pathname);
}

// Authentication functions
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth-status');
        const data = await response.json();
        
        if (data.authenticated) {
            showAuthenticatedState();
            loadPlaylists();
        } else {
            showUnauthenticatedState();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        showUnauthenticatedState();
    }
}

function showAuthenticatedState() {
    document.getElementById('auth-status').textContent = '✅ Connected to Spotify';
    document.getElementById('auth-status').className = 'authenticated';
    document.getElementById('auth-btn').style.display = 'none';
    document.getElementById('auth-needed').style.display = 'none';
    document.getElementById('editor-interface').style.display = 'block';
}

function showUnauthenticatedState() {
    document.getElementById('auth-status').textContent = '❌ Not connected';
    document.getElementById('auth-status').className = 'error';
    document.getElementById('auth-btn').style.display = 'inline-block';
    document.getElementById('auth-needed').style.display = 'block';
    document.getElementById('editor-interface').style.display = 'none';
}

function authenticateSpotify() {
    window.location.href = '/auth';
}

// Playlist functions
async function loadPlaylists() {
    try {
        const response = await fetch('/api/playlists');
        const data = await response.json();
        
        currentPlaylists = data.items || [];
        populatePlaylistSelector();
    } catch (error) {
        console.error('Error loading playlists:', error);
        showMessage('Failed to load playlists', 'error');
    }
}

function populatePlaylistSelector() {
    const select = document.getElementById('playlist-select');
    select.innerHTML = '<option value="">Select a playlist...</option>';
    
    currentPlaylists.forEach(playlist => {
        const option = document.createElement('option');
        option.value = playlist.id;
        option.textContent = `${playlist.name} (${playlist.tracks.total} tracks)`;
        select.appendChild(option);
    });
}

async function loadPlaylistTracks() {
    const playlistId = document.getElementById('playlist-select').value;
    if (!playlistId) return;
    
    const playlist = currentPlaylists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    try {
        showMessage('Loading playlist tracks...', 'info');
        const response = await fetch(`/api/playlists/${playlistId}/tracks`);
        const data = await response.json();
        
        currentPlaylistTracks = data.items.map(item => item.track).filter(track => track && track.name);
        
        showMessage(`Loaded ${currentPlaylistTracks.length} tracks from ${playlist.name}`, 'success');
    } catch (error) {
        console.error('Error loading playlist tracks:', error);
        showMessage('Failed to load playlist tracks', 'error');
    }
}

// Songs data functions
async function loadSongsData() {
    try {
        const response = await fetch('/api/songs');
        currentSongsData = await response.json();
        renderSongsEditor();
        console.log('Songs data loaded:', currentSongsData);
    } catch (error) {
        console.error('Error loading songs data:', error);
        showMessage('Failed to load songs data', 'error');
    }
}

function renderSongsEditor() {
    const container = document.getElementById('songs-grid');
    container.innerHTML = '';
    
    CATEGORIES.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-section';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = formatCategoryName(category);
        categoryDiv.appendChild(categoryTitle);
        
        const difficultiesGrid = document.createElement('div');
        difficultiesGrid.className = 'difficulties-grid';
        
        DIFFICULTIES.forEach(difficulty => {
            const difficultyDiv = document.createElement('div');
            difficultyDiv.className = 'difficulty-item';
            
            const currentSong = getCurrentSong(category, difficulty);
            if (currentSong) {
                difficultyDiv.classList.add('has-song');
            }
            
            difficultyDiv.innerHTML = `
                <div class="difficulty-number">${difficulty}</div>
                <div class="song-info ${currentSong ? 'has-song' : ''}">
                    ${currentSong ? 
                        `<strong>${currentSong.song}</strong><br>by ${currentSong.artist}` :
                        '<em>No song selected</em>'
                    }
                </div>
                <button onclick="selectTrackForSlot('${category}', ${difficulty})">
                    ${currentSong ? 'Change' : 'Select'} Track
                </button>
            `;
            
            difficultiesGrid.appendChild(difficultyDiv);
        });
        
        categoryDiv.appendChild(difficultiesGrid);
        container.appendChild(categoryDiv);
    });
}

function getCurrentSong(category, difficulty) {
    if (!currentSongsData[category]) return null;
    return currentSongsData[category].find(song => song.difficulty === difficulty);
}

function formatCategoryName(str) {
    return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Track selection functions
function selectTrackForSlot(category, difficulty) {
    if (currentPlaylistTracks.length === 0) {
        showMessage('Please load a playlist first', 'error');
        return;
    }
    
    selectedCategory = category;
    selectedDifficulty = difficulty;
    
    showTrackSelectionModal();
}

function showTrackSelectionModal() {
    const modal = document.getElementById('track-modal');
    const categorySpan = document.getElementById('modal-category');
    const difficultySpan = document.getElementById('modal-difficulty');
    const tracksContainer = document.getElementById('modal-tracks');
    
    categorySpan.textContent = formatCategoryName(selectedCategory);
    difficultySpan.textContent = selectedDifficulty;
    
    tracksContainer.innerHTML = '';
    currentPlaylistTracks.forEach((track, index) => {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'modal-track-item';
        trackDiv.innerHTML = `
            <div class="modal-track-info">
                <h4>${track.name}</h4>
                <p>by ${track.artists.map(a => a.name).join(', ')} • ${track.album.name}</p>
            </div>
            <button onclick="assignTrackToSlot(${index})">Select</button>
        `;
        tracksContainer.appendChild(trackDiv);
    });
    
    modal.style.display = 'flex';
}

function assignTrackToSlot(trackIndex) {
    const track = currentPlaylistTracks[trackIndex];
    if (!track) return;
    
    // Ensure category array exists
    if (!currentSongsData[selectedCategory]) {
        currentSongsData[selectedCategory] = [];
    }
    
    // Remove existing song with this difficulty
    currentSongsData[selectedCategory] = currentSongsData[selectedCategory].filter(
        song => song.difficulty !== selectedDifficulty
    );
    
    // Add new song
    const newSong = {
        difficulty: selectedDifficulty,
        type: 'guess the title and artist',
        song: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        spotify: track.external_urls.spotify
    };
    
    currentSongsData[selectedCategory].push(newSong);
    
    // Sort by difficulty
    currentSongsData[selectedCategory].sort((a, b) => a.difficulty - b.difficulty);
    
    closeTrackModal();
    renderSongsEditor();
    
    showMessage(`Assigned "${track.name}" to ${formatCategoryName(selectedCategory)} difficulty ${selectedDifficulty}`, 'success');
}

function closeTrackModal() {
    document.getElementById('track-modal').style.display = 'none';
    selectedCategory = null;
    selectedDifficulty = null;
}

// Save function
async function saveSongs() {
    const saveBtn = document.getElementById('save-btn');
    const statusDiv = document.getElementById('save-status');
    
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
        const response = await fetch('/api/songs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentSongsData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            statusDiv.textContent = '✅ Songs database saved successfully!';
            statusDiv.className = 'save-status success';
            showMessage('Songs database saved successfully!', 'success');
        } else {
            throw new Error(result.error || 'Save failed');
        }
    } catch (error) {
        console.error('Error saving songs:', error);
        statusDiv.textContent = '❌ Failed to save: ' + error.message;
        statusDiv.className = 'save-status error';
        showMessage('Failed to save songs database', 'error');
    }
    
    saveBtn.disabled = false;
    saveBtn.textContent = '💾 Save Songs Database';
    
    // Clear status after 5 seconds
    setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'save-status';
    }, 5000);
}

// Utility functions
function showMessage(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // You could implement a toast notification system here
    const authStatus = document.getElementById('auth-status');
    const originalText = authStatus.textContent;
    const originalClass = authStatus.className;
    
    authStatus.textContent = message;
    authStatus.className = type === 'error' ? 'error' : type === 'success' ? 'authenticated' : '';
    
    setTimeout(() => {
        authStatus.textContent = originalText;
        authStatus.className = originalClass;
    }, 3000);
}

// Modal event listeners
document.addEventListener('click', function(e) {
    if (e.target.id === 'track-modal') {
        closeTrackModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('track-modal').style.display === 'flex') {
        closeTrackModal();
    }
});