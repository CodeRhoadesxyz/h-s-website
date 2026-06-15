# Heart & Soul Parrot Rescue - Application Updates

## Overview
This document outlines all the enhancements made to the Heart & Soul Parrot Rescue web application.

---

## 1. Removed Flying Parrot Animations

### Changes Made:
- **Removed from `public/js/main.js`:**
  - Deleted the `initializeParrotAnimation()` function
  - Removed the function call from `DOMContentLoaded` event listener
  
- **Removed from `public/css/styles.css`:**
  - Deleted `.parrot-animation-container` styles
  - Deleted `.flying-parrot` styles
  - Deleted `@keyframes flyAcross` animation
  - Deleted `@keyframes flyBack` animation

- **Removed from all HTML files:**
  - Removed `<div class="parrot-animation-container"></div>` from:
    - `index.html`
    - `adoptable.html`
    - `adopted.html`
    - `donate.html`
    - `events.html`
    - `prices.html`
    - `soon.html`
    - `surrender.html`
    - `team.html`
    - `vets.html`

---

## 2. Surrender Application Form

### New Files:
- **`public/surrender-form.html`** - Comprehensive surrender application form

### Features:
- Collects owner information (name, email, phone)
- Captures bird details (name, species, age, description)
- Documents reason for surrender
- Records behavioral notes, medical history, dietary preferences
- Submits data to `/api/surrender-applications` endpoint
- Displays success/error messages
- Redirects to surrender page after submission

### Database:
- **Table:** `surrender_applications`
- **Fields:**
  - `id` (Primary Key)
  - `owner_name`, `owner_email`, `owner_phone`
  - `bird_name`, `bird_species`, `bird_age`, `bird_description`
  - `reason_for_surrender` (required)
  - `bird_health_status`, `behavioral_notes`, `dietary_preferences`, `medical_history`
  - `status` (pending/approved/rejected)
  - `created_at`, `updated_at`

### API Endpoints:
- `GET /api/surrender-applications` - Get all applications (admin)
- `GET /api/surrender-applications/:id` - Get specific application
- `POST /api/surrender-applications` - Submit new application
- `PUT /api/surrender-applications/:id` - Update application status (admin)

---

## 3. Adoption Application Form

### New Files:
- **`public/adoption-form.html`** - Comprehensive adoption application form

### Features:
- Collects applicant information (name, email, phone, address)
- Captures household information (members, living situation, other pets)
- Records parrot ownership experience level
- Documents motivation for adoption and commitment level
- Submits data to `/api/adoption-applications` endpoint
- Displays success/error messages
- Redirects to adoptable page after submission

### Database:
- **Table:** `adoption_applications`
- **Fields:**
  - `id` (Primary Key)
  - `applicant_name`, `applicant_email`, `applicant_phone`
  - `applicant_address`, `applicant_city`, `applicant_state`, `applicant_zip`
  - `bird_id`, `bird_name`
  - `household_members`, `other_pets`
  - `experience_level` (required)
  - `living_situation`, `why_adopt`, `commitment_level`
  - `status` (pending/approved/rejected)
  - `created_at`, `updated_at`

### API Endpoints:
- `GET /api/adoption-applications` - Get all applications (admin)
- `GET /api/adoption-applications/:id` - Get specific application
- `POST /api/adoption-applications` - Submit new application
- `PUT /api/adoption-applications/:id` - Update application status (admin)

---

## 4. Secure Admin Panel with Authentication

### New Files:
- **`public/admin-login.html`** - Admin login page with credentials display
- **`public/js/admin-enhanced.js`** - Enhanced admin panel JavaScript with authentication

### Features:
- **Login Page:**
  - Username and password authentication
  - Demo credentials displayed (username: `dalton`, password: `262321`)
  - Session stored in localStorage
  - Automatic redirect to login if not authenticated

- **Admin Panel Enhancements:**
  - Authentication check on page load
  - Current user display in sidebar
  - Logout button in sidebar
  - New tabs for Surrender and Adoption applications
  - New tab for Admin Users management

### Database:
- **Table:** `admin_users`
- **Fields:**
  - `id` (Primary Key)
  - `username` (unique, required)
  - `password_hash` (bcryptjs hashed)
  - `email`
  - `created_at`, `updated_at`

### Default Admin User:
- **Username:** `dalton`
- **Password:** `262321`
- Created during database migration

### API Endpoints:
- `POST /api/admin/login` - Authenticate admin user
- `GET /api/admin/users` - Get all admin users (admin only)
- `POST /api/admin/users` - Create new admin user (admin only)

### Security:
- Passwords hashed with bcryptjs (10 salt rounds)
- Authentication required for admin panel access
- Session tokens stored in localStorage
- Automatic logout on page refresh if not authenticated

---

## 5. Petfinder API Integration

### Features:
- Search for birds from Petfinder API
- Import birds from Petfinder to local database
- Automatic token management with expiration handling

### Configuration:
- **Environment Variables Required:**
  - `PETFINDER_API_KEY` - Your Petfinder API key
  - `PETFINDER_API_SECRET` - Your Petfinder API secret

### API Endpoints:
- `GET /api/petfinder/search?type=bird&limit=20` - Search Petfinder for birds
- `GET /api/petfinder/animal/:id` - Get specific animal from Petfinder
- `POST /api/birds/import-petfinder` - Import bird to local database

### Implementation:
- Automatic OAuth2 token refresh
- Token caching with expiration tracking
- Error handling for API failures

---

## 6. Calendar-Based Events System

### New Files:
- **`public/events-calendar.html`** - New calendar-based events page

### Features:
- **Interactive Calendar:**
  - Month view with navigation
  - Event indicators on calendar days
  - Click on day to filter events
  - Today button for quick navigation

- **Events List:**
  - Display all upcoming events
  - Search functionality
  - Sort by date or title
  - Event details: title, date, time, location, description

- **Event Actions:**
  - Add to calendar (generates .ics file)
  - View full event details
  - Responsive design for mobile

### Backend Integration:
- Fetches events from `/api/events` endpoint
- Events managed through admin panel
- Full CRUD operations available

### Event Fields:
- `title` (required)
- `description`
- `event_date` (required, includes time)
- `location`

---

## 7. Database Migrations

### Updated `scripts/migrate.js`:
- Added tables for surrender applications
- Added tables for adoption applications
- Added table for admin users
- Creates default admin user (dalton/262321)
- Added indexes for performance

### Run Migrations:
```bash
npm run migrate
```

---

## 8. Package Dependencies

### New Dependencies Added:
- **bcryptjs** (^2.4.3) - Password hashing
- **axios** (^1.6.0) - HTTP requests for Petfinder API

### Install:
```bash
npm install
```

---

## 9. Environment Variables

### Required for Petfinder Integration:
```
PETFINDER_API_KEY=your_api_key
PETFINDER_API_SECRET=your_api_secret
```

### Optional:
```
DATABASE_URL=postgresql://user:password@localhost/dbname
PORT=3000
NODE_ENV=production
```

---

## 10. File Structure

```
heart-soul-backend/
├── public/
│   ├── admin-login.html          [NEW] Admin login page
│   ├── adoption-form.html         [NEW] Adoption form
│   ├── events-calendar.html       [NEW] Calendar events page
│   ├── surrender-form.html        [NEW] Surrender form
│   ├── admin.html                 [UPDATED] Added new sections
│   ├── events.html                [UNCHANGED] Original Google Calendar
│   ├── js/
│   │   ├── admin-enhanced.js      [NEW] Enhanced admin panel
│   │   ├── admin.js               [UNCHANGED] Original admin script
│   │   └── main.js                [UPDATED] Removed animations
│   └── css/
│       └── styles.css             [UPDATED] Removed animation styles
├── scripts/
│   └── migrate.js                 [UPDATED] New tables & default user
├── server.js                      [UPDATED] New API endpoints
├── package.json                   [UPDATED] New dependencies
└── UPDATES.md                     [NEW] This file
```

---

## 11. Testing Checklist

- [ ] Parrot animations removed from all pages
- [ ] Surrender form submits successfully
- [ ] Adoption form submits successfully
- [ ] Admin login works with dalton/262321
- [ ] Surrender applications visible in admin panel
- [ ] Adoption applications visible in admin panel
- [ ] Admin users can be created
- [ ] Petfinder API search works (with credentials)
- [ ] Events display on calendar
- [ ] Calendar navigation works
- [ ] Event search and sort work
- [ ] Add to calendar functionality works
- [ ] All forms responsive on mobile
- [ ] Theme toggle works
- [ ] Logout functionality works

---

## 12. Deployment Notes

1. **Update Environment Variables:**
   - Set `PETFINDER_API_KEY` and `PETFINDER_API_SECRET`
   - Set `DATABASE_URL` for production database

2. **Run Migrations:**
   ```bash
   npm run migrate
   ```

3. **Start Server:**
   ```bash
   npm start
   ```

4. **Access Points:**
   - Public site: `http://localhost:3000`
   - Admin login: `http://localhost:3000/admin-login.html`
   - Surrender form: `http://localhost:3000/surrender-form.html`
   - Adoption form: `http://localhost:3000/adoption-form.html`
   - Calendar events: `http://localhost:3000/events-calendar.html`

---

## 13. Support & Maintenance

### Admin Panel Access:
- **URL:** `/admin-login.html`
- **Default Credentials:**
  - Username: `dalton`
  - Password: `262321`
- **Change Password:** Create new admin user with different credentials

### Database Backups:
- Regular backups recommended for production
- Applications data is stored in `surrender_applications` and `adoption_applications` tables

### API Documentation:
- All endpoints documented in `server.js`
- CORS enabled for cross-origin requests
- JSON request/response format

---

## 14. Future Enhancements

Potential improvements for future versions:
- Email notifications for new applications
- Application status updates via email
- Advanced filtering in admin panel
- Bulk operations for applications
- Analytics dashboard
- Integration with payment systems for donations
- Mobile app version

---

## Contact & Support

For issues or questions about these updates, please contact:
- Email: heartandsoulparrots@gmail.com
- Phone: 412-748-1288
- Facebook: Heart and Soul Parrot Rescue

---

**Last Updated:** June 15, 2026
**Version:** 2.0.0
