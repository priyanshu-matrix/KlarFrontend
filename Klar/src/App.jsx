import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from "./Pages/LandingPage"
import { ThemeProvider } from "./contexts/ThemeContext"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
