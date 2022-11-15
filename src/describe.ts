
/* IMPORT */

import {NOOP} from './constants';
import Describer from './describer';
import Enhancer from './enhancer';
import EnhancerRegistry from './enhancer.registry';
import Register from './register';
import type Flags from './flags';
import type {DescribeImplementation} from './types';

/* MAIN */

const describe = EnhancerRegistry.set ( 'describe', Enhancer.withHooks ( Enhancer.withFlags ( <Context extends {} = {}> ( flags: Flags, title: string, implementation: DescribeImplementation = NOOP ): void => {

  const describer = new Describer<Context> ( title, flags.flags );

  Register.describer ( describer, implementation );

})));

/* EXPORT */

export default describe;
