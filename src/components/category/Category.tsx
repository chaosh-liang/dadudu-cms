import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import type { ColumnType } from 'rc-table/lib/interface';
import { Space, Button, Table } from 'antd';
import styles from './Category.module.scss';
import type { RootState } from 'src/store/index';

const Category: FC<RouteComponentProps> = (props) => {
  const {
    match: { path },
  } = props;
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
        <Link to={`${path}/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: '系列数量',
      dataIndex: 'series_count',
      key: 'series_count',
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

  // 从 store 中获取类别数据
  const categoryData = useSelector((state: RootState) => state.goodsinfo.category);

  return (
    <div className={styles.container}>
      <h4>类别</h4>
      <Table
        size='middle'
        columns={columns}
        dataSource={categoryData}
        pagination={false}
      />
    </div>
  );
};

export default Category;
