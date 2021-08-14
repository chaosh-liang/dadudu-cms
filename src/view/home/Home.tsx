import React, { FC, useState, useEffect } from 'react';
import {
  RouteComponentProps,
  Link,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import GoodsInfo from 'src/components/goods_info/Goods_info';
import Order from 'src/components/order/Order';
import Settings from 'src/components/settings/Settings';
import { Layout, Menu } from 'antd';
import styles from './Home.module.scss';
const { Header, Content } = Layout;

const Home: FC<RouteComponentProps> = (props) => {
  const {
    match: { path },
  } = props;
  const menu = [
    { name: '商品信息', route: 'goods' },
    { name: '订单管理', route: 'order' },
    { name: '设置中心', route: 'settings' },
  ];
  return (
    <div className={styles.container}>
      <Layout className='layout'>
        <Header>
          <Menu theme='dark' mode='horizontal' defaultSelectedKeys={['goods']}>
            {menu.map((item) => {
              return (
                <Menu.Item key={item.route}>
                  <Link to={item.route}>{item.name}</Link>
                </Menu.Item>
              );
            })}
          </Menu>
        </Header>
        <Content className={styles.content}>
          <Switch>
            <Route
              path={`${path}/goods_info`}
              render={(props) => <GoodsInfo {...props} />}
            />
            <Route
              path={`${path}/order`}
              render={(props) => <Order {...props} />}
            />
            <Route
              path={`${path}/settings`}
              render={(props) => <Settings {...props} />}
            />
            <Redirect to={`${path}/goods_info`} />
          </Switch>
        </Content>
      </Layout>
    </div>
  );
};

export default Home;
