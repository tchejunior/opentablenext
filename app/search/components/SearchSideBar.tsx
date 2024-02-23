import { N13_Cuisine, N13_Location, PRICE } from '@prisma/client';
import Link from 'next/link';

interface Params {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

export default function SearchSideBar({
  locations,
  cuisines,
  searchParams,
}: {
  searchParams: Params;
  locations: N13_Location[];
  cuisines: N13_Cuisine[];
}) {
  const prices = [
    {
      price: PRICE.CHEAP,
      label: '$',
      className: 'border w-full text-reg font-light text-center rounded-l p-2',
    },
    { price: PRICE.REGULAR, label: '$$', className: 'border w-full text-reg font-light text-center p-2' },
    {
      price: PRICE.EXPENSIVE,
      label: '$$$',
      className: 'border w-full text-reg font-light text-center rounded-r p-2',
    },
  ];

  return (
    <div className='w-1/5'>
      <div className='border-b pb-4 flex flex-col'>
        <h1 className='mb-2'>Region</h1>
        {locations.length ? (
          locations.map((loc) => (
            <Link
              className='font-light text-reg capitalize'
              key={loc.id}
              href={{
                pathname: '/search',
                query: { ...searchParams, city: loc.name },
              }}
            >
              {loc.name}
            </Link>
          ))
        ) : (
          <p>loading...</p>
        )}
      </div>
      <div className='border-b pb-4 mt-3 flex flex-col'>
        <h1 className='mb-2'>Cuisine</h1>
        {cuisines.length ? (
          cuisines.map((c) => (
            <Link
              className='font-light text-reg capitalize'
              key={c.id}
              href={{
                pathname: '/search',
                query: { ...searchParams, cuisine: c.name },
              }}
            >
              {c.name}
            </Link>
          ))
        ) : (
          <p>loading...</p>
        )}
      </div>
      <div className='mt-3 pb-4'>
        <h1 className='mb-2'>Price</h1>
        <div className='flex'>
          {prices.map(({ price, label, className }) => (
            <Link
              className={className}
              href={{
                pathname: '/search',
                query: { ...searchParams, price },
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
