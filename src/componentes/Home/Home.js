import React from 'react';
import Menu from './../menu/Menu';
import './../../compartido/componentes/Estilo_principal.css';
import './Home.css';
import Grafica_barras from './Grafica_barras';
import Grafica_pastel from './Grafica_pastel';

function Home() {

  return(
    <div className="container-completo">
      <Menu />
      <div className="home-graficas">
        <div className="home-barras">
          <Grafica_barras />
        </div>
        <div className="home-barras">
          <Grafica_pastel />
        </div>
      </div>
    </div>
  )
}

export default Home;
