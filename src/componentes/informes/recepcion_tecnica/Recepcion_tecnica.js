import React, { useEffect, useState } from 'react';
import Menu from '../../menu/Menu';
import Detalle from './Detalle';
import './../../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../../dominio';

const cookies = new Cookies();

function Recepcion_tecnica() {

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
    const [proveedores, setProveedores] = useState([]);
    const UrlModulos = `${Dominio}/informes/recepcion_tecnica/recepcion_tecnica`;

    const [datos, setDatos] = useState({
        codigo_del_producto: '',
        proveedor: '',
        fecha1: fechaDesde,
        fecha2: fechaActual,
        pro_codbar: ''
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
                pro_codbar: datos.pro_codbar,
                proveedor: datos.proveedor,
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

    const winProducto = () => {
        let miPopup = window.open('../popupproducto/', "popupId", "location=no,menubar=no,titlebar=no,resizable=no,toolbar=no, menubar=no,width=800,height=500,left=250,top=100");
        miPopup.focus();
    }

    const codigoProducto = (e) => {
        setDatos({
            ...datos,
            pro_codbar: document.getElementById('codigo_del_producto').value
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
                codigo_del_producto: '',
                bodega: '',
                fecha1: fechaDesde,
                fecha2: fechaActual,
                pro_codbar: ''
            })

            if (e.target.value === "Limpiar") {
                setPantalla("Consultar");
            }

        }
    }

    useEffect(()=>{
        const UrlProveedores = `${Dominio}/proveedor/proveedor`;

        const obtenerProveedores = async () => {
            
            await axios.post(UrlProveedores, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Buscar',
                limite: 'NO'
            })
                .then(response => {
                    const respuesta = response.data;
                    //console.log(respuesta.result);
                    setProveedores(respuesta.result);
                })
        }
        obtenerProveedores();
    },[]);


    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>Recepcion Tecnica</h1>
                <form name="formul" className="row mt-3" onSubmit={enviarDatos}  >
                    <div className="col-md-3 p-2 logo-busqueda">
                        <label className="form-label"><b>Producto</b></label>
                        <input type='text' name="pro_codbar" id="pro_codbar" className="form-control" placeholder="Buscar..." value={datos.pro_codbar} onChange={handleInputChange} onFocus={() => { codigoProducto(); }} />
                        <input type='hidden' name="codigo_del_producto" id="codigo_del_producto" className="form-control" value="" />
                        <i className="fas fa-search" onClick={winProducto}></i>
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Proveedor</b></label>
                        <select name="bodega" className="form-select" value={datos.proveedor} onChange={handleInputChange} >
                            <option value="">Todas</option>
                            {

                                !proveedores ? "Cargando..."

                                :

                                proveedores.map((proveedor, index) => {
                                    return <option key={index} value={proveedor.pro_codigo}>{proveedor.pro_nombre}</option>
                                })
                            }
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
            {pantalla === "Buscar" ? <Detalle respuesta_json={detalle} pag={paginado} /> : ""}
        </div>
    )
}

export default Recepcion_tecnica;
