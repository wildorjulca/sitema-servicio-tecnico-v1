import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';

import { Separator } from "@/components/ui/separator";
import { ModeToggle } from '@/components/mode-toggle';
import BreadcrumbDinamico from '@/components/Breadcrumb/BreadcrumbDinamico';

const DashboardLayout: React.FC = () => {
  return (
    <>
      <SidebarProvider>
        {/* barra del sidebar */}
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              
              {/* Breadcrumb dinámico */}
              <div className="flex flex-1 items-center justify-between">
                <BreadcrumbDinamico />
                <ModeToggle />
              </div>
            </div>
          </header>
          
          {/* main que se va a renderizar */}
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;