export type PriceRange = {
  min: number;
  max: number;
};

export type Restaurant = {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  category: string;
  reviewCount: number;
  menuCount: number;
  priceRange: PriceRange;
};

export type RestaurantQueryParams = {
  q?: string;
  location?: string;
  range?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type RestaurantListResponse = {
  success: boolean;
  message: string;
  data: {
    restaurants: Restaurant[];
    pagination: Pagination;
    filters: {
      range: string | null;
      priceMin: number | null;
      priceMax: number | null;
      rating: number | null;
      category: string | null;
    };
  };
};

export type RestaurantMenu = {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
};

export type RestaurantReview = {
  id: number;
  star: number;
  comment: string;
  user?: {
    name?: string;
  };
};

export type RestaurantDetail = {
  id: number;
  name: string;
  star: number;
  averageRating: number;
  place: string;
  coordinates: {
    lat: number;
    long: number;
  };
  logo: string;
  images: string[];
  category: string;
  totalMenus: number;
  totalReviews: number;
  menus: RestaurantMenu[];
  reviews: RestaurantReview[];
};

export type RestaurantDetailResponse = {
  success: boolean;
  message: string;
  data: RestaurantDetail;
};
