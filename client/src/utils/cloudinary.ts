export const getOptimizedImageUrl = (
  url: string,
  width: number,
): string => {
  if (!url) {
    return url;
  }

  return url.replace(
    "/image/upload/",
    `/image/upload/w_${width},q_auto,f_auto/`,
  );
};