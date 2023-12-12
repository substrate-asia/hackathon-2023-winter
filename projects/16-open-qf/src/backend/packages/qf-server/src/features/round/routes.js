const Router = require("koa-router");
const {
  getRounds,
  getRound,
  getRoundProjects,
  getProject,
  getCategories,
} = require("./controllers");
const router = new Router();

router.get("/rounds", getRounds);
router.get("/rounds/:id(\\d+)", getRound);
router.get("/rounds/:id(\\d+)/projects", getRoundProjects);
router.get("/rounds/:roundId(\\d+)/projects/:projectId(\\d+)", getProject);
router.get("/rounds/:id(\\d+)/categories", getCategories);

module.exports = router;
