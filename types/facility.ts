export interface Facility {
  id: number;
  field_name: string;
  field_desc: string;
  field_image?: string | null;
  price_per_session: string;
  avg_rating: number;
  total_review: number;
}
