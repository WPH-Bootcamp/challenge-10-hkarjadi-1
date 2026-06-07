'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';

import { useCart } from '@/lib/query/cart';
import { useCheckoutOrder } from '@/lib/query/order';
import { CheckoutFormValues, checkoutSchema } from '@/lib/validations/order';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function formatRupiah(value: number) {
  // Helper untuk menampilkan angka sebagai Rupiah.
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CheckoutPage() {
  const router = useRouter();

  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const { data, isLoading, isError } = useCart(hasHydrated && Boolean(token));

  const checkoutMutation = useCheckoutOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: '',
      phone: '',
      paymentMethod: 'cash',
      notes: '',
    },
  });

  const cartData = data?.data;
  const cartGroups = cartData?.cart ?? [];
  const summary = cartData?.summary;

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
    }
  }, [hasHydrated, router, token]);

  function onSubmit(values: CheckoutFormValues) {
    // Checkout tidak boleh jalan kalau cart kosong.
    if (cartGroups.length === 0) {
      toast.error('Cart masih kosong');
      return;
    }

    const restaurants = cartGroups.map((group) => ({
      restaurantId: group.restaurant.id,
      items: group.items.map((item) => ({
        menuId: item.menu.id,
        quantity: item.quantity,
      })),
    }));

    checkoutMutation.mutate(
      {
        restaurants,
        deliveryAddress: values.deliveryAddress,
        phone: values.phone,
        paymentMethod: values.paymentMethod,
        notes: values.notes,
      },
      {
        onSuccess: () => {
          toast.success('Checkout berhasil');
          router.push('/orders');
        },
        onError: () => {
          toast.error('Checkout gagal, coba lagi');
        },
      }
    );
  }

  if (!hasHydrated) {
    return (
      <main className='min-h-screen bg-zinc-50 px-6 py-10'>
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
      <section className='mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[1fr_360px]'>
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p className='text-sm text-zinc-600'>Memuat cart...</p>
            ) : null}

            {isError ? (
              <p className='text-sm text-red-600'>
                Gagal mengambil cart. Kembali ke cart lalu coba lagi.
              </p>
            ) : null}

            {!isLoading && !isError ? (
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <div className='space-y-2'>
                  <Label htmlFor='deliveryAddress'>Alamat Pengiriman</Label>
                  <Textarea
                    id='deliveryAddress'
                    placeholder='Tulis alamat lengkap pengiriman'
                    {...register('deliveryAddress')}
                  />
                  {errors.deliveryAddress ? (
                    <p className='text-sm text-red-600'>
                      {errors.deliveryAddress.message}
                    </p>
                  ) : null}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='phone'>Nomor Telepon</Label>
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='08123456789'
                    {...register('phone')}
                  />
                  {errors.phone ? (
                    <p className='text-sm text-red-600'>
                      {errors.phone.message}
                    </p>
                  ) : null}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='paymentMethod'>Metode Pembayaran</Label>
                  <Input
                    id='paymentMethod'
                    placeholder='cash'
                    {...register('paymentMethod')}
                  />
                  {errors.paymentMethod ? (
                    <p className='text-sm text-red-600'>
                      {errors.paymentMethod.message}
                    </p>
                  ) : null}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='notes'>Catatan</Label>
                  <Textarea
                    id='notes'
                    placeholder='Contoh: jangan terlalu pedas'
                    {...register('notes')}
                  />
                </div>

                <Button
                  type='submit'
                  className='w-full'
                  disabled={
                    checkoutMutation.isPending || cartGroups.length === 0
                  }
                >
                  {checkoutMutation.isPending ? 'Processing...' : 'Make Order'}
                </Button>
              </form>
            ) : null}
          </CardContent>
        </Card>

        <Card className='h-fit'>
          <CardHeader>
            <CardTitle>History Order</CardTitle>
          </CardHeader>

          <CardContent className='space-y-4'>
            {cartGroups.length === 0 ? (
              <p className='text-sm text-zinc-600'>Cart masih kosong.</p>
            ) : null}

            {cartGroups.map((group) => (
              <div key={group.restaurant.id} className='border-b pb-4'>
                <p className='font-medium text-zinc-950'>
                  {group.restaurant.name}
                </p>

                <div className='mt-3 space-y-2'>
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className='flex justify-between gap-4 text-sm text-zinc-600'
                    >
                      <span>
                        {item.quantity}x {item.menu.foodName}
                      </span>
                      <span>{formatRupiah(item.itemTotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className='flex justify-between font-semibold text-zinc-950'>
              <span>Total</span>
              <span>{formatRupiah(summary?.totalPrice ?? 0)}</span>
            </div>
          </CardContent>
        </Card>
      </section>
      <Footer />
    </main>
  );
}
