// components/PanelNotificaciones.tsx
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle2 } from "lucide-react"
import { AlertasPanel } from "./AlertasPanel"
import { useNotificaciones } from "@/hooks/useNotifications"

export const PanelNotificaciones = () => {
    const {
        alertasNoLeidas,
        marcarTodasComoLeidas
    } = useNotificaciones();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-6 w-6" />
                    {alertasNoLeidas > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                            {alertasNoLeidas}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notificaciones
                            {alertasNoLeidas > 0 && (
                                <Badge variant="secondary">{alertasNoLeidas}</Badge>
                            )}
                        </div>

                        {alertasNoLeidas > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={marcarTodasComoLeidas}
                                className="h-8 gap-1"
                            >
                                <CheckCircle2 className="h-3 w-3" />
                                Marcar todas
                            </Button>
                        )}
                    </SheetTitle>

                </SheetHeader>

                <div className="mt-6">
                    <AlertasPanel />
                </div>
            </SheetContent>
        </Sheet>
    )
}