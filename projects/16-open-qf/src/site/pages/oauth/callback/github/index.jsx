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

  const resp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID,
      client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      redirect_uri: process.env.NEXT_PUBLIC_GITHUB_OAUTH_REDIRECT_URI,
      code,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (resp.status === 404) {
    return to404();
  }

  if (!resp.ok) {
    throw new Error("Failed to fetch access token");
  }

  const data = await resp.json();

  const { access_token, token_type } = data;

  if (token_type !== "bearer") {
    throw new Error("Invalid token type");
  }

  const userResp = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${access_token}`,
    },
  });

  if (userResp.status === 404) {
    return to404();
  }

  if (!userResp.ok) {
    throw new Error("Failed to fetch user");
  }

  const user = await userResp.json();

  const [address, signature] = state.split(",");
  const { result } = await ssrNextApi.post("/github/users", {
    address,
    signature,
    user,
  });

  if (!result) {
    throw new Error("Failed to save github user info");
  }

  return redirect(`/users/${address}`);
};
