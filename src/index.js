import * as core from "@actions/core";

import { sendStatus } from "./status.js";

const token = core.getInput("token", { required: true });
const host = core.getInput("host") || "codeberg.org";
const repo = core.getInput("repo", { required: true });
const sha = core.getInput("sha", { required: true });
const context = core.getInput("context", { required: true });
const targetUrl = core.getInput("target_url");

core.setSecret(token);

const timestamp = Math.floor(Date.now() / 1000).toString();
core.saveState("start_timestamp", timestamp);

try {
  await sendStatus({
    token,
    host,
    repo,
    sha,
    state: "pending",
    context,
    targetUrl,
    description: "Has started running",
  });
} catch (err) {
  core.warning(`Failed to send pending status: ${err.message}`);
}
