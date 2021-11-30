import React, { useState } from 'react';
import Menu from '../menu/Menu';
import Detalle from './Detalle';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function InformeCartera() {

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
    const UrlModulos = `${Dominio}/cartera/cartera`;

    const [datos, setDatos] = useState({
        cliente: '',
        factura: '',
        asesor: '',
        estado: 'P',
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
                cxc_client: datos.cliente,
                cxc_factur: datos.factura,
                cxc_asesor: datos.factura,
                cxc_estado: datos.estado,
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

    const cerrar_cartera = async (codigo) => {
        if (window.confirm("Desea cerrar la cartera " + codigo + " ?")) {
            await axios.put(UrlModulos, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Cerrar',
                cxc_id: codigo,
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;
                    alert(responseJSON.mensaje);

                    if (responseJSON) {
                        setDatos({
                            ...datos,
                            cliente: '',
                            factura: '',
                            asesor: '',
                            estado: 'P',
                            fecha1: fechaDesde,
                            fecha2: fechaActual
                        })
                    }

                    setPantalla("Consultar");
                })
        }
    }

    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>{pantalla} Informe de Cartera</h1>
                <form name="formul" className="row mt-3" onSubmit={enviarDatos}  >
                    <div className="col-md-3 p-2 logo-busqueda">
                        <label className="form-label"><b>Cliente</b></label>
                        <input type='text' name="cliente" id="cliente" className="form-control" placeholder="Buscar..." value={datos.cliente} onChange={handleInputChange} onFocus={() => { codigoCliente(); }} />
                        <i className="fas fa-search" onClick={winCliente}></i>
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Factura</b></label>
                        <input type='text' name="factura" className="form-control" value={datos.factura} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Asesor</b></label>
                        <input type='text' name="asesor" className="form-control" value={datos.asesor} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Estado</b></label>
                        <select name="estado" className="form-select" value={datos.estado} onChange={handleInputChange} >
                            <option value="">Todos</option>
                            <option value="P">Pendiente</option>
                            <option value="C">Cancelada</option>
                            <option value="A">Anulada</option>
                            <option value="Z">Cerrada</option>
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
            {pantalla === "Buscar" ? <Detalle respuesta_json={detalle} cerrar_cartera={cerrar_cartera} pag={paginado} /> : ""}
        </div>
    )
}

export default InformeCartera;
