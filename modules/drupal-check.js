"use strict";

const installURL = 'https://github.com/mglaman/drupal-check/releases/download/1.0.14/drupal-check.phar';

const stepLog = require('./step-log');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

if (!('INPUT_CHECK' in process.env)) {
  throw new Error('Environment variable `INPUT_CHECK` is not set.');
}

if (!('INPUT_PATHS' in process.env)) {
  throw new Error('Environment variable `INPUT_PATHS` is not set.');
}

exports.download = () => {
  stepLog.log('Download drupal-check');
  return exec(`curl -sSL "${installURL}" -o /tmp/drupal-check && chmod +x /tmp/drupal-check`);
}
  
exports.command = () => {
  // Which drupal-check check to run (analysis or deprecations).
  const check = process.env.INPUT_CHECK;
  
  // Which paths to check. Probably a multi-line variable so split on
  // lines and join as space separated string (with quotes around each
  // path).
  const paths = process.env.INPUT_PATHS.split('\n').join('" "');
  
  return `/tmp/drupal-check --memory-limit=-1 "--${check}" --format=checkstyle --no-progress --no-interaction -- "${paths}"`;
}
