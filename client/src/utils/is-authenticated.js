import { useSelector } from "react-redux";

export const useIsAuthenticated = () => {
  const { currentUser } = useSelector((state) => state.user);

  return !!currentUser;
};
