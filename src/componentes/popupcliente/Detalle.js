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

            <div className="list-group">
                {!resultado.result ? "cargando..." : resultado.result.map((cliente, index) => {
                    return <div key={index} style={{cursor: 'pointer'}} className="list-group-item list-group-item-action bg-dark text-white border-white" onClick={() => props.enviar(cliente.cli_codigo,cliente.cli_nombre1,cliente.cli_apelli1)}>
                        <div className="d-flex w-100 justify-content-between">
                            <h4 className="mb-1">{cliente.cli_nombre1+" "+cliente.cli_apelli1}</h4>
                        </div>
                        <p className="mb-1"><b>Documento</b>: {cliente.cli_docume}</p>
                        <p className="mb-1"><b>Teléfono</b>: {cliente.cli_telefo}</p>
                        <p className="mb-1"><b># Celular</b>: {cliente.cli_celula}</p>
                        <p className="mb-1"><b>Dirección</b>: {cliente.cli_direcc}</p>
                        <p className="mb-1"><b>Observación</b>: {cliente.cli_observ}</p>
                    </div>
                })}
            </div>

            <div className="col text-center">
                <button className="btn btn-outline-light" onClick={() => props.pag(resultado.anterior_pagina)}>anterior</button>
                <button className="btn btn-outline-light" onClick={() => props.pag(resultado.siguiente_pagina)}>siguiente</button>
            </div>

        </div>
    )
}

export default Detalle;
