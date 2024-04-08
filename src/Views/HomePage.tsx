import  { useEffect, useState } from "react";
import { NavBar } from "@/components/Navbar";

import { Activites } from "../components/Activites";
import { ScrollToTop } from "../components/ScrollToTop";
import { Academies } from "../components/Academies";
import { Hero } from "../components/Hero";
import { Loader } from "../components/loader";
import PreLoaderPage from "./PreLoader";
import { useAuth } from "../Context/AuthContext";


export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(true);
  const auth = useAuth();


  useEffect(()=> {
    const timeout = setTimeout(() => {
      setHide(false)
      clearTimeout(timeout)
    }, 1500);
  } ,[])

  return (
    <>
      {auth.user && hide && <PreLoaderPage message={"welcome"} />}
      {loading && <Loader />}
        <NavBar setLoading={setLoading} />
        <Hero />
        <Academies />
        <Activites />
        <ScrollToTop />
    </>
  );
}
