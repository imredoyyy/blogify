import { useDocumentTitle } from "../utils/use-document-title";
import { UpdateUserInfoForm } from "../components/update-user-info-form";
import { UpdateUserPasswordForm } from "../components/update-user-password-form";
import { ProfileBottom } from "../components/profile-bottom";

const Profile = () => {
  useDocumentTitle("Profile | Blogify");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 lg:ml-0 lg:mr-auto lg:max-w-4xl lg:pl-12">
      <h1 className="text-xl font-medium lg:text-2xl">Profile</h1>

      <UpdateUserInfoForm />
      <UpdateUserPasswordForm />
      <ProfileBottom />
    </div>
  );
};

export default Profile;
