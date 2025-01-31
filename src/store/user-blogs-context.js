// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   limit,
//   startAfter,
//   endAt,
//   endBefore,
//   limitToLast,
//   where,
// } from "firebase/firestore";
// import { db } from "../firebase";

// const UserBlogsContext = createContext();

// export const UserBlogsProvider = ({ children, userId }) => {
//   const [paginationBlogs, setPaginationBlogs] = useState([]); //pierwsze 6 na pagination blogs
//   const [loading, setLoading] = useState(false);
//   const [lastPaginationVisible, setLastPaginationVisible] = useState(null);
//   const [pageCount, setPageCount] = useState(null);
//   const [numOfPages, setNumOfPages] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [error, setError] = useState(null);

//   // Pobranie wszystkich blogów
//   const getAllBlogs = async () => {
//     if (!userId) return;
//     setLoading(true);
//     try {
//       const blogRef = collection(db, "blogs");
//       const userBlogsQuery = query(blogRef, where("userId", "==", userId));
//       const docSnapshot = await getDocs(userBlogsQuery);
//       if (docSnapshot.empty) {
//         throw new Error("Brak wyników w bazie danych");
//       }
//       const totalPage = Math.ceil(docSnapshot.size / 6);
//       setNumOfPages(totalPage);
//     } catch (err) {
//       console.error("Error fetching user blogs:", err);
//       setError(
//         err.message || "Błąd podczas pobierania blogów. Spróbuj ponownie."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Pobranie 6 pierwszych blogów
//   const getBlogs = useCallback(async () => {
//     console.log("blogi");

//     if (!userId) return;
//     setLoading(true);
//     try {
//       const blogRef = collection(db, "blogs");
//       const userBlogsQuery = query(
//         blogRef,
//         where("userId", "==", userId),
//         limit(6)
//       );
//       const docSnapshot = await getDocs(userBlogsQuery);
//       if (docSnapshot.empty) {
//         throw new Error("Brak wyników w bazie danych");
//       }
//       const newBlogs = docSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setPaginationBlogs(newBlogs);
//       setPageCount(docSnapshot.size);
//       setLastPaginationVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
//     } catch (err) {
//       console.error("Error fetching paginated user blogs:", err);
//       setError(
//         err.message ||
//           "Błąd podczas pobierania blogów. Spróbuj ponownie później."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   const handlePageChange = (value) => {
//     if (value === "next") {
//       setCurrentPage((page) => page + 1);
//       fetchNext();
//     } else if (value === "prev") {
//       setCurrentPage((page) => page - 1);
//       fetchPrev();
//     }
//   };

//   const fetchPrev = async () => {
//     console.log("blogi wczesniejsze");
//     setLoading(true);
//     try {
//       const blogRef = collection(db, "blogs");
//       const end =
//         numOfPages !== currentPage
//           ? endAt(lastPaginationVisible)
//           : endBefore(lastPaginationVisible);
//       const limitData =
//         numOfPages !== currentPage
//           ? limit(6)
//           : pageCount <= 6 && numOfPages % 2 === 0
//           ? limit(6)
//           : limitToLast(6);
//       const prevFour = query(
//         blogRef,
//         where("userId", "==", userId),
//         end,
//         limitData
//       );
//       const docSnapshot = await getDocs(prevFour);
//       setPaginationBlogs(
//         docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//       );
//       setPageCount(docSnapshot.size);
//       setLastPaginationVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
//     } catch (err) {
//       console.error("Error fetching paginated user blogs:", err);
//       setError(
//         err.message ||
//           "Błąd podczas pobierania blogów. Spróbuj ponownie później."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchNext = async () => {
//     console.log("blogi pozniejsze");
//     setLoading(true);
//     try {
//       const blogRef = collection(db, "blogs");
//       const nextFour = query(
//         blogRef,
//         where("userId", "==", userId),
//         limit(6),
//         startAfter(lastPaginationVisible)
//       );
//       const docSnapshot = await getDocs(nextFour);
//       setPaginationBlogs(
//         docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//       );
//       setPageCount(docSnapshot.size);
//       setLastPaginationVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
//     } catch (err) {
//       console.error("Error fetching paginated user blogs:", err);
//       setError(
//         err.message ||
//           "Błąd podczas pobierania blogów. Spróbuj ponownie później."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getAllBlogs();
//   }, [userId]);

//   const userBlogsCtx = {
//     loading,
//     pageCount,
//     numOfPages,
//     paginationBlogs,
//     handlePageChange,
//     currentPage,
//     error,
//     setError,
//     getBlogs,
//   };

//   return (
//     <UserBlogsContext.Provider value={userBlogsCtx}>
//       {children}
//     </UserBlogsContext.Provider>
//   );
// };

// export const useUserBlogsContext = () => useContext(UserBlogsContext);

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  fetch6UserBlogs,
  fetchPrevUserBlogs,
  fetchNextUserBlogs,
  fetchAllUserBlogs,
} from "../utility/firebaseService";

const UserBlogsContext = createContext();

export const UserBlogsProvider = ({ children, userId }) => {
  const [paginationBlogs, setPaginationBlogs] = useState([]); // 6 blogów na stronie
  const [loading, setLoading] = useState(false);
  const [lastPaginationVisible, setLastPaginationVisible] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [numOfPages, setNumOfPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  // Pobranie wszystkich blogów
  const getAllUserBlogs = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const docSnapshot = await fetchAllUserBlogs(userId);
      if (docSnapshot.empty) {
        throw new Error("Brak wyników w bazie danych");
      }
      const totalPage = Math.ceil(docSnapshot.size / 6);
      setNumOfPages(totalPage);
    } catch (err) {
      console.error("Error fetching user blogs:", err);
      setError(
        err.message || "Błąd podczas pobierania blogów. Spróbuj ponownie."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Pobranie 6 pierwszych blogów
  const getBlogs = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const docSnapshot = await fetch6UserBlogs(userId);
      if (docSnapshot.empty) {
        throw new Error("Brak wyników w bazie danych");
      }
      const newBlogs = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPaginationBlogs(newBlogs);
      setPageCount(docSnapshot.size);
      setLastPaginationVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    } catch (err) {
      console.error("Error fetching paginated user blogs:", err);
      setError(
        err.message ||
          "Błąd podczas pobierania blogów. Spróbuj ponownie później."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Zmiana strony
  const handlePageChange = (value) => {
    if (value === "next") {
      setCurrentPage((page) => page + 1);
      fetchNext();
    } else if (value === "prev") {
      setCurrentPage((page) => page - 1);
      fetchPrev();
    }
  };

  // Pobranie poprzednich blogów
  const fetchPrev = async () => {
    setLoading(true);
    try {
      const docSnapshot = await fetchPrevUserBlogs(
        userId,
        lastPaginationVisible,
        numOfPages,
        currentPage,
        pageCount
      );
      setPaginationBlogs(
        docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setLastPaginationVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    } catch (err) {
      console.error("Error fetching previous paginated user blogs:", err);
      setError(
        err.message ||
          "Błąd podczas pobierania blogów. Spróbuj ponownie później."
      );
    } finally {
      setLoading(false);
    }
  };

  // Pobranie następnych blogów
  const fetchNext = async () => {
    setLoading(true);
    try {
      const docSnapshot = await fetchNextUserBlogs(
        userId,
        lastPaginationVisible
      );
      setPaginationBlogs(
        docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setLastPaginationVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    } catch (err) {
      console.error("Error fetching next paginated user blogs:", err);
      setError(
        err.message ||
          "Błąd podczas pobierania blogów. Spróbuj ponownie później."
      );
    } finally {
      setLoading(false);
    }
  };

  const userBlogsCtx = {
    loading,
    pageCount,
    numOfPages,
    paginationBlogs,
    handlePageChange,
    currentPage,
    error,
    setError,
    getBlogs,
    getAllUserBlogs,
  };

  return (
    <UserBlogsContext.Provider value={userBlogsCtx}>
      {children}
    </UserBlogsContext.Provider>
  );
};

export const useUserBlogsContext = () => useContext(UserBlogsContext);
