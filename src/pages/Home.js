import { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import BlogSection from "../components/blog/BlogSection";
import classes from "./Home.module.scss";
import Spinner from "../components/UI/Spinner";
import { toast } from "react-toastify";
import Trending from "../components/trending/Trending";
import Aside from "../components/Aside";
import { useBlogContext } from "../store/blog-context";

const Home = () => {
  const [trendBlogs, setTrendBlogs] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const { blogs, loading, setLoading } = useBlogContext();

  const getTrendingBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const trendQuery = query(blogRef, where("trending", "==", "yes"));
    const querySnapshot = await getDocs(trendQuery);
    let trendBlogs = [];
    querySnapshot.forEach((doc) => {
      trendBlogs.push({ id: doc.id, ...doc.data([]) });
    });
    setTrendBlogs(trendBlogs);
    setLoadingTrending(false);
  };

  useEffect(() => {
    getTrendingBlogs();

    return () => {
      getTrendingBlogs();
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "blogs", id));
        toast.success("Blog deleted successfully!");
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading || loadingTrending) {
    return <Spinner />;
  }

  return (
    <div className={classes.home}>
      <Trending blogs={trendBlogs} />
      <div className={classes.home__wrapper}>
        <div className={classes.home__blog}>
          <BlogSection
            blogs={blogs}
            handleDelete={handleDelete}
          />
        </div>
        <Aside />
      </div>
    </div>
  );
};

export default Home;
