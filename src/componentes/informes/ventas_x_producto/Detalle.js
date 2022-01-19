import React, { useState, useEffect } from 'react';

function Detalle(props) {
    const resultado = props.respuesta_json;
    //console.log(resultado.result);
    const [anchoVentana, setAnchoVentana] = useState(window.innerWidth);

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
                            <th className="encabezado-detalle">Producto</th>
                            <th className="encabezado-detalle">Cantidad</th>
                            <th className="encabezado-detalle">Valor Venta</th>
                            <th className="encabezado-detalle">Costo</th>
                            <th className="encabezado-detalle">Margen de utilidad</th>
                        </tr>
                    </thead>

                    <tbody>
                        {!resultado.result ? <tr><td>cargando...</td></tr> : resultado.result.map((ventas, index) => {
                            return <tr key={index}>
                                <td className="align-middle">{ventas.fac_nompro}</td>
                                <td className="align-middle">{ventas.cantidad}</td>
                                <td className="align-middle">${new Intl.NumberFormat("de-DE").format(Math.round(ventas.valor))}</td>
                                <td className="align-middle">${new Intl.NumberFormat("de-DE").format(Math.round(ventas.costo))}</td>
                                <td className="align-middle">${new Intl.NumberFormat("de-DE").format(Math.round(ventas.margen))}</td>
                            </tr>

                        })}
                        <tr>
                            <td><b>TOTALES</b></td>
                            <td></td>
                            <td><b>${new Intl.NumberFormat("de-DE").format(Math.round(resultado.total_venta))}</b></td>
                            <td><b>${new Intl.NumberFormat("de-DE").format(Math.round(resultado.total_costo))}</b></td>
                            <td><b>${new Intl.NumberFormat("de-DE").format(Math.round(resultado.total_margen))}</b></td>
                        </tr>
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

            <div className="col text-center">
                <button className="btn btn-outline-light" onClick={() => props.pag(resultado.anterior_pagina)}>anterior</button>
                <button className="btn btn-outline-light" onClick={() => props.pag(resultado.siguiente_pagina)}>siguiente</button>
            </div>

        </div>
    )
}

export default Detalle;
