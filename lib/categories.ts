import { Pill, Dumbbell, Bath, Sparkles, ShoppingBag, Home, Baby, PawPrint } from 'lucide-react';

export const categories = [
  { id: 'supplements', name: 'Добавки', icon: Pill, href: '/category/supplements', color: 'text-green-600' },
  { id: 'sports', name: 'Спорт', icon: Dumbbell, href: '/category/sports', color: 'text-blue-600' },
  { id: 'bath', name: 'Ванна и уход', icon: Bath, href: '/category/bath', color: 'text-purple-600' },
  { id: 'beauty', name: 'Красота', icon: Sparkles, href: '/category/beauty', color: 'text-pink-600' },
  { id: 'grocery', name: 'Продукты', icon: ShoppingBag, href: '/category/grocery', color: 'text-orange-600' },
  { id: 'home', name: 'Дом', icon: Home, href: '/category/home', color: 'text-indigo-600' },
  { id: 'baby', name: 'Дети', icon: Baby, href: '/category/baby', color: 'text-yellow-600' },
  { id: 'pets', name: 'Питомцы', icon: PawPrint, href: '/category/pets', color: 'text-teal-600' },
];

export type Category = {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
};
