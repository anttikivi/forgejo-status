const fs = require("fs");
const { sendStatus } = require("./status");

const token = process.env.INPUT_TOKEN;
const repo = process.env.INPUT_REPO;
const sha = process.env.INPUT_SHA;
const context = process.env.INPUT_CONTEXT;
const targetUrl = process.env.INPUT_TARGET_URL || "";

const timestamp = Math.floor(Date.now() / 1000).toString();
fs.appendFileSync(process.env.GITHUB_STATE, `start_timestamp=${timestamp}\n`);

sendStatus({
  token,
  repo,
  sha,
  state: "pending",
  context,
  targetUrl,
  description: "Has started running",
}).catch((err) => {
  process.stderr.write(`Warning: ${err.message}\n`);
});
