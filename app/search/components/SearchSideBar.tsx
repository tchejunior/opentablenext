import { N13_Cuisine, N13_Location } from '@prisma/client';

export default function SearchSideBar({
  location,
  cuisine,
}: {
  location: N13_Location[];
  cuisine: N13_Cuisine[];
}) {
  return (
    <div className='w-1/5'>
      <div className='border-b pb-4'>
        <h1 className='mb-2'>Region</h1>
        {location.length ? (
          location.map((loc) => (
            <p key={loc.id} className='font-light text-reg capitalize'>
              {loc.name}
            </p>
          ))
        ) : (
          <p>loading...</p>
        )}
      </div>
      <div className='border-b pb-4 mt-3'>
        <h1 className='mb-2'>Cuisine</h1>
        {cuisine.length ? (
          cuisine.map((c) => (
            <p key={c.id} className='font-light text-reg capitalize'>
              {c.name}
            </p>
          ))
        ) : (
          <p>loading...</p>
        )}
      </div>
      <div className='mt-3 pb-4'>
        <h1 className='mb-2'>Price</h1>
        <div className='flex'>
          <button className='border w-full text-reg font-light rounded-l p-2'>$</button>
          <button className='border-r border-t border-b w-full text-reg font-light p-2'>$$</button>
          <button className='border-r border-t border-b w-full text-reg font-light p-2 rounded-r'>
            $$$
          </button>
        </div>
      </div>
    </div>
  );
}
