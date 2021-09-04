import React, { FC, useRef, useState } from 'react';
import { Button, Input, message } from 'antd';
import styles from './Upload.module.scss';
import { upload } from 'src/api/shared';

interface LocalProps {
  filePath: string;
  labelWidth?: number;
  maxSize?: number;
  labelText?: string;
  uploadSuccess?: (...args: any[]) => void;
}

const Upload: FC<LocalProps> = (props) => {
  const fileInputEl = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // 触发-选取图片
  const pickupFile = () => {
    fileInputEl.current?.click();
  };
  // 选取图片
  /* interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
  }
  用此接口作为类型，报不兼容错误
  */
  const fileChangeEvent = (ev: any) => {
    console.log('fileChangeEvent => ', ev);
    const imgFile = ev?.target?.files?.[0];
    if (imgFile) {
      const { size, type } = imgFile;
      const typeReg = /(png|jpe?g\s*)$/;
      if (!typeReg.test(type)) {
        message.error('请上传以下格式的图片：jpg/jpeg/png');
      } else if (props.maxSize && size / 1000 > props.maxSize) {
        message.error(`大小不超过 ${props.maxSize}kb`);
      } else {
        setFile(imgFile); // 保存文件对象
        message.info('图片准备就绪');
      }
    }
  };
  // 上传文件到服务器
  const uploadFile = () => {
    if (file) {
      const formData = new FormData();
      formData.append('picture', file);

      upload(formData)
        .then((res: any) => {
          console.log('上传文件 => ', res);
          // if (res && res.error_code === '00') {
          //   const imgName = (res.data || {}).filename || '';
          //   message.success('图片上传成功');
          //   if (props.uploadSuccess) uploadSuccess(imgName);
          // }
        })
        .catch((reason: any) => {
          console.log('上传文件错误 => ', reason);
          message.error('图片上传失败，请检查网络');
        });
    } else {
      message.error('请先选取图片');
    }
  };
  return (
    <div className={styles.upload}>
      <div className={styles.layout}>
        {props.labelText ? (
          <div
            className={styles.label}
            style={{ width: `${props.labelWidth ?? 100}px` }}
          >
            {props.labelText}
          </div>
        ) : null}
        <div className={styles['iput-group']}>
          <Input
            title={props.filePath}
            className={styles['icon-name']}
            value={props.filePath}
            readOnly
            placeholder='请先上传服务器'
          />
          <input
            type='file'
            className={styles['icon-file']}
            ref={fileInputEl}
            onChange={fileChangeEvent}
            accept='image/jpeg, image/png'
          />
        </div>
        <div className={styles['btn-group']}>
          <Button type='primary' size='small' onClick={pickupFile}>
            读取
          </Button>
          <Button type='primary' size='small' onClick={uploadFile}>
            上传服务器
          </Button>
        </div>
      </div>
    </div>
  );
};

Upload.defaultProps = {
  filePath: '',
};

export default Upload;
