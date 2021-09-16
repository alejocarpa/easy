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
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
