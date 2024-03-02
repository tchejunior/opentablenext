import Header from '@/components/Header';

export default function loading() {
  return (
    <main>
      <Header />
      <div className='py-3 px-36 mt-10 flex flex-wrap justify-center'>
        {[...Array(12)].map((i) => (
          <div
            key={i}
            className='animate-pulse bg-slate-200 w-64 h-72 rounded overflow-hidden border cursor-pointer m-3'
          >
            {/* <div className='w-full h-3/4 bg-gray-300 rounded-t-lg'></div>
            <div className='flex justify-between items-center p-4'>
              <div className='w-2/3 h-6 bg-gray-300 rounded-lg'></div>
              <div className='w-1/3 h-6 bg-gray-300 rounded-lg'></div>
            </div> */}
          </div>
        ))}
      </div>
    </main>
  );
}
