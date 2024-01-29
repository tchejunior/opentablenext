import Header from '@/components/Header';
import RestaurantCards from '@/components/RestaurantCards';
import { PrismaClient, N13_Cuisine, N13_Location, PRICE } from '@prisma/client';

export interface RestaurantCardType {
  id: number;
  name: string;
  main_image: string;
  slug: string;
  cuisine: N13_Cuisine;
  location: N13_Location;
  price: PRICE;
}

const prisma = new PrismaClient();

const fetchRestaurants = async (): Promise<RestaurantCardType[]> => {
  const restaurants = await prisma.n13_Restaurant.findMany({
    select: {
      id: true,
      name: true,
      main_image: true,
      cuisine: true,
      slug: true,
      location: true,
      price: true,
    },
  });

  return restaurants;
};

export default async function Home() {
  const restaurants = await fetchRestaurants();

  return (
    <main>
      <Header />
      <div className='py-3 px-36 mt-10 flex flex-wrap justify-center'>
        {restaurants.map((restaurant) => (
          <RestaurantCards restaurant={restaurant} key={restaurant.id} />
        ))}
      </div>
    </main>
  );
}
