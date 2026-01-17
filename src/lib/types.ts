export interface Batch {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  price: number;
  old_price: number;
  category: string;
  features: string[];
  is_public: boolean;
  status: "live" | "ended";
  created_at: string;
}
