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
          borderRadius: '16px',
          backgroundColor: '#f9fafb',
          transition: 'all 0.2s ease',
          padding: '24px',
          cursor: 'pointer',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          target.style.backgroundColor = '#f3f4f6';
          target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          target.style.transform = 'scale(1.05)';
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
          gap: '16px'
        }}>
          {/* Icon */}
          <div style={{ color: iconColor }}>
            <Icon size={48} strokeWidth={1.5} />
          </div>
          
          {/* Text */}
          <h3 style={{
            fontWeight: '600',
            fontSize: '18px',
            color: '#1f2937',
            textAlign: 'center',
            margin: 0,
            lineHeight: '1.2'
          }}>
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
