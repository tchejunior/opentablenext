import type { Metadata } from 'next';

import RestaurantNavBar from '../components/RestaurantNavBar';
import Menu from '../components/Menu';

export const metadata: Metadata = {
  title: 'Menu of Milesstone Grill | OpenTable',
};

export default function RestaurantMenu({ params }: { params: { slug: string } }) {
  return (
    <div className='bg-white w-[100%] rounded p-3 shadow'>
      <RestaurantNavBar slug={params.slug} />
      <Menu />
    </div>
  );
}
