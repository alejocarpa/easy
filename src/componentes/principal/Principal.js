import React, { Component } from 'react';
import Header from './../../compartido/componentes/diseño/Header';
import Content from './../../compartido/componentes/diseño/Content';
import Footer from './../../compartido/componentes/diseño/Footer';
import Cards from './../../compartido/componentes/diseño/Cards';
import './Principal.css';

class Principal extends Component {
  render(){
    return (
      <div className="App">
        <Header />
        <Content />
        <Cards />
        <Footer />
      </div>
    );
  }
}

export default Principal;
