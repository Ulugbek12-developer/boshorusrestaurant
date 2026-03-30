from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, FoodViewSet, CommentViewSet, BranchViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'menu', FoodViewSet, basename='food')
router.register(r'comments', CommentViewSet)
router.register(r'branches', BranchViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
