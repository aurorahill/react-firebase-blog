import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  endAt,
  endBefore,
  limitToLast,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const UserBlogsContext = createContext();

export const UserBlogsProvider = ({ children, userId }) => {
  const [paginationBlogs, setPaginationBlogs] = useState([]); //pierwsze 6 na pagination blogs
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastPaginationVisible, setLastPaginationVisible] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [numOfPages, setNumOfPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Pobranie wszystkich blogów
  const getAllBlogs = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const blogRef = collection(db, "blogs");
      const userBlogsQuery = query(blogRef, where("userId", "==", userId));
      const docSnapshot = await getDocs(userBlogsQuery);
      const blogsData = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const totalPage = Math.ceil(docSnapshot.size / 6);
      setAllBlogs(blogsData);
      setNumOfPages(totalPage);
    } catch (err) {
      console.error("Error fetching user blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Pobranie 6 pierwszych blogów
  const getBlogs = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const blogRef = collection(db, "blogs");
      const userBlogsQuery = query(
        blogRef,
        where("userId", "==", userId),
        limit(6)
      );
      const docSnapshot = await getDocs(userBlogsQuery);
      const newBlogs = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPaginationBlogs(newBlogs);
      setPageCount(docSnapshot.size);
      setLastPaginationVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    } catch (err) {
      console.error("Error fetching paginated user blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (value) => {
    if (value === "next") {
      setCurrentPage((page) => page + 1);
      fetchNext();
    } else if (value === "prev") {
      setCurrentPage((page) => page - 1);
      fetchPrev();
    }
  };

  const fetchPrev = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const end =
      numOfPages !== currentPage
        ? endAt(lastPaginationVisible)
        : endBefore(lastPaginationVisible);
    const limitData =
      numOfPages !== currentPage
        ? limit(6)
        : pageCount <= 6 && numOfPages % 2 === 0
        ? limit(6)
        : limitToLast(6);
    const prevFour = query(
      blogRef,
      where("userId", "==", userId),
      end,
      limitData
    );
    const docSnapshot = await getDocs(prevFour);
    setPaginationBlogs(
      docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
    setPageCount(docSnapshot.size);
    setLastPaginationVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    setLoading(false);
  };

  const fetchNext = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const nextFour = query(
      blogRef,
      where("userId", "==", userId),
      limit(6),
      startAfter(lastPaginationVisible)
    );
    const docSnapshot = await getDocs(nextFour);
    setPaginationBlogs(
      docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
    setPageCount(docSnapshot.size);
    setLastPaginationVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    setLoading(false);
  };

  useEffect(() => {
    getBlogs();
    getAllBlogs();
  }, [userId]);

  const userBlogsCtx = {
    loading,
    pageCount,
    numOfPages,
    paginationBlogs,
    handlePageChange,
    currentPage,
  };

  return (
    <UserBlogsContext.Provider value={userBlogsCtx}>
      {children}
    </UserBlogsContext.Provider>
  );
};

export const useUserBlogsContext = () => useContext(UserBlogsContext);
