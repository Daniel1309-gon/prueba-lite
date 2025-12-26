import React from 'react';
import { Select } from '../atoms/Select';
import { Label } from '../atoms/Label';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: { value: string | number; label: string }[];
}

export const FormSelect: React.FC<FormSelectProps> = ({ label, name, options, ...props }) => {
  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>
      <Select id={name} name={name} options={options} {...props} />
    </div>
  );
};