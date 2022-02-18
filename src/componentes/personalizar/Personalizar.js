import React, { useState, useEffect } from 'react';
import Menu from '../menu/Menu';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';
import './Personalizar.css';

const cookies = new Cookies();

function Personalizar() {

    const UrlModulos = `${Dominio}/personalizar/personalizar`;

    const [datos, setDatos] = useState({
        fondo: '',
        color_tabla: ''
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

        await axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Guardar',
            fondo: datos.fondo,
            color_tabla: datos.color_tabla
        })
            .then(response => {
                //console.log(response.data);
                const responseJSON = response.data;
                document.location.reload();
            })
    }

    useEffect(() => {
        const UrlParametros = `${Dominio}/parametros/parametros`;

        const obtenerColorTabla = async () => {
            let tabla = '';

            await axios.post(UrlParametros, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Buscar',
                par_nombre: 'COLOR_TABLA'
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;

                    if (responseJSON) {
                        responseJSON.result.map((valor) => {
                            tabla = valor.par_valor;
                        })

                        setDatos({
                            ...datos,
                            color_tabla: tabla
                        })
                    }
                })
        }
        obtenerColorTabla();

    }, []);

    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>Personalizar EASY</h1>
                <form className="row mt-3" onSubmit={enviarDatos}  >
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Color de Fondo</b></label>
                        <div><input type='color' name="fondo" className="form-color" value={datos.fondo} onChange={handleInputChange} /></div>
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Color de Tabla</b></label>
                        <div className="form-check" >
                            <input className="form-check-input" type="radio" name="color_tabla" value="table table-dark" defaultChecked onClick={handleInputChange} />Negro
                            <br></br>
                            <input className="form-check-input" type="radio" name="color_tabla" value="table table-success" onClick={handleInputChange} /> Blanco
                        </div>
                    </div>

                    <hr className="my-4" />
                    <div className='container-previsualizacion' style={{ background: datos.fondo }}>
                        <div className='previsualizacion-barra'>
                            <div className="barra-logo">
                                EASY
                            </div>
                            <div className='barra-modulo'>
                                <div className='modulo-lista'>
                                    <div className='lista'>Home</div>
                                    <div className='lista'>Comercial</div>
                                    <div className='lista'>Maestros</div>
                                </div>
                            </div>
                            <div className='barra-cerrar'>
                                <div className="cerrar-boton">Cerrar sesión</div>
                            </div>
                        </div>
                        <div className='previsualizacion-contenido'>
                            <div className='contenido-titulo'>Consultar Pedido</div>
                            <div className='contenido-formulario'>
                                <div className='formulario-caja'></div>
                                <div className='formulario-caja'></div>
                                <div className='formulario-caja'></div>
                                <div className='formulario-caja'></div>
                            </div>
                        </div>
                        <div className='previsualizacion-tabla'>
                            <table className={datos.color_tabla}>

                                <thead>
                                    <tr>
                                        <th className="encabezado-detalle">Codigo</th>
                                        <th className="encabezado-detalle">Nombre</th>
                                        <th className="encabezado-detalle">Teléfono</th>
                                        <th className="encabezado-detalle">Whatsapp</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td className="align-middle">1</td>
                                        <td className="align-middle">Alejandro Cardenas</td>
                                        <td className="align-middle">311 774 1004</td>
                                        <td>+573117741004</td>
                                    </tr>
                                    <tr>
                                        <td className="align-middle">2</td>
                                        <td className="align-middle">Steve Jobs</td>
                                        <td className="align-middle">311 774 1004</td>
                                        <td>+573117741004</td>
                                    </tr>
                                    <tr>
                                        <td className="align-middle">2</td>
                                        <td className="align-middle">Bill Gates</td>
                                        <td className="align-middle">311 774 1004</td>
                                        <td>+573117741004</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <hr className="my-4" />

                    <div className="col-md-5 m-2">
                        <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Guardar" >Guardar</button>
                    </div>

                </form>
            </div>
            <hr className="my-4" />
            <br />

        </div>
    )
}

export default Personalizar;
