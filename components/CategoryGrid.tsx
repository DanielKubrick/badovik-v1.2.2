"use client";

import { categories } from "@/lib/categories";
import CategoryCard from "./CategoryCard";
import { useEffect, useState } from "react";

const CategoryGrid: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Устанавливаем breakpoint на 320px для мобильных устройств
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section style={{ width: '100%', paddingTop: '16px', paddingBottom: '16px' }}>
      {/* Section Header */}
      <h2 style={{
        fontSize: '20px', // Уменьшили с 24px
        fontWeight: '700',
        marginBottom: '16px', // Уменьшили с 24px
        color: '#111827',
        margin: '0 0 16px 0'
      }}>
        Категории товаров
      </h2>
      
      {/* Categories Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', // 2 колонки на мобильных, 4 на десктопе
        gap: '12px' // Изменили с 16px на 12px
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
