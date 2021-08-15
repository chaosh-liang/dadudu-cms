import { Interceptors } from './interceptor';
import { message } from 'antd';

export default class HttpService {
  private axios: any;

  constructor() {
    this.axios = new Interceptors().getInterceptors();
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

  public resultHandle(res: any, resolve: any) {
    if (res.error_code === '00') {
      resolve(res.data);
    } else {
      this.errorHandle(res);
    }
  }

  public errorHandle(res: any) {
    message.error(res.error_msg);
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
