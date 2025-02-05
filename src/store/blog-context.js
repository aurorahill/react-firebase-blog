import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import {
  fetchBlogs,
  fetchTags,
  fetch4Blogs,
  fetch4MoreBlogs,
  fetchBlogsByTag,
  fetchBlogsByCategory,
} from "../utility/firebaseService";
import { useUserContext } from "./auth-context";

const BlogContext = createContext();

export const BlogContextProvider = ({ children }) => {
  const [trendBlogs, setTrendBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [mostLikedBlogs, setMostLikesBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagPage, setTagPage] = useState([]);
  const [categoryPage, setCategoryPage] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [error, setError] = useState(null);
  const [first4Blogs, setFirst4Blogs] = useState([]); //pierwsze 4 na daily blogs
  const [allBlogs, setAllBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading4More, setLoading4More] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Opóźnione wyszukiwanie
  const { user } = useUserContext();

  const getTagPage = useCallback(
    async (tag) => {
      setLoadingPage(true);
      try {
        const blogs = await fetchBlogsByTag(tag);
        setTagPage(blogs);
      } catch (err) {
        console.error("Error fetching blogs by tag:", error);
        setError(
          err.message || "Błąd podczas pobierania blogów. Spróbuj ponownie."
        );
      } finally {
        setLoadingPage(false);
      }
    },
    [error]
  );

  const getCategoryPage = useCallback(
    async (category) => {
      setLoadingPage(true);
      try {
        const blogs = await fetchBlogsByCategory(category);
        setCategoryPage(blogs);
      } catch (err) {
        console.error("Error fetching blogs by category:", error);
        setError(
          err.message || "Błąd podczas pobierania blogów. Spróbuj ponownie."
        );
      } finally {
        setLoadingPage(false);
      }
    },
    [error]
  );

  const getTrendingBlogs = useCallback(async () => {
    try {
      const trendBlogs = await fetchBlogs({ trending: "yes" });
      setTrendBlogs(trendBlogs);
    } catch (error) {
      console.error("Error fetching trending blogs:", error);
      toast.error("Nie udało się pobrać popularnych blogów.");
    }
  }, []);

  const getRecentBlogs = useCallback(async () => {
    try {
      const recentBlogs = await fetchBlogs({
        sortBy: "timestamp",
        sortOrder: "desc",
        maxResults: 4,
      });
      setRecentBlogs(recentBlogs);
    } catch (error) {
      console.error("Error fetching recent blogs:", error);
      toast.error("Nie udało się pobrać najnowszych blogów.");
    }
  }, []);

  const getMostLikedBlogs = useCallback(async () => {
    try {
      const mostLikedBlogs = await fetchBlogs({
        sortBy: "countLikes",
        sortOrder: "desc",
        maxResults: 3,
      });
      setMostLikesBlogs(mostLikedBlogs);
    } catch (error) {
      console.error("Error fetching most liked blogs:", error);
      toast.error("Nie udało się pobrać najbardziej polubionych blogów.");
    }
  }, []);

  // Aktualizacja globalnych stanów po usunięciu bloga
  const deleteBlogFromGlobalState = (id) => {
    setAllBlogs((prev) => prev.filter((blog) => blog.id !== id));
    setTrendBlogs((prev) => prev.filter((blog) => blog.id !== id));
    setRecentBlogs((prev) => prev.filter((blog) => blog.id !== id));
    setFilteredBlogs((prev) => prev.filter((blog) => blog.id !== id));
    setTagPage((prev) => prev.filter((blog) => blog.id !== id));
    setCategoryPage((prev) => prev.filter((blog) => blog.id !== id));
    fetchData();
  };

  const updateBlogFromGlobalState = (blogData) => {
    const updateOrAdd = (list) =>
      list.some((blog) => blog.id === blogData.id)
        ? list.map((blog) => (blog.id === blogData.id ? blogData : blog))
        : [...list, blogData];
    setAllBlogs((prev) => updateOrAdd(prev));
    if (blogData.trending === "yes") {
      setTrendBlogs((prev) => updateOrAdd(prev));
    } else {
      setTrendBlogs((prev) => prev.filter((blog) => blog.id !== blogData.id));
    }
    setRecentBlogs((prev) => updateOrAdd(prev));
    setFilteredBlogs((prev) => updateOrAdd(prev));
    setTagPage((prev) => updateOrAdd(prev));
    setCategoryPage((prev) => updateOrAdd(prev));
    fetchData();
  };

  // Pobranie 4 pierwszych blogów
  const get4Blogs = useCallback(async () => {
    setLoading4More(true);
    try {
      const docSnapshot = await fetch4Blogs();
      if (docSnapshot.length > 0) {
        setFirst4Blogs(docSnapshot);
        setFilteredBlogs(docSnapshot);
        setLastVisible(docSnapshot[docSnapshot.length - 1].docSnapshot);
      }
    } catch (err) {
      console.log("Error fetching blogs:", err);
      setError(
        err.message || "Błąd podczas pobierania blogów. Spróbuj ponownie."
      );
    } finally {
      setLoading4More(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filtrowanie blogów
  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      setFilteredBlogs(first4Blogs); // Brak tekstu wyszukiwania – pokazujemy 4 blogi
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
  }, [debouncedSearchTerm, first4Blogs, allBlogs]);

  // Lazy loading kolejnych blogów
  const fetch4More = async () => {
    setLoading4More(true);
    try {
      const { blogs: newBlogs, lastVisibleDoc } = await fetch4MoreBlogs(
        lastVisible
      );

      if (newBlogs.length > 0) {
        setFirst4Blogs((prev) => [...prev, ...newBlogs]);
        setFilteredBlogs((prev) => [...prev, ...newBlogs]);
        setLastVisible(lastVisibleDoc);
      } else {
        toast.info("No more blogs to display");
        setIsEmpty(true);
      }
    } catch (err) {
      console.log("Error fetching more blogs:", err);
      toast.error("Błąd podczas ładowania blogów. Spróbuj ponownie później.");
    } finally {
      setLoading4More(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const blogTags = await fetchTags();
      setTags(blogTags);
      const allBlogs = await fetchBlogs({});
      setAllBlogs(allBlogs);
    } catch (error) {
      console.log(error);
      setError("Błąd podczas pobierania blogów.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  //  category count
  const counts = allBlogs.reduce((prevValue, currentValue) => {
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
    loading4More,
    setLoading,
    trendBlogs,
    categoryCount,
    recentBlogs,
    mostLikedBlogs,
    getTrendingBlogs,
    getRecentBlogs,
    getMostLikedBlogs,
    error,
    first4Blogs,
    filteredBlogs,
    isEmpty,
    fetch4More,
    searchTerm,
    setSearchTerm,
    get4Blogs,
    setError,
    setTrendBlogs,
    updateBlogFromGlobalState,
    deleteBlogFromGlobalState,
    getTagPage,
    tagPage,
    loadingPage,
    categoryPage,
    getCategoryPage,
  };

  return (
    <BlogContext.Provider value={blogCtx}>{children}</BlogContext.Provider>
  );
};

BlogContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useBlogContext = () => useContext(BlogContext);
