import * as core from "@actions/core";
import * as github from "@actions/github";
import { sendStatus } from "./status.js";

const START_TIMESTAMP = "start_timestamp";

function getInputs() {
  return {
    token: core.getInput("token", { required: true }),
    host: core.getInput("host") || "codeberg.org",
    repository:
      core.getInput("repository") ||
      `${github.context.repo.owner}/${github.context.repo.repo}`,
    sha: core.getInput("sha") || github.context.sha,
    context:
      core.getInput("context") ||
      `${github.context.workflow} / ${github.context.job}`,
    targetUrl:
      core.getInput("target_url") ||
      `${github.context.serverUrl}/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}`,
  };
}

export async function run() {
  const inputs = getInputs();

  core.setSecret(inputs.token);

  const timestamp = Math.floor(Date.now() / 1000).toString();
  core.saveState(START_TIMESTAMP, timestamp);

  try {
    await sendStatus({
      token: inputs.token,
      host: inputs.host,
      repository: inputs.repository,
      sha: inputs.sha,
      state: "pending",
      context: inputs.context,
      targetUrl: inputs.targetUrl,
      description: "Has started running",
    });
  } catch (err) {
    core.setFailed(`Failed to send pending status: ${err.message}`);
  }
}

export async function runPost() {
  const inputs = getInputs();

  const jobStatus = core.getInput("job_status") || "failure";
  const stateMap = {
    success: "success",
    cancelled: "warning",
    failure: "failure",
  };
  const state = stateMap[jobStatus] || "failure";

  const startTimestamp = parseInt(core.getState(START_TIMESTAMP), 10);
  let description = "";
  if (state === "warning") {
    description = "Has been cancelled";
  } else if (!isNaN(startTimestamp)) {
    const elapsed = Math.floor(Date.now() / 1000) - startTimestamp;
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = minutes < 1 ? `${seconds}s` : `${minutes}m${seconds}s`;
    description =
      state === "success"
        ? `Successful in ${timeString}`
        : `Failing after ${timeString}`;
  }

  try {
    await sendStatus({
      token: inputs.token,
      host: inputs.host,
      repository: inputs.repository,
      sha: inputs.sha,
      state,
      context: inputs.context,
      targetUrl: inputs.targetUrl,
      description,
    });
  } catch (err) {
    core.setFailed(`Failed to send final status: ${err.message}`);
  }
}
