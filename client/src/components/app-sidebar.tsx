
import * as React from "react"
import {
    BookOpen,
    Box,
    Frame,
    Map,
    PieChart,
    Settings,
    Settings2,
    ShieldCheck,

    Wrench,
} from "lucide-react"

// import { NavMain } from "@/components/nav-main"
import { NavMain } from "./nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"

// import { NavUser } from "@/components/nav-user"
// import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"



// This is sample data.
const data = {
    user: {
        name: "Admin",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
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
            icon: ShieldCheck ,
            isActive: true,
            items: [
                {
                    title: "Lista Cliente",
                    url: "cliente",
                },
                {
                    title: "Marca",
                    url: "marca",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Asignar Roles",
            url: "#",
            icon: Box,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
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
        {
            title: "Servicio",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "listado del servicio",
                    url: "servicio",
                },
                {
                    title: "Nuevo servicio",
                    url: "servicio/nuevo",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
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
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
