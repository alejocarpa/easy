import React from 'react';

function VerDetalle(props) {

    const resultado = props.respuesta_json.result;
    const resultadoDetalle = props.respuesta_json.resultDetalle;
    let total = 0;
    return (
        <div className="container mt-3">

            <table className="table table-dark table-hover h5">
                <thead>
                    <tr>
                        <th className="encabezado-detalle">Codigo</th>
                        <th className="encabezado-detalle">Cliente</th>
                        <th className="encabezado-detalle">Asesor</th>
                        <th className="encabezado-detalle">Tipo</th>
                        <th className="encabezado-detalle">Estado</th>
                        <th className="encabezado-detalle">Fecha</th>
                        <th className="encabezado-detalle">IVA</th>
                        <th className="encabezado-detalle">Valor sin iva</th>
                        <th className="encabezado-detalle">Valor Total</th>
                        <th className="encabezado-detalle">Abono</th>
                        <th className="encabezado-detalle">Observación</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        !resultado ? "Cargando..."

                            :

                            resultado.map((pedido, index) => {
                                return <tr key={index}>
                                    <td>{pedido.ped_codigo}</td>
                                    <td>{pedido.cli_nombre1 + " " + pedido.cli_apelli1}</td>
                                    <td>{pedido.ase_nombre}</td>
                                    <td>{pedido.ped_credit === "1" ? "Crédito" : "Contado"}</td>
                                    <td>{pedido.ped_estado}</td>
                                    <td>{pedido.ped_fechac}</td>
                                    <td>${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_iva))}</td>
                                    <td>${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_valor))}</td>
                                    <td>${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_valortotal))}</td>
                                    <td>${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_abono))}</td>
                                    <td>{pedido.ped_observ}</td>
                                </tr>
                            })
                    }
                </tbody>
            </table>

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
                                    <td>{detallepedido.ped_cantid}</td>
                                    <td>{new Intl.NumberFormat("de-DE").format(Math.round(detallepedido.ped_iva))}%</td>
                                    <td>${new Intl.NumberFormat("de-DE").format(Math.round(detallepedido.ped_valor))}</td>
                                    <td>${new Intl.NumberFormat("de-DE").format(Math.round(total))}</td>
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