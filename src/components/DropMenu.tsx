import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  User,
  Menu,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { toast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { useTranslation } from "react-i18next";
import { LogOutDrawer } from "./logOutDialog";

export function DropMenu({ setLoading }:any) {
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const auth = useAuth();

  const { t } = useTranslation(["Home"]);

  const logout = () => {
    // setLoading(true)
    auth.logOut();
    navigate("/");
    // if (res.status === 200) {
    toast({
      title: `${t(`user_logout`, { ns: ["main"] })}`,
      description: `${t(`user_logout_desc`, { ns: ["main"] })}`,
      action: <CheckCircle2 className="text-green-600 w-6 h-6"></CheckCircle2>,
    });

    const timeout = setTimeout(() => {
      setLoading(false);
      clearTimeout(timeout);
    }, 2000);
  };

  return (
    <>
      <Toaster />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ghost">
            {auth.user ? (
              <div className="flex items-center gap-1">
                <User className="w-5 h-5" />
                <span>{auth.user.name}</span>
              </div>
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {auth.user ? (
            <>
              <LogOutDrawer handleLogout={logout} />
            </>
          ) : (
            <>
              <DropdownMenuItem>
                <Link className="w-full rtl:text-right" to={"/auth/login"}>
                  {t(`login`, { ns: ["Home"] })}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link className="w-full rtl:text-right" to={"/auth/register"}>
                  {t(`register`, { ns: ["Home"] })}
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
