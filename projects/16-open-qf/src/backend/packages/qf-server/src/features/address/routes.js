const Router = require("koa-router");
const router = new Router();
const {
  getAddressInfo,
  getAddressTags,
} = require("./controllers");

router.get("/addresses/:address", getAddressInfo);
router.get("/addresses/:address/tags", getAddressTags);

module.exports = router;
