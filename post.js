import { sendStatus } from "./status.js";

const token = process.env.INPUT_TOKEN;
const host = process.env.INPUT_HOST || "codeberg.org";
const repo = process.env.INPUT_REPO;
const sha = process.env.INPUT_SHA;
const context = process.env.INPUT_CONTEXT;
const targetUrl = process.env.INPUT_TARGET_URL || "";

const jobStatus = process.env.INPUT_JOB_STATUS || "failure";
const stateMap = {
  success: "success",
  cancelled: "warning",
  failure: "failure",
};
const state = stateMap[jobStatus] || "failure";

const startTimestamp = parseInt(process.env.STATE_start_timestamp, 10);
let description = "";
if (state === "warning") {
  description = "Has been cancelled";
} else if (!isNaN(startTimestamp)) {
  const elapsed = Math.floor(Date.now() / 1000) - startTimestamp;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  description =
    state === "success"
      ? `Successful in ${minutes}m${seconds}s`
      : `Failing after ${minutes}m${seconds}s`;
}

try {
  await sendStatus({
    token,
    host,
    repo,
    sha,
    state,
    context,
    targetUrl,
    description,
  });
} catch (err) {
  process.stderr.write(`Warning: ${err.message}\n`);
}
