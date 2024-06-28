import { ThemeProvider } from "./provider/provider";
import { Routes, Route } from "react-router-dom";

import Home from "./page/home";
import Dashboard from "./page/dashboard";
import SignUp from "./page/sign-up";
import SignIn from "./page/sign-in";

const App = () => {
  return (
    <ThemeProvider>
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
