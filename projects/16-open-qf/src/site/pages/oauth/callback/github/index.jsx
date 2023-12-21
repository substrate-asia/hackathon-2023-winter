import { ssrNextApi } from "@/services";
import { to404 } from "@/utils/ssr/404";
import { redirect } from "@/utils/ssr/redirect";

export default function GitHubCallback() {
  return <div>Connecting to github account...</div>;
}

export const getServerSideProps = async (context) => {
  const { code, state } = context.query;

  if (!code || !state) {
    return to404();
  }

  const [address, signature] = state.split(",");
  const { result } = await ssrNextApi.post("/github/users", {
    address,
    signature,
    code,
  });

  if (!result) {
    return to404();
  }

  return redirect(`/users/${address}`);
};
