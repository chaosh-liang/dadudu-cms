import Service from './http';
import type { CategoryT } from 'src/@types/category';
const service = new Service();

const CATEGORY_URL = '/api/category';

export const fetchAllCategory = () => service.getData(CATEGORY_URL);
export const fetchSeriesByCategoryId = (id: string) => service.getData(`${CATEGORY_URL}/${id}`);
