/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useEffect } from 'react';
import http from 'axios';
import { RouteComponentProps } from 'react-router-dom';
import { Table, Tag, Space, Button, Image, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { GoodsT } from 'src/@types/goods';
import { UploadChangeParam } from 'antd/lib/upload';
import type { ColumnType } from 'rc-table/lib/interface';
import { useMount, useRequest } from 'ahooks';
import { fetchAllGoods } from 'src/api/goods';
import { fetchSeriesByCategoryId } from 'src/api/category';
import styles from './Goods.module.scss';

/* {
  'name': 'iphone12',
  'discount_price':5599.69,
  'discount_threshold':10,
  'price':6099.69,
  'currency_unit': '￥',
  'count_unit': '个',
  'home_banner':true,
  'home_display': true,
  'desc':'Apple iPhone 12 128G 蓝色 5G 手机 Apple iPhone 12 128G 蓝色 5G 手机',
  'icon_url':'/assets/images/iphone.jpg',
  'series_id':{'_id':'ObjectId(60f586450811e699dc39fbc7')},
  'category_id': {'_id':ObjectId('60f433ca9f5a87b9f4c71941')},
  'desc_url':[{ _id: ObjectId('1234'), path: string }],
  'banner_url': [{ _id: ObjectId('1234'), path: string }]
} */

// 表格列定义
const columns: ColumnType<any>[] = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    align: 'center',
  },
  {
    title: '折后价',
    dataIndex: 'discount_price',
    key: 'discount_price',
    align: 'center',
  },
  {
    title: '打折阈值',
    dataIndex: 'discount_threshold',
    key: 'discount_threshold',
    align: 'center',
  },
  {
    title: '单位',
    dataIndex: 'count_unit',
    key: 'count_unit',
    align: 'center',
  },
  {
    title: '货币',
    dataIndex: 'currency_unit',
    key: 'currency_unit',
    align: 'center',
  },
  {
    title: '类别',
    dataIndex: 'category',
    key: 'category',
    align: 'center',
  },
  {
    title: '系列',
    dataIndex: 'series',
    key: 'series',
    align: 'center',
  },
  {
    title: '主页轮播',
    dataIndex: 'home_banner',
    key: 'home_banner',
    align: 'center',
  },
  {
    title: '主页展示',
    dataIndex: 'home_display',
    key: 'home_display',
    align: 'center',
  },
  {
    title: '描述',
    dataIndex: 'desc',
    key: 'desc',
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (text: string, record: Record<string, any>) => (
      <Space size='small'>
        <Button className={styles['operation-btn']} type='link'>预览</Button>
        <Button className={styles['operation-btn']}  type='link'>编辑</Button>
        <Button className={styles['operation-btn']}  type='link'>删除</Button>
      </Space>
    ),
  },
];

const Goods: FC<RouteComponentProps> = (props) => {
  const [gt, setGt] = useState(0); // 为了触发获取商品请求
  const [page_index, setPageIndex] = useState(1);
  const [page_size, setPageSize] = useState(10);
  // const [tableData, setTableData] = useState([]);

  // 获取所有商品
  const { data, loading: fetchAllGoodsLoading } = useRequest(
    fetchAllGoods.bind(null, { page_index, page_size }),
    {
      refreshDeps: [gt, page_index, page_size],
      async formatResult({ res, total }) {
        // 格式化接口返回的数据
        // console.log('formatResult => ', res);
        const goods = res.map((item: GoodsT) => {
          const { _id: key, series_id, category_id, home_banner, home_display } = item;
          return {
            ...item,
            key,
            series: series_id,
            category: category_id,
            home_banner: home_banner ? '是' : '否',
            home_display: home_display ? '是' : '否',
          };
        });
        const seriesArray = res.map((item: GoodsT) => fetchSeriesByCategoryId(item.category_id))
        const seriesRes = await Promise.all(seriesArray);
        console.log('seriesRes => ', seriesRes);
        return { goods, total };
      },
    }
  );

  /* // upload params
  const props2 = {
    name: 'file',
    multiple: true,
    action: 'http://localhost:7031/upload',
    onChange({ file, fileList }: UploadChangeParam) {
      const { name, status } = file;
      if (status === 'done') {
        message.success(`${name} file uploaded successfully`);
        console.log('fileList => ', fileList);
      } else if (status === 'error') {
        message.error(`${name} file upload failed.`);
      }
    },
  };

  // add params
  const params: GoodsT = {
    name: 'iphone13',
    banner_url: [
      {
        path: '/assets/images/banner/rabit.png',
      },
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
      },
    ],
    home_display: true,
    currency_unit: '￥',
    count_unit: '个',
  };

  // edit params
  const params2 = {
    _id: '611149f98f66013b50690383',
    name: 'iphone 133',
    series_id: '6107f6df614e499df39c621b',
    desc_url: [
      {
        path: '/assets/images/detail/detail1.png',
        _id: '611149f98f66013b50690381',
      },
      {
        path: '/assets/images/detail/detail2.png',
        _id: '611149f98f66013b50690382',
      },
    ],
  };

  // delete params
  const params3: { ids: string[] } = {
    ids: ['611149f98f66013b50690383', '611149f98f66013b50690384'],
  };

  const deleteGoods = async (data: { ids: string[] }) => {
    const res = await http.delete('http://127.0.0.1:7716/api/goods/delete', {
      data,
    });
    console.log('home update goods => ', res);
  };

  const editGoods = async (data: Partial<GoodsT>) => {
    const res = await http.put('http://127.0.0.1:7716/api/goods/update', data);
    console.log('home update goods => ', res);
  };

  const addGoods = async (data: GoodsT) => {
    const res = await http.post('http://127.0.0.1:7716/api/goods/add', data);
    console.log('home add goods => ', res);
  }; */

  return (
    <div className={styles.container}>
      <Table
        loading={fetchAllGoodsLoading}
        columns={columns}
        // dataSource={data?.goods ?? []}
        dataSource={[]}
      />
      {/*  <br />
      <Upload {...props2}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <br />
      <Image src='http://localhost:7031/upload/bootstrap.png' width={200} />
      <br />
      <Button onClick={() => addGoods(params)}>添加商品</Button>
      <br />
      <br />
      <Button onClick={() => editGoods(params2)}>
        修改商品：611149f98f66013b50690383
      </Button>
      <br />
      <br />
      <Button onClick={() => deleteGoods(params3)}>
        删除商品：611149f98f66013b50690383 & 4
      </Button>
      <div>{JSON.stringify(goods)}</div>
      <br />
      <hr /> */}
    </div>
  );
};

export default Goods;
