import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./components/Error/NotFound";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import PackagePage from "./pages/TourPackagePage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import UserPage from "./pages/UserPage";
import BookingPage from "./pages/BookingPage";
import { useGetStore } from "@/components/Contexts/AuthStore";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookingCancelled from "./components/Pages/BookingPage/BookingCancelled";
import BookingSuccessful from "./components/Pages/BookingPage/BookingSuccessful";
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

const queryClient = new QueryClient();

function App() {
  const auth = useGetStore((state) => state.auth);
  const role = useGetStore((state) => state.role);
  const loading = useGetStore((state) => state.loading);

  useEffect(() => {
    auth();
  }, []);

  useEffect(() => {
    if (loading) {
      loadingScreen();
    }
  }, [loading]);

  function loadingScreen() {
    return <Loading loadingMessage="Loading Trailventure" />;
  }

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {role === "customer" || role === null ? (
            <>
              <Route
                path="/user-page"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <UserPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking/:tourpackageId/:tourpackagetype/:numofperson/:startdate/"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking/cancelled/:id/"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <BookingCancelled />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking/success/:id/"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <BookingSuccessful />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Home />} />
              <Route
                path="/search/:location/:startdate/:enddate/:startprice/:endprice/:pageNumber"
                element={<SearchPage />}
              />
              <Route path="/package/:id" element={<PackagePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<RegisterAndLogout />} />
              <Route path="*" element={<NotFound />} />
            </>
          ) : (
            <></>
          )}
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
