import { cn } from "../lib/utils";

export const Container = ({ children, className }) => {
  return (
    <section className={cn("w-full py-16", className)}>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 md:gap-12 md:px-8">
        {children}
      </div>
    </section>
  );
};
