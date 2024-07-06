import { useSelector } from "react-redux";
import { useDocumentTitle } from "../utils/use-document-title";

export const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  useDocumentTitle("Dashboard | Blogify");

  return (
    <div>
      <h1 className="font-poppins text-xl lg:text-2xl">
        Hello,{" "}
        <span className="text-pretty font-semibold">{currentUser?.name}!</span>
      </h1>
    </div>
  );
};
