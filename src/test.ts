
/* IMPORT */

import {NOOP} from './constants';
import Enhancer from './enhancer';
import EnhancerRegistry from './enhancer.registry';
import Register from './register';
import Tester from './tester';
import type Flags from './flags';
import type {TestImplementation} from './types';

/* MAIN */

const test = EnhancerRegistry.set ( 'test', Enhancer.withHooks ( Enhancer.withFlags ( <Context extends {} = {}> ( flags: Flags, title: string, implementation: TestImplementation<Context> = NOOP ): void => {

  const tester = new Tester<Context> ( title, implementation, flags.flags );

  Register.tester ( tester );

})));

/* EXPORT */

export default test;
