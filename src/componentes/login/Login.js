import React, { Component } from 'react';
import './Login.css';

import axios from 'axios';
import md5 from 'md5';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const baseUrl = `${Dominio}/login/auth`;
const cookies = new Cookies();

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form : {
        usuario: '',
        password: ''
      }
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  

  handleChangeUsuario = async e => {
    await this.setState({
      form:{
        ...this.state.form,
        usuario: e.target.value
      }
    });
    //console.log(this.state.form);
  }

  handleChangePassword = async e => {
    await this.setState({
      form:{
        ...this.state.form,
        password: md5(e.target.value)
      }
    });
    //console.log(this.state.form);
  }

  iniciarSesion = async() => {
 
    //alert(this.state.form.usuario);
    await axios.post(baseUrl,  { usuario: this.state.form.usuario, password : this.state.form.password  } )
    .then(response => {
      return response.data;
    })
    .then(response => {
      if(response.length>0){
        var respuesta = response[0];
        console.log(respuesta);
        cookies.set('aut_bd', respuesta.aut_bd, { path : "/" });
        cookies.set('aut_ip', respuesta.aut_ip, { path : "/" });
        cookies.set('aut_estado', respuesta.aut_estado, { path : "/" });
        cookies.set('aut_bodega', respuesta.aut_bodega, { path : "/" });
        cookies.set('aut_asesor', respuesta.aut_asesor, { path : "/" });
        cookies.set('aut_usuari', this.state.form.usuario, { path : "/" });
        //alert(`Bienvenido ${this.state.form.usuario}`);
        window.location.href="./../Home/";
      }else{
        alert("Usuario o contraseña incorrectos");
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  handleSubmit(event) {
    //alert('El nombre de usuario es: ' + this.state.form.usuario);
    event.preventDefault();
  }


  render() {

    return (
      <div className="login-container">
        <div className="login-formulario" >
          <form onSubmit={this.handleSubmit}>
            <input type="email" name="usuario" autoFocus="autofocus" placeholder="Usuario" onChange={this.handleChangeUsuario} />
            <input type="password" name="password" placeholder="Contraseña" onChange={this.handleChangePassword} />
            <button type="submit" className="login-boton" onClick={()=>this.iniciarSesion()}> Ingresar </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
