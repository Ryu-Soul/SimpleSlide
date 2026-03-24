import { Routes, Route } from "react-router-dom"
import Landing from './pages/Landing'
import Login from './pages/Login'
import AppPage from "./pages/AppPage"
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/App" element={<ProtectedRoute><MainLayout><AppPage /></MainLayout></ProtectedRoute>} />
      </Routes>
      
    </>
  )
}

export default App
