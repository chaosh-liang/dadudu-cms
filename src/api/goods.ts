import Service from './http';
import type { goodsType } from 'src/@types/goods';
const service = new Service();

const ALL_GOODS = '/api/goods';
const ADD_GOODS = '/api/goods/add';
const UPDATE_GOODS = '/api/goods/update';
const DELETE_GOODS = '/api/goods/delete';

export const fetchAllGoods = (data: {
  page_index: number;
  page_size: number;
}) => service.postData(ALL_GOODS, data);

export const addGoods = (data: goodsType) => service.postData(ADD_GOODS, data);

export const editGoods = (data: Partial<goodsType>) =>
  service.putData(UPDATE_GOODS, data);

export const deleteGoods = (data: { ids: string[] }) =>
  service.delData(DELETE_GOODS, { data });
