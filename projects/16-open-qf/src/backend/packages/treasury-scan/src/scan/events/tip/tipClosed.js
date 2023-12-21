const {
  treasury: {
    findUnFinishedTip, updateTip,
    insertTipFinder,
    insertTipBeneficiary,
  },
} = require("@open-qf/mongo");
const {
  utils: { gt },
} = require("@open-qf/common");

async function handleTipClosed(event, indexer) {
  const hash = event.data[0].toString();
  const beneficiary = event.data[1].toString();
  const payout = event.data[2].toString();

  const tip = await findUnFinishedTip(hash);
  await updateTip(hash, { beneficiary, payout, isFinal: true, state: "Closed" });

  if (gt(payout, 0)) {
    await insertTipBeneficiary(beneficiary, indexer);

    const { finder } = tip;
    await insertTipFinder(finder, indexer);
  }
}

module.exports = {
  handleTipClosed,
}
