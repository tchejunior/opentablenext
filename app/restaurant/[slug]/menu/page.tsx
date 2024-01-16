import type { Metadata } from 'next';

import RestaurantNavBar from '../components/RestaurantNavBar';
import Menu from '../components/Menu';

export const metadata: Metadata = {
  title: 'Menu of Milesstone Grill | OpenTable',
  description: 'Generated by create next app',
};

export default function RestaurantMenu() {
  return (
    <div className='bg-white w-[100%] rounded p-3 shadow'>
      <RestaurantNavBar />
      <Menu />
    </div>
  );
}