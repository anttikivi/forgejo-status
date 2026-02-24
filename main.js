import { appendFileSync } from "node:fs";

import { sendStatus } from "./status.js";

const token = process.env.INPUT_TOKEN;
const host = process.env.INPUT_HOST || "codeberg.org";
const repo = process.env.INPUT_REPO;
const sha = process.env.INPUT_SHA;
const context = process.env.INPUT_CONTEXT;
const targetUrl = process.env.INPUT_TARGET_URL || "";

if (!token || !repo || !sha || !context) {
  process.stderr.write(
    "Error: missing required input (token, repo, sha, or context)\n",
  );
  process.exitCode = 1;
} else {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  appendFileSync(process.env.GITHUB_STATE, `start_timestamp=${timestamp}\n`);

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
    process.stderr.write(`Warning: ${err.message}\n`);
  }
}
