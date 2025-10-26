import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';

interface VideoCardProps {
  username: string;
  description: string;
  music: string;
  likes: string;
  comments: string;
  shares: string;
  avatar: string;
}

export default function VideoCard({
  username,
  description,
  music,
  likes,
  comments,
  shares,
  avatar
}: VideoCardProps) {
  return (
    <div className="relative w-full h-screen flex bg-black snap-start">
      {/* Video Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center">
        <div className="text-white/50 text-6xl">📱</div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-end p-4 w-full text-white">
        {/* Right Action Bar */}
        <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-white">
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
              {avatar}
            </div>
          </div>
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold -mt-2 border-2 border-white">
            +
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            <button className="p-3 rounded-full hover:bg-white/20 transition-colors">
              <Heart className="w-8 h-8" />
            </button>
            <span className="text-xs font-semibold">{likes}</span>
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            <button className="p-3 rounded-full hover:bg-white/20 transition-colors">
              <MessageCircle className="w-8 h-8" />
            </button>
            <span className="text-xs font-semibold">{comments}</span>
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            <button className="p-3 rounded-full hover:bg-white/20 transition-colors">
              <Bookmark className="w-8 h-8" />
            </button>
            <span className="text-xs font-semibold">Save</span>
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            <button className="p-3 rounded-full hover:bg-white/20 transition-colors">
              <Share className="w-8 h-8" />
            </button>
            <span className="text-xs font-semibold">{shares}</span>
          </div>
          
          <div className="w-8 h-8 bg-gray-800 rounded-lg animate-spin-slow">
            <div className="w-full h-full bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg"></div>
          </div>
        </div>
        
        {/* Bottom Info */}
        <div className="pb-6 pr-20">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-bold text-lg">@{username}</h3>
            <button>
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm mb-2 line-clamp-2">{description}</p>
          <div className="flex items-center space-x-1 text-sm">
            <span>♪</span>
            <span className="truncate">{music}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
