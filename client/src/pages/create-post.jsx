import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import { useIsAuthenticated } from "../utils/is-authenticated";
import { Container } from "../components/container";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Form, FormControl, FormField, FormItem } from "../components/ui/form";
import { Button } from "../components/ui/button";
import { Camera } from "lucide-react";
import CustomTooltip from "../components/custom-tooltip";
import { quillFormats, quillModules } from "../data/quill-config";

const CreatePost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [image, setImage] = useState(null);
  const [canUpload, setCanUpload] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  const quillRef = useRef(null);

  const isAuthenticated = useIsAuthenticated();

  const form = useForm({
    defaultValues: {
      title: "",
      categories: "",
      slug: "",
      content: "",
      excerpt: "",
      tags: "",
    },
  });

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  if (
    currentUser &&
    currentUser.role !== "admin" &&
    currentUser.role !== "editor"
  ) {
    return <Navigate to="/" />;
  }

  const handleImageChange = (file) => {
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Only images are allowed!");
      setCanUpload(false);
      return false;
    }

    // Check if the file size is less than 2MB
    if (file.size > maxFileSize) {
      toast.error("File must be less than 2MB!");
      setCanUpload(false);
      return;
    }

    setCanUpload(true);
    setImage(file);

    return true;
  };

  const uploadImage = async (imageFile) => {
    const storage = getStorage(app);
    const fileName = imageFile.name + "_" + new Date().getTime();
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

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
          setImageUploaded(false);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
            setImageUploaded(true);
          });
        },
      );
    });
  };

  const handleImageUpload = async () => {
    if (image) {
      setLoading(true);
      try {
        const url = await uploadImage(image);
        setImage(url);
        form.setValue("image", url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image: ", error);
      } finally {
        setLoading(false);
        setCanUpload(false);
      }
    } else {
      toast.error("Please select an image first!");
    }
  };

  const handleRemoveImage = () => {
    if (canUpload && image) {
      setImage(null);
      setCanUpload(false);
      form.setValue("image", null);
      toast.success("Image removed successfully!");
    }
  };

  const handlePostSubmit = async (data) => {
    setLoading(true);

    try {
      const sanitizeContent = DOMPurify.sanitize(data.content);

      const categories = data.categories
        .trim()
        .split(",")
        .map((category) => category.trim());

      const tags = data.tags
        .trim()
        .split(",")
        .map((tag) => tag.trim());

      const formData = new FormData();
      formData.append("title", data.title.trim());
      categories.forEach((category) => {
        formData.append("categories[]", category);
      });
      formData.append("slug", data.slug.trim());
      formData.append("excerpt", data.excerpt.trim());
      formData.append("content", sanitizeContent);
      formData.append("tags[]", tags);

      if (!data.title || !data.categories || !data.content) {
        toast.error(
          "Provide all the required fields. Required fields are marked with *",
        );
        return;
      }

      if (data.image) {
        setImage(data.image);
        formData.append("image", image);
      }

      if (canUpload) {
        toast.error("You have image to upload.");
        return;
      }

      const updatedFormData = {
        ...data,
        categories,
        tags,
        image: data.image || null,
        content: sanitizeContent,
      };
      console.log(updatedFormData);
      const response = await fetch("api/post/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        toast.error("Something went wrong when creating post. Try again!");
        return;
      }

      toast.success("Post created successfully.");
      setImage(null);
      form.reset();
    } catch (error) {
      console.error("Error creating post: ", error);
      toast.error("Could not create post!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="text-center text-xl font-medium lg:text-3xl">
        Create Post
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePostSubmit)}
          className="ring-offset-3 mx-auto flex w-full max-w-4xl flex-col gap-5 rounded-md border p-4 shadow-2xl md:p-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-center">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm font-normal">
                    Title <b>*</b>
                  </Label>
                  <FormControl>
                    <Input
                      type="text"
                      aria-required="true"
                      placeholder="Title"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="categories"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="flex items-center gap-1.5 text-sm font-normal">
                    Categories <b>*</b>{" "}
                    <CustomTooltip text="Multiple values should be separated by comma." />
                  </Label>
                  <FormControl>
                    <Input
                      type="text"
                      aria-required="true"
                      placeholder="e.g. react, node.js"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-center">
            <FormField
              name="slug"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="flex items-center gap-1.5 text-sm font-normal">
                    Slug{" "}
                    <CustomTooltip text="URL friendly version of the title." />
                  </Label>
                  <FormControl>
                    <Input
                      type="text"
                      aria-required="true"
                      placeholder="e.g. what-is-json"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="excerpt"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="flex items-center gap-1.5 text-sm font-normal">
                    Excerpt{" "}
                    <CustomTooltip text="Short description of the post." />
                  </Label>
                  <FormControl>
                    <Input type="text" placeholder="Excerpt" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-center md:gap-6">
            <FormField
              name="tags"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="flex items-center gap-1.5 text-sm font-normal">
                    Tags{" "}
                    <CustomTooltip text="Multiple values should be separated by comma." />
                  </Label>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g. react, next.js"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormItem className="mt-auto w-full">
              <Button asChild className="w-full">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <Camera className="mr-2 size-[22px]" />
                  Add an Image
                </Label>
              </Button>
              <Input
                type="file"
                accept="image/*"
                id="image-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleImageChange(file);
                  }
                }}
              />
            </FormItem>
          </div>

          <div className="flex h-fit max-h-[600px] w-full justify-center gap-5 transition-all duration-300">
            {image ? (
              <div className="flex flex-col">
                <div className="mx-auto mt-6 h-full max-h-[400px] w-full max-w-[500px] rounded-xl border border-muted-foreground p-4">
                  <img
                    src={imageUploaded ? image : URL.createObjectURL(image)}
                    className="mx-auto max-h-[320px] max-w-[450px] rounded-xl"
                    alt="image"
                  />
                </div>
                {canUpload && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Button
                      type="button"
                      onClick={handleImageUpload}
                      className="mt-auto w-full max-w-[160px]"
                      disabled={!canUpload || loading}
                    >
                      {imageUploadProgress && imageUploadProgress < 100
                        ? `Uploading: ${imageUploadProgress + "%"}`
                        : "Upload Image"}
                    </Button>
                    <Button
                      onClick={handleRemoveImage}
                      type="button"
                      disabled={loading}
                      className="mx-auto mt-5 w-full max-w-[160px]"
                    >
                      Remove Image
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-14">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm font-normal">
                    Content <b>*</b>
                  </Label>
                  <FormControl>
                    <ReactQuill
                      ref={quillRef}
                      {...field}
                      theme="snow"
                      modules={quillModules}
                      formats={quillFormats}
                      className="h-72"
                      aria-required="true"
                      placeholder="Write your post..."
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="md mt-16 max-w-[160px] text-base sm:mt-8"
            >
              Post
            </Button>
          </div>
        </form>
      </Form>
    </Container>
  );
};

export default CreatePost;
