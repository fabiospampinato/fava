
/* IMPORT */

import {ROOT_SUITER_ID} from './constants';
import Suiter from './suiter';

/* MAIN */

// The Executor singleton keeps track of the current suite, or creates one if needed
// Only one suite can be active at any given time, they can't be nested

class Executor {

  /* VARIABLES */

  private current?: Suiter;

  /* API */

  get = (): Suiter => {

    if ( this.current && !this.current.executed ) return this.current;

    return this.init ();

  }

  init = (): Suiter => {

    const suiter = new Suiter ( ROOT_SUITER_ID );

    suiter.schedule ();

    return this.current = suiter;

  }

  set = ( suiter: Suiter ): Suiter => {

    if ( this.current && !this.current.scheduled ) this.current.schedule ();

    return this.current = suiter;

  }

};

/* EXPORT */

export default new Executor ();
