from django.db import models
from django.contrib.auth.models import AbstractUser
import requests
from django.conf import settings

class User(AbstractUser):
    pass

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Food(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    # URLField - Pillow talab qilmaydi
    image = models.URLField(max_length=500, null=True, blank=True)
    rating = models.FloatField(default=0)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Comment(models.Model):
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=100)
    text = models.TextField()
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

class Branch(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    working_hours = models.CharField(max_length=100)
    map_url = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    user_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=50)
    date = models.DateField()
    time = models.TimeField()
    people_count = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f'{self.user_name} - {self.date} {self.time}'

    def send_telegram_notification(self):
        token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
        chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)
        if token and chat_id:
            items = self.items.all()
            items_text = "\n".join([f"- {item.food.name} x {item.quantity} ({item.price} so'm)" for item in items])
            total = sum(item.price * item.quantity for item in items)
            message = (
                f"🆕 YANGI BUYURTMA!\n\n"
                f"📍 Filial: {self.branch.name if self.branch else 'Tanlanmagan'}\n"
                f"👤 Mijoz: {self.user_name}\n"
                f"📞 Tel: {self.phone}\n"
                f"📅 Sana: {self.date}\n"
                f"⏰ Vaqt: {self.time}\n"
                f"👥 Mehmonlar: {self.people_count}\n\n"
                f"🍴 Buyurtmalar:\n{items_text}\n\n"
                f"💰 Jami: {total} so'm"
            )
            url = f"https://api.telegram.org/bot{token}/sendMessage"
            try:
                requests.post(url, data={'chat_id': chat_id, 'text': message})
            except Exception as e:
                print(f"Telegram error: {e}")

class OrderItem(models.Model):
    booking = models.ForeignKey(Booking, related_name='items', on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.food.name} x {self.quantity}"
