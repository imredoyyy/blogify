import { ThemeProvider } from "./provider/provider";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import SignUp from "./pages/sign-up";
import SignIn from "./pages/sign-in";

import { Header } from "./components/header";

const App = () => {
  return (
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
