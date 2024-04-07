import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import {
  AlertCircle,
  BookText,
  CheckCircle2,
  Languages,
  LockIcon,
  Settings2Icon,
  User,
  UserRoundX,
} from "lucide-react";

import { useMediaQuery } from "../hooks/useMediaQuery";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
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
import { useTheme } from "../components/theme-provider";
import { Moon, Sun } from "lucide-react";
import Heading from "../components/Heading";
import { Button } from "../components/ui/button";
import { useAuth } from "../Context/AuthContext";
import { toast } from "../components/ui/use-toast";
import { Loader } from "../components/loader";
import { LogOutDrawer } from "../components/logOutDialog";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(["Home", "main", "Settings"]);

  const handleDelete = () => {
    setLoading(true);
    axios
      .delete(`user/delete-user/${auth.user.id}`, {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then((res):any => {
        if (res.status === 200 || 201) {
          setLoading(false);
          toast({
            title: `${t(`account_deleted`, { ns: ["Settings"] })}`,
            description: `${t(`account_deleted_desc`, { ns: ["Settings"] })}`,
            action: (
              <CheckCircle2 className="text-green-600 w-6 h-6"></CheckCircle2>
            ),
          });

          const timeout = setTimeout(() => {
            navigate("/");
            clearTimeout(timeout);
          }, 1000);
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.log(error);

        if (error.response) {
        } else {
          toast({
            title: `${t(`network_error`, { ns: ["Settings"] })}`,
            description: `${t(`network_error_desc`, { ns: ["Settings"] })}`,
            action: (
              <AlertCircle className="text-red-600 w-6 h-6"></AlertCircle>
            ),
          });
        }
      });
  };

  const handleLogout = () => {
    setLoading(true);
    auth.logOut();
    toast({
      title: "User Logged Out successfully",
      description: `You are welcomed any time`,
      action: <CheckCircle2 className="text-green-600 w-6 h-6"></CheckCircle2>,
    });

    const timeout = setTimeout(() => {
      navigate("/");
      clearTimeout(timeout);
    }, 1000);
    // catch((error) => {
    //   if (!error.response) {
    //     toast({
    //       title: "Please Check Your Network Connection ",
    //       description: `Network Error`,
    //       action: (
    //         <AlertCircle className="text-red-600 w-6 h-6"></AlertCircle>
    //       ),
    //     });
    //   }
    // })
  };

  return (
    <>
      <section className="">
        {loading && <Loader />}
        <Navbar />
        <Heading title={"settings_page_title"} />
        <div className="max-w-7xl mx-auto p-4 p mb-24">
          <div className="flex gap-8 flex-col md:flex-row">
            {auth.user && (
              <Card className="bg-primary/5 md:w-96 md:max-w-sm h-max shadow-md">
                <CardHeader className="flex flex-row items-center gap-2 ">
                  <Avatar>
                    {/* <AvatarImage
                    className="w-12 h-12 rounded-full"
                    alt=""
                    src="../src/assets/Gym.jpg"
                  /> */}
                    <Button className="rounded-full w-12 h-12 cursor-default">
                      <h2 className="text-lg">{auth.user?.name.slice(0, 1)}</h2>
                    </Button>
                  </Avatar>

                  <div className="flex flex-col">
                    <CardTitle className="text-base md:text-lg">
                      {auth.user.name}
                    </CardTitle>
                    <CardDescription>{auth.user.phone_no}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            )}
            <div className="w-full">
              <h2 className="flex gap-2 items-center text-lg font-bold mb-2">
                <Settings2Icon className="h-5 w-5" />
                {t(`title`, { ns: ["Settings"] })}
              </h2>
              <div className="flex bg-primary/5 w-full md:max-w-2xl rounded-md p-4 shadow-md">
                <div className="flex flex-col gap-2 w-full">
                  <ModeToggle />
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-start gap-1 cursor-pointer font-medium"
                  >
                    <Link
                      className="w-full flex items-center  gap-1 cursor-pointer font-medium"
                      to={"/profile"}
                    >
                      <User className="w-5 h-5" />
                      <span>{t(`edit_profile`, { ns: ["Settings"] })}</span>
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-start">
                    <Link
                      className="w-full flex items-center  gap-1 cursor-pointer font-medium"
                      to={"/privacy"}
                    >
                      <LockIcon className="w-5 h-5" />
                      <span>{t(`privacy_policy`, { ns: ["Settings"] })}</span>
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-start gap-1 cursor-pointer font-medium"
                  >
                    <Link
                      className="w-full flex items-center  gap-1 cursor-pointer font-medium"
                      to={"/terms"}
                    >
                      <BookText className="w-5 h-5" />
                      <span>{t(`terms_conditions`, { ns: ["Settings"] })}</span>
                    </Link>
                  </Button>

                  <DropdownMenuGroup />

                  {auth.user && <DrawerDialog handleDelete={handleDelete} />}

                  {auth.user && (
                    <div className="flex justify-center">
                      <div className="mt-4">
                        <LogOutDrawer handleLogout={handleLogout} />
                        {/* <Button
                          onClick={() => handleLogout()}
                          variant="ghost"
                          className="flex justify-start items-center gap-1 cursor-pointer font-medium "
                        >
                          <LogOut className="w-5 h-5 text-red-600" />
                          <span className="text-red-600">Logout</span>
                        </Button> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DrawerDialog({ handleDelete }:any) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { t } = useTranslation(["Settings"]);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-1 cursor-pointer font-medium"
          >
            <UserRoundX className="w-5 h-5" />
            <span className="text-start">
              {t("delete_account", { ns: "Settings" })}
            </span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t(`modal_title`, { ns: ["Settings"] })}</DialogTitle>
            <DialogDescription>
              {t(`modal_desc`, { ns: ["Settings"] })}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => handleDelete()}>
                {t(`modal_confirm`, { ns: ["Settings"] })}
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
          className="w-full flex items-center justify-start gap-1 cursor-pointer font-medium"
        >
          <UserRoundX className="w-5 h-5" />
          <span className="text-start">
            {t("delete_account", { ns: "Settings" })}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t(`modal_title`, { ns: ["Settings"] })}</DrawerTitle>
          <DrawerDescription>
            {t(`modal_desc`, { ns: ["Settings"] })}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="destructive" onClick={() => handleDelete()}>
              {t(`modal_confirm`, { ns: ["Settings"] })}
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="outline">
              {t(`cancel`, { ns: ["Settings"] })}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation(["Home"]);
  return theme === "dark" ? (
    <Button
      variant={"ghost"}
      onClick={() => setTheme("light")}
      className="w-full justify-start flex gap-1 "
    >
      <Moon className="w-5 h-5 cursor-pointer" />
      {t(`change_theme`, { ns: ["Settings"] })}
    </Button>
  ) : (
    <Button
      variant={"ghost"}
      onClick={() => setTheme("dark")}
      className="w-full justify-start flex gap-1 "
    >
      <Sun className="w-5 h-5 cursor-pointer" />
      {t(`change_theme`, { ns: ["Settings"] })}
    </Button>
  );
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

export function DropdownMenuGroup() {
  const { t, i18n } = useTranslation(["home"]);
  const [position, setPosition] = React.useState(i18n.language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start gap-1 cursor-pointer font-medium"
        >
          <Languages className="w-5 h-5" />
          <span>{t(`change_language`, { ns: ["Settings"] })}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {t(`select_language`, { ns: ["Settings"] })}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={position}
          onValueChange={(e) => {
            i18n.changeLanguage(e);
            setPosition(e);
            document.body.dir = i18n.dir();
          }}
        >
          <DropdownMenuRadioItem value="en">
            {t(`english`, { ns: ["Settings"] })}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ar">
            {t(`arabic`, { ns: ["Settings"] })}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
