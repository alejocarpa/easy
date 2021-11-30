import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function DetalleCartera(props) {
    const resultado = props.respuesta_json;
    const cambioPantallaPedido = props.cambiarPantalla;

    const [anchoVentana, setAnchoVentana] = useState(window.innerWidth);
    const [array_facturas, setArray_facturas] = useState([]);
    const [array_valores, setArray_valores] = useState([]);

    const cambiarValor = (event) => {
        let codigo_factura = event.target.id;
        let cantidad_cartera = event.target.value;
        //console.log(cantidad_cartera);

        let saldo = document.getElementById('saldo/' + codigo_factura).value;
        //console.log(saldo);

        let arreglo_facturas = document.getElementById('array_facturas').value;
        let texto = arreglo_facturas.toString();
        let res = texto.split(",");

        let array_abono = document.getElementById('array_valores').value;
        let texto2 = array_abono.toString();
        array_abono = texto2.split(",");

        let posicion_factura = res.lastIndexOf(codigo_factura);

        if (parseInt(cantidad_cartera) > parseInt(saldo)) {
            alert("El abono no puede ser mayor al valor en cartera");
            document.getElementById(codigo_factura).value = saldo;
            array_abono[posicion_factura] = saldo;

        } else {
            array_abono[posicion_factura] = cantidad_cartera;
        }

        setArray_valores(array_abono);

    }

    const guardar = async () => {
        const UrlRecibocaja = `${Dominio}/recibocaja/recibocaja`;
        await axios.post(UrlRecibocaja, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Guardar',
            array_facturas: array_facturas,
            array_valores: array_valores
        })
            .then(response => {

                const responseJSON = response.data;
                //console.log(responseJSON);

                alert(responseJSON.mensaje)
                window.open(responseJSON.url_impresion);
            })
        cambioPantallaPedido('Consultar');
        setArray_facturas([]);
        setArray_valores([]);
    }

    useEffect(() => {
        const handleResize = () => setAnchoVentana(window.innerWidth)
        window.addEventListener('resize', handleResize);

        return () => {
            //console.log('return useEffect');
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {

        let arreglo_facturas = [];
        let arreglo_valores = [];
        if (resultado.result) {
            resultado.result.map((cartera, index) => {
                arreglo_facturas[index] = cartera.cxc_id;
                arreglo_valores[index] = 0;
            })
        }

        setArray_facturas(arreglo_facturas);
        setArray_valores(arreglo_valores);

    }, [resultado]);

    return (
        <div>
            {anchoVentana > 768 ?

                <table className="table table-dark table-hover">

                    <thead>
                        <tr>
                            <th className="encabezado-detalle">Factura</th>
                            <th className="encabezado-detalle">Cliente</th>
                            <th className="encabezado-detalle">Asesor</th>
                            <th className="encabezado-detalle">Valor</th>
                            <th className="encabezado-detalle">Abono</th>
                        </tr>
                    </thead>

                    <tbody>
                        {!resultado.result ? <tr><td>cargando...</td></tr> : resultado.result.map((cartera, index) => {
                            return <tr key={index}>
                                <td className="align-middle">{cartera.cxc_factur}</td>
                                <td className="align-middle">{cartera.cli_nombre1 + " " + cartera.cli_apelli1}</td>
                                <td className="align-middle">{cartera.ase_nombre}</td>
                                <td className="align-middle">${new Intl.NumberFormat("de-DE").format(Math.round(cartera.cxc_saldo))}<input type="hidden" name={"saldo/" + cartera.cxc_id} id={"saldo/" + cartera.cxc_id} value={cartera.cxc_saldo}></input></td>
                                <td className="align-middle"><input type='text' name={'abono' + index} id={cartera.cxc_id} className="form-control" defaultValue="0" autoComplete="off" onKeyUp={cambiarValor} /></td>
                            </tr>
                        })}
                        <tr>
                            <td></td>
                            <td></td>
                            <td><b>TOTAL</b></td>
                            <td><b>${new Intl.NumberFormat("de-DE").format(Math.round(resultado.total_cartera))}</b></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan="11" className="text-center">
                                <button className="btn btn-primary" target="_blank" onClick={guardar}>Guardar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                :
                <div className="list-group">
                    {!resultado.result ? "cargando..." : resultado.result.map((cartera, index) => {
                        return <div key={index} className="list-group-item list-group-item-action bg-dark text-white border-white">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">Factura: {cartera.cxc_factur}</h5>
                            </div>
                            <p className="mb-1"><b>Cliente</b>: {cartera.cli_nombre1 + " " + cartera.cli_apelli1}</p>
                            <p className="mb-1"><b>Asesor</b>: {cartera.ase_nombre}</p>
                            <p className="mb-1"><b>Valor</b>: ${new Intl.NumberFormat("de-DE").format(Math.round(cartera.cxc_saldo))}<input type="hidden" name={"saldo/" + cartera.cxc_id} id={"saldo/" + cartera.cxc_id} value={cartera.cxc_saldo}></input></p>
                            <p className="mb-1"><b>Abono</b>: <input type='text' name={'abono' + index} id={cartera.cxc_id} className="form-control" defaultValue="0" autoComplete="off" onKeyUp={cambiarValor} /></p>
                        </div>
                    })}
                    <div className="list-group-item list-group-item-action bg-dark text-white border-white">
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1"><b>TOTAL CARTERA: ${new Intl.NumberFormat("de-DE").format(Math.round(resultado.total_cartera))}</b></h5>
                        </div>
                    </div>
                    <div className="text-center list-group-item list-group-item-action bg-dark text-white border-white">
                        <button className="btn btn-primary" target="_blank" onClick={guardar}>Guardar</button>
                    </div>
                </div>

            }

            <div><input type="hidden" name="array_facturas" id="array_facturas" value={array_facturas} /></div>
            <div><input type="hidden" name="array_valores" id="array_valores" value={array_valores} /></div>
        </div>
    )
}

export default DetalleCartera;