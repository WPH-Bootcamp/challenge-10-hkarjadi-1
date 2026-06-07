'use client';

import Link from 'next/link';
import Image from 'next/image';

const category = [
  {
    label: 'All Restaurant',
    href: '',
    image: '/images/all.svg',
  },
  {
    label: 'Nearby',
    href: '',
    image: '/images/nearby.svg',
  },
  {
    label: 'Discount',
    href: '',
    image: '/images/discount.svg',
  },
  {
    label: 'Best Seller',
    href: '',
    image: '/images/bestseller.svg',
  },
  {
    label: 'Delivery',
    href: '',
    image: '/images/delivery.svg',
  },
  {
    label: 'Lunch',
    href: '',
    image: '/images/Lunch.svg',
  },
];

export default function CategoryList() {
  return (
    <section className='grid grid-cols-3 gap-5 lg:grid-cols-6 lg:gap-11'>
      {category.map((category) => (
        <Link
          key={category.label}
          href={category.href}
          className='flex flex-col items-center gap-3 text-center text-xs font-semibold transition hover:-translate-y-0.5'
        >
          <div className='flex justify-center rounded-2xl border bg-white h-w-full items-center h-20 p-8 shadow-[0_4px_20px_0_#CBCACA40]'>
            <Image
              src={category.image}
              alt={category.label}
              width={48}
              height={48}
            />
          </div>
          <h2 className='font-bold text-neutral-950 text-sm  lg:text-lg leading-7 lg:leading-8 tracking-[-2%] lg:tracking-[-3%]'>
            {' '}
            {category.label}
          </h2>
        </Link>
      ))}
    </section>
  );
}
