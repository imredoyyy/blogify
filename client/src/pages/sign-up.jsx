import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import AuthForm from "../components/auth-form";
import { Container } from "../components/container";

const SignUp = () => {
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const handleFormSubmit = async (data) => {
    setLoggingIn(true);
    setAccountCreated(false);

    try {
      if (!data.name || !data.email || !data.password) {
        setLoggingIn(false);
        setAccountCreated(false);
        toast.error("All fields are required");
        return;
      }

      if (data.password.length < 8) {
        setLoggingIn(false);
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
        setLoggingIn(false);
        setAccountCreated(false);

        switch (response.status) {
          case 409:
            toast.error("User with this email already exists");
            break;
          default:
            toast.error("Something went wrong. Please try again.");
            break;
        }
        return;
      }

      setLoggingIn(false);
      setAccountCreated(true);
      toast.success("Account created successfully. Please sign in.");
      navigate("/sign-in");
    } catch (error) {
      setLoggingIn(false);
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
          disabled={loggingIn}
          success={accountCreated}
        />
      </div>
    </Container>
  );
};

export default SignUp;
