import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();

function Menu(){

  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const closeMobileMenu = () => setClick(false);

  const baseUrl = "http://31.220.109.157/easy2/menu/menu_modulos";
  const obtenerModulos = async() => {
    await axios.post(baseUrl,  { usuario: cookies.get('aut_usuari'), aut_ip : cookies.get('aut_ip'), aut_bd : cookies.get('aut_bd')  } )
    .then(response => {
      console.log(response.data);
      const modulos = response.data;
    })
  }

  useEffect(() => {
    obtenerModulos();
  }, [])

  console.log(cookies.get('aut_bd'));
  console.log(cookies.get('aut_usuari'));

  return(
    <>
      <div className="example">
        <Link to="/Home" className="navbar-logo" onClick={closeMobileMenu}>
            EASY
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav active' : 'nav'}>
          <Link to="/Home" onClick={closeMobileMenu}>
            <li> <div>Home</div> </li>
          </Link>

          <li>
            <div>Maestros</div>
            <ul className="subs">
              <li><div onClick={closeMobileMenu}>Clientes</div></li>
              <li><div onClick={closeMobileMenu}>Productos</div></li>
              <li><div onClick={closeMobileMenu}>Productos</div></li>
              <li><div onClick={closeMobileMenu}>Productos</div></li>
            </ul>
          </li>
          <li>
            <div>Maestros</div>
            <ul className="subs">
              <li><div onClick={closeMobileMenu}>Clientes</div></li>
            </ul>
          </li>
          <li>
            <div>Maestros</div>
            <ul className="subs">
              <li><div onClick={closeMobileMenu}>Clientes</div></li>
            </ul>
          </li>
          <li>
            <div>Maestros</div>
            <ul className="subs">
              <li><div onClick={closeMobileMenu}>Clientes</div></li>
            </ul>
          </li>

          <Link to="/">
            <li><button>Cerrar sesión</button></li>
          </Link>
        </ul>
      </div>
    </>
  )
}

export default Menu;
