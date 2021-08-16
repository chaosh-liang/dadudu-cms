import Service from './http';
const service = new Service();

const CATEGORY_URL = '/api/category';
const SERIES_URL = '/api/category/s';

export const fetchCategories = () => service.getData(CATEGORY_URL);
export const fetchSeriesByCategoryId = (id: string) => service.getData(`${CATEGORY_URL}/${id}`);
export const fetchSeries = (category_id: string) => service.getData(`${SERIES_URL}/${category_id}`);
