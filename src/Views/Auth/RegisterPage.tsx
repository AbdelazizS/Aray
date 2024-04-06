import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Image,
  Mail,
  User,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/Context/AuthContext";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader } from "@/components/loader";
import { isValidPhoneNumber } from "react-phone-number-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { registerImg } from "@/constants";

export default function RegisterPage() {
  // if (!location.state) {
  //   return Navigate({ to: "/auth/verify" });
  // }

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPassConf, setShowPassConf] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const auth = useAuth();

  axios.defaults.baseURL = "https://api.aray.tarhil.com/";

  const navigate = useNavigate();

  const { t } = useTranslation(["forms", "main"]);

  const passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  );

  const FormSchema = z
    .object({
      phone: z.string().refine(isValidPhoneNumber, {
        message: `${t("phone_no_error", { ns: "forms" })}`,
      }),
      user: z.string().min(3, {
        message: `${t("username_error", { ns: "forms" })}`,
      }),
      email: z
        .string()
        .email({ message: `${t("email_error", { ns: "forms" })}` }),
      gender: z.string({}).min(1),
      password: z
        .string()
        .min(8, { message: `${t("password_err", { ns: "forms" })}` })
        .regex(passwordValidation, {
          message: `${t("passwordRegx_err", { ns: "forms" })}`,
        }),
      confirmPassword: z.string(),
      file: z.custom<File>((v) => v instanceof File, {
        message: `${t("profileImg_err", { ns: "forms" })}`,
      }),
      // .min(6, { message: "Password must be at least 6 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: `${t("passwordConf_err", { ns: "forms" })}`,
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user: "",
      email: "",
      phone: "",
      gender: "",
      password: "",
      confirmPassword: "",
      file: undefined,
    },
  });

  axios.defaults.baseURL = "https://api.aray.tarhil.com/";

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    // if (location.state) {};
    // const phone_num = location.state.phone_no;

    const formData = new FormData();
    formData.append("name", data.user);
    formData.append("image", data.file);
    formData.append("gender", data.gender);
    formData.append("phone_no", data.phone);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("status", "active");
    formData.append("user_type", "user");
    axios
      .post("user/add-user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": auth.token,
        },
      })
      .then((res) => {
        let timeout = setTimeout(() => {
          setLoading(false);
          clearTimeout(timeout);
          navigate("/auth/login", {
            state: { phone_no: data.phone },
          });
        }, 1000);
        if (res.status === 200 || 201) {
          toast({
            title: `${t("user_register", { ns: "main" })}`,
            description: `${t("user_register_desc", { ns: "main" })}`,
            action: (
              <CheckCircle2 className="text-green-600 w-6 h-6"></CheckCircle2>
            ),
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          if (
            error.response.data.message.includes(
              "You can`t use this phone number"
            )
          ) {
            setErrorMsg(`${t("phone_exist", { ns: "main" })}`);
          }
          if (error.response.data.error) {
            setErrorMsg(`${t("email_unvalid", { ns: "main" })}`);
          }
        } else {
          toast({
            title: `${t("network_error", { ns: "main" })}`,
            description: `${t("network_error_desc", { ns: "main" })}`,
            action: (
              <AlertCircle className="text-red-600 w-6 h-6"></AlertCircle>
            ),
          });
        }
        console.log(error.response.data);
      })
      .finally(() => {
        let timeout = setTimeout(() => {
          setErrorMsg("");
          clearTimeout(timeout);
        }, 3000);
      });
  };

  return (
    <>
      <Toaster />
      {loading && <Loader />}
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        <div className="w-full bg-muted/40 dark:bg-transparent  flex items-center justify-center p-4">
          <div
            className="max-w-md md:max-w-lg w-full space-y-5"
            data-aos-duration="1000"
            data-aos="fade-right"
          >
            <div className="mt-5">
              <h3 className="text-primary text-xl font-bold sm:text-2xl">
                {t("register_welcome", { ns: "forms" })}
              </h3>
              <p className="text-muted-foreground">
                {t("register_welcome_desc", { ns: "forms" })}
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-5 max-w-md md:max-w-lg mx-auto  space-y-6"
              >
                {errorMsg && (
                  <p className="text-destructive font-medium md:text-lg">
                    {errorMsg}
                  </p>
                )}
                <FormField
                  control={form.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center bg-muted border shadow-sm ps-2 rounded-md">
                        <User className="w-5 h-5 font-bold transform before:inset-y-0 end-0 bottom-2 me-1 flex items-center" />
                        <FormControl className="outline-0 ring-0">
                          <Input
                            placeholder={`${t("username", { ns: "forms" })}`}
                            {...field}
                            className="bg-muted border-0 rounded-none"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col items-start">
                      <FormLabel className="text-left">
                        {t("phone_no_label", { ns: "forms" })}
                      </FormLabel>
                      <FormControl className="w-full ">
                        <PhoneInput
                          placeholder={t("phone_no_placeholder", {
                            ns: "forms",
                          })}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center bg-muted border shadow-sm rounded-md px-2 relative">
                      <Phone className="w-5 h-5 font-bold" />
                      <FormControl className="outline-0 ring-0">
                        <Input
                          placeholder={`${t("phone", { ns: "forms" })}`}
                          {...field}
                          className="bg-muted border-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <div className="flex items-center bg-muted relative border shadow-sm ps-2 rounded-md">
                        <Mail className="w-5 h-5 font-bold transform before:inset-y-0 end-0 bottom-2 me-1 flex items-center" />
                        <FormControl className="outline-0 ring-0">
                          <Input
                            placeholder={`${t("email", { ns: "forms" })}`}
                            {...field}
                            className="w-full rounded-none bg-muted border-0 flex-grow"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                      {/* <div className="bg-primary text-white rounded-md absolute  py-.5 px-1  transform  text-muted-foreground  inset-y-0 end-0 bottom-2 me-1 flex items-center pointer-events-none max-h-max">
                      {`${t("optional", { ns: "forms" })}`}
                    </div> */}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <div className="flex items-center bg-muted relative border shadow-sm ps-2 rounded-md">
                        <FormLabel className="font-bold transform before:inset-y-0 end-0 bottom-2 me-1 flex items-center w-full">
                          <Image className="w-5 h-5 font-bold transform before:inset-y-0 end-0 bottom-2 me-1 flex items-center" />

                          {t("profile_image", {
                            ns: "forms",
                          })}
                        </FormLabel>
                        
                        <FormControl className="outline-0 ring-0">
                          <Input
                            // required
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                            type="file"
                            className="bg-muted border-0 opacity-0"
                          />
                        </FormControl>

                        {field.value && (
                          <CheckCircle2 className="w-4 h-4 text-green-600 absolute font-bold transform before:inset-y-0 end-0  me-1 flex items-center" />
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
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
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <div className="flex items-center bg-muted relative border shadow-sm rounded-md">
                        <FormControl className="outline-0 ring-0">
                          <Input
                            type={showPassConf ? "text" : "password"}
                            placeholder={`${t("passwordConf_field", {
                              ns: "forms",
                            })}`}
                            {...field}
                            className="bg-muted border-0 rounded-none"
                          />
                        </FormControl>
                        <div
                          className="transform before:inset-y-0 end-0 bottom-2  ms-1 me-1 flex items-center cursor-pointer max-h-max"
                          onClick={() => {
                            setShowPassConf((prev) => !prev);
                          }}
                        >
                          {showPassConf && <Eye className="w-5 h-5 " />}
                          {!showPassConf && (
                            <EyeOff className="w-5 h-5 font-bold text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="">
                      {/* <FormLabel>Notify me about...</FormLabel> */}
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormLabel className="font-bold my-2 text-primary  cursor-pointer rtl:justify-end flex">
                            {`${t("select_gender", { ns: "forms" })}`}
                          </FormLabel>

                          <div className="flex space-x-8 rtl:justify-end">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="male" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer ">
                                {`${t("male", { ns: "forms" })}`}
                              </FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Female" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer ">
                                {`${t("female", { ns: "forms" })}`}
                              </FormLabel>
                            </FormItem>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {`${t("submit", { ns: "forms" })}`}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center flex-1 ">
          <div
            className="max-w-lg w-full"
            data-aos-duration="800"
            data-aos="fade-up"
          >
            <img src={registerImg} className="w-full" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
