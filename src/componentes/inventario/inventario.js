import React, { useState, useEffect } from 'react';
import Menu from '../menu/Menu';
import Detalle from './Detalle';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';
import CardProducto from './CardProducto';

const cookies = new Cookies();

function Inventario() {

    const fecha = new Date();
    const añoActual = fecha.getFullYear();
    const mesActual = fecha.getMonth() + 1;
    const diaActual = fecha.getDate();
    let ceroMes = ''
    if (mesActual < 10) {
        ceroMes = '0';
    }
    let ceroDia = ''
    if (diaActual < 10) {
        ceroDia = '0';
    }
    const fechaActual = añoActual + '-' + ceroMes + '' + mesActual + '-' + ceroDia + '' + diaActual;
    const fechaDesde = añoActual + '-' + ceroMes + '' + mesActual + '-' + '01';

    const [pantalla, setPantalla] = useState('Consultar');
    const [bloquea, setBloquea] = useState(false);
    const [obligatorio, setObligatorio] = useState(false);
    const [detalle, setDetalle] = useState([]);
    const [bodegas, setBodegas] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [carProducto, setcarProducto] = useState();
    const [array_productos, setArray_productos] = useState([]);
    const [array_cantidades, setArray_cantidades] = useState([]);
    const [array_precios, setArray_precios] = useState([]);
    const [array_fechav, setArray_fechav] = useState([]);
    const [array_lotes, setArray_lotes] = useState([]);
    const [valor_total, setValor_total] = useState(0);
    const [parametro_fechavencimiento, setParametro_fechavencimiento] = useState('NO');
    const UrlModulos = `${Dominio}/inventario/inventario`;

    const [datos, setDatos] = useState({
        codigo: '',
        transaccion: '',
        bodega: '',
        bodega_destino: '',
        fecha1: fechaDesde,
        fecha2: fechaActual,
        proveedor: '',
        pro_codigo: '',
        pro_nombre: '',
        pro_codbar: ''
    });

    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]: event.target.value
        })
    }

    const enviarDatos = async (event) => {
        event.preventDefault();
        //alert(pantalla);

        if (pantalla === "Buscar") {
            await axios.post(UrlModulos, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: pantalla,
                inv_codigo: datos.codigo,
                inv_provee: datos.proveedor,
                inv_transa: datos.transaccion,
                inv_bodega: datos.bodega,
                fecha1: datos.fecha1,
                fecha2: datos.fecha2,
                limite: 'SI'
            })
                .then(response => {

                    const responseJSON = response.data;
                    //console.log(responseJSON);
                    setDetalle(responseJSON);
                    window.scrollTo(0, 400);
                })
        } else if (pantalla === "Guardar") {
            await axios.post(UrlModulos, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: pantalla,
                inv_transa: datos.transaccion,
                inv_provee: datos.proveedor,
                inv_bodega: datos.bodega,
                valor_total: valor_total,
                inv_boddes: datos.bodega_destino,
                array_productos: array_productos,
                array_cantidades: array_cantidades,
                array_precios: array_precios,
                array_fechav: array_fechav,
                array_lotes: array_lotes
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;
                    alert('Se guardo correctamente el inventario Codigo: ' + responseJSON);

                    if (responseJSON) {
                        setDatos({
                            ...datos,
                            codigo: '',
                            transaccion: '',
                            bodega: '',
                            bodega_destino: '',
                            fecha1: fechaDesde,
                            fecha2: fechaActual,
                            proveedor: '',
                            pro_codigo: '',
                            pro_nombre: '',
                            pro_codbar: ''
                        })

                        setArray_productos([]);
                        setArray_cantidades([]);
                        setArray_precios([]);
                        setArray_fechav([]);
                        setArray_lotes([]);
                    }


                })

            setPantalla("Consultar");
            setObligatorio(false);


        }
        setBloquea(false);
    }

    const paginado = async (url) => {

        await axios.get(url)
            .then(response => {
                const responseJSON = response.data;
                //console.log(responseJSON);
                setDetalle(responseJSON);
            })
        window.scrollTo(0, 400);
    }

    const cambiarPantalla = (e) => {
        //alert(e.target.value);
        setPantalla(e.target.value);

        if (e.target.value === "Actualizar") {
            if (datos.nombre === "") {
                setBloquea(true);
                setObligatorio(true);
                setPantalla("Editar");
            }
        }

        if (e.target.value === "Guardar" || e.target.value === "Nuevo") {
            if (datos.nombre === "") {
                setObligatorio(true);
                setPantalla("Nuevo");
            }
        }

        if (e.target.value === "Nuevo") {
            setDatos({
                ...datos,
                codigo: '',
                transaccion: 'EN',
                bodega: '1',
                proveedor: ''
            })
        }

        if (e.target.value === "Limpiar" || e.target.value === "Consultar") {
            setDatos({
                ...datos,
                codigo: '',
                transaccion: '',
                bodega: '',
                bodega_destino: '',
                proveedor: '',
                pro_codigo: '',
                pro_nombre: '',
                pro_codbar: ''
            })

            if (e.target.value === "Limpiar") {
                setPantalla("Consultar");
            }

            if (e.target.value === "Consultar") {
                setObligatorio(false);
                setBloquea(false);
            }

        }


    }

    const imprimir = async (codigo) => {
        //alert("editar "+codigo);

        await axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Buscar',
            inv_codigo: codigo
        })
            .then(response => {
                const respuesta = response.data;
                //console.log(respuesta);
                window.open(respuesta.verDetalle);
            })
    }

    const BuscarCodigo = (event) => {
        setDatos({
            ...datos,
            [event.target.name]: event.target.value
        })

        const UrlProducto = `${Dominio}/producto/producto`;
        axios.post(UrlProducto, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Buscar',
            pro_codigo: event.target.value,
            card_producto: 'SI'
        })
            .then(response => {

                const responseJSON = response.data.result;
                //console.log(responseJSON);
                setcarProducto(<CardProducto resultado={responseJSON} agregar={agregar} />);

            })
    }

    const BuscarNombre = (event) => {
        event.preventDefault();
        setDatos({
            ...datos,
            [event.target.name]: event.target.value
        })

        const UrlProducto = `${Dominio}/producto/producto`;
        axios.post(UrlProducto, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Buscar',
            pro_nombre: event.target.value,
            card_producto: 'SI'
        })
            .then(response => {

                const responseJSON = response.data.result;
                //console.log(responseJSON);
                setcarProducto(<CardProducto resultado={responseJSON} agregar={agregar} />);

            })
    }

    const BuscarCodigoBarras = (event) => {
        setDatos({
            ...datos,
            [event.target.name]: event.target.value
        })

        const UrlProducto = `${Dominio}/producto/producto`;

        axios.post(UrlProducto, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Buscar',
            pro_codbar: event.target.value,
            card_producto: 'SI'
        })
            .then(response => {
                const responseJSON = response.data.result;
                //console.log(responseJSON);
                if (responseJSON.length === 1) {
                    responseJSON.map((producto) => {
                        agregar(producto.pro_codigo, producto.pro_compra, producto.pro_iva, producto.pro_nombre)
                    });
                    setDatos({
                        ...datos,
                        pro_codbar: ''
                    })
                } else {
                    setcarProducto(<CardProducto resultado={responseJSON} agregar={agregar} />);
                }

            })
    }

    const agregar = (codigo_producto, precio, iva, nombre) => {

        let arreglo_productos = array_productos;
        let texto = arreglo_productos.toString();
        let res = texto.split(",");
        let valor_mas_iva = 0;
        let total_mas_iva = 0;

        let ya_esta_en_lista = 'NO';
        let posicion_producto = '';
        for (let i = 0; i < res.length; i++) {
            if (codigo_producto == res[i]) {
                ya_esta_en_lista = 'SI';
                posicion_producto = i;
            }
        }

        if (ya_esta_en_lista === "SI") {
            let cantidad_actual = array_cantidades[posicion_producto];
            array_cantidades[posicion_producto] = parseInt(cantidad_actual) + 1;
            setArray_cantidades([...array_cantidades]);
            document.getElementById(codigo_producto).value = parseInt(cantidad_actual) + 1;

            valor_mas_iva = Math.round(parseInt(precio));
            total_mas_iva = valor_total + valor_mas_iva;

        } else {

            setArray_productos([...array_productos, codigo_producto]);
            setArray_cantidades([...array_cantidades, 1]);
            setArray_fechav([...array_fechav, '0000-00-00']);
            setArray_lotes([...array_lotes, '']);

            valor_mas_iva = Math.round(parseInt(precio));
            total_mas_iva = valor_total + valor_mas_iva;

            setArray_precios([...array_precios, valor_mas_iva]);

            let td4 = '';

            let tbody = document.createElement('tbody');
            let tr = tbody.appendChild(document.createElement('tr'));
            tr.id = 'fila/' + codigo_producto;
            let td = tr.appendChild(document.createElement('td'));
            let td2 = tr.appendChild(document.createElement('td'));
            let td3 = tr.appendChild(document.createElement('td'));
            td3.id = 'precio/' + codigo_producto;
            if(parametro_fechavencimiento === "SI"){
                td4 = tr.appendChild(document.createElement('td'));
            }
            let td5 = tr.appendChild(document.createElement('td'));
            let td6 = tr.appendChild(document.createElement('td'));
            let td7 = tr.appendChild(document.createElement('td'));

            if(parametro_fechavencimiento === "SI"){
                let fechav = td4.appendChild(document.createElement('input'));
                fechav.type = 'date';
                fechav.name = 'fechav';
                fechav.id = 'fechav/' + codigo_producto;
                fechav.autocomplete = 'off';
                fechav.value = '0000-00-00';
                fechav.addEventListener('change', cambiarFechav);
            }
            
            let lote = td5.appendChild(document.createElement('input'));
            lote.type = 'text';
            lote.name = 'lote';
            lote.id = 'lote/' + codigo_producto;
            lote.autocomplete = 'off';
            lote.value = '';
            lote.addEventListener('keyup', cambiarLote);

            let cantidad = td6.appendChild(document.createElement('input'));
            cantidad.type = 'text';
            cantidad.name = 'cantidad';
            cantidad.autocomplete = 'off';
            cantidad.id = codigo_producto;
            cantidad.value = 1;
            cantidad.addEventListener('keyup', cambiarCantidad);


            let boton = td7.appendChild(document.createElement('button'));
            boton.type = 'button';
            boton.id = 'eliminar';
            boton.name = 'eliminar';
            boton.className = 'boton';
            boton.addEventListener('click', function () { quitar_de_lista(codigo_producto) });

            td.value = codigo_producto;
            td2.value = nombre;
            td3.value = valor_mas_iva;

            td.innerHTML = codigo_producto;
            td2.innerHTML = nombre;
            td3.innerHTML = '$' + new Intl.NumberFormat("de-DE").format(valor_mas_iva);
            boton.innerHTML = 'Eliminar';

            document.getElementById('lista').appendChild(tbody);


        }

        setcarProducto();
        setDatos({
            ...datos,
            pro_codbar: '',
            pro_nombre: '',
            pro_codigo: ''
        })
        setValor_total(total_mas_iva);
    }

    const cambiarCantidad = (event) => {

        //alert(event.target.value);
        let codigo_producto = event.target.id;
        let cantidad_producto = event.target.value;
        let total_mas_iva = 0;

        if (!cantidad_producto) {
            cantidad_producto = 0;
        }
        let arreglo_productos = document.getElementById('carrito').value;
        let texto = arreglo_productos.toString();
        let res = texto.split(",");

        let array_cantidad = document.getElementById('cantidad_carrito').value;
        let texto2 = array_cantidad.toString();
        array_cantidad = texto2.split(",");

        let arreglo_precios = document.getElementById('precio_carrito').value;
        let texto3 = arreglo_precios.toString();
        let array_precio = texto3.split(",");

        let posicion_producto = res.lastIndexOf(codigo_producto);

        array_cantidad[posicion_producto] = cantidad_producto;
        document.getElementById('cantidad_carrito').value = array_cantidad;
        setArray_cantidades(array_cantidad);

        for (let i = 0; i < res.length; i++) {
            total_mas_iva = total_mas_iva + (array_cantidad[i] * array_precio[i]);
        }

        setValor_total(total_mas_iva);

    }

    const cambiarFechav = (event) => {

        //alert(event.target.id);
        let res = event.target.id.split("/");
        let codigo_producto = res[1];
        let fechav_producto = event.target.value;

        let arreglo_productos = document.getElementById('carrito').value;
        let texto = arreglo_productos.toString();
        let res2 = texto.split(",");

        let arreglo_fechav = document.getElementById('fechav_carrito').value;
        let texto2 = arreglo_fechav.toString();
        let array_fechav = texto2.split(",");

        let posicion_producto = res2.lastIndexOf(codigo_producto);

        array_fechav[posicion_producto] = fechav_producto;
        document.getElementById('fechav_carrito').value = array_fechav;
        setArray_fechav(array_fechav);

    }

    const cambiarLote = (event) => {

        //alert(event.target.id);
        let res = event.target.id.split("/");
        let codigo_producto = res[1];
        let lote_producto = event.target.value;

        let arreglo_productos = document.getElementById('carrito').value;
        let texto = arreglo_productos.toString();
        let res2 = texto.split(",");

        let arreglo_lote = document.getElementById('lote_carrito').value;
        let texto2 = arreglo_lote.toString();
        let array_lote = texto2.split(",");

        let posicion_producto = res2.lastIndexOf(codigo_producto);

        array_lote[posicion_producto] = lote_producto;
        document.getElementById('lote_carrito').value = array_lote;
        setArray_lotes(array_lote);

    }

    const quitar_de_lista = (codigo_producto) => {

        let total_mas_iva = 0;
        let total = document.getElementById('total_mas_iva').value;

        let arreglo_productos = document.getElementById('carrito').value;
        let texto = arreglo_productos.toString();
        let array_codigo = texto.split(",");

        let arreglo_cantidades = document.getElementById('cantidad_carrito').value;
        let texto2 = arreglo_cantidades.toString();
        let array_cantidad = texto2.split(",");

        let arreglo_precios = document.getElementById('precio_carrito').value;
        let texto4 = arreglo_precios.toString();
        let array_precio = texto4.split(",");

        let arreglo_fechav = document.getElementById('fechav_carrito').value;
        let texto5 = arreglo_fechav.toString();
        let array_fechav = texto5.split(",");

        let arreglo_lotes = document.getElementById('lote_carrito').value;
        let texto6 = arreglo_lotes.toString();
        let array_lote = texto6.split(",");

        let objeto = array_codigo.lastIndexOf(codigo_producto);
        total_mas_iva = total - (array_precio[objeto] * array_cantidad[objeto]);

        array_codigo.splice(objeto, 1);
        array_cantidad.splice(objeto, 1);
        array_precio.splice(objeto, 1);
        array_fechav.splice(objeto, 1);
        array_lote.splice(objeto, 1);

        setArray_productos(array_codigo);
        setArray_cantidades(array_cantidad);
        setArray_precios(array_precio);
        setArray_fechav(array_fechav);
        setArray_lotes(array_lote);

        setValor_total(total_mas_iva);

        let tr = document.getElementById('fila/' + codigo_producto);
        var padre = tr.parentNode;
        padre.removeChild(tr);
    }

    useEffect(() => {
        const obtenerBodega = async () => {
            const UrlBodegas = `${Dominio}/bodega/bodega`;
            await axios.post(UrlBodegas, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Buscar',
                limite: 'NO'
            })
                .then(response => {
                    const respuesta = response.data;
                    //console.log(respuesta);
                    setBodegas(respuesta.result)
                })
        }

        obtenerBodega();

        const obtenerProveedor = async () => {
            const UrlProveedores = `${Dominio}/proveedor/proveedor`;
            await axios.post(UrlProveedores, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Buscar',
                limite: 'NO'
            })
                .then(response => {
                    const respuesta = response.data;
                    //console.log(respuesta);
                    setProveedores(respuesta.result)
                })
        }

        obtenerProveedor();

        const obtenerParametros = async () => {
            const UrlProveedores = `${Dominio}/parametros/parametros`;
            await axios.post(UrlProveedores, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Buscar',
                limite: 'NO'
            })
                .then(response => {
                    const respuesta = response.data;
                    //console.log(respuesta);
                    respuesta.result.map((parametro) => {
                        if (parametro.par_nombre === "FECHA_VENCIMIENTO") {
                            setParametro_fechavencimiento(parametro.par_valor);
                        }
                    })
                })
        }

        obtenerParametros();
    }, []);

    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>{pantalla} Movimiento</h1>
                <form className="row mt-3" onSubmit={enviarDatos}  >
                    {
                        pantalla !== "Nuevo" ?
                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Codigo</b></label>
                                <input type='text' name="codigo" className="form-control" value={datos.codigo} onChange={handleInputChange} readOnly={bloquea} />
                            </div>
                            : ""
                    }
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Transacción</b></label>
                        <select name="transaccion" className="form-select" value={datos.transaccion} onChange={handleInputChange} >
                            {
                                pantalla === "Consultar" || pantalla === "Buscar" ? <option value="">Todas</option>
                                    :
                                    ""
                            }
                            <option value="EN">Entrada</option>
                            <option value="SA">Salida</option>
                            <option value="TR">Traslado</option>
                        </select>
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Bodega</b></label>
                        <select name="bodega" className="form-select" value={datos.bodega} onChange={handleInputChange} >
                            {
                                pantalla === "Consultar" || pantalla === "Buscar" ? <option value="">Todas</option>
                                    :
                                    ""
                            }
                            {
                                !bodegas ? "Cargando..."
                                    :
                                    bodegas.map((bodega, index) => {
                                        return <option key={index} value={bodega.bod_codigo}>{bodega.bod_nombre}</option>
                                    })
                            }
                        </select>
                    </div>
                    {
                        datos.transaccion === "TR" ?
                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Bodega Destino</b></label>
                                <select name="bodega_destino" className="form-select" value={datos.bodega_destino} onChange={handleInputChange} >
                                    {
                                        !bodegas ? "Cargando..."
                                            :
                                            bodegas.map((bodega, index) => {
                                                return <option key={index} value={bodega.bod_codigo}>{bodega.bod_nombre}</option>
                                            })
                                    }
                                </select>
                            </div>
                            :
                            ""
                    }
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Proveedor</b></label>
                        <select name="proveedor" className="form-select" value={datos.proveedor} onChange={handleInputChange} >
                            <option value="">-</option>
                            {
                                !proveedores ? "Cargando..."
                                    :
                                    proveedores.map((proveedor, index) => {
                                        return <option key={index} value={proveedor.pro_codigo}>{proveedor.pro_nombre}</option>
                                    })
                            }
                        </select>
                    </div>
                    {
                        pantalla !== "Nuevo" && pantalla !== "Editar" ?

                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Fecha Desde</b></label>
                                <input type="date" name="fecha1" className="form-control" value={datos.fecha1} onChange={handleInputChange}></input>
                            </div>

                            : ""
                    }

                    {
                        pantalla !== "Nuevo" && pantalla !== "Editar" ?

                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Hasta</b></label>
                                <input type="date" name="fecha2" className="form-control" value={datos.fecha2} onChange={handleInputChange}></input>
                            </div>

                            : ""
                    }

                    {pantalla === "Nuevo" || pantalla === "Editar" ?

                        <div className="row mt-1">
                            <hr className="my-4" />
                            <h1>Productos</h1>
                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Codigo</b></label>
                                <input type='text' name="pro_codigo" placeholder="Buscar..." className="form-control" value={datos.pro_codigo} onChange={BuscarCodigo} autoComplete="off" />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Nombre</b></label>
                                <input type='text' name="pro_nombre" placeholder="Buscar..." className="form-control" value={datos.pro_nombre} onChange={BuscarNombre} autoComplete="off" />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Codigo de barras</b></label>
                                <input type='text' name="pro_codbar" className="form-control" placeholder="Buscar..." value={datos.pro_codbar} onChange={BuscarCodigoBarras} autoFocus />
                            </div>

                            <div id="cardproducto">{carProducto}</div>

                            <table className="table table-dark table-hover" id="lista">
                                <thead>
                                    <tr>
                                        <th className="encabezado-detalle">Codigo</th>
                                        <th className="encabezado-detalle">Nombre</th>
                                        <th className="encabezado-detalle">Costo</th>
                                        {
                                            parametro_fechavencimiento === "SI" ?
                                                <th className="encabezado-detalle">Fecha Vencimiento</th>
                                                :
                                                ""
                                        }
                                        <th className="encabezado-detalle">Lote</th>
                                        <th className="encabezado-detalle">Cantidad (Unidad)</th>
                                        <th className="encabezado-detalle"></th>
                                    </tr>
                                </thead>

                            </table>
                            <input type="hidden" id="carrito" value={array_productos}></input>
                            <input type="hidden" id="cantidad_carrito" value={array_cantidades}></input>
                            <input type="hidden" id="precio_carrito" value={array_precios}></input>
                            <input type="hidden" id="fechav_carrito" value={array_fechav}></input>
                            <input type="hidden" id="lote_carrito" value={array_lotes}></input>
                            <input type="hidden" id="total_mas_iva" value={valor_total}></input>
                        </div>


                        : ""
                    }

                    {
                        pantalla === "Nuevo" || pantalla === "Editar" ?
                            <div>
                                <div className="d-flex justify-content-end"><h3>Valor Total: <b>${new Intl.NumberFormat("de-DE").format(valor_total)}</b></h3></div>
                            </div>
                            : ""
                    }

                    <hr className="my-4" />

                    {
                        pantalla === "Consultar" || pantalla === "Buscar" ?

                            <div className="col-md-5 m-2">
                                <button className="btn btn-dark m-2" type="button" name="pantalla" value="Nuevo" onClick={cambiarPantalla} >Nuevo</button>
                                <button className="btn btn-dark m-2" type="button" name="pantalla" value="Limpiar" onClick={cambiarPantalla} >Limpiar</button>
                                <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Buscar" onClick={cambiarPantalla} >Buscar</button>
                            </div>

                            : pantalla === "Nuevo" ?
                                <div className="col-md-5 m-2">
                                    <button className="btn btn-dark m-2" type="button" name="pantalla" value="Consultar" onClick={cambiarPantalla} >Consultar</button>
                                    <button className="btn btn-dark m-2" type="button" name="pantalla" value="Limpiar" onClick={cambiarPantalla} >Limpiar</button>
                                    <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Guardar" onClick={cambiarPantalla} >Guardar</button>
                                </div>

                                :
                                <div className="col-md-5 m-2">
                                    <button className="btn btn-dark m-2" type="button" name="pantalla" value="Consultar" onClick={cambiarPantalla} >Consultar</button>
                                    <button className="btn btn-dark m-2" type="button" name="pantalla" value="Limpiar" onClick={cambiarPantalla} >Limpiar</button>
                                    <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Actualizar" onClick={cambiarPantalla} >Actualizar</button>
                                </div>
                    }

                </form>
            </div>
            <hr className="my-4" />
            <br />
            {pantalla === "Buscar" ? <Detalle respuesta_json={detalle} imprimir={imprimir} pag={paginado} /> : ""}
        </div>
    )
}

export default Inventario;
