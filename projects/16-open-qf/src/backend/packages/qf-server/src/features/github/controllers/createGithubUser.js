const {
  qf: { upsertGithubUser },
} = require("@open-qf/mongo");
const { getGithubUserCol } = require("@open-qf/mongo/src/qf");
const { HttpError } = require("../../../utils/httpError");
const { checkSignature } = require("../../../utils/checkSignature");

async function fetchGithubUser(code) {
  const resp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    body: JSON.stringify({
      client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      code,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    throw new HttpError(500, "Failed to fetch access token");
  }

  const data = await resp.json();

  const { access_token, token_type } = data;

  if (token_type !== "bearer") {
    throw new HttpError(500, "Invalid token type");
  }

  const userResp = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${access_token}`,
    },
  });

  if (!userResp.ok) {
    throw new HttpError(500, "Failed to fetch user info");
  }

  return await userResp.json();
}

async function createGithubUser(ctx) {
  const { address, signature, code } = ctx.request.body;

  const col = await getGithubUserCol();
  const dbUser = await col.findOne({ address });
  if (!dbUser) {
    throw new HttpError(404, "User not found");
  }
  const { challenge, expiresAt } = dbUser;
  if (expiresAt < Date.now()) {
    throw new HttpError(401, "Challenge expired");
  }

  await checkSignature(challenge, signature, address);

  const user = await fetchGithubUser(code);
  await upsertGithubUser({ address, signature, user });

  ctx.body = {
    success: true,
  };
}

module.exports = {
  createGithubUser,
};
