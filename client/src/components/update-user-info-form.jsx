import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { updateUser } from "../redux/user/user-slice";

import { app } from "../firebase";

import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import DummyProfile from "/icons/dummy-profile.png";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { cn } from "../lib/utils";

export const UpdateUserInfoForm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const dispatch = useDispatch();

  const userId = currentUser?._id;

  const form = useForm({
    defaultValues: {
      name: currentUser?.name,
      username: currentUser?.username || "",
      email: currentUser?.email,
      image: null,
    },
  });

  const handleImageChange = (file) => {
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Only images are allowed!");
      setImageUploadProgress(null);
      return false;
    }

    // Check if the file size is less than 2MB
    if (file.size > maxFileSize) {
      toast.error("File must be less than 2MB!");
      setImageUploadProgress(null);
      return false;
    }

    return true;
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("username", data.username);
      formData.append("email", data.email);

      let imageUrl = null;

      // Upload image if it exists
      if (data.image) {
        const uploadImage = async () => {
          const storage = getStorage(app);
          const fileName = new Date().getTime() + data.image.name;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, data.image);

          return new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress.toFixed(0));
              },
              (error) => {
                console.error(error);
                setLoading(false);
                toast.error("Could not upload image!");
                setImageUploadProgress(null);
                reject(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                  resolve(downloadUrl);
                });
              },
            );
          });
        };

        imageUrl = await uploadImage();
        formData.append("image", imageUrl);
      }

      // Check if username is between 5 and 20 characters
      if (data.username.length < 5 || data.username.length > 20) {
        toast.error("Username must be between 5 and 20 characters!");
        setLoading(false);
        return;
      }

      // Check if username contains special characters or spaces
      const usernameRegex = /^[a-zA-Z0-9]+$/;

      if (!usernameRegex.test(data.username)) {
        toast.error("Username must not contain special characters or spaces!");
        setLoading(false);
        return;
      }

      const updatedData = {
        name: data.name,
        username: data.username,
        email: data.email,
        image: imageUrl,
      };

      const response = await fetch(`/api/user/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const responseData = await response.json();

      // Update the user in the store
      dispatch(updateUser(responseData));

      toast.success("Information updated successfully!");
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex w-full flex-col gap-10 lg:w-2/3"
        >
          <div className="flex justify-center">
            <FormField
              name="image"
              control={form.control}
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative size-[100px]">
                      {imageUploadProgress && imageUploadProgress < 100 && (
                        <CircularProgressbar
                          value={imageUploadProgress || 0}
                          text={`${imageUploadProgress}%`}
                          strokeWidth={5}
                          styles={{
                            root: {
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              top: 0,
                              left: 0,
                            },
                            path: {
                              stroke: `rgba(76, 175, 80, ${imageUploadProgress / 100})`,
                            },
                            trail: {
                              stroke: "rgba(102, 204, 153, 0.3)",
                            },
                            text: {
                              fill: "whitesmoke",
                              fontSize: "22px",
                            },
                          }}
                        />
                      )}
                      <img
                        src={
                          value
                            ? URL.createObjectURL(value)
                            : currentUser?.image || DummyProfile
                        }
                        className={cn(
                          "size-full rounded-full border-2 border-muted-foreground object-contain",
                          imageUploadProgress &&
                            imageUploadProgress < 100 &&
                            "opacity-50",
                        )}
                        alt="Profile"
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        id="image-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (handleImageChange(file)) {
                            onChange(file);
                          }
                        }}
                        {...field}
                      />
                      <Button
                        variant="outline"
                        asChild
                        size="icon"
                        className="size-8"
                      >
                        <Label
                          htmlFor="image-upload"
                          className="absolute -bottom-3 right-1 cursor-pointer"
                        >
                          <Camera className="size-5" />
                        </Label>
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid w-full grid-cols-1 items-center gap-5 sm:grid-cols-2 lg:gap-6">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name" className="text-muted-foreground">
                    Name
                  </Label>
                  <FormControl>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Name"
                      disabled={loading}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="username" className="text-muted-foreground">
                    Username
                  </Label>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Username"
                      id="username"
                      disabled={loading}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toLowerCase())
                      }
                      className="w-full"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="email"
              type="email"
              placeholder="Email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email" className="text-muted-foreground">
                    Email
                  </Label>
                  <FormControl>
                    <Input
                      type="email"
                      id="email"
                      disabled={loading}
                      autoComplete="username"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading || !form.formState.isDirty}
              className="mt-auto w-full text-sm"
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Update Information
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
