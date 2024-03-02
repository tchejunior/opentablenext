import Price from '@/components/Price';
import Stars from '@/components/Stars';
// import Stars from '@/components/Stars';
import { calculateReviewRatingAvg } from '@/utils/calcReviewRatingAvg';
import { N13_Cuisine, N13_Location, N13_Review, PRICE } from '@prisma/client';
import Link from 'next/link';

interface Restaurant {
  id: number;
  name: string;
  main_image: string;
  slug: string;
  price: PRICE;
  location: N13_Location;
  cuisine: N13_Cuisine;
  reviews: N13_Review[];
}

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const renderRatingText = () => {
    const rating = calculateReviewRatingAvg(restaurant.reviews);

    if (rating >= 4) return 'Awesome';
    else if (rating >= 3) return 'Good';
    // else if (rating >= 2) return 'Average';
    // else if (rating >= 1) return 'Poor';
    else if (rating == 0) return 'Unrated';
    else return 'Average';
  };

  return (
    <div className='border-b flex pb-5 ml-4'>
      {/* <Link href='/restaurant/milestones-grill'> */}
      <img src={restaurant.main_image} alt='' className='w-44 h-36 rounded' />
      <div className='pl-5'>
        <h2 className='text-3xl'>{restaurant.name}</h2>
        <div className='flex items-start'>
          <div className='flex mb-2'>
            <Stars reviews={restaurant.reviews} />
          </div>
          <p className='ml-2 text-sm'>{renderRatingText()}</p>
        </div>
        <div className='mb-9'>
          <div className='font-light flex text-reg'>
            <Price price={restaurant.price} />
            <p className='mr-4 capitalize'>{restaurant.cuisine.name}</p>
            <p className='mr-4 capitalize'>{restaurant.location.name}</p>
          </div>
        </div>
        <div className='text-red-600'>
          <Link href={`/restaurant/${restaurant.slug}`}>View more information</Link>
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
}
