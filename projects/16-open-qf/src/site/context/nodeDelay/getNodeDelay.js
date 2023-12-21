import getApi from "@osn/common/es/services/chain/api";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TIMEOUT = 10000;

const fetchApiTime = async (api) => {
  const startTime = Date.now();
  try {
    await api.rpc.system.chain();
  } catch (e) {
    return "error";
  }

  const endTime = Date.now();
  return endTime - startTime;
};

const timeout = async (ms) => {
  await sleep(ms);
  return "timeout";
};

const testNet = async (api) => {
  return await Promise.race([fetchApiTime(api), timeout(TIMEOUT)]);
};

export const getNodeDelay = async (chain, url) => {
  try {
    const api = await getApi(chain, url);
    return await testNet(api);
  } catch (e) {
    console.error("we have a error to test network", e);
    return "timeout";
  }
};
