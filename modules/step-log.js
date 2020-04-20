"use strict";

exports.log = (msg) => {
  console.log(`\x1b[90;1m==> \x1b[0m\x1b[37;1m${msg}\x1b[0m\n`)
}
