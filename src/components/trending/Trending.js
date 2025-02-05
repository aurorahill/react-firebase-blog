import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import TrendingItem from "./TrendingItem";
import classes from "./Trending.module.scss";
import { useBlogContext } from "../../store/blog-context";
import Spinner from "../UI/Spinner";
import SectionHeader from "../UI/SectionHeader";

const Trending = () => {
  const { trendBlogs, getTrendingBlogs } = useBlogContext();
  const [loading, setLoading] = useState();

  const swiperConfig = {
    modules: [Autoplay, Navigation],
    loop: true,
    spaceBetween: 10,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      450: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1000: {
        slidesPerView: 4,
      },
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: {
      prevEl: ".swiper-button-prev",
      nextEl: ".swiper-button-next",
    },
  };

  useEffect(() => {
    setLoading(true);
    getTrendingBlogs();
    setLoading(false);
  }, [getTrendingBlogs]);

  if (loading) return <Spinner />;
  return (
    <section className={classes.trending}>
      <SectionHeader>Błażowski Blog Rodzinny ✨</SectionHeader>
      <Swiper {...swiperConfig}>
        {trendBlogs?.map((item) => (
          <SwiperSlide key={item.id}>
            <TrendingItem item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={classes.trending__actions}>
        <span className="swiper-button-prev"></span>
        <span className="swiper-button-next"></span>
      </div>
    </section>
  );
};

export default Trending;
