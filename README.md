# Games Hub

A **Progressive Web Application (PWA)** built using **Django (backend)** and **React + Vite (frontend)**.
The app aims to provide a centralized platform for gamers to find games available in the market. Games include general information such as Game Name, Platforms where they are available, Rating, Descrpition and, if avaialable, screenshots and videos/trailers.
If users decide to log in, they are able to add games to their Wishlist, Favorites or mark them as Played. They can also edit their profile and select a profile image from the avatars provided.

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

## Features

- User authentication & profile management
- Browse and search games - includes game name, description, platforms, genre, screenshots and videos/trailers
- Add games to Wishlist, Favorite and Played (authenticated users)
- Header includes "Home" icon, Search, Avatar/Username, Dashboard, Profile and Auth Links (Login, Register, Logout)
- Dashboard includes player lists and profile management (authenticated users)
- Filters and pagination are available on Home and search. These are included in the URL to easily bookmark pages
- Password reset request - sent via email
- Handle 404 - Page not Found
- PWA support (installable and offline-ready)
- API integration for external game data - [Rawg.io](https://rawg.io/)
- Add tests
  - Create account
  - Log in/ Log Out
  - Edit Account
  - Navigate through different tabs
  - Search for games

## Future Features
- 2FA

---

## Known Issues

- Total number of pages is not accurate when filters are used as it counts the total of pages from the API. Still allows you to click "Next" but it will return "No results"

---

## Folder Structure (Planned)

```
games-hub/
├── backend/
│   ├──
│   ├──
│   ├──
├── frontend/
│   ├── src/
│   ├── ├── assets/
│   ├── ├── components/
│   ├── ├── pages/
│   ├── ├── services/
│   ├── ├── styles/
│   ├── └── App.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── games/
├── library/
├── templates/
├── users/
├── .gitignore
├── maange.py
├── README.md
```

## ERD

![GamesHubERD image](GamesHubERD.png)

## Automated Tests Summary
Automated tests were implemented using Django's built-in unittest framework and Django REST Framework's APITestCase. Tests focus on ensuring that authentication, library management, and external API integration behave correctly under different scenarios.

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
- unittest — Python's built-in testing framework
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


### Images
- [Freepik - Avatars](https://www.freepik.com/)
- [Image Convert - Convert images from jpg to png](https://www.imageconvert.org/)
- [Image Resizer - Resize Images](https://imageresizer.com/)

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
SECRET_KEY=your-secret-key
DEBUG=True
ENGINE=django.db.backends.postgresql
NAME=postgres
USER=masteruser
PASSWORD=12345678
HOST=localhost
PORT=5432

RAWG_API_KEY=your_rawg_api_key
RAWG_BASE_URL=https://api.rawg.io/api

FRONTEND_URL=http://localhost:5173

# Email (for password reset)
EMAIL_USER=your_smtp_user
EMAIL_PASS=your_smtp_password
DEFAULT_FROM_EMAIL="GamesHub <no-reply@gameshub.com>"
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

### 3. Configure Proxy for API Requests
Edit `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const baseURL = 'http://127.0.0.1:8000'
const arrayApiTantoFaz = ['/users']

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: Object.fromEntries(
      arrayApiTantoFaz.map((path) => [
        path,baseURL
      ])
    ),
  },
})
```

This allows React (port 5173) to communicate with Django (port 8000) without CORS issues.

---

## Create Django app
### 1. Create first Django app (i.e. users)
```bash
python manage.py startapp users
```

### 2. Add new app to settings.py
```python
INSTALLED_APPS = [
    ...
    'rest_framework',
    'users',
]
```

### 3. Create test for endpoint
```python
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.

@api_view(['GET'])
def users(request):
    return Response({'message': 'Users load correctly!'})
```

### 4. Create urls.py for new app
```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.users, name='users'),
]
```

### 5. Include urls.py from users on project (backend/urls.py)
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
]
```

### 6. Test endpoint
```bash
python manage.py runserver
```
Access http://127.0.0.1:8000/users and confirm response "{"message": "Users load correctly!"}"

### 7. Test connection from React by editing frontend/src/App.jsx
```jsx
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return <h1>Backend says: {message}</h1>;
}

export default App;
```

Open a new terminal while the Django app is running and type npm run dev. Page should display "Backend says: test completed successfully"

### 8. Update tests to use Django REST framework
users/views.py
```python
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.

@api_view(['GET'])
def users(request):
    return Response({'message': 'Users load correctly!'})
```

users/urls.py
```python
from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.users, name='users'),
]
```

---

## react-router-dom
### 1. Install react-router-dom
In terminal, on the root folder, type:
```bash
cd .\frontend\
npm install react-router-dom
```

### 2. Import react-router-dom
Edit /frontend/App.jsx
```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
```

## CSS, Bootstrap and JS
### 1. Add global css
Create global.css file in /frontend/src/styles/

### 2. Update app css
Update app.css to display full width

### 3. Add Bootstrap CSS and JS bundle
```bash
npm i @popperjs/core
npm i bootstrap
```

## Connect to RAWG
### 1. Create rawg.js
```js
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export async function fetchGames(query = "", page = 1, pageSize = 10) {
  try {
    const response = await fetch(
      `${BASE_URL}/games?key=${API_KEY}&search=${query}&page=${page}&page_size=${pageSize}`
    );
    if (!response.ok) throw new Error("Failed to fetch games");
    const data = await response.json();
    return {
      results: data.results,
      next: data.next,
      previous: data.previous
    };
  } catch (error) {
    console.error(error);
    return { results: [], next: null, previous: null };
  }
}
```