import * as core from "@actions/core";

import { sendStatus } from "./status.js";

const token = core.getInput("token", { required: true });
const host = core.getInput("host") || "codeberg.org";
const repo = core.getInput("repo", { required: true });
const sha = core.getInput("sha", { required: true });
const context = core.getInput("context", { required: true });
const targetUrl = core.getInput("target_url");

const jobStatus = core.getInput("job_status") || "failure";
const stateMap = {
  success: "success",
  cancelled: "warning",
  failure: "failure",
};
const state = stateMap[jobStatus] || "failure";

const startTimestamp = parseInt(core.getState("start_timestamp"), 10);
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
  core.warning(`Failed to send final status: ${err.message}`);
}
