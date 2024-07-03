import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { app } from "../firebase";
import { toast } from "sonner";
import { signInSuccess } from "../redux/user/user-slice";

import { ButtonWithIcon } from "./button-with-icon";
import GoogleIcon from "/icons/google.svg";

export const GoogleAuthButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth(app);

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result?.user?.displayName,
          email: result?.user?.email,
          image: result?.user?.photoURL,
        }),
      });

      if (!response.ok) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      const data = await response.json();
      dispatch(signInSuccess(data));
      toast.success("Sign in successful");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ButtonWithIcon
      onClick={handleGoogleAuth}
      iconSrc={GoogleIcon}
      iconAlt="Google Icon"
      label="Continue with Google"
    />
  );
};
