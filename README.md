# forgejo-status

This actions reports job status from GitHub Actions as a commit status on a
[Forgejo](https://forgejo.org/) instance (e.g.
[Codeberg](https://codeberg.org/)). It handles the full reporting during a
workflow, sending a `pending` status when the workflow starts and automatically
sending the final status of the workflow run (`success`, `failure`, or
`warning`).

## Usage

This actions should be run near the beginning of your job. It sends the
`pending` status immediately and sends the final status as a post-job step.

See [action.yml](action.yml). You can also see the default configuration and
usage example below:

<!-- prettier-ignore-start -->

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: anttikivi/forgejo-status@v0.1.2
        with:
          # Required. Your Forgejo access token. Should have write access to
          # the destination repository.
          token: ""
          # The Forgejo instance hostname.
          host: codeberg.org
          # The repository on Forgejo to target. Should be `owner/repo`.
          repository: ${{ github.repository }}
          # The SHA of the commit to set the status to.
          sha: ${{ github.sha }}
          # An identifier for the job that has its status pushed it should be
          # shown on Forgejo.
          context: ${{ github.workflow }} / ${{ github.job }}
          # The URL to link to in the job status on Forgejo as the "Details"
          # link.
          target-url: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
```

<!-- prettier-ignore-end -->

A really basic setup could look like this:

<!-- prettier-ignore-start -->

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: anttikivi/forgejo-status@v0.1.2
        with:
          token: ${{ secrets.CODEBERG_TOKEN }}
```

<!-- prettier-ignore-end -->

The only input that is required is `token`. All other inputs have set defaults
or defaults derived from the action’s context.

### Matrix jobs

For matrix jobs, you should consider setting `context` explicitly so that each
matrix combination gets its own status on the commit:

<!-- prettier-ignore-start -->

```yaml
jobs:
  test:
    runs-on: ${{ matrix.runner }}
    strategy:
      matrix:
        os: [linux, macos]
        arch: [amd64, arm64]
        runner: [ubuntu-latest, macos-latest]
    steps:
      - uses: anttikivi/forgejo-status@v0.1.2
        with:
          token: ${{ secrets.CODEBERG_TOKEN }}
          context: CI / test (${{ matrix.os }}, ${{ matrix.arch }}, ${{ matrix.runner }})
```

<!-- prettier-ignore-end -->

## License

Copyright (c) 2026 Antti Kivi

This action is licensed under the Apache License, Version 2.0. See
[LICENSE](LICENSE) for more information.
