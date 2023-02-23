import React from 'react';
import './Nav.css';
import { RiPlantFill  } from 'react-icons/ri';

export default function Nav() {
  return (
      <div className="nav">
          <div className="logo">
              <div className='logo-holder'>
              <RiPlantFill size={40} style={{ color: 'green' }} /> 
              <b className="logo-text">Cropify</b>
              </div>
          </div>
          <div className="links">
              <div className="links-holder">
                  <div className="login">
                      
                      <p className="login-text">
                          Login
                      </p>
                     
            </div>
             <div className="icons">
                      <p className="about-text" >
                          <b className='about'>Dasboard </b>
                          
                          <b className="about">About</b>
                          <b className="about">Contact us</b>
                         </p> 
                      </div>
            </div>
          </div>

    </div>
  )
}
