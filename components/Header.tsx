"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart/store";
import { useSearch } from "../contexts/SearchContext";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const count = useCart((state) => state.count());
  const { searchQuery, handleSearch } = useSearch();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleLogoClick = () => {
    handleSearch('');
    router.push('/');
  };

  return (
    <>
      {/* Main Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e5e5e5',
        height: '60px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
          height: '100%'
        }}>
          {/* Logo */}
          <div 
            onClick={handleLogoClick}
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#f97316',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              userSelect: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ea580c'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#f97316'}
          >
            Mini Woo
          </div>

          {/* Desktop Search Bar */}
          {!isMobile && (
            <div style={{ 
              flex: 1,
              maxWidth: '500px',
              margin: '0 32px'
            }}>
              <SearchBar 
                onSearch={handleSearch} 
                initialValue={searchQuery}
              />
            </div>
          )}

          {/* Cart Icon */}
          <button 
            onClick={handleCartClick}
            style={{
              position: 'relative',
              padding: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              transition: 'color 0.2s ease',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f97316'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            aria-label={`Корзина (${count} товаров)`}
          >
            <ShoppingCart size={24} />
            {count > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#f97316',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                minWidth: '20px',
                height: '20px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}>
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {isMobile && (
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e5e5',
          padding: '8px 16px',
          position: 'sticky',
          top: '60px',
          zIndex: 99
        }}>
          <SearchBar 
            onSearch={handleSearch} 
            initialValue={searchQuery}
          />
        </div>
      )}
    </>
  );
};

export default Header;
