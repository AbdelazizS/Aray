import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import i18next from "i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthProvider from "./Context/AuthContext";
import HomePage from "./Views/HomePage";
import LoginPage from "./Views/Auth/LoginPage";
import RegisterPage from "./Views/Auth/RegisterPage";
import { useEffect } from "react";
import AcademiesPagePage from "./Views/AcademiesPage";
import DetailsPage from "./Views/DetailsPage";
import ScrollToTop from "./hooks/ScrollToTop";
import ProtectedRoute from "./Views/ProtectedRoute";
import PaymentsPage from "./Views/PaymentsPage";
import HistoryPage from "./Views/HistoryPage";

function App() {
  useEffect(() => {
    AOS.init();
  }, []);
  document.body.dir = i18next.dir();
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/academies" element={<AcademiesPagePage />} />
            <Route path="/activity/:id" element={<DetailsPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/payments" element={<PaymentsPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/history" element={<HistoryPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
