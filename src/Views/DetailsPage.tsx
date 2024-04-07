import { AlertCircle, Wallet } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { TimePicker12HourWrapper } from "../components/time-picker/time-picker-12hour-wrapper";
import { Button } from "../components/ui/button";
import { Loader } from "../components/loader";
import { useNavigate, useParams } from "react-router-dom";

("use client");

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "../lib/utils";
import { Calendar } from "../components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { toast } from "../components/ui/use-toast";
import { Toaster } from "../components/ui/toaster";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import Skeleton from "../components/Skeleton";
import { useTranslation } from "react-i18next";

export default function DetailsPage() {
  const navigate = useNavigate();
  const [endTime, setEndTime] = React.useState<Date>();
  const [startTime, setStartTime] = React.useState<Date>();
  const [loading, setLoading] = React.useState(false);
  const [price, setPrice] = React.useState<any>();
  const [peopleCount, setPeopleCount] = React.useState(1);
  const [totalPrice, setTotalPrice] = React.useState<any>(price!);
  const [bookingConfirmed, setBookingConfirmed] = React.useState(false);
  const [payload, setPayload] = useState({});
  const { id } = useParams();

  const values = ["1", "2", "3", "4", "5"];
  const auth = useAuth();
  const currDate:any = new Date().setDate(new Date().getUTCDate()-1);
  const { t } = useTranslation(["forms", "main", "academies"]);

  const timeFormat = (time: any) => {
    let hour = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
    let minute =
      time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();

    return `${hour}:${minute}`;
  };

  const FormSchema = z.object({
    date: z.date({
      required_error: `${t("date_reservation_err", { ns: "forms" })}`,
    }),
    peopleCount: z.string({
      required_error: `${t("people_count_err", { ns: "forms" })}`,
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!endTime) {
      toast({
        title: `${t("end_time_field_err", { ns: "main" })}`,
        description: `${t("end_time_field_err_desc", { ns: "main" })}`,
        action: <AlertCircle className="text-red-600 w-6 h-6"></AlertCircle>,
      });
    }

    if (!startTime) {
      toast({
        title: `${t("start_time_field_err", { ns: "main" })}`,
        description: `${t("start_time_field_err_desc", { ns: "main" })}`,
        action: <AlertCircle className="text-red-600 w-6 h-6"></AlertCircle>,
      });
    }

    if (!auth.user) {
      toast({
        title: `${t("redirect_error", { ns: "main" })}`,
        description: `${t("redirect_error_desc", { ns: "main" })}`,
        action: <AlertCircle className="text-red-600 w-6 h-6"></AlertCircle>,
      });
      navigate("/history");
    }

    if (startTime && endTime) {
      addNewBooking(data);
    }
  }

  const addNewBooking = async (values: any) => {
    setLoading(true);
    const payload = {
      type: "activity",
      activates_id: id,
      academy_id: 0,
      totale_price: totalPrice,
      date: values.date,
      start_time: timeFormat(startTime),
      end_time: timeFormat(endTime),
      pepole_count: peopleCount,
      card_id: 0,
      subscription_id: 0,
      status: auth.user.status,
      user_id: auth.user.id,
    };
    setPayload(payload);

    let timeout = setTimeout(() => {
      setLoading(false);
      setBookingConfirmed(true);
      clearTimeout(timeout);
    }, 1000);
  };

  const confirmPayment = () => {
    if (bookingConfirmed) {
      navigate("/payments", { state: { payload: payload } });
    }
  };

  const [item, setItem] = useState<any>();

  const getDetails = async () => {
    axios.defaults.baseURL = "https://api.aray.tarhil.com/";
    await axios
      .get(`activates/get-activity/${id}`)
      .then((response) => {
        setItem(response.data.data);
        setTotalPrice(response.data.data.price);
        setPrice(response.data.data.price);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <>
      <Navbar />
      <section className="">
        <Toaster />
        {loading && <Loader />}
        <div className="relative ">
          <div className="absolute ltr:left-2 rtl:right-2 top-4 px-3 py.5 bg-black/70 shadow-lg">
            <span
              onClick={() => navigate(-1)}
              className="cursor-pointer focus:outline-none hover:underline text-white text-sm font-bold flex items-center gap-2 p-.5"
            >
              {t("back", {
                ns: "main",
              })}
            </span>
          </div>
          {item?.image && (
            <div className="w-full overflow-hidden flex justify-center items-center h-48 max-h-48 sm:max-h-52 sm:h-52  md:max-h-96 md:h-96">
              <img
                className="w-full h-full object-cover aspect-square object-center"
                src={`https://api.aray.tarhil.com/images/${item.image.slice(
                  7
                )}`}
                alt=""
              />
            </div>
          )}
          {!item?.image && (
            <div className="w-full h-48 max-h-48 sm:max-h-52 sm:h-52  md:max-h-96 md:h-96 object-cover aspect-square object-center bg-muted"></div>
          )}
        </div>
        <div className="max-w-7xl mx-auto py-10 md:py-14 p-4">
          {item && (
            <h2 className="text-xl md:text-2xl  font-bold mb-6">
              {item?.name}
            </h2>
          )}
          {!item?.name && (
            <div className="w-96 h-10">
              <Skeleton />
            </div>
          )}
          <div className="flex-flex-col mt-4">
            {/* <DatePicker  /> */}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("pick_date", { ns: "forms" })}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] ps-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>
                                  {t("select_reservation_date", {
                                    ns: "forms",
                                  })}
                                </span>
                              )}
                              <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <  currDate || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap max-w-3xl items-center justify-between gap-4 sm:justify-normal  sm:gap-16 mt-4">
                  <div>
                    <div className="flex gap-4 items-center">
                      <span className="font-medium text-primary ">
                        {t("start_time_label", { ns: "forms" })}{" "}
                      </span>
                      <TimePicker12HourWrapper
                        date={startTime}
                        setDate={setStartTime}
                      />
                    </div>
                    {/* {endTimeErr && (
                      <span className="text-red-600 font-medium text-xs">
                        Please Select the starting date
                      </span>
                    )} */}
                  </div>

                  <div>
                    <div className="flex gap-4 items-center">
                      <span className="font-medium text-primary ">
                        {t("end_time_label", { ns: "forms" })}{" "}
                      </span>
                      <TimePicker12HourWrapper
                        date={endTime}
                        setDate={setEndTime}
                      />
                    </div>
                    {/* {startTimeErr && (
                      <span className="text-red-600 font-medium text-xs">
                        Please Select the starting date
                      </span>
                    )} */}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:gap-8 mt-4">
                  <FormField
                    control={form.control}
                    name="peopleCount"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value: any) => {
                            setTotalPrice(value * price);
                            field.onChange(value);
                            setPeopleCount(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormLabel>
                            {t("people_count_label", { ns: "forms" })}
                          </FormLabel>
                          <FormControl>
                            <SelectTrigger className="w-60 max-w-[240px]">
                              <SelectValue
                                placeholder={t("people_count_placeholder", {
                                  ns: "forms",
                                })}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {values.map((item, i) => {
                              return (
                                <SelectItem key={i} value={item}>
                                  {item}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <span className="text-muted-foreground text-xs">
                      {t("per_minute", { ns: "forms" })}
                    </span>
                    {!item?.price && (
                      <div className="w-12 h-8 mt-1">
                        <Skeleton />
                      </div>
                    )}
                    {item?.price && (
                      <div className="font-medium text-primary mt-1">
                        {item?.price} {t("currency", { ns: "main" })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="my-3 md:my-4 px-2 flex items-center gap-1">
                  <div className="flex gap-1 items-center">
                    <Wallet className="w-5 h-5" />{" "}
                    {t("total_price", { ns: "forms" })} :{" "}
                  </div>
                  {item?.price && (
                    <div className="font-bold text-lg">{totalPrice}</div>
                  )}
                  {!item?.price && (
                    <div className="w-12 h-6">
                      <Skeleton />
                    </div>
                  )}
                  {t("currency", { ns: "main" })}
                </div>

                <p className="text-muted-foreground my-1">
                  {t("you", { ns: "main" })}{" "}
                  <span className="font-medium text-red-600">
                    {t("not_subscribed_status", { ns: "main" })}{" "}
                  </span>
                  <span>{t("platform_offers", { ns: "main" })} ,</span>
                  {t("click_to_confirm_reservation", { ns: "academies" })}
                </p>

                {!bookingConfirmed && (
                  <div className="w-full max-w-[300px] sm:max-w-[350px] mx-auto sm:mx-0">
                    <Button className="w-full">
                      {t("confirm_booking", { ns: "forms" })}
                    </Button>
                  </div>
                )}

                {/* <div className="flex justify-center md:justify-start max-w-sm mt-8">
                  </div> */}
              </form>
            </Form>

            {bookingConfirmed && (
              <div className="mt-4 w-full max-w-[300px] sm:max-w-[350px] mx-auto sm:mx-0">
                <Button className="w-full" onClick={() => confirmPayment()}>
                  {t("click_to_pay", { ns: "payments" })}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
