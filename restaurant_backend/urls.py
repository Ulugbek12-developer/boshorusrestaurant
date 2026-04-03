from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.views.generic import TemplateView

urlpatterns = [
    # Django Admin paneli
    path('django-admin/', admin.site.urls),

    # REST API endpoints
    path('api/', include('core.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Media fayllar (rasm, video)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# React SPA - barcha qolgan URL lar index.html ga yo'naltiriladi
# Bu DOIM eng oxirida bo'lishi shart!
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='frontend'),
]
