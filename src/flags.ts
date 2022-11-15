
/* IMPORT */

import type {FN, TestFlag, TestFlags} from './types';

/* MAIN */

// This class contains option-methods to be chained to functions

class Flags {

  /* VARIABLES */

  flags: TestFlags = {
    failing: false,
    only: false,
    serial: false, //TODO: Actually support parallel execution mode, currently "serial" is a no-op
    skip: false,
    todo: false
  };

  /* PRIVATE API */

  private makeFlagSetter = ( flag: TestFlag ): FN<[], this> => {

    return (): this => {

      this.flags[flag] = true;

      return this;

    };

  }

  /* API */

  failing = this.makeFlagSetter ( 'failing' )
  only = this.makeFlagSetter ( 'only' )
  serial = this.makeFlagSetter ( 'serial' )
  skip = this.makeFlagSetter ( 'skip' )
  todo = this.makeFlagSetter ( 'todo' )

}

/* EXPORT */

export default Flags;
