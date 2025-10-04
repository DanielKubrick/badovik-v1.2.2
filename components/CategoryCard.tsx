"use client";

import Link from "next/link";
import { Category } from "@/lib/categories";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { name, icon: Icon, href, color } = category;

  // Map TailwindCSS color classes to actual color values
  const colorMap: { [key: string]: string } = {
    'text-green-600': '#059669',
    'text-blue-600': '#2563eb', 
    'text-purple-600': '#9333ea',
    'text-pink-600': '#db2777',
    'text-orange-600': '#ea580c',
    'text-indigo-600': '#4f46e5',
    'text-yellow-600': '#d97706',
    'text-teal-600': '#0d9488',
  };

  const iconColor = colorMap[color] || '#6b7280';

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div 
        style={{
          borderRadius: '8px', // Уменьшили с 16px
          backgroundColor: '#f9fafb',
          transition: 'all 0.2s ease',
          padding: '12px', // Изменили с 24px на 12px
          cursor: 'pointer',
          transform: 'scale(1)',
          minHeight: '90px', // Добавили минимальную высоту
          border: '1px solid #e5e7eb',
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          target.style.backgroundColor = '#f3f4f6';
          target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          target.style.transform = 'scale(1.02)'; // Уменьшили hover эффект
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget;
          target.style.backgroundColor = '#f9fafb';
          target.style.boxShadow = 'none';
          target.style.transform = 'scale(1)';
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px', // Уменьшили с 16px
          height: '100%'
        }}>
          {/* Icon */}
          <div style={{ color: iconColor }}>
            <Icon size={32} strokeWidth={1.5} /> {/* Изменили с 48px на 32px */}
          </div>
          
          {/* Text */}
          <h3 style={{
            fontWeight: '600',
            fontSize: '12px', // Изменили с 18px на 12px
            color: '#1f2937',
            textAlign: 'center',
            margin: 0,
            lineHeight: '1.3'
          }}>
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
