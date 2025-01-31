import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  limit,
  updateDoc,
  serverTimestamp,
  startAfter,
  endAt,
  endBefore,
  limitToLast,
} from "firebase/firestore";

// Pojedynczy blog
export const fetchBlogDetail = async (id) => {
  try {
    const blogRef = doc(db, "blogs", id);
    const blogDetail = await getDoc(blogRef);
    if (!blogDetail.exists()) {
      throw new Error("Brak bloga o takim id.");
    }
    return blogDetail.data();
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw new Error(error.message || "Nie udało się pobrać bloga.");
  }
};

export const fetchRelatedBlogs = async (tags) => {
  try {
    const blogRef = collection(db, "blogs");
    const relatedBlogsQuery = query(
      blogRef,
      where("tags", "array-contains-any", tags),
      limit(3)
    );
    const relatedBlogsSnapshot = await getDocs(relatedBlogsQuery);
    let relatedBlogs = [];
    relatedBlogsSnapshot.forEach((doc) => {
      relatedBlogs.push({ id: doc.id, ...doc.data() });
    });
    return relatedBlogs;
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    throw new Error(
      error.message || "Nie udało się pobrać powiązanych blogów."
    );
  }
};

export const updateBlogComments = async (id, comments) => {
  try {
    const blogRef = doc(db, "blogs", id);
    await updateDoc(blogRef, {
      comments,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating comments:", error);
    throw new Error(error.message || "Nie udało się dodać komentarza.");
  }
};

export const updateBlogLikes = async (id, likes) => {
  try {
    const blogRef = doc(db, "blogs", id);
    await updateDoc(blogRef, {
      likes,
      countLikes: likes.length,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    throw new Error(error.message || "Nie udało się zaktualizować bloga.");
  }
};

// Do wszystkiego, sciaga wszystkie blogi
export const fetchBlogs = async (filters = {}) => {
  const { trending, sortBy, sortOrder, maxResults } = filters;
  try {
    const blogRef = collection(db, "blogs");
    let blogQuery = blogRef;

    // Dodawanie warunków do zapytania
    if (trending) {
      blogQuery = query(blogQuery, where("trending", "==", trending));
    }

    if (sortBy) {
      blogQuery = query(blogQuery, orderBy(sortBy, sortOrder || "asc"));
    }

    if (maxResults) {
      blogQuery = query(blogQuery, limit(maxResults));
    }

    const querySnapshot = await getDocs(blogQuery);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw new Error(error.message || "Nie udało się pobrać blogów.");
  }
};

//Aside
export const fetchTags = async () => {
  try {
    const blogRef = collection(db, "blogs");
    const snapshot = await getDocs(blogRef);
    let tags = [];
    snapshot.docs.forEach((doc) => {
      tags.push(...doc.get("tags"));
    });
    const uniqueTags = [...new Set(tags)];
    return uniqueTags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Nie udało się pobrać tagów.");
  }
};

export const deleteBlog = async (id) => {
  try {
    await deleteDoc(doc(db, "blogs", id));
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw new Error("Nie udało się usunąć bloga.");
  }
};

export const fetchAllUserBlogs = async (userId) => {
  try {
    const blogRef = collection(db, "blogs");
    const userBlogsQuery = query(blogRef, where("userId", "==", userId));
    const docSnapshot = await getDocs(userBlogsQuery);
    return docSnapshot;
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    throw new Error("Nie udało się pobrać blogów użytkownika.");
  }
};

export const fetch6UserBlogs = async (userId, lastPaginationVisible = null) => {
  try {
    const blogRef = collection(db, "blogs");
    let userBlogsQuery = query(
      blogRef,
      where("userId", "==", userId),
      limit(6)
    );

    if (lastPaginationVisible) {
      userBlogsQuery = query(userBlogsQuery, startAfter(lastPaginationVisible));
    }

    const docSnapshot = await getDocs(userBlogsQuery);
    return docSnapshot;
  } catch (error) {
    console.error("Error fetching first 6 user blogs:", error);
    throw new Error("Nie udało się pobrać blogów użytkownika.");
  }
};

export const fetchPrevUserBlogs = async (
  userId,
  lastPaginationVisible,
  numOfPages,
  currentPage,
  pageCount
) => {
  try {
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

    const prevBlogsQuery = query(
      blogRef,
      where("userId", "==", userId),
      end,
      limitData
    );
    const docSnapshot = await getDocs(prevBlogsQuery);
    return docSnapshot;
  } catch (error) {
    console.error("Error fetching prev user blogs:", error);
    throw new Error(
      "Nie udało się pobrać poprzedniej strony blogów użytkownika."
    );
  }
};

export const fetchNextUserBlogs = async (userId, lastPaginationVisible) => {
  try {
    const blogRef = collection(db, "blogs");
    const nextBlogsQuery = query(
      blogRef,
      where("userId", "==", userId),
      limit(6),
      startAfter(lastPaginationVisible)
    );

    const docSnapshot = await getDocs(nextBlogsQuery);
    return docSnapshot;
  } catch (error) {
    console.error("Error fetching next user blogs:", error);
    throw new Error(
      "Nie udało się pobrać następnej strony blogów użytkownika."
    );
  }
};

export const fetch4Blogs = async () => {
  try {
    const blogRef = collection(db, "blogs");
    const blogsQuery = query(blogRef, orderBy("title"), limit(4));

    const docSnapshot = await getDocs(blogsQuery);

    return docSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      docSnapshot: doc,
    }));
  } catch (error) {
    console.error("Error fetching first 4 blogs:", error);
    throw new Error("Nie udało się pobrać blogów. Spróbuj ponownie później.");
  }
};

export const fetch4MoreBlogs = async (lastVisible) => {
  try {
    const blogRef = collection(db, "blogs");
    const nextBlogsQuery = query(
      blogRef,
      orderBy("title"),
      limit(4),
      startAfter(lastVisible)
    );

    const docSnapshot = await getDocs(nextBlogsQuery);

    if (!docSnapshot.empty) {
      return {
        blogs: docSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        lastVisibleDoc: docSnapshot.docs[docSnapshot.docs.length - 1],
      };
    }

    return { blogs: [], lastVisibleDoc: null };
  } catch (error) {
    console.error("Error fetching next 4 blogs:", error);
    throw new Error(
      "Nie udało się pobrać kolejnych blogów. Spróbuj ponownie później."
    );
  }
};
