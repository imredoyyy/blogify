import { useSelector } from "react-redux";

// Utility function to check if user is authenticated
export const useIsAuthenticated = () => {
  const { currentUser } = useSelector((state) => state.user);

  return !!currentUser;
};
