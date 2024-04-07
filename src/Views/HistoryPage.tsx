import React, {useEffect, useState } from "react";
import { NavBar } from "../components/Navbar";
import Heading from "../components/Heading";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { Loader } from "../components/loader";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import { Toaster } from "../components/ui/toaster";
import { toast } from "../components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";

import { useTranslation } from "react-i18next";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { CheckCircle2 } from "lucide-react";
export default function HistoryPage() {
  // const navigate = useNavigate();
  // const [open, setOpen] = useState(false);
  const [noData, setNodata] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const { t } = useTranslation(["bookings", "main"]);
  axios.defaults.baseURL = "https://api.aray.tarhil.com/";

  const handleCancel = async (id:any) => {
    setLoading(true);

    await axios
      .patch(
        `booking/cancel-booking/${id}`,
        {
          status: "blocked",
        },
        {
          headers: {
            "x-auth-token": auth.token,
          },
        }
      )
      .then((response:any) => {
        setLoading(false);
        // console.log(response);
        if (response.status === 200 || 201) {
          toast({
            title: `${t(`cancel_booking_msg`, { ns: "bookings" })}`,
            description: `${t(`cancel_booking_msg_desc`, { ns: "bookings" })}`,
            action: (
              <CheckCircle2 className="text-green-600 w-6 h-6"></CheckCircle2>
            ),
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const getUSerBookings = async () => {
    await axios
      .get(`booking/get-bookings/${auth.user.id}`, {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then((response) => {
        setBookings(response.data.bookings);
        if (response.data.bookings.length === 0) {
          setNodata(true);
        }
      })
      .catch(() => {
        // console.log(error);
        // if (error.response?.data.status === "feiled") {
        //   let confirm = setTimeout(() => {
        //     setNodata(true);
        //     console.log(error);
        //     clearTimeout(confirm);
        //   }, 1500);
        // }
      });
  };

  useEffect(() => {
    getUSerBookings();
  }, [bookings]);
  // console.log(bookings);
  return (
    <>
      <NavBar />
      {loading && <Loader />}
      <Toaster />
      <Heading title={"bookings_page_title"} />
      <div className="max-w-7xl mx-auto p-4 mt-4">
        <div className="grid md:grid-cols-2 gap-8">
          {bookings?.map((item:any, i:any) => {
            return (
              <div
                key={i}
                className="bg-muted/50 rounded-lg overflow-hidden shadow-sm border p-4 "
              >
                <div className="flex items-center gap-1 mb-1 font-semibold">
                  {t(`booking_no`, { ns: "bookings" })} :{" "}
                  <span className="text-primary font-medium">{item?.id}</span>
                </div>
                <p className="px- mb-2">
                  {t(`type`, { ns: "bookings" })} : {item?.type}
                </p>

                <div className="flex tems-center flex-wrap gap-x-8">
                  <div className="flex items-center gap-1 mb-2 font-semibold">
                    {t(`total_amount`, { ns: "bookings" })} :{" "}
                    <span className="text-primary font-medium">
                      {item?.totale_price} {t(`currency`, { ns: "main" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap font-semibold">
                    {t(`time_and_date`, { ns: "bookings" })} :{" "}
                    <span className="text-primary font-medium">
                      {item?.start_time} - {item.end_time} |{" "}
                      {item.date.slice(0, 10)}
                    </span>
                  </div>
                </div>

                <div className="">
                  <DrawerDialog handleDelete={handleCancel} id={item.id} />
                </div>
              </div>
            );
          })}

          {!noData && bookings.length < 1 && (
            <>
              {[1, 2].map((item) => {
                return (
                  <div
                    key={item}
                    className="flex flex-col border p-4 space-y-2 rounded-md shadow-sm max-w-m"
                  >
                    <div className="h-4 w-40 sm:w-56">
                      <Skeleton />
                    </div>

                    <div className="h-4 w-24">
                      <Skeleton />
                    </div>

                    <div className="h-4 w-32 sm:w-40">
                      <Skeleton />
                    </div>

                    <div className="h-4 w-40 sm:w-56">
                      <Skeleton />
                    </div>

                    <div className="h-4 w-56 sm:w-72">
                      <Skeleton />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {noData && (
          <>
            <EmptyState />
          </>
        )}
      </div>
    </>
  );
}

function DrawerDialog({ handleDelete, id }:any) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { t } = useTranslation(["Settings"]);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span className="mt-2 cursor-pointer text-red-600 font-semibold underline">
            {t("click_to_cancel", { ns: "bookings" })}
          </span>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t(`modal_title`, { ns: ["bookings"] })}</DialogTitle>
            <DialogDescription>
              {t(`modal_desc`, { ns: ["bookings"] })}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => handleDelete(id)}>
                {t(`modal_confirm`, { ns: ["bookings"] })}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <span className="mt-2 text-red-600 cursor-pointer font-semibold underline">
          {t("click_to_cancel", { ns: "bookings" })}
        </span>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="">
          <DrawerTitle>{t(`modal_title`, { ns: ["bookings"] })}</DrawerTitle>
          <DrawerDescription>
            {t(`modal_desc`, { ns: ["bookings"] })}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="destructive" onClick={() => handleDelete(id)}>
              {t(`modal_confirm`, { ns: ["bookings"] })}
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="outline">
              {t(`cancel`, { ns: ["bookings"] })}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
