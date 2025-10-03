"use client";

import { categories } from "@/lib/categories";
import CategoryCard from "./CategoryCard";
import { useEffect, useState } from "react";

const CategoryGrid: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section style={{ width: '100%', paddingTop: '32px', paddingBottom: '32px' }}>
      {/* Section Header */}
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '24px',
        color: '#111827',
        margin: '0 0 24px 0'
      }}>
        Категории товаров
      </h2>
      
      {/* Categories Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: '16px'
      }}>
        {categories.map((category) => (
          <CategoryCard 
            key={category.id} 
            category={category} 
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
