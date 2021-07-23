
/* IMPORT */

import {SuiteImplementation} from './types';
import Register from './register';
import Suiter from './suiter';

/* MAIN */

//TODO: Maybe add flags and hooks to this function too

const suite = ( title: string, implementation: SuiteImplementation ): void => {

  const suiter = new Suiter ( title );

  Register.suiter ( suiter, implementation );

  suiter.execute ();

};

/* EXPORT */

export default suite;
