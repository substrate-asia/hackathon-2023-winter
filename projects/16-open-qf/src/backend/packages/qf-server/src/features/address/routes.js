const Router = require("koa-router");
const router = new Router();
const {
  getAddressInfo,
  getAddressTags,
  getAddressContributions,
} = require("./controllers");

router.get("/addresses/:address", getAddressInfo);
router.get("/addresses/:address/tags", getAddressTags);
router.get("/addresses/:address/contributions", getAddressContributions);

module.exports = router;
