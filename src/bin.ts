#!/usr/bin/env node

/* IMPORT */

import {bin} from 'specialist';
import CLI from './cli';

/* MAIN */

//TODO: Support a "node-arguments" option

bin ( 'fava', 'A wannabe tiny largely-drop-in replacement for ava that works in the browser too' )
  .autoExit ( false ) //TODO: Delete this
  .option ( '-f, --fail-fast', 'Stop after the first failed test' )
  .option ( '-m, --match <globs...>', 'Run only tests whose title matches any of these globs' )
  .option ( '-T, --timeout <ms>', 'Stop a test after this amount of milliseconds' )
  .option ( '-V, --verbose', 'Enable verbose logging' )
  .option ( '-w, --watch', 'Re-run tests when files change' )
  .argument ( '[globs...]', 'List of globs matching files to include' )
  .action ( ( options, globs ) => CLI.execute ( globs, options ) )
  .run ();
