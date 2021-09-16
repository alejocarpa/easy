import React, { Component } from 'react';
import './Footer.css'
import { Link } from 'react-router-dom';

class Footer extends Component {
  render() {
    return (
      <div className="footer-container">
        <div className='footer-links'>
          <div className='footer-link-wrapper'>
            <div className='footer-link-items'>
              <h2>Contacto</h2>
              <Link to='/'>Correo: alejocarpa@gmail.com</Link>
              <Link to='/'>Teléfono: 311 774 1004</Link>
              <Link to='/'>Soporte</Link>
              <Link to='/'>EASY</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
