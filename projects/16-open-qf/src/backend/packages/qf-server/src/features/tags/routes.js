const Router = require("koa-router");
const { tags } = require("../../consts");
const router = new Router();

function getTags(ctx) {
  ctx.body = tags;
}

router.get("/tags", getTags);

module.exports = router;
