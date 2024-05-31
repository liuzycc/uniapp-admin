export type EnvTypes = "development" | "test" | "staging" | "production";
export const env = import.meta.env.VITE_ENV;
export const isProd = env === "prod" || false;
export const baseUrl =
  env === "prod" ? "http://82.157.175.138:3001" : "http://localhost:3000";
