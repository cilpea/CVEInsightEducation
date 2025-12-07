import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
      default:
        return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return '-bottom-1 left-1/2 -translate-x-1/2 border-t-0 border-l-0 bg-cyber-900';
      case 'bottom':
        return '-top-1 left-1/2 -translate-x-1/2 border-b-0 border-r-0 border-t border-l bg-cyber-900';
      case 'left':
        return '-right-1 top-1/2 -translate-y-1/2 border-b-0 border-l-0 border-t border-r bg-cyber-900';
      case 'right':
        return '-left-1 top-1/2 -translate-y-1/2 border-t-0 border-r-0 border-b border-l bg-cyber-900';
      default:
        return '-bottom-1 left-1/2 -translate-x-1/2 border-t-0 border-l-0 bg-cyber-900';
    }
  };

  return (
    <div 
      className={`relative flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 px-3 py-2 text-xs font-medium text-white bg-cyber-900 border border-cyber-700 rounded-md shadow-xl w-max max-w-[200px] sm:max-w-xs whitespace-normal text-center leading-relaxed animate-fade-in ${getPositionClasses()}`}>
          {content}
          <div className={`absolute w-2 h-2 bg-cyber-900 border-r border-b border-cyber-700 transform rotate-45 ${getArrowClasses()}`}></div>
        </div>
      )}
    </div>
  );
};