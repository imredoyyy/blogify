import { useState } from "react";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";

import AuthForm from "../components/auth-form";
import { Container } from "../components/container";
import { useIsAuthenticated } from "../utils/is-authenticated";
import { useDocumentTitle } from "../utils/use-document-title";

const SignUp = () => {
  const navigate = useNavigate();
  const [accountCreating, setAccountCreating] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const isAuthenticated = useIsAuthenticated();

  useDocumentTitle("Sign Up | Blogify");

  // If user is logged in redirect them to home page
  if (isAuthenticated) return <Navigate to="/" />;

  const handleFormSubmit = async (data) => {
    setAccountCreating(true);
    setAccountCreated(false);

    try {
      if (!data.name || !data.email || !data.password) {
        setAccountCreating(false);
        setAccountCreated(false);
        toast.error("All fields are required");
        return;
      }

      if (data.password.length < 8) {
        setAccountCreating(false);
        setAccountCreated(false);
        toast.error("Password must be at least 8 characters long");
        return;
      }

      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setAccountCreating(false);
        setAccountCreated(false);

        switch (response.status) {
          case 409:
            toast.error("User with this email already exists.");
            break;
          default:
            toast.error("Something went wrong. Please try again.");
            break;
        }
        return;
      }

      setAccountCreating(false);
      setAccountCreated(true);
      toast.success("Account created successfully. Please sign in.");
      navigate("/sign-in");
    } catch (error) {
      setAccountCreating(false);
      setAccountCreated(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <AuthForm
          signUp={true}
          onSubmit={handleFormSubmit}
          defaultValues={{ name: "", email: "", password: "" }}
          disabled={accountCreating}
          success={accountCreated}
        />
      </div>
    </Container>
  );
};

export default SignUp;
