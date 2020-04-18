# Run Drupal Check and report to PR using Reviewdog

## Example workflow file

```yaml
on: pull_request

name: Drupal Check
jobs:
  drupal-check:
    name: Check and report
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: Setup PHP, with composer and extensions
      uses: shivammathur/setup-php@master
      with:
        php-version: 7.3
        coverage: none
    - name: Install composer dependencies
      run: |-
        composer install -q --no-ansi --no-interaction --no-scripts --no-suggest --no-progress --prefer-dist
    - name: Deprecations check and report
      uses: reload/drupal-check-reviewdog-action@master
      with:
        check: deprecations
        paths: |-
          web/modules
          web/themes
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    - name: Anlysis check and report
      uses: reload/drupal-check-reviewdog-action@master
      with:
        check: analysis
        paths: |-
          web/modules/custom
          web/themes/custom
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Parameters

You can use these parameters.

### check

Which check to run.

Either `analysis` or `deprecations`.

Required.

### paths

Which paths to check. A multi-line list of paths.

Typically used like:

```yaml
  with:
    paths: |-
      web/modules
      web/themes
```

### report_name

The name of the report reviewdog submits.

Optional. Will default to `Analysis` or `Deprecations`.

### reporter

The reporter reviewdog should use.

Optional. Defaults to `github-pr-check`.

### workdir

The working directory to run drupal-check from.

Optional. Defaults to current directory (`.`).
