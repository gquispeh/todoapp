import React from 'react';

// Tipos para props más robustos
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'gradient';
}

export const Card = ({ 
  children, 
  className = "", 
  variant = 'default',
  ...rest 
}: CardProps) => {
  // Variantes de estilos predefinidas
  const variantStyles = {
    default: 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700',
    elevated: 'bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-800',
    bordered: 'border-2 border-primary-500 dark:border-primary-400',
    gradient: 'bg-gradient-to-br from-primary-100 to-primary-200 dark:from-gray-800 dark:to-gray-900'
  };

  return (
    <div 
      className={`
        rounded-xl 
        overflow-hidden 
        transition-all 
        duration-300 
        ${variantStyles[variant]} 
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ 
  children, 
  className = "",
  ...rest 
}: CardProps) => {
  return (
    <div 
      className={`
        px-6 
        py-4 
        border-b 
        border-gray-200 
        dark:border-gray-700 
        bg-gray-50 
        dark:bg-gray-900/30 
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ 
  children, 
  className = "",
  ...rest 
}: CardProps) => {
  return (
    <div 
      className={`
        p-6 
        space-y-4 
        text-gray-700 
        dark:text-gray-300 
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
};

export const CardFooter = ({ 
  children, 
  className = "",
  ...rest 
}: CardProps) => {
  return (
    <div 
      className={`
        px-6 
        py-4 
        border-t 
        border-gray-200 
        dark:border-gray-700 
        bg-gray-50 
        dark:bg-gray-900/30 
        flex 
        justify-end 
        items-center 
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
};

// Componente de título para consistencia
export const CardTitle = ({ 
  children, 
  className = "",
  ...rest 
}: CardProps) => {
  return (
    <h3 
      className={`
        text-xl 
        font-semibold 
        text-gray-900 
        dark:text-white 
        ${className}
      `}
      {...rest}
    >
      {children}
    </h3>
  );
};