import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from "./Pages/LandingPage"
import Dashboard from './Pages/Dashboard'
import { ThemeProvider } from "./contexts/ThemeContext"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
