// components/ui/SelectWithCheckbox.tsx
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SelectWithCheckboxProps {
  value: string | number | null;
  onValueChange: (value: string | number | null) => void;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  label?: string;
  className?: string;
}

export const SelectWithCheckbox = ({
  value,
  onValueChange,
  options,
  placeholder = "Seleccionar opción",
  label,
  className
}: SelectWithCheckboxProps) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      
      <Select
        value={value ? value.toString() : "all"}
        onValueChange={(selectedValue) => {
          onValueChange(selectedValue === "all" ? null : selectedValue);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        
        <SelectContent>
          {/* Opción "Todas" */}
          <SelectItem value="all">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border rounded flex items-center justify-center">
                {value === null && <Check className="h-3 w-3 text-primary" />}
              </div>
              <span>Seleccione su Filtro</span>
            </div>
          </SelectItem>

          {/* Opciones personalizadas */}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border rounded flex items-center justify-center">
                  {value?.toString() === option.value.toString() && (
                    <Check className="h-3 w-3 text-primary" />
                  )}
                </div>
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};