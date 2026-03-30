import os
import glob
import subprocess
import django

# Clean up migrations only (since DB might be locked by runserver)
print("Cleaning up migrations...")
for f in glob.glob('core/migrations/0*.py'):
    try:
        os.remove(f)
        print(f"Deleted migration: {f}")
    except Exception as e:
        print(f"Could not delete {f}: {e}")

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_backend.settings')
try:
    python_exe = '.\\venv\\Scripts\\python.exe'
    
    # 1. Create clean migrations
    print("Creating migrations...")
    subprocess.run([python_exe, 'manage.py', 'makemigrations', 'core'], check=True)
    
    # 2. Run migrations
    print("Migrating...")
    subprocess.run([python_exe, 'manage.py', 'migrate'], check=True)
    
    # 3. Clear existing data (Flush)
    print("Flushing data...")
    subprocess.run([python_exe, 'manage.py', 'flush', '--no-input'], check=True)
    
    # 4. Seed data
    django.setup()
    from core.models import Category, Food, Branch
    
    print("Seeding branches with Maps...")
    branches = [
        {
            'name': 'Bosphorus Central', 
            'address': 'Amir Temur ko\'chasi, 12-uy', 
            'phone': '+998 71 123 45 67', 
            'working_hours': '09:00 - 23:00',
            'map_url': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11985.228514571932!2d69.2625126!3d41.311081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b2931af3413%3A0xeed7ea2e6302f232!2sTashkent%20City!5e0!3m2!1sen!2s!4v1711732000000'
        },
        {
            'name': 'Bosphorus Chilanzar', 
            'address': 'Chilonzor 2-kvartal', 
            'phone': '+998 71 765 43 21', 
            'working_hours': '10:00 - 22:00',
            'map_url': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000.418254641908!2d69.2125123!3d41.2825125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8a6b2a30ca17%3A0x40d9016b2a30ca17!2sChilonzor%2C%20Tashkent!5e0!3m2!1sen!2s!4v1711732000000'
        }
    ]
    for b in branches:
        Branch.objects.get_or_create(**b)
        
    print("Seeding foods...")
    c1, _ = Category.objects.get_or_create(name_uz='Fast Food', name_ru='Фаст Фуд', name_en='Fast Food')
    c2, _ = Category.objects.get_or_create(name_uz='Milliy taomlar', name_ru='Национальные блюда', name_en='National Foods')
    c3, _ = Category.objects.get_or_create(name_uz='Ichimliklar', name_ru='Напитки', name_en='Drinks')
    c4, _ = Category.objects.get_or_create(name_uz='Desertlar', name_ru='Десерты', name_en='Desserts')

    foods = [
        {'category': c1, 'name_uz': 'Premium Wagyu Burger', 'name_ru': 'Вагю Бургер', 'name_en': 'Premium Wagyu Burger', 'price': 120000, 'rating': 4.9, 'image': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'},
        {'category': c2, 'name_uz': 'Tashkent Plov', 'name_ru': 'Ташкентский Плов', 'name_en': 'Tashkent Plov', 'price': 45000, 'rating': 4.8, 'image': 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=800'},
        {'category': c4, 'name_uz': 'Chocolate Lava Cake', 'name_ru': 'Шоколадный торт', 'name_en': 'Chocolate Lava Cake', 'price': 35000, 'rating': 5.0, 'image': 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800'},
        {'category': c3, 'name_uz': 'Fresh Mojito', 'name_ru': 'Свежий Мохито', 'name_en': 'Fresh Mojito', 'price': 20000, 'rating': 4.6, 'image': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800'}
    ]
    for f in foods:
        Food.objects.get_or_create(**f)
    print("SUCCESS: Full reset and seeding complete!")

except Exception as e:
    print(f"FAILED: {e}")
