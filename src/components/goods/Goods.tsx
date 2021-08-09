import React, { FC, useState, useEffect } from 'react';
import http from 'axios';
import { RouteComponentProps } from 'react-router-dom';
import { Table, Tag, Space, Button } from 'antd';
import type { goodsType } from 'src/@types/goods';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags: string[]) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: string, record: Record<string, any>) => (
      <Space size='middle'>
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const Goods: FC<RouteComponentProps> = (props) => {
  const [total, setTotal] = useState(0);
  const [goodsData, setGoodsData] = useState([]);
  const fetchData = async () => {
    const res = await http.post('http://127.0.0.1:7716/api/goods', {
      page_index: 1,
      page_size: 10,
    });
    console.log('home fetch all goods => ', res);
    if (res?.data?.code === 200) {
      const {
        data: {
          code,
          data: { res: goods, total: t },
        },
      } = res;
      setGoodsData(goods);
      setTotal(t);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const params: goodsType = {
    name: 'iphone13',
    banner_url: [
      {
        path: '/assets/images/banner/rabit.png',
      }
    ],
    category_id: '60f433ca9f5a87b9f4c71941',
    desc: 'Apple iPhone 13 128G',
    discount_price: 5599.69,
    discount_threshold: 10,
    icon_url: '/assets/images/iphone.jpg',
    price: 10099.69,
    series_id: '6107f6df614e499df39c6218',
    home_banner: true,
    desc_url: [
      {
        path: '/assets/images/detail/detail1.png',
      }
    ],
    home_display: true,
    currency_unit: '￥',
    count_unit: '个'
  };

  const addGoods = async (data: goodsType) => {
    const res = await http.post('http://127.0.0.1:7716/api/goods/add', data);
    console.log('home fetch all goods => ', res);
  };

  return (
    <>
      <Table columns={columns} dataSource={data} />
      <Button onClick={() => addGoods(params)}>添加商品</Button>
    </>
  );
};

export default Goods;
