const Router = require("koa-router");
const {
  getRounds,
  getRound,
  getRoundProjects,
  getProject,
  getCategories,
  postComment,
  getComments,
  getContributors,
} = require("./controllers");
const router = new Router();

router.get("/rounds", getRounds);
router.get("/rounds/:id(\\d+)", getRound);
router.get("/rounds/:id(\\d+)/projects", getRoundProjects);
router.get("/rounds/:roundId(\\d+)/projects/:projectId(\\d+)", getProject);
router.get("/rounds/:roundId(\\d+)/projects/:projectId(\\d+)/contributors", getContributors);
router.get("/rounds/:id(\\d+)/categories", getCategories);
router.get(
  "/rounds/:roundId(\\d+)/projects/:projectId(\\d+)/comments",
  getComments
);
router.post(
  "/rounds/:roundId(\\d+)/projects/:projectId(\\d+)/comments",
  postComment
);

module.exports = router;
