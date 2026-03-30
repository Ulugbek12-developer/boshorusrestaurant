from rest_framework import serializers
from .models import User, Category, Food, Comment, Branch, Booking, OrderItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class FoodSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Food
        fields = '__all__'

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('food', 'quantity', 'price')

class BookingSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, required=False)
    
    class Meta:
        model = Booking
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        booking = Booking.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(booking=booking, **item_data)
        # Barcha itemlar saqlangach, Telegram xabarini yuboramiz
        booking.send_telegram_notification()
        return booking
