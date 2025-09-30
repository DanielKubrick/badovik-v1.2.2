"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/components/cart/store";
import { 
  ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, 
  Share, ChevronDown, ChevronUp, ZoomIn, X, ChevronLeft, ChevronRight 
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  regular_price: number;
  sale_price?: number | null;
  images: { src: string; alt?: string }[];
  description: string;
  description_plain: string;
  short_description: string;
  short_description_plain: string;
  categories: { id: number; name: string }[];
  brands?: { id: number; name: string }[];
  sku: string;
  stock_status: string;
  attributes: any[];
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price).replace('₽', '').trim() + ' ₽';
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const cart = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showReturnPolicy, setShowReturnPolicy] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Product not found");
        }
        
        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      await cart.add({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.src
      }, quantity);
      
      // Telegram haptic feedback
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
      
      alert(`${product.name} добавлен в корзину (${quantity} шт.)`);
    } catch (error) {
      alert("Ошибка при добавлении в корзину");
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product!.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product!.images.length) % product!.images.length);
  };

  if (loading) {
    return (
      <div className="telegram-app">
        <div className="telegram-product-loading">
          <div className="telegram-product-skeleton">
            <div className="telegram-skeleton-header"></div>
            <div className="telegram-skeleton-image"></div>
            <div className="telegram-skeleton-title"></div>
            <div className="telegram-skeleton-price"></div>
            <div className="telegram-skeleton-button"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="telegram-app">
        <div className="telegram-product-error">
          <div className="telegram-error-icon">⚠️</div>
          <div className="telegram-error-title">Товар не найден</div>
          <button 
            onClick={() => router.back()}
            className="telegram-back-button"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  const isOnSale = product.sale_price && product.sale_price < product.regular_price;
  const discount = isOnSale ? Math.round(((product.regular_price - product.sale_price!) / product.regular_price) * 100) : 0;

  // Extract brand from product name or categories
  const getBrand = () => {
    if (product.brands && product.brands.length > 0) {
      return product.brands[0].name;
    }
    // Try to extract brand from name (first word)
    const words = product.name.split(' ');
    return words.length > 2 ? words[0] : null;
  };

  const getCleanTitle = () => {
    const brand = getBrand();
    if (brand) {
      return product.name.replace(brand, '').trim();
    }
    return product.name;
  };

  const getPackaging = () => {
    // Extract packaging info from attributes or name
    const packaging = product.attributes?.find(attr => 
      attr.name.toLowerCase().includes('упаковка') || 
      attr.name.toLowerCase().includes('фасовка')
    );
    return packaging?.options?.[0] || null;
  };

  const brand = getBrand();
  const cleanTitle = getCleanTitle();
  const packaging = getPackaging();

  return (
    <div className="telegram-app telegram-product-page">
      {/* Sticky Price Panel */}
      <div className="telegram-sticky-price-panel">
        <div className="telegram-price-container">
          <div className="telegram-price-info">
            <span className="telegram-current-price">
              {formatPrice(product.price)}
            </span>
            {isOnSale && (
              <span className="telegram-discount-badge">
                -{discount}%
              </span>
            )}
          </div>
          <div className="telegram-purchase-controls">
            <div className="telegram-quantity-selector">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="telegram-quantity-btn telegram-quantity-minus"
              >
                -
              </button>
              <span className="telegram-quantity-display">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="telegram-quantity-btn telegram-quantity-plus"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="telegram-add-to-cart-main"
            >
              <ShoppingCart className="telegram-cart-icon" />
              В корзину
            </button>
          </div>
        </div>
      </div>

      <div className="telegram-product-content">
        {/* Breadcrumbs */}
        <div className="telegram-breadcrumbs">
          <button 
            onClick={() => router.back()}
            className="telegram-breadcrumb-link"
          >
            <ArrowLeft className="telegram-breadcrumb-icon" />
            <span>Каталог</span>
          </button>
          {product.categories && product.categories[0] && (
            <>
              <span className="telegram-breadcrumb-separator">/</span>
              <span className="telegram-breadcrumb-category">{product.categories[0].name}</span>
            </>
          )}
        </div>

        {/* Image Gallery */}
        <div className="telegram-image-gallery">
          <div className="telegram-main-image-container">
            <img
              src={product.images[selectedImage]?.src || "/placeholder.jpg"}
              alt={product.name}
              className="telegram-main-image"
              onClick={() => setShowImageModal(true)}
            />
            <button
              onClick={() => setShowImageModal(true)}
              className="telegram-zoom-button"
            >
              <ZoomIn className="telegram-zoom-icon" />
            </button>
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="telegram-nav-button telegram-nav-left"
                >
                  <ChevronLeft className="telegram-nav-icon" />
                </button>
                <button
                  onClick={nextImage}
                  className="telegram-nav-button telegram-nav-right"
                >
                  <ChevronRight className="telegram-nav-icon" />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="telegram-thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`telegram-thumbnail ${
                    selectedImage === index ? "telegram-thumbnail-active" : ""
                  }`}
                >
                  <img
                    src={image.src}
                    alt={`${product.name} ${index + 1}`}
                    className="telegram-thumbnail-image"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Header */}
        <div className="telegram-product-header">
          {/* Brand & SKU & Actions */}
          <div className="telegram-header-top">
            <div className="telegram-brand-sku">
              {brand && (
                <span className="telegram-brand-name">{brand}</span>
              )}
              {product.sku && (
                <span className="telegram-sku">Арт. {product.sku}</span>
              )}
            </div>
            <div className="telegram-product-actions">
              <button className="telegram-action-btn telegram-favorite-btn">
                <Heart className="telegram-action-icon" />
              </button>
              <button className="telegram-action-btn telegram-share-btn">
                <Share className="telegram-action-icon" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="telegram-product-title-main">
            {cleanTitle}
          </h1>

          {/* Package/Form Chip */}
          {packaging && (
            <div className="telegram-packaging-container">
              <span className="telegram-packaging-chip">
                {packaging}
              </span>
            </div>
          )}

          {/* Rating & Reviews */}
          <div className="telegram-rating-container">
            <div className="telegram-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="telegram-star-empty" />
              ))}
              <span className="telegram-rating-text">Пока нет отзывов</span>
            </div>
          </div>

          {/* Stock Status */}
          <div className="telegram-stock-status">
            <div className="telegram-stock-indicator"></div>
            <span className="telegram-stock-text">В наличии • отправим завтра</span>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="telegram-trust-signals">
          <div className="telegram-trust-item">
            <Truck className="telegram-trust-icon" />
            <span className="telegram-trust-text">Быстрая доставка</span>
          </div>
          <div className="telegram-trust-item">
            <Shield className="telegram-trust-icon" />
            <span className="telegram-trust-text">Гарантия</span>
          </div>
          <button 
            onClick={() => setShowReturnPolicy(true)}
            className="telegram-trust-item telegram-return-link"
          >
            <RotateCcw className="telegram-trust-icon" />
            <span className="telegram-trust-text">Возврат 30 дней</span>
          </button>
        </div>

        {/* Accordion Sections */}
        <div className="telegram-accordion-container">
          {/* Description */}
          <div className="telegram-accordion-section">
            <button
              onClick={() => toggleSection('description')}
              className="telegram-accordion-header"
            >
              <span className="telegram-accordion-title">Описание и польза</span>
              {expandedSection === 'description' ? 
                <ChevronUp className="telegram-accordion-icon" /> : 
                <ChevronDown className="telegram-accordion-icon" />}
            </button>
            {expandedSection === 'description' && (
              <div className="telegram-accordion-content">
                <p className="telegram-accordion-text">
                  {product.description_plain || product.short_description_plain || 'Подробное описание товара'}
                </p>
              </div>
            )}
          </div>

          {/* Composition */}
          <div className="telegram-accordion-section">
            <button
              onClick={() => toggleSection('composition')}
              className="telegram-accordion-header"
            >
              <span className="telegram-accordion-title">Состав</span>
              {expandedSection === 'composition' ? 
                <ChevronUp className="telegram-accordion-icon" /> : 
                <ChevronDown className="telegram-accordion-icon" />}
            </button>
            {expandedSection === 'composition' && (
              <div className="telegram-accordion-content">
                <p className="telegram-accordion-text">
                  Детальный состав продукта будет указан здесь
                </p>
              </div>
            )}
          </div>

          {/* Usage */}
          <div className="telegram-accordion-section">
            <button
              onClick={() => toggleSection('usage')}
              className="telegram-accordion-header"
            >
              <span className="telegram-accordion-title">Как принимать</span>
              {expandedSection === 'usage' ? 
                <ChevronUp className="telegram-accordion-icon" /> : 
                <ChevronDown className="telegram-accordion-icon" />}
            </button>
            {expandedSection === 'usage' && (
              <div className="telegram-accordion-content">
                <p className="telegram-accordion-text">
                  Инструкция по применению будет указана здесь
                </p>
              </div>
            )}
          </div>

          {/* Characteristics */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="telegram-accordion-section">
              <button
                onClick={() => toggleSection('specs')}
                className="telegram-accordion-header"
              >
                <span className="telegram-accordion-title">Характеристики</span>
                {expandedSection === 'specs' ? 
                  <ChevronUp className="telegram-accordion-icon" /> : 
                  <ChevronDown className="telegram-accordion-icon" />}
              </button>
              {expandedSection === 'specs' && (
                <div className="telegram-accordion-content">
                  <div className="telegram-specs-list">
                    {product.attributes.map((attr, index) => (
                      <div key={index} className="telegram-spec-item">
                        <span className="telegram-spec-label">{attr.name}:</span>
                        <span className="telegram-spec-value">{attr.options?.join(", ") || "N/A"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="telegram-modal-overlay telegram-image-modal-overlay">
          <div className="telegram-image-modal">
            <button
              onClick={() => setShowImageModal(false)}
              className="telegram-modal-close"
            >
              <X className="telegram-close-icon" />
            </button>
            <img
              src={product.images[selectedImage]?.src}
              alt={product.name}
              className="telegram-modal-image"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="telegram-modal-nav telegram-modal-nav-left"
                >
                  <ChevronLeft className="telegram-modal-nav-icon" />
                </button>
                <button
                  onClick={nextImage}
                  className="telegram-modal-nav telegram-modal-nav-right"
                >
                  <ChevronRight className="telegram-modal-nav-icon" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Return Policy Modal */}
      {showReturnPolicy && (
        <div className="telegram-modal-overlay">
          <div className="telegram-return-modal">
            <div className="telegram-return-header">
              <h3 className="telegram-return-title">Условия возврата</h3>
              <button
                onClick={() => setShowReturnPolicy(false)}
                className="telegram-return-close"
              >
                <X className="telegram-close-icon" />
              </button>
            </div>
            <div className="telegram-return-content">
              <p>• Возврат товара в течение 30 дней с момента получения</p>
              <p>• Товар должен быть в оригинальной упаковке</p>
              <p>• Сохранность товарного вида и потребительских свойств</p>
              <p>• Возврат денежных средств в течение 10 рабочих дней</p>
            </div>
            <button
              onClick={() => setShowReturnPolicy(false)}
              className="telegram-return-button"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
