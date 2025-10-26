import { Star, Eye, Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  rating: number;
  reviews: number;
  isLive: boolean;
  seller: string;
  badge: string;
}

interface ProductGridProps {
  products: Product[];
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        <div className="text-6xl">{product.image}</div>
        
        {/* Live badge */}
        {product.isLive && (
          <div className="absolute top-2 left-2 flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        )}

        {/* Discount badge */}
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          -{product.discount}%
        </div>

        {/* Heart button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute bottom-2 right-2 p-2 rounded-full transition-all duration-200 ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          } shadow-md`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Hover overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <button className="bg-white text-black px-4 py-2 rounded-full font-medium flex items-center space-x-2 transform scale-110 transition-transform">
              <Eye className="w-4 h-4" />
              <span>Quick View</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Badge */}
        <div className="mb-2">
          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            {product.badge}
          </span>
        </div>

        {/* Product name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
          {product.name}
        </h3>

        {/* Seller */}
        <p className="text-sm text-gray-600 mb-2">{product.seller}</p>

        {/* Rating and reviews */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-black">${product.price}</span>
            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
          </div>
        </div>

        {/* Add to cart button */}
        <button className="w-full bg-black text-white py-2.5 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors group-hover:scale-105 transform duration-200">
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div>
      {/* Results header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {products.length} Products Found
        </h2>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black">
          <option>Sort by: Popular</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest First</option>
          <option>Best Rating</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load more button */}
      {products.length > 0 && (
        <div className="flex justify-center mt-12">
          <button className="px-8 py-3 border-2 border-black text-black font-medium rounded-lg hover:bg-black hover:text-white transition-colors duration-200">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
}
