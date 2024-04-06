import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

import { buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Link, NavLink } from "react-router-dom";
import { logoImg, navLinks } from "@/constants";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/Context/AuthContext";
import { DropMenu } from "./DropMenu";

interface RouteProps {
  href: string;
  label: string;
}

// interface FeatureProps {
//   icon: JSX.Element;
//   title: string;
//   description: string;
// }


export const Navbar = ({ setLoading }:any) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useTranslation(["Home"]);

  const auth = useAuth();

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <Link to={"/"}>
              <img src={logoImg} className="h-12 object-cover" alt="" />
            </Link>
          </NavigationMenuItem>

          {/* mobile */}

          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <div
                  className={`${buttonVariants({
                    variant: "ghost",
                    size: "icon",
                  })}`}
                >
                  <Menu
                    className="flex md:hidden h-5 w-5"
                    onClick={() => setIsOpen(true)}
                  >
                    {/* <span className="sr-only">Menu Icon</span> */}
                  </Menu>
                </div>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <NavigationMenuItem className="font-bold flex">
                    <img src="../src/assets/logo.png" className="h-12" alt="" />
                  </NavigationMenuItem>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {navLinks.map(({ label, href }: RouteProps) => (
                    <NavLink
                      key={label}
                      to={`/${href}`}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }: any) =>
                        isActive
                          ? `${buttonVariants({
                              variant: "ghost",
                            })} font-extrabold text-primary`
                          : `${buttonVariants({ variant: "ghost" })}`
                      }
                    >
                      {t(`${label}`, { ns: ["Home"] })}
                    </NavLink>
                  ))}

                  {auth.token ? (
                    <DropMenu setLoading={setLoading} />
                    // <span>{auth.user.name}</span>
                  ) : (
                    <Link
                      to={`/auth/register`}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {t("create_account", { ns: ["Home"] })}
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}

          <nav className="hidden md:flex gap-2">
            {navLinks.map(({ label, href }: RouteProps) => (
              <NavLink
                key={label}
                to={`/${href}`}
                onClick={() => setIsOpen(false)}
                className={({ isActive }: any) =>
                  isActive
                    ? `${buttonVariants({
                        variant: "ghost",
                      })} font-extrabold text-primary`
                    : `${buttonVariants({ variant: "ghost" })}`
                }
              >
                {t(`${label}`, { ns: ["Home"] })}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <ModeToggle />
            <DropMenu setLoading={setLoading} />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
