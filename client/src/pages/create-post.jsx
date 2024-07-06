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
import { toast } from "sonner";
import { Button } from "../components/ui/button";

const CreatePost = () => {
  const { currentUser } = useSelector((state) => state.user);

  const isAuthenticated = useIsAuthenticated();

  const form = useForm({
    defaultValues: {
      title: "",
      category: "",
      content: "",
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
      return false;
    }

    // Check if the file size is less than 2MB
    if (file.size > maxFileSize) {
      toast.error("File must be less than 2MB!");
      return false;
    }

    return true;
  };

  return (
    <Container>
      <h1 className="text-center text-xl font-medium lg:text-3xl">
        Create Post
      </h1>

      <Form {...form}>
        <form className="ring-offset-3 mx-auto flex w-full max-w-4xl flex-col gap-5 rounded-md border p-4 shadow-2xl md:p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-center">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm font-normal">Title</Label>
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
                  <Label className="text-sm font-normal">Category</Label>
                  <FormControl>
                    <Input
                      type="text"
                      aria-required="true"
                      placeholder="e.g. JavaScript"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-center">
            {/* Upload file */}
            <FormField
              name="image"
              control={form.control}
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <Label className="text-sm font-normal">Upload Image</Label>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      id="image-upload"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (handleImageChange(file)) {
                          onChange(file);
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                {...field}
                modules={{
                  toolbar: [
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
                  ],
                }}
                formats={["header", "bold", "italic", "underline", "strike"]}
                className="h-72"
                aria-required="true"
                placeholder="Write your post..."
              />
            )}
          />
          <Button type="submit" className="mt-10 max-w-[160px] text-base">
            Post
          </Button>
        </form>
      </Form>
    </Container>
  );
};

export default CreatePost;
