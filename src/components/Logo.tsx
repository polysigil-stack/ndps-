import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  collapsed?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
  collapsed = false,
}) => {
  const containerSizes = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const markDimensions = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Soft Ivory & Slate Monogram */}
      <div
        className={`${containerSizes[size]} shrink-0 flex items-center justify-center`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 32 32"
          width={markDimensions[size]}
          height={markDimensions[size]}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer geometric enclosure */}
          <rect
            x="1.5"
            y="1.5"
            width="29"
            height="29"
            rx="6.5"
            fill="#2A2A2A"
            stroke="#3A3A3A"
            strokeWidth="1.2"
          />

          {/* Minimalist Precision Geometric 'N' Monogram in #ECECEC Soft Off-White */}
          <path
            d="M7 6.5C7 6.22 7.22 6 7.5 6H10.5C10.82 6 11.11 6.18 11.26 6.47L20.74 21.53V6.5C20.74 6.22 20.96 6 21.24 6H24.5C24.78 6 25 6.22 25 6.5V25.5C25 25.78 24.78 26 24.5 26H21.5C21.18 26 20.89 25.82 20.74 25.53L11.26 10.47V25.5C11.26 25.78 11.04 26 10.76 26H7.5C7.22 26 7 25.78 7 25.5V6.5Z"
            fill="#ECECEC"
          />

          {/* Subtle Neutral Node */}
          <circle
            cx="16"
            cy="16"
            r="1.2"
            fill="#8E8E8E"
          />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col text-left min-w-0">
          <span className="font-semibold text-[13.5px] text-[#ECECEC] tracking-tight leading-none truncate">
            NDPS Intelligence
          </span>
          {showSubtitle && (
            <span className="text-[11px] text-[#B4B4B4] font-medium mt-1 truncate">
              Investigation • Procedure • Legal Reference
            </span>
          )}
        </div>
      )}
    </div>
  );
};
