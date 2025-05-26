
from rest_framework import serializers
from .models import *

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price',  'category', 'main_image', 'type_sport', 'images', 'quantity', 'is_active']
        
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
 
        
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    
    
    def create(self, valdated_data):
        password = valdated_data.pop('password', None)
        instance = self.Meta.model(**valdated_data)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
        