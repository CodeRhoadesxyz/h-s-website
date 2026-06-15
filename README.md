# Heart & Soul Parrot Rescue - Full-Stack Application

A complete, production-ready web application for Heart & Soul Parrot Rescue with a modern backend, PostgreSQL database, and beautiful frontend.

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

3. **Run database migrations:**
   ```bash
   npm run migrate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Visit:** http://localhost:3000

### Deploy to Railway

See `RAILWAY_DEPLOYMENT.md` for complete deployment instructions.

## 📁 Project Structure

```
heart-soul-backend/
├── server.js                 # Express server & API routes
├── package.json             # Node.js dependencies
├── Procfile                 # Railway deployment config
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── scripts/
│   └── migrate.js           # Database setup script
├── public/                  # Frontend files (HTML/CSS/JS)
│   ├── index.html
│   ├── adoptable.html
│   ├── team.html
│   ├── css/
│   ├── js/
│   ├── images/
│   └── videos/
└── RAILWAY_DEPLOYMENT.md    # Railway deployment guide
```

## 🗄️ Database Schema

### Birds Table
```sql
CREATE TABLE birds (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(255) NOT NULL,
  age VARCHAR(100),
  description TEXT,
  image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Contact Messages Table
```sql
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Events Table
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 API Endpoints

### Birds Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/birds` | Get all adoptable birds |
| GET | `/api/birds/:id` | Get specific bird |
| POST | `/api/birds` | Create new bird (admin) |
| PUT | `/api/birds/:id` | Update bird (admin) |
| DELETE | `/api/birds/:id` | Delete bird (admin) |

### Contact Form
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact-messages` | Get all messages (admin) |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get upcoming events |
| POST | `/api/events` | Create new event (admin) |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API status |

## 📝 Example API Usage

### Get All Birds
```bash
curl https://your-app.railway.app/api/birds
```

### Add a New Bird
```bash
curl -X POST https://your-app.railway.app/api/birds \
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

### Submit Contact Form
```bash
curl -X POST https://your-app.railway.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "subject": "Interested in adoption",
    "message": "I would like to adopt a parrot"
  }'
```

## 🎨 Frontend Features

- **Unique Parrot-Style Design**: Tropical colors and animations
- **Animated Hero Background**: HD video of flying cockatoos
- **Mobile-Friendly Navbar**: Responsive design for all devices
- **Dark/Light Mode Toggle**: Professional theme switcher
- **Smooth Animations**: Bouncy transitions and hover effects
- **Fully Responsive**: Perfect on desktop, tablet, and mobile

## 🔐 Security Considerations

- Environment variables for sensitive data
- PostgreSQL prepared statements (SQL injection protection)
- CORS configuration for API access
- Input validation on all endpoints
- SSL/TLS support on Railway

## 🚀 Deployment

### Railway (Recommended)
1. Push code to GitHub
2. Connect to Railway
3. Add PostgreSQL database
4. Set environment variables
5. Deploy automatically

See `RAILWAY_DEPLOYMENT.md` for detailed instructions.

### Other Platforms
- **Heroku**: Similar to Railway, use Procfile
- **Render**: Supports Node.js and PostgreSQL
- **DigitalOcean App Platform**: Full-stack deployment
- **AWS/Google Cloud**: More complex setup

## 📦 Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **pg**: PostgreSQL client
- **dotenv**: Environment variable management
- **body-parser**: Request body parsing

## 🛠️ Development

### Install Dev Dependencies
```bash
npm install --save-dev nodemon
```

### Run with Auto-Reload
```bash
npm run dev
```

### Run Migrations
```bash
npm run migrate
```

## 📊 Monitoring

Railway provides built-in monitoring:
- Real-time logs
- CPU and memory usage
- Database connection stats
- Request metrics

## 🐛 Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` environment variable
- Check PostgreSQL service is running
- Ensure SSL settings are correct

### Port Already in Use
- Change PORT in `.env`
- Or kill the process: `lsof -i :3000`

### Migrations Not Running
- Check Procfile syntax
- View Railway logs for errors
- Ensure `scripts/migrate.js` is executable

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Railway Documentation](https://docs.railway.app)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 📞 Support

- **Email**: heartandsoulparrots@gmail.com
- **Phone**: 412-748-1288
- **GitHub Issues**: Report bugs and request features

## 📄 License

© 2026 Heart and Soul Parrot Rescue. All rights reserved.

---

**Made with ❤️ for the parrots!** 🦜
