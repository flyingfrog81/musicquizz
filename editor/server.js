require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const open = require('open');
const fetch = require('node-fetch');

// Import shared Spotify auth module
const {
  generateSpotifyAuthUrl,
  exchangeCodeForToken,
  getUserPlaylists,
  getPlaylistTracks,
  formatTrackForSongs
} = require('../spotify-auth.js');

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;

// Validate required environment variables
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing required environment variables!');
  console.error('Please create a .env file based on .env.example');
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store tokens in memory (for local development only)
let spotifyTokens = {
  access_token: null,
  refresh_token: null,
  expires_at: null
};

// Routes

// Serve the editor interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Spotify authentication
app.get('/auth', (req, res) => {
  const authUrl = generateSpotifyAuthUrl(REDIRECT_URI, 'editor');
  res.redirect(authUrl);
});

// Handle Spotify callback
app.get('/callback', async (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    console.error('Spotify auth error:', error);
    return res.redirect('/?error=' + encodeURIComponent(error));
  }
  
  try {
    // Server-side token exchange with client secret
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
    
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID
    });

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
      },
      body: params.toString()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Token exchange failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const tokenData = await response.json();
    
    spotifyTokens = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000)
    };
    
    console.log('✅ Spotify authentication successful');
    res.redirect('/?auth=success');
  } catch (error) {
    console.error('Token exchange failed:', error);
    res.redirect('/?error=' + encodeURIComponent('Token exchange failed'));
  }
});

// API: Check authentication status
app.get('/api/auth-status', (req, res) => {
  const isAuthenticated = spotifyTokens.access_token && Date.now() < spotifyTokens.expires_at;
  res.json({ authenticated: isAuthenticated });
});

// API: Get user's playlists
app.get('/api/playlists', async (req, res) => {
  if (!spotifyTokens.access_token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const playlists = await getUserPlaylists(spotifyTokens.access_token);
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// API: Get playlist tracks
app.get('/api/playlists/:id/tracks', async (req, res) => {
  if (!spotifyTokens.access_token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const tracks = await getPlaylistTracks(spotifyTokens.access_token, req.params.id);
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    res.status(500).json({ error: 'Failed to fetch playlist tracks' });
  }
});

// API: Load current songs data
app.get('/api/songs', async (req, res) => {
  try {
    const songsPath = path.join(__dirname, '..', 'data', 'songs.json');
    const songsData = await fs.readFile(songsPath, 'utf8');
    res.json(JSON.parse(songsData));
  } catch (error) {
    console.error('Error loading songs:', error);
    res.status(500).json({ error: 'Failed to load songs data' });
  }
});

// API: Save songs data
app.post('/api/songs', async (req, res) => {
  try {
    const songsPath = path.join(__dirname, '..', 'data', 'songs.json');
    const songsData = JSON.stringify(req.body, null, 2);
    await fs.writeFile(songsPath, songsData);
    console.log('✅ Songs data saved successfully');
    res.json({ success: true, message: 'Songs data saved successfully' });
  } catch (error) {
    console.error('Error saving songs:', error);
    res.status(500).json({ error: 'Failed to save songs data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Music Quiz Editor running at http://127.0.0.1:${PORT}`);
  console.log('🚀 Opening editor in your browser...');
  
  // Automatically open the editor in the browser
  setTimeout(() => {
    open(`http://127.0.0.1:${PORT}`);
  }, 1000);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Music Quiz Editor...');
  process.exit(0);
});