// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import Button from "./UI/Button";
// // import FontAwesome from "react-fontawesome";
// // import classes from "./Search.module.scss";
// // import SectionHeader from "./SectionHeader";
// // import { useLocation } from "react-router-dom";
// // import { collection, getDocs, query, where } from "firebase/firestore";
// // import { db } from "../firebase";
// // import { useBlogContext } from "../store/blog-context";

// // const Search = () => {
// //   const [search, setSearch] = useState(""); // stan dla wpisanego zapytania
// //   const { setBlogs } = useBlogContext(); // funkcja do ustawiania blogów w kontekście
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // Funkcja do pobierania wszystkich blogów
// //   const getBlogs = async () => {
// //     const blogRef = collection(db, "blogs");
// //     const docSnapshot = await getDocs(blogRef);
// //     setBlogs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
// //   };

// //   // Funkcja wyszukiwania blogów w Firebase na podstawie tytułu
// //   const searchBlog = async (searchTerm) => {
// //     const blogRef = collection(db, "blogs");
// //     const searchQuery = query(blogRef, where("title", "==", searchTerm));
// //     const titleSnapshot = await getDocs(searchQuery);

// //     let searchTitleBlogs = [];
// //     titleSnapshot.forEach((doc) => {
// //       searchTitleBlogs.push({ id: doc.id, ...doc.data() });
// //     });
// //     setBlogs(searchTitleBlogs);
// //   };

// //   // Obsługuje zmianę w polu wyszukiwania
// //   const handleChange = (e) => {
// //     const { value } = e.target;
// //     setSearch(value);

// //     // Jeśli pole wyszukiwania jest puste, pobieramy wszystkie blogi
// //     if (!value) {
// //       getBlogs();
// //     }
// //   };

// //   // Obsługuje wyszukiwanie po kliknięciu przycisku
// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (search) {
// //       // Jeśli wyszukiwanie nie jest puste, przekierowujemy do URL z zapytaniem
// //       navigate(`/search?searchQuery=${search}`);
// //     } else {
// //       // Jeśli pole jest puste, wracamy na stronę główną
// //       navigate("/");
// //     }
// //   };

// //   // Funkcja do odczytania zapytania z URL
// //   const queryString = new URLSearchParams(location.search);
// //   const searchQuery = queryString.get("searchQuery");

// //   // Uruchamiamy wyszukiwanie, jeśli `searchQuery` jest dostępne w URL
// //   useEffect(() => {
// //     if (searchQuery) {
// //       searchBlog(searchQuery); // Wywołanie funkcji wyszukiwania
// //     } else {
// //       getBlogs(); // Jeśli brak zapytania, pobieramy wszystkie blogi
// //     }
// //   }, [searchQuery]); // Za każdym razem, gdy `searchQuery` zmienia się w URL

// //   return (
// //     <section>
// //       <SectionHeader>Search</SectionHeader>
// //       <form
// //         onSubmit={handleSubmit}
// //         className={classes.search}
// //       >
// //         <input
// //           type="text"
// //           value={search}
// //           placeholder="Enter full title"
// //           onChange={handleChange}
// //           className={classes.search__input}
// //         />
// //         <Button className={classes.search__btn}>
// //           <FontAwesome name="search" />
// //         </Button>
// //       </form>
// //     </section>
// //   );
// // };

// // export default Search;

// import React, { useRef } from "react";
// import { useBlogContext } from "../store/blog-context";
// import Input from "./UI/Input";
// import SectionHeader from "./SectionHeader";

// const Search = () => {
//   const { searchTerm, setSearchTerm } = useBlogContext();
//   const lastChange = useRef(null);

//   const handleChange = (e) => {
//     const value = e.target.value;

//     if (lastChange.current) {
//       clearTimeout(lastChange.current);
//     }

//     lastChange.current = setTimeout(() => {
//       setSearchTerm(value); // Ustaw wartość wyszukiwania
//     }, 500);
//   };

//   return (
//     <section>
//       <SectionHeader>Search</SectionHeader>
//       <Input
//         type="text"
//         value={searchTerm}
//         placeholder="Search"
//         onChange={handleChange}
//       />
//     </section>
//   );
// };

// export default Search;

// import React, { useState, useEffect } from "react";
// import classes from "./Search.module.scss";
// import SectionHeader from "./SectionHeader";
// import { useDailyBlogContext } from "../store/daily-blog-context";
// import Input from "./UI/Input";

// const Search = ({ className }) => {
//   const { blogs, allBlogs, setFilteredBlogs, setSearchTerm } =
//     useDailyBlogContext();
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   // Aktualizuj wartość debouncedSearch po określonym czasie (500ms)
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 500);

//     // Wyczyść poprzedni timeout
//     return () => clearTimeout(handler);
//   }, [search]);

//   // Funkcja do filtrowania blogów
//   useEffect(() => {
//     if (debouncedSearch.trim() === "") {
//       setFilteredBlogs(blogs); // Wyświetl tylko 4 blogi (lazy loading)
//     } else {
//       const lowerCaseSearchTerm = debouncedSearch.toLowerCase();
//       const filtered = allBlogs.filter(
//         (blog) =>
//           blog.title.toLowerCase().includes(lowerCaseSearchTerm) ||
//           blog.description.toLowerCase().includes(lowerCaseSearchTerm) ||
//           blog.author.toLowerCase().includes(lowerCaseSearchTerm) ||
//           blog.tags.some((tag) =>
//             tag.toLowerCase().includes(lowerCaseSearchTerm)
//           )
//       );
//       setFilteredBlogs(filtered); // Wyświetl przefiltrowane blogi
//     }
//     // Opcjonalnie aktualizuj searchTerm w kontekście
//     setSearchTerm(debouncedSearch);
//   }, [debouncedSearch, blogs, allBlogs, setFilteredBlogs, setSearchTerm]);

//   const handleChange = (e) => {
//     setSearch(e.target.value);
//   };

//   return (
//     <section
//       className={className ? `${className} ${classes.search}` : classes.search}
//     >
//       <SectionHeader>Search</SectionHeader>
//       <Input
//         type="text"
//         value={search}
//         placeholder="Search"
//         onChange={handleChange}
//       />
//     </section>
//   );
// };

// export default Search;

import React from "react";
import classes from "./Search.module.scss";
import SectionHeader from "./UI/SectionHeader";
import { useDailyBlogContext } from "../store/daily-blog-context";
import Input from "./UI/Input";

const Search = ({ className }) => {
  const { searchTerm, setSearchTerm } = useDailyBlogContext();

  const handleChange = (e) => {
    setSearchTerm(e.target.value); // Aktualizujemy tekst wyszukiwania
  };

  return (
    <section
      className={className ? `${className} ${classes.search}` : classes.search}
    >
      <SectionHeader>Search</SectionHeader>
      <Input
        type="text"
        value={searchTerm}
        placeholder="Search"
        onChange={handleChange}
      />
    </section>
  );
};

export default Search;
