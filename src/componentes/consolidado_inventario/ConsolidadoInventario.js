import { useState, useEffect } from 'react';
import Menu from '../menu/Menu';
import Detalle from './Detalle';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function ConsolidadoIventario() {

    const [pantalla, setPantalla] = useState('Consultar');
    const [detalle, setDetalle] = useState([]);
    const [bodega, setBodega] = useState([]);
    const [productos, setProductos] = useState([]);
    const UrlModulos = `${Dominio}/informes/consolidado_inventario/consolidado_inventario`;

    const [datos, setDatos] = useState({
        bodega: '',
        producto: ''
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
                bod_codigo: datos.bodega,
                producto: datos.producto,
                limite: 'SI'
            })
                .then(response => {

                    const responseJSON = response.data;
                    //console.log(responseJSON);
                    setDetalle(responseJSON);
                    window.scrollTo(0, 400);
                })
        }
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


        if (e.target.value === "Limpiar") {
            setDatos({
                ...datos,
                bodega: '',
                producto: '',
            })

        }

    }


    useEffect(() => {
        const UrlBodegas = `${Dominio}/bodega/bodega`;
        axios.post(UrlBodegas, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Buscar'
        })
            .then(response => {
                const respuesta = response.data;

                setBodega(respuesta.result);
            })

        const UrlProductos = `${Dominio}/producto/producto`;
        axios.post(UrlProductos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Buscar'
        })
            .then(response => {
                const respuesta = response.data;

                setProductos(respuesta.result);
            })
    }, [])

    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>{pantalla} Inventario</h1>
                <form className="row mt-3" onSubmit={enviarDatos}  >

                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Bodega</b></label>
                        <select class="form-select" aria-label="Default select example" name="bodega" onChange={handleInputChange}>
                            <option value=''>Todas</option>
                            {
                                !bodega ? "Cargando..."
                                    :
                                    bodega.map((bod, index) => {
                                        return <option key={index} value={bod.bod_codigo}>{bod.bod_codigo + '-' + bod.bod_nombre}</option>
                                    })
                            }

                        </select>
                    </div>

                    <div className="col-md-8 p-2">
                        <label className="form-label"><b>Producto</b></label>
                        <input type='text' list="datalistOptions" name="producto" className="form-control" value={datos.producto} placeholder="Buscar..." onChange={handleInputChange} />
                        <datalist id="datalistOptions">
                            {!productos ? "Cargando..." : productos.map((producto, index) => {
                                return <option key={index} value={producto.pro_nombre+'-'+producto.pro_codigo+'-'+producto.pro_codbar}></option>
                            })}
                        </datalist>
                    </div>

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
            {pantalla === "Buscar" ? <Detalle respuesta_json={detalle} pag={paginado} /> : ""}
        </div>
    )
}

export default ConsolidadoIventario;
