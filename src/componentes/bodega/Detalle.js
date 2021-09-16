import React, { useState, useEffect } from 'react';

function Detalle(props) {
    const resultado = props.respuesta_json;
    //console.log(resultado.result);
    const [anchoVentana, setAnchoVentana] = useState(window.innerWidth);

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
                            <th className="encabezado-detalle">Codigo</th>
                            <th className="encabezado-detalle">Nombre</th>
                            <th className="encabezado-detalle">Resolución</th>
                            <th className="encabezado-detalle">Consecutivo desde</th>
                            <th className="encabezado-detalle">Consecutivo hasta</th>
                            <th className="encabezado-detalle">Prefijo</th>
                            <th className="encabezado-detalle">Consecutivo</th>
                            <th className="encabezado-detalle">Regimen</th>
                            <th className="encabezado-detalle"></th>
                        </tr>
                    </thead>
                
                    <tbody>
                    {!resultado.result ? <tr><td>cargando...</td></tr> : resultado.result.map((bodega, index) => {
                        return <tr key={index}>
                                    <td>{bodega.bod_codigo}</td>
                                    <td>{bodega.bod_nombre}</td>
                                    <td>{bodega.bod_resolu}</td>
                                    <td>{bodega.bod_facini}</td>
                                    <td>{bodega.bod_facfin}</td>
                                    <td>{bodega.bod_prefij}</td>
                                    <td>{bodega.bod_consec}</td>
                                    <td>{bodega.bod_regime}</td>
                                    <td><button onClick={()=>props.editar(bodega.bod_codigo)}>Editar</button></td>
                                </tr>
                                
                    })}
                    </tbody>
                </table>
            
            : 
            <div className="list-group">
                {!resultado.result ? "cargando..." : resultado.result.map((bodega, index) => {
                    return <div key={index} className="list-group-item list-group-item-action bg-dark text-white border-white">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">Código: {bodega.bod_codigo}</h5>
                                    <small onClick={()=>props.editar(bodega.bod_codigo)}>Editar</small>
                                </div>
                                <p className="mb-1"><b>Nombre</b>: {bodega.bod_nombre}</p>
                                <p className="mb-1"><b>Estado</b>: {bodega.bod_resolu}</p>
                                <p className="mb-1"><b>Estado</b>: {bodega.bod_facini}</p>
                                <p className="mb-1"><b>Estado</b>: {bodega.bod_facfin}</p>
                                <p className="mb-1"><b>Estado</b>: {bodega.bod_prefij}</p>
                                <p className="mb-1"><b>Estado</b>: {bodega.bod_consec}</p>
                                <p className="mb-1"><b>Estado</b>: {bodega.bod_regime}</p>
                            </div>
                })}
            </div>
            
            }

            <div>
                <button onClick={()=>props.pag(resultado.anterior_pagina)}>anterior</button>
                <button onClick={()=>props.pag(resultado.siguiente_pagina)}>siguiente</button>
            </div>
            
        </div>
    )
}

export default Detalle;
