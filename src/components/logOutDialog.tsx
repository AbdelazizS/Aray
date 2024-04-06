import { useMediaQuery } from "../hooks/useMediaQuery";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  
  DrawerTrigger,
} from "@/components/ui/drawer";
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

export function LogOutDrawer({ handleLogout }:any) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { t } = useTranslation("forms");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex w-full justify-start items-center gap-1 cursor-pointer font-medium "
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <span className="text-red-600">{t("logout", { ns: "forms" })}</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("logout_modal_title", { ns: "forms" })}</DialogTitle>
            <DialogDescription>
              {t("logout_modal_desc", { ns: "forms" })}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => handleLogout()}>
                {t("logout_modal_confirm", { ns: "forms" })}
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
        <Button
          variant="ghost"
          className="w-full flex justify-start items-center gap-1 cursor-pointer font-medium "
        >
          <LogOut className="w-5 h-5 text-red-600" />
          <span className="text-red-600 w-full">{t("logout", { ns: "forms" })}</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="px-4">
        <DialogHeader>
          <DialogTitle>{t("logout_modal_title", { ns: "forms" })}</DialogTitle>
          <DialogDescription>
          {t("logout_modal_desc", { ns: "forms" })}
          </DialogDescription>
        </DialogHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="destructive" onClick={() => handleLogout()}>
            {t("logout_modal_confirm", { ns: "forms" })}
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="outline">{t("cancel", { ns: "forms" })}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
