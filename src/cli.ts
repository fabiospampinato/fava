
/* IMPORT */

import {spawnSync} from 'child_process';
import picomatch from 'picomatch';
import {color} from 'specialist';
import readdir from 'tiny-readdir';
import Watcher from 'watcher';
import {Options} from './types';
import Env from './env';
import Utils from './utils';

/* MAIN */

const CLI = {

  /* API */

  execute: async ( globs: string[], options: Options ): Promise<void> => {

    //TODO: Implement this better
    //TODO: Add support for executing different test files in parallel

    const filterGlobs = globs;
    const filterMatchers = filterGlobs.map ( glob => picomatch ( glob ) );
    const filter = ( targetPath: string ): boolean => filterMatchers.some ( matcher => matcher ( targetPath ) );

    const includeGlobs = ['**/test.{js,mjs}', '**/src/test.{js,mjs}', '**/source/test.{js,mjs}', '**/test-*.{js,mjs}', '**/*.spec.{js,mjs}', '**/*.test.{js,mjs}', '**/test/**/*.{js,mjs}', '**/tests/**/*.{js,mjs}', '**/__tests__/**/*.{js,mjs}'];
    const includeMatchers = includeGlobs.map ( glob => picomatch ( glob ) );
    const include = ( targetPath: string ): boolean => includeMatchers.some ( matcher => matcher ( targetPath ) );

    const ignoreGlobs = ['**/node_modules/**', '**/dist/**', '**/out/**', '**/_[!_]*', '**/__tests__/**/__helper__/**/*', '**/__tests__/**/__helpers__/**/*', '**/__tests__/**/__fixture__/**/*', '**/__tests__/**/__fixtures__/**/*', '**/test/**/helper/**/*', '**/test/**/helpers/**/*', '**/test/**/fixture/**/*', '**/test/**/fixtures/**/*', '**/tests/**/helper/**/*', '**/tests/**/helpers/**/*', '**/tests/**/fixture/**/*', '**/tests/**/fixtures/**/*'];
    const ignoreMatchers = ignoreGlobs.map ( glob => picomatch ( glob ) );
    const ignore = ( targetPath: string ): boolean => ignoreMatchers.some ( matcher => matcher ( targetPath ) );

    const spawn = ( filePath: string ): boolean => {
      const {status} = spawnSync ( process.execPath, [filePath], {
        stdio: ['ignore', 'inherit', 'inherit'],
        env: {
          ...process.env,
          FAVA_CLI: '1',
          FAVA_FAIL_FAST: options.failFast ? '1' : '0',
          FAVA_MATCH: options.match?.length ? options.match.join ( ',' ) : '',
          FAVA_TIMEOUT: options.timeout ? String ( options.timeout ) : '0',
          FAVA_VERBOSE: options.verbose ? '1' : '0'
        }
      });
      return !status;
    };

    const divider = (() => {
      let count = 0;
      return (): void => {
        if ( count ) {
          const width = Utils.getStdoutColumns ();
          const divider = color.dim ( '-'.repeat ( width ) );
          console.log ( divider );
        }
        count += 1;
      };
    })();

    const execute = ( filePath: string ): void => {
      divider ();
      const isSuccess = spawn ( filePath );
      if ( Env.options.failFast && !isSuccess && !options.watch ) {
        process.exit ( 1 );
      }
    };

    const watch = (): void => {
      const watcherOptions = {
        native: true,
        recursive: true,
        ignoreInitial: false,
        debounce: 500,
        ignore
      };
      new Watcher ( process.cwd (), watcherOptions, ( event, targetPath ) => onChange ( targetPath ) );
    };

    const input = (): void => {
      process.stdin.on ( 'data', ( data: Buffer ): void => {
        if ( data.toString ().trim ().toLowerCase () !== 'rs' ) return;
        find ();
      });
    };

    const find = async (): Promise<void> => {
      const {files} = await readdir ( process.cwd (), { ignore } );
      files.forEach ( onChange );
    };

    const onChange = ( targetPath: string ): void => {
      if ( !include ( targetPath ) ) return;
      if ( globs.length && !filter ( targetPath ) ) return;
      execute ( targetPath );
    };

    if ( options.watch ) {

      watch ();
      input ();

    } else {

      find ();

    }

  }

};

/* EXPORT */

export default CLI;
