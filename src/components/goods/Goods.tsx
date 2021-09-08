/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Table, Space, Button, Modal, message, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { GoodsT } from 'src/@types/goods';
import type { ColumnType } from 'rc-table/lib/interface';
import { useRequest } from 'ahooks';
import { fetchAllGoods, deleteGoods } from 'src/api/goods';
import { formatDate } from 'src/utils';
import AEGModal from './AEGModal';
import styles from './Goods.module.scss';

const Goods: FC<RouteComponentProps> = () => {
  const [gt, setGt] = useState(0); // 为了触发获取商品请求
  const [page_index, setPageIndex] = useState(1);
  const [aegMode, setAEGMode] = useState(1); // 1：添加，2：编辑
  const [aegVisible, setAEGVisible] = useState(false);
  const [aegData, setAEGData] = useState<GoodsT | null>(null);
  const [page_size, setPageSize] = useState(10);
  const [selectionIds, setSelectionIds] = useState<React.Key[]>([]);
  const [selectionRows, setSelectionRows] = useState<Required<GoodsT>[]>([]);

  // 获取所有商品
  const { data, loading: fetchAllGoodsLoading } = useRequest(
    fetchAllGoods.bind(null, { page_index, page_size }),
    {
      refreshDeps: [gt, page_index, page_size],
      formatResult({ data: { res, total, page_index, page_size } }) {
        // 格式化接口返回的数据
        // console.log('formatResult => ', res);
        const goods = res.map((item: GoodsT, index: number) => {
          const sequence = `0${(page_index - 1) * page_size + index + 1}`.slice(
            -2
          ); // 序号
          const {
            _id: key,
            home_banner,
            home_display,
            create_time,
            update_time,
            series_data: {
              0: { name: series_name },
            },
            category_data: {
              0: { name: category_name },
            },
          } = item;
          return {
            ...item,
            key,
            sequence,
            series_name,
            category_name,
            is_home_banner: home_banner ? '是' : '否',
            is_home_display: home_display ? '是' : '否',
            create_time: create_time && formatDate(create_time),
            update_time: update_time && formatDate(update_time),
          };
        });
        return { goods, total, page_index, page_size };
      },
    }
  );

  const pageNumChange = (page_index: number) => {
    // console.log('pageNumChange ', page_index);
    setPageIndex(page_index);
  };
  const pageSizeChange = (page_index: number, page_size: number) => {
    // console.log('pageSizeChange ', page_index, page_size);
    setPageSize(page_size);
  };

  // 隐藏 modal
  const hideAEModal = (refreshData: boolean = false) => {
    setAEGVisible(false);
    if (refreshData) setGt(gt + 1);
  };

  // 添加
  const addGoods = () => {
    // console.log('addGoods');
    setAEGMode(1);
    setAEGData(null);
    setAEGVisible(true);
  };

  // TODO: 预览
  const overviewGoods = (record: GoodsT) => {
    console.log('overviewGoods');
  };

  // 编辑
  const editGoods = (record: Required<GoodsT>) => {
    // console.log('editGoods => ', record);
    setAEGMode(2);
    setAEGData(record);
    setAEGVisible(true);
  };

  // 删除：单个
  const handleDelete = (id: string) => {
    // console.log('handleDelete', [id]);
    handleDeleteRequest([id]);
  };

  // 删除：多个
  const handleDeleteMulti = () => {
    // console.log('handleDeleteMulti => ', selectionIds, selectionRows);
    Modal.confirm({
      width: 600,
      title: '删除提示',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <div>确定删除以下商品吗：</div>
          <div>
            {selectionRows.map((item, i) => {
              if (i === 0) return <a key={item._id}>{item.name}</a>;
              return <a key={item._id}>、{item.name}</a>;
            })}
          </div>
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk() {
        handleDeleteRequest();
      },
    });
  };

  // 删除：请求
  const handleDeleteRequest = async (
    ids: React.Key[] | string[] = selectionIds
  ) => {
    // console.log('handleDeleteRequest', ids);
    try {
      const res = await deleteGoods({ ids });
      if (res?.error_code === '00') {
        message.success('删除成功');
        if (page_index !== 1) {
          // page-index 或 gt，只要一个更新就可以重新请求数据
          setPageIndex(1);
        } else {
          setGt(gt + 1);
        }
      } else {
        message.error(res?.error_msg ?? '');
      }
    } catch (error: any) {
      // 捕获网络故障的错误
      message.error(error);
    }
  };

  // 表格列定义
  const columns: ColumnType<Required<GoodsT>>[] = [
    {
      title: '序号',
      dataIndex: 'sequence',
      key: 'sequence',
      align: 'center',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
    },
    {
      title: '折扣数量',
      dataIndex: 'discount_threshold',
      key: 'discount_threshold',
      align: 'center',
    },
    {
      title: '折扣价',
      dataIndex: 'discount_price',
      key: 'discount_price',
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
      dataIndex: 'category_name',
      key: 'category_name',
      align: 'center',
    },
    {
      title: '系列',
      dataIndex: 'series_name',
      key: 'series_name',
      align: 'center',
    },
    {
      title: '主页轮播',
      dataIndex: 'is_home_banner',
      key: 'is_home_banner',
      align: 'center',
    },
    {
      title: '主页展示',
      dataIndex: 'is_home_display',
      key: 'is_home_display',
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
      align: 'left',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (text: string, record: Required<GoodsT>) => (
        <Space size='small'>
          <Button className={styles['operation-btn']} type='link' onClick={() => overviewGoods(record)}>
            预览
          </Button>
          <Button
            className={styles['operation-btn']}
            type='link'
            onClick={() => editGoods(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title='确定删除?'
            okText='确认'
            cancelText='取消'
            onConfirm={() => handleDelete(record._id)}
          >
            <Button className={styles['operation-btn']} type='link'>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h4 className={styles.title}>商品</h4>
        <div>
          {selectionIds.length ? (
            <Button
              danger
              size='middle'
              style={{ marginRight: '15px' }}
              onClick={handleDeleteMulti}
            >
              删除
            </Button>
          ) : null}
          <Button type='primary' size='middle' onClick={addGoods}>
            添加
          </Button>
        </div>
      </header>
      <section className={styles.section}>
        <Table
          size='small'
          loading={fetchAllGoodsLoading}
          columns={columns}
          dataSource={data?.goods ?? []}
          rowSelection={{
            type: 'checkbox',
            onChange: (
              selectedRowKeys: React.Key[],
              selectedRows: Required<GoodsT>[]
            ) => {
              // console.log('selectedRowKeys =>', selectedRowKeys);
              setSelectionIds(selectedRowKeys);
              setSelectionRows(selectedRows);
            },
          }}
          pagination={{
            showSizeChanger: true, // 是否可以改变 pageSize boolean
            // total: 803, // 调试使用
            total: data?.total ?? 0, // 数据总数 number
            current: data?.page_index ?? 1, // 当前页数 number
            onChange: pageNumChange, // 页码改变的回调，参数是改变后的页码及每页条数 Function(page, pageSize)
            pageSizeOptions: ['10', '15', '20', '50'], // 指定每页可以显示多少条 string[]
            onShowSizeChange: pageSizeChange, // pageSize 变化的回调 Function(current, size)
            // showTotal: total => (`共 ${total} 条数据`), // 调试使用
            showTotal: (total) => `共 ${data?.total ?? 0} 条数据`, // 用于显示数据总量和当前数据顺序 Function(total, range)
          }}
        />
      </section>
      <AEGModal
        mode={aegMode}
        visible={aegVisible}
        hideAEModal={hideAEModal}
        data={aegData}
      />
    </div>
  );
};

export default Goods;
