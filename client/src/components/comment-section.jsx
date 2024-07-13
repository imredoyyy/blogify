import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DummyImage from "/icons/dummy-profile.png";

export const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div>
      {currentUser ? (
        <div className="flex items-center gap-2">
          <Link to="/dashboard/profile">
            <img
              src={currentUser.image ? currentUser.image : DummyImage}
              className="size-8 rounded-full"
            />
          </Link>
          <Link to="/dashboard/profile" className="text-sm">
            Signed in as: @
            {currentUser.username ? currentUser.username : currentUser.name}
          </Link>
        </div>
      ) : (
        <div>
          <Link to="/sign-in">Sign in</Link> to comment
        </div>
      )}
    </div>
  );
};
