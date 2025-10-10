"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: string | number;
  images?: { src: string }[];
  categories?: { id: number; name: string }[];
};

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: any, qty?: number) => Promise<void>;
};

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const productImage = product.images?.[0]?.src; // Вынесено в переменную

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const productData = {
      id: product.id,
      name: product.name,
      price: price,
      image: productImage
    };
    
    try {
      setIsLoading(true);
      await onAddToCart(productData, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [onAddToCart, product.id, product.name, price, productImage]);

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="telegram-card"
    >
      {/* Large Image */}
      <div className="telegram-card-image">
        {product.images?.[0]?.src ? (
          <Image
            src={product.images[0].src}
            alt={product.name}
            className="telegram-product-image"
            loading="lazy"
            width={200} // Укажите подходящую ширину
            height={200} // Укажите подходящую высоту
          />
        ) : (
          <div className="telegram-no-image">
            <span>🖼️</span>
          </div>
        )}
      </div>

      {/* Price (Large) */}
      <div className="telegram-price">
        {price.toLocaleString()} ₽
      </div>

      {/* Product Name */}
      <h3 className="telegram-product-title">
        {product.name}
      </h3>

      {/* Add to Cart Button (Full Width) */}
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="telegram-add-to-cart-btn"
      >
        {isLoading ? "Добавляем..." : "В корзину"}
      </button>
    </div>
  );
}
