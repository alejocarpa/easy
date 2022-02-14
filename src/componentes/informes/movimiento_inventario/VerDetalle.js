import React, { useState, useEffect } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import axios from 'axios';
import Dominio from './../../../dominio';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function VerDetalle(props) {

    const show = props.show;
    const handleClose = props.handleClose;
    const codigo_producto = props.codigo_producto;
    const nombre_producto = props.nombre_producto;
    const codigo_bodega = props.bodega;
    const total_inventario = props.total_inventario;
    const [entradas, setEntradas] = useState([]);
    const [salidas, setSalidas] = useState([]);
    const [trasladosEntrada, setTrasladosEntrada] = useState([]);
    const [trasladosSalida, setTrasladosSalida] = useState([]);
    const [facturas, setFacturas] = useState([]);

    const UrlModulos = `${Dominio}/informes/movimiento_inventario/movimiento_inventario`;

    useEffect(() => {
        axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'verEntradas',
            producto: codigo_producto,
            bodega: codigo_bodega
        })
            .then(response => {

                const responseJSON = response.data;
                //console.log(responseJSON);
                setEntradas(responseJSON);
            })

        axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'verSalidas',
            producto: codigo_producto,
            bodega: codigo_bodega
        })
            .then(response => {

                const responseJSON = response.data;
                //console.log(responseJSON);
                setSalidas(responseJSON);
            })

        axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'verTrasladosEntrada',
            producto: codigo_producto,
            bodega: codigo_bodega
        })
            .then(response => {

                const responseJSON = response.data;
                //console.log(responseJSON);
                setTrasladosEntrada(responseJSON);
            })

        axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'verTrasladosSalida',
            producto: codigo_producto,
            bodega: codigo_bodega
        })
            .then(response => {

                const responseJSON = response.data;
                //console.log(responseJSON);
                setTrasladosSalida(responseJSON);
            })

        axios.post(UrlModulos, {
            aut_ip: cookies.get('aut_ip'),
            aut_bd: cookies.get('aut_bd'),
            metodo: 'verFacturas',
            producto: codigo_producto,
            bodega: codigo_bodega
        })
            .then(response => {

                const responseJSON = response.data;
                //console.log(responseJSON);
                setFacturas(responseJSON);
            })
    }, [codigo_producto]);

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                fullscreen={true}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {nombre_producto}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table responsive striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Entradas</th>
                                <th>Salidas</th>
                                <th>Traslados de Entradas</th>
                                <th>Traslados de Salidas</th>
                                <th>Facturas</th>
                                <th>Total Inventario</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {!entradas.result ? 'Cargando...' : entradas.result.map((ent) => {
                                        return <p><b>Documento:</b> {ent.codigo_transaccion} <b>cant:</b> {ent.entrada}</p>
                                    })}
                                </td>
                                <td>
                                    {!salidas.result ? 'Cargando...' : salidas.result.map((sal) => {
                                        return <p><b>Documento:</b> {sal.codigo_transaccion} <b>cant:</b> {sal.salida}</p>
                                    })}
                                </td>
                                <td>
                                    {!trasladosEntrada.result ? 'Cargando...' : trasladosEntrada.result.map((te) => {
                                        return <p><b>Documento:</b> {te.codigo_transaccion} <b>cant:</b> {te.traslado_entrada}</p>
                                    })}
                                </td>
                                <td>
                                    {!trasladosSalida.result ? 'Cargando...' : trasladosSalida.result.map((ts) => {
                                        return <p><b>Documento:</b> {ts.codigo_transaccion} <b>cant:</b> {ts.traslado_salida}</p>
                                    })}
                                </td>
                                <td>
                                    {!facturas.result ? 'Cargando...' : facturas.result.map((fac) => {
                                        return <p><b>Factura:</b> {fac.codigo_transaccion} <b>cant:</b> {fac.facturado}</p>
                                    })}
                                </td>
                                <td>
                                    {total_inventario}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default VerDetalle;