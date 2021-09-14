import React, { FC } from 'react';
import {
  RouteComponentProps,
  Link,
  Route,
  Switch,
  Redirect,
  useHistory,
} from 'react-router-dom';
import GoodsInfo from '@/components/goods_info/Goods_info';
import Order from '@/components/order/Order';
import Settings from '@/components/settings/Settings';
import { Button, Layout, Menu, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './Home.module.scss';
import { logout } from '@/api/author';
const { Header, Content } = Layout;

const Home: FC<RouteComponentProps> = (props) => {
  const {
    match: { path },
  } = props;
  const menu = [
    { name: '商品信息', route: '/home/goods' },
    { name: '订单管理', route: '/home/order' },
    { name: '设置中心', route: '/home/settings' },
  ];

  const history = useHistory();

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
      }
    });
  };

  return (
    <div className={styles.container}>
      <Layout className='layout'>
        <Header className={styles.header}>
          <Menu theme='dark' mode='horizontal' defaultSelectedKeys={['goods']}>
            {menu.map((item) => {
              return (
                <Menu.Item key={item.route}>
                  <Link to={item.route}>{item.name}</Link>
                </Menu.Item>
              );
            })}
          </Menu>
          <Button className={styles.logout} type="link" onClick={handleLogout}>
            注销
          </Button>
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
