import BlogSection from "../components/blog/BlogSection";
import classes from "./Home.module.scss";
import Spinner from "../components/UI/Spinner";
import Trending from "../components/trending/Trending";
import Aside from "../components/Aside";
import { useBlogContext } from "../store/blog-context";

const Home = () => {
  const { loading } = useBlogContext();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={classes.home}>
      <Trending />
      <div className={classes.home__wrapper}>
        <div className={classes.home__blog}>
          <BlogSection />
        </div>
        <Aside />
      </div>
    </div>
  );
};

export default Home;
