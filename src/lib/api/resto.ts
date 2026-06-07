import { api } from './axios';
import {
  RestaurantListResponse,
  RestaurantQueryParams,
  RestaurantDetailResponse,
} from '@/types/restaurant';

export async function getRestaurants(params?: RestaurantQueryParams) {
  const response = await api.get<RestaurantListResponse>('/api/resto', {
    params,
  });

  return response.data;
}

export async function getRestaurantDetail(id: string) {
  const response = await api.get<RestaurantDetailResponse>(`/api/resto/${id}`, {
    params: {
      limitMenu: 20,
      limitReview: 10,
    },
  });

  return response.data;
}

export async function searchRestaurants(params?: RestaurantQueryParams) {
  const response = await api.get<RestaurantListResponse>('/api/resto/search', {
    params,
  });

  return response.data;
}
