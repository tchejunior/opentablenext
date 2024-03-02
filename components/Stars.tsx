import fullStar from '../public/icons/full-star.png';
import halfStar from '../public/icons/half-star.png';
import emptyStar from '../public/icons/empty-star.png';
import Image from 'next/image';
import { N13_Review } from '@prisma/client';
import { calculateReviewRatingAvg } from '@/utils/calcReviewRatingAvg';

export default function Stars({ reviews }: { reviews: N13_Review[] }) {
  const rating = calculateReviewRatingAvg(reviews);

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(fullStar);
      } else if (i - 0.5 <= rating) {
        stars.push(halfStar);
      } else {
        stars.push(emptyStar);
      }
    }

    return stars.map((star) => {
      return <Image src={star} alt='star' className='w-4 h-4 mr-1' />;
    });
  };

  return <div className='flex items center'>{renderStars()}</div>;
}
