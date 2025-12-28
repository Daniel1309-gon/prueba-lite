import React from "react";
import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  ...props
}) => {
  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
};
