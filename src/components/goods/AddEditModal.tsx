import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import type { GoodsT } from 'src/@types/goods';
import type { RootState } from 'src/store/index';
import type { CategoryT } from 'src/@types/category';
import type { SeriesT } from 'src/@types/series';
import styles from './AddEditModal.module.scss';

interface LocalProps {
  mode: number;
  visible: boolean;
  hideAEModal: Function;
  data: GoodsT | null;
}

const AEModal: FC<LocalProps> = (props) => {
  // const [formData] = useState(props.data);

  const categoryData = useSelector(
    (state: RootState) => state.goodsinfo.category
  );
  const [seriesData, setSeriesData] = useState<SeriesT[]>([]);
  const [seriesValue, setSeriesValue] = useState<string>('')
  // 初始化，会变化，然后赋值
  useEffect(() => {
    if (categoryData.length) {
      setSeriesData(categoryData[0].series_data);
      setSeriesValue(categoryData[0].series_data[0]?._id ?? '');
    }
  }, [categoryData]);

  // 类别改变时
  const handleCategoryChange = (value: string) => {
    const curCategory = categoryData.find(
      (item: CategoryT) => item._id === value
    );
    setSeriesData(curCategory.series_data);
    setSeriesValue(curCategory.series_data[0]?._id);
    // console.log('handleCategoryChange => ', value, curCategory, seriesData, seriesValue);
  };
  // 系列改变时
  const handleSeriesChange = (value: string) => {
    console.log('handleSeriesChange => ', value);
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
        width={800}
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
          size="small"
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
          <Form.Item label='所属类别' name='category_id'>
            <Select
              defaultValue={categoryData[0]?.key}
              style={{ width: 120 }}
              onChange={handleCategoryChange}
            >
              {categoryData.map((c: CategoryT) => (
                <Select.Option key={c.key} value={c.key}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='所属系列' name='series_id'>
            <Select
              value={seriesValue}
              style={{ width: 120 }}
              onChange={handleSeriesChange}
            >
              {seriesData.map((s: SeriesT) => (
                <Select.Option key={s._id} value={s._id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
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
