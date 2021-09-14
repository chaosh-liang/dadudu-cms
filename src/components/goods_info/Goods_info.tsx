import React, { FC, useState } from 'react';
import {
  RouteComponentProps,
  Link,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Layout, Menu, Spin } from 'antd';
import { useMount } from 'ahooks';
import { PieChartOutlined, DesktopOutlined } from '@ant-design/icons';
import Goods from '@/components/goods/Goods';
import Category from '@/components/category/Category';
import Series from '@/components/series/Series';
import styles from './Goods_info.module.scss';
import { useDispatch } from 'react-redux';
import store, { injectReducer } from '@/store';
import reducer from './reducer';
import { fetchCategoryThunk } from '@/store/redux_thunk';

const { Content } = Layout;

const menu = [
  {
    name: '商品列表',
    route: '/home/goods_info/goods',
    icon: <PieChartOutlined />,
  },
  {
    name: '商品类别',
    route: '/home/goods_info/category',
    icon: <DesktopOutlined />,
  },
];

// 动态注入 reducer
injectReducer(store, { key: 'goodsinfo', reducer });

const GoodsInfo: FC<RouteComponentProps> = (props) => {
  const {
    match: { path },
  } = props;
  const [contentvh, setContentvh] = useState(600); // 计算高度
  const [layoutLoading, setLayoutLoading] = useState(true);
  const dispatch = useDispatch();

  useMount(() => {
    const rootEl = document.getElementById('root');
    if (rootEl) setContentvh(rootEl?.offsetHeight - 64);
    // 获取所有类别
    (dispatch(fetchCategoryThunk()) as any).then((data: any) => {
      setLayoutLoading(false);
    });
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
        <Spin spinning={layoutLoading}>
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
        </Spin>
      </Content>
    </div>
  );
};

export default GoodsInfo;
