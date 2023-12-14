const {
  qf: { insertProjectComment },
} = require("@open-qf/mongo");
const { HttpError } = require("../../../utils/httpError");

async function postComment(ctx) {
  const comment = ctx.request.body;

  try {
    await insertProjectComment(comment);
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
