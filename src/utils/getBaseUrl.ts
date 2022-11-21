export const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    // browser should use relative url
    return "";
  }
  // not tested
  // if (import.meta.env.VERCEL_URL) {
  //   // SSR should use vercel url
  //   return `https://${import.meta.env.VERCEL_URL}`;
  // }
  // dev SSR should use localhost
  return `http://127.0.0.1:${process.env.PORT ?? 5173}`;
};
