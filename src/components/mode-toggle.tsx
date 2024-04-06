import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useTheme } from "../components/theme-provider";
import { Moon, Sun,  } from "lucide-react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="ghost">
          {theme === "dark" ? (
            <Moon
              className="w-5 h-5 cursor-pointer"
              onClick={() => setTheme("light")}
            />
          ) : (
            <Sun
              className="w-5 h-5 cursor-pointer"
              onClick={() => setTheme("dark")}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}
