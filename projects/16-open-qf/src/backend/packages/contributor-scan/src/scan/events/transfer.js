const { qf: { getProjectCol, getContributorCol } } = require("@open-qf/mongo");

async function handleTransferEvent(event, indexer) {
  const { section, method } = event;
  if ("balances" !== section || "Transfer" !== method) {
    return false;
  }

  const to = event.data[1].toString();
  const projectCol = await getProjectCol();
  const projects = await projectCol.find({}).toArray();
  const project = projects.find(p => p.donationAddress === to);
  if (!project) {
    return;
  }

  const contributorCol = await getContributorCol();
  await contributorCol.insertOne({
    address: event.data[0].toString(),
    roundId: project.roundId,
    projectId: project.id,
    balance: event.data[2].toString(),
    indexer,
  });
}

module.exports = {
  handleTransferEvent,
}
