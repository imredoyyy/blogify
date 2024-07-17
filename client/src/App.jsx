import { ThemeProvider } from "./provider/provider";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Pages
import Home from "./pages/home";
import DashboardPage from "./pages/dashboard-page";
import SignUp from "./pages/sign-up";
import SignIn from "./pages/sign-in";
import Profile from "./pages/profile";
import DashPost from "./pages/dash-post";
import CreatePost from "./pages/create-post";
import Post from "./pages/post";
import EditPost from "./pages/edit-post";
import Users from "./pages/users";
import DashComments from "./pages/dash-comments";
import ErrorPage from "./pages/error-page";

import { Header } from "./components/header";
import About from "./pages/about";
import { OfflineToast } from "./components/offline-toast";

const App = () => {
  return (
    <ThemeProvider>
      <Toaster />
      <OfflineToast />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route path="posts" element={<DashPost />} />
          <Route path="profile" element={<Profile />} />
          <Route path="users" element={<Users />} />
          <Route path="comments" element={<DashComments />} />
        </Route>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/about" element={<About />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:slug" element={<Post />} />
        <Route path="/edit-post/:postId" element={<EditPost />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
