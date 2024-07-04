import { ThemeProvider } from "./provider/provider";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Pages
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import SignUp from "./pages/sign-up";
import SignIn from "./pages/sign-in";
import Profile from "./components/profile";

import { Header } from "./components/header";
import About from "./pages/about";

const App = () => {
  return (
    <ThemeProvider>
      <Toaster />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
