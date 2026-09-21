/** Review shapes from the API (api/apps/reviews/serializers.py). */

export type Review = {
  id: number;
  author: { name: string; avatar_url: string };
  rating: number;
  comment: string;
  created_at: string;
};

export const MIN_RATING = 1;
export const MAX_RATING = 5;
