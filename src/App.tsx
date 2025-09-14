import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import PeoplePage from "./pages/PeoplePage"
import RegisterPage from "./pages/RegisterPage"
import FinancialCoverPage from "./pages/FinancialCoverPage"
import NotFound from "./pages/NotFound"
import LandingPage from "./pages/LandingPage"
import AdminHome from "./pages/AdminHome"
import ManagerHome from "./pages/ManagerHome";
import EmployeeHome from "./pages/EmployeeHome";
import EmployeeListPage from "./pages/EmployeeListPage"


function App() {
  return (
    <Routes>
      <Route path="/" element={<FinancialCoverPage />} />
      <Route path="/roles" element={<LandingPage />} />
      <Route path="/login/:role" element={<LoginPage />} />
       
      <Route path="/manager-home" element={<ManagerHome />} />
      <Route path="/manager-home/gst" element={<PeoplePage />} />
      <Route path="/manager-home/itr" element={<PeoplePage />} />
      <Route path="/manager-home/mca" element={<PeoplePage />} />
      <Route path="/manager-home/employees" element={<EmployeeListPage />} />

      <Route path="/employee-home" element={<EmployeeHome />} />
      <Route path="/employee-home/gst" element={<PeoplePage />} />
      <Route path="/employee-home/itr" element={<PeoplePage />} />
      <Route path="/employee-home/mca" element={<PeoplePage />} />
      <Route path="/admin-home" element={<AdminHome />} />
 
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/people" element={<PeoplePage />} />
        <Route path="/incometax" element={<PeoplePage />} />
        <Route path="/gst" element={<PeoplePage />} />
        <Route path="/mca" element={<PeoplePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
