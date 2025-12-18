// Vercel serverless function to handle Spotify OAuth
// This file should be placed at: /api/auth.js

module.exports = async function handler(req, res) {
  // Enable CORS for your GitHub Pages domain
  res.setHeader('Access-Control-Allow-Origin', 'https://flyingfrog81.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    // Your Spotify app credentials
    const CLIENT_ID = 'aef766288e8e41618cd90b59328a81d3';
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET; // Set this in Vercel dashboard
    const REDIRECT_URI = 'https://flyingfrog81.github.io/musicquizz/';

    if (!CLIENT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Create Basic Auth header manually
    const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
    const encodedCredentials = btoa(credentials);
    
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedCredentials}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return res.status(400).json({ error: 'Token exchange failed' });
    }

    const tokenData = await tokenResponse.json();
    
    // Return only the access token (don't expose refresh token to frontend)
    res.status(200).json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}