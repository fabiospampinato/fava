
/* IMPORT */

import Executor from './executor';
import Factory from './factory';
import type Describer from './describer';
import type Suiter from './suiter';
import type Tester from './tester';
import type {DescribeImplementation, SuiteImplementation} from './types';

/* MAIN */

// The Register singleton registers new Tester(s), Describer(s) and Suiter(s)

class Register {

  /* API */

  describer = ( describer: Describer, implementation: DescribeImplementation ): void => {

    const suiter = Executor.get ();

    suiter.registerDescriber ( describer, implementation );

  }

  suiter = ( suiter: Suiter, implementation: SuiteImplementation ): void => {

    Executor.set ( suiter );

    implementation ( Factory.makeDescribe () );

  }

  tester = ( tester: Tester ): void => {

    const suiter = Executor.get ();

    suiter.registerTester ( tester );

  }

}

/* EXPORT */

export default new Register ();
