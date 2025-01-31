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
  comments: [],
  likes: [],
  countLikes: 0,
};

const categoryOption = [
  "Technologia",
  "Kultura",
  "Sport",
  "Polityka",
  "Jedzenie",
  "Moda",
  "Nauka",
  "Sztuka",
  "Zdrowie i uroda",
  "Motoryzacja",
  "Biznes",
  "Podróże",
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

  const handleBack = () => {
    navigate(-1);
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
          const docRef = await addDoc(collection(db, "blogs"), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("Blog utworzony pomyślnie!");
          navigate(`/detail/${docRef.id}`);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          const docRef = await updateDoc(doc(db, "blogs", id), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("Blog został zaktualizowany!");
          navigate(`/detail/${docRef.id}`);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      return toast.error("Uzupełnij wszystkie pola!");
    }
  };

  return (
    <>
      <Heading title={id ? "Zaktualizuj blog" : "Stwórz blog"} />
      <div className={classes.wrapper}>
        <form
          className={classes["blog-form"]}
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            placeholder="Tytuł"
            name="title"
            value={title}
            onChange={handleChange}
            className={classes["blog-form__form-control"]}
          />

          <div>
            <ReactTagInput
              tags={tags}
              placeholder="Dodaj tag i kliknij enter"
              onChange={handleTags}
              className={classes["blog-form__form-control"]}
            />
          </div>
          <div className={classes.trending}>
            <p className={classes.trending__para}>
              Czy chcesz wyświetlać blog karuzeli na stronie głównej?
            </p>
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
              &nbsp;Tak&nbsp;
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
              &nbsp;Nie
            </label>
          </div>
          <div>
            <select
              value={category}
              onChange={onCategoryChange}
              className={classes["blog-form__form-control"]}
            >
              <option>Wybierz kategorię</option>
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
              placeholder="Opis"
              value={description}
              onChange={handleChange}
              className={`${classes["blog-form__form-control"]} ${classes.description}`}
            ></textarea>
          </div>
          <Input
            type="text"
            placeholder="Wklej URL obrazu"
            name="imgURL"
            value={imgURL}
            onChange={handleChange}
            className={classes["blog-form__form-control"]}
          />

          <div className={classes["blog-form__actives"]}>
            <Button
              type="button"
              textOnly
              onClick={handleBack}
            >
              Wróć
            </Button>
            <Button disabled={isLoading}>
              {id
                ? isLoading
                  ? "Aktualizowanie..."
                  : "Zaktualizuj"
                : isLoading
                ? "Zapisywanie..."
                : "Zapisz"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEditBlog;
