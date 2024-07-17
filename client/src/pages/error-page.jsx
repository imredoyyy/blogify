import { Link } from "react-router-dom";

import { Container } from "../components/container";
import { Button } from "../components/ui/button";
const ErrorPage = () => {
  return (
    <Container className="grid min-h-screen place-items-center">
      <div className="mx-auto w-full max-w-3xl space-y-5 text-center">
        <h1 className="text-3xl font-semibold lg:text-4xl">
          Oops, looks like the page you are looking for does not exist!
        </h1>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </Container>
  );
};

export default ErrorPage;
