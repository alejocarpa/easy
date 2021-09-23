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
                            <th className="encabezado-detalle">Nit</th>
                            <th className="encabezado-detalle">Teléfono</th>
                            <th className="encabezado-detalle">Dirección</th>
                            <th className="encabezado-detalle"></th>
                        </tr>
                    </thead>
                
                    <tbody>
                    {!resultado.result ? <tr><td>cargando...</td></tr> : resultado.result.map((proveedor, index) => {
                        return <tr key={index}>
                                    <td className="align-middle">{proveedor.pro_codigo}</td>
                                    <td className="align-middle">{proveedor.pro_nombre}</td>
                                    <td className="align-middle">{proveedor.pro_nit}</td>
                                    <td className="align-middle">{proveedor.pro_telefo}</td>
                                    <td className="align-middle">{proveedor.pro_direcc}</td>
                                    <td><button className="btn btn-primary" onClick={()=>props.editar(proveedor.pro_codigo)}>Editar</button></td>
                                </tr>
                                
                    })}
                    </tbody>
                </table>
            
            : 
            <div className="list-group">
                {!resultado.result ? "cargando..." : resultado.result.map((proveedor, index) => {
                    return <div key={index} className="list-group-item list-group-item-action bg-dark text-white border-white">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">Código: {proveedor.pro_codigo}</h5>
                                    <small onClick={()=>props.editar(proveedor.pro_codigo)}>Editar</small>
                                </div>
                                <p className="mb-1"><b>Nombre</b>: {proveedor.pro_nombre}</p>
                                <p className="mb-1"><b>Nit</b>: {proveedor.pro_nit}</p>
                                <p className="mb-1"><b>Teléfono</b>: {proveedor.pro_telefo}</p>
                                <p className="mb-1"><b>Dirección</b>: {proveedor.pro_direcc}</p>
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
