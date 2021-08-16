import React, { FC, useState } from 'react';
import {
  RouteComponentProps,
  Link,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useMount } from 'ahooks';
import { PieChartOutlined, DesktopOutlined } from '@ant-design/icons';
import Goods from 'src/components/goods/Goods';
import Category from 'src/components/category/Category';
import Series from 'src/components/series/Series';
import styles from './Goods_info.module.scss';
const { Content } = Layout;

const menu = [
  { name: '商品列表', route: '/home/goods_info/goods', icon: <PieChartOutlined /> },
  { name: '商品类别', route: '/home/goods_info/category', icon: <DesktopOutlined /> },
];

const GoodsInfo: FC<RouteComponentProps> = (props) => {
  const {
    match: { path },
  } = props;
  const [contentvh, setContentvh] = useState(600); // 计算高度

  useMount(() => {
    const rootEl = document.getElementById('root');
    if (rootEl) setContentvh(rootEl?.offsetHeight - 64);
  });

  // 获取类别和系列
  return (
    <div className={styles.container}>
      <Menu mode='vertical' defaultSelectedKeys={['goods']}>
        {menu.map((item) => {
          return (
            <Menu.Item key={item.route} icon={item.icon}>
              <Link to={item.route}>{item.name}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
      <Content style={{ minHeight: `${contentvh}px` }}>
        <Switch>
          <Route
            exact
            path={`${path}/goods`}
            render={(props) => <Goods {...props} />}
          />
          <Route
            exact
            path={`${path}/category`}
            render={(props) => <Category {...props} />}
          />
          <Route
            exact
            path={`${path}/category/:id`}
            render={(props) => <Series {...props} />}
          />
          <Redirect to={`${path}/goods`} />
        </Switch>
      </Content>
    </div>
  );
};

export default GoodsInfo;
