import { Link } from "react-router-dom";
import { Card, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import axios from "axios";
import Skeleton from "./Skeleton";
import { useTranslation } from "react-i18next";

export const Activites = () => {
  const [activities, setActivities] = useState([]);

  const { t } = useTranslation(["Home"]);

  useEffect(() => {
    axios.defaults.baseURL = "https://api.aray.tarhil.com/";
    const getActivities = async () => {
      await axios
        .get("activates/get-activites")
        .then((response) => {
          setActivities(response.data.activates);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getActivities();
  }, []);

  return (
    <section id="team" className="max-w-7xl mx-auto py-12 sm:py-16 px-4">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
        {t(`our`, { ns: ["Home"] })}
        <span className="ms-1 ">{t(`available`, { ns: ["Home"] })}</span>
        <span className="ms-1 bg-gradient-to-b from-primary/40 to-primary text-transparent bg-clip-text">
          {t(`activities`, { ns: ["Home"] })}
        </span>
      </h2>

      <p className="my-2  text-xl text-muted-foreground">
        {t(`activites_sub_text`, { ns: ["Home"] })}
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
          1024: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 5,
          },
        }}
        className="mySwiper  pb-10"
      >
        <div className="max-w-7xl mx-auto">
          {" "}
          <div className="flex gap-4">
            {activities &&
              activities.map(
                ({ name, image, id }:any, i) =>
                  i < 4 && (
                    <SwiperSlide key={i} className="max-w-[300px]">
                      <Card
                        key={i}
                        className="bg-muted/50 shadow-md relative mt-8 flex flex-col "
                      >
                        <div className="flex p-2 w-full">
                          <img
                            src={`https://api.aray.tarhil.com/images/${image.slice(
                              7
                            )}`}
                            className="rounded-md w-full  max-h-52 aspect-square object-cover"
                          />

                          {!activities && (
                            <div className="max-h-32 w-full bg-gray-200 animate-pulse h-32"></div>
                          )}
                        </div>
                        <CardTitle className="text-sm px-2 pb-` transition-all cursor-pointer">
                          <span className="text-lg font-bold">{name}</span>
                        </CardTitle>
                        <Link to={`/activity/${id}`}>
                          <p className="text-muted-foreground px-2 pb-2 hover:underline cursor-pointer transition-all">
                          {t(`click_to_show`, { ns: ["Home"] })}
                          </p>
                        </Link>
                      </Card>
                    </SwiperSlide>
                  )
              )}

            {activities?.length < 1 &&
              [1, 2, 3, 4].map(
                (item, i) =>
                  i < 4 && (
                    <SwiperSlide key={i} className="max-w-[300px]">
                      <Card
                        key={item}
                        className="bg-muted/50 shadow-md relative mt-8 flex flex-col "
                      >
                        <div className="flex h-56 p-2">
                          <Skeleton />
                        </div>
                        <CardTitle className="text-sm px-2 pb-2 pt-1 h-8 w-40">
                          <Skeleton />
                        </CardTitle>
                        <p className="text-muted-foreground px-2 pb-2 poin hover:underline cursor-pointer transition-all">
                        {t(`click_to_show`, { ns: ["Home"] })}
                        </p>
                      </Card>
                    </SwiperSlide>
                  )
              )}
          </div>
        </div>
      </Swiper>
    </section>
  );
};