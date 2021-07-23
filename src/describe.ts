
/* IMPORT */

import {DescribeImplementation} from './types';
import {NOOP} from './constants';
import Describer from './describer';
import Flags from './flags';
import Register from './register';
import Utils from './utils';

/* MAIN */

const describe = Utils.withHooks ( Utils.withFlags ( <Context extends {} = {}> ( flags: Flags, title: string, implementation: DescribeImplementation = NOOP ): void => {

  const describer = new Describer<Context> ( title, flags.flags );

  Register.describer ( describer, implementation );

}));

/* EXPORT */

export default describe;
