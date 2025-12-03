# Games Hub

A **Progressive Web Application (PWA)** built using **Django (backend)** and **React + Vite (frontend)**.
The app aims to provide a centralized platform for gamers to connect, review games, and track gaming activities with personalized dashboards.

---

## Tech Stack

| Layer | Technology | Description |
|--------|-------------|-------------|
| **Frontend** | React + Vite | Modern, fast frontend with modular components |
| **Backend** | Django + Django REST Framework | Provides API endpoints and business logic |
| **Database** | PostgreSQL | Relational database for structured data |
| **Environment** | Python, Node.js, npm | Backend and frontend runtime environments |
| **UI Frameworks** | Bootstrap 5, Bootstrap Icons | Responsive and accessible design components |
| **Version Control** | Git + GitHub | Code management and collaboration |
| **Deployment (Planned)** | Render (Backend), Netlify/Vercel (Frontend) | Scalable hosting for both layers |
| **Extras** | dotenv, psycopg2, DRF, PWA manifest | Secure configuration and offline support |

---

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/lra2001/games-hub
cd games-hub
```

### 2. Create and Activate Virtual Environment
```bash
python -m venv venv
```
**Windows:**
```bash
venv\Scripts\activate
```

### 3. Upgrade pip
```bash
python -m pip install --upgrade pip
```

### 4. Install Django + DRF + environment + DB support
```bash
pip install django djangorestframework python-dotenv psycopg2-binary django-cors-headers djangorestframework-simplejwt
```

### 5. Create Django Project
```bash
django-admin startproject backend .
```

### 6. Configure PostgreSQL Database
Create a `.env` file in your project root:
```env
ENGINE=django.db.backends.postgresql
NAME=postgres
USER=masteruser
PASSWORD=12345678
HOST=localhost
PORT=5432
```

Update `settings.py`:
```python
import os
from dotenv import load_dotenv
load_dotenv()

DATABASES = {
    'default': {
        'ENGINE': os.getenv('ENGINE'),
        'NAME': os.getenv('NAME'),
        'USER': os.getenv('USER'),
        'PASSWORD': os.getenv('PASSWORD'),
        'HOST': os.getenv('HOST'),
        'PORT': os.getenv('PORT'),
    }
}
```

### 7. Apply Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 8. Create Superuser
```bash
python manage.py createsuperuser
```

### 9. Create apps (i.e. users)
```bash
python manage.py startapp users
```

---

## Frontend Setup (React + Vite)

### 1. Create React App
In your project root type:
```bash
npm create vite@latest frontend -- --template react
```

And select the options below:
```bash
Select a framework: React
Select a variant: JavaScript
Use rolldown-vite (Experimental)?: No
Install with npm and start now? Yes
Click http://localhost:5173/ to run app
```

### 2. Run Development Server
```bash
npm run dev
```

## Automated Tests Summary
Automated tests were implemented using Django’s built-in unittest framework and Django REST Framework’s APITestCase. Tests focus on ensuring that authentication, library management, and external API integration behave correctly under different scenarios.

### 1. Users App
Includes tests for:
- User registration
- JWT login (token generation)
- Authenticated profile access (/api/users/me/)
- Password validation & unique email constraints

These tests confirm that the authentication system is secure, consistent, and follows the expected workflow.

### 2. Library App
Covers:
- Authentication enforcement for all library endpoints
- Creating, listing, and deleting library items
- Adding items using the add-from-rawg/ endpoint
- Validating duplicate entries
- Ensuring correct filtering by user

RAWG API calls are mocked to prevent external dependencies during testing.

### 3. Games App
Tests the game search endpoint:
- /api/games/search/?query= returns expected structure
- RAWG API responses are mocked using unittest.mock.patch
- Ensures backend handles external API failures gracefully

### 4. How to run tests
You can run app specific tests or all by using the commands below:

Test specific App:
```bash
python manage.py test users
python manage.py test library
python manage.py test games
```

Run all Tests:
```bash
python manage.py test
```

### 5. Tools Used
- unittest — Python’s built-in testing framework
- rest_framework.test.APITestCase — DRF utilities for API testing
- unittest.mock.patch — Mocks external RAWG API calls

### 6. Planned Future Tests
- Frontend component tests (React Testing Library)
- Browser-based tests for PWA functionality
- Performance tests for the games search endpoint
- Integration tests for full "search → detail → add to library" workflow

---

## Progressive Web App (PWA)

The goal is to make the app installable and available offline using:
- **`vite-plugin-pwa`**
- Service Worker for caching
- `manifest.json` for icons and app metadata

---

## Features (Planned)

- User authentication & profile management
- Browse and review games
- Rate and comment on games
- Dashboard for user activity
- PWA support (installable and offline-ready)
- API integration for external game data
- Add tests
  - Create account
  - Log in/ Log Out
  - Edit Account
  - Navigate through different tabs
  - Search for games

## Future Features
- 2FA
- Moderate reviews (edit/delete reviews)
- TOS (able to sanction accounts)

## Resources
### w3schools
- [Python](https://www.w3schools.com/python/default.asp)
- [Python RegEx](https://www.w3schools.com/python/python_regex.asp)
- [Django](https://www.w3schools.com/django/index.php)
- [postgreSQL](https://www.w3schools.com/postgresql/index.php)
- [React](https://www.w3schools.com/react/default.asp)
- [Node.js](https://www.w3schools.com/nodejs/)
- [npm](https://www.w3schools.com/whatis/whatis_npm.asp)
- [Bootsrap 5](https://www.w3schools.com/bootstrap5/)


### Official Documentation
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django re-path()](https://docs.djangoproject.com/en/5.2/ref/urls/#re-path)
- [Class-based views](https://docs.djangoproject.com/en/5.2/topics/class-based-views/#usage-in-your-urlconf)
- [PostgreSQL](https://www.postgresql.org/)
- [Psycopg](https://www.psycopg.org/docs/install.html)
- [nodeJS](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- [npm](https://docs.npmjs.com/)
- [React](https://react.dev/)
- [Vite](https://vite.dev/guide/)
- [PWA Vite Plugin](https://vite-pwa-org.netlify.app/)
- [PWA - Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app)
- [React Router](https://reactrouter.com/home)
- [Bootstrap 5](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [git](https://git-scm.com/docs)
- [GitHub](https://github.com/)
- [Render](https://render.com/docs)

### Installation
- [psycopg2](https://pypi.org/project/psycopg2/)
- [python-dotenv](https://pypi.org/project/python-dotenv/)
- [react-router](https://www.npmjs.com/package/react-router)
- [@popperjs/core](https://www.npmjs.com/package/@popperjs/core)
- [bootstrap](https://www.npmjs.com/package/bootstrap?activeTab=versions)

## Known Issues

- TBC