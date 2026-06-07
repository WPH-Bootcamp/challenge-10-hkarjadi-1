export type CheckoutItem = {
  menuId: number;
  quantity: number;
};

export type CheckoutRestaurant = {
  restaurantId: number;
  items: CheckoutItem[];
};

export type CheckoutPayload = {
  restaurants: CheckoutRestaurant[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
};

export type CheckoutResponse = {
  success: boolean;
  message: string;
  data: unknown;
};

export type OrderQueryParams = {
  status?: string;
  page?: number;
  limit?: number;
};

export type OrderPricing = {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  totalPrice: number;
};

export type OrderRestaurantInfo = {
  id: number;
  name: string;
  logo: string;
};

export type OrderMenuItem = {
  menuId: number;
  menuName: string;
  price: number;
  image: string;
  quantity: number;
  itemTotal: number;
};

export type OrderRestaurantGroup = {
  restaurant: OrderRestaurantInfo;
  items: OrderMenuItem[];
  subtotal: number;
};

export type OrderHistoryItem = {
  id: number;
  transactionId: string;
  status: string;
  paymentMethod: string;
  deliveryAddress: string;
  phone: string;
  pricing: OrderPricing;
  restaurants: OrderRestaurantGroup[];
  createdAt: string;
  updatedAt: string;
};

export type OrderHistoryData = {
  orders: OrderHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filter: {
    status: string | null;
  };
};

export type OrderHistoryResponse = {
  success: boolean;
  message: string;
  data: OrderHistoryData;
};
