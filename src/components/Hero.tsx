import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "../App.css";
import { useState } from "react";
import { heroData } from "@/constants";

export const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  const timeout = setTimeout(() => {
    setLoaded(true);
    clearTimeout(timeout);
  }, 1500);

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper w-full"
    >
      {heroData.map((item:any, i:any) => (
        <SwiperSlide key={i}>
          <section className="max-h-[500px] w-full">
            <div className="relative flex justify-center items-center">
              {!loaded && (
                <div className="h-[200px] md:h-[500px] bg-muted w-full"></div>
              )}
              <div className="max-w-2xl mx-4 rounded-md absolute bg-foreground/50 dark:bg-background/60 p-4 text-center ">
                <h1 className="text-popover dark:text-accent-foreground font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                  {item.text}
                </h1>
              </div>
              {loaded && (
                <img
                  className="w-full object-cover h-200px  md:max-h-[500px]"
                  src={item.ImageSrc}
                  alt="/"
                />
              )}
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
