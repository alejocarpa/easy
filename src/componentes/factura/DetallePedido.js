import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function DetallePedido(props) {
    const resultado = props.respuesta_json;
    const cambioPantallaPedido = props.cambiarPantalla;
    
    const [anchoVentana, setAnchoVentana] = useState(window.innerWidth);
    const [arrayPedidos, setArrayPedidos] = useState([]);
    const [contador, setContador] = useState(0);

    const check_todos_pedidos = () => {
        let check = document.getElementById("check_todos_pedidos").checked;
        let array_pedido = [];

        if (check) {
            resultado.result.map((pedido, index) => {
                document.getElementById(pedido.ped_codigo).checked = true;
                array_pedido.push(pedido.ped_codigo)

                document.getElementById("tamano_consulta").value = index + 1;
            })
        } else {
            resultado.result.map((pedido, index) => {
                document.getElementById(pedido.ped_codigo).checked = false;
                array_pedido.splice(index, 1)

                document.getElementById("tamano_consulta").value = 0;
            })
        }

        setArrayPedidos(array_pedido);
    }

    const arreglo_pedido = (ped_codigo) => {
        let check = document.getElementById(ped_codigo).checked;
        //alert(check);
        if (check) {
            setArrayPedidos([...arrayPedidos, ped_codigo]);
            setContador(contador + 1);
        } else {

            let arreglo_pedidos = document.getElementById('array_pedidos').value;
            let texto = arreglo_pedidos.toString();
            let array_pedido = texto.split(",");

            let objeto = array_pedido.lastIndexOf(ped_codigo);
            array_pedido.splice(objeto, 1);
            setArrayPedidos(array_pedido);
            setContador(contador - 1);
        }
    }

    const facturar = async () => {
        const UrlFactura = `${Dominio}/factura/factura`;
        await axios.post(UrlFactura, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Facturar',
            tamano_consulta: contador,
            array_pedidos: arrayPedidos,
        })
            .then(response => {

                const responseJSON = response.data;
                //console.log(responseJSON);

                window.open(responseJSON.url_impresion);
            })
        setArrayPedidos([]);
        setContador(0);
        cambioPantallaPedido('Consultar');
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
        //console.log(resultado);
        setArrayPedidos([]);
        setContador(0);
        
    }, [resultado]);

    return (
        <div>
            {anchoVentana > 768 ?

                <table className="table table-dark table-hover">

                    <thead>
                        <tr>
                            <th className="encabezado-detalle"><input type="checkbox" name="check_todos_pedidos" id="check_todos_pedidos" onClick={() => check_todos_pedidos()} /></th>
                            <th className="encabezado-detalle">Codigo</th>
                            <th className="encabezado-detalle">Cliente</th>
                            <th className="encabezado-detalle">Estado</th>
                            <th className="encabezado-detalle">Valor Total</th>
                            <th className="encabezado-detalle">Fecha</th>
                        </tr>
                    </thead>

                    <tbody>
                        {!resultado.result ? <tr><td>cargando...</td></tr> : resultado.result.map((pedido, index) => {
                            return <tr key={index}>
                                <td><input type="checkbox" name="check" id={pedido.ped_codigo} onClick={() => arreglo_pedido(pedido.ped_codigo)} /></td>
                                <td>{pedido.ped_codigo}</td>
                                <td>{pedido.cli_nombre1 + " " + pedido.cli_apelli1}</td>
                                <td>{pedido.ped_estado === "P" ? "Pendiente" : "Anulado"}</td>
                                <td>${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_valortotal))}</td>
                                <td>{pedido.ped_fechac}</td>
                            </tr>

                        })}
                        <tr>
                            <td colSpan="11" className="text-center">
                                <button className="btn btn-primary" target="_blank" onClick={facturar}>Facturar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                :
                <div className="list-group">
                    {!resultado.result ? "cargando..." : resultado.result.map((pedido, index) => {
                        return <div key={index} className="list-group-item list-group-item-action bg-dark text-white border-white">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">Numero: {pedido.ped_codigo}</h5>
                                <small><input type="checkbox" name="check" id={pedido.ped_codigo} onClick={() => arreglo_pedido(pedido.ped_codigo)} /></small>
                            </div>
                            <p className="mb-1"><b>Codigo</b>: {pedido.ped_codigo}</p>
                            <p className="mb-1"><b>Cliente</b>: {pedido.cli_nombre1 + " " + pedido.cli_apelli1}</p>
                            <p className="mb-1"><b>Estado</b>: {pedido.ped_estado}</p>
                            <p className="mb-1"><b>Valor Total</b>: ${new Intl.NumberFormat("de-DE").format(Math.round(pedido.ped_valortotal))}</p>
                            <p className="mb-1"><b>Fecha</b>: {pedido.ped_fechac}</p>
                        </div>
                    })}
                </div>

            }

            <div><input type="hidden" name="array_pedidos" id="array_pedidos" value={arrayPedidos} /></div>
            <div><input type="hidden" name="tamano_consulta" id="tamano_consulta" value={contador} /></div>
        </div>
    )
}

export default DetallePedido;