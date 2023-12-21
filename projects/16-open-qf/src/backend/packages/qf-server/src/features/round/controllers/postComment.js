const {
  qf: { insertProjectComment },
} = require("@open-qf/mongo");
const { HttpError } = require("../../../utils/httpError");
const { checkSignature } = require("../../../utils/checkSignature");

async function postComment(ctx) {
  const comment = ctx.request.body;

  const { signature, ...data } = comment;
  const signedData = JSON.stringify(data);
  await checkSignature(signedData, signature, comment.author);

  try {
    await insertProjectComment({ ...comment, signedData });
  } catch (e) {
    throw new HttpError(500, e.message);
  }

  ctx.body = {
    success: true,
  };
}

module.exports = {
  postComment,
};
