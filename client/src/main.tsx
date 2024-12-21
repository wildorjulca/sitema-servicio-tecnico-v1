import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/AppRoutes.tsx'
import { ThemeProvider } from './components/proveedor-de-tema.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AppRoutes />
  </ThemeProvider>
  // <BrowserRouter>
  //   <App />
  // </BrowserRouter>
)
