import type { SeriesT } from './series';
export interface CategoryT extends Record<string, any> {
  _id?: string;
  name: string;
  desc: string;
  no: number;
  icon_url: string;
  series_data: SeriesT[];
  create_time?: string;
  update_time?: string;
};
