import { Button, Modal } from 'react-bootstrap';

function VerDetalle(props) {

    const show = props.show;
    const handleClose = props.handleClose;
    const codigo_producto = props.codigo_producto;
    const nombre_producto = props.nombre_producto;

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {nombre_producto}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Centered Modal</h4>
                    <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                        dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                        consectetur ac, vestibulum at eros.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default VerDetalle;