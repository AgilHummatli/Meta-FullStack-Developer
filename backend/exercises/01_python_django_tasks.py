# ============================================================
# META BACK-END — Python & Django Tasks
# Courses: Programming in Python + Django Web Framework + APIs
# 25 tasks covering: Python OOP, Django models/views,
#                    DRF serializers, API auth, testing
# ============================================================


# ── TASK 01 ─────────────────────────────────────────────────
# Decorators — measure execution time
import time
import functools

def timer(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = fn(*args, **kwargs)
        end = time.perf_counter()
        print(f"{fn.__name__} took {end - start:.4f}s")
        return result
    return wrapper

@timer
def slow_sum(n):
    return sum(range(n))

slow_sum(1_000_000)  # slow_sum took 0.0412s


# ── TASK 02 ─────────────────────────────────────────────────
# Context manager — auto-close file with error handling
class ManagedFile:
    def __init__(self, path, mode="r"):
        self.path = path
        self.mode = mode
        self.file = None

    def __enter__(self):
        self.file = open(self.path, self.mode)
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()
        if exc_type:
            print(f"Error: {exc_val}")
        return False  # don't suppress exceptions

# with ManagedFile("data.txt") as f:
#     content = f.read()


# ── TASK 03 ─────────────────────────────────────────────────
# Dataclass + property validation
from dataclasses import dataclass, field
from typing import List

@dataclass
class Product:
    name: str
    price: float
    tags: List[str] = field(default_factory=list)

    def __post_init__(self):
        if self.price < 0:
            raise ValueError(f"Price cannot be negative: {self.price}")
        self.name = self.name.strip()

    @property
    def discounted(self, pct=10):
        return round(self.price * (1 - pct / 100), 2)

p = Product("Book", 29.99, ["education", "python"])
print(p)  # Product(name='Book', price=29.99, tags=['education', 'python'])


# ── TASK 04 ─────────────────────────────────────────────────
# Generator — read large CSV file line by line
def read_csv(filepath):
    with open(filepath, "r") as f:
        headers = next(f).strip().split(",")
        for line in f:
            values = line.strip().split(",")
            yield dict(zip(headers, values))

# for row in read_csv("users.csv"):
#     print(row)


# ── TASK 05 ─────────────────────────────────────────────────
# Metaclass — auto-register subclasses
class PluginMeta(type):
    registry = {}
    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if bases:  # skip the base class itself
            mcs.registry[name] = cls
        return cls

class Plugin(metaclass=PluginMeta):
    def run(self): raise NotImplementedError

class EmailPlugin(Plugin):
    def run(self): print("Sending email...")

class SlackPlugin(Plugin):
    def run(self): print("Sending Slack message...")

print(PluginMeta.registry)  # {'EmailPlugin': ..., 'SlackPlugin': ...}


# ── TASK 06 ─────────────────────────────────────────────────
# Abstract base class — payment processors
from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    @abstractmethod
    def charge(self, amount: float) -> bool: ...

    @abstractmethod
    def refund(self, amount: float) -> bool: ...

    def process(self, amount: float) -> str:
        if self.charge(amount):
            return f"Charged ${amount:.2f} successfully"
        return "Charge failed"

class StripeProcessor(PaymentProcessor):
    def charge(self, amount):
        print(f"Stripe: charging ${amount:.2f}")
        return True
    def refund(self, amount):
        print(f"Stripe: refunding ${amount:.2f}")
        return True

class PayPalProcessor(PaymentProcessor):
    def charge(self, amount):
        print(f"PayPal: charging ${amount:.2f}")
        return True
    def refund(self, amount):
        print(f"PayPal: refunding ${amount:.2f}")
        return True

processor = StripeProcessor()
print(processor.process(49.99))


# ── TASK 07 ─────────────────────────────────────────────────
# Comprehensions + functional tools
from itertools import groupby
from operator import itemgetter

orders = [
    {"id": 1, "customer": "Alice", "total": 120.0},
    {"id": 2, "customer": "Bob",   "total": 45.0},
    {"id": 3, "customer": "Alice", "total": 80.0},
    {"id": 4, "customer": "Bob",   "total": 200.0},
]

# Total per customer
totals = {
    customer: sum(o["total"] for o in group)
    for customer, group in groupby(
        sorted(orders, key=itemgetter("customer")),
        key=itemgetter("customer")
    )
}
print(totals)  # {'Alice': 200.0, 'Bob': 245.0}


# ── TASK 08 ─────────────────────────────────────────────────
# Django Model — e-commerce
# models.py

from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    name        = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    stock       = models.PositiveIntegerField(default=0)
    category    = models.ForeignKey(Category, on_delete=models.SET_NULL,
                                    null=True, related_name="products")
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    @property
    def in_stock(self):
        return self.stock > 0

    def __str__(self):
        return self.name


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING   = "pending",   "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        SHIPPED   = "shipped",   "Shipped"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"

    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    status     = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())

    def __str__(self):
        return f"Order #{self.pk} — {self.user.username}"


class OrderItem(models.Model):
    order    = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product  = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price    = models.DecimalField(max_digits=10, decimal_places=2)  # snapshot at time of order

    @property
    def subtotal(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"


# ── TASK 09 ─────────────────────────────────────────────────
# Django ORM queries — common patterns
"""
# All products in a category
products = Product.objects.filter(category__slug="electronics")

# Products in stock, ordered by price
cheap_in_stock = Product.objects.filter(stock__gt=0).order_by("price")

# Orders with their items and products in one query (avoid N+1)
orders = Order.objects.select_related("user").prefetch_related("items__product")

# Total revenue
from django.db.models import Sum, F
revenue = OrderItem.objects.aggregate(
    total=Sum(F("price") * F("quantity"))
)

# Orders grouped by status
from django.db.models import Count
status_counts = Order.objects.values("status").annotate(count=Count("id"))

# Search by name (case-insensitive)
results = Product.objects.filter(name__icontains="laptop")
"""


# ── TASK 10 ─────────────────────────────────────────────────
# Django views — function-based + class-based
# views.py

from django.shortcuts import render, get_object_or_404
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse

def product_list(request):
    category_slug = request.GET.get("category")
    products = Product.objects.select_related("category")
    if category_slug:
        products = products.filter(category__slug=category_slug)
    return render(request, "products/list.html", {"products": products})


class OrderDetailView(LoginRequiredMixin, View):
    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        return render(request, "orders/detail.html", {"order": order})

    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        if order.status == Order.Status.PENDING:
            order.status = Order.Status.CANCELLED
            order.save()
            return JsonResponse({"status": "cancelled"})
        return JsonResponse({"error": "Cannot cancel this order"}, status=400)


# ── TASK 11 ─────────────────────────────────────────────────
# Django REST Framework — serializers
# serializers.py

from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "description", "price", "stock",
                  "in_stock", "category", "category_id", "created_at"]
        read_only_fields = ["created_at"]

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0.")
        return value


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "quantity", "price", "subtotal"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Order
        fields = ["id", "username", "status", "items", "total", "created_at"]
        read_only_fields = ["created_at", "user"]


# ── TASK 12 ─────────────────────────────────────────────────
# DRF ViewSets + custom actions
# views_api.py

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Product.objects.select_related("category")
        category = self.request.query_params.get("category")
        min_price = self.request.query_params.get("min_price")
        if category:
            qs = qs.filter(category__slug=category)
        if min_price:
            qs = qs.filter(price__gte=min_price)
        return qs

    @action(detail=False, methods=["get"])
    def in_stock(self, request):
        products = self.get_queryset().filter(stock__gt=0)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def restock(self, request, pk=None):
        product = self.get_object()
        qty = request.data.get("quantity", 0)
        product.stock += int(qty)
        product.save()
        return Response({"stock": product.stock})


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)\
                            .prefetch_related("items__product")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status != Order.Status.PENDING:
            return Response({"error": "Only pending orders can be cancelled"},
                            status=status.HTTP_400_BAD_REQUEST)
        order.status = Order.Status.CANCELLED
        order.save()
        return Response({"status": order.status})


# ── TASK 13 ─────────────────────────────────────────────────
# DRF JWT Authentication setup
# settings.py additions + token views
"""
INSTALLED_APPS += ["rest_framework_simplejwt"]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

# urls.py
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("api/auth/login/",   TokenObtainPairView.as_view()),
    path("api/auth/refresh/", TokenRefreshView.as_view()),
]
"""


# ── TASK 14 ─────────────────────────────────────────────────
# Custom permission classes
from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return obj.user == request.user


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return request.user and request.user.is_staff


# ── TASK 15 ─────────────────────────────────────────────────
# Django signals — auto-create profile + send welcome email
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio  = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        send_mail(
            subject="Welcome!",
            message=f"Hi {instance.username}, welcome to our platform.",
            from_email="noreply@example.com",
            recipient_list=[instance.email],
        )


# ── TASK 16 ─────────────────────────────────────────────────
# Custom Django management command
# management/commands/seed_products.py

from django.core.management.base import BaseCommand
import random

class Command(BaseCommand):
    help = "Seed the database with sample products"

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=20)

    def handle(self, *args, **options):
        count = options["count"]
        category, _ = Category.objects.get_or_create(name="General", slug="general")
        for i in range(count):
            Product.objects.create(
                name=f"Product {i+1}",
                price=round(random.uniform(5, 500), 2),
                stock=random.randint(0, 100),
                category=category,
            )
        self.stdout.write(self.style.SUCCESS(f"Created {count} products."))


# ── TASK 17 ─────────────────────────────────────────────────
# Django middleware — request logging
import logging
logger = logging.getLogger(__name__)

class RequestLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.perf_counter()
        response = self.get_response(request)
        duration = time.perf_counter() - start
        logger.info(
            f"{request.method} {request.path} "
            f"→ {response.status_code} ({duration*1000:.1f}ms) "
            f"[{request.user}]"
        )
        return response


# ── TASK 18 ─────────────────────────────────────────────────
# Caching with Django cache framework
from django.core.cache import cache
from django.views.decorators.cache import cache_page

def get_featured_products():
    key = "featured_products"
    products = cache.get(key)
    if products is None:
        products = list(
            Product.objects.filter(stock__gt=0)
                           .order_by("-created_at")[:10]
                           .values("id", "name", "price")
        )
        cache.set(key, products, timeout=60 * 5)  # 5 minutes
    return products

# View-level caching
# @cache_page(60 * 15)  # 15 minutes
# def product_list(request): ...


# ── TASK 19 ─────────────────────────────────────────────────
# Custom exception handler for DRF
from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError, NotFound, PermissionDenied

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        response.data = {
            "success": False,
            "error": {
                "code": response.status_code,
                "message": response.data if isinstance(response.data, str)
                           else response.data.get("detail", str(response.data)),
            }
        }
    return response

# In settings.py:
# REST_FRAMEWORK = { "EXCEPTION_HANDLER": "myapp.utils.custom_exception_handler" }


# ── TASK 20 ─────────────────────────────────────────────────
# DRF filtering, search, ordering
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend, FilterSet
import django_filters

class ProductFilter(FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    in_stock  = django_filters.BooleanFilter(method="filter_in_stock")

    def filter_in_stock(self, queryset, name, value):
        return queryset.filter(stock__gt=0) if value else queryset.filter(stock=0)

    class Meta:
        model = Product
        fields = ["category", "min_price", "max_price", "in_stock"]


class ProductViewSetWithFilter(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.select_related("category")
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["name", "description", "category__name"]
    ordering_fields = ["price", "created_at", "stock"]
    ordering = ["-created_at"]


# ── TASK 21 ─────────────────────────────────────────────────
# Django unit tests
from django.test import TestCase, Client
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status as drf_status

class ProductAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user("testuser", password="testpass123")
        self.admin = User.objects.create_superuser("admin", password="adminpass")
        self.category = Category.objects.create(name="Books", slug="books")
        self.product = Product.objects.create(
            name="Django for Beginners",
            price=29.99,
            stock=10,
            category=self.category
        )

    def test_list_products_unauthenticated(self):
        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, drf_status.HTTP_200_OK)

    def test_create_product_requires_auth(self):
        data = {"name": "New Book", "price": 19.99, "stock": 5, "category_id": self.category.pk}
        response = self.client.post("/api/products/", data)
        self.assertEqual(response.status_code, drf_status.HTTP_401_UNAUTHORIZED)

    def test_create_product_as_admin(self):
        self.client.force_authenticate(user=self.admin)
        data = {"name": "Advanced Django", "price": 39.99, "stock": 5, "category_id": self.category.pk}
        response = self.client.post("/api/products/", data)
        self.assertEqual(response.status_code, drf_status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)

    def test_product_price_validation(self):
        self.client.force_authenticate(user=self.admin)
        data = {"name": "Bad Product", "price": -5, "stock": 0, "category_id": self.category.pk}
        response = self.client.post("/api/products/", data)
        self.assertEqual(response.status_code, drf_status.HTTP_400_BAD_REQUEST)


# ── TASK 22 ─────────────────────────────────────────────────
# Async Django view (Django 4.1+)
import asyncio
from django.http import JsonResponse

async def async_product_stats(request):
    # Simulate concurrent DB queries
    async def count_products(): return await Product.objects.acount()
    async def count_orders(): return await Order.objects.acount()

    product_count, order_count = await asyncio.gather(
        count_products(), count_orders()
    )
    return JsonResponse({
        "products": product_count,
        "orders": order_count,
    })


# ── TASK 23 ─────────────────────────────────────────────────
# Rate limiting with DRF throttling
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

class BurstRateThrottle(UserRateThrottle):
    scope = "burst"
    # In settings: THROTTLE_RATES = {"burst": "10/min", "sustained": "100/day"}

class OrderCreateThrottle(UserRateThrottle):
    scope = "order_create"
    # THROTTLE_RATES = {"order_create": "5/hour"}

# Apply to a view:
# class OrderViewSet(viewsets.ModelViewSet):
#     throttle_classes = [OrderCreateThrottle]


# ── TASK 24 ─────────────────────────────────────────────────
# Celery task — async order confirmation email
"""
# tasks.py
from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_order_confirmation(order_id):
    order = Order.objects.select_related("user").get(pk=order_id)
    send_mail(
        subject=f"Order #{order.pk} Confirmed",
        message=f"Hi {order.user.username},\n\nYour order has been confirmed.\nTotal: ${order.total}",
        from_email="orders@example.com",
        recipient_list=[order.user.email],
    )

# Trigger in view:
# send_order_confirmation.delay(order.pk)
"""


# ── TASK 25 ─────────────────────────────────────────────────
# URL routing — organized with routers and namespacing
"""
# urls.py (project)
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("products", ProductViewSet, basename="product")
router.register("orders",   OrderViewSet,   basename="order")

urlpatterns = [
    path("api/v1/", include((router.urls, "v1"))),
    path("api/auth/", include("dj_rest_auth.urls")),
]
"""
