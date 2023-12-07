const Router = require("koa-router");
const { getRounds } = require("./controllers");
const router = new Router();

router.get("/rounds", getRounds);

module.exports = router;
