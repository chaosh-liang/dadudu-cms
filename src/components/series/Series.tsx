/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import {
  addSeries,
  deleteSeries,
  editSeries,
  fetchSeries,
} from 'src/api/categoryAndSeries';
import { useMount, useRequest } from 'ahooks';
import type { ColumnType } from 'rc-table/lib/interface';
import {
  Space,
  Button,
  Table,
  Form,
  Input,
  Modal,
  message,
  Popconfirm,
  InputNumber,
  Select,
} from 'antd';
import type { SeriesT } from 'src/@types/series';
import styles from './Series.module.scss';
import { formatDate, getQueryString } from 'src/utils';
import isEqual from 'lodash/isEqual';
import { fetchCategoryThunk } from 'src/store/redux_thunk';

const Series: FC<RouteComponentProps<{ id: string }>> = (props) => {
  const formData: SeriesT = {
    name: '',
    category_id: '',
    no: 1,
    desc: '',
    icon_url: '',
    goods_count: 0,
  };
  const [gt, setGt] = useState<number>(1);
  const [aesMode, setAESMode] = useState<number>(1);
  const [aesData, setAESData] = useState<SeriesT>(formData);
  const [aesVisible, setAESVisible] = useState<boolean>(false);
  const [curEditSeries, setCurEditSeries] = useState<SeriesT>(formData);
  const [categoryName, setCategoryName] = useState<string>('');
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // 表格列定义
  const columns: ColumnType<Required<SeriesT>>[] = [
    {
      title: '序号',
      dataIndex: 'sequence',
      key: 'sequence',
      align: 'center',
    },
    {
      title: '系列名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text: string, record: Required<SeriesT>) => (
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
      title: '排序',
      dataIndex: 'no',
      key: 'no',
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
      render: (text: string, record: Required<SeriesT>) => (
        <Space size='small'>
          <Button
            className={styles['operation-btn']}
            type='link'
            onClick={() => handleEditSeries(record)}
          >
            编辑
          </Button>
          {record.goods_count <= 0 ? (
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
          ) : (
            <Button disabled className={styles['operation-btn']} type='link'>
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];
  const {
    match: {
      params: { id: category_id },
    },
    location: { search },
  } = props;

  useMount(() => {
    const { category_name } = getQueryString(search);
    setCategoryName(category_name);
  });

  useEffect(() => {
    // console.log('category useEffect');
    if (aesVisible) {
      const { name, no, desc } = aesData;
      form.setFieldsValue({ name, no, desc });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aesVisible]);

  // 获取某列别下的所有系列【需要重新获取，因 store 下的数据格式没有字段: goods_count】
  const { data: seriesData, loading: layoutLoading } = useRequest(
    fetchSeries.bind(null, category_id),
    {
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
      },
    }
  );

  // 添加 => 弹框
  const handleAddSeries = () => {
    // console.log('handleAddSeries');
    setAESMode(1);
    setAESData(formData);
    setAESVisible(true);
  };

  // 编辑 => 弹框
  const handleEditSeries = (record: Required<SeriesT>) => {
    // console.log('handleEditSeries => ', record);
    setAESMode(2);
    setAESData(record);
    setAESVisible(true);
    setCurEditSeries(record);
  };

  // 保存
  const handleSave = () => {
    console.log('handleSave');
    form
      .validateFields()
      .then(async (values: SeriesT) => {
        // console.log('form.validateFields success => ', values);
        if (aesMode === 1) {
          // 添加模式
          const params_add: SeriesT = values;
          // console.log('params_add => ', params_add);
          const res = await addSeries(params_add);
          if (res?.error_code === '00') {
            message.success('添加成功');
            setAESVisible(false);
            setGt(gt + 1); // 重新获取一次系列数据
            // redux-thunk 获取一次类别数据
            dispatch(fetchCategoryThunk());
          } else {
            message.error(res?.error_msg ?? '');
          }
        } else if (aesMode === 2) {
          // 编辑模式，只需要传改动的字段 和 _id
          const params_edit: Partial<SeriesT> = {};
          params_edit._id = curEditSeries._id;
          // console.log('params_edit => ', params_edit);
          const keys2Params = (Reflect.ownKeys(values) as string[]).filter(
            (key) => !isEqual(values[key], curEditSeries[key])
          );
          if (keys2Params.length <= 0) {
            message.warning('没改动，无需保存');
            return;
          }
          keys2Params.forEach((key) => {
            params_edit[key] = values[key];
          });
          const res = await editSeries(params_edit);
          if (res?.error_code === '00') {
            message.success('编辑成功');
            setAESVisible(false);
            // redux-thunk 获取一次类别数据
            dispatch(fetchCategoryThunk());
          } else {
            message.error(res?.error_msg ?? '');
          }
        }
      })
      .catch((errorInfo: any) => {
        console.log('form.validateFields error => ', errorInfo);
      });
  };

  // 取消
  const handleCancel = () => {
    // console.log('handleCancel');
    setAESData(formData);
    setAESVisible(false);
  };

  // 删除
  const handleDelete = async (id: React.Key) => {
    // console.log('handleDelete', id);
    try {
      const res = await deleteSeries({ id });
      if (res?.error_code === '00') {
        message.success('删除成功');
        setGt(gt + 1);
        // redux-thunk 获取一次类别数据
        dispatch(fetchCategoryThunk());
      } else {
        message.error(res.error_msg ?? '');
      }
    } catch (error: any) {
      // 捕获网络故障的错误
      message.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h4 className={styles.title}>
          <span>所属类别：</span>
          <span style={{ color: '#1890ff' }}>{categoryName}</span>
        </h4>
        <div>
          <Button type='primary' size='middle' onClick={handleAddSeries}>
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
        width={600}
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
            label='名称'
            name='name'
            rules={[
              { required: true, message: '请输入名称' },
              { type: 'string', whitespace: true, message: '不能只输入空格符' },
            ]}
          >
            <Input placeholder='请输入名称' />
          </Form.Item>
          <Form.Item validateFirst label='所属类别' name='category'>
            <Select></Select>
          </Form.Item>
          <Form.Item
            validateFirst
            label='排序'
            name='no'
            rules={[{ required: true, message: '请输入序号' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item validateFirst label='描述' name='desc'>
            <Input.TextArea rows={5} placeholder='请输入描述' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Series;
