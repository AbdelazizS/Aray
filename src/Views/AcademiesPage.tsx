import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Card, CardHeader, CardTitle } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Skeleton from "../components/Skeleton";
import Heading from "@/components/Heading";
import { useTranslation } from "react-i18next";
import { CircleX } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useAuth } from "../Context/AuthContext";

export default function AcademiesPagePage() {
  const [academies, setAcadeimcs] = useState([]);
  const [count, setCount] = useState(1);
  if (count <= 0) {
    setCount(1);
  }

  const { t } = useTranslation(["academies"]);

  useEffect(() => {
    axios.defaults.baseURL = "https://api.aray.tarhil.com/";
    const getAcademics = async () => {
      await axios
        .get("academies/get-academies")
        .then((response) => {
          setAcadeimcs(response.data.acadmies);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAcademics();
  }, []);

  return (
    <>
      <Navbar />
      <section className="">
        <Heading title={"academies_page_title"} />
        <div className="max-w-7xl mx-auto py-3">
          <h3 className="text-lg md:text-xl font-bold text-muted-foreground px-4">
            {t(`page_subtitle`, { ns: "academies" })}
          </h3>
          <div className="p-4 cards justify-center md:justify-normal md:mt-4 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {academies?.map(
              ({ name, classes, price, duration, image, id }: any, i) => (
                <Card key={i} className="bg-muted/10 relative flex flex-col ">
                  <CardHeader className="flex pb-1 w-full">
                    <img
                      src={`https://api.aray.tarhil.com/images/${image.slice(
                        7
                      )}`}
                      className="rounded-md w-full max-h-48 aspect-square object-cover"
                    />
                  </CardHeader>
                  <CardTitle className="px-2 font-semibold">{name}</CardTitle>
                  <div className="flex flex-wrap gap-x-8 gap-1 px-2 pt-1">
                    <div className="flex items-center gap-1 ">
                      {t(`classes`, { ns: "academies" })}:{" "}
                      <span className="text-primary font-medium">
                        {" "}
                        {classes}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 ">
                      {t(`duration`, { ns: "academies" })}:{" "}
                      <span className="text-primary font-medium">
                        {" "}
                        {duration}{" "}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1 p-2">
                    <DrawerDialog price={price} id={id} />
                    {/* <Link
                      to={`/payments`}
                      state={{ id, type: "academy" }}
                    ></Link> */}
                    <span className="text-primary font-semibold">
                      {price} {t(`currency`, { ns: "academies" })}
                    </span>
                  </div>
                </Card>
              )
            )}

            {academies.length < 1 &&
              [1, 2, 3, 4].map(
                (item , i) =>
                  i < 4 && (
                    <Card
                      key={item}
                      className="bg-muted/50 shadow-md relative mt-8 flex flex-col "
                    >
                      <div className="flex p-2 h-40 ">
                        <Skeleton />
                      </div>
                      <CardTitle className="px-2 pb-2  pt-1 h-8 w-32">
                        <Skeleton />
                      </CardTitle>

                      <div className="flex flex-wrap gap-x-8 gap-1 px-2 py-1">
                        <div className="flex items-center gap-1 w-40 h-4">
                          <Skeleton />
                        </div>

                        <div className="flex items-center gap-1 w-40 h-4">
                          <Skeleton />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-1 p-2">
                        <div className="w-20 h-4">
                          <Skeleton />
                        </div>
                        <div className="w-20 h-4">
                          <Skeleton />
                        </div>
                      </div>
                    </Card>
                  )
              )}
          </div>
        </div>
      </section>
    </>
  );
}

function DrawerDialog({ price, id }:any) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(1);
  const [totalprice, setTotalprice] = useState(price);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const auth = useAuth();
  const navigate = useNavigate();
  const date = new Date();
  const resetFields = () => {
    setTotalprice(price);
    setCount(1);
  };

  // const timeFormat : any = (time:any) => {
  //   let day = time.getDay() < 10 ? `0${time.getDay()}` : time.getDay();
  //   let month =
  //     time.getMonth() < 10 ? `0${time.getMonth() + 1}` : time.getMonth() + 1;
  //   let year = time.getFullYear();

  //   return `${day}-${month}-${year}`;
  // };

  const onSubmit = () => {
    if (!auth.user) {
     return navigate("/history");
    }
    navigate("/payments", {
      state: {
        academyPayload: {
          type: "academy",
          activates_id: 0,
          academy_id: id,
          totale_price: totalprice,
          date: date,
          start_time: "00:00",
          end_time: "00:00",
          pepole_count: count,
          card_id: 0,
          subscription_id: 0,
          status: auth.user.status,
          user_id: auth.user.id,
        },
      },
    });
  };

  if (totalprice === 0) {
    setTotalprice(price);
  }

  if (count === 0) {
    setCount(1);
  }
  const { t } = useTranslation(["Settings"]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <p className="text-muted-foreground hover:underline cursor-pointer transition-all duration-200">
            {t(`click_to_subscribe`, { ns: "academies" })}
          </p>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>{t(`modal_title`, { ns: ["academies"] })}</DialogTitle>
          </DialogHeader>

          <div className="content">
            <div className="flex items-center">
              <div>
                <div className="text-sm text-muted-foreground">
                  {t(`one_person`, { ns: ["academies"] })}
                </div>
                <div className="flex">
                  <span className="font-bold me-1 text-foreground">20 </span>
                  {t(`currency`, { ns: ["academies"] })}{" "}
                  {t(`per_minute`, { ns: ["academies"] })}
                </div>
              </div>
              <div className="flex py-2 px-3 m-8   items-center gap-4">
                <Button
                  onClick={() => {
                    setCount(count + 1);
                    setTotalprice((count + 1) * price);
                  }}
                  size="icon"
                  className="bg-primary/60 max-h-8 max-w-[32px]"
                >
                  +
                </Button>
                <div className="font-bold">{count}</div>
                <Button
                  size="icon"
                  className={`bg-primary/60 max-h-8 max-w-[32px] ${
                    count < 1 ? "pointer-events-none" : ""
                  }`}
                  onClick={() => {
                    setCount(count - 1);
                    setTotalprice((count - 1) * price);
                  }}
                >
                  -
                </Button>
              </div>
            </div>
            <span>
              {t(`total_amount`, { ns: ["academies"] })} :{" "}
              <span className="font-bold">{totalprice}</span>{" "}
              {t(`currency`, { ns: ["academies"] })}
            </span>

            <p className="text-muted-foreground my-1">
              {t("you", { ns: "main" })}{" "}
              <span className="font-medium text-red-600">
                {t("not_subscribed_status", { ns: "main" })}{" "}
              </span>
              {t("platform_offers", { ns: "main" })} ,
              <span>
                {" "}
                {t("click_to_confirm_reservation", { ns: "academies" })}
              </span>
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => onSubmit()}>
                {t(`modal_confirm_pay_&`, { ns: ["academies"] })}
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
        <p className="text-muted-foreground hover:underline cursor-pointer transition-all duration-200">
          {t(`click_to_subscribe`, { ns: "academies" })}
        </p>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>{t(`modal_title`, { ns: ["academies"] })}</DrawerTitle>
          <DrawerClose asChild onClick={() => resetFields()}>
            <CircleX className="w-4 h-4 hover:text-bold cursor-pointer" />
          </DrawerClose>
        </DrawerHeader>
        <div className="content p-4">
          <div className="flex items-center">
            <div>
              <div className="text-sm text-muted-foreground">
                {t(`one_person`, { ns: ["academies"] })}
              </div>
              <div className="flex">
                <span className="font-bold me-1 text-foreground">20 </span>
                {t(`currency`, { ns: ["academies"] })}{" "}
                {t(`per_minute`, { ns: ["academies"] })}
              </div>
            </div>
            <div className="flex py-2 px-3 m-8   items-center gap-4">
              <Button
                onClick={() => {
                  setCount(count + 1);
                  setTotalprice((count + 1) * price);
                }}
                size="icon"
                className="bg-primary/60 max-h-8 max-w-[32px]"
              >
                +
              </Button>
              <div className="font-bold">{count}</div>
              <Button
                size="icon"
                className={`bg-primary/60 max-h-8 max-w-[32px] ${
                  count < 1 ? "pointer-events-none" : ""
                }`}
                onClick={() => {
                  setCount(count - 1);
                  setTotalprice((count - 1) * price);
                }}
              >
                -
              </Button>
            </div>
          </div>
          <span>
            {t(`total_amount`, { ns: ["academies"] })} :{" "}
            <span className="font-bold">{totalprice}</span>{" "}
            {t(`currency`, { ns: ["academies"] })}
          </span>

          <p className="text-muted-foreground my-1">
            {t("you", { ns: "main" })}{" "}
            <span className="font-medium text-red-600">
              {t("not_subscribed_status", { ns: "main" })}{" "}
            </span>
            {t("platform_offers", { ns: "main" })} ,{" "}
            <span>
              {" "}
              {t("click_to_confirm_reservation", { ns: "academies" })}
            </span>
          </p>
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button  onClick={() => onSubmit()}>
              {t(`modal_confirm_pay_&`, { ns: ["academies"] })}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
