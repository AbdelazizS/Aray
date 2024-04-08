import { useEffect, useState } from "react";

import { NavBar } from "@/components/Navbar";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import Skeleton from "@/components/Skeleton";
import Heading from "@/components/Heading";
import { useTranslation } from "react-i18next";
import DrawerDialog from "@/components/Drawerdialog";


export default function AcademiesPagePage() {
  const [academies, setAcadeimcs] = useState([]);
  const [count, setCount] = useState(1);
  if (count <= 0) {
    setCount(1);
  }

  const { t } = useTranslation(["academies"]);

  useEffect(() => {
    axios.defaults.baseURL = "https://api.aray.tarhil.com/";
    const getAcademics = async () => {
      await axios
        .get("academies/get-academies")
        .then((response) => {
          setAcadeimcs(response.data.acadmies);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAcademics();
  }, []);

  return (
    <>
      <NavBar />
      <section className="">
        <Heading title={"academies_page_title"} />
        <div className="max-w-7xl mx-auto py-3">
          <h3 className="text-lg md:text-xl font-bold text-muted-foreground px-4">
            {t(`page_subtitle`, { ns: "academies" })}
          </h3>
          <div className="p-4 cards justify-center md:justify-normal md:mt-4 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {academies?.map(
              ({ name, classes, price, duration, image, id }: any, i) => (
                <Card key={i} className="bg-muted/10 relative flex flex-col ">
                  <CardHeader className="flex pb-1 w-full">
                    <img
                      src={`https://api.aray.tarhil.com/images/${image.slice(
                        7
                      )}`}
                      className="rounded-md w-full max-h-48 aspect-square object-cover"
                    />
                  </CardHeader>
                  <CardTitle className="px-2 font-semibold">{name}</CardTitle>
                  <div className="flex flex-wrap gap-x-8 gap-1 px-2 pt-1">
                    <div className="flex items-center gap-1 ">
                      {t(`classes`, { ns: "academies" })}:{" "}
                      <span className="text-primary font-medium">
                        {" "}
                        {classes}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 ">
                      {t(`duration`, { ns: "academies" })}:{" "}
                      <span className="text-primary font-medium">
                        {" "}
                        {duration}{" "}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1 p-2">
                    <DrawerDialog price={price} id={id} title={`click_to_subscribe`} />
                    {/* <Link
                      to={`/payments`}
                      state={{ id, type: "academy" }}
                    ></Link> */}
                    <span className="text-primary font-semibold">
                      {price} {t(`currency`, { ns: "academies" })}
                    </span>
                  </div>
                </Card>
              )
            )}

            {academies.length < 1 &&
              [1, 2, 3, 4].map(
                (item , i) =>
                  i < 4 && (
                    <Card
                      key={item}
                      className="bg-muted/50 shadow-md relative mt-8 flex flex-col "
                    >
                      <div className="flex p-2 h-40 ">
                        <Skeleton />
                      </div>
                      <CardTitle className="px-2 pb-2  pt-1 h-8 w-32">
                        <Skeleton />
                      </CardTitle>

                      <div className="flex flex-wrap gap-x-8 gap-1 px-2 py-1">
                        <div className="flex items-center gap-1 w-40 h-4">
                          <Skeleton />
                        </div>

                        <div className="flex items-center gap-1 w-40 h-4">
                          <Skeleton />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-1 p-2">
                        <div className="w-20 h-4">
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


