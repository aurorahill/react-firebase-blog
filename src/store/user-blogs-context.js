import React, { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import FirebaseService from "../utility/firebaseService";
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
      const docSnapshot = await FirebaseService.users.fetchAllUserBlogs(userId);
      if (docSnapshot.empty) {
        setPaginationBlogs([]);
        setPageCount(0);
        setNumOfPages(0);
        return;
      }
      setPageCount(docSnapshot.docs.length);
      setNumOfPages(Math.ceil(docSnapshot.docs.length / 6));
    } catch (err) {
      console.error("Error fetching user blogs:", err);
      setError(err.message || "Błąd podczas pobierania blogów. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const get6Blogs = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const docSnapshot = await FirebaseService.users.fetch6UserBlogs(userId);
      if (docSnapshot.empty) {
        setPaginationBlogs([]);
        return;
      }
      const lastVisible = docSnapshot.docs[docSnapshot.docs.length - 1];
      setLastPaginationVisible(lastVisible);
      setPaginationBlogs(
        docSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          docSnapshot: doc,
        }))
      );
    } catch (err) {
      console.error("Error fetching paginated user blogs:", err);
      setError(err.message || "Błąd podczas pobierania blogów. Spróbuj ponownie później.");
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
    if (currentPage <= 1) return;
    setLoading(true);
    try {
      const docSnapshot = await FirebaseService.users.fetchPrevUserBlogs(
        userId,
        lastPaginationVisible,
        numOfPages,
        currentPage,
        pageCount
      );
      if (docSnapshot.empty) {
        return;
      }
      setCurrentPage((prev) => prev - 1);
      const lastVisible = docSnapshot.docs[docSnapshot.docs.length - 1];
      setLastPaginationVisible(lastVisible);
      setPaginationBlogs(
        docSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          docSnapshot: doc,
        }))
      );
    } catch (err) {
      console.error("Error fetching previous paginated user blogs:", err);
      setError(err.message || "Błąd podczas pobierania blogów. Spróbuj ponownie później.");
    } finally {
      setLoading(false);
    }
  };

  // Pobranie następnych blogów
  const fetchNext = async () => {
    if (currentPage >= numOfPages) return;
    setLoading(true);
    try {
      const docSnapshot = await FirebaseService.users.fetchNextUserBlogs(
        userId,
        lastPaginationVisible
      );
      if (docSnapshot.empty) {
        return;
      }
      setCurrentPage((prev) => prev + 1);
      const lastVisible = docSnapshot.docs[docSnapshot.docs.length - 1];
      setLastPaginationVisible(lastVisible);
      setPaginationBlogs(
        docSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          docSnapshot: doc,
        }))
      );
    } catch (err) {
      console.error("Error fetching next paginated user blogs:", err);
      setError(err.message || "Błąd podczas pobierania blogów. Spróbuj ponownie później.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUserBlog = async (id, onDeleteSuccess) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten blog?")) {
      setDeleting(true);
      try {
        await FirebaseService.blogs.delete(id);
        toast.success("Blog usunięty!");
        setPaginationBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog.id !== id)
        );
        if (onDeleteSuccess) onDeleteSuccess(id);
        await getAllUserBlogs();
        await get6Blogs();
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
      const newBlog = await FirebaseService.blogs.add(blogData, user);
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
      const updatedBlog = await FirebaseService.blogs.update(blogId, updatedData, user);
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
    getBlogs: get6Blogs,
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
