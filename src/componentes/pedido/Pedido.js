import React, { useState, useEffect } from 'react';
import Menu from '../menu/Menu';
import Detalle from './Detalle';
import VerDetalle from './VerDetalle';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';
import CardProducto from './CardProducto';

const cookies = new Cookies();

function Pedido() {

    const fecha = new Date();
    const añoActual = fecha.getFullYear();
    const mesActual = fecha.getMonth() + 1;
    const diaActual = fecha.getDate();
    let extender_observacion = "col-md-6 p-2";

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
    const [asesores, setAsesores] = useState([]);
    const [carProducto, setcarProducto] = useState();
    const [codigo_cliente_automatico, setCodigo_cliente_automatico] = useState('NO');
    const [unidad_de_medida, setUnidad_de_medida] = useState('NO');
    const [campo_medio_de_pago, setCampo_medio_de_pago] = useState('NO');
    const [array_productos, setArray_productos] = useState([]);
    const [array_cantidades, setArray_cantidades] = useState([]);
    const [array_medidas, setArray_medidas] = useState([]);
    const [array_precios, setArray_precios] = useState([]);
    const [array_nombres, setArray_nombres] = useState([]);
    const [valor_total, setValor_total] = useState(0);
    const [devuelta, setDevuelta] = useState('');
    const [verDetalle, setVerDetalle] = useState([]);

    if (campo_medio_de_pago === "SI") {
        extender_observacion = "col-md-3 p-2";
    }

    const UrlModulos = `${Dominio}/pedido/pedido`;

    const [datos, setDatos] = useState({
        codigo: '',
        cliente: '',
        asesor: '',
        fecha1: fechaDesde,
        fecha2: fechaActual,
        estado: '',
        observacion: '',
        credito: 0,
        abono: 0,
        descuento: 0,
        pro_codbar: '',
        pro_nombre: '',
        pro_codigo: '',
        efectivo: 0,
        medio_pago: ''
    });



    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]: event.target.value
        })
    }

    const handleInputChange_efectivo = (event) => {
        setDatos({
            ...datos,
            [event.target.name]: event.target.value
        })
        calcular_devuelta();
    }


    const enviarDatos = async (event) => {
        event.preventDefault();
        //alert(pantalla);

        let factura = "no";
        let proceso = "";
        if (pantalla === "Guardar y Facturar") {
            proceso = "Facturar";
            factura = "si";
        }

        let factura_actualizar = "no";
        let proceso_actualizar = "";
        if (pantalla === "Actualizar y Facturar") {
            proceso_actualizar = "Facturar";
            factura_actualizar = "si";
        }

        if (pantalla === "Buscar") {
            await axios.post(UrlModulos, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: pantalla,
                ped_codigo: datos.codigo,
                ped_client: datos.cliente,
                ped_asesor: datos.asesor,
                ped_estado: datos.estado,
                ped_medpag: datos.medio_pago,
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
        } else if (pantalla === "Nuevo" || proceso === "Facturar") {
            await axios.post(UrlModulos, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: pantalla,
                ped_client: datos.cliente,
                ped_observ: datos.observacion,
                ped_asesor: datos.asesor,
                ped_medpag: datos.medio_pago,
                credito: datos.credito,
                abono: datos.abono,
                descuento: datos.descuento,
                productos: array_productos,
                cantidades: array_cantidades,
                medidas: array_medidas,
                facturar: factura
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;
                    alert('Se guardo correctamente el pedido Codigo: ' + responseJSON.codigo_pedido);

                    if (responseJSON) {
                        setDatos({
                            ...datos,
                            codigo: '',
                            cliente: '',
                            observacion: '',
                            credito: 0,
                            abono: 0,
                            descuento: 0,
                            pro_codbar: '',
                            pro_nombre: '',
                            pro_codigo: '',
                            medio_pago: '',
                            asesor: ''
                        });

                        setArray_productos([]);
                        setArray_cantidades([]);
                        setArray_medidas([]);
                        setArray_precios([]);
                        setValor_total(0);
                        setDevuelta('');
                    }

                    if (responseJSON.fac_numero !== 0) {
                        window.open(responseJSON.url_impresion);
                    }


                })

            setPantalla("Consultar");
            setObligatorio(false);


        } else if (pantalla === "Actualizar" || proceso_actualizar === "Facturar") {

            await axios.put(UrlModulos, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Actualizar',
                ped_codigo: datos.codigo,
                ped_client: datos.cliente,
                ped_observ: datos.observacion,
                ped_asesor: datos.asesor,
                ped_medpag: datos.medio_pago,
                credito: datos.credito,
                abono: datos.abono,
                descuento: datos.descuento,
                productos: array_productos,
                cantidades: array_cantidades,
                medidas: array_medidas,
                facturar: factura_actualizar
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;
                    alert('Se actualizo correctamente el pedido ' + responseJSON.codigo_pedido);

                    if (responseJSON) {
                        setDatos({
                            ...datos,
                            codigo: '',
                            cliente: '',
                            observacion: '',
                            credito: 0,
                            abono: 0,
                            descuento: 0,
                            pro_codbar: '',
                            pro_nombre: '',
                            pro_codigo: '',
                            estado: '',
                            medio_pago: '',
                            asesor: ''
                        })

                        setArray_productos([]);
                        setArray_cantidades([]);
                        setArray_medidas([]);
                        setArray_precios([]);
                        setArray_nombres([]);
                        setValor_total(0);
                        setDevuelta('');
                    }

                    if (responseJSON.fac_numero !== 0) {
                        window.open(responseJSON.url_impresion);
                    }

                    setPantalla("Consultar");
                })

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
        let codigo_cliente = '';
        let codigo_asesor = '';
        setPantalla(e.target.value);

        if (e.target.value === "Actualizar") {
            if (datos.nombre === "") {
                setBloquea(true);
                setObligatorio(true);
                setPantalla("Editar");
            }
        }

        if (e.target.value === "Nuevo") {
            if (codigo_cliente_automatico === "SI") {
                codigo_cliente = '1';
            }

            if (asesores) {
                asesores.map((asesor, index) => {
                    if (index === 0) {
                        codigo_asesor = asesor.ase_codigo;
                    }
                })
            }

            setDatos({
                ...datos,
                codigo: '',
                estado: '',
                cliente: codigo_cliente,
                asesor: codigo_asesor,
                fecha1: fechaDesde,
                fecha2: fechaActual,
                observacion: '',
                credito: 0,
                abono: 0,
                descuento: 0,
                pro_codbar: '',
                pro_nombre: '',
                pro_codigo: '',
                efectivo: 0,
                medio_pago: 'efectivo'
            })

            const UrlHome = `${Dominio}/home/home`;
            axios.post(UrlHome, { aut_ip: cookies.get('aut_ip'), aut_bd: cookies.get('aut_bd') })
                .then(response => {
                    const responseJSON = response.data;
                    //console.log(responseJSON);

                    const top_4_productos_mes = responseJSON.top_4_productos_mes;
                    setcarProducto(<CardProducto resultado={top_4_productos_mes} unidad_de_medida={unidad_de_medida} agregar={agregar} />);

                })
        }

        if (e.target.value === "Limpiar" || e.target.value === "Consultar") {
            setDatos({
                ...datos,
                codigo: '',
                estado: '',
                cliente: '',
                asesor: '',
                medio_pago: ''
            })

            setArray_productos([]);
            setArray_cantidades([]);
            setArray_medidas([]);
            setArray_precios([]);
            setArray_nombres([]);
            setValor_total(0);
            setDevuelta('');

            if (e.target.value === "Limpiar") {
                setPantalla("Consultar");
            }

            if (e.target.value === "Consultar") {
                setObligatorio(false);
                setBloquea(false);
            }

        }

    }

    const editar = async (codigo) => {
        //alert("editar "+codigo);
        window.scrollTo(0, 0);
        setPantalla("Editar");
        setBloquea(true);
        setObligatorio(true);

        await axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Editar',
            ped_codigo: codigo,
            ver_detalle: 'si'
        })
            .then(response => {
                const respuesta = response.data;
                //console.log(respuesta);
                respuesta.result.map((dato, index) => {
                    return <div key={index}>
                        {setDatos({
                            ...datos,
                            codigo: dato.ped_codigo,
                            cliente: dato.ped_client,
                            asesor: dato.ped_asesor,
                            estado: dato.ped_estado,
                            observacion: dato.ped_observ,
                            credito: dato.ped_credit,
                            abono: dato.ped_abono,
                            descuento: dato.ped_descue,
                            medio_pago: dato.ped_medpag
                        })}
                    </div>
                })

                let array_productos = [];
                let array_cantidades = [];
                let array_medidas = [];
                let array_precios = [];
                let array_nombres = [];
                let valor_total = 0;

                let tbody = document.createElement('tbody');

                respuesta.resultDetalle.map((dato, index) => {
                    {
                        array_productos.push(dato.ped_produc);
                        array_cantidades.push(dato.ped_cantid);
                        array_medidas.push(dato.ped_medida);
                        array_precios.push(dato.valor_mas_iva);
                        array_nombres.push(dato.pro_nombre);

                        valor_total = valor_total + (dato.valor_mas_iva * dato.ped_cantid);

                        let td4 = '';

                        let tr = tbody.appendChild(document.createElement('tr'));
                        tr.id = 'fila/' + dato.ped_produc;
                        let td = tr.appendChild(document.createElement('td'));
                        let td2 = tr.appendChild(document.createElement('td'));
                        let td3 = tr.appendChild(document.createElement('td'));
                        td3.id = 'precio/' + dato.ped_produc;
                        if (unidad_de_medida === "SI") {
                            td4 = tr.appendChild(document.createElement('td'));
                        }
                        let td5 = tr.appendChild(document.createElement('td'));
                        let td6 = tr.appendChild(document.createElement('td'));
                        let selected_unidad = false;
                        let selected_blister = false;
                        let selected_caja = false;

                        if (dato.ped_medida === "Unidad") { selected_unidad = true }
                        if (dato.ped_medida === "Blister") { selected_blister = true }
                        if (dato.ped_medida === "Caja") { selected_caja = true }

                        let cantidad = td5.appendChild(document.createElement('input'));
                        cantidad.type = 'text';
                        cantidad.name = 'cantidad';
                        cantidad.autocomplete = 'off';
                        cantidad.id = dato.ped_produc;
                        cantidad.value = dato.ped_cantid;
                        cantidad.addEventListener('keyup', cambiarCantidad);

                        if (unidad_de_medida === "SI") {
                            let select_medida = td4.appendChild(document.createElement('select'));
                            select_medida.name = 'medida';
                            select_medida.id = 'medida/' + dato.ped_produc;
                            select_medida.addEventListener('change', cambiarMedida);

                            let option_unidad = select_medida.appendChild(document.createElement('option'));
                            option_unidad.value = 'Unidad';
                            option_unidad.innerHTML = 'Unidad';
                            if (selected_unidad) { option_unidad.selected = "true" }

                            let option_blister = select_medida.appendChild(document.createElement('option'));
                            option_blister.value = 'Blister';
                            option_blister.innerHTML = 'Blister';
                            if (selected_blister) { option_blister.selected = "true" }

                            let option_caja = select_medida.appendChild(document.createElement('option'));
                            option_caja.value = 'Caja';
                            option_caja.innerHTML = 'Caja';
                            if (selected_caja) { option_caja.selected = "true" }
                        }

                        let boton = td6.appendChild(document.createElement('button'));
                        boton.type = 'button';
                        boton.id = 'eliminar';
                        boton.name = 'eliminar';
                        boton.className = 'boton';
                        boton.addEventListener('click', function () { quitar_de_lista(dato.ped_produc) });

                        td.value = dato.ped_produc;
                        td2.value = dato.pro_nombre;
                        td3.value = dato.valor_mas_iva;

                        td.innerHTML = dato.ped_produc;
                        td2.innerHTML = dato.pro_nombre;
                        td3.innerHTML = '$' + new Intl.NumberFormat("de-DE").format(dato.valor_mas_iva);
                        boton.innerHTML = 'Eliminar';

                        document.getElementById('lista').appendChild(tbody);
                    }
                })
                setValor_total(valor_total);
                setArray_productos(array_productos);
                setArray_cantidades(array_cantidades);
                setArray_medidas(array_medidas);
                setArray_precios(array_precios);
                setArray_nombres(array_nombres);

            })
    }

    const anular = async (codigo) => {
        if (window.confirm("Desea anular el pedido " + codigo + " ?")) {
            await axios.put(UrlModulos, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Anular',
                ped_codigo: codigo,
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;
                    alert('Se anulo el pedido ' + codigo);

                    if (responseJSON) {
                        setDatos({
                            ...datos,
                            codigo: '',
                            cliente: '',
                            asesor: '',
                            fecha1: fechaDesde,
                            fecha2: fechaActual,
                            estado: ''
                        })
                    }

                    setPantalla("Consultar");
                })
        }
    }

    const pedidoCredito = () => {
        var check = document.getElementById('credito').checked;

        if (check) {
            setDatos({
                ...datos,
                credito: 1
            })

            var h5 = document.createElement('h5');
            h5.innerHTML = "Abono:";
            h5.id = "abono_la";
            h5.name = "abono_la";
            h5.value = "Abono";

            var input = document.createElement('input');
            input.type = "text";
            input.id = "abono";
            input.name = "abono";
            input.className = "form-control";
            input.value = 0;
            input.addEventListener("keyup", handleInputChange);


            document.getElementById("abono_label").appendChild(h5);
            document.getElementById("abono_la").appendChild(input);
        } else {
            setDatos({
                ...datos,
                credito: 0,
                abono: 0
            })

            var abono_label = document.getElementById('abono_la');
            var padre2 = abono_label.parentNode;
            padre2.removeChild(abono_label);

            //var abono = document.getElementById('abono');
            //var padre = abono.parentNode;
            //padre.removeChild(abono);
        }

    }

    const pedidoDescuento = () => {
        var check = document.getElementById('descue').checked;

        if (check) {
            var input = document.createElement('input');
            input.type = "text";
            input.id = "descuento";
            input.name = "descuento";
            input.value = 0;
            input.className = "form-control";
            input.addEventListener("keyup", handleInputChange);

            var h5 = document.createElement('h5');
            h5.innerHTML = "Descuento:";
            h5.id = "descuento_la";
            h5.name = "descuento_la";
            h5.value = "Descuento";

            document.getElementById("descuento_label").appendChild(h5);
            document.getElementById("descuento_la").appendChild(input);
        } else {
            setDatos({
                ...datos,
                descuento: 0
            })
            var descuento = document.getElementById('descuento');
            var padre = descuento.parentNode;
            padre.removeChild(descuento);

            var descuento_label = document.getElementById('descuento_la');
            var padre2 = descuento_label.parentNode;
            padre2.removeChild(descuento_label);
        }
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
                //console.log('resultado'+responseJSON.length);
                if (responseJSON.length === 1) {
                    responseJSON.map((producto) => {
                        agregar(producto.pro_codigo, producto.pro_costo, producto.pro_iva, producto.pro_nombre)
                    });
                    setDatos({
                        ...datos,
                        pro_codbar: ''
                    })
                } else {
                    setcarProducto(<CardProducto resultado={responseJSON} unidad_de_medida={unidad_de_medida} agregar={agregar} />);
                }

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
                setcarProducto(<CardProducto resultado={responseJSON} unidad_de_medida={unidad_de_medida} agregar={agregar} />);

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
                setcarProducto(<CardProducto resultado={responseJSON} unidad_de_medida={unidad_de_medida} agregar={agregar} />);

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

            valor_mas_iva = Math.round(parseInt(precio) + ((parseInt(precio) * parseInt(iva)) / 100));
            total_mas_iva = valor_total + valor_mas_iva;

        } else {

            setArray_productos([...array_productos, codigo_producto]);
            setArray_cantidades([...array_cantidades, 1]);
            setArray_medidas([...array_medidas, 'Unidad']);

            valor_mas_iva = Math.round(parseInt(precio) + ((parseInt(precio) * parseInt(iva)) / 100));
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
            if (unidad_de_medida === "SI") {
                td4 = tr.appendChild(document.createElement('td'));
            }
            let td5 = tr.appendChild(document.createElement('td'));
            let td6 = tr.appendChild(document.createElement('td'));

            let cantidad = td5.appendChild(document.createElement('input'));
            cantidad.type = 'text';
            cantidad.name = 'cantidad';
            cantidad.autocomplete = 'off';
            cantidad.id = codigo_producto;
            cantidad.value = 1;
            cantidad.addEventListener('keyup', cambiarCantidad);

            if (unidad_de_medida === "SI") {
                let select_medida = td4.appendChild(document.createElement('select'));
                select_medida.name = 'medida';
                select_medida.id = 'medida/' + codigo_producto;
                select_medida.addEventListener('change', cambiarMedida);

                let option_unidad = select_medida.appendChild(document.createElement('option'));
                option_unidad.value = 'Unidad';
                option_unidad.innerHTML = 'Unidad';

                let option_blister = select_medida.appendChild(document.createElement('option'));
                option_blister.value = 'Blister';
                option_blister.innerHTML = 'Blister';

                let option_caja = select_medida.appendChild(document.createElement('option'));
                option_caja.value = 'Caja';
                option_caja.innerHTML = 'Caja';
            }

            let boton = td6.appendChild(document.createElement('button'));
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

    const cargarProductoPopup = () => {

        let codigo_producto = document.getElementById('codigo_del_producto').value;
        if (codigo_producto) {
            const UrlProducto = `${Dominio}/producto/producto`;

            axios.post(UrlProducto, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Buscar',
                pro_codigo: codigo_producto,
                card_producto: 'SI'
            })
                .then(response => {
                    const responseJSON = response.data.result;
                    //console.log('resultado'+responseJSON.length);
                    if (responseJSON.length === 1) {
                        responseJSON.map((producto) => {
                            agregar(producto.pro_codigo, producto.pro_costo, producto.pro_iva, producto.pro_nombre)
                        });
                        setDatos({
                            ...datos,
                            pro_codbar: ''
                        })
                    }

                })
        }
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

    const cambiarMedida = (event) => {
        //alert(event.target.value);
        let res = event.target.id.split("/");
        let id = 'precio/' + res[1];
        let precio = 0;
        let total_mas_iva = 0;

        let arreglo_productos = document.getElementById('carrito').value;
        let texto = arreglo_productos.toString();
        let res2 = texto.split(",");

        let array_cantidad = document.getElementById('cantidad_carrito').value;
        let texto2 = array_cantidad.toString();
        array_cantidad = texto2.split(",");

        let array_medida = document.getElementById('medida_carrito').value;
        let texto3 = array_medida.toString();
        array_medida = texto3.split(",");

        let arreglo_precios = document.getElementById('precio_carrito').value;
        let texto4 = arreglo_precios.toString();
        let array_precio = texto4.split(",");

        let posicion_producto = res2.lastIndexOf(res[1]);

        array_medida[posicion_producto] = event.target.value;
        document.getElementById('medida_carrito').value = array_medida;
        setArray_medidas(array_medida);

        const UrlProducto = `${Dominio}/producto/producto`;
        axios.post(UrlProducto, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Buscar',
            pro_codigo: res[1]
        })
            .then(response => {

                const responseJSON = response.data.result;
                //console.log(responseJSON);

                if (event.target.value === "Unidad") {
                    responseJSON.map((producto) => {
                        precio = Math.round(parseInt(producto.pro_costo) + ((parseInt(producto.pro_costo) * parseInt(producto.pro_iva)) / 100));
                        array_precio[posicion_producto] = precio;
                    });
                }

                if (event.target.value === "Blister") {
                    responseJSON.map((producto) => {
                        precio = Math.round(parseInt(producto.pro_precio2) + ((parseInt(producto.pro_precio2) * parseInt(producto.pro_iva)) / 100));
                        array_precio[posicion_producto] = precio;
                    });
                }

                if (event.target.value === 'Caja') {
                    responseJSON.map((producto) => {
                        precio = Math.round(parseInt(producto.pro_precio3) + ((parseInt(producto.pro_precio3) * parseInt(producto.pro_iva)) / 100));
                        array_precio[posicion_producto] = precio;
                    });
                }

                document.getElementById(id).innerHTML = '$' + new Intl.NumberFormat("de-DE").format(precio);
                setArray_precios(array_precio);

                for (let i = 0; i < res2.length; i++) {
                    total_mas_iva = total_mas_iva + (array_cantidad[i] * array_precio[i]);
                }

                setValor_total(total_mas_iva);
            })


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

        let arreglo_medidas = document.getElementById('medida_carrito').value;
        let texto3 = arreglo_medidas.toString();
        let array_medida = texto3.split(",");

        let arreglo_precios = document.getElementById('precio_carrito').value;
        let texto4 = arreglo_precios.toString();
        let array_precio = texto4.split(",");

        let objeto = array_codigo.lastIndexOf(codigo_producto);
        total_mas_iva = total - (array_precio[objeto] * array_cantidad[objeto]);

        array_codigo.splice(objeto, 1);
        array_cantidad.splice(objeto, 1);
        array_medida.splice(objeto, 1);
        array_precio.splice(objeto, 1);

        setArray_productos(array_codigo);
        setArray_cantidades(array_cantidad);
        setArray_medidas(array_medida);
        setArray_precios(array_precio);

        setValor_total(total_mas_iva);

        let tr = document.getElementById('fila/' + codigo_producto);
        var padre = tr.parentNode;
        padre.removeChild(tr);
    }

    const calcular_devuelta = () => {
        let valor = document.getElementById("efectivo").value;
        let total = document.getElementById("valor_total_hidden").value;
        let valor_devuelta = valor - total;
        setDevuelta(parseInt(valor_devuelta));
    }

    const ver_detalle = async (codigo) => {
        const UrlVerDetalle = `${Dominio}/pedido/pedido`;

        await axios.post(UrlVerDetalle, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Buscar',
            ver_detalle: 'si',
            ped_codigo: codigo,
            limite: 'SI'
        })
            .then(response => {

                const responseJSON = response.data;
                //console.log(responseJSON);
                setVerDetalle(responseJSON);
            })

        setPantalla("VerDetalle");
    }

    const volver = () => {
        setPantalla("Buscar");
        window.scrollTo(0, 400);
    }

    const winCliente = () => {
        let miPopup = window.open('../popupcliente/', "popupId", "location=no,menubar=no,titlebar=no,resizable=no,toolbar=no, menubar=no,width=800,height=500,left=250,top=100");
        miPopup.focus();
    }

    const codigoCliente = (e) => {
        setDatos({
            ...datos,
            cliente: document.getElementById('cliente').value
        })
    }

    const winProducto = () => {
        let miPopup = window.open('../popupproducto/', "popupId", "location=no,menubar=no,titlebar=no,resizable=no,toolbar=no, menubar=no,width=800,height=500,left=250,top=100");
        miPopup.focus();
    }

    useEffect(() => {
        let recibido = datos.efectivo;
        let total_devuelta = recibido - valor_total;
        setDevuelta(total_devuelta);
    }, [valor_total]);

    useEffect(() => {
        let total = 0;

        for (let i = 0; i < array_precios.length; i++) {
            total = total + (parseInt(array_precios[i]) * parseInt(array_cantidades[i]));
        }

        let total_menos_descuento = total - datos.descuento;

        setValor_total(total_menos_descuento);
    }, [datos.descuento, valor_total])

    useEffect(() => {

        const UrlAsesores = `${Dominio}/asesor/asesor`;

        const obtenerAsesores = async () => {
            let codigo_asesor = '';
            if (cookies.get('aut_asesor') !== "null") {
                codigo_asesor = cookies.get('aut_asesor');
            }
            await axios.post(UrlAsesores, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                ase_codigo: codigo_asesor,
                metodo: 'Buscar',
                limite: 'NO'
            })
                .then(response => {
                    const respuesta = response.data;
                    //console.log(respuesta);
                    setAsesores(respuesta.result);
                    setDatos({
                        ...datos,
                        asesor: codigo_asesor
                    })
                })
        }
        obtenerAsesores();

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
                        if (dato.par_nombre === "CODIGO_CLIENTE_AUTOMATICO") {
                            setCodigo_cliente_automatico(dato.par_valor);
                        }

                        if (dato.par_nombre === "UNIDAD_DE_MEDIDA") {
                            setUnidad_de_medida(dato.par_valor);
                        }

                        if (dato.par_nombre === "CAMPO_MEDIO_DE_PAGO") {
                            setCampo_medio_de_pago(dato.par_valor);
                        }
                        return "";
                    })
                })
        }
        obtenerParametros();

    }, [])

    return (

        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>{pantalla} Pedido</h1>
                {pantalla !== "VerDetalle" ?
                    <form name="formul" className="row mt-3" onSubmit={enviarDatos} >
                        {
                            pantalla !== "Nuevo" && pantalla !== "Editar" ?
                                <div className="col-md-3 p-2">
                                    <label className="form-label"><b>Codigo</b></label>
                                    <input type='text' name="codigo" className="form-control" value={datos.codigo} onChange={handleInputChange} readOnly={bloquea} />
                                </div>
                                : ""
                        }
                        <div className="col-md-3 p-2 logo-busqueda">
                            <label className="form-label"><b>Cliente</b></label>
                            <input className="form-control" type="text" list="datalistOptions" name="cliente" id="cliente" value={datos.cliente} placeholder="Buscar..." onChange={handleInputChange} onFocus={() => { codigoCliente(); }} />
                            <i className="fas fa-search" onClick={winCliente}></i>
                        </div>
                        <div className="col-md-3 p-2">
                            <label className="form-label"><b>Asesor</b></label>
                            <select name="asesor" className="form-select" value={datos.asesor} onChange={handleInputChange} >
                                {
                                    pantalla === "Consultar" || pantalla === "Buscar" ? <option value="">Todos</option>
                                        :
                                        ""
                                }
                                {
                                    !asesores ? "Cargando..."
                                        :
                                        asesores.map((asesor, index) => {
                                            return <option key={index} value={asesor.ase_codigo}>{asesor.ase_codigo + '-' + asesor.ase_nombre}</option>
                                        })
                                }
                            </select>
                        </div>
                        {
                            campo_medio_de_pago === "SI" ?
                                <div className="col-md-3 p-2">
                                    <label className="form-label"><b>Medio de pago</b></label>
                                    <select name="medio_pago" className="form-select" value={datos.medio_pago} onChange={handleInputChange} >
                                        {
                                            pantalla === "Consultar" || pantalla === "Buscar" ? <option value="">Todos</option>
                                                :
                                                ""
                                        }

                                        <option value="efectivo">Efectivo</option>
                                        <option value="transferencia">Transferencia</option>
                                        <option value="pse">PSE</option>
                                    </select>
                                </div>
                                :
                                ""
                        }
                        {
                            pantalla === "Nuevo" || pantalla === "Editar" ?
                                <div className={extender_observacion}>
                                    <label className="form-label"><b>Observación</b></label>
                                    <input className="form-control" type="text" name="observacion" value={datos.observacion} onChange={handleInputChange} />
                                </div>
                                :
                                ""
                        }

                        {
                            pantalla === "Nuevo" || pantalla === "Editar" ?
                                <div className="col-md-3 p-2">
                                    <input className="form-check-input p-2 m-1" type="checkbox" value="" name="credito" id="credito" onClick={pedidoCredito} />
                                    <label className="form-label m-1"><b>Credito</b></label>
                                </div>
                                :
                                ""
                        }
                        {
                            pantalla === "Nuevo" || pantalla === "Editar" ?
                                <div className="col-md-3 p-2">
                                    <input className="form-check-input p-2 m-1" type="checkbox" value="" name="descue" id="descue" onClick={pedidoDescuento} />
                                    <label className="form-label m-1"><b>Descuento</b></label>
                                </div>
                                :
                                ""
                        }
                        {pantalla !== "Nuevo" && pantalla !== "Editar" ?

                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Estado</b></label>
                                <select name="estado" className="form-select" value={datos.estado} onChange={handleInputChange} >
                                    <option value="">Todos</option>
                                    <option value="A">Activo</option>
                                    <option value="I">Inactivo</option>
                                </select>
                            </div>
                            : ""}

                        {pantalla !== "Nuevo" && pantalla !== "Editar" ?

                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Fecha Desde</b></label>
                                <input type="date" name="fecha1" className="form-control" value={datos.fecha1} onChange={handleInputChange}></input>
                            </div>

                            : ""}

                        {pantalla !== "Nuevo" && pantalla !== "Editar" ?

                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Hasta</b></label>
                                <input type="date" name="fecha2" className="form-control" value={datos.fecha2} onChange={handleInputChange}></input>
                            </div>

                            : ""}

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
                                <div className="col-md-3 p-2 logo-busqueda-producto">
                                    <label className="form-label"><b>Codigo de barras</b></label>
                                    <input type='text' name="pro_codbar" className="form-control" placeholder="Buscar..." value={datos.pro_codbar} onChange={BuscarCodigoBarras} onFocus={cargarProductoPopup} autoFocus />
                                    <i className="fas fa-search" onClick={winProducto}></i>
                                </div>
                                <div className="col-md-3 p-2">
                                    <input type='hidden' name="codigo_del_producto" id="codigo_del_producto" className="form-control" value="" />
                                </div>

                                <div id="cardproducto">{carProducto}</div>

                                <div className="table-responsive">
                                    <table className="table table-dark table-hover" id="lista">
                                        <thead>
                                            <tr>
                                                <th className="encabezado-detalle">Codigo</th>
                                                <th className="encabezado-detalle">Nombre</th>
                                                <th className="encabezado-detalle">Precio</th>
                                                {
                                                    unidad_de_medida === "SI" ?
                                                        <th className="encabezado-detalle">Medida</th>
                                                        :
                                                        ""
                                                }

                                                <th className="encabezado-detalle">Cantidad</th>
                                                <th className="encabezado-detalle"></th>
                                            </tr>
                                        </thead>

                                    </table>
                                </div>

                                <input type="hidden" id="carrito" value={array_productos}></input>
                                <input type="hidden" id="cantidad_carrito" value={array_cantidades}></input>
                                <input type="hidden" id="medida_carrito" value={array_medidas}></input>
                                <input type="hidden" id="precio_carrito" value={array_precios}></input>
                                <input type="hidden" id="total_mas_iva" value={valor_total}></input>
                            </div>


                            : ""
                        }

                        {pantalla === "Nuevo" || pantalla === "Editar" ?
                            <div>
                                <div className="d-flex justify-content-end"><h3>Valor Total: <b>${new Intl.NumberFormat("de-DE").format(valor_total)}</b></h3></div>
                                <div className="d-flex justify-content-end" id="abono_label"></div>
                                <div className="d-flex justify-content-end" id="descuento_label"></div>

                                <div className="d-flex justify-content-end">
                                    <h5>Recibido:<input type='text' name="efectivo" id="efectivo" className="form-control" value={datos.efectivo} onChange={handleInputChange_efectivo} autoComplete="off" ></input></h5>
                                    <input type='hidden' name="valor_total_hidden" id="valor_total_hidden" className="form-control" value={valor_total}></input>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <h5>Devuelta:<input type='text' name="devuelta" className="form-control" defaultValue={devuelta > 0 ? new Intl.NumberFormat("de-DE").format(devuelta) : ''}></input></h5>
                                </div>
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
                                        <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Guardar"  >Guardar</button>
                                        <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Guardar y Facturar" onClick={cambiarPantalla} >Guardar y Facturar</button>
                                    </div>

                                    :
                                    <div className="col-md-5 m-2">
                                        <button className="btn btn-dark m-2" type="button" name="pantalla" value="Consultar" onClick={cambiarPantalla} >Consultar</button>
                                        <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Actualizar" onClick={cambiarPantalla} >Actualizar</button>
                                        <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Actualizar y Facturar" onClick={cambiarPantalla} >Actualizar y Facturar</button>
                                    </div>
                        }

                    </form>
                    : <VerDetalle respuesta_json={verDetalle} volver={volver} />
                }
            </div>
            <hr className="my-4" />
            <br />
            {pantalla === "Buscar" ? <Detalle respuesta_json={detalle} editar={editar} pag={paginado} anular={anular} ver={ver_detalle} campo_medio_de_pago={campo_medio_de_pago} /> : ""}
        </div>
    )
}

export default Pedido;
