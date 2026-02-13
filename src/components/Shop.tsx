import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface ShopProps {
  products: Product[];
  onProductsUpdate: (products: Product[]) => void;
}

const Shop: React.FC<ShopProps> = ({ products, onProductsUpdate }) => {
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const addToCart = (productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const total = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Boutique</h1>
        <div className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-full">
          <ShoppingCart className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">{totalItems} articles</span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
          <p className="text-lg">Aucun produit disponible</p>
          <p className="text-sm mt-2">Ajoutez des produits depuis l'admin!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="glass rounded-xl overflow-hidden border border-white/10">
              <img src={product.image} className="w-full h-32 object-cover" alt={product.name} />
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                <p className="text-xs text-zinc-500 truncate">{product.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-indigo-400 font-bold">{product.price} {product.currency}</span>
                  <div className="flex items-center gap-2">
                    {cart[product.id] && cart[product.id] > 0 && (
                      <button onClick={() => removeFromCart(product.id)} className="p-1 bg-zinc-700 rounded"><Minus className="w-4 h-4" /></button>
                    )}
                    <span className="text-xs">{cart[product.id] || 0}</span>
                    <button onClick={() => addToCart(product.id)} className="p-1 bg-indigo-600 rounded"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalItems > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 bg-indigo-600 p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">{totalItems} articles</span>
            <span className="text-white font-bold text-xl">{total} {products[0]?.currency || '€'}</span>
            <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold text-sm">Commander</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
