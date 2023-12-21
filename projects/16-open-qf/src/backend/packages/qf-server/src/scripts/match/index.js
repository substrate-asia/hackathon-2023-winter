require("dotenv").config();
const { calcMatched } = require("../../common/qf/calc");

calcMatched().then(() => {
  process.exit(0);
  console.log("Pool match calculated!")
});
