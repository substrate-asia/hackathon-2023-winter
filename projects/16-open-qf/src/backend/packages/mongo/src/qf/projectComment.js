const { getProjectCol, getProjectCommentCol } = require("./db");

async function insertProjectComment(comment = {}) {
  const { roundId, projectId } = comment || {};
  const projectCol = await getProjectCol();
  const project = await projectCol.findOne({ roundId, id: projectId });
  if (!project) {
    throw new Error(
      `Round ${roundId} project #${projectId} is not exist in DB`
    );
  }

  const commentCol = await getProjectCommentCol();
  await commentCol.insertOne(comment);
}

module.exports = {
  insertProjectComment,
};
