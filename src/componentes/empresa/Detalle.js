import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Detalle(props) {
    const resultado = props.respuesta_json;
    //console.log(resultado.result);
    const [anchoVentana, setAnchoVentana] = useState(window.innerWidth);
    const [color_tabla, setColorTabla] = useState();

    useEffect(() => {
        const UrlParametros = `${Dominio}/parametros/parametros`;

        const obtenerColorTabla = async () => {
            let tabla = '';
            
            await axios.post(UrlParametros, {
                aut_ip: cookies.get('aut_ip'),
                aut_bd: cookies.get('aut_bd'),
                metodo: 'Buscar',
                par_nombre: 'COLOR_TABLA'
            })
                .then(response => {
                    //console.log(response.data);
                    const responseJSON = response.data;

                    if (responseJSON) {
                        responseJSON.result.map((valor) => {
                            tabla = valor.par_valor;
                        })

                        setColorTabla(tabla);
                    }
                })
        }
        obtenerColorTabla();
    }, []);

    useEffect(() => {
        const handleResize = () => setAnchoVentana(window.innerWidth)
        window.addEventListener('resize', handleResize );

       return () => {
           //console.log('return useEffect');
           window.removeEventListener('resize', handleResize);
       }
    }, []);

    return (
        <div>
            <h1>Resultado</h1>
            <div className="detalle-exporta" style={color_tabla === "table table-dark" ? {background: '#212529'} : {background: '#D1E7DD'}}>
                <div className="detalle-exporta-icono">
                    <a href={resultado.ruta_excel} className="detalle-exporta-icono">
                        <i className="fas fa-file-excel" />
                    </a>
                </div>
                <div className="detalle-exporta-icono">
                    <a href={resultado.ruta_pdf} className="detalle-exporta-icono" target="_blank" rel="noreferrer">
                        <i className="fas fa-file-pdf"></i>
                    </a>
                </div>
            </div>
            {anchoVentana > 768 ? 

                <table className={color_tabla}>
                    
                    <thead>
                        <tr>
                            <th className="encabezado-detalle">Codigo</th>
                            <th className="encabezado-detalle">Nombre</th>
                            <th className="encabezado-detalle">Nit</th>
                            <th className="encabezado-detalle">Direcci??n</th>
                            <th className="encabezado-detalle">Barrio</th>
                            <th className="encabezado-detalle">Tel??fono</th>
                            <th className="encabezado-detalle">Celular</th>
                            <th className="encabezado-detalle">Email</th>
                            <th className="encabezado-detalle"></th>
                        </tr>
                    </thead>
                
                    <tbody>
                    {!resultado.result ? <tr><td>cargando...</td></tr> : resultado.result.map((empresa, index) => {
                        return <tr key={index}>
                                    <td className="align-middle">{empresa.emp_codigo}</td>
                                    <td className="align-middle">{empresa.emp_nombre}</td>
                                    <td className="align-middle">{empresa.emp_nit}</td>
                                    <td className="align-middle">{empresa.emp_direcc}</td>
                                    <td className="align-middle">{empresa.emp_barrio}</td>
                                    <td className="align-middle">{empresa.emp_telefo}</td>
                                    <td className="align-middle">{empresa.emp_celula}</td>
                                    <td className="align-middle">{empresa.emp_email}</td>
                                    <td><button className="btn btn-primary" onClick={()=>props.editar(empresa.emp_codigo)}>Editar</button></td>
                                </tr>
                                
                    })}
                    </tbody>
                </table>
            
            : 
            <div className="list-group">
                {!resultado.result ? "cargando..." : resultado.result.map((empresa, index) => {
                    return <div key={index} className="list-group-item list-group-item-action bg-dark text-white border-white">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">C??digo: {empresa.emp_codigo}</h5>
                                    <small onClick={()=>props.editar(empresa.emp_codigo)}>Editar</small>
                                </div>
                                <p className="mb-1"><b>Nombre</b>: {empresa.emp_nombre}</p>
                                <p className="mb-1"><b>Nit</b>: {empresa.emp_nit}</p>
                                <p className="mb-1"><b>Direcci??n</b>: {empresa.emp_direcc}</p>
                                <p className="mb-1"><b>Barrio</b>: {empresa.emp_barrio}</p>
                                <p className="mb-1"><b>Tel??fono</b>: {empresa.emp_telefo}</p>
                                <p className="mb-1"><b>Celular</b>: {empresa.emp_celula}</p>
                                <p className="mb-1"><b>Email</b>: {empresa.emp_email}</p>
                            </div>
                })}
            </div>
            
            }

            <div className="col text-center">
                <button className="btn btn-outline-light" onClick={()=>props.pag(resultado.anterior_pagina)}>anterior</button>
                <button className="btn btn-outline-light" onClick={()=>props.pag(resultado.siguiente_pagina)}>siguiente</button>
            </div>
            
        </div>
    )
}

export default Detalle;
