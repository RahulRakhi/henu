import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <img 
          src="/mlogo.png" 
          alt="HENU OS Logo" 
          className={`${sizeClasses[size]} object-contain drop-shadow-lg filter brightness-110 contrast-125`}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 16px rgba(236, 72, 153, 0.4))'
          }}
        />
        {/* Glowing effect */}
        <div 
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full opacity-30 animate-pulse`}
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, rgba(236, 72, 153, 0.6) 50%, transparent 100%)',
            filter: 'blur(4px)'
          }}
        />
      </div>
      {showText && (
        <span className="text-2xl font-heading font-bold bg-gradient-to-r from-purple-400 via-pink-400 via-cyan-400 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
          HENU OS
        </span>
      )}
    </div>
  );
};

export default Logo; 