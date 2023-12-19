import { redirect } from "./redirect";

// redirect to 404 page
export function to404() {
  return redirect("/404");
}
