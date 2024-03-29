import Header from '@/app/components/Header';
import RestaurantCards from '@/app/components/RestaurantCards';
import { PrismaClient, N13_Cuisine, N13_Location, PRICE, N13_Review } from '@prisma/client';

export interface RestaurantCardType {
  id: number;
  name: string;
  main_image: string;
  slug: string;
  cuisine: N13_Cuisine;
  location: N13_Location;
  price: PRICE;
  reviews: N13_Review[];
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
      reviews: true,
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
