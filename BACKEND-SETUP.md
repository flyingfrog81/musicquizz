# Spotify OAuth Backend Deployment Guide

## Quick Setup (5 minutes)

### 1. Get Your Spotify Client Secret
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click on your "musicquizz" app
3. Copy the **Client Secret** (you'll need this for step 3)

### 2. Deploy to Vercel (Free)
1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click "New Project" 
3. Import your `flyingfrog81/musicquizz` repository
4. Click "Deploy"

### 3. Add Environment Variable
1. After deployment, go to your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. Add:
   - **Name**: `SPOTIFY_CLIENT_SECRET`
   - **Value**: Your Client Secret from step 1
4. Click "Save"

### 4. Update Your App Code
1. After deployment, Vercel will give you a URL like: `https://musicquizz-xyz123.vercel.app`
2. In `app.js`, find this line:
   ```javascript
   const backendUrl = 'https://your-vercel-app.vercel.app/api/auth';
   ```
3. Replace it with your actual Vercel URL:
   ```javascript
   const backendUrl = 'https://musicquizz-xyz123.vercel.app/api/auth';
   ```

### 5. Test
1. Commit and push the URL change
2. Try the Spotify authentication again
3. It should now work completely!

## Alternative: Manual Deployment
If you prefer not to use Vercel, you can deploy the `api/auth.js` file to:
- Netlify Functions
- AWS Lambda  
- Railway
- Any Node.js hosting service

The backend just needs to:
1. Accept POST requests to `/api/auth`
2. Have your Spotify Client Secret as an environment variable
3. Return JSON with `access_token` and `expires_in`