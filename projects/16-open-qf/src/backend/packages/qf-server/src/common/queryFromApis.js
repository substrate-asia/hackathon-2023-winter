const noop = require("lodash.noop");

async function queryFromApis(apis = [], queryFn = noop, args = []) {
  const promises = [];
  for (const api of apis) {
    promises.push(queryFn(api, ...args));
  }
  return Promise.any(promises);
}

module.exports = {
  queryFromApis,
}
