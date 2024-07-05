import { useDocumentTitle } from "../utils/use-document-title";
import { UpdateUserInfoForm } from "../components/update-user-info-form";

const Profile = () => {
  useDocumentTitle("Profile | Blogify");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
      <h1 className="text-xl font-medium lg:text-2xl">Profile</h1>

      <UpdateUserInfoForm />
    </div>
  );
};

export default Profile;
