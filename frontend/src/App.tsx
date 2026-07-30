import { Navigate, Route, Routes } from "react-router-dom"
import { AuthLayout } from "./layouts/AuthLayout"
import { Login } from "./pages/auth/Login"
import { Register } from "./pages/auth/Register"
import { MainLayout } from "./layouts/Main"
import { Home } from "./pages/home/Home"

function App() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Main Application Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App

