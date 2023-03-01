from django.db import models
import datetime 
from django.utils import timezone
# Create your models here.

class County(models.Model):
    name = models.CharField(max_length=50)
    N = models.FloatField() 
    P = models.FloatField()
    K = models.FloatField()
    temperature = models.FloatField()
    ph = models.FloatField()
    humidity = models.FloatField()
    rainfall = models.FloatField()

    def __str__(self):
        return self.name

class Crop(models.Model):
    name = models.CharField(max_length=50)
    mt_ha = models.CharField(max_length=50)
    info = models.TextField()
    image = models.ImageField()
    cost = models.IntegerField()


    def __str__(self):
        return self.name
    

class Csv(models.Model): 
    name = models.CharField( max_length=50)
    sheet = models.FileField(upload_to= 'media/')


    def __str__(self):
        return self.name

class Prediction(models.Model): 
    crop = models.CharField(max_length=50)
    crop_yield = models.IntegerField()
    profit = models.IntegerField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.crop
    