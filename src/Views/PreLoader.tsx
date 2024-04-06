import { useTranslation } from "react-i18next";
import { logoImg } from "@/constants";



export default function PreLoaderPage({ message }:any) {

  const { t } = useTranslation(['main']);
  return (
    <>
      <div
        className={`bg-muted fixed overflow-hidden w-full h-dvh flex flex-col items-center justify-center b z-50 inset-0 `}
      >
        <div className="max-w-sm w-40 h-40">
          <img
            src={logoImg}
            className="w-full h-full object-fill aspect-square"
            alt=""
          />
        </div>

        <h1
          data-aos-duration="1000"
          data-aos="fade-up"
          className="font-bold text-foreground mt-8 md:mt-10 text-xl md:text-2xl"
        >
          {t(message, { ns: "main" })}
        </h1>
      </div>
    </>
  );
}
