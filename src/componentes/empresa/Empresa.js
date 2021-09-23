import React, { useState } from 'react';
import Menu from '../menu/Menu';
import Detalle from './Detalle';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Empresa() {

    const [pantalla, setPantalla] = useState('Consultar');
    const [bloquea, setBloquea] = useState(false);
    const [obligatorio, setObligatorio] = useState(false);
    const [detalle, setDetalle] = useState([]);
    const UrlModulos = `${Dominio}/empresa/empresa`;

    const [datos, setDatos] = useState({
        codigo: '',
        nombre: '',
        nit: '',
        direccion: '',
        barrio: '',
        telefono: '',
        celular: '',
        email: ''
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
                emp_codigo: datos.codigo,
                emp_nombre: datos.nombre,
                emp_nit: datos.nit,
                emp_direcc: datos.direccion,
                emp_barrio: datos.barrio,
                emp_telefo: datos.telefono,
                emp_celula: datos.celular,
                emp_email: datos.email,
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
                emp_codigo: datos.codigo,
                emp_nombre: datos.nombre,
                emp_nit: datos.nit,
                emp_direcc: datos.direccion,
                emp_barrio: datos.barrio,
                emp_telefo: datos.telefono,
                emp_celula: datos.celular,
                emp_email: datos.email
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;
                    alert('Se guardo correctamente la empresa Codigo: ' + responseJSON);

                    if (responseJSON) {
                        setDatos({
                            ...datos,
                            codigo: '',
                            nombre: '',
                            nit: '',
                            direccion: '',
                            barrio: '',
                            telefono: '',
                            celular: '',
                            email: ''
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
                emp_codigo: datos.codigo,
                emp_nombre: datos.nombre,
                emp_nit: datos.nit,
                emp_direcc: datos.direccion,
                emp_barrio: datos.barrio,
                emp_telefo: datos.telefono,
                emp_celula: datos.celular,
                emp_email: datos.email
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;
                    alert('Se actualizo correctamente la empresa');

                    if (responseJSON) {
                        setDatos({
                            ...datos,
                            codigo: '',
                            nombre: '',
                            nit: '',
                            direccion: '',
                            barrio: '',
                            telefono: '',
                            celular: '',
                            email: ''
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
            emp_codigo: codigo
        })
            .then(response => {
                const respuesta = response.data;
                //console.log(respuesta);
                respuesta.result.map((dato, index) => {
                    return <div key={index}>
                        {setDatos({
                            ...datos,
                            codigo: dato.emp_codigo,
                            nombre: dato.emp_nombre,
                            nit: dato.emp_nit,
                            direccion: dato.emp_direcc,
                            barrio: dato.emp_barrio,
                            telefono: dato.emp_telefono,
                            celular: dato.emp_celula,
                            email: dato.emp_email
                        })}
                    </div>
                })
            })
    }

    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>{pantalla} Empresa</h1>
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
                        <label className="form-label"><b>Barrio</b></label>
                        <input type='text' name="barrio" className="form-control" value={datos.barrio} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Teléfono</b></label>
                        <input type='text' name="telefono" className="form-control" value={datos.telefono} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Celular</b></label>
                        <input type='text' name="celular" className="form-control" value={datos.celular} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Email</b></label>
                        <input type='text' name="email" className="form-control" value={datos.email} onChange={handleInputChange} />
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

export default Empresa;
