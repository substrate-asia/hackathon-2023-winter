import Api from "./Api";

export const nextApi = new Api(
  new URL(process.env.NEXT_PUBLIC_BACKEND_API_END_POINT).href,
);
