import axios, { AxiosResponse, AxiosInstance } from 'axios';

const TIMEOUT = 10000;
const BASE_URL = 'http://127.0.0.1:7716';

class CustomAxios {
  private static instance: CustomAxios;
  private axiosInst: AxiosInstance;

  private constructor() {
    this.axiosInst = axios.create({ baseURL: BASE_URL, timeout: TIMEOUT });
    this.setAxiosInterceptors();
  }
  
  // CustomAxios 单例模式
  public static getInstance() {
    if (!CustomAxios.instance) {
      CustomAxios.instance = new CustomAxios();
    }
    return CustomAxios.instance;
  }
  
  // 初始化拦截器
  private setAxiosInterceptors() {
    // 设置请求头
    this.axiosInst.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    this.axiosInst.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

    // 响应拦截器
    this.axiosInst.interceptors.response.use(
      // 请求成功
      (res: AxiosResponse) => {
        // LoadingInstance.close();
        if (res.status === 200) {
          return Promise.resolve(res.data);
        }
        return Promise.reject(res);
      },
      // 请求失败
      (error: any) => {
        const { response } = error;
        if (response) {
          // 请求已发出，但是不在2xx的范围
          this.errorHandle(response);
        }
        console.error('接口请求出错', error);
        // LoadingInstance.close();
        return Promise.reject(error);
      }
    );
  }

  // axios 实例
  public getAxiosInstance() {
    return this.axiosInst;
  }

  /**
   * http握手错误
   * @param res  响应回调,根据不同响应进行不同操作
   */
  private errorHandle(res: any) {
    // 状态码判断
    switch (res.status) {
      case 401:
        console.error('401');
        window.top.location.href = '/page/authority/login/login.html'; // 登录界面
        break;
      case 403: // 密码过期/此接口无权限
        console.error('无权限');
        break;
      case 500:
        console.error('服务器错误');
        break;
      default:
        console.error('服务器错误');
        break;
    }
  }
}

// 工厂模式
const createAxios = () => CustomAxios.getInstance().getAxiosInstance();

export default createAxios;
