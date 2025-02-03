import React, { useEffect, useState, useCallback } from "react";
import Heading from "../components/UI/Heading";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import classes from "./AddEditBlog.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useBlogContext } from "../store/blog-context";
import { useUserBlogsContext } from "../store/user-blogs-context";
import {
  validateCategory,
  validateDescription,
  validateImgURL,
  validateTitle,
} from "../utility/validate";
import { toast } from "react-toastify";
import { fetchBlogDetail } from "../utility/firebaseService";
import TagsInput from "../components/UI/TagsInput";

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

const AddEditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { updateBlogFromGlobalState } = useBlogContext();
  const { loading, setLoading, handleAddBlog, handleUpdateBlog } =
    useUserBlogsContext();
  const [form, setForm] = useState(initialState);

  const { title, tags, category, trending, description, imgURL } = form;
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    imgURL: "",
    trending: "",
  });

  const getFormBlogDetail = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await fetchBlogDetail(id);
      setForm(snapshot);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setForm, id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    switch (e.target.name) {
      case "title":
        setErrors((prev) => ({
          ...prev,
          title: validateTitle(e.target.value),
        }));
        break;
      case "description":
        setErrors((prev) => ({
          ...prev,
          description: validateDescription(e.target.value),
        }));
        break;
      case "imgURL":
        setErrors((prev) => ({
          ...prev,
          imgURL: validateImgURL(e.target.value),
        }));
        break;

      default:
        break;
    }
  };

  const handleTrending = (e) => {
    setForm({ ...form, trending: e.target.value });
  };
  const onCategoryChange = (e) => {
    setForm({ ...form, category: e.target.value });
    setErrors((prev) => ({
      ...prev,
      category: validateCategory(e.target.value),
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "title":
        setErrors((prev) => ({ ...prev, title: validateTitle(value) }));
        break;
      case "description":
        setErrors((prev) => ({
          ...prev,
          description: validateDescription(value),
        }));
        break;
      case "category":
        setErrors((prev) => ({ ...prev, category: validateCategory(value) }));
        break;
      case "imgURL":
        setErrors((prev) => ({ ...prev, imgURL: validateImgURL(value) }));
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    id && getFormBlogDetail(id);
  }, [id, getFormBlogDetail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      title: validateTitle(title),
      description: validateDescription(description),
      category: validateCategory(category),
      imgURL: validateImgURL(imgURL),
    };

    setErrors((prev) => ({ ...prev, ...newErrors }));

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      toast.error("Proszę poprawić błędy w formularzu.");
      return;
    }
    if (!id) {
      await handleAddBlog(form, (newBlog) => {
        updateBlogFromGlobalState(newBlog);
        navigate(`/detail/${newBlog.id}`);
      });
    } else {
      await handleUpdateBlog(id, form, (updatedBlog) => {
        updateBlogFromGlobalState(updatedBlog);
        navigate(`/detail/${updatedBlog.id}`);
      });
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
            onBlur={handleBlur}
            required
          />
          {errors.title && <p className={classes.error}>{errors.title}</p>}

          <TagsInput
            onChange={(updatedTags) =>
              setForm((prev) => ({ ...prev, tags: updatedTags }))
            }
            values={tags}
          />
          <div className={classes.trending}>
            <p className={classes.trending__para}>
              Czy chcesz dodać blog do wyróżnionych?
            </p>
            <p>
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
            </p>
          </div>
          <div>
            <select
              value={category}
              onChange={onCategoryChange}
              className={`${classes["blog-form__form-control"]} ${classes["blog-form__category"]}`}
              onBlur={handleBlur}
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
            {errors.category && (
              <p className={classes.error}>{errors.category}</p>
            )}
          </div>
          <div>
            <textarea
              name="description"
              placeholder="Opis"
              value={description}
              onChange={handleChange}
              className={`${classes["blog-form__form-control"]} ${classes.description}`}
              onBlur={handleBlur}
              required
            ></textarea>
            {errors.description && (
              <p className={classes.error}>{errors.description}</p>
            )}
          </div>
          <Input
            type="text"
            placeholder="Wklej URL obrazu"
            name="imgURL"
            value={imgURL}
            onChange={handleChange}
            className={classes["blog-form__form-control"]}
            onBlur={handleBlur}
          />
          {errors.imgURL && <p className={classes.error}>{errors.imgURL}</p>}
          <div className={classes["blog-form__actives"]}>
            <Button
              type="button"
              textOnly
              onClick={handleBack}
            >
              Wróć
            </Button>
            <Button disabled={loading}>
              {id
                ? loading
                  ? "Aktualizowanie..."
                  : "Zaktualizuj"
                : loading
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
