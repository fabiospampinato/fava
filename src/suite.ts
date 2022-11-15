
/* IMPORT */

import Register from './register';
import Suiter from './suiter';
import type {SuiteImplementation} from './types';

/* MAIN */

//TODO: Maybe add flags and hooks to this function too

const suite = ( title: string, implementation: SuiteImplementation ): void => {

  const suiter = new Suiter ( title );

  Register.suiter ( suiter, implementation );

  suiter.execute ();

};

/* EXPORT */

export default suite;
