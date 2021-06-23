# Deprecated

This action is locked to `drupal-check` version 1.0.14.

The reason is the action uses the `phar` file distribution of `drupal-check` and 1.0.14 is the last version supporting, usable `phar` files.

Instead, I suggest installing `phpstan` and `drupal-check` as part of your project (`composer require --dev mglaman/phpstan-drupal phpstan/extension-installer phpstan/phpstan-deprecation-rules`) and calling `phpstan` directly in an action:

```yaml
on: pull_request

name: PHPStan
jobs:
  phpstan:
    name: analyse
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup PHP, with composer and extensions
        uses: shivammathur/setup-php@v2
        with:
          php-version: 7.4
          coverage: none
          tools: composer:v2
      - name: Validate composer.json
        run: |
          composer validate --no-check-all --no-check-publish
      - name: Install composer dependencies
        run: |
          composer install --no-interaction --no-progress
          # Add vendor/bin to PATH for subsequent steps, see https://docs.github.com/en/actions/reference/workflow-commands-for-github-actions#adding-a-system-path
          composer config bin-dir --absolute >> "${GITHUB_PATH}"
      - name: PHPStan analyse
        run: |
          phpstan
```

and combine it with a `phpstan.neon` in the root, e.g.:

```neon
parameters:
  level: 1
  paths:
   - web/modules/custom
   - web/themes/custom
```

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
        composer install --no-interaction --no-progress
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
