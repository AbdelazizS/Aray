import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import Skeleton from "./Skeleton";
import { useTranslation } from "react-i18next";
import DrawerDialog from "./Drawerdialog";

export const Academies = () => {
  const [academies, setAcadeimcs] = useState([]);
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

  const { t } = useTranslation(["Home"]);

  // if (academies.length < 1) {
  // }

  return (
    <section id="team" className="max-w-7xl mx-auto py-12 sm:py-16 px-4">
      <>
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl lg:text-3xl  font-bold flex">
            {t(`available`, { ns: ["Home"] })}
            <span className="ms-1 bg-gradient-to-b from-primary/40 to-primary text-transparent bg-clip-text">
              {t(`academies`, { ns: ["Home"] })}
            </span>
          </h2>

          <Button variant="outline" className="max-w-[110px] md:max-w-full">
            <Link to={"/academies"}>
              <div className="flex gap-2 items-center">
                {t(`show_more`, { ns: ["Home"] })}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </div>
            </Link>
          </Button>
        </div>
        <p className="my-2  text-xl text-muted-foreground">
          {t(`academies_sub_text`, { ns: ["Home"] })}
        </p>
        <Swiper
          slidesPerView={1}
          spaceBetween={15}
          pagination={{}}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            991: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
          className="mySwiper slides-container pb-6"
        >
          <div className="max-w-7xl mx-auto">
            {" "}
            <div className="flex gap-4">
              {academies &&
                academies.map(
                  ({ name, image, price, id }: any, i) =>
                    i < 4 && (
                      <SwiperSlide key={i} className="max-w-[220px]">
                        <Card
                          key={i}
                          className="bg-muted/50 shadow-md relative mt-8 flex flex-col "
                        >
                          <div className="flex p-2 w-full">
                            <img
                              src={`https://api.aray.tarhil.com/images/${image.slice(
                                7
                              )}`}
                              className="rounded-md w-full max-h-32 aspect-square object-cover"
                            />

                            {!academies && (
                              <div className="max-h-32 w-full bg-gray-200 animate-pulse h-32"></div>
                            )}
                          </div>
                          {/* <span className="text-sm px-2 pb-2 hover:text-primary transition-all cursor-pointer md:text-base font-bold">{name}</span> */}
                          <DrawerDialog price={price} id={id} title={name} p={2}/>
                        </Card>
                      </SwiperSlide>
                    )
                )}

              {academies?.length < 1 &&
                [1, 2, 3, 4].map(
                  (item, i) =>
                    i < 4 && (
                      <SwiperSlide key={i} className="max-w-[220px]">
                        <Card
                          key={item}
                          className="bg-muted/50 shadow-md relative mt-8 flex flex-col "
                        >
                          <div className="hidden"></div>
                          <div className="flex h-32 p-2">
                            <Skeleton />
                          </div>
                          <div className="text-sm px-2 pb-2 hover:text-primary transition-all cursor-pointer pt-1 h-8 w-40">
                            <Skeleton />
                          </div>
                        </Card>
                      </SwiperSlide>
                    )
                )}
            </div>
          </div>
        </Swiper>
      </>
    </section>
  );
};
