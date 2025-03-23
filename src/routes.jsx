import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/Root/Root";
import NotFound from "./pages/NotFound/NotFound";
import BlogRoot from "./pages/BlogRoot/BlogRoot";
import Home from "./pages/Home/Home";
import TagBlog from "./pages/TagBlog/TagBlog";
import CategoryBlog from "./pages/CategoryBlog/CategoryBlog";
import Detail from "./pages/Detail/Detail";
import AddEditBlog from "./pages/AddEditBlog/AddEditBlog";
import UserPage from "./pages/UserPage/UserPage";
import About from "./pages/About/About";
import Auth from "./pages/Auth/Auth";
import { authLoader } from "./utility/authLoader";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <BlogRoot />,
        children: [
          { path: "/", element: <Home /> },
          { path: "tag/:tag", element: <TagBlog /> },
          { path: "category/:category", element: <CategoryBlog /> },
        ],
      },
      { path: "/detail/:id", element: <Detail /> },
      {
        path: "/create",
        element: <AddEditBlog />,
        loader: authLoader,
      },
      {
        path: "/:userName/:userId",
        element: <UserPage />,
        loader: authLoader,
      },
      { path: "/update/:id", element: <AddEditBlog /> },
      { path: "/about", element: <About /> },
      { path: "/auth", element: <Auth /> },
    ],
  },
]);
