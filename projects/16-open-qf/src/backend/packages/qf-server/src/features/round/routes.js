const Router = require("koa-router");
const { getRounds, getRound, getRoundProjects } = require("./controllers");
const router = new Router();

router.get("/rounds", getRounds);
router.get("/rounds/:id(\\d+)", getRound);
router.get("/rounds/:id(\\d+)/projects", getRoundProjects);

module.exports = router;
