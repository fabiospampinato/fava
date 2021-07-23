
/* IMPORT */

import {TestImplementation} from './types';
import {NOOP} from './constants';
import Flags from './flags';
import Register from './register';
import Tester from './tester';
import Utils from './utils';

/* MAIN */

const test = Utils.withHooks ( Utils.withFlags ( <Context extends {} = {}> ( flags: Flags, title: string, implementation: TestImplementation<Context> = NOOP ): void => {

  const tester = new Tester<Context> ( title, implementation, flags.flags );

  Register.tester ( tester );

}));

/* EXPORT */

export default test;
