# Games Hub

A **Progressive Web App (PWA)** where you can search for games, view rich details (screenshots, trailers, YouTube videos) and manage personal lists: **Wishlist**, **Favorites**, and **Played**.

- **Frontend:** React + Vite (PWA, client-side routing, custom responsive CSS)
- **Backend:** Django + Django REST Framework (JWT auth, RAWG proxy)
- **Database:** PostgreSQL
- **Deployment:** Render (separate backend & frontend services)

---

## Live Demo

- **Frontend (PWA):** `https://games-hub-1.onrender.com`
- **Backend API:** `https://games-hub-awb2.onrender.com/api/`
- **Django Admin:** `https://games-hub-awb2.onrender.com/admin/`

(Access to admin requires a superuser account. Can login with 'admin' 'testPwd!')

---

## Tech Stack

| Layer        | Technology                                      | Notes                                       |
| ------------ | ----------------------------------------------- | ------------------------------------------- |
| Frontend     | React, Vite, React Router, axios               | SPA, client-side routing, PWA support       |
| Styling      | Custom CSS (global.css)                        | Responsive layout, header, dashboard, cards |
| Backend      | Django, Django REST Framework                  | REST API + business logic                   |
| Auth         | djangorestframework-simplejwt (JWT)            | Login, protected endpoints                  |
| Database     | PostgreSQL                                     | Via `psycopg2` / `dj-database-url`          |
| CORS / Static| django-cors-headers, WhiteNoise                | CORS + static file serving                  |
| External API | RAWG.io                                        | Game data (search, details, media)          |
| PWA          | vite-plugin-pwa                                | Manifest, service worker                    |
| Config       | python-dotenv                                  | `.env`-driven configuration                 |

---

## Features

- User registration, login and profile management (including avatar selection)
- Search a large games catalogue (via RAWG) with:
  - Name, platforms, genres, rating
  - Description, screenshots, trailers, YouTube videos
- Add games to:
  - **Wishlist**
  - **Favorites**
  - **Played**
- Personalized **Dashboard** with sidebar:
  - Separate views: Wishlist / Favorites / Played / Profile
  - Counts for each list (e.g. `Wishlist (7)`)
- Filters & pagination on **Home** and **Search** pages:
  - Filter by rating bands, platform and genre
  - Pagination with URL query parameters (shareable URLs)
- Password reset flow:
  - Request reset by email
  - Reset form with validation
- 404 “Not Found” page with a fun shaking gamer illustration
- PWA:
  - Installable on mobile/desktop
  - Manifest + icons + screenshots
  - Service worker via `vite-plugin-pwa`
- Test coverage for core backend apps (users, library, games)

### Known Limitations

- When filters are applied, the **total pages** in pagination still reflect the RAWG API total count, not the filtered subset. Clicking **Next** too far may show “No results” even if the UI still shows more pages.

### Future Features
- Implement Two-Factor authentication

---

## Local Development

### 1. Clone & Enter Project

```bash
git clone https://github.com/lra2001/games-hub.git
cd games-hub
```

### 2. Backend Setup (Django)

Create a virtual environment, install dependencies and run migrations:

```bash
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

python -m pip install --upgrade pip
pip install -r requirements.txt

python manage.py migrate
python manage.py createsuperuser
```

### 3. Backend Environment Variables

Create a `.env` file in the project root (same folder as `manage.py`). Example:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True

# ---------- Database ----------
DB_ENGINE=django.db.backends.postgresql
DB_NAME=games_hub
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# ---------- RAWG API ----------
RAWG_API_KEY=your-rawg-api-key
RAWG_BASE_URL=https://api.rawg.io/api

# ---------- Frontend / CORS ----------
FRONTEND_URL=http://localhost:5173

# ---------- Email (Password Reset) ----------
EMAIL_USER=your-smtp-user
EMAIL_PASS=your-smtp-password
DEFAULT_FROM_EMAIL=GamesHub <no-reply@gameshub.com>
```

In development the email backend can be left as console:

```python
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
```

For production, switch to SMTP as needed.

### 4. Frontend Setup (React + Vite)

From the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

Vite will start on `http://localhost:5173` by default.

### 5. Run Backend

In a separate terminal from the project root (with `venv` activated):

```bash
python manage.py runserver
```

You should now have:

- Backend API at: `http://127.0.0.1:8000/api/`
- Frontend at: `http://localhost:5173`

---

## Production Notes

### Render Architecture

The project is deployed as **two services** on Render:

1. **Backend (Python 3 / Django)**
   - Runs Gunicorn + Django
   - Exposes `/api/` and `/admin/`
   - Uses PostgreSQL via `DATABASE_URL`

2. **Frontend (Static site)**
   - Builds with `npm run build`
   - Serves the contents of `frontend/dist`
   - Talks to the backend via `VITE_BACKEND_URL`

### Backend Environment (Render)

Key env vars (example):

```env
SECRET_KEY=your-production-secret
DEBUG=False
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Where frontend is hosted
FRONTEND_URL=https://games-hub-1.onrender.com

RAWG_API_KEY=your-rawg-api-key

EMAIL_USER=your-smtp-user
EMAIL_PASS=your-smtp-password
DEFAULT_FROM_EMAIL=GamesHub <no-reply@gameshub.com>
```

Make sure these are configured in `backend/settings.py`:

- `ALLOWED_HOSTS` includes `.onrender.com`
- `CORS_ALLOWED_ORIGINS` includes:
  - `http://localhost:5173`
  - `https://games-hub-1.onrender.com`
- `CSRF_TRUSTED_ORIGINS` includes:
  - `https://games-hub-awb2.onrender.com`
  - `https://games-hub-1.onrender.com`

**Static files:**

```python
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}
```

In the Render build command for the backend, you’ll typically run:

```bash
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
```

### Frontend Environment (Render)

On the static site / frontend service:

```env
VITE_BACKEND_URL=https://games-hub-awb2.onrender.com
```

Build command:

```bash
npm install
npm run build
```

Render will serve the `dist` directory as a static site.

---

## Tests

Run all backend tests from the project root:

```bash
python manage.py test
```

Or per app:

```bash
python manage.py test users
python manage.py test library
python manage.py test games
```

Current coverage (high level):

- **users**
  - Registration and login with JWT
  - `users/me/` profile endpoint
  - Basic password rules
  - Password reset (request + confirm views)
- **library**
  - Adding/removing games
  - Status handling (wishlist, favorite, played)
  - User scoping and permissions
- **games**
  - Proxying RAWG search
  - Media endpoint (`/games/<id>/media/`)
  - Error handling when RAWG fails

Future improvements:

- React component tests with React Testing Library
  (e.g. `Header`, `GameSearch`, `Dashboard`)
- Basic end-to-end flows (login → add to wishlist → dashboard view)

---

## Project Structure

```text
games-hub/
├── backend/                    # Django project (settings, urls, wsgi)
├── games/                      # Games app (RAWG integration, search, media)
├── library/                    # Library app (wishlist, favorites, played)
├── users/                      # Users app (auth, profile, password reset)
├── manage.py
├── frontend/
│   ├── public/                 # PWA icons, static assets, manifest
│   ├── src/
│   │   ├── api/                # axios instance
│   │   ├── assets/             # default react.svg (not used in this project)
│   │   ├── auth/               # AuthContext, hooks
│   │   ├── components/         # Header, NotFound, etc.
│   │   ├── constants/          # Avatars, etc.
│   │   ├── hooks/              # useFormErrors, useLibraryActions, ...
│   │   ├── pages/              # Home, GameSearch, Dashboard, etc.
│   │   ├── styles/             # global.css
│   │   ├── utils/              # gameFilters, ...
│   │   └── main.jsx            # React entry point
│   ├── vite.config.js          # Vite + PWA config
│   └── package.json
├── templates/
│   └── emails/                 # HTML and text email templates (password reset)
├── bash.sh                     # Used as Build Command on Render (install requirements, frontend assets, static folder, make migrations)
├── GamesHubERD.png             # Database ER diagram
├── requirements.txt
└── README.md
```

---

## GamesHub ERD
![GamesHubERD image](GamesHubERD.png)

## Design & UX Notes

- **Header**
  - Desktop: logo, centered search bar, avatar/username, auth links
  - Mobile: logo + avatar/username + hamburger; search bar on its own row
- **Dashboard**
  - Vertical sidebar on desktop
  - Horizontal scrollable nav bar on mobile with concise labels
- **Game cards**
  - Fixed 16:9 image aspect ratio to avoid stretching/cropping
  - Clear action buttons for Wishlist / Favorite / Played
- **404 page**
  - Gamer “panic” illustration with a subtle shake animation on load

---

## Helpful Resources

### Official Docs

- [Django](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [React Router](https://reactrouter.com/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [RAWG API](https://rawg.io/apidocs)

### Community & Q&A

- [Stack Overflow — django](https://stackoverflow.com/questions/tagged/django)
- [Stack Overflow — reactjs](https://stackoverflow.com/questions/tagged/reactjs)
- [r/django](https://www.reddit.com/r/django/)
- [r/reactjs](https://www.reddit.com/r/reactjs/)
- [r/webdev](https://www.reddit.com/r/webdev/)

### Misc / Assets

- Avatar illustrations from Freepik
- Image tools: ImageConvert, ImageResizer for optimizing assets

---

## License

This project is for personal/learning use.
Contact the author if you’d like to reuse or extend it in another context.