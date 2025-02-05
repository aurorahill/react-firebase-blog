import React, { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  fetch6UserBlogs,
  fetchPrevUserBlogs,
  fetchNextUserBlogs,
  fetchAllUserBlogs,
  deleteBlog,
  addUserBlog,
  updateUserBlog,
} from "../utility/firebaseService";
import { toast } from "react-toastify";
import { useUserContext } from "./auth-context";

const UserBlogsContext = createContext();

export const UserBlogsProvider = ({ children }) => {
  const [paginationBlogs, setPaginationBlogs] = useState([]); // 6 blogów na stronie
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lastPaginationVisible, setLastPaginationVisible] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [numOfPages, setNumOfPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [error, setError] = useState(null);

  const { user } = useUserContext();
  const userId = user?.uid;

  // Pobranie wszystkich blogów
  const getAllUserBlogs = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const docSnapshot = await fetchAllUserBlogs(userId);
      if (docSnapshot.empty) {
        setNumOfPages(0);
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
        setPaginationBlogs([]);
        setPageCount(0);
        setLastPaginationVisible(null);
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

  const deleteUserBlog = async (id, onDeleteSuccess) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten blog?")) {
      setDeleting(true);
      try {
        await deleteBlog(id);
        toast.success("Blog usunięty!");
        setPaginationBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog.id !== id)
        );
        if (onDeleteSuccess) onDeleteSuccess(id);
      } catch (err) {
        console.log(err);
        toast.error("Nie udało się usunąć bloga.");
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleAddBlog = async (blogData, onSubmitSuccess) => {
    setLoading(true);
    try {
      const newBlog = await addUserBlog(blogData, user);
      setPaginationBlogs((prevBlogs) => [...prevBlogs, newBlog]);
      if (onSubmitSuccess) onSubmitSuccess(newBlog);
      toast.success("Twój blog został dodany!");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBlog = async (blogId, updatedData, onSubmitSuccess) => {
    setLoading(true);
    try {
      const updatedBlog = await updateUserBlog(blogId, updatedData, user);
      setPaginationBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogId ? { ...updatedBlog, id: blogId } : blog
        )
      );
      if (onSubmitSuccess) onSubmitSuccess(updatedBlog);
      toast.success("Twój blog został zaktualizowany!");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const userBlogsCtx = {
    loading,
    setLoading,
    pageCount,
    numOfPages,
    paginationBlogs,
    handlePageChange,
    currentPage,
    error,
    setError,
    getBlogs,
    getAllUserBlogs,
    deleteUserBlog,
    deleting,
    handleUpdateBlog,
    handleAddBlog,
  };

  return (
    <UserBlogsContext.Provider value={userBlogsCtx}>
      {children}
    </UserBlogsContext.Provider>
  );
};

UserBlogsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUserBlogsContext = () => useContext(UserBlogsContext);
