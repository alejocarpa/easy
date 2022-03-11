import React from 'react';

function CardProducto(props) {
    const resultadoJSON = props.resultado;

    

    return (
        <div className="row p-2">
            {
                !resultadoJSON ?
                    ""
                    :
                    resultadoJSON.map((producto, index) => {
                        return <div key={index} className="card m-1" style={{ width: "15rem" }} >
                            <div className="card-body" onClick={() => props.agregar(producto.pro_codigo, producto.pro_compra, producto.pro_iva, producto.pro_nombre)}>
                                <h6 className="card-title">{producto.pro_nombre}</h6>
                                <p className="card-text">
                                    <b>Cod:</b> {producto.pro_codigo}
                                    <br></br>
                                    <b>Costo:</b> ${new Intl.NumberFormat("de-DE").format(producto.pro_compra)}
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
