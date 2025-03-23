import React from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContextProvider from "./store/auth-context";
import { BlogContextProvider } from "./store/blog-context";
import ScrollToTop from "./components/UI/Scroll/ScrollToTop/ScrollToTop";
import { DetailContextProvider } from "./store/datail-context";
import { UserBlogsProvider } from "./store/user-blogs-context";
import CookieBanner from "./components/UI/CookieBanner/CookieBanner";
import { router } from "./routes";

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
