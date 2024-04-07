import { useState } from "react";
import { NavBar } from "@/components/Navbar";
import { AlertCircle, Mail, User, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Heading from "../components/Heading";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { Loader } from "../components/loader";
import { Toaster } from "../components/ui/toaster";
import { toast } from "../components/ui/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import { PhoneInput } from "../components/ui/phone-input";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassConf, setShowPassConf] = useState(false);
  const auth = useAuth();

  axios.defaults.baseURL = "https://api.aray.tarhil.com/";

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
      // .min(6, { message: "Password must be at least 6 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: `${t("passwordConf_err", { ns: "forms" })}`,
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user: auth.user.name,
      phone: `${auth.user.phone_no}`,
      email: auth.user.email,
      gender: auth.user.gender,
      password: "",
      confirmPassword: "",
    },
  });

  axios.defaults.baseURL = "https://api.aray.tarhil.com/";

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    axios
      .patch(
        `user/update-user/${auth.user.id}`,
        {
          phone_no: data.phone,
          name: data.user,
          email: data.email || "",
          password: data.password,
        },
        {
          headers: {
            "x-auth-token": auth.token,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        auth.updateAction(data);
        if (response.status === 200 || 201) {
          toast({
            title: `${t("data_updated", { ns: "forms" })}`,
            description: `${t("data_updated_desc", { ns: "forms" })}`,
            action: (
              <CheckCircle2 className="text-green-600 w-6 h-6"></CheckCircle2>
            ),
          });
        }
      })
      .catch((error) => {
        setLoading(false);

        if (error.response) {
          setErrorMsg(`${t("phone_exist", { ns: "main" })}`);
          setLoading(error.response);
        } 
        else if(!error.response) {
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
  };

  return (
    <>
      <NavBar />
      {loading && <Loader />}
      <Toaster />
      <Heading title={"profile_page_title"} />

      <div className="max-w-7xl mx-auto p-4 mt-4">
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

            {/* <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange } }) => (
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
                        onChange={(e) => onChange(e.target.files?.[0])}
                        type="file"
                        className="bg-muted border-0 opacity-0"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
    </>
  );
}
