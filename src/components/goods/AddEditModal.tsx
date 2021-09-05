import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Cascader, Form, Input, InputNumber, message, Modal, Radio } from 'antd';
import type { GoodsT } from 'src/@types/goods';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { RootState } from 'src/store/index';
import { CascaderValueType } from 'antd/lib/cascader';
import LocalUpload from 'src/components/common/upload/Upload';
import styles from './AddEditModal.module.scss';

interface LocalProps {
  mode: number;
  visible: boolean;
  hideAEModal: Function;
  data: GoodsT | null;
}

const AEModal: FC<LocalProps> = (props) => {
  // const [formData] = useState(props.data);
  const [iconUrl, setIconUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState<string[]>(['']);
  const [descUrl, setDescUrl] = useState<string[]>(['']);

  // 类别&系列数据
  const categoryData = useSelector(
    (state: RootState) => state.goodsinfo.category
  );

  const uploadIconSuccess = (path: string) => {
    console.log('uploadIconSuccess => ', path);
    setIconUrl(path);
  };

  // 描述图片，上传后的回调
  const uploadBannerSuccess = (path: string, index: number) => {
    console.log('uploadBannerSuccess => ', path, index);
    const curBannerUrl = [...bannerUrl];
    curBannerUrl.splice(index, 1, path);
    setBannerUrl(curBannerUrl);
  };

  // 添加描述图片选项
  const addBannerField = () => {
    setBannerUrl([...bannerUrl, '']);
  };

  // 删除描述图片选项
  const removeBannerField = (index: number) => {
    // console.log('removeBannerField => ', index);
    if (index === 0) {
      message.warning('至少需要一张轮播图');
      return;
    }
    const copy = [...bannerUrl];
    copy.splice(index, 1);
    setBannerUrl(copy);
  };

  // 描述图片，上传后的回调
  const uploadDescSuccess = (path: string, index: number) => {
    console.log('uploadBannerSuccess => ', path, index);
    const curBannerUrl = [...bannerUrl];
    curBannerUrl.splice(index, 1, path);
    setBannerUrl(curBannerUrl);
  };

  // 添加描述图片选项
  const addDescField= () => {
    setDescUrl([...descUrl, '']);
  };

  // 删除描述图片选项
  const removeDescField = (index: number) => {
    // console.log('removeDescField => ', index);
    const copy = [...descUrl];
    copy.splice(index, 1);
    setDescUrl(copy);
  };

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
            label='类别系列'
            name='series_id'
            rules={[{ required: true, message: '请选择所属类别和所属系列' }]}
          >
            <Cascader
              options={categoryData}
              onChange={onCascaderChange}
              placeholder='Please select'
            />
          </Form.Item>
          <Form.Item label='缩略图' name='icon_url' rules={[{ required: true, message: '请上传一张缩略图' }]}>
            <LocalUpload filePath={iconUrl} uploadSuccess={uploadIconSuccess} />
          </Form.Item>
          <Form.Item label='轮播图片' name='banner_url' rules={[{ required: true, message: '至少上传一张轮播图' }]}>
            <div className={styles['banner-box']}>
              {bannerUrl.map((url, i) => (
                <div className={styles['upload-box']} key={`${url}${i}`}>
                  <LocalUpload
                    filePath={url}
                    uploadSuccess={(path) => uploadBannerSuccess(path, i)}
                  /><MinusCircleOutlined
                    onClick={() => removeBannerField(i)}/>
                </div>
              ))}

              <Button
                type='dashed'
                onClick={addBannerField}
                style={{ width: '50%' }}
                icon={<PlusOutlined />}
              >
                添加轮播图选项
              </Button>
            </div>
          </Form.Item>
          <Form.Item label='描述图片' name='desc_url'>
            <div className={styles['descurl-box']}>
              {descUrl.map((url, i) => (
                <div className={styles['upload-box']} key={`${url}${i}`}>
                  <LocalUpload
                    filePath={url}
                    uploadSuccess={(path) => uploadDescSuccess(path, i)}
                  />
                  {/* 允许删除所有选项，不需判断 descUrl.length > 1 */}
                  <MinusCircleOutlined
                    onClick={() => removeDescField(i)}
                  />
                </div>
              ))}

              <Button
                type='dashed'
                onClick={addDescField}
                style={{ width: '50%' }}
                icon={<PlusOutlined />}
              >
                添加描述图选项
              </Button>
            </div>
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
