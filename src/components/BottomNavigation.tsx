import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 max-w-6xl mx-auto">
      <div className="flex items-center justify-around py-3">
        <button className="flex flex-col items-center space-y-1 text-black">
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </button>
        
        <button className="flex flex-col items-center space-y-1 text-gray-500 hover:text-black transition-colors">
          <Search className="w-6 h-6" />
          <span className="text-xs">Search</span>
        </button>
        
        <button className="flex flex-col items-center space-y-1 text-gray-500 hover:text-black transition-colors relative">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-xs">Cart</span>
          <div className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            3
          </div>
        </button>
        
        <button className="flex flex-col items-center space-y-1 text-gray-500 hover:text-black transition-colors">
          <Heart className="w-6 h-6" />
          <span className="text-xs">Wishlist</span>
        </button>
        
        <button className="flex flex-col items-center space-y-1 text-gray-500 hover:text-black transition-colors">
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}
