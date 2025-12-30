import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  items: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ items, ...props }) => {
  return (
    <select
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      {...props}
    >
      <option value=""> Seleccione una opción...</option>
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};
