// Album types
export interface Album {
  id: string;
  title: string;
  slug: string;
  overview: string;
  year: number;
  location: string;
  camera: string;
  lenses: string;
  other_devices: string;
  client: string;
  category: string;
  project_type: string;
  button_text: string;
  button_link: string;
  youtube_link?: string;
  images: string[]; // array of image URLs (up to 20)
  cover_image: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string; // rich text / markdown
  cover_image: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  // SEO
  meta_title?: string;
  meta_description?: string;
}

// Review types
export interface Review {
  id: string;
  reviewer_name: string;
  reviewer_title: string;
  reviewer_company: string;
  avatar_url?: string;
  body: string;
  rating: number;
  approved: boolean;
  created_at: string;
}

// Enquiry types
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
}

// Client types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  sessions: Session[];
  created_at: string;
}

// Session/booking types
export interface Session {
  id: string;
  client_id: string;
  client_name: string;
  service: string;
  date: string;
  location?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount?: number;
  notes?: string;
  created_at: string;
}

// Navigation
export interface NavLink {
  label: string;
  href: string;
}

// Admin user
export interface AdminUser {
  id: string;
  email: string;
  role: "admin";
}
