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
import Goods from 'src/components/goods/Goods';
import Category from 'src/components/category/Category';
import Series from 'src/components/series/Series';
import styles from './Goods_info.module.scss';
import { fetchCategories } from 'src/api/categoryAndSeries';
import { useRequest } from 'ahooks';
import type { CategoryT } from 'src/@types/category';
import { formatDate } from 'src/utils';
import { useDispatch } from 'react-redux';
import { ActionType } from 'src/store/action_type';
import store, { injectReducer } from 'src/store';
import reducer from './reducer';
import { SeriesT } from 'src/@types/series';

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
  const dispatch = useDispatch();

  // 获取所有商品
  const { loading: fetchCategoriesLoading } = useRequest(
    fetchCategories,
    {
      formatResult({ data: { res } }) {
        // 格式化接口返回的数据
        // console.log('formatResult => ', res);
        return res.map((item: CategoryT, index: number) => {
          const { _id: key, series_data, create_time, update_time } = item;
          return {
            ...item,
            key,
            sequence: `0${index + 1}`.slice(-2),
            series_count: series_data.length,
            create_time: create_time && formatDate(create_time),
            update_time: update_time && formatDate(update_time),
          };
        });
      },
      onSuccess(data) {
        // console.log('Goods_info.tsx fetch category ', data);
        dispatch({ type: ActionType.SET_CATEGORY_DATA, payload: { data } });
      }
    }
  );

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
        {fetchCategoriesLoading ? (
          <Spin />
        ) : (
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
        )}
      </Content>
    </div>
  );
};

export default GoodsInfo;
