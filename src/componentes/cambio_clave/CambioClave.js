import React, { useEffect, useState } from 'react';
import Menu from '../menu/Menu';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function CambioClave() {

    const [pantalla, setPantalla] = useState('Consultar');
    const [obligatorio, setObligatorio] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const UrlModulos = `${Dominio}/cambio_clave/cambio_clave`;

    const [datos, setDatos] = useState({
        usuario: cookies.get('aut_usuari'),
        clave: '',
        reclave: ''
    });

    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]: event.target.value
        })
    }

    const enviarDatos = async (event) => {
        event.preventDefault();
        //alert(pantalla);
        let clave = datos.clave;
        let reclave = datos.reclave;

        if (clave === reclave) {

            await axios.post(UrlModulos, {
                usuario: datos.usuario,
                clave: datos.clave,
                metodo: 'Guardar'
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;
                    alert('Se cambio correctamente la clave');

                    if (responseJSON) {
                        setDatos({
                            ...datos,
                            usuario: '',
                            clave: '',
                            reclave: ''
                        })
                    }


                })
            setObligatorio(false);

        } else {
            alert('Las claves no coinciden, por favor ingreselas de nuevo');
        }
    }

    useEffect(() => {

        const obtenerUsuarios = async () => {
            await axios.post(UrlModulos, {
                usuario: cookies.get('aut_usuari'),
                metodo: 'obtenerUsuarios',
                limite: 'NO',
            })
                .then(response => {
                    const respuesta = response.data;
                    //console.log(respuesta);
                    setUsuarios(respuesta.result)
                })
        }
        obtenerUsuarios();
    }, []);

    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>Cambiar Clave</h1>
                <form className="row mt-3" onSubmit={enviarDatos}  >
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Usuario</b></label>
                        <select name="usuario" className="form-select" value={datos.usuario} onChange={handleInputChange} >
                            <option value="">-</option>
                            {
                                !usuarios ? "Cargando..."
                                    :
                                    usuarios.map((usuario, index) => {
                                        return <option key={index} value={usuario.aut_usuari}>{usuario.aut_usuari}</option>
                                    })
                            }
                        </select>
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Nueva Clave</b></label>
                        <input type='password' name="clave" className="form-control" value={datos.clave} onChange={handleInputChange} required={obligatorio} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Confirmar Clave</b></label>
                        <input type='password' name="reclave" className="form-control" value={datos.reclave} onChange={handleInputChange} required={obligatorio} />
                    </div>
                    <hr className="my-4" />


                    <div className="col-md-5 m-2">
                        <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Guardar" >Guardar</button>
                    </div>


                </form>
            </div>
            <hr className="my-4" />
        </div>
    )
}

export default CambioClave;
