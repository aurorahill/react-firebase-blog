import React, { useState, createContext, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import {
  fetchBlogDetail,
  fetchRelatedBlogs,
  updateBlogComments,
  updateBlogLikes,
  fetchBlogs,
  updateUserBlog,
} from "../utility/firebaseService";
import { toast } from "react-toastify";
import { Timestamp } from "firebase/firestore";

const DetailContext = createContext();

export const DetailContextProvider = ({ children }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const getBlogDetail = useCallback(async (id) => {
    setLoading(true);
    try {
      const blogDetail = await fetchBlogDetail(id);
      setBlog(blogDetail);
      setComments(blogDetail.comments || []);
      setLikes(blogDetail.likes || []);
      setLikeCount(blogDetail.likes?.length || 0);
      const relatedBlogsData = await fetchRelatedBlogs(blogDetail.tags);
      setRelatedBlogs(relatedBlogsData);
    } catch (err) {
      console.error("Error fetching blog detail:", err);
      setError(
        err.message || "Błąd podczas pobierania bloga. Spróbuj ponownie później"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCommentDelete = async (createdAt, id) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten komentarz?")) {
      try {
        setSendingComment(true);
        const updatedComments = comments.filter(
          (comment) => comment.createdAt.seconds !== createdAt.seconds
        );
        await updateBlogComments(id, updatedComments);
        setComments(updatedComments);
        toast.success("Komentarz usunięty!");
      } catch (err) {
        console.error("Error deleting comment:", err);
        toast.error(
          "Nie udało się usunąć komentarza. Spróbuj ponownie później"
        );
      } finally {
        setSendingComment(false);
      }
    }
  };

  // aktualizacja komentarzy po zmianie nazwy uzytkownika
  const updateCommentsUserName = async (userId, newFirstName, newLastName) => {
    setSendingComment(true);
    try {
      const blogs = await fetchBlogs();
      for (const blog of blogs) {
        const updatedComments = blog.comments.map((comment) => {
          if (comment.userId === userId) {
            return {
              ...comment,
              name: `${newFirstName} ${newLastName}`,
            };
          }
          return comment;
        });

        await updateBlogComments(blog.id, updatedComments);
      }
    } catch (err) {
      console.error("Błąd podczas aktualizacji komentarzy:", err);
      toast.error("Nie udało się zaktualizować nazwiska w komentarzach.");
    } finally {
      setSendingComment(false);
    }
  };

  //Usuwanie komentarzy użytkownika po usunięciu konta
  const deleteCommentsByUser = async (userId) => {
    setSendingComment(true);
    try {
      const blogs = await fetchBlogs();
      const blogUpdatePromises = blogs.map(async (blog) => {
        const updatedComments = blog.comments.filter(
          (comment) => comment.userId !== userId
        );
        await updateBlogComments(blog.id, updatedComments);
      });

      await Promise.all(blogUpdatePromises);
      toast.success("Usunięto wszystkie komentarze.");
      return true;
    } catch (err) {
      console.error("Error deleting comments:", err);
      setError(
        err.message || "Błąd usuwania wszystkich komentarzy Użytkownika."
      );
      return false;
    } finally {
      setSendingComment(false);
    }
  };

  const handleSendingComment = async (e, id, user) => {
    e.preventDefault();
    if (userComment.length >= 15 && userComment.length <= 300) {
      setSendingComment(true);
      try {
        const newComment = {
          createdAt: Timestamp.fromDate(new Date()),
          userId: user?.uid,
          name: user?.displayName,
          body: userComment,
        };
        const updatedComments = [...comments, newComment];
        await updateBlogComments(id, updatedComments);
        setComments(updatedComments);
        setUserComment("");
        toast.success("Komentarz dodany!");
      } catch (err) {
        console.log(err);
        setError(
          err.message ||
            "Błąd podczas zapisywania komentarza. Spróbuj ponownie później"
        );
      } finally {
        setSendingComment(false);
      }
    } else {
      toast.error("Komentarz musi zawierać 15-300 znaków.");
    }
  };

  const updateBlogAuthor = async (user, firstName, lastName) => {
    setSendingComment(true);
    try {
      const blogs = await fetchBlogs(); // Pobierz wszystkie blogi
      for (const blog of blogs) {
        if (blog.userId === user.uid) {
          // Sprawdź, czy to blog tego użytkownika
          const updatedData = {
            author: `${firstName} ${lastName}`, // Zaktualizuj autora
          };
          // Zaktualizuj bloga
          await updateUserBlog(blog.id, updatedData, user);
        }
      }
      toast.success(
        "Dane zostały zaktualizowane. Odśwież stronę, by zobaczyć zmiany!"
      );
    } catch (error) {
      console.error(
        "Error updating blog author after changing user name:",
        error
      );
      throw new Error(
        "Nie udało się zaktualizować autora bloga po zmianie nazwy użytkownika."
      );
    } finally {
      setSendingComment(false);
    }
  };

  //Optymistyczna aktualizacja
  const handleLike = async (userId, blogId) => {
    let newLikes = [...likes];
    if (userId) {
      const index = likes.findIndex((id) => id === userId);
      if (index === -1) {
        newLikes.push(userId);
      } else {
        newLikes = newLikes.filter((id) => id !== userId);
      }
      setLikes(newLikes);
      setLikeCount(newLikes.length);
      try {
        await updateBlogLikes(blogId, newLikes);
      } catch (err) {
        console.log("Error saving likes:", err);
        setError(
          err.message ||
            "Błąd podczas zapisywania like. Spróbuj ponownie później"
        );
        setLikes(likes);
        setLikeCount(likes.length);
      }
    } else {
      setShowTooltip(true);
    }
  };

  //usuwanie lajków po usunięciu konta użytkownika
  const deleteLikesByUser = async (userId) => {
    setSendingComment(true);
    try {
      const blogs = await fetchBlogs();
      for (const blog of blogs) {
        const updatedLikes = blog.likes.filter((id) => id !== userId);
        await updateBlogLikes(blog.id, updatedLikes);
      }
      toast.success("Usunięto wszystkie lajki.");
      return true;
    } catch (err) {
      console.error("Error deleting likes before deleting user account:", err);
      setError(
        err.message ||
          "Błąd podczas usuwania lajków użytkownika przed usunięciem konta."
      );
      return false;
    } finally {
      setSendingComment(false);
    }
  };

  const detailCtx = {
    getBlogDetail,
    relatedBlogs,
    sendingComment,
    loading,
    blog,
    userComment,
    setUserComment,
    comments,
    setSendingComment,
    setComments,
    likes,
    likeCount,
    setLikeCount,
    setLikes,
    error,
    setError,
    handleCommentDelete,
    handleSendingComment,
    showTooltip,
    setShowTooltip,
    handleLike,
    deleteCommentsByUser,
    updateCommentsUserName,
    deleteLikesByUser,
    updateBlogAuthor,
  };

  return (
    <DetailContext.Provider value={detailCtx}>
      {children}
    </DetailContext.Provider>
  );
};

DetailContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useDetailContext = () => useContext(DetailContext);
