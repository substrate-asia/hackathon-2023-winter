const {
  qf: { upsertGithubUser },
} = require("@open-qf/mongo");

async function startConnectGithubUser(ctx) {
  const { address } = ctx.request.body;
  const challenge = Math.random().toString(36).substring(2, 9);
  const expiresAt = Date.now() + 1000 * 60 * 10;
  await upsertGithubUser({ address, challenge, expiresAt });
  ctx.body = {
    address,
    challenge,
    expiresAt,
  };
}

module.exports = {
  startConnectGithubUser,
};
