#!/usr/bin/env node

/* IMPORT */

import {program, updater} from 'specialist';
import CLI from './cli';

/* HELPERS */

const name = 'fava';
const description = 'A wannabe tiny largely-drop-in replacement for ava that works in the browser too.';
const version = '0.0.7';

/* MAIN */

//TODO: Support a "node-arguments" option

updater ({ name, version });

program
  .name ( name )
  .version ( version )
  .description ( description )
  .option ( '-f, --fail-fast', 'Stop after the first failed test' )
  .option ( '-m, --match <globs...>', 'Run only tests whose title matches any of these globs' )
  .option ( '-T, --timeout <ms>', 'Stop a test after this amount of milliseconds' )
  .option ( '-v, --verbose', 'Enable verbose logging' )
  .option ( '-w, --watch', 'Re-run tests when files change' )
  .arguments ( '[globs...]' )
  .action ( CLI.execute );

program.parse ();
