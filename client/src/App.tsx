import { Toaster } from 'react-hot-toast'
import './App.css'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { AppSidebar } from "@/components/app-sidebar"

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <p>z</p>
        </main>
      </SidebarProvider>
    </>
  )
}

export default App
