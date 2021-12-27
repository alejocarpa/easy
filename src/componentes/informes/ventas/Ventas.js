import React, { useEffect, useState } from 'react';
import Menu from '../../menu/Menu';
import Detalle from './Detalle';
import './../../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../../dominio';

const cookies = new Cookies();

function Ventas() {

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
    const [detalle, setDetalle] = useState([]);
    const [asesores, setAsesores] = useState([]);
    const UrlModulos = `${Dominio}/informes/ventas/ventas`;

    const [datos, setDatos] = useState({
        cliente: '',
        tipo: '',
        asesor: '',
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
                cliente: datos.cliente,
                tipo: datos.tipo,
                asesor: datos.asesor,
                fecha1: datos.fecha1,
                fecha2: datos.fecha2,
                limite: 'SI'
            })
                .then(response => {

                    const responseJSON = response.data;
                    //console.log(responseJSON);
                    setDetalle(responseJSON);
                    window.scrollTo(0, 400);
                })
        }
    }

    const winCliente = () => {
        let miPopup = window.open('../popupcliente/', "popupId", "location=no,menubar=no,titlebar=no,resizable=no,toolbar=no, menubar=no,width=800,height=500,left=250,top=100");
        miPopup.focus();
    }

    const codigoCliente = (e) => {
        setDatos({
            ...datos,
            cliente: document.getElementById('cliente').value
        })
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

        if (e.target.value === "Limpiar" || e.target.value === "Consultar") {
            setDatos({
                ...datos,
                cliente: '',
                factura: '',
                asesor: '',
                estado: 'P',
                fecha1: fechaDesde,
                fecha2: fechaActual
            })

            if (e.target.value === "Limpiar") {
                setPantalla("Consultar");
            }

        }
    }

    useEffect(()=>{
        const UrlAsesores = `${Dominio}/asesor/asesor`;

        const obtenerAsesores = async () => {
            
            await axios.post(UrlAsesores, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Buscar',
                limite: 'NO'
            })
                .then(response => {
                    const respuesta = response.data;
                    //console.log(respuesta);
                    setAsesores(respuesta.result);
                })
        }
        obtenerAsesores();
    },[]);


    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>Informe de Ventas</h1>
                <form name="formul" className="row mt-3" onSubmit={enviarDatos}  >
                    <div className="col-md-3 p-2 logo-busqueda">
                        <label className="form-label"><b>Cliente</b></label>
                        <input type='text' name="cliente" id="cliente" className="form-control" placeholder="Buscar..." value={datos.cliente} onChange={handleInputChange} onFocus={() => { codigoCliente(); }} />
                        <i className="fas fa-search" onClick={winCliente}></i>
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Tipo</b></label>
                        <select name="tipo" className="form-select" value={datos.tipo} onChange={handleInputChange} >
                            <option value="">Todos</option>
                            <option value="F">Facturas</option>
                            <option value="R">Remisiones</option>
                        </select>
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Fecha Desde</b></label>
                        <input type="date" name="fecha1" className="form-control" value={datos.fecha1} onChange={handleInputChange}></input>
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Hasta</b></label>
                        <input type="date" name="fecha2" className="form-control" value={datos.fecha2} onChange={handleInputChange}></input>
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

                    <hr className="my-4" />

                    {
                        pantalla === "Consultar" || pantalla === "Buscar" ?

                            <div className="col-md-5 m-2">
                                <button className="btn btn-dark m-2" type="button" name="pantalla" value="Limpiar" onClick={cambiarPantalla} >Limpiar</button>
                                <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Buscar" onClick={cambiarPantalla} >Buscar</button>
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
            {pantalla === "Buscar" ? <Detalle respuesta_json={detalle} pag={paginado} /> : ""}
        </div>
    )
}

export default Ventas;
