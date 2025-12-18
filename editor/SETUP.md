# Setup Instructions

## 1. Install Dependencies
```bash
npm install
```

## 2. Configure Environment Variables
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Spotify client secret:
   ```bash
   # Get your client secret from:
   # https://developer.spotify.com/dashboard -> Your App -> Settings
   SPOTIFY_CLIENT_SECRET=your_actual_client_secret_here
   ```

## 3. Add Redirect URI to Spotify App
In your Spotify Developer Dashboard, add this redirect URI:
```
http://127.0.0.1:3001/callback
```

## 4. Start the Editor
```bash
npm start
```

The editor will open automatically at http://127.0.0.1:3001

## Security Notes
- The `.env` file is excluded from Git (see `.gitignore`)
- Never commit your client secret to version control
- The client secret is only used locally for development