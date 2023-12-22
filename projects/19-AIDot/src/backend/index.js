import { AIDot } from "./dist/core.js";
import { config } from "./aidot.config.js";

const aiDot = new AIDot(config);

await aiDot.startAI();
