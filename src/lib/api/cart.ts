import { api } from './axios';
import { AddCartPayload, CartResponse, UpdateCartPayload } from '@/types/cart';

export async function getCart() {
  const response = await api.get<CartResponse>('/api/cart');

  return response.data;
}

export async function addToCart(payload: AddCartPayload) {
  const response = await api.post<CartResponse>('/api/cart', payload);

  return response.data;
}

export async function updateCartItem(id: number, payload: UpdateCartPayload) {
  const response = await api.put<CartResponse>(`/api/cart/${id}`, payload);

  return response.data;
}

export async function deleteCartItem(id: number) {
  const response = await api.delete<CartResponse>(`/api/cart/${id}`);

  return response.data;
}

export async function clearCart() {
  const response = await api.delete<CartResponse>('/api/cart');

  return response.data;
}
