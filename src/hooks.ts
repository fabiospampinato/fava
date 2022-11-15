
/* IMPORT */

import {NOOP} from './constants';
import type {FN, TestHook, TestHooks, TestHookImplementation} from './types';

/* MAIN */

class Hooks<Context extends {} = {}> {

  /* VARIABLES */

  hooks: TestHooks<Context> = {
    before: NOOP,
    after: NOOP,
    beforeEach: NOOP,
    afterEach: NOOP
  };

  /* PRIVATE API */

  private makeHookSetter = ( hook: TestHook ): FN<[TestHookImplementation<Context>], void> => {

    return ( fn: TestHookImplementation<Context> ): void => {

      this.hooks[hook] = fn;

    };

  }

  /* API */

  before = this.makeHookSetter ( 'before' )
  after = this.makeHookSetter ( 'after' )
  beforeEach = this.makeHookSetter ( 'beforeEach' )
  afterEach = this.makeHookSetter ( 'afterEach' )

}

/* EXPORT */

export default Hooks;
