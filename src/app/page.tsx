'use client';
import Image from 'next/image';
import Link from 'next/link';

import Navbar from '@/components/shared/navbar';

import CategoryList from '@/components/sections/CategoryList';

import Footer from '@/components/shared/footer';

import { FormEvent, Suspense, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useRestaurantResults } from '@/lib/query/resto';

import { Input } from '@/components/ui/input';

import { Restaurant } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function getRestaurantList(response: unknown): Restaurant[] {
  if (
    response &&
    typeof response === 'object' &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'restaurants' in response.data &&
    Array.isArray(response.data.restaurants)
  ) {
    return response.data.restaurants;
  }

  return [];
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get('q') ?? '';

  const [searchValue, setSearchValue] = useState(q);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const keyword = searchValue.trim();

    if (!keyword) {
      router.push('/');
      return;
    }

    router.push(`/?q=${encodeURIComponent(keyword)}`);
  }

  return (
    <div className='min-h-screen bg-white '>
      <section className='relative w-full'>
        <Image
          src='/main-mobile.png'
          alt='Main image mobile'
          width={900}
          height={900}
          priority
          className='h-full w-full object-cover block md:hidden'
        />
        <Image
          src='/main.png'
          alt='Main image'
          width={900}
          height={900}
          priority
          className='h-full w-full object-cover hidden md:block'
        />
        <Navbar />
        <div className='top-51 lg:top-81 absolute mx-auto px-5   w-full'>
          <div className='mb-8  flex flex-col justify-center items-center text-center'>
            <h1 className='text-white font-extrabold text-4xl leading-11 lg:text-5xl lg-leading-15'>
              Explore Culinary Experiences
            </h1>
            <p className='text-white text-lg leading-8 font-bold  lg:text-2xl lg:leading-9'>
              Search and refine your choice to discover the perfect restaurant.
            </p>
            <form onSubmit={handleSearchSubmit} className='w-full'>
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder='Search restaurants, food and drink'
                className='w-full mt-6 lg:mt-10 text-sm leading-7 text-neutral-600 bg-white max-w-151'
              />
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function BranchList() {
  const searchParams = useSearchParams();

  const q = searchParams.get('q') ?? '';

  const { data, isLoading, isError, refetch } = useRestaurantResults({
    q: q || undefined,
    page: 1,
    limit: 12,
  });

  const restaurants = getRestaurantList(data);

  return (
    <div className='min-h-screen bg-white mt-12'>
      <section>
        {isLoading ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className='h-40 animate-pulse'>
                <CardHeader>
                  <div className='h-5 w-2/3 rounded bg-neutral-950' />
                </CardHeader>
                <CardContent>
                  <div className='h-4 w-full rounded bg-neutral-200' />
                  <div className='mt-3 h-4 w-1/2 rounded bg-neutral-200' />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {isError ? (
          <div className='rounded-md border border-red-200 bg-red-50 p-6'>
            <h2 className='font-semibold text-primary-100'>
              Gagal mengambil data restoran
            </h2>
            <p className='mt-2 text-sm text-primary-100'>
              Coba ulang request atau cek koneksi/API.
            </p>
            <Button
              className='mt-4'
              variant='outline'
              onClick={() => refetch()}
            >
              Coba Lagi
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && restaurants.length === 0 ? (
          <div className='rounded-md border bg-white p-6 text-center'>
            <h2 className='font-semibold text-neutral-950'>
              Belum ada restoran
            </h2>
            <p className='mt-2 text-sm text-neutral-600'>
              Data restoran kosong untuk saat ini.
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && restaurants.length > 0 ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 '>
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id}>
                <CardHeader>
                  <CardTitle>{restaurant.name}</CardTitle>
                </CardHeader>

                <CardContent className='space-y-3'>
                  <p className='text-sm text-neutral-600'>{restaurant.place}</p>

                  <div className='flex flex-wrap gap-2 text-xs text-neutral-500'>
                    <span className='rounded-full bg-neutral-100 px-3 py-1'>
                      {restaurant.category}
                    </span>

                    <span className='rounded-full bg-neutral-100 px-3 py-1'>
                      Rating {restaurant.star}
                    </span>

                    <span className='rounded-full bg-neutral-100 px-3 py-1'>
                      {restaurant.menuCount} menu
                    </span>
                  </div>

                  <p className='text-sm font-medium text-neutral-950'>
                    Rp{restaurant.priceRange.min.toLocaleString('id-ID')} - Rp
                    {restaurant.priceRange.max.toLocaleString('id-ID')}
                  </p>

                  <Link href={`/resto/${restaurant.id}`}>
                    <Button className='w-full'>Lihat Detail</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className='min-h-screen bg-zinc-50'>
          <section className='mx-auto max-w-6xl px-6 py-10'>
            <p className='text-sm text-neutral-950'>Loading...</p>
          </section>
        </main>
      }
    >
      <Navbar />
      <HomeContent />
      <CategoryList />
      <BranchList />
      <Footer />
    </Suspense>
  );
}
