export interface MercadonaPriceInstructions {
  unit_size: number;
  size_format: string;
  bulk_price: string;
  unit_price: string;
  reference_price: string;
  reference_format: string;
  approx_size: boolean;
}

export interface MercadonaProduct {
  id: string;
  slug: string;
  display_name: string;
  packaging: string;
  thumbnail: string;
  share_url: string;
  price_instructions: MercadonaPriceInstructions;
}

export interface MercadonaCategory {
  id: number;
  name: string;
  order: number;
  products: MercadonaProduct[];
}

export interface CategoryInfo {
  id: number;
  name: string;
  icon: string;
}
