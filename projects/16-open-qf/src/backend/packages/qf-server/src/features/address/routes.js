const Router = require("koa-router");
const router = new Router();
const {
  getAddressInfo,
} = require("./controllers");

router.get("/addresses/:address", getAddressInfo);

module.exports = router;
