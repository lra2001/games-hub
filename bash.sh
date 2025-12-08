#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install required Python packages
pip install -r requirements.txt

# Build frontend assets
cd frontend
npm install
npm run build
cd ..

# Create a staticfiles folder and convert static asset files
python manage.py collectstatic --no-input

# Apply any outstanding database migrations
python manage.py migrate