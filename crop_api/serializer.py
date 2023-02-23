from rest_framework import serializers
from . models import *
from django.conf import settings 
from rest_framework.response import Response



class PredictionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Prediction
        fields = ['crop','crop_yield','profit']