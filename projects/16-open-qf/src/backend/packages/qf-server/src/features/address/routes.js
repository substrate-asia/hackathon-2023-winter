const Router = require("koa-router");
const router = new Router();
const {
  getAddressInfo,
  getAddressTags,
  getAddressContributions,
} = require("./controllers");
const { getAddressProjects } = require("./controllers/getProjects");

router.get("/addresses/:address", getAddressInfo);
router.get("/addresses/:address/tags", getAddressTags);
router.get("/addresses/:address/contributions", getAddressContributions);
router.get("/addresses/:address/projects", getAddressProjects)

module.exports = router;
