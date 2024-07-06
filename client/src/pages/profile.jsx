import { useDocumentTitle } from "../utils/use-document-title";
import { UpdateUserInfoForm } from "../components/update-user-info-form";
import { UpdateUserPasswordForm } from "../components/update-user-password-form";
import { ProfileBottom } from "../components/profile-bottom";

const Profile = () => {
  useDocumentTitle("Profile | Blogify");

  return (
    <div className="max-w-3x flex w-full flex-col gap-12 lg:pl-12">
      <h1 className="text-xl font-medium lg:text-2xl">Profile</h1>

      <UpdateUserInfoForm />
      <UpdateUserPasswordForm />
      <ProfileBottom />
    </div>
  );
};

export default Profile;
