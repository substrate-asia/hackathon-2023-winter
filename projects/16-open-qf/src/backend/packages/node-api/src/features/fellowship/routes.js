const Router = require("koa-router");
const { getFellowshipMember } = require("./members.controller");

const router = new Router();
router.get("/fellowship/members/:address", getFellowshipMember);

module.exports = router;
