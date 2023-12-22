const Router = require("koa-router");
const { createGithubUser } = require("./controllers/createGithubUser");
const {
  startConnectGithubUser,
} = require("./controllers/startConnectGithubUser");
const router = new Router();

router.post("/github/users", createGithubUser);
router.post("/github/users/connect", startConnectGithubUser);

module.exports = router;
