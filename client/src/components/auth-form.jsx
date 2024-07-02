import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";

const AuthForm = ({ disabled, signUp, onSubmit, defaultValues, success }) => {
  const form = useForm({
    defaultValues: defaultValues,
  });

  const [passwordType, setPasswordType] = useState("password");

  useEffect(() => {
    if (success) {
      form.reset(defaultValues);
    }
  }, [defaultValues, success, form]);

  const handleSubmit = (data) => {
    // Trim whitespace and replace multiple spaces with a single space
    const trimmedData = {
      ...data,
      name: data?.name?.trim().replace(/\s+/g, " "),
      email: data?.email?.trim().replace(/\s+/g, " "),
      password: data?.password?.trim(),
    };

    try {
      onSubmit(trimmedData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-col items-center justify-center space-y-8 lg:flex">
      <div className="space-y-2">
        <h3 className="text-center text-xl font-bold lg:text-3xl">
          {signUp ? "Create an account" : "Sign in to Blogify"}
        </h3>
        <p className="text-center text-muted-foreground">
          {signUp
            ? "Welcome! Please fill in the details to get started."
            : "Welcome back! Please sign in to continue"}
        </p>
      </div>
      <div className="mx-auto w-full max-w-96">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {signUp && (
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={disabled}
                        required
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      disabled={disabled}
                      required
                      placeholder="johndoe@email.com"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <Input
                      disabled={disabled}
                      type={passwordType}
                      placeholder="Password"
                      required
                      autoComplete={
                        signUp ? "new-password" : "current-password"
                      }
                      {...field}
                    />
                  </FormControl>
                  {field.value.trim() !== "" && (
                    <Button
                      variant="outline"
                      type="button"
                      className={cn("absolute right-2 top-0 size-6")}
                      size="icon"
                      onClick={() =>
                        setPasswordType(
                          passwordType === "password" ? "text" : "password",
                        )
                      }
                    >
                      {passwordType === "password" ? (
                        <Eye className="size-4" />
                      ) : (
                        <EyeOff className="size-4" />
                      )}
                    </Button>
                  )}
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {disabled && <Loader2 className="mr-2 size-4 animate-spin" />}
              {signUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="mt-5 flex items-center justify-center gap-2">
          <p className="text-sm text-muted-foreground">
            {signUp ? "Already have an account?" : "Don't have an account?"}
          </p>
          <Link
            to={signUp ? "/sign-in" : "/sign-up"}
            className="active:[#7e8ca0] text-sm font-medium transition-colors duration-200 md:hover:text-[#7e8ca0]"
          >
            {signUp ? "Sign In" : "Sign Up"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
