# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [unreleased]

### Changed

- Change the name of the action in `action.yml` to "Forgejo Status".
- Shorten the description of the action in `action.yml` to fit within GitHub
  Marketplace's limits.

### Fixed

- Fix the formatting of the link to v0.1.0 in the changelog.

## [0.1.0] - 2026-02-24

- Initial release of `anttikivi/forgejo-status` action for reporting commit
  status from GitHub Actions into Forgejo as a commit status.

### Added

- Send the `pending` status to Forgejo when the workflow is first run.
- Send the final status (`success`, `failure`, `warning`) of the job as a
  post-job step to Forgejo.
- Support configuring the Forgejo hostname, repository, commit SHA, context, and
  target URL with defaults derived from the current commit.

[unreleased]: https://codeberg.org/anttikivi/forgejo-status/compare/v0.1.0...HEAD
[0.1.0]: https://codeberg.org/anttikivi/forgejo-status/releases/tag/v0.1.0
