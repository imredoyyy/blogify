import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useIsAuthenticated } from "../utils/is-authenticated";
import { Container } from "../components/container";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Form, FormControl, FormField, FormItem } from "../components/ui/form";
import { toast } from "sonner"; // Replace with your toast library
import { Button } from "../components/ui/button";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [image, setImage] = useState(null);
  const [canUpload, setCanUpload] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const navigate = useNavigate();

  const quillRef = useRef(null);

  const isAuthenticated = useIsAuthenticated();

  const form = useForm({
    defaultValues: {
      title: "",
      category: "",
      slug: "",
      content: "",
      excerpt: "",
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

  const handlePostSubmit = async (data) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title.trim());
      formData.append("category", data.category.trim());
      formData.append("slug", data.slug.trim());
      formData.append("excerpt", data.excerpt.trim());
      formData.append("content", data.content);

      if (!data.title || !data.category || !data.content) {
        toast.error(
          "Provide all the required fields. Required fields are marked with *",
        );
        return;
      }

      if (data.image) {
        setImage(await data.image);
        formData.append("image", image);
      }

      const updatedFormData = {
        ...data,
        image: data.image || null,
      };

      const response = await fetch("api/post/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      console.log(updatedFormData);
      if (!response.ok) {
        toast.error("Something went wrong when creating post. Try again!");
        return;
      }

      toast.success("Post created successfully.");
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
              name="category"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm font-normal">
                    Category <b>*</b>
                  </Label>
                  <FormControl>
                    <Input
                      type="text"
                      aria-required="true"
                      placeholder="e.g. javascript"
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
                  <Label className="text-sm font-normal">Slug</Label>
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
                  <Label className="text-sm font-normal">Excerpt</Label>
                  <FormControl>
                    <Input type="text" placeholder="Excerpt" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-center md:gap-6">
            <FormItem>
              <Button asChild className="w-full">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <Camera className="mr-2 size-[22px]" />
                  Upload Image
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
            <Button
              type="button"
              onClick={handleImageUpload}
              className="mt-auto"
              disabled={!canUpload || loading}
            >
              {imageUploadProgress && imageUploadProgress < 100
                ? `Uploading: ${imageUploadProgress + "%"}`
                : "Upload Image"}
            </Button>
          </div>

          <div className="flex h-fit max-h-[600px] w-full justify-center gap-5 transition-all duration-300">
            {image ? (
              <div className="mx-auto mt-6 h-full max-h-[400px] w-full max-w-[450px] rounded-xl border border-muted-foreground">
                <img
                  src={imageUploaded ? image : URL.createObjectURL(image)}
                  className="mx-auto max-h-[320px] max-w-[450px] rounded-xl"
                  alt="image"
                />
              </div>
            ) : null}
          </div>
          <divc className="flex flex-col gap-14">
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
                      modules={{
                        toolbar: {
                          container: [
                            ["bold", "italic", "underline", "strike"],
                            [{ header: [1, 2, 3, 4, 5, 6, false] }],
                            ["blockquote", "code-block"],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              { list: "check" },
                            ],
                            [{ script: "sub" }, { script: "super" }],
                            [{ indent: "-1" }, { indent: "+1" }],
                            [{ direction: "rtl" }],
                            [{ size: ["small", false, "large", "huge"] }],
                            [{ font: [] }],
                            ["clean"],
                            ["link"],
                            [{ color: [] }, { background: [] }],
                            [{ align: [] }],
                            ["image"],
                          ],
                        },
                      }}
                      formats={[
                        "header",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "code-block",
                        "list",
                        "bullet",
                        "check",
                        "script",
                        "indent",
                        "direction",
                        "size",
                        "font",
                        "link",
                        "color",
                        "background",
                        "align",
                        "image",
                      ]}
                      className="h-72"
                      aria-required="true"
                      placeholder="Write your post..."
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-8 max-w-[160px] text-base">
              Post
            </Button>
          </divc>
        </form>
      </Form>
    </Container>
  );
};

export default CreatePost;
