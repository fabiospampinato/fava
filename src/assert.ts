
/* IMPORT */

import Utils from './utils';
import type {AssertErrorExpectation, Promisable} from './types';

/* MAIN */

//TODO: Maybe use "concordance" for clean diffs https://github.com/concordancejs/concordance
//TODO: Maybe switch to a more ava-like "like" function: https://github.com/avajs/ava/blob/main/lib/like-selector.js
//TODO: Improve error messages (Extend Error with extra diffs and stuff)
//TODO: Support snapshots

const Assert = {

  /* API */

  pass: ( message?: string ): void => {

    return;

  },

  fail: ( message?: string ): void => {

    throw new Error ( message ?? 'The "fail" assertion got called' );

  },

  assert: ( value: unknown, message?: string ): void => {

    return Assert.truthy ( value, message );

  },

  truthy: ( value: unknown, message?: string ): void => {

    if ( !!value ) return;

    throw new Error ( message ?? `Expected "${value}" to be truthy` );

  },

  falsy: ( value: unknown, message?: string ): void => {

    if ( !value ) return;

    throw new Error ( message ?? `Expected "${value}" to be falsy` );

  },

  true: ( value: unknown, message?: string ): void => {

    if ( value === true ) return;

    throw new Error ( message ?? `Expected "${value}" to be true` );

  },

  false: ( value: unknown, message?: string ): void => {

    if ( value === false ) return;

    throw new Error ( message ?? `Expected "${value}" to be false` );

  },

  is: ( value: unknown, expected: unknown, message?: string ): void => {

    if ( Object.is ( value, expected ) ) return;

    throw new Error ( message ?? `Expected "${value}" to be exactly "${expected}"` );

  },

  not: ( value: unknown, expected: unknown, message?: string ): void => {

    if ( !Object.is ( value, expected ) ) return;

    throw new Error ( message ?? `Expected "${value}" to not be exactly "${expected}"` );

  },

  deepEqual: ( value: unknown, expected: unknown, message?: string ): void => {

    if ( Utils.lang.isEqual ( value, expected ) ) return;

    throw new Error ( message ?? `Expected "${value}" to be deeply equal to "${expected}"` );

  },

  notDeepEqual: ( value: unknown, expected: unknown, message?: string ): void => {

    if ( !Utils.lang.isEqual ( value, expected ) ) return;

    throw new Error ( message ?? `Expected "${value}" to not be deeply equal to "${expected}"` );

  },

  like: ( value: unknown, partial: unknown, message?: string ): void => {

    if ( Utils.lang.isLike ( value, partial ) ) return;

    throw new Error ( message ?? `Expected "${value}" to be like "${partial}"` );

  },

  notLike: ( value: unknown, partial: unknown, message?: string ): void => {

    if ( !Utils.lang.isLike ( value, partial ) ) return;

    throw new Error ( message ?? `Expected "${value}" to not be like "${partial}"` );

  },

  error: ( error: unknown, expectation?: AssertErrorExpectation ): void => {

    if ( !Utils.lang.isError ( error ) ) {

      throw new Error ( `Expected exception to be an instance of "Error", but got "${error}"` );

    }

    if ( expectation ) {

      const {instanceOf, is, message, name, code} = expectation;

      if ( !Utils.lang.isUndefined ( instanceOf ) ) {

        if ( !( error instanceof instanceOf ) ) {

          throw new Error ( `Expected error to be an instance of "${instanceOf}" but got "${error}"` );

        }

      }

      if ( !Utils.lang.isUndefined ( is ) ) {

        if ( !Object.is ( error, is ) ) {

          throw new Error ( `Expected error to be exactly "${is}" but got "${error}"` );

        }

      }

      if ( !Utils.lang.isUndefined ( message ) ) {

        if ( error.message !== message ) {

          throw new Error ( `Expected error to have message "${message}" but got "${error.message}"` );

        }

      }

      if ( !Utils.lang.isUndefined ( name ) ) {

        if ( error.name !== name ) {

          throw new Error ( `Expected error to have name "${name}" but got "${error.name}"` );

        }

      }

      if ( !Utils.lang.isUndefined ( code ) ) {

        const errorCode = Utils.lang.isException ( error ) ? error.code : undefined;

        if ( errorCode !== code ) {

          throw new Error ( `Expected error to have code "${code}" but got "${errorCode}"` );

        }

      }

    }

  },

  throws: ( fn: () => void, expectation?: AssertErrorExpectation, message?: string ): void => {

    try {

      fn ();

    } catch ( error: unknown ) {

      Assert.error ( error, expectation );

      return;

    }

    throw new Error ( message ?? 'Expected function to throw' );

  },

  throwsAsync: async ( fn: () => Promisable<void>, expectation?: AssertErrorExpectation, message?: string ): Promise<void> => {

    try {

      await fn ();

    } catch ( error: unknown ) {

      Assert.error ( error, expectation );

      return;

    }

    throw new Error ( message ?? 'Expected function to throw or reject' );

  },

  notThrows: ( fn: () => void, message?: string ): void => {

    try {

      fn ();

    } catch ( error: unknown ) {

      throw new Error ( message ?? 'Expected function to not throw' );

    }

  },

  notThrowsAsync: async ( fn: () => Promisable<void>, message?: string ): Promise<void> => {

    try {

      await fn ();

    } catch ( error: unknown ) {

      throw new Error ( message ?? 'Expected function to not throw or reject' );

    }

  },

  regex: ( str: string, regex: RegExp, message?: string ): void => {

    if ( regex.test ( str ) ) return;

    throw new Error ( message ?? `Expected "${str}" to match the regex "${regex}"` );

  },

  notRegex: ( str: string, regex: RegExp, message?: string ): void => {

    if ( !regex.test ( str ) ) return;

    throw new Error ( message ?? `Expected "${str}" to not match the regex "${regex}"` );

  },

  wait: ( ms: number ): Promise<void> => {

    return new Promise ( resolve => {

      setTimeout ( resolve, ms );

    });

  }

};

/* EXPORT */

export default Assert;
