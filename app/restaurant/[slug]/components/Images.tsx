import { Prisma } from '@prisma/client';

export default function Images({ images }: { images: Prisma.JsonValue }) {
  // Explicitly parse images as an array of strings
  const images_parsed = images as string[];

  return (
    <div>
      <h1 className='font-bold text-3xl mt-10 mb-7 border-b pb-5'>
        {images_parsed.length} photo{images_parsed.length > 0 && 's'}
      </h1>
      <div className='flex flex-wrap'>
        {images_parsed.map((image: any) => (
          <img className='w-56 h-44 mr-1 mb-1' src={image} alt='' key={image} />
        ))}
      </div>
    </div>
  );
}
