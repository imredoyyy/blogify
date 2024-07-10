export const formatDbTime = (time) => {
  return new Date(time).toLocaleDateString("en-US", {
    year: "numeric",
    day: "numeric",
    month: "short",
  });
};
