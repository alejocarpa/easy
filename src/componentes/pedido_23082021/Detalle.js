import React, { useState, useEffect } from 'react';

function Detalle(props) {
    const resultado = props.respuesta_json;
    //console.log(resultado);
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
                            <th className="encabezado-detalle"></th>
                            <th className="encabezado-detalle">Codigo</th>
                            <th className="encabezado-detalle">Cliente</th>
                            <th className="encabezado-detalle">Estado</th>
                            <th className="encabezado-detalle">Valor sin IVA</th>
                            <th className="encabezado-detalle">Descuento</th>
                            <th className="encabezado-detalle">IVA</th>
                            <th className="encabezado-detalle">Valor total</th>
                            <th className="encabezado-detalle">Fecha</th>
                            <th className="encabezado-detalle"></th>
                            <th className="encabezado-detalle"></th>
                        </tr>
                    </thead>
                
                    <tbody>
                    {!resultado.result ? <tr><td>cargando...</td></tr> : resultado.result.map((pedido, index) => {
                        return <tr key={index}>
                                    <td><button name="verdetalle" onClick={()=>props.ver(pedido.ped_codigo)} >Ver detalle</button></td>
                                    <td>{pedido.ped_codigo}</td>
                                    <td>{pedido.cli_nombre1+' '+pedido.cli_apelli1}</td>
                                    <td>{pedido.ped_estado}</td>
                                    <td>${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_valor))}</td>
                                    <td>${new Intl.NumberFormat("de-DE").format(pedido.ped_descue)}</td>
                                    <td>${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_iva))}</td>
                                    <td>${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_valortotal))}</td>
                                    <td>{pedido.ped_fechac}</td>
                                    <td>{pedido.ped_estado==="Pendiente" ? <button onClick={()=>props.editar(pedido.ped_codigo)}>Editar</button> : ""}</td>
                                    <td>{pedido.ped_estado==="Pendiente" ? <button onClick={()=>props.anular(pedido.ped_codigo)}>Anular</button> : ""}</td>
                                </tr>
                                
                    })}
                    </tbody>
                </table>
            
            : 
            <div className="list-group">
                {!resultado.result ? "cargando..." : resultado.result.map((pedido, index) => {
                    return <div key={index} className="list-group-item list-group-item-action bg-dark text-white border-white">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">Código: {pedido.ped_codigo}</h5>
                                    {pedido.ped_estado==="Pendiente" ? <small onClick={()=>props.editar(pedido.ped_codigo)}>Editar</small> : ""}
                                    {pedido.ped_estado==="Pendiente" ? <small onClick={()=>props.editar(pedido.ped_codigo)}>Anular</small> : ""}
                                </div>
                                <p className="mb-1"><b>Cliente</b>: {pedido.cli_nombre1+' '+pedido.cli_apelli1}</p>
                                <p className="mb-1"><b>Estado</b>: {pedido.ped_estado}</p>
                                <p className="mb-1"><b>Valor sin IVA</b>: ${new Intl.NumberFormat("de-DE").format(pedido.ped_valor)}</p>
                                <p className="mb-1"><b>Descuento</b>: ${new Intl.NumberFormat("de-DE").format(pedido.ped_descue)}</p>
                                <p className="mb-1"><b>IVA</b>: ${new Intl.NumberFormat("de-DE").format(pedido.ped_iva)}</p>
                                <p className="mb-1"><b>Valor total</b>: ${new Intl.NumberFormat("de-DE").format(pedido.ped_valortotal)}</p>
                                <p className="mb-1"><b>Estado</b>: {pedido.ped_estado}</p>
                            </div>
                })}
            </div>
            
            }

            <div className="col text-center">
                <button className="btn btn-light" onClick={()=>props.pag(resultado.anterior_pagina)}>Anterior</button>
                <button className="btn btn-outline-light" onClick={()=>props.pag(resultado.siguiente_pagina)}>Siguiente</button>
            </div>
            
        </div>
    )
}

export default Detalle;
