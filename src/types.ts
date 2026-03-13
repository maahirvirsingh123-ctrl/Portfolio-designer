export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  location: string;
  description: string;
  imageUrl: string;
  gallery?: string[];
  stats?: { label: string; value: string }[];
  order?: number;
}

export interface Award {
  year: string;
  title: string;
  organization: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl: string;
}
