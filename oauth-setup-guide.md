# OAuth Setup Guide for BrokeBuster

To enable GitHub and Google authentication in your BrokeBuster app, you need to configure OAuth providers in your Supabase project.

## 1. GitHub OAuth Setup

### Step 1: Create GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: BrokeBuster
   - **Homepage URL**: `https://your-domain.com` (or `http://localhost:3000` for development)
   - **Authorization callback URL**: `https://your-supabase-project.supabase.co/auth/v1/callback`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### Step 2: Configure in Supabase
1. Go to your Supabase Dashboard
2. Navigate to Authentication > Providers
3. Find GitHub and click "Enable"
4. Enter your GitHub **Client ID** and **Client Secret**
5. Save the configuration

## 2. Google OAuth Setup

### Step 1: Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Configure the OAuth consent screen first
6. Create OAuth 2.0 credentials:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `https://your-supabase-project.supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**

### Step 2: Configure in Supabase
1. Go to your Supabase Dashboard
2. Navigate to Authentication > Providers
3. Find Google and click "Enable"
4. Enter your Google **Client ID** and **Client Secret**
5. Save the configuration

## 3. Update Site URL (Important!)

In your Supabase Dashboard:
1. Go to Authentication > URL Configuration
2. Set **Site URL** to your production domain (e.g., `https://your-domain.com`)
3. Add **Redirect URLs** for development: `http://localhost:3000/**`

## 4. Test Your Setup

1. Deploy your app or run it locally
2. Go to the login page
3. Click "GitHub" or "Google" buttons
4. You should be redirected to the OAuth provider
5. After authorization, you'll be redirected back to your app

## Troubleshooting

- **Redirect URI mismatch**: Make sure the callback URL in your OAuth app matches exactly: `https://your-project.supabase.co/auth/v1/callback`
- **Site URL issues**: Ensure the Site URL in Supabase matches your app's domain
- **Development testing**: Use `http://localhost:3000` for local development

## Security Notes

- Never commit OAuth secrets to your repository
- Use environment variables for sensitive data
- Enable HTTPS in production
- Regularly rotate your OAuth secrets

Your BrokeBuster app now supports GitHub and Google authentication! 🎉
