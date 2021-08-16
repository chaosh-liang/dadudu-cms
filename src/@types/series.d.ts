import type { GoodsT } from './goods'

export interface SeriesT {
  _id: string;
  name: string;
  category_id: string;
  icon_url: string;
  goods_data: GoodsT[]
}

export interface SeriesClientT extends SeriesT {
  key?: number;
  sequence: number;
  goods_count: number;
}

