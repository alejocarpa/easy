import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Detalle(props) {
    const resultado = props.respuesta_json;
    //console.log(resultado.result);
    const [anchoVentana, setAnchoVentana] = useState(window.innerWidth);
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
        window.addEventListener('resize', handleResize );

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
            {anchoVentana > 768 ? 

                <table className={color_tabla}>
                    <thead>
                        <tr>
                            <th className="encabezado-detalle">Codigo Producto</th>
                            <th className="encabezado-detalle">Nombre</th>
                            <th className="encabezado-detalle">Laboratorio</th>
                            <th className="encabezado-detalle">Total Inventario</th>
                            <th className="encabezado-detalle">Cantidad Blister</th>
                            <th className="encabezado-detalle">Cantidad Cajas</th>
                            <th className="encabezado-detalle">Costo</th>
                            <th className="encabezado-detalle">Fecha Vencimiento</th>
                        </tr>
                    </thead>
                
                    <tbody>
                    {!resultado.result ? <tr><td>cargando...</td></tr> : resultado.result.map((inventario, index) => {
                        let cantidad_medida2 = 0;
                        let cantidad_medida3 = 0;
                        if(inventario.det_medida2 && inventario.det_medida2!=="0"){
                            if(inventario.det_medida3){
                                cantidad_medida2 = Math.floor(inventario.mov_stock/inventario.det_medida3);
                                cantidad_medida3 = Math.floor(cantidad_medida2/inventario.det_medida2);
                            }
                        }
                        return <tr key={index}>
                                    <td className="align-middle">{inventario.mov_produc}</td>
                                    <td className="align-middle">{inventario.mov_nompro}</td>
                                    <td className="align-middle">{inventario.gru_nombre}</td>
                                    <td className="fs-3 fw-bold text-wrap text-center">{inventario.mov_stock}</td>
                                    <td className="align-middle text-center">{cantidad_medida2}</td>
                                    <td className="align-middle text-center">{cantidad_medida3}</td>
                                    <td className="align-middle">${new Intl.NumberFormat("de-DE").format(Math.round(inventario.pro_compra))}</td>
                                    <td className="align-middle">{inventario.mov_fechav}</td>
                                </tr>
                                
                    })}
                    </tbody>
                </table>
            
            : 
            <div className="list-group">
                {!resultado.result ? "cargando..." : resultado.result.map((inventario, index) => {
                    let cantidad_medida2 = 0;
                    let cantidad_medida3 = 0;
                    if(inventario.det_medida2 && inventario.det_medida2!=="0"){
                        if(inventario.det_medida3){
                            cantidad_medida2 = Math.floor(inventario.mov_stock/inventario.det_medida3);
                            cantidad_medida3 = Math.floor(cantidad_medida2/inventario.det_medida2);
                        }
                    }
                    return <div key={index} className="list-group-item list-group-item-action bg-dark text-white border-white">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">Codigo Producto: {inventario.mov_produc}</h5>
                                </div>
                                <p className="mb-1"><b>Nombre</b>: {inventario.mov_nompro}</p>
                                <p className="mb-1"><b>Laboratorio</b>: {inventario.gru_nombre}</p>
                                <p className="mb-1"><b>Total Inventario</b>: {inventario.mov_stock}</p>
                                <p className="mb-1"><b>Cantidad Blister</b>: {cantidad_medida2}</p>
                                <p className="mb-1"><b>Cantidad Cajas</b>: {cantidad_medida3}</p>
                                <p className="mb-1"><b>Costo</b>: {inventario.pro_compra}</p>
                                <p className="mb-1"><b>Fecha Vencimiento</b>: {inventario.mov_fechav}</p>
                            </div>
                })}
            </div>
            
            }

            <div className="col text-center">
                <button className="btn btn-outline-light" onClick={()=>props.pag(resultado.anterior_pagina)}>anterior</button>
                <button className="btn btn-outline-light" onClick={()=>props.pag(resultado.siguiente_pagina)}>siguiente</button>
            </div>
            
        </div>
    )
}

export default Detalle;
