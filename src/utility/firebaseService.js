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
  addDoc,
} from "firebase/firestore";
import {
  getAuth,
  updateProfile,
  updateEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

//Autoryzacja

const auth = getAuth();
export const deleteUser = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      await user.delete();
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error(
        error.message ||
          "Nie udało się usunąć użytkownika. Spróbuj ponownie później."
      );
    }
  } else {
    console.error("Brak zalogowanego użytkownika.");
  }
};

export const deleteUserBlogs = async (userId) => {
  try {
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, where("userId", "==", userId));

    // Pobranie wszystkich blogów użytkownika
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Brak blogów do usunięcia.");
      return;
    }

    // Iteracja przez dokumenty i ich usunięcie
    const deletePromises = querySnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(db, "blogs", docSnapshot.id))
    );

    // Czekamy aż wszystkie blogi zostaną usunięte
    await Promise.all(deletePromises);
    console.log("Wszystkie blogi użytkownika zostały usunięte.");
  } catch (error) {
    console.error("Error deleting user blogs:", error);
    throw new Error(
      error.message || "Nie udało się usunąć blogów użytkownika."
    );
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error reseting password:", error);
    throw new Error(
      error.message || "Nie udało zresetować hasła. Spróbuj ponownie później."
    );
  }
};

export const signInUser = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    console.error("Error during login:", error);
    if (
      error.message ===
      "FirebaseError: Firebase: Error (auth/invalid-credential)."
    ) {
      throw new Error("Wpisz poprawny email i hasło.");
    } else {
      throw new Error(
        "Nie udało się zalogować użytkownika. Spróbuj ponownie później!"
      );
    }
  }
};

export const signUpUser = async (email, password, displayName) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(user, { displayName });
    return user;
  } catch (error) {
    console.error("Error during creating account:", error);
    throw new Error(
      error.message || "Nie udało się stworzyć konta dla nowego użytkownika."
    );
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error flogout:", error);
    throw new Error(
      error.message ||
        "Nie udało się wylogować użytkownika. Sróbuj ponownie później"
    );
  }
};

export const updateUserProfile = async (user, displayName, email) => {
  try {
    if (displayName !== user.displayName) {
      await updateProfile(user, { displayName });
    }
    if (email !== user.email) {
      await updateEmail(user, email);
    }
  } catch (error) {
    console.error("Error updating userprofile:", error);
    throw new Error(
      error.message ||
        "Nie udało się zaktualizować danych. Spróbuj ponownie później."
    );
  }
};

export const getAuthInstance = () => auth;

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
    if (!tags || tags.length === 0) {
      return [];
    }
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
    const blogDoc = await getDoc(blogRef);
    if (!blogDoc.exists()) {
      throw new Error("Blog nie istnieje.");
    }
    const existingData = blogDoc.data();
    await updateDoc(blogRef, {
      comments,
      timestamp: existingData.timestamp || serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating comments:", error);
    throw new Error(error.message || "Nie udało się dodać komentarza.");
  }
};

export const updateBlogLikes = async (id, likes) => {
  try {
    const blogRef = doc(db, "blogs", id);
    const blogDoc = await getDoc(blogRef);
    if (!blogDoc.exists()) {
      throw new Error("Blog nie istnieje.");
    }

    const existingData = blogDoc.data();
    await updateDoc(blogRef, {
      likes,
      countLikes: likes.length,
      timestamp: existingData.timestamp || serverTimestamp(),
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

//Filtrowanie tagami
export const fetchBlogsByTag = async (tag) => {
  try {
    const blogRef = collection(db, "blogs");
    const tagBlogQuery = query(blogRef, where("tags", "array-contains", tag));
    const querySnapshot = await getDocs(tagBlogQuery);

    const tagBlogs = [];
    querySnapshot.forEach((doc) => {
      tagBlogs.push({ id: doc.id, ...doc.data() });
    });

    return tagBlogs;
  } catch (error) {
    console.error("Error fetching blogs by tag:", error);
    throw new Error("Nie udało się pobrać blogów dla tego tagu.");
  }
};
//Filtrowanie kategorią
export const fetchBlogsByCategory = async (category) => {
  try {
    const blogRef = collection(db, "blogs");
    const categoryBlogQuery = query(blogRef, where("category", "==", category));
    const querySnapshot = await getDocs(categoryBlogQuery);

    const tagBlogs = [];
    querySnapshot.forEach((doc) => {
      tagBlogs.push({ id: doc.id, ...doc.data() });
    });

    return tagBlogs;
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    throw new Error("Nie udało się pobrać blogów dla tej kategorii.");
  }
};

//Dodawanie i aktualizacja bloga
export const addUserBlog = async (blogData, user) => {
  try {
    const docRef = await addDoc(collection(db, "blogs"), {
      ...blogData,
      timestamp: serverTimestamp(),
      author: user.displayName,
      userId: user.uid,
    });
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const newBlog = { ...snapshot.data(), id: docRef.id };
      return newBlog;
    } else {
      throw new Error("Nie udało się dodać bloga.");
    }
  } catch (error) {
    console.error("Error during add new blog:", error);
    throw new Error("Błąd podczas dodawania bloga.");
  }
};

export const updateUserBlog = async (blogId, updatedData, user) => {
  try {
    const docRef = doc(db, "blogs", blogId);
    const existingDoc = await getDoc(docRef);
    if (!existingDoc.exists()) {
      throw new Error("Nie znaleziono bloga do aktualizacji.");
    }
    const existingData = existingDoc.data();
    const originalTimestamp = existingData.timestamp;

    await updateDoc(docRef, {
      ...updatedData,
      timestamp: originalTimestamp,
      author: existingData.author || user.displayName,
      userId: existingData.userId || user.uid,
    });

    return {
      ...updatedData,
      id: blogId,
      timestamp: originalTimestamp,
    };
  } catch (error) {
    console.error("Error during update blog:", error);
    throw new Error("Błąd podczas aktualizacji bloga.");
  }
};
