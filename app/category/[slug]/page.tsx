"use client";

import { useParams } from 'next/navigation';
import { categories } from '@/lib/categories';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CategoryPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  // Find the category by slug
  const category = categories.find(cat => cat.id === slug);
  
  if (!category) {
    return (
      <div style={{
        padding: '32px 16px',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>
          Категория не найдена
        </h1>
        <Link href="/" style={{
          color: '#f97316',
          textDecoration: 'none',
          fontSize: '16px'
        }}>
          ← Вернуться на главную
        </Link>
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <div style={{
      padding: '32px 16px',
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          color: '#6b7280',
          textDecoration: 'none',
          marginRight: '16px'
        }}>
          <ArrowLeft size={20} />
        </Link>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            color: category.color === 'text-green-600' ? '#059669' :
                   category.color === 'text-blue-600' ? '#2563eb' : 
                   category.color === 'text-purple-600' ? '#9333ea' :
                   category.color === 'text-pink-600' ? '#db2777' :
                   category.color === 'text-orange-600' ? '#ea580c' :
                   category.color === 'text-indigo-600' ? '#4f46e5' :
                   category.color === 'text-yellow-600' ? '#d97706' :
                   category.color === 'text-teal-600' ? '#0d9488' : '#6b7280'
          }}>
            <Icon size={32} strokeWidth={1.5} />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            {category.name}
          </h1>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div style={{
        backgroundColor: '#f9fafb',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '12px'
        }}>
          Скоро здесь появятся товары!
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          lineHeight: '1.5',
          margin: 0
        }}>
          Мы работаем над добавлением товаров в эту категорию. 
          Загляните сюда позже или вернитесь к основному каталогу.
        </p>
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Link 
          href="/" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#f97316',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            gap: '8px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
        >
          <ArrowLeft size={16} />
          Вернуться к каталогу
        </Link>
      </div>
    </div>
  );
};

export default CategoryPage;
