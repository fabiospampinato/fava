
/* IMPORT */

import chainer from 'call-chainer';
import clone from 'proxy-watcher/dist/packages/clone';
import isEqual from 'proxy-watcher/dist/packages/is_equal';
import {FN, ErrorLine, TestHook, TestHookImplementation} from './types';
import Env from './env';
import Flags from './flags';

/* MAIN */

const Utils = {

  /* LANG API */

  lang: { //TODO: Replace these with nanodash

    clone,
    isEqual,

    escapeRegExp: ( str: string ): string => {

      return str.replace ( /[|\\{}()[\]^$+*?.]/g, '\\$&' ).replace ( /-/g, '\\x2d' );

    },

    isError: ( x: any ): x is Error => {

      return x instanceof Error;

    },

    isString: ( x: any ): x is string => {

      return typeof x === 'string';

    },

    isUndefined: ( x: any ): x is undefined => {

      return x === undefined;

    }

  },

  /* API */

  getErrorLines: ( error: Error ): ErrorLine[] => {

    const errorLines: ErrorLine[] = [];

    if ( !Env.is.cli || !error.stack ) return errorLines;

    try {

      const filePath = process.argv[1];
      const fileContent: string = require ( 'fs' ).readFileSync ( filePath, 'utf8' );
      const lines = fileContent.split ( /\r?\n|\r/g );
      const urlRe = new RegExp ( `${Utils.lang.escapeRegExp ( filePath )}:(\\d+)`, 'g' );

      for ( const match of error.stack.matchAll ( urlRe ) ) {

        const url = match[0];
        const nr = Number ( match[1] ) - 1;
        const content = lines[nr].trim ();

        errorLines.push ({ url, nr, content });

      }

    } catch {}

    return errorLines;

  },

  getStdoutColumns: (): number => {

    if ( Env.is.cli ) return process.stdout.columns;

    return 72;

  },

  withFlags: <Arguments extends any[], Return extends any> ( fn: FN<[Flags, ...Arguments], Return> ): FN<Arguments, Return> => {

    return chainer ( Flags, ( flags: Flags, ...args: Arguments ): Return => {

      return fn ( flags, ...args );

    });

  },

  withHooks: <Context extends {}, T extends FN> ( fn: T ): T & Record<TestHook, TestHookImplementation<Context>> => {

    const makeHookSetter = ( hook: TestHook ) => {
      return ( fn: TestHookImplementation<Context> ): void => {
        const suiter = require ( './executor' ).default.get (); //FIXME: Importing it normally causes a cycic dependency issue
        const describer = suiter.current;
        describer.hooks[hook]( fn );
      };
    };

    fn['before'] = makeHookSetter ( 'before' );
    fn['after'] = makeHookSetter ( 'after' );
    fn['beforeEach'] = makeHookSetter ( 'beforeEach' );
    fn['afterEach'] = makeHookSetter ( 'afterEach' );

    return fn as ( T & Record<TestHook, TestHookImplementation<Context>> );

  }

};

/* EXPORT */

export default Utils;
