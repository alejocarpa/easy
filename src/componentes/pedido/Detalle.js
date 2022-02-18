import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Detalle(props) {
    const resultado = props.respuesta_json;
    const campo_medio_de_pago = props.campo_medio_de_pago;
    //console.log(resultado);
    const [anchoVentana, setAnchoVentana] = useState(window.innerWidth);
    const [total_sin_iva, setTotal_sin_iva] = useState(0);
    const [color_tabla, setColorTabla] = useState();

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

                        setColorTabla(tabla);
                    }
                })
        }
        obtenerColorTabla();
    }, []);

    useEffect(() => {
        const handleResize = () => setAnchoVentana(window.innerWidth)
        window.addEventListener('resize', handleResize);

        return () => {
            //console.log('return useEffect');
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (
        <div>
            <h1>Resultado</h1>
            <div className="detalle-exporta" style={color_tabla === "table table-dark" ? {background: '#212529'} : {background: '#D1E7DD'}}>
                <div className="detalle-exporta-icono">
                    <a href={resultado.ruta_excel} className="detalle-exporta-icono">
                        <i className="fas fa-file-excel" />
                    </a>
                </div>
                <div className="detalle-exporta-icono">
                    <a href={resultado.ruta_pdf} className="detalle-exporta-icono" target="_blank" rel="noreferrer">
                        <i className="fas fa-file-pdf"></i>
                    </a>
                </div>
            </div>
            {anchoVentana > 1114 ?

                <table className={color_tabla}>

                    <thead>
                        <tr>
                            <th className="encabezado-detalle"></th>
                            <th className="encabezado-detalle">Codigo</th>
                            <th className="encabezado-detalle">Cliente</th>
                            <th className="encabezado-detalle">Estado</th>
                            <th className="encabezado-detalle text-end">Valor sin IVA</th>
                            <th className="encabezado-detalle text-end">IVA</th>
                            <th className="encabezado-detalle text-end">Descuento</th>
                            <th className="encabezado-detalle text-end">Valor total</th>
                            <th className="encabezado-detalle">Fecha</th>
                            {
                                campo_medio_de_pago === "SI" ?
                                    <th className="encabezado-detalle">Medio de Pago</th>
                                    :
                                    ""
                            }
                            <th className="encabezado-detalle">Observación</th>
                            <th className="encabezado-detalle"></th>
                            <th className="encabezado-detalle"></th>
                        </tr>
                    </thead>

                    <tbody>
                        
                        {!resultado.result ? <tr><td>cargando...</td></tr> : resultado.result.map((pedido, index) => {
                            return <tr key={index}>
                                <td className="align-middle"><button className="btn btn-primary" name="verdetalle" onClick={() => props.ver(pedido.ped_codigo)} >Ver detalle</button></td>
                                <td className="align-middle">{pedido.ped_codigo}</td>
                                <td className="align-middle">{pedido.cli_nombre1 + ' ' + pedido.cli_apelli1}</td>
                                <td className="align-middle">{pedido.ped_estado}</td>
                                <td className="text-end align-middle">${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_valor))}</td>
                                <td className="text-end align-middle">${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_iva))}</td>
                                <td className="text-end align-middle">${new Intl.NumberFormat("de-DE").format(pedido.ped_descue)}</td>
                                <td className="text-end align-middle">${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_valortotal))}</td>
                                <td className="align-middle">{pedido.ped_fechac}</td>
                                {
                                    campo_medio_de_pago === "SI" ?
                                        <td className="align-middle">{pedido.ped_medpag}</td>
                                        :
                                        ""
                                }
                                <td className="align-middle">{pedido.ped_observ}</td>
                                <td className="align-middle">{pedido.ped_estado === "Pendiente" ? <button className="btn btn-primary" onClick={() => props.editar(pedido.ped_codigo)}>Editar</button> : ""}</td>
                                <td className="align-middle">{pedido.ped_estado === "Pendiente" ? <button className="btn btn-primary" onClick={() => props.anular(pedido.ped_codigo)}>Anular</button> : ""}</td>
                            </tr>
                        })}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><b>Total</b></td>
                            <td className="text-end align-middle"><b>${total_sin_iva}</b></td>
                            <td className="text-end align-middle"><b>${total_sin_iva}</b></td>
                            <td className="text-end align-middle"><b>${total_sin_iva}</b></td>
                            <td className="text-end align-middle"><b>${total_sin_iva}</b></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                :
                <div className="list-group">
                    {!resultado.result ? "cargando..." : resultado.result.map((pedido, index) => {
                        return <div key={index} className="list-group-item list-group-item-action bg-dark text-white border-white">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">Código: {pedido.ped_codigo}</h5>
                                {pedido.ped_estado === "Pendiente" ? <small onClick={() => props.editar(pedido.ped_codigo)}>Editar</small> : ""}
                                {pedido.ped_estado === "Pendiente" ? <small onClick={() => props.editar(pedido.ped_codigo)}>Anular</small> : ""}
                            </div>
                            <p className="mb-1"><b>Cliente</b>: {pedido.cli_nombre1 + ' ' + pedido.cli_apelli1}</p>
                            <p className="mb-1"><b>Estado</b>: {pedido.ped_estado}</p>
                            <p className="mb-1"><b>Valor sin IVA</b>: ${new Intl.NumberFormat("de-DE").format(pedido.ped_valor)}</p>
                            <p className="mb-1"><b>Descuento</b>: ${new Intl.NumberFormat("de-DE").format(pedido.ped_descue)}</p>
                            <p className="mb-1"><b>IVA</b>: ${new Intl.NumberFormat("de-DE").format(pedido.ped_iva)}</p>
                            <p className="mb-1"><b>Valor total</b>: ${new Intl.NumberFormat("de-DE").format(pedido.ped_valortotal)}</p>
                            <p className="mb-1"><b>Estado</b>: {pedido.ped_estado}</p>
                            {
                                campo_medio_de_pago === "SI" ?
                                    <p className="mb-1"><b>Medio de Pago</b>: {pedido.ped_medpag}</p>
                                    :
                                    ""
                            }
                            <p className="mb-1"><b>Observación</b>: {pedido.ped_observ}</p>
                        </div>
                    })}
                </div>

            }

            <div className="col text-center">
                <button className="btn btn-outline-light" onClick={() => props.pag(resultado.anterior_pagina)}>Anterior</button>
                <button className="btn btn-outline-light" onClick={() => props.pag(resultado.siguiente_pagina)}>Siguiente</button>
            </div>

        </div>
    )
}

export default Detalle;
