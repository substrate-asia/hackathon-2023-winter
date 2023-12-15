require("dotenv").config();

const { round1 } = require("./round");
const { projects } = require("./projects");
const { qf: { insertRound, insertProject } } = require("@open-qf/mongo");
const { saveMockContributors } = require("./address/contributors");

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
  await saveMockContributors();

  process.exit(0);
})();
