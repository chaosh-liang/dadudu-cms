import React, { FC, useState, useEffect } from 'react'
import { RouteComponentProps, Link, Route, Switch, Redirect } from 'react-router-dom'
import Goods from 'src/components/goods/Goods';
import Order from 'src/components/order/Order';
import Settings from 'src/components/settings/Settings';
import http from 'axios'
import { Layout, Menu } from 'antd';
const { Header, Content } = Layout;


const Home: FC<RouteComponentProps> = (props) => {
  const { match: { path } } = props;
  const fetchData = async () => {
    const res = await http.get('http://127.0.0.1:7716/api/goods')
    console.log('home fetch all goods => ', res);
  };
  const [contentvh, setContentvh] = useState(600); // 计算高度
  const menu = [
    { name: '商品列表', route: 'goods' },
    { name: '订单管理', route: 'order' },
    { name: '设置中心', route: 'settings' }
  ];
  useEffect(() => {
    fetchData();
    const rootEl = document.getElementById('root');
    if (rootEl) setContentvh(rootEl?.offsetHeight - 64);
  }, []);
  return (
    <Layout className="layout">
    <Header>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['goods']}>
        {menu.map(item => {
          return <Menu.Item key={item.route}>
            <Link to={item.route} >{item.name}</Link>
          </Menu.Item>;
        })}
      </Menu>
    </Header>
    <Content style={{ padding: '20px', minHeight: `${contentvh}px` }}>
      <Switch>
        <Route path={`${path}/goods`} render={props => <Goods {...props} />} />
        <Route path={`${path}/order`} render={props => <Order {...props} />} />
        <Route path={`${path}/settings`} render={props => <Settings {...props} />} />
        <Redirect to={`${path}/goods`} />
      </Switch>
    </Content>
  </Layout>
  );
}

export default Home;
