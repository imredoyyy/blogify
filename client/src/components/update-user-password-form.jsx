import { useState } from "react";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Label } from "./ui/label";

export const UpdateUserPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser?._id;

  const form = useForm({
    defaultValues: {
      email: currentUser?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data) => {
    setLoading(true);

    try {
      // Check if all fields are filled
      if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
        toast.error("All fields are required!");
        return;
      }

      // Check password length
      if (data.newPassword.length < 8 || data.confirmPassword.length < 8) {
        toast.error("New password must be at least 8 characters long");
        return;
      }

      // Check if new password and confirm password match
      if (data.newPassword !== data.confirmPassword) {
        toast.error("New password & confirm password do not match!");
        return;
      }

      const response = await fetch(`/api/user/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Something went wrong. Please try again.");
        return;
      }

      toast.success("Password updated successfully");
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-8">
      <h3 className="text-lg font-semibold">Update Password</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid w-full grid-cols-1 items-center justify-start gap-5 sm:grid-cols-2 lg:w-2/3 lg:gap-6"
        >
          {/* For screen readers */}
          <FormField
            name="email"
            type="email"
            placeholder="Email"
            control={form.control}
            render={({ field }) => (
              <FormItem style={{ display: "none" }}>
                <FormControl>
                  <Input
                    type="email"
                    disabled={loading}
                    autoComplete="username"
                    className="sr-only"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="currentPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label
                  htmlFor="current-password"
                  className="text-muted-foreground"
                >
                  Current Password
                </Label>
                <div className="relative">
                  <FormControl>
                    <Input
                      disabled={loading}
                      type={passwordType}
                      aria-required="true"
                      id="current-password"
                      placeholder="Current Password"
                      {...field}
                    />
                  </FormControl>
                  {field.value.trim() !== "" && (
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(
                        "absolute right-2 top-1/2 size-5 -translate-y-1/2",
                      )}
                      size="icon"
                      onClick={() =>
                        setPasswordType(
                          passwordType === "password" ? "text" : "password",
                        )
                      }
                    >
                      {passwordType === "password" ? (
                        <Eye className="size-3.5" />
                      ) : (
                        <EyeOff className="size-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="new-password" className="text-muted-foreground">
                  New Password
                </Label>
                <div className="relative">
                  <FormControl>
                    <Input
                      disabled={loading}
                      aria-required="true"
                      id="new-password"
                      type={passwordType}
                      autoComplete="new-password"
                      placeholder="New Password"
                      {...field}
                    />
                  </FormControl>
                  {field.value.trim() !== "" && (
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(
                        "absolute right-2 top-1/2 size-5 -translate-y-1/2",
                      )}
                      size="icon"
                      onClick={() =>
                        setPasswordType(
                          passwordType === "password" ? "text" : "password",
                        )
                      }
                    >
                      {passwordType === "password" ? (
                        <Eye className="size-3.5" />
                      ) : (
                        <EyeOff className="size-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label
                  htmlFor="confirm-password"
                  className="text-muted-foreground"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <FormControl>
                    <Input
                      disabled={loading}
                      aria-required="true"
                      id="confirm-password"
                      type={passwordType}
                      autoComplete="new-password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  {field.value.trim() !== "" && (
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(
                        "absolute right-2 top-1/2 size-5 -translate-y-1/2",
                      )}
                      size="icon"
                      onClick={() =>
                        setPasswordType(
                          passwordType === "password" ? "text" : "password",
                        )
                      }
                    >
                      {passwordType === "password" ? (
                        <Eye className="size-3.5" />
                      ) : (
                        <EyeOff className="size-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading || !form.formState.isDirty}
            className="mt-auto"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Password
          </Button>
        </form>
      </Form>
    </div>
  );
};
