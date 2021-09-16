import React, { useState, useEffect } from 'react';
import Menu from '../menu/Menu';
import Detalle from './Detalle';
import DetallePedido from './DetallePedido';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Factura() {

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
    const UrlModulos = `${Dominio}/factura/factura`;
    const [clientes, setClientes] = useState([]);
    const [bodegas, setBodegas] = useState([]);
    const [pedidos, setPedidos] = useState([]);

    const [datos, setDatos] = useState({
        codigo: '',
        cliente: '',
        estado: '',
        bodega: '',
        forma_pago: '',
        tipo: '',
        fecha1: fechaDesde,
        fecha2: fechaActual,
        pedido: ''
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
                fac_numero: datos.codigo,
                fac_client: datos.cliente,
                fac_estado: datos.estado,
                fac_bodega: datos.bodega,
                fac_credit: datos.forma_pago,
                fac_tipo: datos.tipo,
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
        } else if (pantalla === "Buscar Pedido") {
            await axios.post(UrlModulos, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: pantalla,
                pedido: datos.pedido,
                cliente: datos.cliente,
                bodega: datos.bodega,
                fecha1: datos.fecha1,
                fecha2: datos.fecha2,
                limite: 'SI'
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;

                    setPedidos(responseJSON);
                    window.scrollTo(0, 400);
                })

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

        if (e.target.value === "Limpiar" || e.target.value === "Consultar") {
            setDatos({
                ...datos,
                codigo: '',
                cliente: '',
                estado: '',
                bodega: '',
                forma_pago: '',
                tipo: '',
                fecha1: '',
                fecha2: '',
                pedido: ''
            })

            if (e.target.value === "Consultar") {
                setObligatorio(false);
                setBloquea(false);
            }

            if (e.target.value === "Limpiar") {
                setPantalla('Consultar');
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

    const handleFocus = (event) => event.target.select();

    useEffect(() => {
        const UrlClientes = `${Dominio}/cliente/cliente`;

        const obtenerClientes = async () => {
            await axios.post(UrlClientes, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Buscar',
                limite: 'NO',
            })
                .then(response => {
                    const respuesta = response.data;
                    //console.log(respuesta);
                    setClientes(respuesta.result)
                })
        }
        obtenerClientes();

        const UrlBodegas = `${Dominio}/bodega/bodega`;

        const obtenerBodegas = async () => {
            await axios.post(UrlBodegas, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Buscar',
                limite: 'NO',
            })
                .then(response => {
                    const respuesta = response.data;
                    //console.log(respuesta);
                    setBodegas(respuesta.result)
                })
        }
        obtenerBodegas();
    }, [])

    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>{pantalla === "Nuevo" ? "Nueva" : pantalla} Factura</h1>
                <form className="row mt-3" onSubmit={enviarDatos}  >
                    {
                        pantalla === "Nuevo" || pantalla === "Buscar Pedido" ?
                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Codigo del Pedido</b></label>
                                <input type='text' name="pedido" className="form-control" value={datos.pedido} onChange={handleInputChange} />
                            </div>

                            :

                            ""
                    }
                    {pantalla !== "Nuevo" && pantalla !== "Buscar Pedido" ?
                        <div className="col-md-3 p-2">
                            <label className="form-label"><b>Número</b></label>
                            <input type='text' name="codigo" className="form-control" value={datos.codigo} onChange={handleInputChange} />
                        </div>

                        :

                        ""
                    }
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Cliente</b></label>
                        <input type='text' name="cliente" list="datalistOptions" className="form-control" value={datos.cliente} onChange={handleInputChange} onFocus={handleFocus} />
                        <datalist id="datalistOptions">
                            {!clientes ? "Cargando..." : clientes.map((cliente, index) => {
                                return <option key={index} value={cliente.cli_codigo + '-' + cliente.cli_nombre1 + ' ' + cliente.cli_apelli1 + '-' + cliente.cli_docume}></option>
                            })}
                        </datalist>
                    </div>
                    {pantalla !== "Nuevo" && pantalla !== "Buscar Pedido" ?

                        <div className="col-md-3 p-2">
                            <label className="form-label"><b>Estado</b></label>
                            <select name="estado" className="form-select" value={datos.estado} onChange={handleInputChange} >
                                <option value="">Todos</option>
                                <option value="C">Cancelada</option>
                                <option value="P">Pendiente</option>
                                <option value="A">Anulada</option>
                            </select>
                        </div>
                        : ""
                    }

                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Bodega</b></label>
                        <select name="bodega" className="form-select" value={datos.bodega} onChange={handleInputChange} >
                            <option value="">Todas</option>
                            {!bodegas ? "Cargando..." :
                                bodegas.map((bodega, index) => {
                                    return <option key={index} value={bodega.bod_codigo}>{bodega.bod_nombre}</option>
                                })
                            }
                        </select>
                    </div>

                    {pantalla !== "Nuevo" && pantalla !== "Buscar Pedido" ? 

                        <div className="col-md-3 p-2">
                            <label className="form-label"><b>Forma de pago</b></label>
                            <select name="forma_pago" className="form-select" value={datos.forma_pago} onChange={handleInputChange} >
                                <option value="">Todos</option>
                                <option value="1">Crédito</option>
                                <option value="0">Contado</option>
                            </select>
                        </div>

                        :

                        ""
                    }

                    {pantalla !== "Nuevo" && pantalla !== "Buscar Pedido" ?
                        <div className="col-md-3 p-2">
                            <label className="form-label"><b>Tipo</b></label>
                            <select name="tipo" className="form-select" value={datos.tipo} onChange={handleInputChange} >
                                <option value="">Todos</option>
                                <option value="F">Factura</option>
                                <option value="R">Remision</option>
                            </select>
                        </div>

                        :

                        ""

                    }

                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Fecha Desde</b></label>
                        <input type='date' name="fecha1" className="form-control" value={datos.fecha1} onChange={handleInputChange} />
                    </div>

                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Hasta</b></label>
                        <input type='date' name="fecha2" className="form-control" value={datos.fecha2} onChange={handleInputChange} />
                    </div>

                    <hr className="my-4" />

                    {
                        pantalla === "Consultar" || pantalla === "Buscar" ?

                            <div className="col-md-5 m-2">
                                <button className="btn btn-dark m-2" type="button" name="pantalla" value="Nuevo" onClick={cambiarPantalla} >Nuevo</button>
                                <button className="btn btn-dark m-2" type="button" name="pantalla" value="Limpiar" onClick={cambiarPantalla} >Limpiar</button>
                                <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Buscar" onClick={cambiarPantalla} >Buscar</button>
                            </div>

                            : pantalla === "Nuevo" || pantalla === "Buscar Pedido" ?
                                <div className="col-md-5 m-2">
                                    <button className="btn btn-dark m-2" type="button" name="pantalla" value="Consultar" onClick={cambiarPantalla} >Consultar</button>
                                    <button className="btn btn-dark m-2" type="button" name="pantalla" value="Limpiar" onClick={cambiarPantalla} >Limpiar</button>
                                    <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Buscar Pedido" onClick={cambiarPantalla} >Buscar Pedido</button>
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
            {
                pantalla === "Buscar" ? 
                    <Detalle respuesta_json={detalle} editar={editar} pag={paginado} /> 
                : 
                pantalla === "Buscar Pedido" ? 
                    <DetallePedido respuesta_json={pedidos} count={0} /> 
                : 
                ""
            }
        </div>
    )
}

export default Factura;
