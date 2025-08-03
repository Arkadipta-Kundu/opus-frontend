# Todo List Frontend

A modern, minimal React.js frontend for the Todo List application built with Spring Boot backend.

## Features

- **User Authentication**: Login, register, email verification with OTP
- **Task Management**: Create, read, update, delete tasks
- **Task Status Tracking**: TODO, IN_PROGRESS, DONE
- **Clean Modern UI**: Responsive design with gradient backgrounds
- **Real-time Stats**: Dashboard showing task statistics
- **Filter Tasks**: Filter by status (All, Todo, In Progress, Done)

## Tech Stack

- React 18
- React Router DOM
- Axios for API calls
- Lucide React for icons
- Modern CSS with gradients and animations

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start the Development Server**

   ```bash
   npm start
   ```

3. **Make sure your Spring Boot backend is running on http://localhost:8080**

## Project Structure

```
src/
├── components/
│   ├── Dashboard.js       # Main dashboard with task management
│   ├── LoginPage.js       # Login and email verification
│   ├── RegisterPage.js    # User registration
│   └── TaskModal.js       # Create/edit task modal
├── services/
│   └── authService.js     # API service layer
├── App.js                 # Main app component with routing
├── index.js              # React entry point
└── index.css             # Global styles
```

## API Integration

The frontend integrates with your Spring Boot backend API:

- **Authentication**: `/auth/user-varification/*`
- **Tasks**: `/tasks/*`
- **Users**: `/user/*`

## Features Implemented

### Authentication Flow

1. User registration with form validation
2. Login with username/password
3. Email verification with OTP
4. Automatic token management
5. Protected routes

### Task Management

1. View all tasks with status filtering
2. Create new tasks with title, description, status, and due date
3. Edit existing tasks
4. Delete tasks with confirmation
5. Real-time task statistics dashboard

### UI/UX Features

1. Responsive design for mobile and desktop
2. Modern gradient backgrounds
3. Clean card-based layouts
4. Loading states and error handling
5. Form validation and user feedback
6. Modal dialogs for task creation/editing

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🚀 Deploy to Netlify or Vercel

This app is ready for deployment on both platforms!

### Netlify (Recommended)

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**

1. Push to GitHub: `git push origin main`
2. Connect GitHub repo to Netlify
3. Set environment variable `REACT_APP_API_BASE_URL` in Netlify dashboard
4. Deploy automatically!

### Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variable `REACT_APP_API_BASE_URL` in Vercel dashboard

## ⚠️ Important: Backend CORS Setup

**Your Spring Boot backend must allow requests from your deployed domain!**

See [CORS_SETUP.md](./CORS_SETUP.md) for detailed backend configuration.

## Environment Variables

For production deployment, set:

- `REACT_APP_API_BASE_URL`: Your Spring Boot backend URL

# opus-frontend
