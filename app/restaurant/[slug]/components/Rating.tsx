import Stars from '@/components/Stars';
import { calculateReviewRatingAvg } from '@/utils/calcReviewRatingAvg';
import { N13_Review } from '@prisma/client';

export default function Rating({ reviews }: { reviews: N13_Review[] }) {
  return (
    <div className='flex items-end'>
      <div className='ratings mt-2 flex items-center'>
        <Stars reviews={reviews} />
        <p className='text-reg ml-3'>{calculateReviewRatingAvg(reviews)}</p>
      </div>
      <div>
        <p className='text-reg ml-4'>{`${reviews.length} Review${
          reviews.length > 1 ? 's' : ''
        }`}</p>
      </div>
    </div>
  );
}
