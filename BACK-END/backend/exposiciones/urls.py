from django.urls import path
from .views import *

urlpatterns = [
    path('exposiciones/', class1.as_view()),
    path('exposiciones/<int:id>/', class2.as_view()),
]
