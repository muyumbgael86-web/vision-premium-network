import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { ShoppingCart, Plus, Minus, X, Camera, Tag, DollarSign } from 'lucide-react';

interface ShopProps {
  products: Product[];
  onProductsUpdate: (products: Product[]) => void;
}

const CURRENCIES = [
  { code: 'USD', name: 'Dollar (USA)', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro (Europe)', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'Livre (UK)', symbol: '£', flag: '🇬🇧' },
  { code: 'ZAR', name: 'Rand (Afrique du Sud)', symbol: 'R', flag: '🇿🇦' },
  { code: 'CDF', name: 'Franc Congolais', symbol: 'FC', flag: '🇨🇩' },
  { code: 'XOF', name: 'Franc CFA (UEMOA)', symbol: 'CFA', flag: '🇸🇳' },
  { code: 'XAF', name: 'Franc CEMAC', symbol: 'FCFA', flag: '🇨🇲' },
  { code: 'NGN', name: 'Naira (Nigeria)', symbol: '₦', flag: '🇳🇬' },
  { code: 'KES', name: 'Shilling (Kenya)', symbol: 'KSh', flag: '🇰🇪' },
  { code: 'GHS', name: 'Cedi (Ghana)', symbol: '₵', flag: '🇬🇭' },
  { code: 'MAD', name: 'Dirham (Maroc)', symbol: 'DH', flag: '🇲🇦' },
  { code: 'TND', name: 'Dinar (Tunisie)', symbol: 'DT', flag: '🇹🇳' },
  { code: 'DZD', name: 'Dinar (Algérie)', symbol: 'DA', flag: '🇩🇿' },
  { code: 'EGP', name: 'Livre (Egypte)', symbol: 'E£', flag: '🇪🇬' },
  { code: 'SAR', name: 'Riyal (Arabie)', symbol: '﷼', flag: '🇸🇦' },
  { code: 'AED', name: 'Dirham (UAE)', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'INR', name: 'Roupie (Inde)', symbol: '₹', flag: '🇮🇳' },
  { code: 'CNY', name: 'Yuan (Chine)', symbol: '¥', flag: '🇨🇳' },
  { code: 'JPY', name: 'Yen (Japon)', symbol: '¥', flag: '🇯🇵' },
  { code: 'KRW', name: 'Won (Corée)', symbol: '₩', flag: '🇰🇷' },
  { code: 'BRL', name: 'Real (Brésil)', symbol: 'R$', flag: '🇧🇷' },
  { code: 'MXN', name: 'Peso (Mexique)', symbol: '$', flag: '🇲🇽' },
  { code: 'CAD', name: 'Dollar (Canada)', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Dollar (Australie)', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Franc (Suisse)', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'RUB', name: 'Rouble (Russie)', symbol: '₽', flag: '🇷🇺' },
  { code: 'TRY', name: 'Lire (Turquie)', symbol: '₺', flag: '🇹🇷' },
  { code: 'PLN', name: 'Zloty (Pologne)', symbol: 'zł', flag: '🇵🇱' },
  { code: 'SEK', name: 'Couronne (Suède)', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Couronne (Norvège)', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: 'Couronne (Danemark)', symbol: 'kr', flag: '🇩🇰' },
  { code: 'NZD', name: 'Dollar (NZ)', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'ZMW', name: 'Kwacha (Zambie)', symbol: 'ZK', flag: '🇿🇲' },
  { code: 'MWK', name: 'Kwacha (Malawi)', symbol: 'MK', flag: '🇲🇼' },
  { code: 'BWP', name: 'Pula (Botswana)', symbol: 'P', flag: '🇧🇼' },
  { code: 'MZN', name: 'Metical (Mozambique)', symbol: 'MT', flag: '🇲🇿' },
  { code: 'SZL', name: 'Lilangeni (Eswatini)', symbol: 'L', flag: '🇸🇿' },
  { code: 'LSL', name: 'Loti (Lesotho)', symbol: 'L', flag: '🇱🇸' },
  { code: 'AOA', name: 'Kwanza (Angola)', symbol: 'Kz', flag: '🇦🇴' },
  { code: 'TZ', name: 'Shilling (Tanzanie)', symbol: 'TSh', flag: '🇹🇿' },
  { code: 'UGX', name: 'Shilling (Ouganda)', symbol: 'USh', flag: '🇺🇬' },
  { code: 'RWF', name: 'Franc (Rwanda)', symbol: 'RWF', flag: '🇷🇼' },
  { code: 'BDI', name: 'Franc (Burundi)', symbol: 'BIF', flag: '🇧🇮' },
  { code: 'ERN', name: 'Nakfa (Erythrée)', symbol: 'Nkf', flag: '🇪🇷' },
  { code: 'ETB', name: 'Birr (Ethiopie)', symbol: 'Br', flag: '🇪🇹' },
  { code: 'SOS', name: 'Shilling (Somalie)', symbol: 'S', flag: '🇸🇴' },
  { code: 'SDG', name: 'Livre (Soudan)', symbol: 'ج.س.', flag: '🇸🇩' },
  { code: 'SSP', name: 'Livre (Ssudan Sud)', symbol: '£', flag: '🇸🇸' },
  { code: 'MGA', name: 'Ariary (Madagascar)', symbol: 'Ar', flag: '🇲🇬' },
  { code: 'MUR', name: 'Roupie (Maurice)', symbol: 'Rs', flag: '🇲🇺' },
  { code: 'SCR', name: 'Roupie (Seychelles)', symbol: 'Sr', flag: '🇸🇨' },
];

const CATEGORIES = [
  'Vêtements',
  'Electronique',
  'Maison',
  'Automobile',
  'Services',
  'Alimentation',
  'Sports',
  'Loisirs',
  'Informatique',
  'Téléphonie',
  'Beauté',
  'Santé',
  'Jardinage',
  'Animaux',
  'Livres',
  'Jeux',
  'Musique',
  'Art',
  'Autres'
];

const Shop: React.FC<ShopProps> = ({ products, onProductsUpdate }) => {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sell form state
  const [productImage, setProductImage] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productName,
      price: parseFloat(productPrice) || 0,
      image: previewUrl || `https://picsum.photos/seed/${Date.now()}/400/400`,
      category: productCategory,
      description: productDescription,
      currency: selectedCurrency
    };
    onProductsUpdate([...products, newProduct]);
    setShowSellModal(false);
    resetSellForm();
  };

  const resetSellForm = () => {
    setProductImage('');
    setProductName('');
    setProductPrice('');
    setProductCategory('');
    setProductDescription('');
    setPreviewUrl('');
  };

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
  const selectedCurrencyData = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Boutique</h1>
        <button
          onClick={() => setShowSellModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-green-700"
        >
          <Plus className="w-5 h-5" /> Vendre
        </button>
      </div>

      {/* Cart Summary */}
      {totalItems > 0 && (
        <div className="bg-indigo-600 text-white p-4 rounded-xl mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-bold">{totalItems} article{totalItems > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-xl">{total.toFixed(2)} {selectedCurrencyData.symbol}</span>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm">
              Commander
            </button>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Tag className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg">Aucun produit disponible</p>
          <p className="text-sm mt-2">Soyez le premier à vendre un article!</p>
          <button
            onClick={() => setShowSellModal(true)}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Vendre mon premier article
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <img src={product.image} className="w-full h-40 object-cover" alt={product.name} />
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate text-gray-900">{product.name}</h3>
                <p className="text-xs text-gray-500 truncate">{product.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-indigo-600 font-bold">
                    {product.price.toFixed(2)} {CURRENCIES.find(c => c.code === product.currency)?.symbol || '$'}
                  </span>
                  <div className="flex items-center gap-2">
                    {cart[product.id] && cart[product.id] > 0 && (
                      <button onClick={() => removeFromCart(product.id)} className="p-1 bg-gray-100 rounded">
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                    <span className="text-xs font-medium w-6 text-center">{cart[product.id] || 0}</span>
                    <button onClick={() => addToCart(product.id)} className="p-1 bg-indigo-100 rounded">
                      <Plus className="w-4 h-4 text-indigo-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-bold text-lg text-gray-900">Vendre un article</h2>
              <button onClick={() => setShowSellModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSell} className="p-4 space-y-4">
              {/* Image Preview */}
              {previewUrl ? (
                <div className="relative rounded-lg overflow-hidden">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPreviewUrl(''); setProductImage(''); }}
                    className="absolute top-2 right-2 p-1 bg-black/70 rounded-full hover:bg-black/90"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500"
                >
                  <Camera className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm">Ajouter une photo</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: iPhone 13 Pro Max"
                  className="w-full bg-gray-50 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full bg-gray-50 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price and Currency */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-50 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300"
                    required
                  />
                </div>
                <div className="w-40">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300"
                  >
                    {CURRENCIES.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.flag} {curr.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Décrivez votre produit..."
                  className="w-full bg-gray-50 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300 min-h-20"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 py-3 rounded-xl font-bold text-white hover:bg-green-700"
              >
                Publier l'annonce
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
