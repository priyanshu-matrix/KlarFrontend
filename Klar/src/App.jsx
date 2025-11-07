import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from "./Pages/LandingPage"
import Dashboard from "./Pages/Dashboard"
import Login from "./Components/Login"
import Signup from './Components/Signup'
import ProtectedRoute from './Components/ProtectedRoute'
import PublicRoute from './Components/PublicRoute'
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider } from "./contexts/AuthContext"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
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
