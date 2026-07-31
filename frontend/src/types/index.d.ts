export interface NewsItem {
  id: string;
  title: string;
  link: string;
  time: string;
  description: string;
  image: string | null;
  imageAlt: string | null;
  createdAt: string;
}