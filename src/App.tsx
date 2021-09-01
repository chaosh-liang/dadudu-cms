import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from 'src/store'
import Home from 'src/view/home/Home';
import Login from 'src/view/login/Login';
import Order from 'src/view/order/Order';
// import NoMatch from 'src/view/404/NoMatch';
import 'antd/dist/antd.css';
import 'src/assets/scss/common.scss';
import 'src/assets/scss/antd.override.scss'

const App = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <Switch>
          <Route path='/home' render={(props) => <Home {...props} />} />
          <Route path='/login' render={(props) => <Login {...props} />} />
          <Route path='/order' render={(props) => <Order {...props} />} />
          {/* <Route path="*" render={props => <NoMatch {...props} />} /> */}
          <Redirect to='/home' />
        </Switch>
      </HashRouter>
    </Provider>
  );
};

export default App;
