import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trendBlogs, setTrendBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [mostLikedBlogs, setMostLikesBlogs] = useState([]);
  const [tags, setTags] = useState([]);

  //ma sie wywolywac tylko przy pobieraniu danych, nie aktualizujemy jej na biezaco (przy usuwaniu aktualizuje stan)
  const getTrendingBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const trendQuery = query(blogRef, where("trending", "==", "yes"));
    const querySnapshot = await getDocs(trendQuery);
    let trendBlogs = [];
    querySnapshot.forEach((doc) => {
      trendBlogs.push({ id: doc.id, ...doc.data([]) });
    });
    setTrendBlogs(trendBlogs);
  };

  const getRecentBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const recentBlogs = query(blogRef, orderBy("timestamp", "desc"), limit(4));
    const docSnapshot = await getDocs(recentBlogs);
    setRecentBlogs(
      docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const getMostLikedBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const mostLikedBlogs = query(
      blogRef,
      orderBy("countLikes", "desc"),
      limit(3)
    );
    const querySnapshot = await getDocs(mostLikedBlogs);

    let blogsWithLikes = [];
    querySnapshot.forEach((doc) => {
      blogsWithLikes.push({ id: doc.id, ...doc.data() });
    });
    setMostLikesBlogs(blogsWithLikes);
  };

  useEffect(() => {
    setLoading(true);
    getTrendingBlogs();
    getRecentBlogs();
    getMostLikedBlogs();
    const unsub = onSnapshot(
      collection(db, "blogs"),
      (snapshot) => {
        let list = [];
        let tags = [];
        snapshot.docs.forEach((doc) => {
          tags.push(...doc.get("tags"));
          list.push({ id: doc.id, ...doc.data() });
        });
        const uniqueTags = [...new Set(tags)];
        setTags(uniqueTags);
        setBlogs(list);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
      getTrendingBlogs();
      getRecentBlogs();
      getMostLikedBlogs();
    };
  }, []);

  //category count
  const counts = blogs.reduce((prevValue, currentValue) => {
    let name = currentValue.category;
    if (!prevValue.hasOwnProperty(name)) {
      prevValue[name] = 0;
    }
    prevValue[name]++;
    delete prevValue["undefined"];
    return prevValue;
  }, {});

  const categoryCount = Object.keys(counts).map((k) => {
    return {
      category: k,
      count: counts[k],
    };
  });

  const blogCtx = {
    tags,
    loading,
    setLoading,
    trendBlogs,
    categoryCount,
    recentBlogs,
    mostLikedBlogs,
  };

  return (
    <BlogContext.Provider value={blogCtx}>{children}</BlogContext.Provider>
  );
};

export const useBlogContext = () => useContext(BlogContext);
