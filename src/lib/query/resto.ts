'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getRestaurantDetail,
  getRestaurants,
  searchRestaurants,
} from '@/lib/api/resto';

import { RestaurantQueryParams } from '@/types/restaurant';

export const restoQueryKeys = {
  all: ['resto'] as const,

  list: (params?: RestaurantQueryParams) =>
    [...restoQueryKeys.all, 'list', params] as const,

  detail: (id: string) => [...restoQueryKeys.all, 'detail', id] as const,

  search: (params?: RestaurantQueryParams) =>
    [...restoQueryKeys.all, 'search', params] as const,
};

export function useRestaurants(params?: RestaurantQueryParams) {
  return useQuery({
    queryKey: restoQueryKeys.list(params),

    queryFn: () => getRestaurants(params),
  });
}

export function useRestaurantDetail(id: string) {
  return useQuery({
    queryKey: restoQueryKeys.detail(id),
    queryFn: () => getRestaurantDetail(id),

    enabled: Boolean(id),
  });
}

export function useSearchRestaurants(params?: RestaurantQueryParams) {
  return useQuery({
    queryKey: restoQueryKeys.search(params),
    queryFn: () => searchRestaurants(params),
    enabled: Boolean(params?.q),
  });
}

export function useRestaurantResults(params?: RestaurantQueryParams) {
  const hasSearch = Boolean(params?.q?.trim());

  return useQuery({
    queryKey: hasSearch
      ? restoQueryKeys.search(params)
      : restoQueryKeys.list(params),
    queryFn: () =>
      hasSearch ? searchRestaurants(params) : getRestaurants(params),
  });
}
