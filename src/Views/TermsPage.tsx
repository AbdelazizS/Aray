import { NavBar } from "../components/Navbar";
import Heading from "../components/Heading";
import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation(["main"]);
  return (
    <>
      <NavBar/>
      <section className="">
        <Heading title={"terms_page_title"}></Heading>

        <div className="max-w-7xl mx-auto p-4">
          <p className="text-muted-foreground">
            {t("privacy_policy", { ns: "main" })}
          </p>
        </div>
      </section>
    </>
  );
}
