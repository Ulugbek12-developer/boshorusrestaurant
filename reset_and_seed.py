import os
import glob
import subprocess
import django

# 1. Clean up
if os.path.exists('db.sqlite3'):
    os.remove('db.sqlite3')
    print("Deleted db.sqlite3")

for f in glob.glob('core/migrations/0*.py'):
    os.remove(f)
    print(f"Deleted migration: {f}")

# 2. Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_backend.settings')
try:
    # Run migrations using subprocess to ensure clean state
    subprocess.run(['.\\venv\\Scripts\\python.exe', 'manage.py', 'makemigrations', 'core'], check=True)
    subprocess.run(['.\\venv\\Scripts\\python.exe', 'manage.py', 'migrate'], check=True)
    
    django.setup()
    from core.models import Category, Food, Branch
    
    # 3. Seed Branches
    branches = [
        {'name': 'Bosphorus Central', 'address': 'Amir Temur ko\'chasi, 12-uy', 'phone': '+998 71 123 45 67', 'working_hours': '09:00 - 23:00'},
        {'name': 'Bosphorus Chilanzar', 'address': 'Chilonzor 2-kvartal', 'phone': '+998 71 765 43 21', 'working_hours': '10:00 - 22:00'}
    ]
    for b in branches:
        Branch.objects.get_or_create(**b)
    print("Branches seeded.")

    # 4. Seed Categories
    c1, _ = Category.objects.get_or_create(name_uz='Fast Food', name_ru='Фаст Фуд', name_en='Fast Food')
    c2, _ = Category.objects.get_or_create(name_uz='Milliy taomlar', name_ru='Национальные блюда', name_en='National Foods')
    c3, _ = Category.objects.get_or_create(name_uz='Ichimliklar', name_ru='Напитки', name_en='Drinks')
    c4, _ = Category.objects.get_or_create(name_uz='Desertlar', name_ru='Десерты', name_en='Desserts')

    # 5. Seed Foods
    foods = [
        {'category': c1, 'name_uz': 'Premium Wagyu Burger', 'name_ru': 'Вагю Бургер', 'name_en': 'Premium Wagyu Burger', 'price': 120000, 'rating': 4.9, 'image': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'},
        {'category': c2, 'name_uz': 'Tashkent Plov', 'name_ru': 'Ташкентский Плов', 'name_en': 'Tashkent Plov', 'price': 45000, 'rating': 4.8, 'image': 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=800'},
        {'category': c4, 'name_uz': 'Chocolate Lava Cake', 'name_ru': 'Шоколадный торт', 'name_en': 'Chocolate Lava Cake', 'price': 35000, 'rating': 5.0, 'image': 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800'},
        {'category': c3, 'name_uz': 'Fresh Mojito', 'name_ru': 'Свежий Мохито', 'name_en': 'Fresh Mojito', 'price': 20000, 'rating': 4.6, 'image': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800'}
    ]
    for f in foods:
        Food.objects.create(**f)
    print("Foods seeded successfully!")

except Exception as e:
    print(f"Error: {e}")
