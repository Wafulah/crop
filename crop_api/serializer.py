from rest_framework import serializers
from . models import *
from django.conf import settings 
from rest_framework.response import Response


class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = '__all__'

class PredictionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Prediction
        fields = ['__all__']

class CountySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = County
        fields = ['name']