import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_backend.settings')
django.setup()

from core.models import Branch

branches = [
    {
        'name': 'Bosphorus Central',
        'address': 'Amir Temur ko\'chasi, 12-uy',
        'phone': '+998 71 123 45 67',
        'working_hours': '09:00 - 23:00'
    },
    {
        'name': 'Bosphorus Chilanzar',
        'address': 'Chilonzor 2-kvartal',
        'phone': '+998 71 765 43 21',
        'working_hours': '10:00 - 22:00'
    }
]

for b in branches:
    obj, created = Branch.objects.get_or_create(**b)
    if created:
        print(f"Created branch: {obj.name}")
    else:
        print(f"Branch already exists: {obj.name}")
