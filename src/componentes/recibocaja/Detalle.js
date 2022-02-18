import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Detalle(props) {
    const resultado = props.respuesta_json;
    //console.log(resultado.result);
    const [anchoVentana, setAnchoVentana] = useState(window.innerWidth);
    const [arrayRecibos, setArrayRecibos] = useState([]);
    const [color_tabla, setColorTabla] = useState();

    const check_todos_recibos = () => {
        let check = document.getElementById("check_todos_recibos").checked;
        let array_recibo = [];

        if (check) {
            resultado.result.map((recibo, index) => {
                document.getElementById(recibo.rec_codigo).checked = true;
                array_recibo.push(recibo.rec_codigo)
            })
        } else {
            resultado.result.map((recibo, index) => {
                document.getElementById(recibo.rec_codigo).checked = false;
                array_recibo.splice(index, 1)
            })
        }

        setArrayRecibos(array_recibo);
    }

    const arreglo_recibo = (rec_codigo) => {
        let check = document.getElementById(rec_codigo).checked;
        //alert(check);
        if (check) {
            setArrayRecibos([...arrayRecibos, rec_codigo]);
        } else {

            let arreglo_recibos = document.getElementById('array_recibos').value;
            let texto = arreglo_recibos.toString();
            let array_recibo = texto.split(",");

            let objeto = array_recibo.lastIndexOf(rec_codigo);
            array_recibo.splice(objeto, 1);
            setArrayRecibos(array_recibo);
        }
    }

    const imprimirRecibo = async() => {
        
        const UrlRecibocaja = `${Dominio}/recibocaja/recibocaja`;
        await axios.post(UrlRecibocaja, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'imprimir',
            array_recibos: arrayRecibos,
            limite: 'NO'
        })
            .then(response => {

                const responseJSON = response.data;
                //console.log(responseJSON);

                window.open(responseJSON.url_impresion);
            })
    }

    useEffect(() => {
        const UrlParametros = `${Dominio}/parametros/parametros`;

        const obtenerColorTabla = async () => {
            let tabla = '';
            
            await axios.post(UrlParametros, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Buscar',
                par_nombre: 'COLOR_TABLA'
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;

                    if (responseJSON) {
                        responseJSON.result.map((valor) => {
                            tabla = valor.par_valor;
                        })

                        setColorTabla(tabla);
                    }
                })
        }
        obtenerColorTabla();
    }, []);

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
            <div className="detalle-exporta" style={color_tabla === "table table-dark" ? {background: '#212529'} : {background: '#D1E7DD'}}>
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

                <table className={color_tabla}>

                    <thead>
                        <tr>
                            <th className="encabezado-detalle"><input type="checkbox" name="check_todos_recibos" id="check_todos_recibos" onClick={() => check_todos_recibos()} /></th>
                            <th className="encabezado-detalle">Codigo</th>
                            <th className="encabezado-detalle">Cliente</th>
                            <th className="encabezado-detalle">Asesor</th>
                            <th className="encabezado-detalle">Valor</th>
                            <th className="encabezado-detalle">Abono</th>
                            <th className="encabezado-detalle">Saldo</th>
                            <th className="encabezado-detalle">Fecha</th>
                            <th className="encabezado-detalle">Factura</th>
                            <th className="encabezado-detalle">Estado</th>
                            <th className="encabezado-detalle"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {!resultado.result ? <tr><td>cargando...</td></tr> : resultado.result.map((recibo, index) => {
                            return <tr key={index}>
                                <td className="align-middle"><input type="checkbox" name="check" id={recibo.rec_codigo} onClick={() => arreglo_recibo(recibo.rec_codigo)} /></td>
                                <td className="align-middle">{recibo.rec_codigo}</td>
                                <td className="align-middle">{recibo.cli_nombre1 + ' ' + recibo.cli_apelli1}</td>
                                <td className="align-middle">{recibo.ase_nombre}</td>
                                <td className="align-middle">${new Intl.NumberFormat("de-DE").format(Math.round(recibo.rec_valor))}</td>
                                <td className="align-middle">${new Intl.NumberFormat("de-DE").format(Math.round(recibo.rec_abono))}</td>
                                <td className="align-middle">${new Intl.NumberFormat("de-DE").format(Math.round(recibo.rec_saldo))}</td>
                                <td className="align-middle">{recibo.rec_fechac}</td>
                                <td className="align-middle">{recibo.rec_factur}</td>
                                <td className="align-middle">{recibo.rec_estado === "P" ? "Pagado" : "Anulado"}</td>
                                <td>{recibo.rec_estado === "P" ? <button className="btn btn-primary" onClick={() => props.anular(recibo.rec_codigo,recibo.rec_factur)}>Anular</button> : ""}</td>
                            </tr>

                        })}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><b>TOTAL</b></td>
                            <td><b>${new Intl.NumberFormat("de-DE").format(Math.round(resultado.total_abonos))}</b></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan="11" className="text-center">
                                <button className="btn btn-primary" target="_blank" onClick={imprimirRecibo}>Imprimir</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                :
                <div className="list-group">
                    {!resultado.result ? "cargando..." : resultado.result.map((recibo, index) => {
                        return <div key={index} className="list-group-item list-group-item-action bg-dark text-white border-white">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">Código: {recibo.rec_codigo} <input type="checkbox" name="check" id={recibo.rec_codigo} onClick={() => arreglo_recibo(recibo.rec_codigo)} /></h5>
                                {recibo.rec_estado === "P" ? <small onClick={() => props.anular(recibo.rec_codigo,recibo.rec_factur)}>Anular</small> : ""}
                            </div>
                            <p className="mb-1"><b>Cliente</b>: {recibo.cli_nombre1 + ' ' + recibo.cli_apelli1}</p>
                            <p className="mb-1"><b>Asesor</b>: {recibo.ase_nombre}</p>
                            <p className="mb-1"><b>Valor</b>: ${new Intl.NumberFormat("de-DE").format(Math.round(recibo.rec_valor))}</p>
                            <p className="mb-1"><b>Abono</b>: ${new Intl.NumberFormat("de-DE").format(Math.round(recibo.rec_abono))}</p>
                            <p className="mb-1"><b>Saldo</b>: ${new Intl.NumberFormat("de-DE").format(Math.round(recibo.rec_saldo))}</p>
                            <p className="mb-1"><b>Fecha</b>: {recibo.rec_fechac}</p>
                            <p className="mb-1"><b>Factura</b>: {recibo.rec_factur}</p>
                            <p className="mb-1"><b>Estado</b>: {recibo.rec_estado === "P" ? "Pagado" : "Anulado"}</p>
                        </div>
                    })}
                    <button className="btn btn-primary" target="_blank" onClick={imprimirRecibo}>Imprimir</button>
                </div>

            }

            <div><input type="hidden" name="array_recibos" id="array_recibos" value={arrayRecibos} /></div>

            <div className="col text-center">
                <button className="btn btn-outline-light" onClick={() => props.pag(resultado.anterior_pagina)}>anterior</button>
                <button className="btn btn-outline-light" onClick={() => props.pag(resultado.siguiente_pagina)}>siguiente</button>
            </div>

        </div>
    )
}

export default Detalle;
