import {  Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import PeoplePage from "./pages/PeoplePage"
import RegisterPage from "./pages/RegisterPage"
import FinancialCoverPage from "./pages/FinancialCoverPage"


function App() {
  return (
   
      <Routes>
        <Route path="/" element={<FinancialCoverPage />} />
       <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/people" element={<PeoplePage />} />
      </Routes>
   
  )
}

export default App
