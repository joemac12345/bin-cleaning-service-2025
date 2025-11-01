'use client';

import { useRouter } from 'next/navigation';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
  className?: string;
}

export default function Logo({ size = 'medium', clickable = false, className = '' }: LogoProps) {
  const router = useRouter();
  
  const sizeClasses = {
    small: 'text-lg sm:text-xl',
    medium: 'text-2xl sm:text-3xl',
    large: 'text-4xl sm:text-5xl'
  };

  const handleClick = () => {
    if (clickable) {
      router.push('/');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`font-bold tracking-wide ${sizeClasses[size]} ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
    >
      <span className="text-white">The</span>
      <span className="text-blue-500">binguy</span>
    </div>
  );
}
