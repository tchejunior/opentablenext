import { N13_Review } from '@prisma/client';

export const calculateReviewRatingAvg = (reviews: N13_Review[]) => {
  if (!reviews.length) return 0;

  return (
    reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0) / reviews.length
  );
};
