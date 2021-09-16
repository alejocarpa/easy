import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Menu() {

  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const closeMobileMenu = () => setClick(false);

  const [modulos, setModulos] = useState();

  const [submodulos, setSubmodulos] = useState();

  const cerrarSesion = () => {
    //console.log('aqui');
    cookies.remove('aut_bd', { path: "/" });
    cookies.remove('aut_ip', { path: "/" });
    cookies.remove('aut_estado', { path: "/" });
    cookies.remove('aut_bodega', { path: "/" });
    cookies.remove('aut_asesor', { path: "/" });
    cookies.remove('aut_usuari', { path: "/" });
  }


  useEffect(() => {

    const UrlModulos = `${Dominio}/menu/menu_modulos`;
    const UrlSubmodulos = `${Dominio}/menu/menu_submodulos`;

    const obtenerModulos = async () => {
      await axios.post(UrlModulos, { usuario: cookies.get('aut_usuari'), aut_ip: cookies.get('aut_ip'), aut_bd: cookies.get('aut_bd') })
        .then(response => {
          ///console.log(response.data);
          const responseJSON = response.data;
          setModulos(responseJSON);
        })
    }

    const obtenerSubmodulos = async () => {
      await axios.post(UrlSubmodulos, { usuario: cookies.get('aut_usuari'), aut_ip: cookies.get('aut_ip'), aut_bd: cookies.get('aut_bd') })
        .then(response => {
          //console.log(response.data);
          const responseJSON = response.data;
          setSubmodulos(responseJSON);
        })
    }

    obtenerModulos();
    obtenerSubmodulos();
  }, []);

  //console.log('bd:'+cookies.get('aut_bd'));
  //console.log('usuario:'+cookies.get('aut_usuari'));

  return (
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

          {
            !modulos ? 'Cargando...' : modulos.map((modulo, index) => {
              return <li key={index}>
                <div>{modulo.mod_nombre}</div>
                <ul className="subs">
                  {!submodulos ? 'Cargando...' : submodulos.map((submodulo, index2) => {
                    if (modulo.mod_codigo === submodulo.sub_modulo) {
                      return <Link key={index2} to={submodulo.sub_front} onClick={closeMobileMenu}>
                        <li >
                          <div>
                            {submodulo.sub_nombre}
                          </div>
                        </li>
                      </Link>
                    } else {
                      return ""
                    }
                  })}
                </ul>
              </li>
            })
          }
        </ul>
        <Link to="/">
          <div className={click ? "menu-cerrar active" : "menu-cerrar"}><button className="boton-cerrar" onClick={() => cerrarSesion()}>Cerrar sesión</button></div>
        </Link>
      </div>
    </>
  )
}

export default Menu;
