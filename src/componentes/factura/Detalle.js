import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Detalle(props) {
    const resultado = props.respuesta_json;
    //console.log(resultado.result);
    const [anchoVentana, setAnchoVentana] = useState(window.innerWidth);
    const [arrayFacturas, setArrayFacturas] = useState([]);

    const check_todas_facturas = () => {
        let check = document.getElementById("check_todas_facturas").checked;
        let array_factura = [];

        if (check) {
            resultado.result.map((factura, index) => {
                document.getElementById(factura.fac_numero).checked = true;
                array_factura.push(factura.fac_numero)
            })
        } else {
            resultado.result.map((factura, index) => {
                document.getElementById(factura.fac_numero).checked = false;
                array_factura.splice(index, 1)
            })
        }

        setArrayFacturas(array_factura);
    }

    const arreglo_factura = (fac_numero) => {
        let check = document.getElementById(fac_numero).checked;
        //alert(check);
        if (check) {
            setArrayFacturas([...arrayFacturas, fac_numero]);
        } else {

            let arreglo_facturas = document.getElementById('array_facturas').value;
            let texto = arreglo_facturas.toString();
            let array_factura = texto.split(",");

            let objeto = array_factura.lastIndexOf(fac_numero);
            array_factura.splice(objeto, 1);
            setArrayFacturas(array_factura);
        }
    }

    const imprimirFactura = async() => {
        
        const UrlFactura = `${Dominio}/factura/factura`;
        await axios.post(UrlFactura, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'imprimir',
            array_facturas: arrayFacturas,
            limite: 'NO'
        })
            .then(response => {

                const responseJSON = response.data;
                //console.log(responseJSON);

                window.open(responseJSON.url_impresion);
            })
    }

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
            <h1>RESULTADO</h1>
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
                            <th className="encabezado-detalle"><input type="checkbox" name="check_todas_facturas" id="check_todas_facturas" onClick={() => check_todas_facturas()} /></th>
                            <th className="encabezado-detalle">Numero</th>
                            <th className="encabezado-detalle">Pedido</th>
                            <th className="encabezado-detalle">Cliente</th>
                            <th className="encabezado-detalle">Valor Total</th>
                            <th className="encabezado-detalle">Estado</th>
                            <th className="encabezado-detalle">Fecha</th>
                            <th className="encabezado-detalle">Hora</th>
                            <th className="encabezado-detalle">Forma Pago</th>
                            <th className="encabezado-detalle">Tipo</th>
                            <th className="encabezado-detalle"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {!resultado.result ? <tr><td>cargando...</td></tr> : resultado.result.map((factura, index) => {
                            return <tr key={index}>
                                <td><input type="checkbox" name="check" id={factura.fac_numero} onClick={() => arreglo_factura(factura.fac_numero)} /></td>
                                <td>{factura.fac_numero}</td>
                                <td>{factura.fac_pedido}</td>
                                <td>{factura.cli_nombre1 + ' ' + factura.cli_apelli1}</td>
                                <td>${new Intl.NumberFormat("de-DE").format(Math.round(factura.fac_valortotal))}</td>
                                <td>{factura.fac_estado === "C" ? "Cancelada" : factura.fac_estado === "P" ? "Pendiente" : factura.fac_estado === "A" ? "Anulada" : ""}</td>
                                <td>{factura.fac_fechac}</td>
                                <td>{factura.fac_horac}</td>
                                <td>{factura.fac_credit === "0" ? "Contado" : factura.fac_credit === "1" ? "Credito" : ""}</td>
                                <td>{factura.fac_tipo === "F" ? "Factura" : "Remision"}</td>
                                <td><button onClick={() => props.editar(factura.fac_numero)}>Editar</button></td>
                            </tr>

                        })}
                        <tr>
                            <td colSpan="11" className="text-center">
                                <button className="btn btn-primary" target="_blank" onClick={imprimirFactura}>Imprimir</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                :
                <div className="list-group">
                    {!resultado.result ? "cargando..." : resultado.result.map((factura, index) => {
                        return <div key={index} className="list-group-item list-group-item-action bg-dark text-white border-white">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">Numero: {factura.fac_numero}</h5>
                                <small onClick={() => props.editar(factura.fac_numero)}>Editar</small>
                            </div>
                            <p className="mb-1"><b>Pedido</b>: {factura.fac_pedido}</p>
                            <p className="mb-1"><b>Cliente</b>: {factura.cli_nombre1 + ' ' + factura.cli_apelli1}</p>
                            <p className="mb-1"><b>Valor Total</b>: ${new Intl.NumberFormat("de-DE").format(Math.round(factura.fac_valortotal))}</p>
                            <p className="mb-1"><b>Estado</b>: {factura.fac_estado === "C" ? "Cancelada" : factura.fac_estado === "P" ? "Pendiente" : factura.fac_estado === "A" ? "Anulada" : ""}</p>
                            <p className="mb-1"><b>Fecha</b>: {factura.fac_fechac}</p>
                            <p className="mb-1"><b>Hora</b>: {factura.fac_horac}</p>
                            <p className="mb-1"><b>Forma Pago</b>: {factura.fac_credit === "0" ? "Contado" : factura.fac_credit === "1" ? "Credito" : ""}</p>
                            <p className="mb-1"><b>Tipo</b>: {factura.fac_tipo === "F" ? "Factura" : "Remision"}</p>
                        </div>
                    })}
                </div>

            }

            <div><input type="hidden" name="array_facturas" id="array_facturas" value={arrayFacturas} /></div>

            <div className="col text-center">
                <button className="btn btn-outline-light" onClick={() => props.pag(resultado.anterior_pagina)}>anterior</button>
                <button className="btn btn-outline-light" onClick={() => props.pag(resultado.siguiente_pagina)}>siguiente</button>
            </div>

        </div>
    )
}

export default Detalle;
