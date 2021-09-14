import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from '@/store'
import Home from '@/view/home/Home';
import Login from '@/view/login/Login';
import Order from '@/view/order/Order';
import NoMatch from '@/view/404/NoMatch';
import 'antd/dist/antd.css';
import '@/assets/scss/common.scss';
import '@/assets/scss/antd.override.scss'

const App = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <Switch>
          <Route path='/login' render={(props) => <Login {...props} />} />
          <Route path='/home' render={(props) => <Home {...props} />} />
          <Route path='/order' render={(props) => <Order {...props} />} />
          <Redirect path='' to='/login' />
          <Route path="**" render={props => <NoMatch {...props} />} />
        </Switch>
      </HashRouter>
    </Provider>
  );
};

export default App;
