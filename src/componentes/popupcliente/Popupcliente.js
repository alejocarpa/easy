import React, { useState, useEffect } from 'react';
import Detalle from './Detalle';
import './../../compartido/componentes/Estilo_principal.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Popupcliente() {

    const [pantalla, setPantalla] = useState('Buscar');
    const [detalle, setDetalle] = useState([]);
    const UrlModulos = `${Dominio}/cliente/cliente`;

    const [datos, setDatos] = useState({
        codigo: '',
        nombre: '',
        apellido: '',
        documento: ''
    });

    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]: event.target.value
        })
        let codigo = '';
        let nombre = '';
        let apellido = '';
        let documento = '';

        if(event.target.name === "codigo"){
            codigo = event.target.value;
        }
        if(event.target.name === "nombre"){
            nombre = event.target.value;
        }
        if(event.target.name === "apellido"){
            apellido = event.target.value;
        }
        if(event.target.name === "documento"){
            documento = event.target.value;
        }
        axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: pantalla,
            cli_codigo: codigo,
            cli_nombre1: nombre,
            cli_apelli1: apellido,
            cli_docume: documento,
            limite: 'SI'
        })
            .then(response => {

                const responseJSON = response.data;
                //console.log(responseJSON);
                setDetalle(responseJSON);
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
                cli_codigo: datos.codigo,
                cli_nombre1: datos.nombre,
                cli_apelli1: datos.apellido,
                cli_docume: datos.documento,
                limite: 'SI'
            })
                .then(response => {

                    const responseJSON = response.data;
                    //console.log(responseJSON);
                    setDetalle(responseJSON);
                    window.scrollTo(0, 380);
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
    }

    const enviar = (codigo,nombre,apellido) => {
        //alert("editar "+codigo);
        window.opener.document.formul.cliente.value = codigo+"-"+nombre+" "+apellido;
        window.opener.document.formul.cliente.focus();
        window.close();
    }

    useEffect(() => {
        axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: pantalla,
            cli_codigo: datos.codigo,
            cli_nombre1: datos.nombre,
            cli_docume: datos.documento,
            limite: 'SI'
        })
            .then(response => {

                const responseJSON = response.data;
                //console.log(responseJSON);
                setDetalle(responseJSON);
            })
    }, [])

    return (
        <div className="container-completo">
            <div className="container mt-3">
                <h1>{pantalla} Cliente</h1>
                <form className="row mt-3" onSubmit={enviarDatos}  >

                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Codigo</b></label>
                        <input type='text' name="codigo" className="form-control" value={datos.codigo} onChange={handleInputChange} autoComplete="off" />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Documento</b></label>
                        <input type='text' name="documento" className="form-control" value={datos.documento} onChange={handleInputChange} autoComplete="off" />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Nombre</b></label>
                        <input type='text' name="nombre" className="form-control" value={datos.nombre} onChange={handleInputChange} autoComplete="off" />
                    </div>
                    <div className="col-md-3 p-2">
                        <label className="form-label"><b>Apellido</b></label>
                        <input type='text' name="apellido" className="form-control" value={datos.apellido} onChange={handleInputChange} autoComplete="off" />
                    </div>

                    {
                        pantalla === "Consultar" || pantalla === "Buscar" ?

                            <div className="col-md-5 m-2">
                                <button className="btn btn-dark m-2" type="submit" name="pantalla" value="Buscar" onClick={cambiarPantalla} >Buscar</button>
                            </div>

                            :
                            ""
                    }

                </form>
            </div>
            <hr className="my-4" />
            {pantalla === "Buscar" ? <Detalle respuesta_json={detalle} enviar={enviar} pag={paginado} /> : ""}
        </div>
    )
}

export default Popupcliente;
