import { Routes, Route } from "react-router-dom"
import Landing from './pages/Landing'
import Login from './pages/Login'
import AppPage from "./pages/AppPage"
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"

function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<PublicRoute><MainLayout><Landing /></MainLayout></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><MainLayout><Login /></MainLayout></PublicRoute>} />
          <Route path="/App" element={<ProtectedRoute><MainLayout><AppPage /></MainLayout></ProtectedRoute>} />
      </Routes>
      
    </>
  )
}

export default App
