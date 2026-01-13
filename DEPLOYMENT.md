# Deployment Guide

## Backend Deployment (Render)

### Step 1: Prepare Backend
1. Your backend is ready for deployment with `render.yaml` configured

### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `Co-ctrl-hash/Harshdeep_btech-10920-22`
4. Configure:
   - **Name**: `ozi-task-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Set Environment Variables
Add these in Render dashboard:
```
MONGODB_URI=mongodb+srv://mukherjeenilima705_db_user:U58KHFcSrgLY32Vp@cluster0.ghmj4qr.mongodb.net/taskmanagement
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=production
PORT=5000
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Copy your backend URL: `https://ozi-task-backend.onrender.com`

---

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import your GitHub repository: `Co-ctrl-hash/Harshdeep_btech-10920-22`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Set Environment Variables
Add in Vercel dashboard:
```
VITE_API_URL=https://ozi-task-backend.onrender.com/api
```

### Step 3: Deploy
- Click "Deploy"
- Wait for deployment (2-3 minutes)
- Your frontend URL: `https://your-app.vercel.app`

---

## Alternative: Quick Deploy Commands

### Deploy Backend to Render (Using Render CLI)
```bash
# Install Render CLI
npm install -g @render/cli

# Login
render login

# Deploy
cd backend
render deploy
```

### Deploy Frontend to Vercel (Using Vercel CLI)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

---

## Post-Deployment

### Update README.md
Replace the demo links with your actual URLs:
```markdown
## 🚀 Live Demo
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://ozi-task-backend.onrender.com
```

### Test Deployment
1. Visit your frontend URL
2. Sign up and create a test account
3. Create tasks and test drag & drop
4. Verify all features work

---

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure JWT_SECRET is set
- Check CORS settings if frontend can't connect

### Frontend Issues
- Verify VITE_API_URL environment variable
- Check browser console for errors
- Ensure backend is deployed first
- Clear cache and redeploy if needed

---

## Important Notes

1. **Free Tier Limitations**:
   - Render free tier: Backend sleeps after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds to wake up
   - Consider upgrading for production use

2. **MongoDB Atlas**:
   - Ensure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` for Render
   - Or add Render's IP addresses to whitelist

3. **Environment Variables**:
   - Never commit `.env` files
   - Set all variables in hosting platform dashboards
   - Frontend env vars must start with `VITE_`

---

## Quick Links

- **Render Dashboard**: https://dashboard.render.com/
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **GitHub Repo**: https://github.com/Co-ctrl-hash/Harshdeep_btech-10920-22
