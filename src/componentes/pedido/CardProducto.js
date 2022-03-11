import React from 'react';

function CardProducto(props) {
    const resultadoJSON = props.resultado;
    let unidad_de_medida = props.unidad_de_medida
    

    return (
        <div className="row p-2">
            {
                !resultadoJSON ?
                    ""
                    :
                    resultadoJSON.map((producto, index) => {
                        let precio_mas_iva = Math.round(parseInt(producto.pro_costo) + ((parseInt(producto.pro_costo) * parseInt(producto.pro_iva)) / 100));
                        let precio_mas_iva_blister = Math.round(parseInt(producto.pro_precio2) + ((parseInt(producto.pro_precio2) * parseInt(producto.pro_iva)) / 100));
                        let precio_mas_iva_caja = Math.round(parseInt(producto.pro_precio3) + ((parseInt(producto.pro_precio3) * parseInt(producto.pro_iva)) / 100));
                        return <div key={index} className="card m-1" style={{ width: "15rem" }} >
                            <div className="card-body" onClick={() => props.agregar(producto.pro_codigo, producto.pro_costo, producto.pro_iva, producto.pro_nombre)}>
                                <h6 className="card-title">{producto.pro_nombre}</h6>
                                <p className="card-text">
                                    <b>Cod:</b> {producto.pro_codigo}
                                    <br></br>
                                    <b>Precio {unidad_de_medida === "SI" ? "Unitario" : ""}:</b> ${new Intl.NumberFormat("de-DE").format(precio_mas_iva)}
                                    <br></br>
                                    {unidad_de_medida === "SI" ? <b>Blister: </b> : ""}
                                    {unidad_de_medida === "SI" ? "$" + new Intl.NumberFormat("de-DE").format(precio_mas_iva_blister) : ""}
                                    <br></br>
                                    {unidad_de_medida === "SI" ? <b>Caja: </b> : ""}
                                    {unidad_de_medida === "SI" ? "$" + new Intl.NumberFormat("de-DE").format(precio_mas_iva_caja) : ""}
                                    <br></br>
                                    <b>Grupo:</b> {producto.gru_nombre}
                                    
                                </p>
                            </div>
                        </div>
                    })
            }

        </div>

    )
}

export default CardProducto;
