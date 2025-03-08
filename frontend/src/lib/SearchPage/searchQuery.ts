export interface searchQuery {
  destination: string | "None";
  start_date: string | "None";
  end_date: string | "None";
  min_price: number | "None";
  max_price: number | "None";
}