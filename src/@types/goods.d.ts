export interface BannerDescUrlType {
  _id?: string;
  path: string;
}

export interface GoodsT extends Record<string, any> {
  _id?: string;
  name: string;
  desc: string;
  icon_url: string;
  price: number;
  series_id: string;
  category_id: string;
  home_banner: boolean;
  discount_price: number;
  discount_threshold: number;
  home_display: boolean;
  currency_unit: string;
  count_unit: string;
  desc_url: BannerDescUrlType[];
  banner_url: BannerDescUrlType[];
  create_time?: string;
  update_time?: string;
}
