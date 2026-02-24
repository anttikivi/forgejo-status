const https = require("https");

/**
 * Send a commit status to the Codeberg API.
 *
 * @param {object} options
 * @param {string} options.token  - Codeberg API token.
 * @param {string} options.repo   - Repository in "owner/name" format.
 * @param {string} options.sha    - Commit SHA.
 * @param {string} options.state  - One of: pending, success, failure, warning, error.
 * @param {string} options.context - Status context identifier.
 * @param {string} [options.targetUrl]   - URL to link from the status.
 * @param {string} [options.description] - Short description text.
 * @returns {Promise<void>}
 */
function sendStatus({
  token,
  repo,
  sha,
  state,
  context,
  targetUrl,
  description,
}) {
  const body = { state, context };
  if (targetUrl) body.target_url = targetUrl;
  if (description) body.description = description;

  const data = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "codeberg.org",
        path: `/api/v1/repos/${repo}/statuses/${sha}`,
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(
              new Error(`Codeberg API returned ${res.statusCode}: ${body}`),
            );
          }
        });
      },
    );

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

module.exports = { sendStatus };
