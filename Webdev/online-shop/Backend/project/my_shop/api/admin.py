from django.contrib import admin
from .models import Product, Category, CustomUser, Cart, CartItem
from django.contrib.auth.models import User as AuthUser


# Register your models here.

admin.site.register(Product)
admin.site.register(Category)
admin.site.register(CustomUser)
admin.site.register(Cart)
admin.site.register(CartItem)
