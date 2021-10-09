import React, { useState, useEffect } from 'react';
import Menu from '../menu/Menu';
import Detalle from './Detalle';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Producto() {

    const [laboratorios, setLaboratorios] = useState([]);
    const [grupo_producto, setGrupo_producto] = useState('NO');
    const [unidad_de_medida, setUnidad_de_medida] = useState('NO');
    const [codigo_producto_automatico, setCodigo_producto_automatico] = useState('NO');
    const [pantalla, setPantalla] = useState('Consultar');
    const [bloquea, setBloquea] = useState(false);
    const [obligatorio, setObligatorio] = useState(false);
    const [detalle, setDetalle] = useState([]);
    const UrlModulos = `${Dominio}/producto/producto`;

    const [datos, setDatos] = useState({
        codigo: '',
        nombre: '',
        precio: '',
        iva: '',
        costo: '',
        codigo_barras: '',
        laboratorio: '',
        estado: '',
        precio2: '',
        precio3: ''
    });

    const [medida, setMedida] = useState({
        medida2: '',
        medida3: ''
    });

    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]: event.target.value
        })
    }

    const handleInputMedida = (event) => {
        setMedida({
            ...medida,
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
                limite: 'SI',
                pro_codigo: datos.codigo,
                pro_nombre: datos.nombre,
                pro_costo: datos.precio,
                pro_iva: datos.iva,
                pro_compra: datos.costo,
                pro_codbar: datos.codigo_barras,
                pro_grupo: datos.laboratorio,
                pro_estado: datos.estado
            })
                .then(response => {

                    const responseJSON = response.data;
                    //console.log(responseJSON);
                    setDetalle(responseJSON);
                    window.scrollTo(0, 500);
                })
        } else if (pantalla === "Guardar") {
            await axios.post(UrlModulos, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: pantalla,
                pro_codigo: datos.codigo,
                pro_nombre: datos.nombre,
                pro_costo: datos.precio,
                pro_iva: datos.iva,
                pro_compra: datos.costo,
                pro_codbar: datos.codigo_barras,
                pro_grupo: datos.laboratorio,
                pro_estado: datos.estado,
                pro_precio2: datos.precio2,
                pro_precio3: datos.precio3,
                det_medida2: medida.medida2,
                det_medida3: medida.medida3
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;
                    alert('Se guardo correctamente el producto Codigo: ' + responseJSON);


                    setDatos({
                        ...datos,
                        codigo: '',
                        nombre: '',
                        precio: '',
                        iva: '',
                        costo: '',
                        codigo_barras: '',
                        laboratorio: '',
                        estado: '',
                        precio2: '',
                        precio3: ''
                    })

                    setMedida({
                        ...medida,
                        medida2: '',
                        medida3: ''
                    })


                })

            setPantalla("Consultar");
            setObligatorio(false);


        } else if (pantalla === "Actualizar") {

            await axios.put(UrlModulos, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: pantalla,
                pro_codigo: datos.codigo,
                pro_nombre: datos.nombre,
                pro_costo: datos.precio,
                pro_iva: datos.iva,
                pro_compra: datos.costo,
                pro_codbar: datos.codigo_barras,
                pro_grupo: datos.laboratorio,
                pro_estado: datos.estado,
                pro_precio2: datos.precio2,
                pro_precio3: datos.precio3,
                det_medida2: medida.medida2,
                det_medida3: medida.medida3
            })
                .then(response => {

                    alert('Se actualizo correctamente el producto');

                    setDatos({
                        ...datos,
                        codigo: '',
                        nombre: '',
                        precio: '',
                        iva: '',
                        costo: '',
                        codigo_barras: '',
                        laboratorio: '',
                        estado: '',
                        precio2: '',
                        precio3: ''
                    })

                    setMedida({
                        ...medida,
                        medida2: '',
                        medida3: ''
                    })


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
        window.scrollTo(0, 500);
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
                nombre: '',
                precio: '',
                iva: 0,
                costo: '',
                codigo_barras: '',
                laboratorio: '',
                estado: '',
                precio2: '',
                precio3: ''
            })
        }

        if (e.target.value === "Limpiar" || e.target.value === "Consultar") {
            setDatos({
                ...datos,
                codigo: '',
                nombre: '',
                precio: '',
                iva: '',
                costo: '',
                codigo_barras: '',
                laboratorio: '',
                estado: '',
                precio2: '',
                precio3: ''
            })

            setMedida({
                ...medida,
                medida2: '',
                medida3: ''
            })

            if (e.target.value === "Limpiar") {
                setPantalla("Consultar");
                setObligatorio(false);
            }

            if (e.target.value === "Consultar") {
                setObligatorio(false);
                setBloquea(false);
            }

        }


    }

    const editar = async (codigo) => {
        //alert("editar "+codigo);
        setPantalla("Editar");
        setBloquea(true);
        setObligatorio(true);

        await axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'Editar',
            pro_codigo: codigo
        })
            .then(response => {
                const respuesta = response.data;
                //console.log(respuesta);
                respuesta.result.map((dato, index) => {
                    return <div key={index}>
                        {setDatos({
                            ...datos,
                            codigo: dato.pro_codigo,
                            nombre: dato.pro_nombre,
                            precio: dato.pro_costo,
                            iva: dato.pro_iva,
                            costo: dato.pro_compra,
                            codigo_barras: dato.pro_codbar,
                            laboratorio: dato.pro_grupo,
                            estado: dato.pro_estado,
                            precio2: dato.pro_precio2,
                            precio3: dato.pro_precio3
                        })}
                    </div>
                })

                respuesta.result_detalle_producto.map((dato, index) => {
                    return <div key={index}>
                        {setMedida({
                            ...medida,
                            medida2: dato.det_medida2,
                            medida3: dato.det_medida3
                        })}
                    </div>
                })
            })
    }

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
                        if (dato.par_nombre === "GRUPO_PRODUCTO") {
                            setGrupo_producto(dato.par_valor);
                        }

                        if (dato.par_nombre === "UNIDAD_DE_MEDIDA") {
                            setUnidad_de_medida(dato.par_valor);
                        }

                        if (dato.par_nombre === "CODIGO_PRODUCTO_AUTOMATICO") {
                            setCodigo_producto_automatico(dato.par_valor);
                        }
                        return "";
                    })
                })
        }

        const UrlLaboratorios = `${Dominio}/laboratorio/laboratorio`;

        const obtenerLaboratorios = async () => {
            await axios.post(UrlLaboratorios, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Buscar',
                limite: 'NO',
            })
                .then(response => {
                    const respuesta = response.data;
                    //console.log(respuesta);
                    setLaboratorios(respuesta.result)
                })
        }
        obtenerParametros();
        obtenerLaboratorios();
    }, [])

    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>{pantalla} Producto</h1>
                <form className="row mt-3" onSubmit={enviarDatos}  >
                    {
                        pantalla === "Nuevo" && codigo_producto_automatico === "SI" ?
                            ""
                            :
                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Codigo</b></label>
                                <input type='text' name="codigo" className="form-control" value={datos.codigo} onChange={handleInputChange} readOnly={bloquea} />
                            </div>
                    }


                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Nombre</b></label>
                        <input type='text' name="nombre" className="form-control" value={datos.nombre} onChange={handleInputChange} required={obligatorio} maxLength={50} />
                    </div>

                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Precio sin IVA</b></label>
                        <input type='text' name="precio" className="form-control" value={datos.precio} onChange={handleInputChange} required={obligatorio} maxLength={50} />
                    </div>

                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>% IVA</b></label>
                        <input type='text' name="iva" className="form-control" value={datos.iva} onChange={handleInputChange} required={obligatorio} maxLength={50} />
                    </div>

                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Costo</b></label>
                        <input type='text' name="costo" className="form-control" value={datos.costo} onChange={handleInputChange} required={obligatorio} maxLength={50} />
                    </div>

                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Codigo de Barras</b></label>
                        <input type='text' name="codigo_barras" className="form-control" value={datos.codigo_barras} onChange={handleInputChange} maxLength={50} />
                    </div>

                    {
                        grupo_producto === "SI" ?
                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Laboratorio</b></label>
                                <select name="laboratorio" className="form-select" value={datos.laboratorio} onChange={handleInputChange} >
                                    <option value="">-</option>
                                    {
                                        !laboratorios ? "Cargando..."
                                            :
                                            laboratorios.map((grupo, index) => {
                                                return <option key={index} value={grupo.gru_codigo}>{grupo.gru_nombre}</option>
                                            })
                                    }
                                </select>
                                
                            </div>

                            :
                            ""
                    }

                    {
                        unidad_de_medida === "SI" ?
                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Precio Blister</b></label>
                                <input className="form-control" type="text" name="precio2" value={datos.precio2} onChange={handleInputChange} />
                            </div>
                            :
                            ""
                    }

                    {
                        unidad_de_medida === "SI" ?
                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Precio Caja</b></label>
                                <input className="form-control" type="text" name="precio3" value={datos.precio3} onChange={handleInputChange} />
                            </div>
                            :
                            ""
                    }

                    {pantalla !== "Nuevo" ?

                        <div className="col-md-3 p-2">
                            <label className="form-label"><b>Estado</b></label>
                            <select name="estado" className="form-select" value={datos.estado} onChange={handleInputChange} >
                                <option value="">Todos</option>
                                <option value="A">Activo</option>
                                <option value="I">Inactivo</option>
                            </select>
                        </div>
                        : ""
                    }


                    {
                        pantalla === "Nuevo" || pantalla === "Editar" ?
                            unidad_de_medida === "SI" ?
                                <div className="row mt-4">
                                    <hr className="my-4" />
                                    <h1>Detalle Producto</h1>
                                    <div className="col-md-4 p-2">
                                        <label className="form-label"><b>Cuantos blister contiene una caja?</b></label>
                                        <input type='number' name="medida2" className="form-control" value={medida.medida2} onChange={handleInputMedida} />
                                    </div>
                                    <div className="col-md-4 p-2">
                                        <label className="form-label"><b>Cuantos unidades contiene un blister?</b></label>
                                        <input type='number' name="medida3" className="form-control" value={medida.medida3} onChange={handleInputMedida} />
                                    </div>
                                </div>
                                :
                                ""

                            :
                            ""
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
            {pantalla === "Buscar" ? <Detalle respuesta_json={detalle} editar={editar} pag={paginado} /> : ""}
        </div>
    )
}

export default Producto;
