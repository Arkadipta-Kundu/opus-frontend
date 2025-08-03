# Netlify Deployment Guide

## 🚀 Deploy to Netlify

### Option 1: Git Integration (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Add Netlify configuration"
   git push origin main
   ```

2. **Connect to Netlify**

   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `build`
     - **Node version**: 18

3. **Set Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add: `REACT_APP_API_BASE_URL` = `https://your-backend-url.com`

### Option 2: Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**

   ```bash
   netlify login
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=build
   ```

### Option 3: Drag & Drop

1. **Build locally**

   ```bash
   npm run build
   ```

2. **Drag build folder** to [netlify.com/drop](https://netlify.com/drop)

## ⚙️ Environment Variables

Set these in Netlify Dashboard:

| Variable                 | Value            | Example                          |
| ------------------------ | ---------------- | -------------------------------- |
| `REACT_APP_API_BASE_URL` | Your backend URL | `https://your-api.herokuapp.com` |

## 🔧 Backend Configuration Required

**Important**: Update your Spring Boot backend CORS settings to allow your Netlify domain:

```java
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://your-app.netlify.app",
    "https://your-custom-domain.com"
})
```

See [CORS_SETUP.md](./CORS_SETUP.md) for detailed backend configuration.

## 🌐 Custom Domain (Optional)

1. Go to Site Settings > Domain Management
2. Add custom domain
3. Update DNS records as instructed
4. Netlify will handle SSL automatically

## 🐛 Troubleshooting

### Build Fails

- Check Node.js version (should be 18+)
- Verify all dependencies in package.json
- Check build logs in Netlify dashboard

### API Calls Fail

- Verify `REACT_APP_API_BASE_URL` is set correctly
- Check CORS configuration in your backend
- Look at browser network tab for errors

### 404 on Routes

- Netlify config handles SPA routing automatically
- Check `netlify.toml` redirects are correct

### Environment Variables Not Working

- Environment variables must start with `REACT_APP_`
- Rebuild after adding environment variables
- Check spelling and case sensitivity

## 📱 Features Included

- ✅ SPA routing support
- ✅ Security headers
- ✅ Static asset caching
- ✅ Build optimization
- ✅ Environment variable support
- ✅ Custom redirects ready
