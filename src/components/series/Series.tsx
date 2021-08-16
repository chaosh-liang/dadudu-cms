/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { fetchSeries } from 'src/api/categoryAndSeries';
import { useRequest } from 'ahooks';
import type { ColumnType } from 'rc-table/lib/interface';
import { Space, Button, Table } from 'antd';
import type { SeriesT, SeriesClientT } from 'src/@types/series';
import styles from './Series.module.scss';

// 表格列定义
const columns: ColumnType<any>[] = [
  {
    title: '序号',
    dataIndex: 'sequence',
    key: 'sequence',
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    render: (text: string, record: Record<string, any>) => <Link to={`/home/goods_info/goods?_key=${record._id}`}>{text}</Link>,
  },
  {
    title: '商品数量',
    dataIndex: 'goods_count',
    key: 'goods_count',
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
        <Button className={styles['operation-btn']} type='link'>
          编辑
        </Button>
        <Button className={styles['operation-btn']} type='link'>
          删除
        </Button>
      </Space>
    ),
  },
];

const Series: FC<RouteComponentProps<{ id: string; }>> = (props) => {
  const {
    match: { params: { id: category_id } },
  } = props;
  console.log('series props => ', props);
  // 获取所有商品
  const { data, loading } = useRequest(
    fetchSeries.bind(null, category_id),
    {
      formatResult({ res }) {
        // 格式化接口返回的数据
        // console.log('formatResult => ', res);
        return res.map((item: SeriesT, index: string) => {
          const { _id: key, goods_data } = item;
          return {
            ...item,
            key,
            sequence: index,
            goods_count: goods_data?.length ?? 0,
          };
        });
      },
    }
  );

  return (
    <div className={styles.container}>
      <h4>系列列表</h4>
      <Table
        size='middle'
        loading={loading}
        columns={columns}
        dataSource={data as SeriesClientT[]}
      />
    </div>
  );
};

export default Series;
