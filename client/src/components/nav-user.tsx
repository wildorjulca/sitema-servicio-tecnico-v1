// components/NavUser.tsx
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  AlertTriangle,
  AlertCircle,
  Info
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/hooks/useUser"
import { useLogout } from "@/routes/logout"
import { Link } from "react-router-dom"
import { useNotificaciones } from "@/hooks/useNotifications"

export function NavUser() {
  const { user } = useUser();
  const { isMobile } = useSidebar()
  const logout = useLogout();

  // Usar el hook de notificaciones
  const {
    alertasNoLeidas,
    contarAlertasPorTipo,
    marcarTodasComoLeidas
  } = useNotificaciones();

  const contadores = contarAlertasPorTipo();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {user?.nombre?.charAt(0)}{user?.apellidos?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.nombre} {user?.apellidos}</span>
                <span className="truncate text-xs">{user?.rol}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {user?.nombre?.charAt(0)}{user?.apellidos?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.nombre} {user?.apellidos}</span>
                  <span className="truncate text-xs flex items-center gap-2">
                    <BadgeCheck color="green" size={14} />
                    {user?.rol}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="h-4 w-4 mr-2" />
                <Link to="perfil" className="flex-1">
                  Mi Cuenta
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="relative"
                onClick={marcarTodasComoLeidas}
              >
                <Bell className="h-4 w-4 mr-2" />
                <span className="flex-1">Notificaciones</span>

                {/* Badge con contador de alertas no leídas */}
                {alertasNoLeidas > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {alertasNoLeidas}
                  </Badge>
                )}

                {/* Submenú de estadísticas de alertas */}
                <div className="absolute left-full ml-2 hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 min-w-32 border">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span>Críticas: {contadores.error}</span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Advertencias: {contadores.warning}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                      <Info className="h-3 w-3" />
                      <span>Información: {contadores.info}</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}