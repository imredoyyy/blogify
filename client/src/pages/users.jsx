import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { Container } from "../components/container";
import { useDocumentTitle } from "../utils/use-document-title";

const Users = () => {
  const { currentUser } = useSelector((state) => state.user);
  useDocumentTitle("Users | Blogify");

  if (currentUser.role !== "admin") {
    return <Navigate to="/" />;
  }
  return (
    <Container>
      <h1 className="text-center text-xl font-medium lg:text-3xl">All Users</h1>
    </Container>
  );
};

export default Users;
