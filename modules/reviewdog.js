"use strict";

const installURL = 'https://raw.githubusercontent.com/reviewdog/reviewdog/master/install.sh';

const stepLog = require('./step-log');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

if (!('INPUT_CHECK' in process.env)) {
  throw new Error('Environment variable `INPUT_CHECK` is not set.');
}

if (!('GITHUB_TOKEN' in process.env)) {
  throw new Error('Environment variable `GITHUB_TOKEN` is not set.');
}

exports.download = () => {
  stepLog.log('Download reviewdog');
  return exec(`curl -sSL "${installURL}" | sh -s -- -b /tmp latest`);
}

exports.command = () => {
  // reviewdog needs the GitHub token in an environment variable.
  process.env.REVIEWDOG_GITHUB_API_TOKEN = process.env.GITHUB_TOKEN;

  // The report name we want reviewdog to use. If not set explicitly use
  // the check type (with first letter uppercase).
  const name = process.env.INPUT_REPORT_NAME || process.env.INPUT_CHECK.charAt(0).toUpperCase() + process.env.INPUT_CHECK.slice(1)

  // The reviewdog reporter to use.
  const reporter = process.env.INPUT_REPORTER || 'github-pr-check';

  return `/tmp/reviewdog -f=checkstyle -name="${name}" -reporter="${reporter}"`;
}
