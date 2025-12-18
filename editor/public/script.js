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
            difficultyDiv.setAttribute('data-category', category);
            difficultyDiv.setAttribute('data-difficulty', difficulty);
            
            const currentSong = getCurrentSong(category, difficulty);
            if (currentSong) {
                difficultyDiv.classList.add('has-song');
                // Make only items with songs draggable
                difficultyDiv.draggable = true;
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
            
            // Add drag event listeners if song exists
            if (currentSong) {
                setupDragAndDrop(difficultyDiv);
            }
            
            // Add drop zone listeners for all slots
            setupDropZone(difficultyDiv);
            
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
    if (!str) return 'Unknown Category';
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
    if (!track || !selectedCategory || !selectedDifficulty) {
        console.error('Missing track, category, or difficulty data');
        return;
    }
    
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
    showMessage('💡 Tip: You can now drag and drop this song to reorder difficulties!', 'info');
    
    // Autosave changes
    autoSave();
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

// Drag and Drop functions
let draggedElement = null;
let draggedSong = null;

function setupDragAndDrop(element) {
    element.addEventListener('dragstart', function(e) {
        draggedElement = this;
        const category = this.getAttribute('data-category');
        const difficulty = parseInt(this.getAttribute('data-difficulty'));
        draggedSong = getCurrentSong(category, difficulty);
        
        this.classList.add('dragging');
        
        // Set drag data
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
        
        console.log(`Dragging: ${draggedSong?.song} from ${category} difficulty ${difficulty}`);
    });
    
    element.addEventListener('dragend', function(e) {
        this.classList.remove('dragging');
        draggedElement = null;
        draggedSong = null;
    });
}

function setupDropZone(element) {
    element.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        if (this !== draggedElement && draggedElement) {
            const targetCategory = this.getAttribute('data-category');
            const sourceCategory = draggedElement.getAttribute('data-category');
            
            // Only show effects for same category
            if (targetCategory === sourceCategory) {
                this.classList.add('drag-over');
                showMovementPreview(targetCategory, 
                    parseInt(draggedElement.getAttribute('data-difficulty')),
                    parseInt(this.getAttribute('data-difficulty'))
                );
            }
        }
    });
    
    element.addEventListener('dragleave', function(e) {
        this.classList.remove('drag-over');
        clearMovementPreview();
    });
    
    element.addEventListener('drop', function(e) {
        e.preventDefault();
        clearAllDragStyles();
        
        if (this === draggedElement || !draggedSong) {
            return;
        }
        
        const targetCategory = this.getAttribute('data-category');
        const targetDifficulty = parseInt(this.getAttribute('data-difficulty'));
        const sourceCategory = draggedElement.getAttribute('data-category');
        const sourceDifficulty = parseInt(draggedElement.getAttribute('data-difficulty'));
        
        // Only allow drops within the same category
        if (targetCategory !== sourceCategory) {
            showMessage('Can only reorder songs within the same category', 'error');
            return;
        }
        
        // Get the existing song at target position (if any)
        const targetSong = getCurrentSong(targetCategory, targetDifficulty);
        
        let changedDifficulties = [];
        
        if (targetSong) {
            // Swap songs - both positions changed
            swapSongs(sourceCategory, sourceDifficulty, targetCategory, targetDifficulty);
            changedDifficulties = [sourceDifficulty, targetDifficulty];
            showMessage(`Swapped "${draggedSong.song}" (difficulty ${sourceDifficulty}) with "${targetSong.song}" (difficulty ${targetDifficulty})`, 'success');
        } else {
            // Move song to empty slot - only one position changed
            moveSong(sourceCategory, sourceDifficulty, targetCategory, targetDifficulty);
            changedDifficulties = [targetDifficulty];
            showMessage(`Moved "${draggedSong.song}" from difficulty ${sourceDifficulty} to ${targetDifficulty}`, 'success');
        }
        
        renderSongsEditor();
        
        // Highlight changed songs after render
        setTimeout(() => highlightChangedSongs(sourceCategory, changedDifficulties), 100);
        
        // Autosave changes
        autoSave();
    });
}

function swapSongs(sourceCat, sourceDiff, targetCat, targetDiff) {
    if (!currentSongsData[sourceCat] || !currentSongsData[targetCat]) return;
    
    const sourceIndex = currentSongsData[sourceCat].findIndex(song => song.difficulty === sourceDiff);
    const targetIndex = currentSongsData[targetCat].findIndex(song => song.difficulty === targetDiff);
    
    if (sourceIndex === -1 || targetIndex === -1) return;
    
    // Swap difficulty values
    const tempDifficulty = currentSongsData[sourceCat][sourceIndex].difficulty;
    currentSongsData[sourceCat][sourceIndex].difficulty = currentSongsData[targetCat][targetIndex].difficulty;
    currentSongsData[targetCat][targetIndex].difficulty = tempDifficulty;
    
    // Sort arrays to maintain order
    currentSongsData[sourceCat].sort((a, b) => a.difficulty - b.difficulty);
    if (sourceCat !== targetCat) {
        currentSongsData[targetCat].sort((a, b) => a.difficulty - b.difficulty);
    }
}

function moveSong(sourceCat, sourceDiff, targetCat, targetDiff) {
    if (!currentSongsData[sourceCat]) return;
    
    const sourceIndex = currentSongsData[sourceCat].findIndex(song => song.difficulty === sourceDiff);
    if (sourceIndex === -1) return;
    
    // Update difficulty of the moved song
    currentSongsData[sourceCat][sourceIndex].difficulty = targetDiff;
    
    // Sort to maintain order
    currentSongsData[sourceCat].sort((a, b) => a.difficulty - b.difficulty);
}



function showMovementPreview(category, sourceDiff, targetDiff) {
    clearMovementPreview();
    
    if (sourceDiff === targetDiff) return;
    
    // Find target item and show it will receive the song
    const targetItem = document.querySelector(`[data-category="${category}"][data-difficulty="${targetDiff}"]`);
    if (targetItem) {
        if (targetItem.classList.contains('has-song')) {
            targetItem.classList.add('will-swap');
        }
    }
}

function clearMovementPreview() {
    document.querySelectorAll('.will-swap').forEach(el => {
        el.classList.remove('will-swap');
    });
}

function clearAllDragStyles() {
    document.querySelectorAll('.drag-over, .will-swap').forEach(el => {
        el.classList.remove('drag-over', 'will-swap');
    });
}

function highlightChangedSongs(category, difficulties) {
    difficulties.forEach(difficulty => {
        const element = document.querySelector(`[data-category="${category}"][data-difficulty="${difficulty}"]`);
        if (element && element.classList.contains('has-song')) {
            element.classList.add('just-changed');
            
            // Remove highlight after animation completes
            setTimeout(() => {
                element.classList.remove('just-changed');
            }, 200);
        }
    });
}



// Autosave functionality
let autoSaveTimeout = null;

function autoSave() {
    // Clear any pending autosave
    if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
    }
    
    // Debounce autosave by 1 second
    autoSaveTimeout = setTimeout(async () => {
        try {
            const response = await fetch('/api/songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentSongsData)
            });
            
            if (response.ok) {
                console.log('✅ Auto-saved songs database');
                // Show subtle success indicator
                const saveStatus = document.getElementById('save-status');
                if (saveStatus) {
                    saveStatus.textContent = '✅ Auto-saved';
                    saveStatus.className = 'save-status success';
                    setTimeout(() => {
                        saveStatus.textContent = '';
                        saveStatus.className = 'save-status';
                    }, 2000);
                }
            } else {
                console.warn('⚠️ Auto-save failed');
            }
        } catch (error) {
            console.error('Auto-save error:', error);
        }
    }, 1000);
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