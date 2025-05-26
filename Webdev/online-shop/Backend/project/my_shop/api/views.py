from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Product, Category
from .serializers import *
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import api_view
import jwt, datetime


# Create your views here.


class ProductViewSet(APIView):
    
    def get(self, request, pk=None):
        if pk is not None:
            try:
                product = Product.objects.get(pk=pk)
                serializer = ProductSerializer(product)
                return Response(serializer.data)
            except Product.DoesNotExist:
                return Response({"error": "Product not found"}, status=404)
        else:
            products = Product.objects.all()
            serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    
class CategoryViewSet(APIView):
    
    def get(self, request, id=None):
        if id is not None:
            try:
                category = Category.objects.get(pk=id)
                serializer = CategorySerializer(category)
                return Response(serializer.data)
            except Category.DoesNotExist:
                return Response({"error": "Category not found"}, status=404)
        else:
            categories = Category.objects.all()
            serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    
class ProductCategoryViewSet(APIView):
    
    def get(self, request, category_id = None):
        if category_id is not None:
            try:
                products = Product.objects.filter(category_id = category_id)
                serializer = ProductSerializer(products, many=True)
                return Response(serializer.data)
            except Product.DoesNotExist:
                return Response({"error": "Product not found"}, status=404)




@api_view(['POST'])
def create_user(request):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)  


@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = CustomUser.objects.get(email=email)

        if user.check_password(password):
            payload = {
                'user_id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }
            jwt_token = jwt.encode(payload, 'secret', algorithm='HS256')

            return Response({'token': jwt_token}, status=200)
        else:
            return Response({"error": "Invalid password"}, status=400)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)



@api_view(['GET'])
def get_user(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({"error": "No token provided"}, status=401)

    token = auth_header.split(' ')[1]

    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        user = CustomUser.objects.get(id=payload['user_id'])
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=200)
    except jwt.ExpiredSignatureError:
        return Response({"error": "Token expired"}, status=401)
    except jwt.InvalidTokenError:
        return Response({"error": "Invalid token"}, status=401)

    

    
    
@api_view(['POST'])

def logout_user(request):
    response = Response()
    response.delete_cookie('jwt')
    response.data = {
        'message': 'User logged out successfully'
    }
    return response