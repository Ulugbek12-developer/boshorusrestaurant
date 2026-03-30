import os
import glob
import subprocess
import shutil

# 1. DELETE DB and Migrations folder contents entirely
if os.path.exists('db.sqlite3'):
    os.remove('db.sqlite3')
    print("Deleted db.sqlite3")

# Delete everything in core/migrations/ except __init__.py
migrations_path = 'core/migrations'
if os.path.exists(migrations_path):
    for f in os.listdir(migrations_path):
        if f != '__init__.py' and not f.startswith('__pycache__'):
            full_path = os.path.join(migrations_path, f)
            if os.path.isfile(full_path):
                os.remove(full_path)
    print("Cleaned migrations folder.")

# 2. RUN DJANGO COMMANDS
python_exe = '.\\venv\\Scripts\\python.exe'
try:
    print("Running makemigrations...")
    subprocess.run([python_exe, 'manage.py', 'makemigrations', 'core'], check=True)
    print("Running migrate...")
    subprocess.run([python_exe, 'manage.py', 'migrate'], check=True)
    
    # 3. SEED DATA
    print("Seeding data...")
    subprocess.run([python_exe, 'seed_branches.py'], check=True)
    subprocess.run([python_exe, 'seed_foods.py'], check=True)
    print("SUCCESS: Site data restored!")

except Exception as e:
    print(f"FAILED: {e}")
