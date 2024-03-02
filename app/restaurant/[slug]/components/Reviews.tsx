import { N13_Review } from '@prisma/client';
import Review from './Review';

export default function Reviews({ reviews }: { reviews: N13_Review[] }) {
  return (
    <div>
      <h1 className='font-bold text-3xl mt-10 mb-7 borber-b pb-5'>{`What ${reviews.length} ${
        reviews.length > 1 ? 'people are' : 'person is'
      } saying...`}</h1>
      {reviews.map((review) => (
        <Review review={review} />
      ))}
    </div>
  );
}
