// services/new/ui/components/CustomerCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, X } from 'lucide-react';
import { CustomerUI } from '../types';

interface CustomerCardProps {
  customer: CustomerUI;
  onClearSelection: () => void;
}

export function CustomerCard({ customer, onClearSelection }: CustomerCardProps) {
  return (
    <Card className="border-green-200 bg-green-50 ">
      <CardContent className="p-2 flex justify-between ml-3 items-center">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <User className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-800">
              {customer.nombre} {customer.apellidos}
            </h4>
            <p className="text-sm font-sans font-medium">
              {customer.numero_documento}
            </p>
          </div>
        </div>
        <div>
          <Button variant="secondary" onClick={onClearSelection}>
            <X />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}