import React from "react";
import SectionHeader from "../SectionHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import TrendingItem from "./TrendingItem";
import classes from "./Trending.module.scss";
import FontAwesome from "react-fontawesome";
import { useBlogContext } from "../../store/blog-context";

const Trending = () => {
  const { trendBlogs } = useBlogContext();
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
  return (
    <section className={classes.trending}>
      <SectionHeader>Trending</SectionHeader>
      <Swiper {...swiperConfig}>
        {trendBlogs?.map((item) => (
          <SwiperSlide key={item.id}>
            <TrendingItem item={item} />
          </SwiperSlide>
        ))}
        <div className={classes.trending__actions}>
          <span className="swiper-button-prev">
            <FontAwesome name="chevron-left" />
          </span>
          <span className="swiper-button-next">
            <FontAwesome name="chevron-right" />
          </span>
        </div>
      </Swiper>
    </section>
  );
};

export default Trending;
