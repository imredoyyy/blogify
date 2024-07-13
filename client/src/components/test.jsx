import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";

const Test = () => {
  const [categories, setCategories] = useState([]);
  const form = useForm({
    defaultValues: {
      category: "",
    },
  });

  const handleSubmit = (data) => {
    const formData = new FormData();

    const categoriess = data.category
      .trim()
      .split(",")
      .map((category) => category.trim());

    // Append each category to formData
    categoriess.forEach((category) => {
      formData.append("category[]", category);
    });

    setCategories(categoriess);
    console.log(categories);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                    placeholder="Title"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <button type="submit">Submit</button>
        </form>
      </Form>
      {categories.map((c) => (
        <p key={c}>{c}</p>
      ))}
    </>
  );
};

export default Test;
