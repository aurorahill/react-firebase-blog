import React, { useState, createContext, useContext } from "react";

import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";

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

  const getBlogDetail = async (id) => {
    setLoading(true);
    try {
      const blogRef = collection(db, "blogs");
      const docRef = doc(db, "blogs", id);
      const blogDetail = await getDoc(docRef);
      if (!blogDetail.exists()) {
        throw new Error(
          "Brak bloga o takim id. Odśwież stronę i spróbuj ponownie!"
        );
      }
      setBlog(blogDetail.data());
      const relatedBlogsQuery = query(
        blogRef,
        where("tags", "array-contains-any", blogDetail.data().tags, limit(3))
      );
      setComments(blogDetail.data().comments || []);
      const blogLikes = blogDetail.data().likes || [];
      setLikes(blogLikes);
      setLikeCount(blogLikes.length);
      const relatedBlogsSnapshot = await getDocs(relatedBlogsQuery);
      const relatedBlogs = [];
      relatedBlogsSnapshot.forEach((doc) => {
        relatedBlogs.push({ id: doc.id, ...doc.data() });
      });
      setRelatedBlogs(relatedBlogs);
    } catch (err) {
      console.error("Error fetching paginated user blogs:", err);
      setError(
        err.message ||
          "Błąd podczas pobierania blogów. Spróbuj ponownie później."
      );
    } finally {
      setLoading(false);
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
  };

  return (
    <DetailContext.Provider value={detailCtx}>
      {children}
    </DetailContext.Provider>
  );
};

export const useDetailContext = () => useContext(DetailContext);
