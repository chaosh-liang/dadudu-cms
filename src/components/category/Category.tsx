import React, { FC, useState, useEffect } from 'react';
import { useSelector  } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { fetchCategories } from 'src/api/categoryAndSeries';
import { useRequest } from 'ahooks';
import type { ColumnType } from 'rc-table/lib/interface';
import { Space, Button, Table } from 'antd';
import type { CategoryT } from 'src/@types/category';
import styles from './Category.module.scss';
import { formatDate } from 'src/utils';
import type { RootState } from 'src/store/index'


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
      render: (text: string, record: Record<string, any>) => <Link to={`${path}/${record._id}`}>{text}</Link>,
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

  const field1 = useSelector((state: RootState) => state.init.field1)

  // 获取所有商品
  const { data, loading: fetchCategoriesLoading } = useRequest(
    fetchCategories,
    {
      formatResult({ res }) {
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
    }
  );

  return (
    <div className={styles.container}>
      <h4>类别</h4>
      <div>{ field1 }</div>
      <Table
        size='middle'
        loading={fetchCategoriesLoading}
        columns={columns}
        dataSource={data ?? []}
        pagination={false}
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

export default Category;
