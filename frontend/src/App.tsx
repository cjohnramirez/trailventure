import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import NotFound from "./pages/NotFound.tsx";
import Home from "./pages/Home.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import Experiment from "./pages/Experiment.tsx";
import PackagePage from "./pages/PackagePage.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import UserPage from "./pages/UserPage.tsx";
import { AuthProvider } from "./components/ProtectedRoute/AuthContext.tsx"; // ✅ Use AuthProvider

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/user-page"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/" element={<Home />} />
          <Route path="/search/:location/:startdate/:enddate/:startprice/:endprice" element={<SearchPage />} />
          <Route path="/package/:id" element={<PackagePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/exp" element={<Experiment />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
