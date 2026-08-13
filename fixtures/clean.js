#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .scriptName("clean")
  .usage("$0 --input <path>")
  .option("input", {
    alias: "i",
    type: "string",
    demandOption: true,
    describe: "folder to clean",
  })
  .option("pattern", {
    type: "string",
    default: "*.tmp",
    describe: "glob to delete",
  })
  .option("dry-run", {
    type: "boolean",
    default: true,
    describe: "print what would be removed",
  })
  .help()
  .parse();

console.log("Cleaning (fixture, no files touched)");
console.log(JSON.stringify(argv, null, 2));
