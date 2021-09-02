import createAxios from './axios_custom';
import { message } from 'antd';
import { LocalResponseType } from 'src/@types/shared';

export default class Service {
  private axios: any;

  constructor() {
    this.axios = createAxios();
  }

  /**
   * 
   * @returns axios 实例
   * @note 此方法用来测试 axios 是否为单例
   * @note 在某个地方创建两个 Service 类的实例，如
   * @example
   *  const service1 = new Service();
   *  const service1 = new Service();
   *  console.log(service1.getAxiosInst() === service2.getAxiosInst());
   */
  public getAxiosInst() {
    return this.axios;
  }

  public getData(url: string, params?: any) {
    return new Promise((resolve, reject) => {
      this.axios
        .get(url, params)
        .then((res: any) => {
          this.resultHandle(res, resolve);
        })
        .catch((err: any) => {
          reject(err.message);
        });
    });
  }

  public postData(url: string, params: any) {
    return new Promise((resolve, reject) => {
      this.axios
        .post(url, params)
        .then((res: any) => {
          this.resultHandle(res, resolve);
        })
        .catch((err: any) => {
          reject(err.message);
        });
    });
  }

  public putData(url: string, params: any) {
    return new Promise((resolve, reject) => {
      this.axios
        .put(url, params)
        .then((res: any) => {
          this.resultHandle(res, resolve);
        })
        .catch((err: any) => {
          reject(err.message);
        });
    });
  }

  public delData(url: string, params: any) {
    return new Promise((resolve, reject) => {
      this.axios
        .delete(url, params)
        .then((res: any) => {
          this.resultHandle(res, resolve);
        })
        .catch((err: any) => {
          reject(err.message);
        });
    });
  }

  public resultHandle(res: LocalResponseType, resolve: any) {
    // console.log('resultHandle => ', res);
    if (`${res.error_code}` === '00') {
      resolve(res);
    } else {
      this.errorHandle(res);
    }
  }

  /**
   * 
   * @param res 所有请求的错误信息都集中在此处理了
   * @conclusion 除了 需要 catch axios 遇到的网络故障错误之外，
   * @conclusion 返回到各自组件内的结果，都是走正确的分支了。
   */
  public errorHandle(res: LocalResponseType) {
    // console.log('errorHandle => ', res);
    if (typeof res?.error_msg === 'string') {
      message.error(`错误信息：${res?.error_msg}`);
    } else {
      message.error(`错误信息：${res?.error_msg?.message}`);
    }
    // 状态码判断
    // switch (res.error_code) {
    //     case 99:
    //         break;
    //     case -152:
    //         break;
    //     default:
    //     // console.log(other);
    // }
  }
}
