import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const DashPost = () => {
  const { currentUser, loading } = useSelector((state) => state.user);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (
    !currentUser ||
    (currentUser.role !== "admin" && currentUser.role !== "editor")
  ) {
    return <Navigate to="/" />;
  }

  return <div>DashPost</div>;
};

export default DashPost;
