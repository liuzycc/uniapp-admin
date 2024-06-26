export type EnvTypes = "development" | "test" | "staging" | "production";
export const env = import.meta.env.VITE_ENV;
export const isProd = env === "prod" || false;
export const baseUrl =
  env === "prod" ? "https://service.longcheng.live" : "http://localhost:3000";
