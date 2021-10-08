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
                                <h5 className="card-title">{producto.pro_nombre}</h5>
                                <p className="card-text">Costo: ${new Intl.NumberFormat("de-DE").format(producto.pro_compra)}</p>
                                <p className="card-text">Grupo: {producto.gru_nombre}</p>
                            </div>
                        </div>
                    })
            }

        </div>

    )
}

export default CardProducto;
