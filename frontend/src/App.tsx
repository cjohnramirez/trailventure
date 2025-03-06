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
import { useGetStore } from "@/components/Contexts/GetContext";
import { useEffect } from "react";
import Loading from "./components/Loading/Loading";

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
  const auth = useGetStore((state) => state.auth);
  const loading = useGetStore((state) => state.loading);

  useEffect(() => {
    auth();
  }, []);

  if (loading) {
    return <Loading />;
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
          path="/booking/:tourpackage/:tourpackagetype/:numofperson/:booking-date/"
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
        <Route path="/loading" element={<Loading />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
