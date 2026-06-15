# 🦜 Admin Panel Guide

Your professional admin dashboard is ready! This guide will help you use and deploy it.

## 📍 Access Your Admin Panel

Once deployed to Railway, visit:
```
https://your-railway-url.railway.app/admin.html
```

## 🎯 Features

### Dashboard
- **Real-time Statistics**: See counts of birds, events, and messages
- **API Status**: Check if your backend is running
- **Quick Actions**: Fast access to add birds or create events

### Manage Adoptable Birds
- ✅ **Add Birds**: Create new adoptable parrot listings
- ✅ **Edit Birds**: Update bird information anytime
- ✅ **Delete Birds**: Remove birds from the system
- ✅ **Track Status**: Mark birds as available, pending, or adopted
- ✅ **Add Images**: Include photos of each bird

### Manage Events
- ✅ **Create Events**: Add adoption days, fundraisers, etc.
- ✅ **Edit Events**: Update event details
- ✅ **Delete Events**: Remove past or cancelled events
- ✅ **Set Dates**: Schedule events with date and time
- ✅ **Add Locations**: Specify where events will be held

### View Messages
- ✅ **See Contact Submissions**: View all messages from your website
- ✅ **Contact Information**: Get visitor emails and phone numbers
- ✅ **Reply Directly**: Click email/phone to respond
- ✅ **Full Message View**: Read complete message details

### Theme Toggle
- ✅ **Dark Mode**: Default professional dark theme
- ✅ **Light Mode**: Switch to light theme anytime
- ✅ **Persistent**: Your preference is saved

## 🚀 How to Use

### Adding a New Adoptable Bird

1. Click **"🦜 Adoptable Birds"** in the sidebar
2. Click **"+ Add New Bird"** button
3. Fill in the form:
   - **Name**: Bird's name (required)
   - **Species**: Type of parrot (required)
   - **Age**: How old the bird is
   - **Description**: Tell visitors about the bird
   - **Image URL**: Link to a photo
   - **Status**: Available, Pending, or Adopted
4. Click **"Save Bird"**
5. The bird appears on your website immediately!

### Creating an Event

1. Click **"📅 Events"** in the sidebar
2. Click **"+ Create Event"** button
3. Fill in the form:
   - **Event Title**: Name of the event (required)
   - **Description**: What will happen
   - **Date & Time**: When the event occurs (required)
   - **Location**: Where it will be held
4. Click **"Save Event"**
5. Event is live on your website!

### Viewing Contact Messages

1. Click **"💬 Messages"** in the sidebar
2. See all messages from website visitors
3. Click **"View Full"** to see the complete message
4. Click the email or phone to contact the person

## 🔌 API Endpoints (For Reference)

Your admin panel uses these API endpoints:

### Birds
```
GET    /api/birds              - Get all birds
POST   /api/birds              - Add new bird
PUT    /api/birds/:id          - Update bird
DELETE /api/birds/:id          - Delete bird
```

### Events
```
GET    /api/events             - Get upcoming events
POST   /api/events             - Create event
PUT    /api/events/:id         - Update event
DELETE /api/events/:id         - Delete event
```

### Messages
```
POST   /api/contact            - Submit contact form
GET    /api/contact-messages   - View all messages
```

## 📱 Mobile Friendly

The admin panel works on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones

The sidebar collapses on smaller screens for easy navigation.

## 🎨 Customization

### Change Colors
Edit `css/admin.css` and modify the CSS variables at the top:
```css
:root {
  --primary: #6b9b6a;      /* Green */
  --secondary: #d97070;    /* Red */
  --accent: #ffc800;       /* Gold */
}
```

### Add More Fields
Edit `admin.html` and `js/admin.js` to add custom fields for birds or events.

### Restrict Access (Future)
Add authentication in `server.js` to require login before accessing the admin panel.

## 🔒 Security Tips

1. **Change Default Credentials**: Update admin email/password in `.env`
2. **Use HTTPS**: Railway provides free HTTPS
3. **Backup Data**: Regularly export your database
4. **Monitor Access**: Check Railway logs for suspicious activity

## 🐛 Troubleshooting

### Admin Panel Won't Load
- Check that your backend is running on Railway
- Verify the URL is correct: `https://your-url.railway.app/admin.html`
- Check browser console for errors (F12)

### Can't Add Birds/Events
- Verify PostgreSQL database is running
- Check that migrations ran successfully
- Look at Railway logs for database errors

### Images Not Showing
- Ensure image URLs are correct and publicly accessible
- Use full URLs (https://example.com/image.jpg)
- Check that images are in a supported format (JPG, PNG, WebP)

### Form Submission Fails
- Check browser console for error messages
- Verify API endpoints are working
- Check Railway logs for backend errors

## 📊 Data Management

### Export Data
To backup your data, use PostgreSQL tools:
```bash
pg_dump your_database > backup.sql
```

### Import Data
To restore from backup:
```bash
psql your_database < backup.sql
```

## 🚀 Next Steps

1. **Customize**: Update colors, add your branding
2. **Test**: Add test birds and events
3. **Share**: Give the admin URL to team members
4. **Monitor**: Check messages regularly
5. **Expand**: Add more features as needed

## 📞 Support

- **Railway Docs**: https://docs.railway.app
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Email**: heartandsoulparrots@gmail.com

## 🎉 You're All Set!

Your admin panel is ready to manage Heart & Soul Parrot Rescue. Start adding birds and events to help more parrots find forever homes!

---

**Made with ❤️ for the parrots!** 🦜
