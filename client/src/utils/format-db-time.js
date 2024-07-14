export const formatDbTime = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    day: "numeric",
    month: "short",
  });
};
