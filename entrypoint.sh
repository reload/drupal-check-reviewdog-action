#!/usr/bin/env bash

set -veu

cd "$INPUT_WORKDIR"

step_log () {
    echo -e "\033[1m$*...\033[0m"
}

export REVIEWDOG_GITHUB_API_TOKEN=${GITHUB_TOKEN}

readarray -t PATHS <<<"$INPUT_PATHS"

step_log "Install latest drupal-check..."
[[ ! -x /usr/bin/drupal-check ]] && curl --fail --silent --output /usr/bin/drupal-check -O -L https://github.com/mglaman/drupal-check/releases/latest/download/drupal-check.phar && chmod +x /usr/bin/drupal-check

step_log "Check: ${INPUT_CHECK}..."
/usr/bin/drupal-check --memory-limit=-1 "--${INPUT_CHECK}" --format=checkstyle --no-progress --no-interaction -- "${PATHS[@]}" | /usr/bin/reviewdog -f=checkstyle -name="Analysis" -reporter="${INPUT_REPORTER}"
