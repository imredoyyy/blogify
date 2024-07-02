import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "../components/container";
import AuthForm from "../components/auth-form";
import { toast } from "sonner";

const SignIn = () => {
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleFormSubmit = async (data) => {
    setLoggingIn(true);

    try {
      if (!data.email || !data.password) {
        setLoggingIn(false);
        toast.error("All fields are required");
        return;
      }

      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setLoggingIn(false);

        switch (response.status) {
          case 404:
            toast.error("User with this email was not found!");
            break;
          case 401:
            toast.error("Invalid password!");
            break;
          default:
            toast.error("Something went wrong. Please try again");
            break;
        }

        return;
      }

      setLoggingIn(false);
      setLoggedIn(true);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      setLoggingIn(false);
      setLoggedIn(false);
      console.error(error);
    }
  };

  return (
    <Container>
      <div className="grid grid-cols-1 py-16 lg:grid-cols-2">
        <AuthForm
          onSubmit={handleFormSubmit}
          defaultValues={{ email: "", password: "" }}
          disabled={loggingIn}
          success={loggedIn}
        />
      </div>
    </Container>
  );
};

export default SignIn;
