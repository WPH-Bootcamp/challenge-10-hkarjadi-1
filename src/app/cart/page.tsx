'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';

import {
  useCart,
  useClearCart,
  useDeleteCartItem,
  useUpdateCartItem,
} from '@/lib/query/cart';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CartPage() {
  const router = useRouter();

  const token = useAuthStore((state) => state.token);

  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const { data, isLoading, isError, refetch } = useCart(
    hasHydrated && Boolean(token)
  );

  const updateCartMutation = useUpdateCartItem();
  const deleteCartMutation = useDeleteCartItem();
  const clearCartMutation = useClearCart();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
    }
  }, [hasHydrated, router, token]);

  const cartData = data?.data;
  const cartGroups = cartData?.cart ?? [];
  const summary = cartData?.summary;

  function handleUpdateQuantity(itemId: number, quantity: number) {
    if (quantity < 1) {
      return;
    }

    updateCartMutation.mutate(
      {
        id: itemId,
        quantity,
      },
      {
        onSuccess: () => {
          toast.success('Quantity cart berhasil diperbarui');
        },
        onError: () => {
          toast.error('Gagal memperbarui quantity cart');
        },
      }
    );
  }

  function handleDeleteItem(itemId: number) {
    deleteCartMutation.mutate(itemId, {
      onSuccess: () => {
        toast.success('Item berhasil dihapus dari cart');
      },
      onError: () => {
        toast.error('Gagal menghapus item cart');
      },
    });
  }

  function handleClearCart() {
    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Cart berhasil dikosongkan');
      },
      onError: () => {
        toast.error('Gagal mengosongkan cart');
      },
    });
  }

  if (!hasHydrated) {
    return (
      <main className='min-h-screen bg-white px-6 py-10'>
        <p className='text-sm text-zinc-600'>Menyiapkan sesi login...</p>
      </main>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <main className='min-h-screen bg-white mt-20'>
      <Navbar />
      <section className='mx-auto max-w-6xl px-6 py-10'>
        <div className='mb-8 flex items-start justify-between gap-4'>
          <div>
            <h1 className='font-extrabold mt-2 text-2xl leading-9      text-neutral-950'>
              My Orders
            </h1>
          </div>

          <Button
            disabled={clearCartMutation.isPending}
            onClick={handleClearCart}
          >
            {clearCartMutation.isPending ? 'Deleting...' : 'Empty Cart'}
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className='p-6'>
              <p className='text-sm text-neutral-600'>Memuat cart...</p>
            </CardContent>
          </Card>
        ) : null}

        {isError ? (
          <Card className='border-red-200 bg-red-50'>
            <CardContent className='p-6'>
              <h2 className='font-semibold text-primary-100'>
                Gagal mengambil cart
              </h2>
              <p className='mt-2 text-sm text-primary-100'>
                Coba ulang request cart.
              </p>
              <Button className='mt-4' onClick={() => refetch()}>
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !isError && cartGroups.length === 0 ? (
          <Card>
            <CardContent className='p-6 text-center'>
              <h2 className='font-semibold text-zinc-950'>Cart masih kosong</h2>
              <p className='mt-2 text-sm text-zinc-600'>
                Pilih menu dari restoran terlebih dahulu sebelum checkout.
              </p>
              <Link href='/'>
                <Button className='mt-4'>Cari Restoran</Button>
              </Link>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !isError && cartGroups.length > 0 ? (
          <div className='grid gap-6 lg:grid-cols-[1fr_320px]'>
            <div className='space-y-4'>
              {cartGroups.map((group) => (
                <Card key={group.restaurant.id}>
                  <CardHeader>
                    <CardTitle>{group.restaurant.name}</CardTitle>
                  </CardHeader>

                  <CardContent className='space-y-4'>
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className='flex flex-col gap-4 border-t pt-4 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between'
                      >
                        <div>
                          <p className='font-medium text-zinc-950'>
                            {item.menu.foodName}
                          </p>
                          <p className='mt-1 text-sm text-zinc-500'>
                            {item.menu.type} - {formatRupiah(item.menu.price)}
                          </p>
                          <p className='mt-1 text-sm font-medium text-zinc-950'>
                            Total item: {formatRupiah(item.itemTotal)}
                          </p>
                        </div>

                        <div className='flex items-center gap-2'>
                          <Button
                            size='sm'
                            disabled={
                              updateCartMutation.isPending || item.quantity <= 1
                            }
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </Button>

                          <span className='w-8 text-center text-sm font-medium'>
                            {item.quantity}
                          </span>

                          <Button
                            size='sm'
                            disabled={updateCartMutation.isPending}
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>

                          <Button
                            size='sm'
                            disabled={deleteCartMutation.isPending}
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className='border-t pt-4 text-right text-sm font-semibold text-neutral-950'>
                      Subtotal restoran: {formatRupiah(group.subtotal)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className='h-fit'>
              <CardHeader>
                <CardTitle>Ringkasan</CardTitle>
              </CardHeader>

              <CardContent className='space-y-3'>
                <div className='flex justify-between text-sm text-zinc-600'>
                  <span>Total item</span>
                  <span>{summary?.totalItems ?? 0}</span>
                </div>

                <div className='flex justify-between text-sm text-zinc-600'>
                  <span>Restoran</span>
                  <span>{summary?.restaurantCount ?? 0}</span>
                </div>

                <div className='border-t pt-3'>
                  <div className='flex justify-between font-semibold text-zinc-950'>
                    <span>Total</span>
                    <span>{formatRupiah(summary?.totalPrice ?? 0)}</span>
                  </div>
                </div>

                <Link href='/checkout'>
                  <Button className='w-full'>Checkout</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </section>
      <Footer />
    </main>
  );
}
