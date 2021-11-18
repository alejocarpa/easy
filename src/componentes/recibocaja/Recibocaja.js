import React, { useState, useEffect } from 'react';
import Menu from '../menu/Menu';
import Detalle from './Detalle';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Recibocaja() {

    const fecha = new Date();
    const añoActual = fecha.getFullYear();
    const mesActual = fecha.getMonth() + 1;
    const diaActual = fecha.getDate();

    let ceroMes = ''
    if (mesActual < 10) {
        ceroMes = '0';
    }
    let ceroDia = ''
    if (diaActual < 10) {
        ceroDia = '0';
    }
    const fechaActual = añoActual + '-' + ceroMes + '' + mesActual + '-' + ceroDia + '' + diaActual;
    const fechaDesde = añoActual + '-' + ceroMes + '' + mesActual + '-' + '01';

    const [pantalla, setPantalla] = useState('Consultar');
    const [bloquea, setBloquea] = useState(false);
    const [obligatorio, setObligatorio] = useState(false);
    const [detalle, setDetalle] = useState([]);
    const [asesores, setAsesores] = useState([]);
    const UrlModulos = `${Dominio}/laboratorio/laboratorio`;

    const [datos, setDatos] = useState({
        codigo: '',
        cliente: '',
        factura: '',
        asesor: '',
        estado: '',
        fecha1: fechaDesde,
        fecha2: fechaActual
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
                gru_codigo: datos.codigo,
                gru_nombre: datos.nombre,
                gru_estado: datos.estado,
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
                gru_nombre: datos.nombre,
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;
                    alert('Se guardo correctamente el laboratorio Codigo: ' + responseJSON);

                    if (responseJSON) {
                        setDatos({
                            ...datos,
                            codigo: '',
                            nombre: '',
                            estado: ''
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
                gru_codigo: datos.codigo,
                gru_nombre: datos.nombre,
                gru_estado: datos.estado,
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;
                    alert('Se actualizo correctamente el laboratorio');

                    if (responseJSON) {
                        setDatos({
                            ...datos,
                            codigo: '',
                            nombre: '',
                            estado: ''
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

        if (e.target.value === "Consultar") {
            setDatos({
                ...datos,
                codigo: '',
                cliente: '',
                factura: '',
                asesor: '',
                estado: '',
                fecha1: fechaDesde,
                fecha2: fechaActual
            })
        }

        if (e.target.value === "Nuevo" || e.target.value === "Limpiar") {
            setDatos({
                ...datos,
                codigo: '',
                cliente: '',
                factura: '',
                asesor: '',
                estado: '',
                fecha1: '',
                fecha2: ''
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
            gru_codigo: codigo
        })
            .then(response => {
                const respuesta = response.data;
                //console.log(respuesta);
                respuesta.result.map((dato, index) => {
                    return <div key={index}>
                        {setDatos({
                            ...datos,
                            codigo: dato.gru_codigo,
                            nombre: dato.gru_nombre,
                            estado: dato.gru_estado
                        })}
                    </div>
                })
            })
    }

    const winCliente = () => {
        let miPopup = window.open('../popupcliente/', "popupId", "location=no,menubar=no,titlebar=no,resizable=no,toolbar=no, menubar=no,width=800,height=500,left=250,top=100");
        miPopup.focus();
    }

    const codigoCliente = (e) => {
        console.log("aqui");
        setDatos({
            ...datos,
            cliente: document.getElementById('cliente').value
        })
    }

    useEffect(() => {
        const UrlAsesores = `${Dominio}/asesor/asesor`;

        const obtenerAsesores = async () => {
            let codigo_asesor = '';
            if (cookies.get('aut_asesor') !== "null") {
                codigo_asesor = cookies.get('aut_asesor');
            }
            await axios.post(UrlAsesores, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                ase_codigo: codigo_asesor,
                metodo: 'Buscar',
                limite: 'NO'
            })
                .then(response => {
                    const respuesta = response.data;
                    //console.log(respuesta);
                    setAsesores(respuesta.result);
                    setDatos({
                        ...datos,
                        asesor: codigo_asesor
                    })
                })
        }
        obtenerAsesores();
    }, []);

    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>{pantalla} Recibo de Caja</h1>
                <form name="formul" className="row mt-3" onSubmit={enviarDatos}  >
                    {
                        pantalla !== "Nuevo" ?
                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Codigo</b></label>
                                <input type='text' name="codigo" className="form-control" value={datos.codigo} onChange={handleInputChange} readOnly={bloquea} />
                            </div>
                            : ""
                    }
                    <div className="col-md-3 p-2 logo-busqueda">
                        <label className="form-label"><b>Cliente</b></label>
                        <input className="form-control" type="text" name="cliente" id="cliente" value={datos.cliente} placeholder="Buscar..." onChange={handleInputChange} onFocus={() => { codigoCliente(); }} />
                        <i className="fas fa-search" onClick={winCliente}></i>
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Factura</b></label>
                        <input className="form-control" type="text" name="factura" value={datos.factura} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Asesor</b></label>
                        <select name="asesor" className="form-select" value={datos.asesor} onChange={handleInputChange} >
                            <option value="">Todos</option>
                            {
                                !asesores ? "Cargando..."
                                    :
                                    asesores.map((asesor, index) => {
                                        return <option key={index} value={asesor.ase_codigo}>{asesor.ase_codigo + '-' + asesor.ase_nombre}</option>
                                    })
                            }
                        </select>
                    </div>
                    {
                        pantalla !== "Nuevo" ?

                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Estado</b></label>
                                <select name="estado" className="form-select" value={datos.estado} onChange={handleInputChange} >
                                    <option value="">Todos</option>
                                    <option value="P">Pagado</option>
                                    <option value="A">Anulado</option>
                                </select>
                            </div>
                            :
                            ""
                    }
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Fecha Desde</b></label>
                        <input type="date" name="fecha1" className="form-control" value={datos.fecha1} onChange={handleInputChange}></input>
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Hasta</b></label>
                        <input type="date" name="fecha2" className="form-control" value={datos.fecha2} onChange={handleInputChange}></input>
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

export default Recibocaja;
