#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();
program
  .name("resize")
  .description("Batch resize images (fixture — does not touch files)")
  .requiredOption("-i, --input <path>", "source folder")
  .option("-o, --output <path>", "destination folder", "./out")
  .option("-w, --width <number>", "output width", "1200")
  .option("-q, --quality <number>", "jpeg quality", "85")
  .option("--verbose", "print extra logs")
  .action((opts) => {
    console.log("Resizing (fixture, no files touched)");
    console.log(JSON.stringify(opts, null, 2));
    if (opts.verbose) {
      console.error("verbose: done");
    }
  });

program.parse();
