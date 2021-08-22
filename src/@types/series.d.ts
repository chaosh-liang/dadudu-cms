import type { GoodsT } from './goods'

export interface SeriesT extends Record<string, any> {
  _id: string;
  name: string;
  category_id: string;
  no: number;
  icon_url: string;
  goods_data: GoodsT[]
  create_time?: string;
  update_time?: string;
}
