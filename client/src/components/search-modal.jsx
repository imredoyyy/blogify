import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMedia } from "react-use";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

export const SearchModal = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMedia("(max-width: 1024px)");
  const form = useForm({
    defaultValues: {
      searchTerm: "",
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchQuery");

    if (searchTerm) {
      form.setValue("searchTerm", searchTerm);
    }
  }, [location.search, form]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // If pressed keys are ctrl or cmd + k, open modal
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();

        setOpen((prevOpen) => !prevOpen);
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearch = (data) => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchQuery", data.searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isMobile ? (
          <Button variant="outline" size="icon">
            <Search className="size-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="relative justify-between text-sm shadow-inner lg:w-[210px]"
          >
            <span className="mr-8">Search...</span>
            {/* <Search className="size-5" /> */}
            <kbd className="pointer-events-none absolute right-[0.3rem] top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
              ctrl+k
            </kbd>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Article</DialogTitle>
          <DialogDescription>
            Enter your search term and hit enter to search.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSearch)}
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <FormField
              control={form.control}
              name="searchTerm"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <Label htmlFor="search" className="sr-only">
                    Search
                  </Label>
                  <FormControl>
                    <Input id="search" placeholder="Search" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="h-10 text-sm">
              Search
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
