export interface tourPackageReviews {
  id: number;
  comment: string;
  rating: number;
  created: string;
  modified: string;
  review_by_user : {
    user: string,
    customer_profile: customer_profile[];
  }
  transaction: {
    booking: {
      package: string,
    }
  }
}

interface customer_profile {
  avatar: string;
}