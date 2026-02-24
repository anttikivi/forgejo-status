# forgejo-status

A GitHub Action that reports job status as a commit status on a
[Forgejo](https://forgejo.org/) instance (e.g.
[Codeberg](https://codeberg.org/)). It sends a **pending** status when the step
runs and automatically sends the **final** status (`success`, `failure`, or
`warning`) as a post-job step.

## Usage

Add the step near the top of your job. The action handles the rest automatically
-- it posts a pending status immediately and updates it with the final result
after all other steps have completed.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: anttikivi/forgejo-status@v0.1.0
        with:
          token: ${{ secrets.CODEBERG_TOKEN }}
```

Only `token` is required. All other inputs have defaults derived from the GitHub
context.

### Matrix jobs

For matrix jobs, set `context` explicitly so each matrix combination gets its
own status on the commit:

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
      - uses: anttikivi/forgejo-status@v0.1.0
        with:
          token: ${{ secrets.CODEBERG_TOKEN }}
          context:
            "CI / test (${{ matrix.os }}, ${{ matrix.arch }}, ${{ matrix.runner
            }})"
```

### Self-hosted Forgejo

To use with a self-hosted Forgejo instance instead of Codeberg, set the `host`
input:

```yaml
- uses: anttikivi/forgejo-status@v1
  with:
    token: ${{ secrets.FORGEJO_TOKEN }}
    host: forgejo.example.com
```

## Inputs

| Input        | Required | Default                                      | Description                             |
| ------------ | -------- | -------------------------------------------- | --------------------------------------- |
| `token`      | Yes      |                                              | Forgejo API token                       |
| `host`       | No       | `codeberg.org`                               | Forgejo instance hostname               |
| `repository` | No       | `${{ github.repository }}`                   | Repository in `owner/name` format       |
| `sha`        | No       | `${{ github.sha }}`                          | Commit SHA to set the status on         |
| `context`    | No       | `${{ github.workflow }} / ${{ github.job }}` | Unique identifier for this status check |
| `target_url` | No       | Link to the workflow run                     | URL to link from the status             |

## How it works

The action runs in two phases:

1. **Main step** -- Sends a `pending` commit status to the Forgejo API and
   records the current timestamp.
2. **Post step** (runs `always()`) -- Maps the GitHub job outcome to a Forgejo
   status (`success`, `failure`, or `warning` for cancelled jobs), calculates
   elapsed time, and sends the final commit status with a description like
   "Successful in 2m34s".

## License

This action is licensed under the MIT License. See [LICENSE](LICENSE) for more
information.
