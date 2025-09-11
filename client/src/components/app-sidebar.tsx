
import * as React from "react"
import {
    BookOpen,
    Box,
    Frame,
    Settings,
    Settings2,
    ShieldCheck,
    Wrench,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"



// This is sample data.
const data = {

    teams: [
        {
            name: "Inforsystem Computec",
            logo: Wrench,
            plan: "Soporte & Reparación",
        },
    ],
    navMain: [
        {
            title: "Administracion",
            url: "#",
            icon: ShieldCheck,
            isActive: true,
            items: [
                {
                    title: "Clientes",
                    url: "cliente",
                },
                {
                    title: "Marca",
                    url: "marca",
                },
                {
                    title: "Equipo",
                    url: "equipo",
                },
                {
                    title: "Categoria",
                    url: "cat",
                },
                {
                    title: "Tipo Documento",
                    url: "tipo_doc",
                },
                {
                    title: "Motivo Ingreso",
                    url: "mot_ingreso",
                },
                {
                    title: "Productos",
                    url: "producto",
                },
                {
                    title: "Usuarios",
                    url: "users",
                }

            ],
        },
        {
            title: "Servicio",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Servicio Equipos",
                    url: "serv_e",
                },
                {
                    title: "listado del servicio",
                    url: "list",
                },
                {
                    title: "Nuevo servicio",
                    url: "new",
                },
            ],
        },
        {
            title: "Autorización",
            url: "#",
            icon: Box,
            items: [
                {
                    title: "Roles Asignados",
                    url: "#",
                },
                {
                    title: "Rol",
                    url: "roles",
                },
                {
                    title: "Permisos",
                    url: "permiso",
                },
            ],
        },
        {
            title: "Documentación",
            url: "#",
            icon: BookOpen,
            items: [
                { title: "Introducción", url: "documentacion" },
                { title: "Clientes", url: "/docs/clientes" },
                { title: "Reparaciones", url: "/docs/reparaciones" },
                { title: "Reportes", url: "/docs/reportes" },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },

    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        }
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
