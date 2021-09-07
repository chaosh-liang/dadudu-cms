import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import type { ColumnType } from 'rc-table/lib/interface';
import {
  Space,
  Button,
  Table,
  Popconfirm,
  message,
  Form,
  Modal,
  Input,
} from 'antd';
import styles from './Category.module.scss';
import type { RootState } from 'src/store/index';
import type { CategoryT } from 'src/@types/category';

const Category: FC<RouteComponentProps> = (props) => {
  const {
    match: { path },
  } = props;
  // 表格列定义
  const columns: ColumnType<CategoryT>[] = [
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
        <Link title='跳转至系列' to={`${path}/${record._id}`}>
          {text}
        </Link>
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
      render: (text: string, record: CategoryT) => (
        <Space size='small'>
          <Button className={styles['operation-btn']} type='link' onClick={() => editCategory(record)}>
            编辑
          </Button>

          {record.series_count <= 0 ? (
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

  const initAecData: CategoryT = {
    name: '',
    desc: '',
    no: 1,
    icon_url: '',
    series_data: [],
  };

  const [aecMode, setAECMode] = useState<number>(1);
  const [aecData, setAECData] = useState<CategoryT>(initAecData);
  const [aecVisible, setAECVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // console.log('category useEffect');
    if (aecVisible) {
      const { name, desc } = aecData;
      form.setFieldsValue({ name, desc });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aecVisible])

  // 从 store 中获取类别数据
  const categoryData = useSelector((state: RootState) => {
    const {
      goodsinfo: { category },
    } = state;
    category.forEach((item: CategoryT) => {
      if (Reflect.has(item, 'children'))
        Reflect.deleteProperty(item, 'children');
    });
    return category;
  });

  // 添加
  const addCategory = () => {
    // console.log('addCategory');
    setAECMode(1);
    setAECData(initAecData);
    setAECVisible(true);
  };

  // 编辑
  const editCategory = (record: CategoryT) => {
    // console.log('editCategory => ', record);
    setAECMode(2);
    setAECData(record);
    setAECVisible(true);
  };

  // TODO: 保存
  const handleSave = () => {
    console.log('handleSave');
  };

  // 取消
  const handleCancel = () => {
    console.log('handleCancel');
    setAECData(initAecData);
    setAECVisible(false);
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
        <h4 className={styles.title}>类别</h4>
        <div>
          <Button type='primary' size='middle' onClick={addCategory}>
            添加
          </Button>
        </div>
      </header>
      <section className={styles.section}>
        <Table
          size='middle'
          columns={columns}
          dataSource={categoryData}
          pagination={false}
        />
      </section>
      <Modal
        width={520}
        destroyOnClose
        getContainer={false} // 挂载在当前 div 节点下，而不是 document.body
        title={aecMode === 1 ? '添加类别' : '编辑类别'}
        okText={aecMode === 1 ? '提交' : '保存'}
        cancelText='取消'
        visible={aecVisible}
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
            label='类别名称'
            name='name'
            rules={[
              { required: true, message: '请输入类别名称' },
              { type: 'string', whitespace: true, message: '不能只输入空格符' },
            ]}
          >
            <Input placeholder='请输入类别名称' />
          </Form.Item>
          <Form.Item
            validateFirst
            label='类别描述'
            name='desc'
            rules={[{ required: true, message: '请输入类别描述' }]}
          >
            <Input.TextArea rows={5} placeholder='请输入类别描述' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Category;
