import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/user-slice";
import { useDispatch, useSelector } from "react-redux";

import { Container } from "../components/container";
import AuthForm from "../components/auth-form";
import { toast } from "sonner";

const SignIn = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleFormSubmit = async (data) => {
    dispatch(signInStart());

    try {
      if (!data.email || !data.password) {
        toast.error("All fields are required");
        dispatch(signInFailure("All fields are required"));
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

      const userData = await response.json();

      dispatch(signInSuccess(userData));
      setLoggedIn(true);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      setLoggedIn(false);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <Container>
      <div className="grid grid-cols-1 py-16 lg:grid-cols-2">
        <AuthForm
          onSubmit={handleFormSubmit}
          defaultValues={{ email: "", password: "" }}
          disabled={loading}
          success={loggedIn}
        />
      </div>
    </Container>
  );
};

export default SignIn;
