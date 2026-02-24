/**
 * Send a commit status to the Forgejo API.
 *
 * @param {object} options
 * @param {string} options.token    - Forgejo API token.
 * @param {string} options.host     - Forgejo instance hostname (e.g. "codeberg.org").
 * @param {string} options.repo     - Repository in "owner/name" format.
 * @param {string} options.sha      - Commit SHA.
 * @param {string} options.state    - One of: pending, success, failure, warning, error.
 * @param {string} options.context  - Status context identifier.
 * @param {string} [options.targetUrl]   - URL to link from the status.
 * @param {string} [options.description] - Short description text.
 * @returns {Promise<void>}
 */
export async function sendStatus({
  token,
  host,
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

  const url = `https://${host}/api/v1/repos/${repo}/statuses/${sha}`;

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
