"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Phone, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Loader } from "@/components/loader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import { useTranslation } from "react-i18next";
import { loginImg } from "@/constants";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function LoginPage() {
  axios.defaults.baseURL = "https://api.aray.tarhil.com/";

  useEffect(() => {
    if (auth.user) {
      return navigate("/");
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const auth = useAuth();

  const { t } = useTranslation(["forms", "main"]);

  const navigate = useNavigate();
  const location = useLocation();

  const FormSchema = z.object({
    phone: z.string().min(10, {
      message: `${t("phone_err", { ns: "forms" })}`,
    }),
    password: z.string().min(6, {
      message: `${t("password_err", { ns: "forms" })}`,
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: location.state ? location.state.phone_no : "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    axios
      .post("auth/login", {
        phone_no: data.phone,
        password: data.password,
      })
      .then((response) => {
        if (response.status === 200 || 201) {
          auth.loginAction(response.data);
          toast({
            title: `${t("logged_in_msg", { ns: "forms" })}`,
            description: `${t("logged_in_msg_desc", { ns: "forms" })}`,
            action: (
              <CheckCircle2 className="text-green-600 w-6 h-6"></CheckCircle2>
            ),
          });
          const redirect = setInterval(() => {
            window.location.href = "/";
            clearInterval(redirect);
            setLoading(false);
          }, 1200);
        }
      })
      .catch((error) => {
        console.log(error);

        setLoading(false);
        if (error.response) {
          setErrorMsg(t(`${error.response.data.message}`, { ns: "main" }));
        } else {
          toast({
            title: `${t("network_error", { ns: "main" })}`,
            description: `${t("network_error_desc", { ns: "main" })}`,
            action: (
              <AlertCircle className="text-red-600 w-6 h-6"></AlertCircle>
            ),
          });
        }
      })
      .finally(() => {
        let timeout = setTimeout(() => {
          setErrorMsg("");
          clearTimeout(timeout);
        }, 3000);
      });
    // await auth.loginAction(values: z.infer<typeof FormSchema>).then((res:any) => {
    //   if (res.status === 200 || 201) {
    //     toast({
    //       title: `${t("logged_in_msg", { ns: "forms" })}`,
    //       description: `${t("logged_in_msg_desc", { ns: "forms" })}`,
    //       action: (
    //         <CheckCircle2 className="text-green-600 w-6 h-6"></CheckCircle2>
    //       ),
    //     });
    //     const redirect = setInterval(() => {
    //       window.location.href = "/";
    //       clearInterval(redirect);
    //       setLoading(false);
    //     }, 1200);
    //   }
    // });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen overflow-hidden">
      {loading && <Loader />}
      <div
        className="hidden lg:flex items-center justify-center flex-1 "
        data-aos-duration="800"
        data-aos="fade-up"
      >
        <div className="max-w-sm">
          <div className="hidden lg:flex items-center justify-center flex-1 ">
            <div className="max-w-md w-96">
              <img src={loginImg} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-muted/40 dark:bg-transparent  flex items-center justify-center p-4">
        <Toaster />
        <div
          className="max-w-sm w-full text-gray-600"
          data-aos-duration="1000"
          data-aos="fade-left"
        >
          <div className="mt-5">
            <h3 className="text-foreground text-2xl font-bold sm:text-3xl">
              {t("login_welcome", { ns: "forms" })}
            </h3>
            <p className="text-muted-foreground">
              {t("login_welcome_desc", { ns: "forms" })}
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-5 space-y-6"
            >
              {errorMsg && (
                <p className="text-destructive font-medium transition duration-00 md:text-lg">
                  {errorMsg}
                </p>
              )}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }: any) => (
                  <FormItem>
                    <div className="flex items-center bg-muted border shadow-sm ps-2 rounded-md">
                      <Phone className="w-5 h-5 font-bold transform before:inset-y-0 end-0 bottom-2 me-1 flex items-center" />
                      <FormControl className="outline-0 ring-0">
                        <Input
                          placeholder={t("phone", { ns: "forms" })}
                          {...field}
                          className="bg-muted border-0 rounded-none writing-lr rtl:text-right"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }: any) => (
                  <FormItem>
                    <div className="flex items-center bg-muted relative border shadow-sm  rounded-md">
                      <FormControl className="outline-0 ring-0">
                        <Input
                          type={showPass ? "text" : "password"}
                          placeholder={`${t("password_field", {
                            ns: "forms",
                          })}`}
                          {...field}
                          className="bg-muted border-0 rounded-none"
                        />
                      </FormControl>
                      <div
                        className="transform before:inset-y-0 end-0 bottom-2 ms-1 me-1 flex items-center cursor-pointer max-h-max"
                        onClick={() => {
                          setShowPass((prev) => !prev);
                        }}
                      >
                        {showPass && <Eye className="w-5 h-5 " />}
                        {!showPass && (
                          <EyeOff className="w-5 h-5 font-bold text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <FormMessage />

                    <div className="text-muted-foreground mt-0">
                      {t("change_password", { ns: "forms" })}
                      <Link
                        to={"/auth/reset-password"}
                        className="font-medium hover:underline text-primary hover:text-primary-500 mt-0"
                      >
                        {" "}
                        {t("reset_password", { ns: "forms" })}
                      </Link>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {t("submit", { ns: "forms" })}
              </Button>
            </form>
            <div className="text-muted-foreground mt-2">
              {t("create_my_account", { ns: "forms" })}
              <Link
                to={"/auth/register"}
                className="font-medium hover:underline text-primary hover:text-primary-500 mt-0"
              >
                {" "}
                {t("sign_up", { ns: "forms" })}
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
