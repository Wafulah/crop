from django.urls import path 
from crop_api import views 
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index),
    path('predict', views.predict_crop_status),
    path('predict_yield', views.predict_yield_status),
    path('predict_status', views.predict_status),
    path('predict_status_get', views.predict_status_get.as_view(),name='predict_status_get'),
    path('predict_price', views.predict_price_status)
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)