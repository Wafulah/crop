import React from 'react';
import './info.css';
import { FaSeedling, FaAppleAlt, FaCoins, FaInfo } from 'react-icons/fa';
import { GiFruitTree } from 'react-icons/gi';



export default function Info() {
  return (
      <div className='conta'>
          <div className='cove'>
              <h1 className='us '>
                  Welcome To our Crop recomendation System
              
              </h1>
              
              <div className='hld'>
                  <div className='features'>
                      <div className='icon'>
                          <div className='icon-holder'>
                         <FaSeedling size={35} style={{color: 'white'}} /> 
                          </div>
                      </div>
                      <div className='info-holder'>
                          <b className='h5-inf'>
                             Crop Recomendation 
                          </b><br/>
                          <b className='info-text' style={{ backgroundColor:"none" }}>
                              Get the best crop to grow in your location based on the Soil
                              and climatic condion.
                          </b>
                          </div>
                          
                      
                  </div>
                  <div className='features'>
                       <div className='icon'>
                          <div className='icon-holder' style={{ backgroundColor: 'green',borderColor:'white' }}>
                         <GiFruitTree size={40} style={{color: 'white'}} /> 
                          </div>
                      </div>
                      <div className='info-holder'>
                          <b className='h5-inf'>
                             Crop Yield Prediction 
                          </b><br/>
                          <b className='info-text' style={{ backgroundColor:"none" }}>
                              Know the total yield you expect to get from your Farm. Plan a head
                              to avoid losses.
                          </b>
                          </div>
                      
                  </div>
                  <div className='features'>
                       <div className='icon'>
                          <div className='icon-holder' style={{ backgroundColor: 'green',borderColor:'white' }}>
                         <FaCoins size={35} style={{color: 'white'}} /> 
                          </div>
                      </div>
                      <div className='info-holder'>
                          <b className='h5-inf'>
                             Profit Prediction 
                          </b><br/>
                          <b className='info-text' style={{ backgroundColor:"none" }}>
                              Know the total yield you expect to get from your Farm. Plan a head
                              to avoid losses.
                          </b>
                          </div>
                      
                  </div>
                  <div className='features'>
                       <div className='icon'>
                          <div className='icon-holder' style={{ backgroundColor: 'green',borderColor:'white' }}>
                         <FaInfo size={35} style={{color: 'white'}} /> 
                          </div>
                      </div>
                      <div className='info-holder'>
                          <b className='h5-inf'>
                             Crop Information
                          </b><br/>
                          <b className='info-text' style={{ backgroundColor:"none" }}>
                              Give you the necessary Information you need about the predicted crops to
                              ensure you success.
                          </b>
                          </div>
                  </div>

              </div>
          </div>
    
          
      </div>
  )
}

