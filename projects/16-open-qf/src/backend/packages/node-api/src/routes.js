const Router = require("koa-router");
const { chains } = require("./consts");

const router = new Router();
const chainFeatureRouters = [
  require("./features/fellowship/routes"),
];

module.exports = (app) => {
  for (const r of chainFeatureRouters) {
    router.use(
      `/:chain(${ Object.keys(chains).join("|") })`,
      r.routes(),
      r.allowedMethods({ throw: true }),
    );
  }

  app.use(router.routes());
}
