import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { Card, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "../components/Skeleton";
import Heading from "../components/Heading";
import { useTranslation } from "react-i18next";
import { WalletIcon } from "lucide-react";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);

  const { t } = useTranslation(["main"]);

  useEffect(() => {
    axios.defaults.baseURL = "https://api.aray.tarhil.com/";
    const getSubscriptions = async () => {
    await axios
        .get("subscriptions/get-subscriptions")
        .then((response) => {
          setSubscriptions(response.data.subscriptions);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getSubscriptions();
  }, []);

  return (
    <>
      <NavBar />
      <section className="">
        <Heading title={"subscriptions_page_title"} />
        <div className="max-w-7xl mx-auto py-3">
          <div className="p-4 cards  md:mt-4 grid md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subscriptions.map((item:any, i) => {
              return (
                <Card
                  key={i}
                  className="bg-muted/10 relative flex flex-col shadow-sm"
                >
                  <CardTitle className="px-2 font-semibold flex items-center gap-2">
                    <WalletIcon className="w-4 h-4 font-semibold" />
                    {item?.name}
                  </CardTitle>
                  <p className="text-muted-foreground px-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between gap-1 p-2">
                    <p className="text-muted-foreground hover:underline cursor-pointer transition-all duration-200">
                      <Link to={`/payments`} state={{ subscription: item }}>
                        {t(`click_to_subscribe`, { ns: "academies" })}
                      </Link>
                    </p>

                    <span className="text-primary font-semibold">
                      {item.price} {t(`currency`, { ns: "academies" })}
                    </span>
                  </div>
                </Card>
              );
            })}

            {subscriptions?.length < 1 &&
              [1, 2, 3, 4].map(
                (i) =>
                  i < 4 && (
                    <Card
                      key={i}
                      className="bg-muted/50 shadow-md relative mt-8 flex flex-col p-1"
                    >
                      <CardTitle className="px-2 pb-2  pt-1 h-8 w-32">
                        <Skeleton />
                      </CardTitle>

                      <div className="flex flex-wrap gap-x-8 gap-1 px-2 py-1">
                        <div className="flex items-center gap-1 w-80 h-4">
                          <Skeleton />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-1 p-2">
                        <div className="w-40 h-4">
                          <Skeleton />
                        </div>
                        <div className="w-20 h-4">
                          <Skeleton />
                        </div>
                      </div>
                    </Card>
                  )
              )}
          </div>
        </div>
      </section>
    </>
  );
}
