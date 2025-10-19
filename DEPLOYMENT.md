# E-Mart Deployment Guide

## ✅ Files Updated for Deployment

Your project is now ready for deployment on Render! Here's what was updated:

### Backend Changes:

1. **settings.py** - Updated with:

   - WhiteNoise middleware for static files
   - PostgreSQL database configuration
   - Production security settings
   - Proper CORS configuration

2. **Procfile** - Already exists
3. **runtime.txt** - Already exists
4. **build.sh** - Already exists
5. **requirements.txt** - Already has all necessary packages:
   - dj-database-url
   - psycopg2-binary
   - whitenoise

### Frontend:

- **.env.example** - Created for environment variable reference

---

## 🚀 Next Steps: Deploy on Render

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Name: `simpleshop-db`
4. Region: Choose closest to you
5. Click "Create Database"
6. **Copy the "Internal Database URL"** - you'll need it!

### Step 3: Deploy Backend

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:

   - **Name:** `simpleshop-backend`
   - **Root Directory:** `backend`
   - **Build Command:**
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate
     ```
   - **Start Command:**
     ```bash
     gunicorn simpleshop.wsgi:application
     ```

4. **Add Environment Variables:**

   ```
   SECRET_KEY=<generate-new-secret-key>
   DEBUG=False
   ALLOWED_HOSTS=simpleshop-backend.onrender.com
   DATABASE_URL=<paste-internal-database-url>
   RAZORPAY_KEY_ID=<your-key>
   RAZORPAY_KEY_SECRET=<your-secret>
   EMAIL_HOST_USER=<your-email>
   EMAIL_HOST_PASSWORD=<your-app-password>
   DEFAULT_FROM_EMAIL=<your-email>
   GOOGLE_OAUTH2_CLIENT_ID=<your-client-id>
   GOOGLE_OAUTH2_CLIENT_SECRET=<your-secret>
   ```

5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. Copy your backend URL: `https://simpleshop-backend.onrender.com`

### Step 4: Create Superuser

1. In backend service, go to "Shell" tab
2. Run:
   ```bash
   python manage.py createsuperuser
   ```
3. Test admin: `https://your-backend.onrender.com/admin/`

### Step 5: Deploy Frontend

1. **First, update API URL in your React code:**

   - Create `frontend/.env`:
     ```
     REACT_APP_API_URL=https://simpleshop-backend.onrender.com
     ```
   - Update all fetch calls to use:
     ```javascript
     const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
     fetch(`${API_URL}/api/products/`);
     ```

2. **Commit changes:**

   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push origin main
   ```

3. **Create Static Site on Render:**

   - Click "New +" → "Static Site"
   - Connect repository
   - Configure:
     - **Name:** `simpleshop-frontend`
     - **Root Directory:** `frontend`
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `build`
   - Add environment variable:
     ```
     REACT_APP_API_URL=https://simpleshop-backend.onrender.com
     ```
   - Click "Create Static Site"

4. Copy your frontend URL: `https://simpleshop-frontend.onrender.com`

### Step 6: Update CORS Settings

1. Go back to backend service
2. Update environment variables:
   ```
   ALLOWED_HOSTS=simpleshop-backend.onrender.com,simpleshop-frontend.onrender.com
   CORS_ALLOWED_ORIGINS=https://simpleshop-frontend.onrender.com
   ```
3. Save (backend will auto-redeploy)

---

## ✅ Testing Checklist

After deployment, test:

- [ ] Backend admin: `https://your-backend.onrender.com/admin/`
- [ ] API endpoint: `https://your-backend.onrender.com/api/products/`
- [ ] Frontend loads: `https://your-frontend.onrender.com`
- [ ] Login/Signup works
- [ ] Products load correctly
- [ ] Add to cart works
- [ ] Checkout process works
- [ ] No CORS errors in browser console

---

## 💡 Important Notes

1. **Free Tier Limitations:**

   - Backend spins down after 15 min inactivity (first load may be slow)
   - Database deleted after 90 days (upgrade to Starter plan for $7/month)

2. **Media Files:**

   - Uploaded files are stored temporarily on Render
   - For production, use AWS S3 or Cloudinary

3. **Environment Variables:**

   - Never commit `.env` files to GitHub
   - Always use environment variables on Render

4. **SITE_ID Issue:**
   - Your settings.py has `SITE_ID = 11`
   - On new database, you'll need to update this to `1` or create the site in Django admin

---

## 🔧 Common Issues

### CORS Error

- Check `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Verify environment variables are set correctly

### Static Files Not Loading

- Ensure WhiteNoise is in middleware
- Run `python manage.py collectstatic --no-input`

### Database Connection Error

- Use Internal Database URL (not External)
- Verify DATABASE_URL environment variable

---

## 📊 Costs

**Free Tier:**

- Backend: Free (with limitations)
- Frontend: Free (static site)
- Database: Free for 90 days

**Paid (for 24/7 availability):**

- Backend: $7/month
- Database: $7/month
- **Total: $14/month**

---

## 🎉 Your URLs

After deployment:

- **Backend:** https://simpleshop-backend.onrender.com
- **Frontend:** https://simpleshop-frontend.onrender.com
- **Admin Panel:** https://simpleshop-backend.onrender.com/admin/

---

Good luck with your deployment! 🚀
