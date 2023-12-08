require("dotenv").config();

const { round1 } = require("./round");
const { projects } = require("./projects");
const { qf: { insertRound, insertProject } } = require("@open-qf/mongo");

async function insertProjects() {
  let id = 1;
  for (const project of projects) {
    await insertProject({
      id,
      roundId: round1.id,
      ...project,
    });

    id++;
  }
}

;(async () => {
  await insertRound(round1);
  await insertProjects();

  process.exit(0);
})();
