import React, { FC, useEffect, useRef, useState } from 'react';
import {
  RouteComponentProps,
  Link,
  Route,
  Switch,
  Redirect,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import GoodsInfo from '@/components/goods_info/Goods_info';
import Order from '@/components/order/Order';
import Settings from '@/components/settings/Settings';
import { Button, Layout, Menu, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './Home.module.scss';
import { logCheck, logout } from '@/api/author';
import { useMount } from 'ahooks';
import { useDispatch } from 'react-redux';
import { ActionType } from '@/store/action_type';
const { Header, Content } = Layout;

const Home: FC<RouteComponentProps> = () => {
  const menu = [
    { name: '商品信息', route: '/home/goods_info' },
    { name: '订单管理', route: '/home/order' },
    { name: '设置中心', route: '/home/settings' },
  ];

  const history = useHistory();
  const location = useLocation();
  const { path } = useRouteMatch();
  const t_pathname = location.pathname.match(/^\/[^/]+\/[^/]+/g)?.[0] ?? '';
  const [curRoute, setCurRoute] = useState(t_pathname); // 设置当前路由高亮
  const [mainvh, setMainvh] = useState(768);
  const containerEl = useRef(null);
  const dispatch = useDispatch()

  useMount(() => {
    if (containerEl?.current) {
      const h = (containerEl.current as unknown as HTMLElement).offsetHeight - 64; // 64: 头部高度
      setMainvh(h);
      dispatch({ type: ActionType.SET_MAIN_VH, payload: { h } });
    }
  })

  useEffect(() => {
    const t_pathname = location.pathname.match(/^\/[^/]+\/[^/]+/g)?.[0] ?? '';
    setCurRoute(t_pathname);
  }, [location]);

  // 注销登录
  const handleLogout = () => {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要注销登录吗？',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        const res = await logout();
        if (res?.error_code === '00') {
          history.push('/login');
        }
      },
    });
  };

  // FIXME: dev TODO: 调试用
  const handleLogCheck = async () => {
    const res = await logCheck();
    console.log('handleLogCheck => ', res);
  };

  return (
    <div className={styles.container} ref={containerEl}>
      <Layout>
        <Header className={styles.header}>
          <Menu theme='dark' mode='horizontal' selectedKeys={[curRoute]}>
            {menu.map((item) => {
              return (
                <Menu.Item key={item.route}>
                  <Link to={item.route}>{item.name}</Link>
                </Menu.Item>
              );
            })}
          </Menu>
          <Button type='link' onClick={handleLogCheck}>
            校验-在线（调试）
          </Button>
          <Button type='link' onClick={handleLogout}>
            注销
          </Button>
        </Header>
        <Content className={styles.main} style={{ height: `${mainvh}px` }}>
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
