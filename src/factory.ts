
/* IMPORT */

import {NOOP} from './constants';
import Describer from './describer';
import Enhancer from './enhancer';
import Register from './register';
import Tester from './tester';
import type Flags from './flags';
import type {DescribeImplementation} from './types';

/* MAIN */

// This file exists to avoid creating cyclic dependencies, while still providing fresh goods

const Factory = {

  /* API */

  makeDescribe: () => Enhancer.withHooks ( Enhancer.withFlags ( <Context extends {} = {}> ( flags: Flags, title: string, implementation: DescribeImplementation = NOOP ): void => {

    const describer = new Describer<Context> ( title, flags.flags );

    Register.describer ( describer, implementation );

  })),

  makeTest: () => Enhancer.withHooks ( Enhancer.withFlags ( <Context extends {} = {}> ( flags: Flags, title: string, implementation: TestImplementation<Context> = NOOP ): void => {

    const tester = new Tester<Context> ( title, implementation, flags.flags );

    Register.tester ( tester );

  }))

};

/* EXPORT */

export default Factory;
