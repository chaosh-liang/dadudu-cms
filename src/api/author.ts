import Service from '../http';
const service = new Service();

const LOGIN = '/api/author/login'
const LOGOUT = '/api/author/logout'

export const login = (data: { user_name: string; password: string; }) => service.postData(LOGIN, data);
export const logout = () => service.getData(LOGOUT);

