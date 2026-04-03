from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from modeltranslation.admin import TranslationAdmin
from .models import User, Category, Food, Comment, Branch, Booking, OrderItem

admin.site.register(User, UserAdmin)

@admin.register(Category)
class CategoryAdmin(TranslationAdmin):
    pass

@admin.register(Food)
class FoodAdmin(TranslationAdmin):
    list_display = ('name', 'price', 'category', 'rating')
    list_filter = ('category',)
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'food', 'rating', 'created_at')
    list_filter = ('food', 'rating')
    search_fields = ('user_name', 'text')

@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'phone')

# TableAdmin o'chirildi chunki Pillow talab qiladi

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    class OrderItemInline(admin.TabularInline):
        model = OrderItem
        extra = 0
    inlines = [OrderItemInline]
    list_display = ('user_name', 'phone', 'date', 'time', 'people_count', 'status')
    list_filter = ('date', 'status')
    search_fields = ('user_name', 'phone')
    actions = ['confirm_bookings', 'reject_bookings']

    @admin.action(description="Tanlangan zakazlarni tasdiqlash")
    def confirm_bookings(self, request, queryset):
        count = queryset.update(status='accepted')
        # trigger save for each to send telegram notification
        for obj in queryset:
            obj.status = 'accepted'
            obj.save()
        self.message_user(request, f"{count} ta zakaz tasdiqlandi va Telegramga yuborildi.")

    @admin.action(description="Tanlangan zakazlarni rad etish")
    def reject_bookings(self, request, queryset):
        count = queryset.update(status='rejected')
        self.message_user(request, f"{count} ta zakaz rad etildi.")
