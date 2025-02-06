import React from "react";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Detail from "./pages/Detail";
import AddEditBlog from "./pages/AddEditBlog";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import RootLayout from "./pages/Root";
import Auth from "./pages/Auth";
import UserContextProvider from "./store/auth-context";
import { authLoader } from "./utility/authLoader";
import { BlogContextProvider } from "./store/blog-context";
import TagBlog from "./pages/TagBlog";
import BlogRoot from "./pages/BlogRoot";
import CategoryBlog from "./pages/CategoryBlog";
import ScrollToTop from "./components/UI/ScrollToTop";
import { DetailContextProvider } from "./store/datail-context";
import UserPage from "./pages/UserPage";
import { UserBlogsProvider } from "./store/user-blogs-context";
import CookieBanner from "./components/UI/CookieBanner";

const router = createBrowserRouter([
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

function App() {
  return (
    <UserContextProvider>
      <BlogContextProvider>
        {/* UserBlogsProvider musi być w UserContext, bo korzysta z user!!! */}
        <UserBlogsProvider>
          <DetailContextProvider>
            <div className="App">
              <ScrollToTop />
              <ToastContainer position="top-center" />
              <CookieBanner />
              <RouterProvider router={router}></RouterProvider>
            </div>
          </DetailContextProvider>
        </UserBlogsProvider>
      </BlogContextProvider>
    </UserContextProvider>
  );
}

export default App;
