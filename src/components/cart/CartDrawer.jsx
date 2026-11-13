import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer({ onNavigate }) {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    isFreeShipping,
    shippingFee,
    total
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col text-black">
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-black flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-black" />
              </div>
              <h3 className="font-serif tracking-wider text-base font-bold text-black uppercase">
                Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100 transition"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 text-xs">
            {isFreeShipping ? (
              <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" /> Free Pan-India Express Shipping Unlocked!
              </p>
            ) : (
              <div>
                <p className="text-neutral-700 font-medium">
                  Add <span className="font-black text-black">₹{999 - subtotal}</span> more for <span className="font-bold text-black">FREE Express Delivery</span>
                </p>
                <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-black h-full rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-200 mx-auto flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-neutral-800 text-sm font-bold">Your shopping bag is empty.</p>
                  <p className="text-neutral-500 text-xs mt-1">Discover our 25% Extrait tributes and oriental ouds.</p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('catalog');
                  }}
                  className="inline-block bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition shadow-md"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product_id}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:border-black transition"
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400'}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded-lg bg-neutral-50 flex-shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-black leading-tight font-serif">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-neutral-400 hover:text-red-600 p-1 transition"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{item.volume} • {item.concentration || 'Extrait'}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-neutral-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1 text-neutral-500 hover:text-black transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs px-2.5 font-bold text-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-1 text-neutral-500 hover:text-black transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-black">
                          ₹{item.price * item.quantity}
                        </span>
                        {item.compare_price && (
                          <span className="block text-[10px] text-neutral-400 line-through">
                            ₹{item.compare_price * item.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-black font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pan-India Shipping</span>
                  <span className={isFreeShipping ? 'text-emerald-700 font-bold' : 'text-black font-semibold'}>
                    {isFreeShipping ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-black pt-2 border-t border-neutral-200">
                  <span>Total Payable</span>
                  <span className="text-black font-serif text-base font-black">₹{total}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onNavigate('checkout');
                }}
                className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
              >
                PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-neutral-500 flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                COD Available • Complimentary 2ml Tester Included
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
