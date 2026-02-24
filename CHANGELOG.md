# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [unreleased] - 2026-02-24

- Initial release of `anttikivi/forgejo-status` action for reporting commit
  status from GitHub Actions into Forgejo as a commit status.

### Added

- Send the `pending` status to Forgejo when the workflow is first run.
- Send the final status (`success`, `failure`, `warning`) of the job as a
  post-job step to Forgejo.
- Support configuring the Forgejo hostname, repository, commit SHA, context, and
  target URL with defaults derived from the current commit.
