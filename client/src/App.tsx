import { Routes, Route } from "react-router-dom"
import Landing from './pages/Landing'
import Login from './pages/Login'
import AppPage from "./pages/AppPage"
import MainLayout from './layouts/MainLayout'
import AppShell from "./components/AppShell";
import SlidesPage from "./pages/SlidesPage";
import CreateSlidePage from "./pages/CreateSlidePage";
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"

function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<PublicRoute><MainLayout><Landing /></MainLayout></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><MainLayout><Login /></MainLayout></PublicRoute>} />
          <Route path="/app" element={<ProtectedRoute><MainLayout><AppShell /></MainLayout></ProtectedRoute>} >
            <Route index element={<AppPage />} />
            <Route path="slides" element={<SlidesPage />} />
            <Route path="create" element={<CreateSlidePage />} />
          </Route>
      </Routes>
      
    </>
  )
}

export default App
