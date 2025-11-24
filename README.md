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