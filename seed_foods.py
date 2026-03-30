import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_backend.settings')
django.setup()

from core.models import Category, Food

# Categories
cat1, _ = Category.objects.get_or_create(name_uz='Fast Food', name_ru='Фаст Фуд', name_en='Fast Food')
cat2, _ = Category.objects.get_or_create(name_uz='Milliy taomlar', name_ru='Национальные блюда', name_en='National Foods')
cat3, _ = Category.objects.get_or_create(name_uz='Ichimliklar', name_ru='Напитки', name_en='Drinks')
cat4, _ = Category.objects.get_or_create(name_uz='Desertlar', name_ru='Десерты', name_en='Desserts')

# Foods with HD Images
foods = [
    {
        'id': 1, 'category': cat1, 'name_uz': 'Premium Wagyu Burger', 
        'name_ru': 'Вагю Бургер', 'name_en': 'Premium Wagyu Burger', 'price': 120000, 'rating': 4.9,
        'image': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
    },
    {
        'id': 2, 'category': cat2, 'name_uz': 'Tashkent Plov', 
        'name_ru': 'Ташкентский Плов', 'name_en': 'Tashkent Plov', 'price': 45000, 'rating': 4.8,
        'image': 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=800'
    },
    {
        'id': 3, 'category': cat4, 'name_uz': 'Chocolate Lava Cake', 
        'name_ru': 'Шоколадный торт', 'name_en': 'Chocolate Lava Cake', 'price': 35000, 'rating': 5.0,
        'image': 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800'
    },
    {
        'id': 4, 'category': cat3, 'name_uz': 'Fresh Mojito', 
        'name_ru': 'Свежий Мохито', 'name_en': 'Fresh Mojito', 'price': 20000, 'rating': 4.6,
        'image': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800'
    },
]

for f_data in foods:
    f_id = f_data.pop('id')
    Food.objects.update_or_create(id=f_id, defaults=f_data)

print("Food Database updated with HD images successfully!")
