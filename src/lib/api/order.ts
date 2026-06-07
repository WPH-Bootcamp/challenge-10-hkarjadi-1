import { api } from './axios';
import {
  CheckoutPayload,
  CheckoutResponse,
  OrderHistoryResponse,
  OrderQueryParams,
} from '@/types/order';

export async function checkoutOrder(payload: CheckoutPayload) {
  const response = await api.post<CheckoutResponse>(
    '/api/order/checkout',
    payload
  );

  return response.data;
}

export async function getMyOrders(params?: OrderQueryParams) {
  const response = await api.get<OrderHistoryResponse>('/api/order/my-order', {
    params,
  });

  return response.data;
}
