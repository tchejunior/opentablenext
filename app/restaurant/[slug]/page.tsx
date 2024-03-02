import type { Metadata } from 'next';
import { N13_Review, Prisma, PrismaClient } from '@prisma/client';

import RestaurantNavBar from './components/RestaurantNavBar';
import Title from './components/Title';
import Rating from './components/Rating';
import Description from './components/Description';
import Images from './components/Images';
import Reviews from './components/Reviews';
import ReservationCard from './components/ReservationCard';

export const metadata: Metadata = {
  title: 'Milesstone Grill | OpenTable',
};

const prisma = new PrismaClient();

interface Restaurant {
  id: number;
  name: string;
  images: Prisma.JsonValue;
  description: string;
  slug: string;
  reviews: N13_Review[];
}

const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.n13_Restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      reviews: true,
    },
  });

  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  return restaurant;
};

export default async function RestaurantDetails({ params }: { params: { slug: string } }) {
  const restaurant = await fetchRestaurantBySlug(params.slug);

  return (
    <>
      <div className='bg-white w-[70%] rounded p-3 shadow'>
        <RestaurantNavBar slug={restaurant.slug} />
        <Title name={restaurant.name} />
        <Rating reviews={restaurant.reviews} />
        <Description description={restaurant.description} />
        <Images images={restaurant.images} />
        {restaurant.reviews.length ? (
          <Reviews reviews={restaurant.reviews} />
        ) : (
          <div>
            <h1 className='font-bold text-3xl mt-10 mb-7 borber-b pb-5'>No revies yet...</h1>
          </div>
        )}
      </div>
      <div className='w-[27%] relative text-reg'>
        <ReservationCard />
      </div>
    </>
  );
}
