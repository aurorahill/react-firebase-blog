import "./App.css";
import "./style.scss";
import "./media-query.css";
import Home from "./pages/Home";
import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
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
import { BlogProvider } from "./store/blog-context";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "/detail/:id", element: <Detail /> },
      {
        path: "/create",
        element: <AddEditBlog />,
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
      <BlogProvider>
        <div className="App">
          <ToastContainer position="top-center" />
          {/* <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/detail/:id"
              element={<Detail />}
            />
            <Route
              path="/create"
              element={<AddEditBlog />}
            />
            <Route
              path="/update/:id"
              element={<AddEditBlog />}
            />
            <Route
              path="/about"
              element={<About />}
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes> */}
          <RouterProvider router={router}></RouterProvider>
        </div>
      </BlogProvider>
    </UserContextProvider>
  );
}

export default App;
