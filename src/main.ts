import * as core from "@actions/core";
import * as github from "@actions/github";

const START_TIMESTAMP = "start_timestamp";

type StatusState = "pending" | "success" | "failure" | "warning";

type Inputs = {
  token: string;
  host: string;
  repository: string;
  sha: string;
  context: string;
  targetUrl: string;
};

type SendStatusOptions = {
  token: string;
  host: string;
  repository: string;
  sha: string;
  state: StatusState;
  context: string;
  targetUrl?: string;
  description?: string;
};

function getInputs(): Inputs {
  const repository =
    core.getInput("repository") ||
    `${github.context.repo.owner}/${github.context.repo.repo}` ||
    "";
  const targetUrl =
    core.getInput("target-url") ||
    `${github.context.serverUrl}/${repository}/actions/runs/${github.context.runId}`;

  return {
    token: core.getInput("token", { required: true }),
    host: core.getInput("host") || "codeberg.org",
    repository,
    sha: core.getInput("sha") || github.context.sha,
    context:
      core.getInput("context") ||
      `${github.context.workflow} / ${github.context.job}`,
    targetUrl,
  };
}

export async function run(): Promise<void> {
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
    core.setFailed(`Failed to send pending status: ${String(err)}`);
  }
}

export async function runPost(): Promise<void> {
  const inputs = getInputs();

  const jobStatus = core.getInput("job-status") || "failure";
  const stateMap: Record<string, StatusState> = {
    success: "success",
    cancelled: "warning",
    failure: "failure",
  };
  const state = stateMap[jobStatus] || "failure";

  const startTimestamp = Number.parseInt(core.getState(START_TIMESTAMP), 10);
  let description = "";
  if (state === "warning") {
    description = "Has been cancelled";
  } else if (!Number.isNaN(startTimestamp)) {
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
    core.setFailed(`Failed to send final status: ${String(err)}`);
  }
}

async function sendStatus({
  token,
  host,
  repository,
  sha,
  state,
  context,
  targetUrl,
  description,
}: SendStatusOptions): Promise<void> {
  if (!repository) {
    throw new Error("Repository is required");
  }

  const body: Record<string, string> = { state, context };

  if (targetUrl) {
    body.target_url = targetUrl;
  }

  if (description) {
    body.description = description;
  }

  const url = `https://${host}/api/v1/repos/${repository}/statuses/${sha}`;

  core.info(`Pushing status to ${url}`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Forgejo API returned ${res.status}: ${text}`);
  }
}
