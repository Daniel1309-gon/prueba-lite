import React from "react";
import { Select } from "../atoms/Select";
import { Label } from "../atoms/Label";

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  items: { value: string | number; label: string }[];
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  items,
  ...props
}) => {
  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>
      <Select id={name} name={name} items={items} {...props} />
    </div>
  );
};
