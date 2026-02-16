import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-zim-green hover:bg-green-800 text-white shadow-lg shadow-green-900/10 focus:ring-zim-green",
    secondary: "bg-zim-black hover:bg-stone-800 text-white focus:ring-stone-500",
    outline: "border-2 border-zim-green text-zim-green hover:bg-green-50 focus:ring-zim-green",
    ghost: "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
    premium: "bg-gradient-to-r from-zim-yellow to-yellow-500 text-zim-black hover:brightness-110 shadow-lg shadow-yellow-500/20"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};