'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';

import { useMyOrders } from '@/lib/query/order';
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function OrdersPage() {
  const router = useRouter();

  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const { data, isLoading, isError, refetch } = useMyOrders(
    {
      page: 1,
      limit: 10,
    },
    hasHydrated && Boolean(token)
  );

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
    }
  }, [hasHydrated, router, token]);

  if (!hasHydrated) {
    return (
      <main className='min-h-screen bg-white mt-20 px-6 py-10'>
        <p className='text-sm text-zinc-600'>Menyiapkan sesi login...</p>
      </main>
    );
  }

  if (!token) {
    return null;
  }

  const orderData = data?.data;
  const orders = orderData?.orders ?? [];

  return (
    <main className='min-h-screen bg-zinc-50'>
      <Navbar />
      <section className='mx-auto max-w-6xl px-6 py-10'>
        <div className='mb-8'>
          <p className='text-sm font-medium text-zinc-500'>Riwayat Pesanan</p>
          <h1 className='mt-2 text-3xl font-semibold text-zinc-950'>Orders</h1>
          <p className='mt-3 text-sm text-zinc-600'>
            Di halaman ini user melihat pesanan yang pernah dibuat.
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className='p-6'>
              <p className='text-sm text-zinc-600'>Memuat history pesanan...</p>
            </CardContent>
          </Card>
        ) : null}

        {isError ? (
          <Card className='border-red-200 bg-red-50'>
            <CardContent className='p-6'>
              <h2 className='font-semibold text-red-700'>
                Gagal mengambil history pesanan
              </h2>
              <p className='mt-2 text-sm text-red-600'>
                Coba ulang request history.
              </p>
              <Button
                className='mt-4'
                variant='outline'
                onClick={() => refetch()}
              >
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !isError && orders.length === 0 ? (
          <Card>
            <CardContent className='p-6 text-center'>
              <h2 className='font-semibold text-zinc-950'>Belum ada pesanan</h2>
              <p className='mt-2 text-sm text-zinc-600'>
                Pesanan yang sudah checkout akan muncul di sini.
              </p>
              <Link href='/'>
                <Button className='mt-4'>Cari Restoran</Button>
              </Link>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !isError && orders.length > 0 ? (
          <div className='space-y-5'>
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                    <div>
                      <CardTitle>{order.transactionId}</CardTitle>
                      <p className='mt-2 text-sm text-zinc-500'>
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span className='w-fit rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700'>
                      {order.status}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className='space-y-5'>
                  <div className='grid gap-3 rounded-md border bg-zinc-50 p-4 text-sm text-zinc-600 sm:grid-cols-2'>
                    <div>
                      <p className='font-medium text-zinc-950'>
                        Alamat Pengiriman
                      </p>
                      <p className='mt-1'>{order.deliveryAddress}</p>
                    </div>

                    <div>
                      <p className='font-medium text-zinc-950'>Pembayaran</p>
                      <p className='mt-1'>{order.paymentMethod}</p>
                      <p className='mt-1'>{order.phone}</p>
                    </div>
                  </div>

                  {order.restaurants.map((group) => (
                    <div key={group.restaurant.id} className='space-y-3'>
                      <p className='font-semibold text-zinc-950'>
                        {group.restaurant.name}
                      </p>

                      <div className='space-y-2'>
                        {group.items.map((item) => (
                          <div
                            key={item.menuId}
                            className='flex justify-between gap-4 text-sm text-zinc-600'
                          >
                            <span>
                              {item.quantity}x {item.menuName}
                            </span>
                            <span>{formatRupiah(item.itemTotal)}</span>
                          </div>
                        ))}
                      </div>

                      <div className='border-t pt-3 text-right text-sm font-medium text-zinc-950'>
                        Subtotal: {formatRupiah(group.subtotal)}
                      </div>
                    </div>
                  ))}

                  <div className='space-y-2 border-t pt-4 text-sm'>
                    <div className='flex justify-between text-zinc-600'>
                      <span>Subtotal</span>
                      <span>{formatRupiah(order.pricing.subtotal)}</span>
                    </div>
                    <div className='flex justify-between text-zinc-600'>
                      <span>Service fee</span>
                      <span>{formatRupiah(order.pricing.serviceFee)}</span>
                    </div>
                    <div className='flex justify-between text-zinc-600'>
                      <span>Delivery fee</span>
                      <span>{formatRupiah(order.pricing.deliveryFee)}</span>
                    </div>
                    <div className='flex justify-between text-base font-semibold text-zinc-950'>
                      <span>Total</span>
                      <span>{formatRupiah(order.pricing.totalPrice)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </section>
      <Footer />
    </main>
  );
}
