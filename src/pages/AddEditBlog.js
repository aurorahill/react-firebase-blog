import React, { useState, useEffect, useContext } from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import Heading from "../components/UI/Heading";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import classes from "./AddEditBlog.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../store/auth-context";
import {
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { doc } from "firebase/firestore";

const initialState = {
  title: "",
  tags: [],
  trending: "no",
  category: "",
  description: "",
  imgURL: "",
};

const categoryOption = [
  "Fashion",
  "Technology",
  "Food",
  "Politics",
  "Sports",
  "Business",
  "Art",
];

const AddEditBlog = () => {
  const [form, setForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const { title, tags, category, trending, description, imgURL } = form;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTags = (tags) => {
    setForm({ ...form, tags });
  };
  const handleTrending = (e) => {
    setForm({ ...form, trending: e.target.value });
  };
  const onCategoryChange = (e) => {
    setForm({ ...form, category: e.target.value });
  };

  const getBlogDetail = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "blogs", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setForm({ ...snapshot.data() });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    id && getBlogDetail();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category && tags && title && description && trending && imgURL) {
      setIsLoading(true);
      if (!id) {
        try {
          await addDoc(collection(db, "blogs"), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("Blog created successfully!");
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
          navigate("/");
        }
      } else {
        try {
          await updateDoc(doc(db, "blogs", id), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("Your blog was updated!");
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
          navigate("/");
        }
      }
    } else {
      return toast.error("All fields are mandatory to fill");
    }
  };

  return (
    <>
      <Heading title={id ? "Update blog" : "Create Blog"} />
      <div className={classes.wrapper}>
        <form
          className={classes["blog-form"]}
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            placeholder="Title"
            name="title"
            value={title}
            onChange={handleChange}
            className={classes["blog-form__form-control"]}
          />

          <div>
            <ReactTagInput
              tags={tags}
              placeholder="Add tag and press enter"
              onChange={handleTags}
              className={classes["blog-form__form-control"]}
            />
          </div>
          <div className={classes.trending}>
            <p className={classes.trending__para}>Is it trending blog?</p>
            <input
              id="radioOptionYes"
              type="radio"
              name="radioOption"
              value="yes"
              checked={trending === "yes"}
              onChange={handleTrending}
            />
            <label
              htmlFor="radioOptionYes"
              className={classes["trending__radio-label"]}
            >
              &nbsp;Yes&nbsp;
            </label>
            <input
              id="radioOptionNo"
              type="radio"
              name="radioOption"
              value="no"
              checked={trending === "no"}
              onChange={handleTrending}
            />
            <label
              htmlFor="radioOptionNo"
              className={classes["trending__radio-label"]}
            >
              &nbsp;No
            </label>
          </div>
          <div>
            <select
              value={category}
              onChange={onCategoryChange}
              className={classes["blog-form__form-control"]}
            >
              <option>Please select category</option>
              {categoryOption.map((option, index) => (
                <option
                  value={option || ""}
                  key={index}
                >
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <textarea
              name="description"
              placeholder="Description"
              value={description}
              onChange={handleChange}
              className={`${classes["blog-form__form-control"]} ${classes.description}`}
            ></textarea>
          </div>
          <Input
            type="text"
            placeholder="Paste image url"
            name="imgURL"
            value={imgURL}
            onChange={handleChange}
            className={classes["blog-form__form-control"]}
          />

          <div className={classes["blog-form__actives"]}>
            <Button disabled={isLoading}>
              {id
                ? isLoading
                  ? "Uploading..."
                  : "Upload"
                : isLoading
                ? "Submitting..."
                : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEditBlog;

// import React, { useState, useEffect, useContext } from "react";
// import ReactTagInput from "@pathofdev/react-tag-input";
// import "@pathofdev/react-tag-input/build/index.css";
// import Heading from "../components/UI/Heading";
// import Input from "../components/UI/Input";
// import Button from "../components/UI/Button";
// import classes from "./AddEditBlog.module.scss";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { UserContext } from "../store/auth-context";
// import {
//   addDoc,
//   collection,
//   getDoc,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "../firebase";
// import { doc } from "firebase/firestore";
// import Spinner from "../components/UI/Spinner";
// import { deleteImage, uploadImage } from "../lib/cloudinary";

// const initialState = {
//   title: "",
//   tags: [],
//   trending: "no",
//   category: "",
//   description: "",
//   imgUrl: "",
//   public_id: "",
// };

// const categoryOption = [
//   "Fashion",
//   "Technology",
//   "Food",
//   "Politics",
//   "Sports",
//   "Business",
// ];

// const AddEditBlog = () => {
//   const [form, setForm] = useState(initialState);
//   const [isLoading, setIsLoading] = useState(false);
//   const [file, setFile] = useState(null);
//   const { user } = useContext(UserContext);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const { title, tags, category, trending, description } = form;

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleTags = (tags) => {
//     setForm({ ...form, tags });
//   };
//   const handleTrending = (e) => {
//     setForm({ ...form, trending: e.target.value });
//   };
//   const onCategoryChange = (e) => {
//     setForm({ ...form, category: e.target.value });
//   };

//   const getBlogDetail = async () => {
//     setIsLoading(true);
//     try {
//       const docRef = doc(db, "blogs", id);
//       const snapshot = await getDoc(docRef);
//       if (snapshot.exists()) {
//         setForm({ ...snapshot.data() });
//       }
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     id && getBlogDetail();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Sprawdzenie, czy wszystkie pola formularza są wypełnione
//     if (category && tags && title && description && trending) {
//       setIsLoading(true);

//       try {
//         let imgUrl = form.imgUrl; // Używamy istniejącego imgUrl (jeśli edytujemy)
//         let publicId = form.public_id; // Używamy istniejącego public_id (jeśli edytujemy)

//         // Przesyłanie obrazu, jeśli nowy plik został wybrany
//         if (file) {
//           // Jeśli istnieje stary obraz, usuń go z Cloudinary
//           if (publicId) {
//             deleteImage(publicId);
//           }

//           // Przesyłanie nowego obrazu
//           const uploadedImage = await uploadImage(file); // Wywołanie funkcji `uploadImage`
//           imgUrl = uploadedImage.secure_url; // URL nowego obrazu
//           publicId = uploadedImage.public_id; // public_id nowego obrazu
//         }

//         const blogData = {
//           ...form,
//           imgUrl, // Dodanie URL obrazu
//           public_id: publicId, // Dodanie public_id obrazu
//           timestamp: serverTimestamp(),
//           author: user.displayName,
//           userId: user.uid,
//         };

//         if (!id) {
//           // Tworzenie nowego bloga
//           await addDoc(collection(db, "blogs"), blogData);
//           toast.success("Blog created successfully!");
//         } else {
//           // Aktualizacja istniejącego bloga
//           await updateDoc(doc(db, "blogs", id), blogData);
//           toast.success("Your blog was updated!");
//         }

//         navigate("/"); // Przekierowanie na stronę główną
//       } catch (err) {
//         console.error("Error handling blog submission:", err);
//         toast.error("An error occurred while submitting the blog");
//       } finally {
//         setIsLoading(false); // Ustawienie stanu ładowania na false
//       }
//     } else {
//       // Powiadomienie o braku wymaganych danych w formularzu
//       toast.error("All fields are mandatory to fill");
//     }
//   };

//   if (isLoading) {
//     return <Spinner />;
//   }
//   return (
//     <>
//       <Heading title={id ? "Update blog" : "Create Blog"} />
//       <div className={classes.wrapper}>
//         <form
//           className={classes["blog-form"]}
//           onSubmit={handleSubmit}
//         >
//           <Input
//             type="text"
//             placeholder="Title"
//             name="title"
//             value={title}
//             onChange={handleChange}
//             className={classes["blog-form__form-control"]}
//           />

//           <div>
//             <ReactTagInput
//               tags={tags}
//               placeholder="Add tag and press enter"
//               onChange={handleTags}
//               className={classes["blog-form__form-control"]}
//             />
//           </div>
//           <div className={classes.trending}>
//             <p className={classes.trending__para}>Is it trending blog?</p>
//             <input
//               id="radioOptionYes"
//               type="radio"
//               name="radioOption"
//               value="yes"
//               checked={trending === "yes"}
//               onChange={handleTrending}
//             />
//             <label
//               htmlFor="radioOptionYes"
//               className={classes["trending__radio-label"]}
//             >
//               &nbsp;Yes&nbsp;
//             </label>
//             <input
//               id="radioOptionNo"
//               type="radio"
//               name="radioOption"
//               value="no"
//               checked={trending === "no"}
//               onChange={handleTrending}
//             />
//             <label
//               htmlFor="radioOptionNo"
//               className={classes["trending__radio-label"]}
//             >
//               &nbsp;No
//             </label>
//           </div>
//           <div>
//             <select
//               value={category}
//               onChange={onCategoryChange}
//               className={classes["blog-form__form-control"]}
//             >
//               <option>Please select category</option>
//               {categoryOption.map((option, index) => (
//                 <option
//                   value={option || ""}
//                   key={index}
//                 >
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <textarea
//               name="description"
//               placeholder="Description"
//               value={description}
//               onChange={handleChange}
//               className={`${classes["blog-form__form-control"]} ${classes.description}`}
//             ></textarea>
//           </div>
//           <div>
//             <input
//               type="file"
//               onChange={(e) => setFile(e.target.files[0])}
//               className={`${classes["blog-form__form-control"]} ${classes.file}`}
//             />
//           </div>
//           <div className={classes["blog-form__actives"]}>
//             <Button disabled={isLoading}>
//               {id
//                 ? isLoading
//                   ? "Uploading..."
//                   : "Upload"
//                 : isLoading
//                 ? "Submitting..."
//                 : "Submit"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default AddEditBlog;
