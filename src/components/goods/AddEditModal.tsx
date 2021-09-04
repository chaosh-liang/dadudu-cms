import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Cascader, Form, Input, InputNumber, Modal, Radio } from 'antd';
import type { GoodsT } from 'src/@types/goods';
import type { RootState } from 'src/store/index';
import { CascaderValueType } from 'antd/lib/cascader';
import LocalUpload from 'src/components/common/upload/Upload'
import styles from './AddEditModal.module.scss';

interface LocalProps {
  mode: number;
  visible: boolean;
  hideAEModal: Function;
  data: GoodsT | null;
}

const AEModal: FC<LocalProps> = (props) => {
  // const [formData] = useState(props.data);
  const [iconUrl, setIconUrl] = useState('')

  // 类别&系列数据
  const categoryData = useSelector(
    (state: RootState) => state.goodsinfo.category
  );

  const uploadIconSuccess = (path: string) => {
    console.log('uploadIconSuccess => ', path);
    setIconUrl(path);
  }

  // 级联选择
  const onCascaderChange = (value: CascaderValueType) => {
    console.log('onCascaderChange => ', value);
  };

  // 保存：确定
  const handleSave = () => {
    console.log('handleSave');
  };

  // 保存：取消
  const handleCancel = () => {
    console.log('handleCancel');
    props.hideAEModal();
  };

  return (
    <div className={styles.container}>
      <Modal
        width={900}
        destroyOnClose
        getContainer={false} // 挂载在当前 div 节点下，而不是 document.body
        title={props.mode === 1 ? '添加商品' : '编辑商品'}
        okText={props.mode === 1 ? '提交' : '保存'}
        cancelText='取消'
        visible={props.visible}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Form
          size='middle'
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          autoComplete='off'
        >
          <Form.Item
            label='商品名称'
            name='name'
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='商品价格'
            name='price'
            rules={[{ required: true, message: '请输入商品价格' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label='折扣数量'
            name='discount_threshold'
            rules={[{ required: true, message: '到达一定数量后享受折扣价' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label='折后价格'
            name='discount_price'
            rules={[{ required: true, message: '请输入折扣价' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label='数量单位'
            name='count_unit'
            rules={[{ required: true, message: '请输入商品计量单位' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label='货币种类'
            name='currency_unit'
            rules={[{ required: true, message: '请输入商品货币种类' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item label='主页轮播' name='home_banner'>
            <Radio.Group name='home_banner_radio_group' defaultValue={false}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label='主页显示' name='home_display'>
            <Radio.Group name='home_display_radio_group' defaultValue={false}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label='类别和系列'
            name='series_id'
            rules={[{ required: true, message: '请选择所属类别和所属系列' }]}
          >
            <Cascader
              options={categoryData}
              onChange={onCascaderChange}
              placeholder='Please select'
            />
          </Form.Item>
          <Form.Item label='商品图标' name='icon_url'>
            <LocalUpload filePath={iconUrl} uploadSuccess={uploadIconSuccess} />
          </Form.Item>
          <Form.Item
            label='商品描述'
            name='desc'
            rules={[{ required: true, message: '请输入商品描述' }]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AEModal;
