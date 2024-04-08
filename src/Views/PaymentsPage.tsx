import React, { useEffect, useState } from "react";

import { NavBar } from "@/components/Navbar";

import { Card } from "../components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import Heading from "../components/Heading";
import { Loader } from "../components/loader";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { Button, buttonVariants } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";
import { Input } from "../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "../components/ui/toaster";
import { toast } from "../components/ui/use-toast";

import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { debitImg } from "@/constants";

export default function PaymentsPage() {
  const [loading, setLoading] = useState(false);
  const [userCards, setUserCards] = useState([]);
  const auth = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["payments", "main"]);

  const FormSchema = z.object({
    debit_card: z.string({}),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  axios.defaults.baseURL = "https://api.aray.tarhil.com/";

  function Submit(data: z.infer<typeof FormSchema>) {
    const payload = location.state?.payload;
    const { subscription } = location.state;
    const { academyPayload } = location.state;
    setLoading(true);


    if (subscription) {
      axios
        .post(
          `user-subscriptions/add-user-subscription`,
          {
            user_id: auth.user.id,
            subscription_id: subscription.id,
            status: "valid",
          },
          {
            headers: {
              "x-auth-token": auth.token,
            },
          }
        )
        .then((response) => {
          if (response.status == 200 || 201) {
            toast({
              title: `${t("subscription_msg", { ns: "main" })}`,
              description: `${t("subscription_msg_desc", { ns: "main" })}`,
              action: (
                <CheckCircle2 className="text-green-600 w-6 h-6"></CheckCircle2>
              ),
            });
            let timeout = setTimeout(() => {
              setLoading(false);
              clearTimeout(timeout);
              navigate("/", { replace: true });
            }, 1000);
          }
        })
        .catch((error) => {
          setLoading(false);
          if (!error.response) {
            toast({
              title: `${t("network_error", { ns: "main" })}`,
              description: `${t("network_error_desc", { ns: "main" })}`,
              action: (
                <AlertCircle className="text-red-600 w-6 h-6"></AlertCircle>
              ),
            });
          }
          console.log(error);
        });
    }

    if (payload || academyPayload) {
      const bookingDetails = {
        ...(payload && payload),
        ...(academyPayload && academyPayload),
        card_id: data.debit_card,
      };

      axios
        .post(`booking/add-booking`, bookingDetails, {
          headers: {
            "x-auth-token": auth.token,
          },
        })
        .then((response) => {
          console.log(response);

          if (response.status === 200 || 201) {
            toast({
              title: `${t("success_add_msg", { ns: "main" })}`,
              description: `${t("success_add_msg_desc", { ns: "main" })}`,
              action: (
                <CheckCircle2 className="text-green-600 w-6 h-6"></CheckCircle2>
              ),
            });
            let timeout = setTimeout(() => {
              setLoading(false);
              clearTimeout(timeout);
              navigate("/history", { replace:true });
            }, 1000);
          }
        })
        .catch((error) => {
          setLoading(false);
          if (!error.response) {
            toast({
              title: `${t("network_error", { ns: "main" })}`,
              description: `${t("network_error_desc", { ns: "main" })}`,
              action: (
                <AlertCircle className="text-red-600 w-6 h-6"></AlertCircle>
              ),
            });
          }
          console.log(error);
        });
    }
  }

  const getUSerCards = async () => {
    await axios
      .get(`card/get-cards/${auth.user.id}`, {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then((response) => {
        setUserCards(response.data.cards);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUSerCards();
  }, [userCards]);

  return (
    <>
      <NavBar />
      <Toaster />
      {loading && <Loader />}
      <section className="">
        <Heading title={"payments_page_title"} />
        <div className="max-w-7xl mx-auto py-3">
          <div className="p-4 max-w-lg">
            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              {t(`page_subtitle`, { ns: "payments" })}
            </h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(Submit)} className=" space-y-6">
                <Card className="max-w-lg flex flex-col gap-4 bg-muted/10 relative mt-8 border p-4">
                  <FormField
                    control={form.control}
                    name="debit_card"
                    render={({ field }) => (
                      <FormItem className="space-y-3 md:w-2/3">
                        {/* <FormLabel>Notify me about...</FormLabel> */}
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {userCards.map((card:any, i:any) => {
                              return (
                                <div
                                  className={`${buttonVariants({
                                    variant: "outline",
                                  })} justify-start cursor-pointer`}
                                  key={i}
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={`${card.id}`} />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer w-full">
                                      <div className="flex gap-4 items-center">
                                        <img
                                          className="w-8 h-8"
                                          src={debitImg}
                                          alt=""
                                        />

                                        {`**** **** **** ${card.number.substr(
                                          -4
                                        )}`}
                                      </div>
                                    </FormLabel>
                                  </FormItem>
                                </div>
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <PayMentModal setLoading={setLoading} />
                </Card>
                {location.state.subscription && (
                  <Button className="mt-8 w-full max-w-sm" type="submit">
                    {t("confirm_payment", { ns: "payments" })}
                  </Button>
                )}

                {!location.state.subscription && (
                  <Button className="mt-8 w-full max-w-sm" type="submit">
                    {t("confirm_btn", { ns: "payments" })}
                  </Button>
                )}
              </form>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
}

function PayMentModal({ setLoading }:any) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { t } = useTranslation(["payments"]);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex cursor-pointer items-center gap-2 text-muted-foreground">
            <div
              className={`${buttonVariants({
                size: "icon",
              })}`}
            >
              <Plus className="w-4 h-4" />
            </div>
            {t("modal_title", { ns: "payments" })}
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle> {t("modal_title", { ns: "payments" })}</DialogTitle>
          </DialogHeader>
          <CardForm setOpen={setOpen} setLoading={setLoading} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 text-muted-foreground">
          <div
            className={`${buttonVariants({
              size: "icon",
            })}`}
          >
            <Plus className="w-4 h-4" />
          </div>
          {t("modal_title", { ns: "payments" })}
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="">
          <DrawerTitle> {t("modal_title", { ns: "payments" })}</DrawerTitle>
        </DrawerHeader>
        <CardForm setOpen={setOpen} setLoading={setLoading} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline"> {t("cancel", { ns: "main" })}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CardForm({ setOpen, setLoading }:any) {
  const auth = useAuth();

  const { t } = useTranslation(["payments", "main"]);

  const creditRegx =
    /^(?:0\.(?:0[0-9]|[0-9]\d?)|[0-9]\d*(?:\.\d{1,2})?)(?:e[+-]?\d+)?$/;

  const timeFormat = (time:any) => {
    let hour = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
    let minute =
      time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();

    return `${hour}:${minute}`;
  };

  const FormSchema = z.object({
    card_no: z
      .string()
      .min(16, {
        message: `${t("card_no_error", { ns: "payments" })}`,
      })
      .regex(creditRegx, {
        message: `${t("card_no_error_2", { ns: "payments" })}`,
      })
      .max(16, {
        message: `${t("card_no_error_3", { ns: "payments" })}`,
      }),
    card_name: z.string().min(3, {
      message: `${t("card_name_error", { ns: "payments" })}`,
    }),
    card_cvv: z
      .string()
      .min(4, {
        message: `${t("cvv_error", { ns: "payments" })}`,
      })
      .max(4, {
        message: `${t("cvv_error_2", { ns: "payments" })}`,
      }),

    ex_year: z
      .string()
      .min(2, {
        message: "",
      })
      .max(4, {}),

    ex_month: z
      .string()
      .min(2, {
        message: "",
      })
      .max(2, {}),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      card_no: "",
      card_name: "",
      card_cvv: "",
      ex_year: "",
      ex_month: "",
    },
  });

  const addCard = async (data: z.infer<typeof FormSchema>) => {
    addNewCard(data);
  };

  const addNewCard = async (values:any) => {
    setOpen(false);
    setLoading(true);
    await axios
      .post(
        `card/add-card`,
        {
          name: values.card_name,
          number: values.card_no,
          exprt_date: `1/${values.ex_month}/${values.ex_year} : ${timeFormat(
            new Date()
          )}`,
          cvv: values.card_cvv,
          user_id: auth.user.id,
        },
        {
          headers: {
            "x-auth-token": auth.token,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        if (response.status === 200 || 201) {
          toast({
            title: `${t("card_added", { ns: "payments" })}`,
            description: `${t("card_added_desc", { ns: "payments" })}`,
            action: (
              <CheckCircle2 className="text-green-600 w-6 h-6"></CheckCircle2>
            ),
          });
        }

        console.log(response);
      })
      .catch((error) => {
        if (!error.response) {
          toast({
            title: `${t("network_error", { ns: "main" })}`,
            description: `${t("network_error_desc", { ns: "main" })}`,
            action: (
              <AlertCircle className="text-red-600 w-6 h-6"></AlertCircle>
            ),
          });
        }
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(addCard)}
          className="px-4 md:px-0 space-y-6"
        >
          <FormField
            control={form.control}
            name="card_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("card_no", { ns: "payments" })}</FormLabel>
                <div className="relative">
                  {/* <CreditCard className="absolute cursor-pointer bottom-0   -mb-1 transform translate-x-full -translate-y-1/2 text-muted-foreground h-6 w-6 ms-0" /> */}
                  <Input
                    {...field}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    className="transition focus:ring-primary mt-1 focus:ring-1 focus:outline-0"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-3 md:gap-4 items-center">
            <div className="relative">
              {/* <div className="mb-2"></div> */}
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="ex_month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("valid_label", { ns: "payments" })}
                      </FormLabel>
                      <Input
                        {...field}
                        placeholder={t("month", { ns: "payments" })}
                        className="w-20 md:w-24 transition focus:ring-primary mt-1 focus:ring-1 focus:outline-0"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ex_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="opacity-0">Valid Through</FormLabel>
                      <Input
                        {...field}
                        placeholder={t("year", { ns: "payments" })}
                        className="w-20 md:w-24 transition focus:ring-primary mt-1 focus:ring-1 focus:outline-0"
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="relative">
              <FormField
                control={form.control}
                name="card_cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("cvv", { ns: "payments" })}</FormLabel>
                    <Input
                      {...field}
                      placeholder="CVV"
                      className="w-20 md:w-24 transition focus:ring-primary mt-1 focus:ring-1 focus:outline-0"
                    />
                  </FormItem>
                )}
              />{" "}
            </div>
          </div>

          <FormField
            control={form.control}
            name="card_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("card_holder", { ns: "payments" })}</FormLabel>
                <Input
                  {...field}
                  placeholder={t("card_name_placeholder", { ns: "payments" })}
                  className="transition focus:ring-primary mt-1 focus:ring-1 focus:outline-0"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="shadow-md w-full" type="submit">
            {t("submit", { ns: "payments" })}
          </Button>
        </form>
      </Form>
    </>
  );
}
