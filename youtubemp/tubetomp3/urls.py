from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("converting/", views.convert, name='converting'),
]