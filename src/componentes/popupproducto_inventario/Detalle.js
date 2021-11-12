import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Detalle(props) {
    const resultado = props.respuesta_json;
    const [precio_x_tipounidad_winproducto, setPrecio_x_tipounidad_winproducto] = useState('NO');
    //console.log(resultado.result);

    useEffect(() => {

        const UrlParametros = `${Dominio}/parametros/parametros`;

        const obtenerParametros = async () => {
            await axios.post(UrlParametros, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Buscar',
            })
                .then(response => {
                    const respuesta = response.data;
                    //console.log(respuesta);
                    respuesta.result.map((dato, index) => {
                        if (dato.par_nombre === "PRECIO_X_TIPOUNIDAD_WINPRODUCTO") {
                            setPrecio_x_tipounidad_winproducto(dato.par_valor);
                        }

                        return "";
                    })
                })
        }
        obtenerParametros();


    }, []);

    return (
        <div>
            <h1>Resultado</h1>

            <div className="list-group">
                {!resultado.result ? "cargando..." : resultado.result.map((producto, index) => {
                    return <div key={index} style={{ cursor: 'pointer' }} className="list-group-item list-group-item-action bg-dark text-white border-white" onClick={() => props.enviar(producto.pro_codigo)}>
                        <div className="d-flex w-100 justify-content-between">
                            <h4 className="mb-1">{producto.pro_nombre}</h4>
                        </div>
                        <p className="mb-1"><b>Codigo</b>: {producto.pro_codigo}</p>
                        <p className="mb-1"><b>Costo</b>: ${new Intl.NumberFormat("de-DE").format(Math.round(producto.pro_compra))}</p>
                        {
                            precio_x_tipounidad_winproducto === "SI" ?
                                <>
                                    <p className="mb-1"><b>Laboratorio</b>: {producto.gru_nombre}</p>
                                </>
                                :
                                ""
                        }
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
