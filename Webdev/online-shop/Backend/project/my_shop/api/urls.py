from django.contrib import admin
from django.urls import path
from .views import *
from . import views

urlpatterns = [
    path('products/', ProductViewSet.as_view()),
    path('categories/', CategoryViewSet.as_view()),
    path('products/<int:pk>/', ProductViewSet.as_view()),
    path('categories/<int:id>/', CategoryViewSet.as_view()),
    path('categories/<int:category_id>/products/', ProductCategoryViewSet.as_view()),
    path('register_user/', views.create_user, name='register'),
    path('login_user/', views.login_user, name='login'),
    path('get_user/', views.get_user, name='get_user'),
    path('logout_user/', views.logout_user, name='logout'),
    
    
]