'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { checkoutOrder, getMyOrders } from '@/lib/api/order';

import { cartQueryKeys } from '@/lib/query/cart';

import { OrderQueryParams } from '@/types/order';

export function useCheckoutOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkoutOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKeys.all,
      });
    },
  });
}

export const orderQueryKeys = {
  all: ['orders'] as const,
  myOrders: (params?: OrderQueryParams) =>
    [...orderQueryKeys.all, 'my-orders', params] as const,
};

export function useMyOrders(params?: OrderQueryParams, enabled = true) {
  return useQuery({
    queryKey: orderQueryKeys.myOrders(params),
    queryFn: () => getMyOrders(params),
    enabled,
  });
}
