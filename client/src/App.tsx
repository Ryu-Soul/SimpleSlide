import { Routes, Route } from "react-router-dom"
import Landing from './pages/Landing'
import Login from './pages/Login'
import MainLayout from './layouts/MainLayout'

function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
      </Routes>
      
    </>
  )
}

export default App
