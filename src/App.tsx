import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from 'src/view/home/Home';
import Login from 'src/view/login/Login';
import Order from 'src/view/order/Order';
import NoMatch from 'src/view/404/NoMatch';
import 'antd/dist/antd.css';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/home" render={props => <Home {...props} />} />
        <Route path="/login" render={props => <Login {...props} />} />
        <Route path="/order" render={props => <Order {...props} />} />
        <Route path="*" render={props => <NoMatch {...props} />} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
