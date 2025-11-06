import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from "./Pages/LandingPage"
import Dashboard from "./Pages/Dashboard"
import Login from "./Components/Login"
import Signup from './Components/Signup'
import ProtectedRoute from './Components/ProtectedRoute'
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider } from "./contexts/AuthContext"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
