const Router = require("koa-router");
const { getRounds, getRound } = require("./controllers");
const router = new Router();

router.get("/rounds", getRounds);
router.get("/rounds/:id(\\d+)", getRound);

module.exports = router;
