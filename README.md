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
      run: |
        composer install -q --no-ansi --no-interaction --no-scripts --no-suggest --no-progress --prefer-dist
    - name: Check and report
      uses: reload/drupal-check-reviewdog-action@master
      with:
        paths: |-
          web/modules/custom
          web/themes/custom
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```
