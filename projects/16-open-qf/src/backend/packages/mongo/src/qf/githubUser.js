const { getGithubUserCol } = require("./db");

async function upsertGithubUser(data = {}) {
  const { address } = data;
  const col = await getGithubUserCol();
  await col.updateOne({ address }, { $set: data }, { upsert: true });
}

async function checkGithubConnected(address) {
  const col = await getGithubUserCol();
  const githubUser = await col.findOne({ address });
  return !!githubUser?.user;
}

module.exports = {
  upsertGithubUser,
  checkGithubConnected,
};
