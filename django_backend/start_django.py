#!/usr/bin/env python
"""
Django development server startup script
"""
import os
import sys
import subprocess

def main():
    """Run Django development server"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'curry_world_backend.settings')
    
    # Install requirements if needed
    try:
        import django
        import rest_framework
        import corsheaders
    except ImportError:
        print("Installing requirements...")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
    
    # Run migrations
    print("Running migrations...")
    subprocess.check_call([sys.executable, 'manage.py', 'migrate'])
    
    # Start development server
    print("Starting Django development server on http://127.0.0.1:8000")
    subprocess.check_call([sys.executable, 'manage.py', 'runserver', '8000'])

if __name__ == '__main__':
    main()
