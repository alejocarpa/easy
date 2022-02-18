import Principal from './componentes/principal/Principal';
import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './componentes/Home/Home';
import Cliente from './componentes/cliente/Cliente';
import Producto from './componentes/producto/Producto';
import Laboratorio from './componentes/laboratorio/Laboratorio';
import Asesor from './componentes/asesor/Asesor';
import Bodega from './componentes/bodega/Bodega';
import Pedido from './componentes/pedido/Pedido';
import Factura from './componentes/factura/Factura';
import ConsolidadoIventario from './componentes/consolidado_inventario/ConsolidadoInventario';
import Empresa from './componentes/empresa/Empresa';
import Proveedor from './componentes/proveedor/Proveedor';
import Inventario from './componentes/inventario/inventario';
import Recibocaja from './componentes/recibocaja/Recibocaja';
import Popupcliente from './componentes/popupcliente/Popupcliente';
import Popupproducto from './componentes/popupproducto/Popupproducto';
import Popupproducto_inventario from './componentes/popupproducto_inventario/Popupproducto';
import InformeCartera from './componentes/informe_cartera/InformeCartera';
import Ventas from './componentes/informes/ventas/Ventas';
import Ventas_x_Producto from './componentes/informes/ventas_x_producto/Ventas_x_Producto';
import Movimiento_inventario from './componentes/informes/movimiento_inventario/Movimiento_inventario';
import Recepcion_tecnica from './componentes/informes/recepcion_tecnica/Recepcion_tecnica';
import CambioClave from './componentes/cambio_clave/CambioClave';
import Personalizar from './componentes/personalizar/Personalizar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Principal} />
          <Route path="/Home" component={Home} />
          <Route path="/cliente" component={Cliente} />
          <Route path="/producto" component={Producto} />
          <Route path="/laboratorio" component={Laboratorio} />
          <Route path="/asesor" component={Asesor} />
          <Route path="/bodega" component={Bodega} />
          <Route path="/pedidos" component={Pedido} />
          <Route path="/facturacion" component={Factura} />
          <Route path="/informes/consolidado_inventario" component={ConsolidadoIventario} />
          <Route path="/empresa" component={Empresa} />
          <Route path="/proveedor" component={Proveedor} />
          <Route path="/inventario" component={Inventario} />
          <Route path="/recibo_caja" component={Recibocaja} />
          <Route path="/popupcliente" component={Popupcliente} />
          <Route path="/popupproducto" component={Popupproducto} />
          <Route path="/popupproducto_inventario" component={Popupproducto_inventario} />
          <Route path="/informe_cartera" component={InformeCartera} />
          <Route path="/informes/ventas" component={Ventas} />
          <Route path="/informes/ventas_x_producto" component={Ventas_x_Producto} />
          <Route path="/informes/movimiento_inventario" component={Movimiento_inventario} />
          <Route path="/informes/recepcion_tecnica" component={Recepcion_tecnica} />
          <Route path="/cambio_clave" component={CambioClave} />
          <Route path="/personalizar" component={Personalizar} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
