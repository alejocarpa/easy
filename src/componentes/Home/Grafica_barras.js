import React, { useState, useEffect } from 'react';
import Chart from "react-google-charts";
import Cookies from 'universal-cookie';
import axios from 'axios';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Grafica_barras() {

    const [datosGraficaBarras, setDatosGraficaBarras] = useState({
        lunes: 0,
        martes: 0,
        miercoles: 0,
        jueves: 0,
        viernes: 0,
        sabado: 0,
        domingo: 0
    });

    useEffect(() => {
        const UrlModulos = `${Dominio}/home/home`;
        
        const pintarGraficaBarras = () => {
            axios.post(UrlModulos,  { aut_ip : cookies.get('aut_ip'), aut_bd : cookies.get('aut_bd')  } )
            .then(response => {
                const responseJSON = response.data;
                //console.log(responseJSON.ventas_dia_semana);
            
                let respuesta_lunes = 0;
                let respuesta_martes = 0;
                let respuesta_miercoles = 0;
                let respuesta_jueves = 0;
                let respuesta_viernes = 0;
                let respuesta_sabado = 0;
                let respuesta_domingo = 0;

                if(responseJSON){
                    responseJSON.ventas_dia_semana.map((dato, index) => {
                
                        if(dato.dia_semana==="Lunes"){
                            respuesta_lunes = parseInt(dato.valor_venta);
                        }
            
                        if(dato.dia_semana==="Martes"){
                            respuesta_martes = parseInt(dato.valor_venta);
                        }
                
                        if(dato.dia_semana==="Miercoles"){
                            respuesta_miercoles = parseInt(dato.valor_venta);
                        }
                
                        if(dato.dia_semana==="Jueves"){
                            respuesta_jueves = parseInt(dato.valor_venta);
                        }
                
                        if(dato.dia_semana==="Viernes"){
                            respuesta_viernes = parseInt(dato.valor_venta);
                        }
                
                        if(dato.dia_semana==="Sabado"){
                            respuesta_sabado = parseInt(dato.valor_venta);
                        }
                
                        if(dato.dia_semana==="Domingo"){
                            respuesta_domingo = parseInt(dato.valor_venta);
                        }
            
                        return "";
        
                    })
                }

                setDatosGraficaBarras({
                    lunes: respuesta_lunes,
                    martes: respuesta_martes,
                    miercoles: respuesta_miercoles,
                    jueves: respuesta_jueves,
                    viernes: respuesta_viernes,
                    sabado: respuesta_sabado,
                    domingo: respuesta_domingo
                })
            })
    
        }
    
        pintarGraficaBarras();
    },[]);


    return (
        <>
            <Chart
                width={'100%'}
                height={'300px'}
                chartType="Bar"
                loader={<div>Loading Chart</div>}
                data={[
                ['Semana Actual', '$ Ventas'],
                ['L', datosGraficaBarras.lunes],
                ['M', datosGraficaBarras.martes],
                ['X', datosGraficaBarras.miercoles],
                ['J', datosGraficaBarras.jueves],
                ['V', datosGraficaBarras.viernes],
                ['S', datosGraficaBarras.sabado],
                ['D', datosGraficaBarras.domingo],
                ]}
                options={{
                // Material design options
                chart: {
                    title: 'El dia de la semana que mas vendiste es',
                    subtitle: 'Ventas de esta semana',
                },
                }}
                // For tests
                rootProps={{ 'data-testid': '1' }}
            />
        </>
    )
}

export default Grafica_barras;
