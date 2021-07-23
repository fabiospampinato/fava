
/* IMPORT */

import matcher from 'matcher';
import {color} from 'specialist';
import {DescribeImplementation} from './types';
import {ROOT_DESCRIBER_ID} from './constants';
import Describer from './describer';
import Env from './env';
import Flags from './flags';
import test from './test';
import Tester from './tester';

/* MAIN */

class Suiter {

  /* VARIABLES */

  current: Describer;
  executed: boolean = false;
  root: Describer;
  scheduled: boolean = false;
  stack: Describer[];
  title: string;

  /* CONSTRUCTOR */

  constructor ( title: string ) {

    this.root = new Describer ( ROOT_DESCRIBER_ID, new Flags ().flags );
    this.current = this.root;
    this.stack = [this.current];
    this.title = title;

  }

  /* REGISTRY API */

  registerDescriber = ( describer: Describer, implementation: DescribeImplementation ): void => {

    const prev = this.current;

    this.current.describers.push ( describer );
    this.current = describer;

    this.stack.push ( describer );

    implementation ( test );

    this.stack.pop ();

    this.current = prev;

  }

  registerTester = ( tester: Tester ): void => {

    this.current.testers.push ( tester );

  }

  /* EXECUTION API */

  execute = async (): Promise<void> => {

    this.executed = true;

    await this.propagateFlags ();
    await this.propagateFlagOnly ();
    await this.propagateMatch ();
    await this.propagatePrefixes ();

    await this.root.execute ();

    await this.summary ();

    await this.propagateExitCode ();

  }

  propagateExitCode = async (): Promise<void> => {

    if ( !Env.is.cli ) return;

    let isSuccess = true;

    await this.root.visit ({
      onTester: tester => {
        if ( tester.passed !== 0 ) return;
        isSuccess = false;
      }
    });

    const exitCode = ( isSuccess ? 0 : 1 );

    process.exitCode = exitCode;

  }

  propagateFlags = async (): Promise<void> => {

    const propagate = ( source: Describer, target: Describer | Tester ): void => {
      for ( const flag in source.flags ) {
        target.flags[flag] ||= source.flags[flag];
      }
    };

    const visit = ( root: Describer ): Promise<void> => {
      return root.visit ({
        onDescriber: describer => {
          propagate ( root, describer );
          return visit ( describer );
        },
        onTester: tester => {
          propagate ( root, tester );
        }
      });
    };

    await visit ( this.root );

  }

  propagateFlagOnly = async (): Promise<void> => {

    let hasOnly = false;

    await this.root.visit ({
      onTester: tester => {
        if ( !tester.flags.only ) return;
        hasOnly = true;
      }
    });

    if ( !hasOnly ) return;

    await this.root.visit ({
      onTester: tester => {
        if ( tester.flags.only ) return;
        tester.flags.skip = true;
      }
    });

  }

  propagateMatch = async (): Promise<void> => {

    if ( !Env.options.match.length ) return;

    await this.root.visit ({
      onTester: tester => {
        if ( tester.flags.skip ) return;
        if ( matcher.isMatch ( tester.title, Env.options.match ) ) return;
        tester.flags.skip = true;
      }
    });

  }

  propagatePrefixes = async (): Promise<void> => {

    const visit = ( root: Describer, prefixes: string[] ): Promise<void> => {
      return root.visit ({
        recursive: false,
        onDescriber: describer => {
          return visit ( describer, [...prefixes, describer.title] );
        },
        onTester: tester => {
          tester.prefixes = prefixes;
        }
      });
    };

    await visit ( this.root, [] );

  }

  schedule = (): void => {

    if ( this.scheduled ) return;

    this.scheduled = true;

    setTimeout ( this.execute, 0 );

  }

  summary = async (): Promise<void> => {

    const assertions = { passed: 0, failed: 0, total: 0 };
    const tests = { passed: 0, failed: 0, skipped: 0, total: 0 };

    await this.root.visit ({
      onTester: tester => {
        assertions.passed += tester.stats.passed;
        assertions.failed += tester.stats.failed;
        assertions.total += tester.stats.total;
        tests.passed += ( tester.passed === 1 ? 1 : 0 );
        tests.failed += ( tester.passed === 0 ? 1 : 0 );
        tests.skipped += ( tester.passed === -1 ? 1 : 0 );
        tests.total += 1;
      }
    });

    if ( Env.options.verbose || tests.failed ) {

      console.log ();

    }

    if ( Env.is.cli ) {

      const filePath = process.argv[1];
      const folderRe = /^(.*)([\\\/])(test|tests|__tests__)(\1)/;
      const testName = folderRe.test ( filePath ) ? filePath.replace ( folderRe, '' ) : require ( 'path' ).basename ( filePath );

      console.log ( `${color.cyan ( 'ℹ' )} File: ${testName}` );

    }

    if ( Env.options.verbose ) {

      console.log ( `${color.cyan ( 'ℹ' )} Asserts: ${color.green ( String ( assertions.passed ) )} passed, ${color[assertions.failed ? 'red' : 'green'] ( String ( assertions.failed ) )} failed` );

    }

    console.log ( `${color.cyan ( 'ℹ' )} Tests: ${color.green ( String ( tests.passed ) )} passed, ${color[tests.failed ? 'red' : 'green'] ( String ( tests.failed ) )} failed${tests.skipped ? `, ${color.yellow ( String ( tests.skipped ) )} skipped` : ''}` );

  }

}

/* EXPORT */

export default Suiter;
