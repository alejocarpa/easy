import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import VerDetalle from './VerDetalle';

function Detalle(props) {
    const resultado = props.respuesta_json;
    //console.log(resultado.result);
    const [anchoVentana, setAnchoVentana] = useState(window.innerWidth);
    const [carProducto, setcarProducto] = useState();

    const handleClose = () => {
        setcarProducto(<VerDetalle show={false} />);
    }
    
    const abrirModal = (producto,nombre) => {
        
        setcarProducto(<VerDetalle show={true} handleClose={handleClose} codigo_producto={producto} nombre_producto={nombre} />);

    }

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
            <div className="detalle-exporta" >
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

                <table className="table table-dark table-hover">

                    <thead>
                        <tr>
                            <th className="text-center encabezado-detalle">Producto</th>
                            <th className="text-center encabezado-detalle">Valor</th>
                            <th className="text-center encabezado-detalle">Bodega</th>
                            <th className="text-center encabezado-detalle">Entrada</th>
                            <th className="text-center encabezado-detalle">Salida</th>
                            <th className="text-center encabezado-detalle">Traslado Salida</th>
                            <th className="text-center encabezado-detalle">Traslado Entrada</th>
                            <th className="text-center encabezado-detalle">Facturado</th>
                            <th className="text-center encabezado-detalle">Total Inventario</th>
                            <th className="encabezado-detalle"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {!resultado.result ? <tr><td>cargando...</td></tr> : resultado.result.map((movimiento1, index) => {
                            return movimiento1.map((movimiento, index) => {
                                return <tr key={index}>
                                    <td className="align-middle">{movimiento.codigo_producto + '-' + movimiento.produc}</td>
                                    <td className="align-middle">${new Intl.NumberFormat("de-DE").format(Math.round(movimiento.val))}</td>
                                    <td className="align-middle">{movimiento.bod}</td>
                                    <td className="text-center align-middle">{movimiento.ent}</td>
                                    <td className="text-center align-middle">{movimiento.sal}</td>
                                    <td className="text-center align-middle">{movimiento.tra_sa}</td>
                                    <td className="text-center align-middle">{movimiento.tra_en}</td>
                                    <td className="text-center align-middle">{movimiento.fac}</td>
                                    <td className="text-center align-middle">{movimiento.total_inventario}</td>
                                    <td className="align-middle"><Button variant="primary" onClick={()=>abrirModal(movimiento.codigo_producto,movimiento.produc)}>Ver Detalle</Button></td>
                                </tr>
                            })
                        })}
                    </tbody>
                </table>

                :
                <div className="list-group">
                    {!resultado.result ? "cargando..." : resultado.result.map((laboratorio, index) => {
                        return <div key={index} className="list-group-item list-group-item-action bg-dark text-white border-white">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">Código: {laboratorio.gru_codigo}</h5>
                                <small onClick={() => props.editar(laboratorio.gru_codigo)}>Editar</small>
                            </div>
                            <p className="mb-1"><b>Nombre</b>: {laboratorio.gru_nombre}</p>
                            <p className="mb-1"><b>Estado</b>: {laboratorio.gru_estado === "A" ? "Activo" : "Inactivo"}</p>
                        </div>
                    })}
                </div>

            }

            <div id="cardproducto">{carProducto}</div>

            <div className="col text-center">
                <button className="btn btn-outline-light" onClick={() => props.pag(resultado.anterior_pagina)}>anterior</button>
                <button className="btn btn-outline-light" onClick={() => props.pag(resultado.siguiente_pagina)}>siguiente</button>
            </div>

        </div>
    )
}

export default Detalle;
