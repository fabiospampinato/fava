
/* IMPORT */

import chainer from 'call-chainer';
import Executor from './executor';
import Flags from './flags';
import type {FN, TestHook, TestHookImplementation} from './types';

/* MAIN */

const Enhancer = {

  /* API */

  withFlags: <Arguments extends any[], Return extends any> ( fn: FN<[Flags, ...Arguments], Return> ): FN<Arguments, Return> => {

    return chainer ( Flags, ( flags: Flags, ...args: Arguments ): Return => {

      return fn ( flags, ...args );

    });

  },

  withHooks: <Context extends {}, T extends FN> ( fn: T ): T & Record<TestHook, TestHookImplementation<Context>> => {

    const makeHookSetter = ( hook: TestHook ) => {
      return ( fn: TestHookImplementation<Context> ): void => {
        const suiter = Executor.get ();
        const describer = suiter.current;
        describer.hooks[hook]( fn );
      };
    };

    Object.assign ( fn, {
      before: makeHookSetter ( 'before' ),
      after: makeHookSetter ( 'after' ),
      beforeEach: makeHookSetter ( 'beforeEach' ),
      afterEach: makeHookSetter ( 'afterEach' )
    });

    return fn as ( T & Record<TestHook, TestHookImplementation<Context>> );

  }

};

/* EXPORT */

export default Enhancer;
