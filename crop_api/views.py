import datetime
import joblib 
import json
# from keras.models import load_model 
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from django.shortcuts import render
from django.conf import settings 
from rest_framework import generics 
from rest_framework import viewsets
import numpy as np 
import pandas as pd
import json 
import sys 
import os
import io

from . serializer import *
from .models import *

path_to_model = os.path.join(settings.BASE_DIR, 'static/model/') 
loaded_crop_model = joblib.load(open(path_to_model+'crop.pkl', 'rb'))
loaded_price_model = joblib.load(open(path_to_model+'cost.pkl', 'rb'))
poly_reg_mt = joblib.load(open(path_to_model+'poly_reg_mt.pkl', 'rb'))
loaded_yield_model = joblib.load(open(path_to_model+'final_yield.pkl', 'rb'))
poly_reg = joblib.load(open(path_to_model+'poly_reg.pkl', 'rb'))

# loaded_yield_model = load_model(path_to_model+'finalYield.h5')


with open(path_to_model+"variables.json", "r") as rf:
    mapping = json.load(rf)

with open(path_to_model+"variables_mt.json", "r") as rf:
    mapping_mt = json.load(rf)


# Create your views here.
@api_view(['GET']) 
def index(request):
   
    return_data = {
        "error_code" : "0",
        "info" : "success",
        
        
    }
    return Response(return_data)

@api_view(["POST"]) 
def predict_crop_status(request):
    try:
        #load the request data
        crop_json_info = request.data 

        #retrieve all the values from the json data 
        crop_info = np.array(list(crop_json_info.values()))

        #Make prediction 
        crop_status = loaded_crop_model.predict([crop_info]) 

        model_prediction = {
            'info' : 'success',
            'crop_status' : crop_status[0],
            
        }

    except ValueError as ve:
        model_prediction = {
            'error_code' : '-1',
            "info" : str(ve)
        }
    
    return Response(model_prediction)


@api_view(["POST"]) 
def predict_yield_status(request):
    try:
        #load the request data
        crop_json_info = request.data 
        csv = Csv.objects.get(name="yield")
        
        f = pd.read_csv(io.StringIO(csv.sheet.read().decode('utf-8')), delimiter=',')
           

        #retrieve all the values from the json data 
        m = (crop_json_info)
       
        county = mapping['county'][m['county']]
        ha = int(m['ha'])
        year = int(m['year'])
       
        name = mapping['name'][m['name']]

        fy = f[np.isin(f, [2012]).any(axis=1)]
        fco = fy[np.isin(fy, [m['county']]).any(axis=1)]
        fnmae = fco[np.isin(fco, [m['name']]).any(axis=1)]
        mt_ha = fnmae['mt/ha']
        mt_ha = float(mt_ha.iloc[0])
        
        

        

        #Make prediction 
        v  = [[year,county,ha,mt_ha,name]] 
        v = poly_reg.fit_transform(v)
        crop_status = loaded_yield_model.predict(v) 

        model_prediction = {
            'info' : 'success',
            'crop_yield_status' : crop_status[0],
            
        }

    except ValueError as ve:
        model_prediction = {
            'error_code' : '-1',
            "info" : str(ve)
        }
    
    return Response(model_prediction)




@api_view(["POST"]) 
def predict_price_status(request):
    try:
        #load the request data
        crop_json_info = request.data 
        csv = Csv.objects.get(name="cost")
        
        f = pd.read_csv(io.StringIO(csv.sheet.read().decode('utf-8')), delimiter=',')
                  

        #retrieve all the values from the json data 
        m = (crop_json_info)
       
        county = mapping_mt['county'][m['county']]
        cost = int(m['cost'])
            
        name = mapping_mt['name'][m['name']]
        
        fco = f[np.isin(f, [m['county']]).any(axis=1)]
        fnmae = fco[np.isin(fco, [m['name']]).any(axis=1)]
        t_c = fnmae['t/c']
        t_c = float(t_c.iloc[0])
        

        #Make prediction 
        v = [[t_c,county,cost,name]] 
        v = poly_reg_mt.fit_transform(v)
        price_status = loaded_price_model.predict(v) 

        model_prediction = {
            'info' : 'success',
            'crop_price_status' : price_status[0],
            
        }

    except ValueError as ve:
        model_prediction = {
            'error_code' : '-1',
            "info" : str(ve)
        }
    
    return Response(model_prediction)




@api_view(["POST"]) 
def predict_status(request):
    try:
        
        #load the request data
        crop_json_info = request.data 
        

        #retrieve all the values from the json data 
        m = crop_json_info
        print(m)
        county = m['county']
        county = County.objects.get(name=county)
        
        #predicting the crop
        N = county.N 
        P = county.P       
        K = county.K 
        temperature = county.temperature 
        humidity = county.humidity 
        ph = county.ph 
        rainfall = county.rainfall 

        crop_info = [N,P,K,temperature,humidity,ph,rainfall]

        crop_status = loaded_crop_model.predict([crop_info]) 
        
        crop_name = crop_status[0]

        if "bean" in crop_name:
            crop_name = "beans"

        if "Test" in county.name:
            county = "Baringo"

        csv = Csv.objects.get(name="yield")
        
        f = pd.read_csv(io.StringIO(csv.sheet.read().decode('utf-8')), delimiter=',')
        
        
        
        # m = (crop_json_info)
        #predicting the yield
        today = datetime.date.today()
        year = today.year
        county = mapping['county'][str(county)]
        ha = int(m['ha'])
        year = int(int(year))
        
        name = mapping['name'][str(crop_name)]

        if "Test" in str(m['county']):
            co = "Baringo"
        else:
            co = county
        
        fy = f[np.isin(f, [2012]).any(axis=1)]
        fco = fy[np.isin(fy, [str(co)]).any(axis=1)]
        fnmae = fco[np.isin(fco, [str(crop_name)]).any(axis=1)]
        mt_ha = fnmae['mt/ha']
        mt_ha = float(mt_ha.iloc[0])
        
       
        
        #Make prediction 
        v  = [[year,county,ha,mt_ha,name]] 
        v = poly_reg.fit_transform(v)
        crop_yield_status = loaded_yield_model.predict(v) 

        #predicting the price
        csv = Csv.objects.get(name="cost")
        
        f = pd.read_csv(io.StringIO(csv.sheet.read().decode('utf-8')), delimiter=',')
                  

        #retrieve all the values from the json data 
        m = (crop_json_info)
       
        # county = mapping_mt['county'][m['county']]
        cost = int(m['cost'])
            
        # name = mapping_mt['name'][m['name']]
        
        fco = f[np.isin(f, [str(co)]).any(axis=1)]
        fnmae = fco[np.isin(fco, [str(crop_name)]).any(axis=1)]
        t_c = fnmae['t/c']
        t_c = float(t_c.iloc[0])
        

        #Make prediction 
        v = [[t_c,county,cost,name]] 
        v = poly_reg_mt.fit_transform(v)
        price_status = loaded_price_model.predict(v) 
        
        Prediction.objects.create(crop=crop_status[0], crop_yield=crop_yield_status[0],profit=price_status[0])

        model_prediction = {
            'info' : 'success',
            'crop_status' : crop_status[0],
            'crop_yield_status' : crop_yield_status[0],
            'crop_price_status' : price_status[0]
            
        }

        

    except ValueError as ve:
        model_prediction = {
            'error_code' : '-1',
            "info" : str(ve)
        }
    
    return Response(model_prediction)


class predict_status_get(generics.ListAPIView):
    serializer_class = PredictionSerializer
    queryset = Prediction.objects.order_by('-timestamp')