const { handleSubmitted } = require("./submitted");
const { handleReferendaVoteFinished } = require("./voteFinished");

async function handleReferendaEvent(event, indexer) {
  const { section, method } = event;
  if (section !== "referenda") {
    return false;
  }

  if ("Submitted" === method) {
    await handleSubmitted(event, indexer);
  } else if (["Confirmed", "Rejected", "TimedOut", "Cancelled", "Killed"].includes(method)) {
    await handleReferendaVoteFinished(event, indexer);
  }
}

module.exports = {
  handleReferendaEvent,
}
