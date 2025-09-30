"use client";
import { useCart } from "./cart/store";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function CartBar({ onCheckout }: { onCheckout: () => void }) {
  const count = useCart(s => s.count());
  const total = useCart(s => s.total());
  
  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg border p-4">
          <div className="flex items-center justify-between">
            {/* Cart Info */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                >
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                {/* Item count badge */}
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {count}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 font-medium">
                  {count} {count === 1 ? "товар" : count < 5 ? "товара" : "товаров"}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {total.toLocaleString("ru-RU")} ₽
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button 
              onClick={onCheckout}
              className="text-white border-0 px-6 py-2 font-semibold hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              Оформить
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress bar */}
          {total < 5000 && (
            <>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((total / 5000) * 100, 100)}%`,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                Добавьте товаров на {(5000 - total).toLocaleString("ru-RU")} ₽ для бесплатной доставки
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}