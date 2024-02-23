import type { Metadata } from 'next';
import { PrismaClient } from '@prisma/client';

import Header from './components/Header';
import SearchSideBar from './components/SearchSideBar';
import RestaurantCard from './components/RestaurantCard';

export const metadata: Metadata = {
  title: 'Search | OpenTable',
};

const prisma = new PrismaClient();

const fetchRestaurantsByCity = (city: string) => {
  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
  };

  if (!city) return prisma.n13_Restaurant.findMany({ select });

  return prisma.n13_Restaurant.findMany({
    where: {
      location: {
        name: {
          equals: city.toLowerCase(),
        },
      },
    },
    select,
  });
};

const fetchLocations = async () => {
  return prisma.n13_Location.findMany();
};

const fetchCuisine = async () => {
  return prisma.n13_Cuisine.findMany();
};

export default async function Search({ searchParams }: { searchParams: { city: string } }) {
  const restaurants = await fetchRestaurantsByCity(searchParams.city);
  const location = await fetchLocations();
  const cuisine = await fetchCuisine();
  return (
    <>
      <Header />
      <div className='flex py-4 m-auto w-2/3 justify-between items-start'>
        <SearchSideBar location={location} cuisine={cuisine} />
        <div className='w-5/6'>
          {restaurants.length ? (
            restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <p>{`Sorry, we found no restaurants in ${searchParams.city}`}</p>
          )}
        </div>
      </div>
    </>
  );
}
