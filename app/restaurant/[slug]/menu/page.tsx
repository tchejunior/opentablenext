import { PrismaClient } from '@prisma/client';
import type { Metadata } from 'next';

import RestaurantNavBar from '../components/RestaurantNavBar';
import Menu from '../components/Menu';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Menu of Milesstone Grill | OpenTable',
};

const prisma = new PrismaClient();

const fetchRestaurantMenu = async (slug: string) => {
  const restaurant = await prisma.n13_Restaurant.findUnique({
    where: { slug },
    select: {
      items: true,
    },
  });

  // if (!restaurant) throw new Error(`Restaurant '${slug}' not found`);
  if (!restaurant) notFound();

  return restaurant.items;
};

export default async function RestaurantMenu({ params }: { params: { slug: string } }) {
  const menu = await fetchRestaurantMenu(params.slug);
  return (
    <div className='bg-white w-[100%] rounded p-3 shadow'>
      <RestaurantNavBar slug={params.slug} />
      <Menu menu={menu} />
    </div>
  );
}
