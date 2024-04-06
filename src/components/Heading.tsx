import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Heading({ title }:any) {
  const navigate = useNavigate();
  const { t } = useTranslation(['main']);
  return (
    <>
      <div className="bg-muted border-b dark:bg-transparent  py-5">
        <div className="max-w-7xl mx-auto px-5">
          <div className="mb-2 flex items-center">
            <span
              onClick={() => navigate(-1)}
              className="mb- focus:outline-none cursor-pointer hover:underline text-muted-foreground text-sm"
            >
              {t(`back` , {ns:"main"})}
            </span>
          </div>
          <div className="mb-2">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              {t(`${title}` , {ns:"main"})}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
