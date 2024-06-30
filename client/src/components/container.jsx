export const Container = ({ children }) => {
  return (
    <section className="w-full py-16">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-4 px-4 md:gap-12 md:px-8">
        {children}
      </div>
    </section>
  );
};
