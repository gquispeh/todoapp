import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string; // Opcional, para estilos adicionales
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 font-semibold rounded-lg transition duration-200 ${
        disabled ? "bg-gray-300 cursor-not-allowed" : "hover:opacity-90"
      } ${className}`} // Estilos base + clases adicionales
    >
      {children}
    </button>
  );
};

export default Button;