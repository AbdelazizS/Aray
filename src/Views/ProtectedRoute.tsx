import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "../components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Toaster } from "../components/ui/toaster";
import { Loader } from "../components/loader";
import { useAuth } from "../Context/AuthContext";
import { useTranslation } from "react-i18next";
import { redirectImg } from "@/constants";



const ProtectedRoute = () => {

  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);



  const auth = useAuth();
    const { t } = useTranslation(['main']);

  useEffect(() => {
    if (!auth.user) {
      toast({
        title: `${t("redirect_error", {ns:"main"})}`,
        description:`${t("redirect_error_desc", {ns:"main"})}`,
        action: <AlertCircle className="text-red-600 w-6 h-6"></AlertCircle>,
      });
    }

    let redirect = setTimeout(() => {
      setRedirect(true);
      clearTimeout(redirect);
    }, 2000);

    let loading = setTimeout(() => {
      setLoading(true);
      clearTimeout(loading);
    }, 800);
  }, []);

  return auth.user ? (
    <Outlet />
  ) : (
    <>
      <div className="flex items-center justify-center h-screen w-full p-4">
        {loading && <Loader />}

        <img className="w-full h-full object-cover" alt="" src={redirectImg}/>
      </div>
      <Toaster />
      {redirect && <Navigate to={"/auth/login"} />}
    </>
  );
};

export default ProtectedRoute;
