import React, { useState, useEffect } from 'react';
import Menu from '../menu/Menu';
import Detalle from './Detalle';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Asesor() {

    const [bodegas, setBodegas] = useState([]);
    const [pantalla, setPantalla] = useState('Consultar');
    const [bloquea, setBloquea] = useState(false);
    const [obligatorio, setObligatorio] = useState(false);
    const [detalle, setDetalle] = useState([]);
    const UrlModulos = `${Dominio}/asesor/asesor`;

    const [datos, setDatos] = useState({
        codigo: '',
        nombre: '',
        bodega: ''
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
                ase_codigo: datos.codigo,
                ase_nombre: datos.nombre,
                ase_bodega: datos.bodega,
                limite: 'SI'
            })
            .then(response => {
                
                const responseJSON = response.data;
                //console.log(responseJSON);
                setDetalle(responseJSON);
                window.scrollTo(0, 400);
            })
        }else if(pantalla === "Guardar"){
            await axios.post(UrlModulos,  { 
                aut_ip : cookies.get('aut_ip'), 
                aut_bd : cookies.get('aut_bd'),
                metodo: pantalla,
                ase_codigo: datos.codigo,
                ase_nombre: datos.nombre,
                ase_bodega: datos.bodega,
            })
            .then(response => {
                
                alert('Se guardo correctamente el asesor ');
                
                
                setDatos({
                    ...datos,
                    codigo: '',
                    nombre: '',
                    bodega: ''
                })
                

                
            })

            setPantalla("Consultar");
            setObligatorio(false);


        }else if(pantalla === "Actualizar"){

            await axios.put(UrlModulos,  { 
                aut_ip : cookies.get('aut_ip'), 
                aut_bd : cookies.get('aut_bd'),
                metodo: pantalla,
                ase_codigo: datos.codigo,
                ase_nombre: datos.nombre,
                ase_bodega: datos.bodega,
            })
            .then(response => {
                
                alert('Se actualizo correctamente el asesor');
                
                
                setDatos({
                    ...datos,
                    codigo: '',
                    nombre: '',
                    bodega: ''
                })
                

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
        window.scrollTo(0, 400);
    }

    const cambiarPantalla = (e) => {
        //alert(e.target.value);
        setPantalla(e.target.value);

        if(e.target.value==="Actualizar"){
            if(datos.nombre===""){
                setBloquea(true);
                setObligatorio(true);
                setPantalla("Editar");
            }
        }

        if(e.target.value==="Guardar" || e.target.value==="Nuevo"){
            if(datos.nombre===""){
                setObligatorio(true);
                setPantalla("Nuevo");
            }
        }

        if(e.target.value==="Nuevo" || e.target.value==="Limpiar" || e.target.value==="Consultar"){
            setDatos({
                ...datos,
                codigo: '',
                nombre: '',
                bodega: '',
            })

            if(e.target.value==="Limpiar"){
                setPantalla("Consultar");
            }

            if(e.target.value==="Consultar"){
                setObligatorio(false);
                setBloquea(false);
            }

        }

        if(e.target.value==="Nuevo"){
            setDatos({
                ...datos,
                bodega: '1'
            })
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
            ase_codigo: codigo
        })
        .then(response => {
            const respuesta = response.data;
            //console.log(respuesta);
            respuesta.result.map((dato, index) => {
                return <div key={index}>
                {setDatos({
                    ...datos,
                    codigo: dato.ase_codigo,
                    nombre: dato.ase_nombre,
                    bodega: dato.ase_bodega
                })}
                </div>
            })
        })
    }

    useEffect(() => {

        const UrlBodegas = `${Dominio}/bodega/bodega`;

        const obtenerBodega = async() => {
            await axios.post(UrlBodegas,  { 
                aut_ip : cookies.get('aut_ip'), 
                aut_bd : cookies.get('aut_bd'),
                metodo: 'Buscar',
                limite: 'NO',
            })
            .then(response => {
                const respuesta = response.data;
                //console.log(respuesta);
                setBodegas(respuesta.result)
            })
        }

        obtenerBodega();
    }, [])

    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>{pantalla} Asesor</h1>
                <form className="row mt-3" onSubmit={enviarDatos}  >
                    
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Codigo</b></label>
                        <input type='text' name="codigo" className="form-control" value={datos.codigo} onChange={handleInputChange} readOnly={bloquea} />
                    </div>
                   
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Nombre</b></label>
                        <input type='text' name="nombre" className="form-control" value={datos.nombre} onChange={handleInputChange} required={obligatorio} maxLength={50} />
                    </div>
                   
                        
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Bodega</b></label>
                        <select name="bodega" className="form-select" value={datos.bodega} onChange={handleInputChange} >
                            {
                            pantalla === "Consultar" || pantalla === "Buscar"?
                                <option value="">Todas</option>
                            :
                                ""
                            }
                            
                            {
                            !bodegas ? "Cargando..." :
                            bodegas.map((bodega,index) => {
                                return <option key={index} value={bodega.bod_codigo}>{bodega.bod_nombre}</option>
                            })
                            }
                        </select>
                    </div>
                       
                    
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

export default Asesor;
