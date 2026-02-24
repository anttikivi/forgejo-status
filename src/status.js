import * as core from "@actions/core";

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

  if (targetUrl) {
    body.target_url = targetUrl;
  }

  if (description) {
    body.description = description;
  }

  const url = `https://${host}/api/v1/repos/${repo}/statuses/${sha}`;

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
