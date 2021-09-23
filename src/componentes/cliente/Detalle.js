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
                            <th className="encabezado-detalle">Apellido</th>
                            <th className="encabezado-detalle">No. Documento</th>
                            <th className="encabezado-detalle">Celular</th>
                            <th className="encabezado-detalle">Dirección</th>
                            <th className="encabezado-detalle">Barrio</th>
                            <th className="encabezado-detalle"></th>
                        </tr>
                    </thead>
                
                    <tbody>
                    {!resultado.result ? <tr><td>cargando...</td></tr> : resultado.result.map((cliente, index) => {
                        return <tr key={index}>
                                    <td className="align-middle">{cliente.cli_codigo}</td>
                                    <td className="align-middle">{cliente.cli_nombre1+" "+cliente.cli_nombre2}</td>
                                    <td className="align-middle">{cliente.cli_apelli1+" "+cliente.cli_apelli2}</td>
                                    <td className="align-middle">{cliente.cli_docume}</td>
                                    <td className="align-middle">{cliente.cli_celula}</td>
                                    <td className="align-middle">{cliente.cli_direcc}</td>
                                    <td className="align-middle">{cliente.cli_barrio}</td>
                                    <td className="align-middle"><button className="btn btn-primary" onClick={()=>props.editar(cliente.cli_codigo)}>Editar</button></td>
                                </tr>
                                
                    })}
                    </tbody>
                </table>
            
            : 
            <div className="list-group">
                {!resultado.result ? "cargando..." : resultado.result.map((cliente, index) => {
                    return <div key={index} className="list-group-item list-group-item-action bg-dark text-white border-white">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">Código: {cliente.cli_codigo}</h5>
                                    <small onClick={()=>props.editar(cliente.cli_codigo)}>Editar</small>
                                </div>
                                <p className="mb-1"><b>Nombre</b>: {cliente.cli_nombre1+" "+cliente.cli_nombre2}</p>
                                <p className="mb-1"><b>Apellido</b>: {cliente.cli_apelli1+" "+cliente.cli_apelli2}</p>
                                <p className="mb-1"><b>Documento</b>: {cliente.cli_docume}</p>
                                <p className="mb-1"><b>Celular</b>: {cliente.cli_celula}</p>
                                <p className="mb-1"><b>Dirección</b>: {cliente.cli_direcc}</p>
                                <p className="mb-1"><b>Barrio</b>: {cliente.cli_barrio}</p>
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
