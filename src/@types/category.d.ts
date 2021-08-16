import type { SeriesT } from './series';
export interface CategoryT {
  _id: string;
  name: string;
  desc: string;
  order: number;
  icon_url: string;
  series_data: SeriesT[];
};

export interface CatetoryClientT extends CategoryT {
  key?: number;
  series_count: number;
}
