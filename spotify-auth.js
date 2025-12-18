// Shared Spotify authentication configuration and utilities
// This module can be used by both the main app and the editor

const SPOTIFY_CONFIG = {
  clientId: 'aef766288e8e41618cd90b59328a81d3',
  scopes: [
    'streaming',
    'user-read-email', 
    'user-read-private',
    'user-modify-playback-state',
    'user-read-playback-state',
    'playlist-read-private',
    'playlist-read-collaborative'
  ]
};

// Generate Spotify authorization URL
function generateSpotifyAuthUrl(redirectUri, state = '') {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CONFIG.clientId,
    scope: SPOTIFY_CONFIG.scopes.join(' '),
    redirect_uri: redirectUri,
    state: state,
    show_dialog: 'true' // Always show auth dialog for editor
  });
  
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Exchange authorization code for access token
async function exchangeCodeForToken(code, redirectUri) {
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';
  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: SPOTIFY_CONFIG.clientId,
    // Note: For production, client_secret should be handled server-side
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Token exchange error:', error);
    throw error;
  }
}

// Check if token is expired
function isTokenExpired(expirationTime) {
  return Date.now() >= expirationTime;
}

// Get user's playlists
async function getUserPlaylists(accessToken) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch playlists: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
}

// Get playlist tracks
async function getPlaylistTracks(accessToken, playlistId) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist tracks: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    throw error;
  }
}

// Extract track info for songs.json format
function formatTrackForSongs(track, type = 'guess the title and artist') {
  return {
    type: type,
    song: track.name,
    artist: track.artists.map(artist => artist.name).join(', '),
    spotify: track.external_urls.spotify
  };
}

// For Node.js (editor)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SPOTIFY_CONFIG,
    generateSpotifyAuthUrl,
    exchangeCodeForToken,
    isTokenExpired,
    getUserPlaylists,
    getPlaylistTracks,
    formatTrackForSongs
  };
}

// For browser (main app) - attach to window
if (typeof window !== 'undefined') {
  window.SpotifyAuth = {
    SPOTIFY_CONFIG,
    generateSpotifyAuthUrl,
    exchangeCodeForToken,
    isTokenExpired,
    getUserPlaylists,
    getPlaylistTracks,
    formatTrackForSongs
  };
}