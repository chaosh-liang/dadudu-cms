/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { fetchSeries } from 'src/api/categoryAndSeries';
import { useRequest } from 'ahooks';
import type { ColumnType } from 'rc-table/lib/interface';
import { Space, Button, Table, Form, Input, Modal, message } from 'antd';
import type { SeriesT } from 'src/@types/series';
import styles from './Series.module.scss';
import { formatDate } from 'src/utils';
import Select from 'rc-select';

const Series: FC<RouteComponentProps<{ id: string }>> = (props) => {
  const initAesData: SeriesT = {
    name: '',
    category_id: '',
    no: 1,
    icon_url: '',
    goods_count: 0
  };
  const [gt, setGt] = useState<number>(1);
  const [aesMode, setAESMode] = useState<number>(1);
  const [aesData, setAESData] = useState<SeriesT>(initAesData);
  const [aesVisible, setAESVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  // 表格列定义
  const columns: ColumnType<SeriesT>[] = [
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
        <Link
          title='跳转至商品'
          to={`/home/goods_info/goods?_key=${record._id}`}
        >
          {text}
        </Link>
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
      render: (text: string, record: SeriesT) => (
        <Space size='small'>
          <Button
            className={styles['operation-btn']}
            type='link'
            onClick={() => editSeries(record)}
          >
            编辑
          </Button>
          <Button className={styles['operation-btn']} type='link'>
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const {
    match: {
      params: { id: category_id },
    },
  } = props;

  useEffect(() => {
    // console.log('category useEffect');
    if (aesVisible) {
      const { name, desc } = aesData;
      form.setFieldsValue({ name, desc });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aesVisible])
  
  // 获取某列别下的所有系列【需要重新获取，因 store 下的数据格式没有字段: goods_count】
  const { data: seriesData, loading: layoutLoading } = useRequest(fetchSeries.bind(null, category_id), {
    refreshDeps: [gt],
    formatResult({ data: { res } }) {
      // 格式化接口返回的数据
      // console.log('formatResult => ', result);
      return res.map((item: SeriesT, index: string) => {
        const { _id: key, create_time, update_time } = item;
          return {
          ...item,
          key,
          sequence: `0${index + 1}`.slice(-2),
          create_time: create_time && formatDate(create_time),
          update_time: update_time && formatDate(update_time),
        };
      });
    },
    onSuccess(data) {
      setAESData(data);
    }
  });

  // 添加
  const addSeries = () => {
    // console.log('addSeries');
    setAESMode(1);
    setAESData(initAesData);
    setAESVisible(true);
  };

  // 编辑
  const editSeries = (record: SeriesT) => {
    // console.log('editSeries => ', record);
    setAESMode(2);
    setAESData(record);
    setAESVisible(true);
  };

  // TODO: 保存
  const handleSave = () => {
    console.log('handleSave');
    setGt(gt + 1);
  };

  // 取消
  const handleCancel = () => {
    console.log('handleCancel');
    setAESData(initAesData);
    setAESVisible(false);
  };

  // TODO: 删除
  const handleDelete = async (id?: string) => {
    // console.log('handleDelete', [id]);
    if (id) {
      try {
        // await deleteCategory({ ids: id });
        message.success('删除成功');
      } catch (error: any) {
        // 捕获网络故障的错误
        message.error(error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h4 className={styles.title}>系列</h4>
        <div>
          <Button type='primary' size='middle' onClick={addSeries}>
            添加
          </Button>
        </div>
      </header>
      <section className={styles.section}>
        <Table
          size='middle'
          columns={columns}
          pagination={false}
          dataSource={seriesData}
          loading={layoutLoading}
        />
      </section>
      <Modal
        width={520}
        destroyOnClose
        getContainer={false} // 挂载在当前 div 节点下，而不是 document.body
        title={aesMode === 1 ? '添加系列' : '编辑系列'}
        okText={aesMode === 1 ? '提交' : '保存'}
        cancelText='取消'
        visible={aesVisible}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          colon={false}
          size='middle'
          autoComplete='off'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            validateFirst
            label='系列名称'
            name='name'
            rules={[
              { required: true, message: '请输入系列名称' },
              { type: 'string', whitespace: true, message: '不能只输入空格符' },
            ]}
          >
            <Input placeholder='请输入系列名称' />
          </Form.Item>
          <Form.Item validateFirst label='所属类别' name='category'>
            <Select></Select>
          </Form.Item>
          <Form.Item
            validateFirst
            label='系列描述'
            name='desc'
            rules={[{ required: true, message: '请输入系列描述' }]}
          >
            <Input.TextArea rows={5} placeholder='请输入系列描述' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Series;
