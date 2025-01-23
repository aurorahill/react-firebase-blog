import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [tags, setTags] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trendBlogs, setTrendBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState(null);

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

  useEffect(() => {
    setLoading(true);
    getTrendingBlogs();
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
        setFilteredBlogs(list);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
      getTrendingBlogs();
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
    blogs,
    loading,
    setLoading,
    trendBlogs,
    setBlogs,
    filteredBlogs,
    setFilteredBlogs,
    searchTerm,
    setSearchTerm,
    activeTag,
    setActiveTag,
    categoryCount,
  };

  return (
    <BlogContext.Provider value={blogCtx}>{children}</BlogContext.Provider>
  );
};

export const useBlogContext = () => useContext(BlogContext);
