#!/usr/bin/env bash

set -veuo pipefail

step_log () {
    echo -e "\033[1m$*...\033[0m"
}

export REVIEWDOG_GITHUB_API_TOKEN=${GITHUB_TOKEN}

readarray -t PATHS <<<"$INPUT_PATHS"

step_log "Install latest drupal-check..."
curl --fail --silent --output /usr/bin/drupal-check -O -L https://github.com/mglaman/drupal-check/releases/latest/download/drupal-check.phar && chmod +x /usr/bin/drupal-check

step_log "Analysis check..."
(/usr/bin/drupal-check --memory-limit=-1 --analysis --format=checkstyle --no-progress --no-interaction -- "${PATHS[@]}" | /usr/bin/reviewdog -f=checkstyle -name="Analysis" -reporter="${INPUT_REPORTER}") || true

step_log "Deprecations check..."
(/usr/bin/drupal-check --memory-limit=-1 --deprecations --format=checkstyle --no-progress --no-interaction -- "${PATHS[@]}" | /usr/bin/reviewdog -f=checkstyle -name="Deprecations" -reporter="${INPUT_REPORTER}") || true
