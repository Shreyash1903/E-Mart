# Quick Deployment Commands

## Generate New Secret Key

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Local Testing Before Deployment

```bash
# Backend
cd backend
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend
npm install
npm run build
npm start
```

## Git Commands

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Render Build Commands

### Backend Web Service:

- **Build Command:**
  ```
  pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate
  ```
- **Start Command:**
  ```
  gunicorn simpleshop.wsgi:application
  ```

### Frontend Static Site:

- **Build Command:**
  ```
  npm install && npm run build
  ```
- **Publish Directory:**
  ```
  build
  ```

## Environment Variables (Backend)

Copy these to Render dashboard:

```
SECRET_KEY=<generate-new-key>
DEBUG=False
ALLOWED_HOSTS=your-backend.onrender.com
DATABASE_URL=<from-render-postgresql>
RAZORPAY_KEY_ID=<your-key>
RAZORPAY_KEY_SECRET=<your-secret>
EMAIL_HOST_USER=<your-email>
EMAIL_HOST_PASSWORD=<your-app-password>
DEFAULT_FROM_EMAIL=<your-email>
GOOGLE_OAUTH2_CLIENT_ID=<optional>
GOOGLE_OAUTH2_CLIENT_SECRET=<optional>
```

## Environment Variables (Frontend)

```
REACT_APP_API_URL=https://your-backend.onrender.com
```

## After First Deploy

### Create Superuser:

```bash
python manage.py createsuperuser
```

### Update SITE_ID (if needed):

In Django admin or settings.py, change `SITE_ID = 1`

## Test URLs

- Backend API: `https://your-backend.onrender.com/api/products/`
- Admin Panel: `https://your-backend.onrender.com/admin/`
- Frontend: `https://your-frontend.onrender.com`
