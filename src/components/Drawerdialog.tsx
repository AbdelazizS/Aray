import { CircleX } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useTranslation } from "react-i18next";

export default function DrawerDialog({ price, id, title, p }: any) {
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
          <h3
            className={`${
              p && `p-${p}`
            } text-sm  hover:text-primary transition-all cursor-pointer md:text-base font-bold`}
          >
            {t(title, { ns: "academies" })}
          </h3>
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
        <h3
          className={`p-${p} text-muted-foreground hover:underline cursor-pointer transition-all duration-200`}
        >
          {t(title, { ns: "academies" })}
        </h3>
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
            <Button onClick={() => onSubmit()}>
              {t(`modal_confirm_pay_&`, { ns: ["academies"] })}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
