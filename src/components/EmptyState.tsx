import { Button } from "./ui/button";
import { CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { emptyImg } from "../constants";

export default function EmptyState() {
  const navigate = useNavigate();

  const { t } = useTranslation(["bookings", "main"]);

  return (
    <div className="space-y-1">
      <span className="bg-red-100 font-mono text-red-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
        {t(`blank_bookings`, { ns: "bookings" })}
      </span>
      <h1 className="md:text-center font-bold text-xl md:text-3xl  pb-8 text-foreground">
        {t(`not_have_bookings`, { ns: "bookings" })}
      </h1>
      <div className="max-w-4xl mx-auto ">
        <div></div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex justify-center items-center">
            <img
              src={emptyImg}
              alt=""
              className="w-full h-full"
            />
          </div>
          <p className="text-muted-foreground pt-4">
          {t(`empty_booking_guide`, { ns: "bookings" })}
          </p>
          <div className="flex flex-col justify-center mt-6">
            <Button
              className="flex gap-1"
              onClick={() => navigate("/academies")}
            >
              <CalendarPlus className="w-4 h-4" />
              {t(`browse_btn`, { ns: "bookings" })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
