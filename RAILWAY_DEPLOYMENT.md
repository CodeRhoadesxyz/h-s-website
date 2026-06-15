# Deploying Heart & Soul Parrot Rescue to Railway

Railway is a modern platform that makes deploying full-stack applications incredibly easy. Follow these steps to get your website live!

## Prerequisites

1. GitHub account (free at github.com)
2. Railway account (free at railway.app)

## Step 1: Prepare Your Code

1. Create a new GitHub repository called `heart-and-soul-rescue`
2. Upload all files from this backend folder to your repository
3. Make sure you have:
   - `server.js`
   - `package.json`
   - `Procfile`
   - `.env.example`
   - `scripts/migrate.js`
   - `public/` folder (with your HTML/CSS/JS files)

## Step 2: Connect to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize Railway to access your GitHub account
5. Select your `heart-and-soul-rescue` repository

## Step 3: Add PostgreSQL Database

1. In your Railway project, click "Add Service"
2. Select "PostgreSQL"
3. Railway will automatically provision a database
4. The `DATABASE_URL` environment variable will be set automatically

## Step 4: Configure Environment Variables

1. In Railway project settings, go to "Variables"
2. Add these variables:
   ```
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=https://your-railway-url.railway.app
   ADMIN_EMAIL=your-email@example.com
   ADMIN_PASSWORD=your-secure-password
   ```

## Step 5: Deploy

1. Railway will automatically detect your `package.json`
2. It will run `npm install` automatically
3. It will execute the `Procfile` commands
4. Your database migrations will run automatically
5. Your app will be live in 2-3 minutes!

## Step 6: Access Your Application

1. Railway will give you a public URL (something like `heart-and-soul-rescue.railway.app`)
2. Visit that URL to see your website live!
3. Your API endpoints will be available at:
   - `https://your-url.railway.app/api/birds`
   - `https://your-url.railway.app/api/events`
   - `https://your-url.railway.app/api/contact`

## Step 7: Connect Your Domain (Optional)

1. If you have a custom domain (like `heartandsoulparrots.com`):
   - Go to Railway project settings
   - Click "Domains"
   - Add your custom domain
   - Update your domain DNS settings (Railway will provide instructions)

## API Endpoints

### Birds Management
- `GET /api/birds` - Get all adoptable birds
- `GET /api/birds/:id` - Get specific bird
- `POST /api/birds` - Add new bird (admin)
- `PUT /api/birds/:id` - Update bird (admin)
- `DELETE /api/birds/:id` - Delete bird (admin)

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/contact-messages` - View all messages (admin)

### Events
- `GET /api/events` - Get upcoming events
- `POST /api/events` - Add new event (admin)

### Health Check
- `GET /api/health` - Check if API is running

## Example API Calls

### Add a new adoptable bird:
```bash
curl -X POST https://your-url.railway.app/api/birds \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Polly",
    "species": "Blue and Gold Macaw",
    "age": "5 years",
    "description": "Friendly and talkative",
    "image_url": "https://example.com/polly.jpg",
    "status": "available"
  }'
```

### Get all birds:
```bash
curl https://your-url.railway.app/api/birds
```

### Submit a contact form:
```bash
curl -X POST https://your-url.railway.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "subject": "Interested in adoption",
    "message": "I would like to adopt a parrot"
  }'
```

## Troubleshooting

### Database Connection Error
- Check that PostgreSQL service is running in Railway
- Verify `DATABASE_URL` is set in environment variables
- Check that your code is using the correct connection string

### Port Issues
- Railway automatically assigns a port via the `PORT` environment variable
- Don't hardcode port numbers in your code
- The `server.js` already uses `process.env.PORT || 3000`

### Static Files Not Loading
- Make sure your `public/` folder contains your HTML/CSS/JS files
- The server is configured to serve static files from `public/`
- Update file paths in your HTML to match the folder structure

### Migrations Not Running
- Check the Procfile syntax (it's very particular about spacing)
- View Railway logs to see migration output
- Ensure `scripts/migrate.js` has proper error handling

## Monitoring Your Application

1. In Railway dashboard, you can:
   - View real-time logs
   - Monitor CPU and memory usage
   - Check database connections
   - Restart the application if needed

## Next Steps

1. **Update Frontend**: Modify your HTML/CSS/JS to call the API endpoints
2. **Create Admin Panel**: Build a simple interface to manage birds and events
3. **Add Authentication**: Implement login for admin features
4. **Custom Domain**: Connect your own domain name
5. **Email Notifications**: Set up email alerts for contact form submissions

## Support

For Railway support: https://docs.railway.app
For issues with this application: Check the logs in Railway dashboard

---

**Your website is now live and ready to manage adoptable parrots!** 🦜
