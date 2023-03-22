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
from django.forms.models import model_to_dict
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
        crop_status = loaded_crop_model.predict_proba([crop_info]) 
        
        #output five crops
        top_five_indices = np.argsort(crop_status[0])[::-1][:5]
        crop_names = np.array(loaded_crop_model.classes_)
        top_five_crops = crop_names[top_five_indices]
        top_five_crops_array = np.array(top_five_crops)

        print(top_five_crops_array)
        

        model_prediction = {
            'info' : 'success',
            'crop_status' : top_five_crops_array,
            
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

        crop_status = loaded_crop_model.predict_proba([crop_info]) 
        
        #output five crops
        top_five_indices = np.argsort(crop_status[0])[::-1][:5]
        crop_names = np.array(loaded_crop_model.classes_)
        top_five_crops = crop_names[top_five_indices]
        top_five_crops_array = np.array(top_five_crops)
        
        # crop_status = loaded_crop_model.predict([crop_info]) 
        
        # crop_name = crop_status[0]

        

        csv = Csv.objects.get(name="yield")
        
        f = pd.read_csv(io.StringIO(csv.sheet.read().decode('utf-8')), delimiter=',')
        
        csv_cost = Csv.objects.get(name="cost")
        
        k = pd.read_csv(io.StringIO(csv_cost.sheet.read().decode('utf-8')), delimiter=',')
        
        # m = (crop_json_info)
        #predicting the yield
        

        rank = []
        for crop_name in top_five_crops_array:
            crop_rank = {} 
            crop_val = {}
                 
            if "bean" in crop_name:
                crop_name = "beans"
            if "pea" in crop_name:
                crop_name = "peas"

            # # if "Test" in county.name:
            #     county = "Baringo"
           
            crop_info = Crop.objects.get(name=str(crop_name)) 
            
  
            
            today = datetime.date.today()
            year = 2015
            co = mapping['county'][str(county)]
            ha = int(m['ha'])
            year = int(int(year))
            
            name = mapping['name'][str(crop_name)]

           
            fy = f[np.isin(f, [2015]).any(axis=1)]
            
            fco = fy[np.isin(fy, [str(county)]).any(axis=1)]
           
            # print("hellooo", crop_name)
            fnmae = fco[np.isin(fco, [str(crop_name)]).any(axis=1)]
            # print("kello", fy[np.isin(fy, [str(crop_name)]).any(axis=1)])
            # print(fnmae)
            mt_ha = fnmae['mt/ha']
            
            mt_ha = float(mt_ha.iloc[0])
            
            
            
            #Make prediction 
            v  = [[year,co,ha,mt_ha,name]] 
            v = poly_reg.fit_transform(v)
            crop_yield_status = loaded_yield_model.predict(v) 
            crop_val["yield"] =  round(abs(int(crop_yield_status[0]))/ha, 2)
            crop_val["turnover"] = abs(int(crop_yield_status[0])/int(ha))
         

            #predicting the price
        
    
           
            cost = crop_info.cost
            # name = mapping_mt['name'][m['name']]
         
            kco = k[np.isin(k, [str(county)]).any(axis=1)]
           
            knmae = kco[np.isin(kco, [str(crop_name)]).any(axis=1)]
            
            t_c = knmae['t/c']
            
            t_c = float(t_c.iloc[0])
            
           
          
            #Make prediction 
            v = [[t_c,co,cost,name]] 
            v = poly_reg_mt.fit_transform(v)
            price_status = loaded_price_model.predict(v)

            crop_info_data = {
                "name": crop_info.name,
                "cost": crop_info.cost,
                "fertilizer": crop_info.fertilizer,
                "types": crop_info.types,
                "cond": crop_info.cond,
                "seedrate": crop_info.seedrate,
                "spacing": crop_info.spacing,
                "info": crop_info.info,
                "id": crop_info.id,
                "mt_ha": crop_info.mt_ha,
                "image": "http://localhost:8000" + crop_info.image.url if crop_info.image else ""
            }
    
            crop_val["profit"] =  abs(int(price_status[0]-cost))
            crop_val["crop_info"] = crop_info_data
            crop_val["turnover"] += int(price_status[0])/int(cost)
            crop_val["turnover"] = round(crop_val["turnover"], 2) 
            crop_rank[crop_name] = crop_val
            
            rank.append(crop_rank)
             
            

            
            
            Prediction.objects.create(crop=crop_status[0], crop_yield=crop_yield_status[0],profit=price_status[0])
       
        rank = sorted(rank, key=lambda x: list(x.values())[0]['turnover'], reverse=True)
        # print(rank)
      

        


        model_prediction = {
            'info' : 'success',
            'crops' : rank,
            # 'crop_yield_status' : crop_yield_status[0],
            # 'crop_price_status' : price_status[0]
            
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

class counties_get(generics.ListAPIView):
    serializer_class = CountySerializer
    queryset = County.objects.all()