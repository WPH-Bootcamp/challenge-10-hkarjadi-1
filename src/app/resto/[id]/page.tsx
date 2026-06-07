'use client';

import Image from 'next/image';
import { toast } from 'sonner';

import { Navbar } from '@/components/shared/navbar';

import { useAddToCart } from '@/lib/query/cart';
import { useAuthStore } from '@/store/auth-store';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useRestaurantDetail } from '@/lib/query/resto';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RestaurantDetailPage() {
  const params = useParams<{ id: string }>();
  const restaurantId = params.id;

  const router = useRouter();

  const token = useAuthStore((state) => state.token);

  const addToCartMutation = useAddToCart();

  const { data, isLoading, isError, refetch } =
    useRestaurantDetail(restaurantId);

  const restaurant = data?.data;

  if (isLoading) {
    return (
      <main className='min-h-screen bg-zinc-50 px-6 py-10'>
        <div className='mx-auto max-w-6xl'>
          <div className='h-72 animate-pulse rounded-lg bg-zinc-200' />
          <div className='mt-6 h-8 w-64 animate-pulse rounded bg-zinc-200' />
          <div className='mt-4 h-4 w-96 animate-pulse rounded bg-zinc-200' />
        </div>
      </main>
    );
  }

  if (isError || !restaurant) {
    return (
      <main className='min-h-screen bg-white mt-20 px-6 py-10'>
        <div className='mx-auto max-w-6xl rounded-md border border-red-200 bg-red-50 p-6'>
          <h1 className='font-semibold text-red-700'>
            Gagal mengambil detail restoran
          </h1>
          <p className='mt-2 text-sm text-red-600'>
            Coba ulang request atau kembali ke halaman utama.
          </p>
          <div className='mt-4 flex gap-3'>
            <Button variant='outline' onClick={() => refetch()}>
              Coba Lagi
            </Button>
            <Link href='/'>
              <Button>Kembali</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const restaurantNumericId = restaurant.id;

  function handleAddToCart(menuId: number) {
    if (!token) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }

    addToCartMutation.mutate(
      {
        restaurantId: restaurantNumericId,
        menuId,
        quantity: 1,
      },
      {
        onSuccess: () => {
          toast.success('Menu berhasil ditambahkan ke cart');
        },
        onError: () => {
          toast.error('Gagal menambahkan menu ke cart');
        },
      }
    );
  }

  return (
    <main className='min-h-screen bg-zinc-50'>
      <Navbar />
      <section className='mx-auto max-w-6xl px-6 py-10'>
        <div className='overflow-hidden rounded-lg border bg-white'>
          <div className='relative h-72 w-full bg-zinc-100'>
            <Image
              src={restaurant.images[0] ?? restaurant.logo}
              alt={restaurant.name}
              fill
              priority
              className='object-cover'
            />
          </div>

          <div className='p-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <p className='text-sm font-medium text-zinc-500'>
                  {restaurant.category}
                </p>
                <h1 className='mt-2 text-3xl font-semibold text-zinc-950'>
                  {restaurant.name}
                </h1>
                <p className='mt-2 text-sm text-zinc-600'>{restaurant.place}</p>
              </div>

              <div className='rounded-md border bg-zinc-50 px-4 py-3 text-sm'>
                <p className='font-semibold text-zinc-950'>
                  Rating {restaurant.averageRating}
                </p>
                <p className='mt-1 text-zinc-600'>
                  {restaurant.totalMenus} menu tersedia
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className='mt-8'>
          <h2 className='text-xl font-semibold text-zinc-950'>Menu</h2>

          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {restaurant.menus.map((menu) => (
              <Card key={menu.id}>
                <div className='relative h-44 w-full bg-zinc-100'>
                  <Image
                    src={menu.image}
                    alt={menu.foodName}
                    fill
                    className='object-cover'
                  />
                </div>

                <CardHeader>
                  <CardTitle>{menu.foodName}</CardTitle>
                </CardHeader>

                <CardContent className='space-y-3'>
                  <p className='text-sm text-zinc-500'>{menu.type}</p>

                  <p className='font-semibold text-zinc-950'>
                    {formatRupiah(menu.price)}
                  </p>

                  <Button
                    className='w-full'
                    disabled={addToCartMutation.isPending}
                    onClick={() => handleAddToCart(menu.id)}
                  >
                    {addToCartMutation.isPending
                      ? 'Menambahkan...'
                      : 'Tambah ke Cart'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
