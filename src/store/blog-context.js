import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  fetchBlogs,
  fetchTags,
  deleteBlog,
  fetch4Blogs,
  fetch4MoreBlogs,
} from "../utility/firebaseService";

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  // const [blogs, setBlogs] = useState([]);
  const [trendBlogs, setTrendBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [mostLikedBlogs, setMostLikesBlogs] = useState([]);
  const [tags, setTags] = useState([]);
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

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten blog?")) {
      try {
        await deleteBlog(id);
        toast.success("Blog usunięty!");
        setTrendBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog.id !== id)
        );
        setRecentBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog.id !== id)
        );
        setMostLikesBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog.id !== id)
        );
      } catch (err) {
        console.log(err);
        toast.error("Nie udało się usunąć bloga.");
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Pobranie 4 pierwszych blogów
  const get4Blogs = useCallback(async () => {
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
    }
  }, []);

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

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
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
    fetchData();
  }, []);

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
    handleDelete,
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
  };

  return (
    <BlogContext.Provider value={blogCtx}>{children}</BlogContext.Provider>
  );
};

export const useBlogContext = () => useContext(BlogContext);
