import React, { useState, createContext, useContext, useCallback } from "react";
import {
  fetchBlogDetail,
  fetchRelatedBlogs,
  updateBlogComments,
  updateBlogLikes,
} from "../utility/firebaseService";
import { toast } from "react-toastify";
import { Timestamp } from "firebase/firestore";

const DetailContext = createContext();

export const DetailProvider = ({ children }) => {
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
      setError(err.message || "Błąd podczas pobierania bloga.");
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
        toast.error("Nie udało się usunąć komentarza.");
      } finally {
        setSendingComment(false);
      }
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
        setError(err.message || "Błąd podczas zapisywania komentarza.");
      } finally {
        setSendingComment(false);
      }
    } else {
      toast.error("Komentarz musi zawierać 15-300 znaków.");
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
        setError(err.message || "Błąd podczas zapisywania like.");
        setLikes(likes);
        setLikeCount(likes.length);
      }
    } else {
      setShowTooltip(true);
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
    handleLike,
  };

  return (
    <DetailContext.Provider value={detailCtx}>
      {children}
    </DetailContext.Provider>
  );
};

export const useDetailContext = () => useContext(DetailContext);
