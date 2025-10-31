import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string | ReactNode;
  variant?: 'default' | 'success';
  backgroundColor?: string;
  children?: ReactNode; // For additional content below the header (like booking ref)
}

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
  variant = 'default',
  backgroundColor,
  children
}: PageHeaderProps) {
  // Use custom background color if provided, otherwise use variant-based color
  const bgColor = backgroundColor || (variant === 'success' ? 'bg-blue-600' : 'bg-[#3B4044]');
  const iconColor = variant === 'success' ? 'text-blue-600' : 'text-[#3B4044]';

  return (
    <div className={`${bgColor} relative overflow-hidden`}>
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: 'url(/wallpaper.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
      
      {/* Content */}
      <div className="relative px-4 py-6 max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          {/* Icon Container */}
          <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
            <Icon className="w-7 h-7 text-white drop-shadow-lg" strokeWidth={2.5} />
          </div>
          
          {/* Text Content */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white mb-1 drop-shadow-md">
              {title}
            </h1>
            <div className="text-sm text-white/90 drop-shadow-sm">
              {subtitle}
            </div>
          </div>
        </div>

        {/* Optional children content (like booking reference) */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

// Optional: Export a booking reference component for consistency
export function BookingReference({ reference }: { reference: string }) {
  return (
    <div className="bg-white px-3 py-2">
      <div className="flex items-center gap-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Ref:</p>
        <p className="text-sm font-bold text-gray-900 font-mono">{reference}</p>
      </div>
    </div>
  );
}
