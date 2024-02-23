import type { Metadata } from 'next';
import { PRICE, PrismaClient } from '@prisma/client';

import Header from './components/Header';
import SearchSideBar from './components/SearchSideBar';
import RestaurantCard from './components/RestaurantCard';

interface SearchParams {
  city: string;
  cuisine: string;
  price: PRICE;
}

export const metadata: Metadata = {
  title: 'Search | OpenTable',
};

const prisma = new PrismaClient();

const fetchRestaurants = ({ city, cuisine, price }: SearchParams) => {
  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
  };

  // let where = [
  //   city && {
  //     location: {
  //       name: {
  //         equals: city.toLowerCase(),
  //       },
  //     },
  //   },
  //   cuisine && {
  //     cuisine: {
  //       name: {
  //         equals: cuisine.toLowerCase(),
  //       },
  //     },
  //   },
  //   price && {
  //     price: { equals: price },
  //   },
  // ].filter(Boolean);

  // where = {...where}

  const where: any = {};

  if (city) {
    where.location = {
      name: {
        equals: city.toLowerCase(),
      },
    };
  }

  if (cuisine) {
    where.cuisine = {
      name: {
        equals: cuisine.toLowerCase(),
      },
    };
  }

  if (price) {
    where.price = {
      equals: price,
    };
  }

  return prisma.n13_Restaurant.findMany({
    where,
    select,
  });
};

const fetchLocations = async () => {
  return prisma.n13_Location.findMany();
};

const fetchCuisine = async () => {
  return prisma.n13_Cuisine.findMany();
};

export default async function Search({ searchParams }: { searchParams: SearchParams }) {
  const restaurants = await fetchRestaurants(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisine();

  return (
    <>
      <Header />
      <div className='flex py-4 m-auto w-2/3 justify-between items-start'>
        <SearchSideBar locations={locations} cuisines={cuisines} searchParams={searchParams} />
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
