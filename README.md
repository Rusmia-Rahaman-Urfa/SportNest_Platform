# SportNest Client ⚡

## Sports Facility Booking Platform — React.js Frontend (MERN Stack)

### Project Name: SportNest — Find Your Arena. Own The Game.

### Purpose
A full-stack sports facility booking platform (MERN + Better Auth) allowing users to discover and book premium sports facilities — football turfs, badminton courts, swimming lanes, tennis courts — across Bangladesh.

### Live URL
🌐 `https://sportnest-app.vercel.app` *(your URL after deployment)*

### Features
- ⚡ Dark/Light theme toggle (Optional requirement #1)
- 🎞️ Framer Motion animations throughout (Optional requirement #2)
- 🏟️ Browse all facilities — search ($regex) + filter ($in) + pagination (Challenge)
- 🔐 Better Auth — email/password + Google OAuth login (PDF requirement)
- 👤 Private routes that persist on reload — no redirect to login for logged-in users (PDF requirement)
- 📅 Facility detail page + booking form with slot conflict detection
- ➕ Add Facility with ImgBB image upload
- ✏️ Manage Facilities — edit/delete with confirmation modal
- 📋 My Bookings — filter by status, cancel bookings
- 📱 Fully responsive — mobile, tablet, desktop
- 🚫 Custom 404 page with friendly message + Back Home button

### NPM Packages Used
| Package | Purpose |
|---------|---------|
| react + react-dom | Core UI |
| react-router-dom | Client-side routing (SPA) |
| @tanstack/react-query | Server state & caching |
| axios | HTTP client |
| better-auth | Authentication client (email/password + Google) |
| framer-motion | Animations |
| react-hot-toast | Toast notifications (no default alerts, per PDF) |
| lucide-react | Icons |
| vite | Build tool |

### Setup
```bash
git clone <your-repo-url>
cd sportnest-client
npm install
cp .env.example .env
# Fill in .env values (see below)
npm run dev
```

### Environment Variables (.env)
```
VITE_API_URL=https://sportnest-server.vercel.app/api
VITE_BETTER_AUTH_URL=https://sportnest-server.vercel.app
VITE_IMGBB_API_KEY=your_imgbb_api_key
```

### Routes
| Route | Access | Description |
|-------|--------|--------------|
| `/` | Public | Home — banner, featured facilities, steps, testimonials |
| `/facilities` | Public | All facilities — search + filter + pagination |
| `/facility/:id` | Private | Facility detail + booking form |
| `/add-facility` | Private | Add new facility |
| `/manage-facilities` | Private | Edit/delete owned facilities |
| `/my-bookings` | Private | View/cancel bookings |
| `/login` | Public | Email + Google login |
| `/register` | Public | Register with password validation |
| `*` | Public | Custom 404 page |
