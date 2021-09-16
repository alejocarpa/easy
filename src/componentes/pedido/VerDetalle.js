import React from 'react';

function VerDetalle(props) {

    const resultado = props.respuesta_json.result;
    const resultadoDetalle = props.respuesta_json.resultDetalle;
    let total = 0;
    return (
        <div className="container mt-3">

            {
                !resultado ? "Cargando..."
                    :
                    resultado.map((pedido, index) => {
                        return <div key={index} className="list-group-item list-group-item-action bg-dark text-white border-black">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">Código: {pedido.ped_codigo}</h5>
                            </div>
                            <p className="mb-1"><b>Cliente</b>: {pedido.cli_nombre1+' '+pedido.cli_apelli1}</p>
                            <p className="mb-1"><b>Asesor</b>: {pedido.ase_nombre}</p>
                            <p className="mb-1"><b>Tipo</b>: {pedido.ped_credit === "1" ? "Crédito" : "Contado"}</p>
                            <p className="mb-1"><b>Estado</b>: {pedido.ped_estado}</p>
                            <p className="mb-1"><b>Fecha</b>: {pedido.ped_fechac}</p>
                            <p className="mb-1"><b>Valor sin IVA</b>: ${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_valor))}</p>
                            <p className="mb-1"><b>IVA</b>: ${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_iva))}</p>
                            <p className="mb-1"><b>Descuento</b>: ${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_descue))}</p>
                            <p className="mb-1"><b>Valor Total</b>: ${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_valortotal))}</p>
                            <p className="mb-1"><b>Abono</b>: ${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_abono))}</p>
                            <p className="mb-1"><b>Observación</b>: {pedido.ped_observ}</p>
                        </div>
                    })
            }


      

            <hr className="my-4" />
            <table className="table table-dark table-hover h5">

                <thead>
                    <tr>
                        <th className="encabezado-detalle">Codigo</th>
                        <th className="encabezado-detalle">Nombre</th>
                        <th className="encabezado-detalle">Cantidad</th>
                        <th className="encabezado-detalle">IVA</th>
                        <th className="encabezado-detalle">Valor</th>
                        <th className="encabezado-detalle">Valor Total</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        !resultadoDetalle ? "Cargando..."

                            :

                            resultadoDetalle.map((detallepedido, index) => {
                                total = Math.round(parseInt(detallepedido.ped_valor) + ((parseInt(detallepedido.ped_valor) * parseInt(detallepedido.ped_iva)) / 100));
                                return <tr key={index}>
                                    <td>{detallepedido.ped_produc}</td>
                                    <td>{detallepedido.pro_nombre}</td>
                                    <td className="text-end">{detallepedido.ped_cantid}</td>
                                    <td className="text-end">{new Intl.NumberFormat("de-DE").format(Math.round(detallepedido.ped_iva))}%</td>
                                    <td className="text-end">${new Intl.NumberFormat("de-DE").format(Math.round(detallepedido.ped_valor))}</td>
                                    <td className="text-end">${new Intl.NumberFormat("de-DE").format(Math.round(total))}</td>
                                </tr>
                            })
                    }
                </tbody>
            </table>
            <div className="col text-center"><button className="btn btn-dark m-2" type="button" name="pantalla" value="Volver" onClick={() => props.volver()} >Volver</button></div>
        </div>
    )
}

export default VerDetalle;