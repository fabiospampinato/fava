
/* IMPORT */

import isEqual from 'are-deeply-equal';
import Env from './env';
import type {Exception, ErrorLine} from './types';

/* MAIN */

const Utils = {

  /* LANG API */

  lang: { //TODO: Replace these with nanodash

    isEqual,

    escapeRegExp: ( str: string ): string => {

      return str.replace ( /[|\\{}()[\]^$+*?.]/g, '\\$&' ).replace ( /-/g, '\\x2d' );

    },

    keys: <T extends Record<string | number | symbol, unknown>> ( object: T ): (keyof T)[] => {

      return Object.keys ( object );

    },

    isException: ( value: unknown ): value is Exception => {

      return Utils.lang.isError ( value ) && value.hasOwnProperty ( 'code' );

    },

    isError: ( value: unknown ): value is Error => {

      return value instanceof Error;

    },

    isLike: ( value: unknown, partial: unknown ): boolean => {

      if ( !Utils.lang.isPlainObject ( value ) ) return false;

      if ( partial === undefined ) return true;

      if ( !Utils.lang.isPlainObject ( partial ) ) return false;

      const keys = Reflect.ownKeys ( partial );

      for ( const key of keys ) {

        const val = partial[key];

        if ( Utils.lang.isPlainObject ( val ) ) {

          return Utils.lang.isLike ( value[key], val );

        } else {

          return Object.is ( value[key], val );

        }

      }

      return true;

    },

    isPlainObject: ( value: unknown ): value is Record<string | number | symbol, unknown> => {

      if ( typeof value !== 'object' || value === null ) return false;

      if ( Object.prototype.toString.call ( value ) !== '[object Object]' ) return false;

      const prototype = Object.getPrototypeOf ( value );

      if ( prototype === null ) return true;

      return Object.getPrototypeOf ( prototype ) === null;

    },

    isString: ( value: unknown ): value is string => {

      return typeof value === 'string';

    },

    isUndefined: ( value: unknown ): value is undefined => {

      return value === undefined;

    }

  },

  /* API */

  getErrorLines: async ( error: Error ): Promise<ErrorLine[]> => {

    const errorLines: ErrorLine[] = [];

    if ( !Env.is.cli || !error.stack ) return errorLines;

    try {

      const fs = await import ( 'node:fs' );
      const filePath = process.argv[1];
      const fileContent: string = fs.readFileSync ( filePath, 'utf8' );
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

  }

};

/* EXPORT */

export default Utils;
