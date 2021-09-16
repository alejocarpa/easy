import React, { useState, useEffect } from 'react';
import Menu from '../menu/Menu';
import Detalle from './Detalle';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Cliente() {

    const [pantalla, setPantalla] = useState('Consultar');
    const [bloquea, setBloquea] = useState(false);
    const [obligatorio, setObligatorio] = useState(false);
    const [detalle, setDetalle] = useState([]);
    const UrlModulos = `${Dominio}/cliente/cliente`;
    const [departamento, setDepartamento] = useState();
    const [municipio, setMunicipio] = useState();

    const [datos, setDatos] = useState({
        codigo: '',
        nombre1: '',
        nombre2: '',
        apellido1: '',
        apellido2: '',
        documento: '',
        email: '',
        telefono: '',
        celular: '',
        direccion: '',
        barrio: '',
        fecha_nacimiento: '',
        estado: '',
        departamento: '',
        municipio: ''
    });

    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]: event.target.value
        })
    }

    const enviarDatos = async(event) => {
        event.preventDefault();
        //alert(pantalla);

        if(pantalla === "Buscar"){
            await axios.post(UrlModulos,  { 
                aut_ip : cookies.get('aut_ip'), 
                aut_bd : cookies.get('aut_bd'),
                metodo: pantalla,
                cli_codigo: datos.codigo,
                cli_nombre1: datos.nombre1,
                cli_nombre2: datos.nombre2,
                cli_apelli1: datos.apellido1,
                cli_apelli2: datos.apellido2,
                cli_docume: datos.documento,
                cli_email: datos.email,
                cli_telefo: datos.telefono,
                cli_celula: datos.celular,
                cli_direcc: datos.direccion,
                cli_barrio: datos.barrio,
                cli_fechan: datos.fecha_nacimiento,
                cli_estado: datos.estado,
                cli_depart: datos.departamento,
                cli_munici: datos.municipio
            })
            .then(response => {
                
                const responseJSON = response.data;
                //console.log(responseJSON);
                setDetalle(responseJSON);
                window.scrollTo(0, 700);
            })
        }else if(pantalla === "Guardar"){
            await axios.post(UrlModulos,  { 
                aut_ip : cookies.get('aut_ip'), 
                aut_bd : cookies.get('aut_bd'),
                metodo: pantalla,
                cli_nombre1: datos.nombre1,
                cli_nombre2: datos.nombre2,
                cli_apelli1: datos.apellido1,
                cli_apelli2: datos.apellido2,
                cli_docume: datos.documento,
                cli_email: datos.email,
                cli_telefo: datos.telefono,
                cli_celula: datos.celular,
                cli_direcc: datos.direccion,
                cli_barrio: datos.barrio,
                cli_fechan: datos.fecha_nacimiento,
                cli_depart: datos.departamento,
                cli_munici: datos.municipio,
            })
            .then(response => {
                //console.log(response.data);
                const responseJSON = response.data;
                alert('Se guardo correctamente el cliente Codigo: '+responseJSON);
                
                if(responseJSON){
                    setDatos({
                        ...datos,
                        codigo: '',
                        nombre1: '',
                        nombre2: '',
                        apellido1: '',
                        apellido2: '',
                        documento: '',
                        email: '',
                        telefono: '',
                        celular: '',
                        direccion: '',
                        barrio: '',
                        fecha_nacimiento: '',
                        estado: '',
                        departamento: '',
                        municipio: ''
                    })
                }

                
            })

            setPantalla("Consultar");
            setObligatorio(false);


        }else if(pantalla === "Actualizar"){

            await axios.put(UrlModulos,  { 
                aut_ip : cookies.get('aut_ip'), 
                aut_bd : cookies.get('aut_bd'),
                metodo: pantalla,
                cli_codigo: datos.codigo,
                cli_nombre1: datos.nombre1,
                cli_nombre2: datos.nombre2,
                cli_apelli1: datos.apellido1,
                cli_apelli2: datos.apellido2,
                cli_docume: datos.documento,
                cli_email: datos.email,
                cli_telefo: datos.telefono,
                cli_celula: datos.celular,
                cli_direcc: datos.direccion,
                cli_barrio: datos.barrio,
                cli_fechan: datos.fecha_nacimiento,
                cli_estado: datos.estado,
                cli_depart: datos.departamento,
                cli_munici: datos.municipio,
            })
            .then(response => {
                //console.log(response.data);
                const responseJSON = response.data;
                alert('Se actualizo correctamente el cliente');
                
                if(responseJSON){
                    setDatos({
                        ...datos,
                        codigo: '',
                        nombre1: '',
                        nombre2: '',
                        apellido1: '',
                        apellido2: '',
                        documento: '',
                        email: '',
                        telefono: '',
                        celular: '',
                        direccion: '',
                        barrio: '',
                        fecha_nacimiento: '',
                        estado: '',
                        departamento: '',
                        municipio: ''
                    })
                }

                setPantalla("Consultar");
            })

            setObligatorio(false);

        }
        setBloquea(false);
    }

    const paginado = async(url) => {

        await axios.get(url)
        .then(response => {
            const responseJSON = response.data;
            //console.log(responseJSON);
            setDetalle(responseJSON);
        })
    }

    const cambiarPantalla = (e) => {
        //alert(e.target.value);
        setPantalla(e.target.value);

        if(e.target.value==="Actualizar"){
            if(datos.nombre1===""){
                setBloquea(true);
                setObligatorio(true);
                setPantalla("Editar");
            }
            if(datos.apellido1===""){
                setBloquea(true);
                setObligatorio(true);
                setPantalla("Editar");
            }
            if(datos.documento===""){
                setBloquea(true);
                setObligatorio(true);
                setPantalla("Editar");
            }
        }

        if(e.target.value==="Guardar" || e.target.value==="Nuevo"){
            if(datos.nombre1===""){
                setObligatorio(true);
                setPantalla("Nuevo");
            }
            if(datos.apellido1===""){
                setObligatorio(true);
                setPantalla("Nuevo");
            }
            if(datos.documento===""){
                setObligatorio(true);
                setPantalla("Nuevo");
            }
        }

        if(e.target.value==="Nuevo" || e.target.value==="Limpiar" || e.target.value==="Consultar"){
            setDatos({
                ...datos,
                codigo: '',
                nombre1: '',
                nombre2: '',
                apellido1: '',
                apellido2: '',
                documento: '',
                email: '',
                telefono: '',
                celular: '',
                direccion: '',
                barrio: '',
                fecha_nacimiento: '',
                estado: '',
                departamento: '',
                municipio: '',
            })

            if(e.target.value==="Limpiar"){
                setPantalla("Consultar");
            }

            if(e.target.value==="Consultar"){
                setObligatorio(false);
                setBloquea(false);
            }

        }

        
    }

    const editar = async(codigo) => {
        //alert("editar "+codigo);
        setPantalla("Editar");
        setBloquea(true);
        setObligatorio(true);

        await axios.post(UrlModulos,  { 
            aut_ip : cookies.get('aut_ip'), 
            aut_bd : cookies.get('aut_bd'),
            metodo: 'Editar',
            cli_codigo: codigo
        })
        .then(response => {
            const respuesta = response.data;
            //console.log(respuesta);
            respuesta.result.map((dato, index) => {
                return <div key={index}>
                {setDatos({
                    ...datos,
                    codigo: dato.cli_codigo,
                    nombre1: dato.cli_nombre1,
                    nombre2: dato.cli_nombre2,
                    apellido1: dato.cli_apelli1,
                    apellido2: dato.cli_apelli2,
                    documento: dato.cli_docume,
                    email: dato.cli_email,
                    telefono: dato.cli_telefo,
                    celular: dato.cli_celula,
                    direccion: dato.cli_direcc,
                    barrio: dato.cli_barrio,
                    fecha_nacimiento: dato.cli_fechan,
                    estado: dato.cli_estado,
                    departamento: dato.cli_depart,
                    municipio: dato.cli_munici
                })}
                </div>
            })
        })
    }

    const obtenerMunicipio = async() => {
        //console.log(datos.departamento);
        const UrlMunicipio = `${Dominio}/municipio/municipio`;

        await axios.post(UrlMunicipio,  { aut_ip : cookies.get('aut_ip'), aut_bd : cookies.get('aut_bd'), metodo: 'Buscar', mun_depart: datos.departamento  } )
        .then(response => {
            //console.log(response.data);
            const responseJSON = response.data;
            setMunicipio(responseJSON.result);
        })
    }

    useEffect(() => {
        const obtenerDepartamento = async() => {
            const UrlDepartamento = `${Dominio}/departamento/departamento`;

            await axios.post(UrlDepartamento,  { aut_ip : cookies.get('aut_ip'), aut_bd : cookies.get('aut_bd'), metodo: 'Buscar'  } )
            .then(response => {
                //console.log(response.data);
                const responseJSON = response.data;
                setDepartamento(responseJSON.result);
            })
        }
        
        obtenerDepartamento();
        obtenerMunicipio();
    }, [])

    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>{pantalla} Cliente</h1>
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
                        <label className="form-label"><b>Primer Nombre</b></label>
                        <input type='text' name="nombre1" className="form-control" value={datos.nombre1} onChange={handleInputChange} required={obligatorio} maxLength={50} />
                        <div className="invalid-feedback">
                            Please provide a valid city.
                        </div>
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Segundo Nombre</b></label>
                        <input type='text' name="nombre2" className="form-control" value={datos.nombre2} onChange={handleInputChange} maxLength={50} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Primer Apellido</b></label>
                        <input type='text' name="apellido1" className="form-control" value={datos.apellido1} onChange={handleInputChange} required={obligatorio} maxLength={50} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Segundo Apellido</b></label>
                        <input type='text' name="apellido2" className="form-control" value={datos.apellido2} onChange={handleInputChange} maxLength={50} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>No. Documento</b></label>
                        <input type='number' name="documento" className="form-control" value={datos.documento} onChange={handleInputChange} readOnly={bloquea} required={obligatorio} maxLength={20} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Email</b></label>
                        <input type='email' name="email" className="form-control" value={datos.email} onChange={handleInputChange} maxLength={40} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Teléfono</b></label>
                        <input type='text' name="telefono" className="form-control" value={datos.telefono} onChange={handleInputChange} maxLength={30} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Celular</b></label>
                        <input type='text' name="celular" className="form-control" value={datos.celular} onChange={handleInputChange} maxLength={30} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Dirección</b></label>
                        <input type='text' name="direccion" className="form-control" value={datos.direccion} onChange={handleInputChange} maxLength={70} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Departamento</b></label>
                        <select name="departamento" className="form-select" value={datos.departamento} onChange={handleInputChange} onClick={() => obtenerMunicipio()}>
                            <option value="">Todos</option>
                            {
                            !departamento ? "Cargando..." : departamento.map((departamentos, index) => {
                                return <option key={departamentos.dep_codigo} value={departamentos.dep_codigo}>{departamentos.dep_nombre}</option>
                            })
                            }
                        </select>
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Municipio</b></label>
                        <select name="municipio" className="form-select" value={datos.municipio} onChange={handleInputChange}>
                            <option value="">Todos</option>
                            {
                            !municipio ? "Cargando..." : municipio.map((municipios, index) => {
                                return <option key={index} value={municipios.mun_codigo}>{municipios.mun_nombre}</option>
                            })
                            }
                        </select>
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Barrio</b></label>
                        <input type='text' name="barrio" className="form-control" value={datos.barrio} onChange={handleInputChange} maxLength={50} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Fecha de nacimiento</b></label>
                        <input type='date' name="fecha_nacimiento" className="form-control" value={datos.fecha_nacimiento} onChange={handleInputChange} />
                    </div>
                    { pantalla!=="Nuevo" ? 
                        
                            <div className="col-md-3 p-2">
                                <label className="form-label"><b>Estado</b></label>
                                <select name="estado" className="form-select" value={datos.estado} onChange={handleInputChange} >
                                    <option value="">Todos</option>
                                    <option value="A">Activo</option>
                                    <option value="I">Inactivo</option>
                                </select>
                            </div>
                        :  ""}
                    
                    <hr className="my-4" />

                    {
                    pantalla === "Consultar" || pantalla === "Buscar" ? 

                        <div className="col-md-5 m-2">
                            <button className="btn btn-dark m-2" type="button" name="pantalla" value="Nuevo" onClick={cambiarPantalla} >Nuevo</button>
                            <button className="btn btn-dark m-2" type="button" name="pantalla" value="Limpiar" onClick={cambiarPantalla} >Limpiar</button>
                            <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Buscar" onClick={cambiarPantalla} >Buscar</button>
                        </div>    
                    
                    :  pantalla === "Nuevo" ?
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
            {pantalla === "Buscar" ? <Detalle respuesta_json={detalle} editar={editar} pag={paginado} /> : "" }
        </div>
    )
}

export default Cliente;
