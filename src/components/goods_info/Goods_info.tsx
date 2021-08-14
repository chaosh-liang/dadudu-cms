import React, { FC, useState, useEffect } from 'react';
import { RouteComponentProps, Link, Route, Switch, Redirect } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import {
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined
} from '@ant-design/icons';
import Goods from 'src/components/goods/Goods';
import Category from 'src/components/category/Category';
import styles from './Goods_info.module.scss'
const { Content } = Layout;

const menu = [
  { name: '商品列表', route: 'goods', icon: <PieChartOutlined /> },
  { name: '商品类别', route: 'category', icon: <DesktopOutlined /> },
];

const GoodsInfo: FC<RouteComponentProps> = (props) => {
  const { match: { path } } = props;
  const [contentvh, setContentvh] = useState(600); // 计算高度
  useEffect(() => {
    const rootEl = document.getElementById('root');
    if (rootEl) setContentvh(rootEl?.offsetHeight - 64);
  }, []);

  return (
    <div className={styles.container}>
      <Menu mode="vertical" defaultSelectedKeys={['goods']}>
        {menu.map(item => {
          return <Menu.Item key={item.route} icon={item.icon}>
            <Link to={item.route} >{item.name}</Link>
          </Menu.Item>;
        })}
      </Menu>
      <Content style={{ minHeight: `${contentvh}px` }}>
        <Switch>
          <Route
            path={`${path}/goods`}
            render={(props) => <Goods {...props} />}
          />
          <Route
            path={`${path}/category`}
            render={(props) => <Category {...props} />}
          />
          <Redirect to={`${path}/goods`} />
        </Switch>
      </Content>
    </div>
  );
};

export default GoodsInfo;
