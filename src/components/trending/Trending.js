// import React, { useEffect } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation } from "swiper/modules";
// import "swiper/css";
// import TrendingItem from "./TrendingItem";
// import classes from "./Trending.module.scss";
// import { useBlogContext } from "../../store/blog-context";
// import { FaAngleLeft } from "react-icons/fa";
// import { FaAngleRight } from "react-icons/fa";

// const Trending = () => {
//   const { trendBlogs, getTrendingBlogs } = useBlogContext();
//   useEffect(() => getTrendingBlogs(), [getTrendingBlogs]);
//   const swiperConfig = {
//     modules: [Autoplay, Navigation],
//     loop: true,
//     spaceBetween: 10,
//     breakpoints: {
//       0: {
//         slidesPerView: 1,
//       },
//       450: {
//         slidesPerView: 2,
//       },
//       700: {
//         slidesPerView: 3,
//       },
//       1000: {
//         slidesPerView: 4,
//       },
//     },
//     autoplay: {
//       delay: 3000,
//       disableOnInteraction: false,
//     },
//     navigation: {
//       prevEl: ".swiper-button-prev",
//       nextEl: ".swiper-button-next",
//     },
//   };

//   return (
//     <section className={classes.trending}>
//       <Swiper {...swiperConfig}>
//         {trendBlogs?.map((item) => (
//           <SwiperSlide key={item.id}>
//             <TrendingItem item={item} />
//           </SwiperSlide>
//         ))}
//         <div className={classes.trending__actions}>
//           <span className="swiper-button-prev">
//             <FaAngleLeft />
//           </span>
//           <span className="swiper-button-next">
//             <FaAngleRight />
//           </span>
//         </div>
//       </Swiper>
//     </section>
//   );
// };

// export default Trending;

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"; // Dodaj style, jeśli używasz nawigacji
import TrendingItem from "./TrendingItem";
import classes from "./Trending.module.scss";
import { useBlogContext } from "../../store/blog-context";
import Spinner from "../UI/Spinner";

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
