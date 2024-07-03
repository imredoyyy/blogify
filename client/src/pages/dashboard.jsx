import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "../utils/is-authenticated";

const Dashboard = () => {
  const isAuthenticated = useIsAuthenticated();

  // If user is not authenticated redirect them to sign in page
  if (!isAuthenticated) return <Navigate to="/sign-in" />;

  return <div>Dashboard</div>;
};

export default Dashboard;
