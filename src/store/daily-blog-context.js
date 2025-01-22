import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const DailyBlogContext = createContext();

export const DailyBlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Opóźnione wyszukiwanie

  // Debouncing search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Pobranie wszystkich blogów
  const getAllBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const docSnapshot = await getDocs(blogRef);
    const blogsData = docSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAllBlogs(blogsData);
  };

  // Pobranie 4 pierwszych blogów
  const getBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const firstFour = query(blogRef, orderBy("title"), limit(4));
    const docSnapshot = await getDocs(firstFour);
    const newBlogs = docSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBlogs(newBlogs);
    setFilteredBlogs(newBlogs); // Na początku widoczne są te same blogi
    setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
  };

  // Filtrowanie blogów
  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      setFilteredBlogs(blogs); // Brak tekstu wyszukiwania – pokazujemy 4 blogi
    } else {
      const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
      const filtered = allBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          blog.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          blog.author.toLowerCase().includes(lowerCaseSearchTerm) ||
          blog.tags.some((tag) =>
            tag.toLowerCase().includes(lowerCaseSearchTerm)
          )
      );
      setFilteredBlogs(filtered);
    }
  }, [debouncedSearchTerm, blogs, allBlogs]);

  // Lazy loading kolejnych blogów
  const fetchMore = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const nextFour = query(
      blogRef,
      orderBy("title"),
      limit(4),
      startAfter(lastVisible)
    );
    const docSnapshot = await getDocs(nextFour);
    if (!docSnapshot.empty) {
      const newBlogs = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs((prev) => [...prev, ...newBlogs]);
      setFilteredBlogs((prev) => [...prev, ...newBlogs]); // Dodajemy do widocznych
      setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    } else {
      toast.info("No more blogs to display");
      setIsEmpty(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getBlogs();
    getAllBlogs();
  }, []);

  const dailyBlogCtx = {
    blogs,
    filteredBlogs,
    loading,
    isEmpty,
    fetchMore,
    searchTerm,
    setSearchTerm,
  };

  return (
    <DailyBlogContext.Provider value={dailyBlogCtx}>
      {children}
    </DailyBlogContext.Provider>
  );
};

export const useDailyBlogContext = () => useContext(DailyBlogContext);
