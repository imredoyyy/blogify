import { Container } from "../components/container";
import AuthForm from "../components/auth-form";
import { useState } from "react";

const SignIn = () => {
  const [loggingIn, setLoggingIn] = useState(false);

  const handleFormSubmit = async (data) => {
    setLoggingIn(true);

    try {
      console.log(data);
    } catch (error) {
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
        />
      </div>
    </Container>
  );
};

export default SignIn;
