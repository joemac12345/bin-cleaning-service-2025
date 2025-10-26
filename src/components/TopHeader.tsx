import { Users, Tv } from 'lucide-react';

export default function TopHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-40 px-4 py-2">
      <div className="flex items-center justify-between">
        <button className="flex items-center space-x-1 text-gray-300">
          <Users className="w-5 h-5" />
          <span className="text-sm font-medium">Following</span>
        </button>
        
        <div className="flex items-center space-x-1">
          <Tv className="w-6 h-6 text-white" />
          <span className="text-xl font-bold text-white tracking-wider">TikTok</span>
        </div>
        
        <button className="text-white text-sm font-medium">
          For You
        </button>
      </div>
    </div>
  );
}
