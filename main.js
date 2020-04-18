"use strict";

const util = require('util');
const exec = util.promisify(require('child_process').exec);

// URL's from where we get drupal-check and reviewdog.
const installURL = {
  drupal_check: 'https://github.com/mglaman/drupal-check/releases/download/1.0.14/drupal-check.phar',
  reviewdog: 'https://raw.githubusercontent.com/reviewdog/reviewdog/master/install.sh'
};

// Change to the working directory.
process.chdir(process.env.INPUT_WORKDIR);

// reviewdog needs the GitHub token in an environment variable.
process.env.REVIEWDOG_GITHUB_API_TOKEN = process.env.GITHUB_TOKEN;

// Which drupal-check check to run (analysis or depercations).
const check = process.env.INPUT_CHECK;

// Which paths to check. Probably a multi-line variable so split on
// lines and join as space separated string (with quotes around each
// path).
const paths = process.env.INPUT_PATHS.split('\n').join('" "');

// The report name we want reviewdog to use. If not set explicitly use
// the check type (with first letter uppercase).
const name = process.env.INPUT_REPORT_NAME || process.env.INPUT_CHECK.charAt(0).toUpperCase() + process.env.INPUT_CHECK.slice(1)

// The reviewdog reporter to use.
const reporter = process.env.INPUT_REPORTER;

// The commands we use to run drupal-check and reviewdog (when we
// actually run them we'll pipe the first into the latter).
const command = {
  drupal_check: `/tmp/drupal-check --memory-limit=-1 "--${check}" --format=checkstyle --no-progress --no-interaction -- "${paths}"`,
  reviewdog: `/tmp/reviewdog -f=checkstyle -name="${name}" -reporter="${reporter}"`
};

// Helper to print pretty log messages.
const log = (msg) => {
  console.log(`\x1b[90;1m==> \x1b[0m\x1b[37;1m${msg}\x1b[0m\n`)
}

// Download drupal-check in the background. Returns a promise.
log('Download drupal-check');
let downloadDrupalCheck = exec(`curl -sSL "${installURL.drupal_check}" -o /tmp/drupal-check && chmod +x /tmp/drupal-check`);

// Download reviewdog in the background. Returns a promise.
log('Download reviewdog');
let downloadReviewdog = exec(`curl -sSL "${installURL.reviewdog}" | sh -s -- -b /tmp latest`);

// Wait for drupal-check to be downloaded.
downloadDrupalCheck.then(() => {
  // Wait for reviewdog to be downloaded.
  downloadReviewdog.then(() => {
    // Now run drupal-check.
    log('Running drupal-check and report using reviewdog');
    console.log(`${command.drupal_check} | ${command.reviewdog}`)

    exec(`${command.drupal_check} | ${command.reviewdog}`).catch((error) => {
      // If running the command failed output stderr and exit.
      console.log(error.stderr);
      process.exit(error.code);
    });
  }).catch((error) => {
    // If downloading reviewdog failed output stderr and exit.
    console.log(error.stderr);
    process.exit(error.code);
  });
}).catch((error) => {
  // If downloading drupal-check failed output stderr and exit.
  console.log(error.stderr);
  process.exit(error.code);
});
