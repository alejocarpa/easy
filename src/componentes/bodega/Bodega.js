import React, { useState } from 'react';
import Menu from '../menu/Menu';
import Detalle from './Detalle';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Bodega() {

    const [pantalla, setPantalla] = useState('Consultar');
    const [bloquea, setBloquea] = useState(false);
    const [obligatorio, setObligatorio] = useState(false);
    const [detalle, setDetalle] = useState([]);
    const UrlModulos = `${Dominio}/bodega/bodega`;

    const [datos, setDatos] = useState({
        codigo: '',
        nombre: '',
        resolucion: '',
        facini: '',
        facfin: '',
        prefijo: '',
        consecutivo: '',
        regimen: ''
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
                bod_codigo: datos.codigo,
                bod_nombre: datos.nombre,
                bod_resolu: datos.resolucion,
                bod_facini: datos.facini,
                bod_facfin: datos.facfin,
                bod_prefij: datos.prefijo,
                bod_regime: datos.regimen,
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
                bod_codigo: datos.codigo,
                bod_nombre: datos.nombre,
                bod_resolu: datos.resolucion,
                bod_facini: datos.facini,
                bod_facfin: datos.facfin,
                bod_prefij: datos.prefijo,
                bod_regime: datos.regimen,
            })
            .then(response => {
                
                alert('Se guardo correctamente la bodega');
                
                setDatos({
                    ...datos,
                    codigo: '',
                    nombre: '',
                    resolucion: '',
                    facini: '',
                    facfin: '',
                    prefijo: '',
                    consecutivo: '',
                    regimen: ''
                })
                
                
            })

            setPantalla("Consultar");
            setObligatorio(false);


        }else if(pantalla === "Actualizar"){

            await axios.put(UrlModulos,  { 
                aut_ip : cookies.get('aut_ip'), 
                aut_bd : cookies.get('aut_bd'),
                metodo: pantalla,
                bod_codigo: datos.codigo,
                bod_nombre: datos.nombre,
                bod_resolu: datos.resolucion,
                bod_facini: datos.facini,
                bod_facfin: datos.facfin,
                bod_prefij: datos.prefijo,
                bod_regime: datos.regimen,
            })
            .then(response => {
                
                alert('Se actualizo correctamente la bodega');
                
                setDatos({
                    ...datos,
                    codigo: '',
                    nombre: '',
                    resolucion: '',
                    facini: '',
                    facfin: '',
                    prefijo: '',
                    consecutivo: '',
                    regimen: ''
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
                resolucion: '',
                facini: '',
                facfin: '',
                prefijo: '',
                consecutivo: '',
                regimen: ''
            })

            if(e.target.value==="Limpiar"){
                setPantalla("Consultar");
                setObligatorio(false);
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
            bod_codigo: codigo
        })
        .then(response => {
            const respuesta = response.data;
            //console.log(respuesta);
            respuesta.result.map((dato, index) => {
                return <div key={index}>
                {setDatos({
                    ...datos,
                    codigo: dato.bod_codigo,
                    nombre: dato.bod_nombre,
                    resolucion: dato.bod_resolu,
                    facini: dato.bod_facini,
                    facfin: dato.bod_facfin,
                    prefijo: dato.bod_prefij,
                    regimen: dato.bod_regime
                })}
                </div>
            })
        })
    }

    return (
        <div className="container-completo">
            <Menu />
            <div className="container mt-3">
                <h1>{pantalla} Bodega</h1>
                <form className="row mt-3" onSubmit={enviarDatos}  >
                    
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Codigo</b></label>
                        <input type='text' name="codigo" className="form-control" value={datos.codigo} onChange={handleInputChange} readOnly={bloquea} maxLength={20} />
                    </div>
                
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Nombre</b></label>
                        <input type='text' name="nombre" className="form-control" value={datos.nombre} onChange={handleInputChange} required={obligatorio} maxLength={100} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Resolución</b></label>
                        <input type='text' name="resolucion" className="form-control" value={datos.resolucion} onChange={handleInputChange} maxLength={500} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Consecutivo desde</b></label>
                        <input type='number' name="facini" className="form-control" value={datos.facini} onChange={handleInputChange} required={obligatorio} maxLength={20} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Consecutivo hasta</b></label>
                        <input type='number' name="facfin" className="form-control" value={datos.facfin} onChange={handleInputChange} required={obligatorio} maxLength={20} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Prefijo</b></label>
                        <input type='text' name="prefijo" className="form-control" value={datos.prefijo} onChange={handleInputChange} maxLength={30} />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Regimen</b></label>
                        <input type='text' name="regimen" className="form-control" value={datos.regimen} onChange={handleInputChange} maxLength={20} />
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

export default Bodega;
