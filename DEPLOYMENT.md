# Vercel Deployment Guide

## 🚀 Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect it's a React app

## ⚙️ Environment Variables

In Vercel Dashboard, add these environment variables:

- **Key**: `REACT_APP_API_BASE_URL`
- **Value**: Your Spring Boot backend URL (e.g., `https://your-backend.herokuapp.com`)

## 🔧 Backend CORS Configuration

Update your Spring Boot backend to allow requests from your Vercel domain:

```java
@CrossOrigin(origins = {"http://localhost:3000", "https://your-app.vercel.app"})
```

## 📝 Important Notes

- The app will be available at `https://your-app-name.vercel.app`
- Vercel automatically handles routing for React Router
- Environment variables are set in the Vercel dashboard
- HTTPS is enabled by default

## 🐛 Troubleshooting

- **API calls failing**: Check CORS settings and environment variables
- **Routing issues**: Vercel config handles SPA routing automatically
- **Build fails**: Check if all dependencies are in package.json
