import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/user-slice";

import { Container } from "../components/container";
import AuthForm from "../components/auth-form";
import { toast } from "sonner";
import { useIsAuthenticated } from "../utils/is-authenticated";
import { useDocumentTitle } from "../utils/use-document-title";

const SignIn = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const dispatch = useDispatch();

  useDocumentTitle("Sign In | Blogify");

  const handleFormSubmit = async (data) => {
    dispatch(signInStart());
    setLoggingIn(true);

    try {
      if (!data.email || !data.password) {
        toast.error("All fields are required");
        dispatch(signInFailure("All fields are required"));
        setLoggingIn(false);
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
        dispatch(signInFailure());
        setLoggingIn(false);

        switch (response.status) {
          case 404:
            toast.error("User not found! Please sign up.");
            break;
          case 401:
            toast.error("Invalid password!");
            break;
          default:
            toast.error("Something went wrong! Please try again.");
            break;
        }

        return;
      }

      const userData = await response.json();

      dispatch(signInSuccess(userData));
      setLoggedIn(true);
      toast.success("Sign in successful.");
      setLoggingIn(false);
      navigate("/");
    } catch (error) {
      setLoggedIn(false);
      setLoggingIn(false);
      dispatch(signInFailure(error.message));
    }
  };

  const isAuthenticated = useIsAuthenticated();

  // If user is logged in redirect them to home page
  if (isAuthenticated) return <Navigate to="/" />;

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
