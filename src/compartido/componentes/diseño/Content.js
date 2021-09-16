import React, { Component } from 'react';
import './Content.css';

class Content extends Component {

  render() {

    const encabezado = {
      titulo: 'Bienvenido a EASY'
    }

    return (
      <div className="contenido-container">
        <video src="/videos/video-2.mp4" autoPlay loop muted />
        <header className="content-container">
          <h1><b>{encabezado.titulo}</b></h1>
          <h3><b>EL MEJOR ALIADO PARA TU NEGOCIO</b></h3>
        </header>
      </div>
    );
  }
}

export default Content;
