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

function App() {
  useEffect(() => {
    AOS.init();
  }, []);
  document.body.dir = i18next.dir();
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/academies" element={<AcademiesPagePage />} />
            <Route path="/activity/:id" element={<DetailsPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}


export default App;
