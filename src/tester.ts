
/* IMPORT */

import makeNakedPromise from 'promise-make-naked';
import color from 'tiny-colors';
import Assert from './assert';
import {NOOP} from './constants';
import Env from './env';
import Utils from './utils';
import type {FN, Callback, Promisable, Color, Teardown, TestAPI, TestContext, TestFlags, TestImplementation, TestLog, TestPassed, TestStats, TestStatus} from './types';

/* MAIN */

class Tester<Context extends {} = {}> {

  /* VARIABLES */

  ctx: TestContext<Context>;
  duration: number = 0;
  executed: boolean = false;
  flags: TestFlags;
  implementation: TestImplementation<Context>;
  logs: TestLog[] = [];
  timeoutMessage: string = 'Test timeoud out';
  timeoutMs: number = 0;
  passed: TestPassed = -1;
  prefixes: string[] = [];
  stats: TestStats = { failed: 0, passed: 0, planned: 0, total: 0 };
  teardowns: Teardown[] = [];
  title: string;

  /* CONSTRUCTOR */

  constructor ( title: string, implementation: TestImplementation<Context>, flags: TestFlags ) {

    this.ctx = {};
    this.flags = flags;
    this.implementation = implementation;
    this.title = title;

  }

  /* PRIVATE API */

  private makeAssertion = <Arguments extends unknown[], Return extends unknown> ( assertion: FN<Arguments, Return> ): FN<Arguments, Return> => {

    const onSuccess = () => this.stats.passed += 1;
    const onError = () => this.stats.failed += 1;

    return ( ...args: Arguments ): Return => {

      this.stats.total += 1;

      const onCall = (): Return => assertion.apply ( undefined, args );

      return this.wrapCall ( onCall, onSuccess, onError );

    };

  }

  private wrapAssert = ( fn: Callback ): Callback => {

    const {assert} = console;

    const wrap = (): void => {
      console.assert = Assert.true;
    };

    const unwrap = (): void => {
      console.assert = assert;
    };

    return (): void => {

      wrap ();

      return this.wrapCall ( fn, unwrap, unwrap );

    };

  }

  private wrapCall = <T> ( onCall: FN<[], T>, onSuccess: Callback, onError: Callback ): T => {

    try {

      const result = onCall ();

      if ( result instanceof Promise ) {

        result.then ( onSuccess, onError );

      } else {

        onSuccess ();

      }

      return result;

    } catch ( error: unknown ) {

      onError ();

      throw error;

    }

  }

  private wrapEnv = ( fn: Callback ): Callback => {

    if ( !Env.is.node ) return fn;

    const NODE_ENV = process.env['NODE_ENV'];

    const set = ( value?: string ): void => {
      try { // This throws an error in Deno
        const NODE_ENV_NAME = 'NODE' + '_' + 'ENV'; // Otherwise this gets messed up in Bun
        process.env[NODE_ENV_NAME] = value;
      } catch {}
    };

    const define = (): void => {
      set ( 'test' );
    };

    const restore = (): void => {
      set ( NODE_ENV );
    };

    return (): void => {

      define ();

      return this.wrapCall ( fn, restore, restore );

    };

  }

  private wrapLogger = ( fn: Callback ): Callback => {

    const {error, info, log, warn} = console;

    const wrap = (): void => {
      console.error = this.log;
      console.info = this.log;
      console.log = this.log;
      console.warn = this.log;
    };

    const unwrap = (): void => {
      console.error = error;
      console.info = info;
      console.log = log;
      console.warn = warn;
    };

    return (): void => {

      wrap ();

      return this.wrapCall ( fn, unwrap, unwrap );

    };

  }

  private wrapTimeout = ( fn: FN<[], Promisable<void>> ): FN<[], Promise<void>> => {

    return async (): Promise<void> => {

      const {reject, promise: promiseTimeout} = makeNakedPromise<void> ();
      const promiseTest = new Promise<void> ( resolve => resolve ( fn () ) );
      const onTimeout = () => reject ( new Error ( this.timeoutMessage ) );
      const onCleanup = () => clearTimeout ( timeoutId );
      const onCall = () => Promise.race ([ promiseTest, promiseTimeout ]);
      const timeoutId = setTimeout ( onTimeout, this.timeoutMs || Env.options.timeout );

      return this.wrapCall ( onCall, onCleanup, onCleanup );

    };

  }

  private wrapTimer = ( fn: Callback ): Callback => {

    let timestamp: number;

    const start = (): void => {
      timestamp = Date.now ();
    };

    const stop = (): void => {
      this.duration = Date.now () - timestamp;
    };

    return (): void => {

      start ();

      return this.wrapCall ( fn, stop, stop );

    };

  }

  /* EXECUTION API */

  api = (): TestAPI<Context> => {

    const self = this;

    return {
      /* VARIABLES */
      get title () { return self.title; },
      get passed () { return self.passed; },
      get context () { return self.ctx; },
      get ctx () { return self.ctx; },
      set context ( ctx: TestContext<Context> ) { self.ctx = ctx; },
      set ctx ( ctx: TestContext<Context> ) { self.ctx = ctx; },
      /* CONTROL API */
      get log () { return self.log; },
      get plan () { return self.plan; },
      get teardown () { return self.teardown; },
      get timeout () { return self.timeout; },
      /* ASSERTION API */
      get pass () { return self.pass; },
      get fail () { return self.fail; },
      get assert () { return self.assert; },
      get truthy () { return self.truthy; },
      get falsy () { return self.falsy; },
      get true () { return self.true; },
      get false () { return self.false; },
      get is () { return self.is; },
      get not () { return self.not; },
      get deepEqual () { return self.deepEqual; },
      get notDeepEqual () { return self.notDeepEqual; },
      get like () { return self.like; },
      get notLike () { return self.notLike; },
      get throws () { return self.throws; },
      get throwsAsync () { return self.throwsAsync; },
      get notThrows () { return self.notThrows; },
      get notThrowsAsync () { return self.notThrowsAsync; },
      get regex () { return self.regex; },
      get notRegex () { return self.notRegex; }
    };

  }

  call = async (): Promise<void> => {

    await this.wrapAssert ( this.wrapEnv ( this.wrapLogger ( this.wrapTimer ( this.wrapTimeout ( () => this.implementation ( this.api () ) ) ) ) ) )();

  }

  execute = async (): Promise<void> => {

    this.executed = true;

    try {

      if ( this.flags.todo ) {

        if ( this.implementation !== NOOP ) {

          return this.result ( 0, '✖', 'red', 'A "todo" test must not provide an implementation' );

        } else {

          return this.result ( -1, '⚠', 'yellow' );

        }

      }

      if ( this.implementation === NOOP ) {

        return this.result ( 0, '✖', 'red', 'A test must provide an implementation' );

      }

      if ( this.flags.skip ) {

        return this.result ( -1, '⚠', 'yellow' );

      }

      await this.call ();

      if ( this.flags.failing ) {

        return this.result ( 0, '✖', 'red', 'A "failing" test is expected to fail, not pass' );

      }

      if ( !this.stats.passed ) {

        return this.result ( 0, '✖', 'red', 'No assertions executed' );

      }

      if ( this.stats.planned && this.stats.passed !== this.stats.planned ) {

        return this.result ( 0, '✖', 'red', `Expected ${color.green ( String ( this.stats.planned ) )} assertions, but got ${color.red ( String ( this.stats.passed ) )}` );

      }

      return this.result ( 1, '✔', 'green' );

    } catch ( error: unknown ) {

      if ( this.flags.failing ) {

        return this.result ( 1, '✔', 'yellow' );

      } else {

        if ( Utils.lang.isError ( error ) || Utils.lang.isString ( error ) ) {

          return this.result ( 0, '✖', 'red', error );

        } else {

          return this.result ( 0, '✖', 'red', 'Unknown error' );

        }

      }

    }

  }

  result = async ( passed: TestPassed, status: TestStatus, statusColor: Color, error?: Error | string ): Promise<void> => {

    //TODO: Prettier logging, error stacks in particular are super noisy

    this.passed = passed;

    const sectionWidth = Utils.getStdoutColumns ();
    const sectionHeader = ( title: string ) => `╭ ${title} ${'─'.repeat ( sectionWidth - title.length - 4 )}╮`;
    const sectionDivider = () => '─'.repeat ( sectionWidth );
    const sectionFooter = () => `╰${'─'.repeat ( sectionWidth - 2 )}╯`;

    if ( Env.options.verbose || !passed ) {

      const prefix = this.prefixes.length ? `${this.prefixes.join ( ` ${color.dim ( '›' )} ` )} ${color.dim ( '›' )} ` : '';
      const suffix = this.duration >= 500 ? color.dim ( ` (${this.duration}ms)` ) : '';

      console.log ( `${color[statusColor]( status )} ${prefix}${this.title}${suffix}` );

      if ( error ) {

        if ( Utils.lang.isString ( error ) ) {

          console.log ( color.red ( sectionHeader ( 'Error' ) ) );
          console.log ( error );
          console.log ( color.red ( sectionFooter () ) );

        } else {

          const errorLines = await Utils.getErrorLines ( error );

          if ( errorLines.length ) {

            console.log ( color.red ( sectionHeader ( 'Error' ) ) );
            console.log ( error.message );
            console.log ( color.red ( sectionDivider () ) );

            for ( const {url, content} of errorLines ) {

              console.log ( color.dim ( url ) );
              console.log ( `${color.dim ( '╰─' )} ${content}` );

            }

            console.log ( color.red ( sectionFooter () ) );

          } else {

            console.log ( color.red ( sectionHeader ( 'Error Stack' ) ) );
            console.log ( error.stack || error.message );
            console.log ( color.red ( sectionFooter () ) );

          }

        }

      }

      if ( this.logs.length ) {

        if ( Env.options.verbose || error ) {

          const logsColor = error ? 'red' : 'green';

          console.log ( color[logsColor]( sectionHeader ( 'Logs' ) ) );

          for ( const log of this.logs ) {

            console.log ( log );

          }

          console.log ( color[logsColor]( sectionFooter () ) );

        }

      }

    }

    for ( const teardown of this.teardowns ) {

      try {

        await teardown ();

      } catch ( error: unknown ) {

        console.log ( color.red ( sectionHeader ( 'Teardown - Error Stack' ) ) );
        console.log ( error );
        console.log ( color.red ( sectionFooter () ) );

      }

    }

  }

  /* CONTROL API */

  log = ( ...values: TestLog[] ): void => {

    this.logs.push ( ...values );

  }

  plan = ( count: number ): void => {

    this.stats.planned = count;

  }

  teardown = ( fn: Teardown ): void => {

    this.teardowns.push ( fn );

  }

  timeout = ( ms: number, message?: string ): void => {

    this.timeoutMessage = message || this.timeoutMessage;
    this.timeoutMs = ms;

  }

  /* ASSERTION API */

  pass = this.makeAssertion ( Assert.pass )
  fail = this.makeAssertion ( Assert.fail )
  assert = this.makeAssertion ( Assert.assert )
  truthy = this.makeAssertion ( Assert.truthy )
  falsy = this.makeAssertion ( Assert.falsy )
  true = this.makeAssertion ( Assert.true )
  false = this.makeAssertion ( Assert.false )
  is = this.makeAssertion ( Assert.is )
  not = this.makeAssertion ( Assert.not )
  deepEqual = this.makeAssertion ( Assert.deepEqual )
  notDeepEqual = this.makeAssertion ( Assert.notDeepEqual )
  like = this.makeAssertion ( Assert.like )
  notLike = this.makeAssertion ( Assert.notLike )
  throws = this.makeAssertion ( Assert.throws )
  throwsAsync = this.makeAssertion ( Assert.throwsAsync )
  notThrows = this.makeAssertion ( Assert.notThrows )
  notThrowsAsync = this.makeAssertion ( Assert.notThrowsAsync )
  regex = this.makeAssertion ( Assert.regex )
  notRegex = this.makeAssertion ( Assert.notRegex )

}

/* EXPORT */

export default Tester;
