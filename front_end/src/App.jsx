import { Button } from "flowbite-react";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import {
  Home,
  About,
  Projects,
  SignIn,
  SignUp,
  Dashboard,
  CreatePost,
  UpdatePost,
  PostPage,
  Search,
} from "./pages";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<Home />}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route path="/projects" element={<Projects />}></Route>
      <Route path="/post/:postSlug" element={<PostPage />}></Route>
      <Route path="/sign-in" element={<SignIn />}></Route>
      <Route path="/search" element={<Search />}></Route>
      <Route path="/sign-up" element={<SignUp />}></Route>
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Route>
      <Route element={<OnlyAdminPrivateRoute />}>
        <Route path="/create-post" element={<CreatePost />}></Route>
        <Route path="/update-post/:postId" element={<UpdatePost />}></Route>
      </Route>
      <Route
        path="/*"
        element={<h1>Not Found Requested Url is incorrect</h1>}
      ></Route>
    </Route>
  )
);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
