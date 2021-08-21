/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { fetchSeries } from 'src/api/categoryAndSeries';
import { useRequest } from 'ahooks';
import type { ColumnType } from 'rc-table/lib/interface';
import { Space, Button, Table } from 'antd';
import type { SeriesT } from 'src/@types/series';
import styles from './Series.module.scss';
import { formatDate } from 'src/utils';

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
    render: (text: string, record: Record<string, any>) => (
      <Link to={`/home/goods_info/goods?_key=${record._id}`}>{text}</Link>
    ),
  },
  {
    title: '商品数量',
    dataIndex: 'goods_count',
    key: 'goods_count',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
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

const Series: FC<RouteComponentProps<{ id: string }>> = (props) => {
  const {
    match: {
      params: { id: category_id },
    },
  } = props;
  console.log('series props => ', props);
  // 获取所有商品
  const { data, loading } = useRequest(fetchSeries.bind(null, category_id), {
    formatResult({ res }) {
      // 格式化接口返回的数据
      // console.log('formatResult => ', res);
      return res.map((item: SeriesT, index: string) => {
        const { _id: key, goods_data, create_time, update_time } = item;
          return {
          ...item,
          key,
          sequence: `0${index + 1}`.slice(-2),
          goods_count: goods_data?.length ?? 0,
          create_time: create_time && formatDate(create_time),
          update_time: update_time && formatDate(update_time),
        };
      });
    },
  });

  return (
    <div className={styles.container}>
      <h4>系列列表</h4>
      <Table
        size='middle'
        loading={loading}
        columns={columns}
        dataSource={data ?? []}
      />
    </div>
  );
};

export default Series;
