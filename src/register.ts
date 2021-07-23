
/* IMPORT */

import {DescribeImplementation, SuiteImplementation} from './types';
import describe from './describe';
import Describer from './describer';
import Executor from './executor';
import Suiter from './suiter';
import Tester from './tester';

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

    implementation ( describe );

  }

  tester = ( tester: Tester ): void => {

    const suiter = Executor.get ();

    suiter.registerTester ( tester );

  }

}

/* EXPORT */

export default new Register ();
