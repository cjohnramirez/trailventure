import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./components/Error/NotFound";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import SearchPage from "./pages/SearchPage";
import PackagePage from "./pages/PackagePage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import UserPage from "./pages/UserPage";
import BookingPage from "./pages/BookingPage";
import { useGlobalStore } from "@/components/Contexts/GlobalContext";
import { useEffect } from "react";

function Logout() {
  localStorage.clear();
  window.location.href = "/";
  return <Navigate to="/" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  const { isAuthorized, auth } = useGlobalStore();

  useEffect(() => {
    auth();
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/user-page"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/search/:location/:startdate/:enddate/:startprice/:endprice"
          element={<SearchPage />}
        />
        <Route path="/package/:id" element={<PackagePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
