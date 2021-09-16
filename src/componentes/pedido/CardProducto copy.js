import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function CardProducto(props) {
    const codigo_barras = props.codbar;
    const nombre = props.nombre;
    const codigo = props.codigo;

    const [resultadoJSON, setResultadoJSON] = useState([]);
    const [productos, setProductos] = useState({
        array_productos: [],
        array_cantidades: []
    });

    const UrlModulos = `${Dominio}/producto/producto`;

    if (codigo_barras) {

        axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Buscar',
            pro_codbar: codigo_barras,
            card_producto: 'SI'
        })
            .then(response => {
                const responseJSON = response.data.result;
                console.log(responseJSON);
                setResultadoJSON(responseJSON);
            })
        
    }

    if (nombre) {
        axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Buscar',
            pro_nombre: nombre,
            card_producto: 'SI'
        })
            .then(response => {

                const responseJSON = response.data.result;
                console.log(responseJSON);
                setResultadoJSON(responseJSON);

            })
    }

    if (codigo) {
        axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Buscar',
            pro_codigo: codigo,
            card_producto: 'SI'
        })
            .then(response => {

                const responseJSON = response.data.result;
                //console.log(responseJSON);
                setResultadoJSON(responseJSON);

            })
    }

    const agregar = (codigo_producto, precio, iva, nombre) => {

        const array_productos = productos.array_productos;
        const array_cantidades = productos.array_cantidades;

        var texto = array_productos.toString();
        var res = texto.split(",");

        let ya_esta_en_lista = 'NO';
        let posicion_producto = '';
        for (let i = 0; i < res.length; i++) {
            if (codigo_producto == res[i]) {
                ya_esta_en_lista = 'SI';
                posicion_producto = i;
            }
        }

        if(ya_esta_en_lista==="SI"){
            let cantidad_actual = array_cantidades[posicion_producto];
            array_cantidades[posicion_producto] = parseInt(cantidad_actual)+1;
            document.getElementById(codigo_producto).value = parseInt(cantidad_actual)+1;
            
        }else{

            array_productos.push(codigo_producto);
            array_cantidades.push('1');

            let valor_mas_iva = Math.round(parseInt(precio) + ((parseInt(precio) * parseInt(iva)) / 100));

            let tbody = document.createElement('tbody');
            let tr = tbody.appendChild(document.createElement('tr'));
            let td = tr.appendChild(document.createElement('td'));
            let td2 = tr.appendChild(document.createElement('td'));
            let td3 = tr.appendChild(document.createElement('td'));
            let td4 = tr.appendChild(document.createElement('td'));
            let td5 = tr.appendChild(document.createElement('td'));
            let td6 = tr.appendChild(document.createElement('td'));

            let cantidad = td5.appendChild(document.createElement('input'));
            cantidad.type = 'text';
            cantidad.name = 'cantidad';
            cantidad.id = codigo_producto;
            cantidad.value = '1';

            let select_medida = td4.appendChild(document.createElement('select'));
            select_medida.name = 'medida';
            select_medida.id = 'medida';

            let option_unidad = select_medida.appendChild(document.createElement('option'));
            option_unidad.value = 'Unidad';
            option_unidad.innerHTML = 'Unidad';

            let option_blister = select_medida.appendChild(document.createElement('option'));
            option_blister.value = 'Blister';
            option_blister.innerHTML = 'Blister';

            let option_caja = select_medida.appendChild(document.createElement('option'));
            option_caja.value = 'Caja';
            option_caja.innerHTML = 'Caja';

            let boton = td6.appendChild(document.createElement('button'));
            boton.type = 'button';
            boton.id = 'eliminar';
            boton.name = 'eliminar';
            boton.className = 'boton';

            td.value = codigo_producto;
            td2.value = nombre;
            td3.value = valor_mas_iva;

            td.innerHTML = codigo_producto;
            td2.innerHTML = nombre;
            td3.innerHTML = '$' + new Intl.NumberFormat("de-DE").format(valor_mas_iva);
            boton.innerHTML = 'Eliminar';

            document.getElementById('lista').appendChild(tbody);

        }

    }

    return (
        <div className="row p-2">
            {
                !resultadoJSON ?
                    ""
                    :
                    resultadoJSON.map((producto, index) => {
                        let precio_mas_iva = Math.round(parseInt(producto.pro_costo) + ((parseInt(producto.pro_costo) * parseInt(producto.pro_iva)) / 100));
                        return <div key={index} className="card m-1" style={{ width: "15rem" }} >
                            <div className="card-body" onClick={() => agregar(producto.pro_codigo, producto.pro_costo, producto.pro_iva, producto.pro_nombre)}>
                                <h5 className="card-title">{producto.pro_nombre}</h5>
                                <p className="card-text">Precio: ${new Intl.NumberFormat("de-DE").format(precio_mas_iva)}</p>
                                <p className="card-text">Grupo: {producto.gru_nombre}</p>
                            </div>
                        </div>
                    })
            }
            <input type="text" name="array_productos" value={productos.array_productos}></input>
            <input type="text" name="array_ivas" value={productos.array_cantidades}></input>

            <table className="table table-dark table-hover" id="lista">
                <thead>
                    <tr>
                        <th className="encabezado-detalle">Codigo</th>
                        <th className="encabezado-detalle">Nombre</th>
                        <th className="encabezado-detalle">Precio</th>
                        <th className="encabezado-detalle">Medida</th>
                        <th className="encabezado-detalle">Cantidad</th>
                        <th className="encabezado-detalle"></th>
                    </tr>
                </thead>

            </table>
        </div>

    )
}

export default CardProducto;
