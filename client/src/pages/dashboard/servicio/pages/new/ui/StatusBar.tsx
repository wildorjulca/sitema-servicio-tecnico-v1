// services/new/ui/components/StatusBar.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Monitor, Calendar, Save } from "lucide-react";

interface StatusBarProps {
    clienteCompleto: boolean;
    equipoCompleto: boolean;
    motivoCompleto: boolean;
    isSubmitting: boolean;
    isLoading: boolean;
    onSubmit: () => void;
    onCancel?: () => void;
}

export function StatusBar({
    clienteCompleto,
    equipoCompleto,
    motivoCompleto,
    isSubmitting,
    isLoading,
    onSubmit,
    onCancel
}: StatusBarProps) {
    return (
        <Card className="mb-4">
            <CardContent className="p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <StatusItem
                            icon={User}
                            label="Client"
                            completed={clienteCompleto}
                        />
                        <StatusItem
                            icon={Monitor}
                            label="Equipment"
                            completed={equipoCompleto}
                        />
                        <StatusItem
                            icon={Calendar}
                            label="Reason "
                            completed={motivoCompleto}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Botón Cancelar */}
                        {onCancel && (
                            <Button
                                variant="outline"
                                onClick={onCancel}
                                disabled={isSubmitting || isLoading}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </Button>
                        )}

                        {/* Botón Registrar */}
                        {clienteCompleto && equipoCompleto && motivoCompleto && (
                            <Button
                                onClick={onSubmit}
                                disabled={isSubmitting || isLoading}
                                className="bg-[#0A5CB8] hover:bg-[#0A5CB8]/90"
                            >
                                {isSubmitting || isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Registrando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Registrar Servicio
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
function StatusItem({ icon: Icon, label, completed }: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    completed: boolean;
}) {
    return (
        <div className={`flex items-center gap-2 ${completed ? 'text-green-600' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Icon className="h-4 w-4" />
            </div>
            <span className="font-medium">{label}</span>
        </div>
    );
}
