"use strict";

const stepLog = require('./modules/step-log');
const drupalCheck = require('./modules/drupal-check');
const reviewdog = require('./modules/reviewdog');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Change to the working directory.
if ('INPUT_WORKDIR' in process.env) {
  process.chdir(process.env.INPUT_WORKDIR);
}

Promise.all([
  // Download tools.
  drupalCheck.download(),
  reviewdog.download()
]).then(() => {
  // Run drupal-check and pipe the result to reviewdog.
  stepLog.log('Running drupal-check and report using reviewdog');
  exec(`${drupalCheck.command()} | ${reviewdog.command()}`).then(({stdout, stderr}) => {
    console.log(stdout);
    console.log(stderr);
  }).catch((error) => {
    console.log(error.stdout);
    console.log(error.stderr);
    process.exit(error.code);
  })
}).catch((error) => {
  console.log(error.stdout);
  console.log(error.stderr);
  process.exit(error.code);
})
