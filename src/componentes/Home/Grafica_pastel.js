import React, { useState,useEffect} from 'react';
import Chart from "react-google-charts";
import Cookies from 'universal-cookie';
import axios from 'axios';
import Dominio from './../../dominio';

const cookies = new Cookies();

function Grafica_pastel() {

    const [producto,setProducto] = useState({
        nombre_producto_0: '',
        cantidad_producto_0: 0,
        nombre_producto_1: '',
        cantidad_producto_1: 0,
        nombre_producto_2: '',
        cantidad_producto_2: 0
    })

    useEffect(() => {
        const UrlModulos = `${Dominio}/home/home`;
        //console.log(UrlModulos);
        
        const pintarGrafica = () => {
            
            axios.post(UrlModulos,  { aut_ip : cookies.get('aut_ip'), aut_bd : cookies.get('aut_bd')  } )
            .then(response => {
                const responseJSON = response.data;
                //console.log(responseJSON.top_3_productos_semana);

                let nombre0 = '';
                let cantidad0 = 0;
                let nombre1 = '';
                let cantidad1 = 0;
                let nombre2 = '';
                let cantidad2 = 0;
                
                if(responseJSON){
                    responseJSON.top_3_productos_semana.map((dato, index) => {
                        if(index === 0){
                            nombre0 = dato.pro_nombre;
                            cantidad0 = parseInt(dato.cantidad);
                        }else if(index === 1){
                            nombre1 = dato.pro_nombre;
                            cantidad1 = parseInt(dato.cantidad);
                        }else if(index === 2){
                            nombre2 = dato.pro_nombre;
                            cantidad2 = parseInt(dato.cantidad);
                        }

                        return "";
                    })
                }

                setProducto({
                    nombre_producto_0: nombre0,
                    cantidad_producto_0: cantidad0,
                    nombre_producto_1: nombre1,
                    cantidad_producto_1: cantidad1,
                    nombre_producto_2: nombre2,
                    cantidad_producto_2: cantidad2
                })
                
            })
    
        }
    
        pintarGrafica();
    },[]);


    return (
        <div>
            <Chart
                width={'100%'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                    ['Task', 'Hours per Day'],
                    [producto.nombre_producto_0, producto.cantidad_producto_0],
                    [producto.nombre_producto_1, producto.cantidad_producto_1],
                    [producto.nombre_producto_2, producto.cantidad_producto_2],
                ]}
                options={{
                    title: 'Top 3 productos de esta semana',
                }}
                rootProps={{ 'data-testid': '1' }}
            />
        </div>
    )
}

export default Grafica_pastel
