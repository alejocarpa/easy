import React, { useState } from 'react';
import Menu from '../menu/Menu';
import Detalle from './Detalle';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Proveedor() {

    const [pantalla, setPantalla] = useState('Consultar');
    const [bloquea, setBloquea] = useState(false);
    const [obligatorio, setObligatorio] = useState(false);
    const [detalle, setDetalle] = useState([]);
    const UrlModulos = `${Dominio}/proveedor/proveedor`;

    const [datos, setDatos] = useState({
        codigo: '',
        nombre: '',
        nit: '',
        direccion: '',
        telefono: ''
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

        if (pantalla === "Buscar") {
            await axios.post(UrlModulos, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: pantalla,
                pro_codigo: datos.codigo,
                pro_nombre: datos.nombre,
                pro_nit: datos.nit,
                pro_direcc: datos.direccion,
                pro_telefo: datos.telefono,
                limite: 'SI'
            })
                .then(response => {

                    const responseJSON = response.data;
                    //console.log(responseJSON);
                    setDetalle(responseJSON);
                    window.scrollTo(0, 400);
                })
        } else if (pantalla === "Guardar") {
            await axios.post(UrlModulos, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: pantalla,
                pro_nombre: datos.nombre,
                pro_nit: datos.nit,
                pro_direcc: datos.direccion,
                pro_telefo: datos.telefono
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;
                    alert('Se guardo correctamente el proveedor Codigo: ' + responseJSON);

                    if (responseJSON) {
                        setDatos({
                            ...datos,
                            codigo: '',
                            nombre: '',
                            nit: '',
                            direccion: '',
                            telefono: ''
                        })
                    }


                })

            setPantalla("Consultar");
            setObligatorio(false);


        } else if (pantalla === "Actualizar") {

            await axios.put(UrlModulos, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: pantalla,
                pro_codigo: datos.codigo,
                pro_nombre: datos.nombre,
                pro_nit: datos.nit,
                pro_direcc: datos.direccion,
                pro_telefo: datos.telefono
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;
                    alert('Se actualizo correctamente el proveedor');

                    if (responseJSON) {
                        setDatos({
                            ...datos,
                            codigo: '',
                            nombre: '',
                            nit: '',
                            direccion: '',
                            telefono: ''
                        })
                    }

                    setPantalla("Consultar");
                })

            setObligatorio(false);

        }
        setBloquea(false);
    }

    const paginado = async (url) => {

        await axios.get(url)
            .then(response => {
                const responseJSON = response.data;
                //console.log(responseJSON);
                setDetalle(responseJSON);
            })
        window.scrollTo(0, 400);
    }

    const cambiarPantalla = (e) => {
        //alert(e.target.value);
        setPantalla(e.target.value);

        if (e.target.value === "Actualizar") {
            if (datos.nombre === "") {
                setBloquea(true);
                setObligatorio(true);
                setPantalla("Editar");
            }
        }

        if (e.target.value === "Guardar" || e.target.value === "Nuevo") {
            if (datos.nombre === "") {
                setObligatorio(true);
                setPantalla("Nuevo");
            }
        }

        if (e.target.value === "Nuevo" || e.target.value === "Limpiar" || e.target.value === "Consultar") {
            setDatos({
                ...datos,
                codigo: '',
                nombre: '',
                estado: '',
            })

            if (e.target.value === "Limpiar") {
                setPantalla("Consultar");
            }

            if (e.target.value === "Consultar") {
                setObligatorio(false);
                setBloquea(false);
            }

        }


    }

    const editar = async (codigo) => {
        //alert("editar "+codigo);
        setPantalla("Editar");
        setBloquea(true);
        setObligatorio(true);

        await axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Editar',
            pro_codigo: codigo
        })
            .then(response => {
                const respuesta = response.data;
                //console.log(respuesta);
                respuesta.result.map((dato, index) => {
                    return <div key={index}>
                        {setDatos({
                            ...datos,
                            codigo: dato.pro_codigo,
                            nombre: dato.pro_nombre,
                            nit: dato.pro_nit,
                            direccion: dato.pro_direcc,
                            telefono: dato.pro_telefo
                        })}
                    </div>
                })
            })
    }

    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>{pantalla} Proveedor</h1>
                <form className="row mt-3" onSubmit={enviarDatos}  >
                    {
                        pantalla !== "Nuevo" ?
                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Codigo</b></label>
                                <input type='text' name="codigo" className="form-control" value={datos.codigo} onChange={handleInputChange} readOnly={bloquea} />
                            </div>
                            : ""
                    }
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Nombre</b></label>
                        <input type='text' name="nombre" className="form-control" value={datos.nombre} onChange={handleInputChange} required={obligatorio} maxLength={50} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Nit</b></label>
                        <input type='text' name="nit" className="form-control" value={datos.nit} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Dirección</b></label>
                        <input type='text' name="direccion" className="form-control" value={datos.direccion} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Teléfono</b></label>
                        <input type='text' name="telefono" className="form-control" value={datos.telefono} onChange={handleInputChange} />
                    </div>

                    <hr className="my-4" />

                    {
                        pantalla === "Consultar" || pantalla === "Buscar" ?

                            <div className="col-md-5 m-2">
                                <button className="btn btn-dark m-2" type="button" name="pantalla" value="Nuevo" onClick={cambiarPantalla} >Nuevo</button>
                                <button className="btn btn-dark m-2" type="button" name="pantalla" value="Limpiar" onClick={cambiarPantalla} >Limpiar</button>
                                <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Buscar" onClick={cambiarPantalla} >Buscar</button>
                            </div>

                            : pantalla === "Nuevo" ?
                                <div className="col-md-5 m-2">
                                    <button className="btn btn-dark m-2" type="button" name="pantalla" value="Consultar" onClick={cambiarPantalla} >Consultar</button>
                                    <button className="btn btn-dark m-2" type="button" name="pantalla" value="Limpiar" onClick={cambiarPantalla} >Limpiar</button>
                                    <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Guardar" onClick={cambiarPantalla} >Guardar</button>
                                </div>

                                :
                                <div className="col-md-5 m-2">
                                    <button className="btn btn-dark m-2" type="button" name="pantalla" value="Consultar" onClick={cambiarPantalla} >Consultar</button>
                                    <button className="btn btn-dark m-2" type="button" name="pantalla" value="Limpiar" onClick={cambiarPantalla} >Limpiar</button>
                                    <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Actualizar" onClick={cambiarPantalla} >Actualizar</button>
                                </div>
                    }

                </form>
            </div>
            <hr className="my-4" />
            <br />
            {pantalla === "Buscar" ? <Detalle respuesta_json={detalle} editar={editar} pag={paginado} /> : ""}
        </div>
    )
}

export default Proveedor;
