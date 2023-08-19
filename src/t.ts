
/* IMPORT */

import type {TestAPI} from './types';

/* HELPERS */

const tapi = {
  current: <Partial<TestAPI>> {}
};

/* MAIN */

//TODO: Publish a polished version of this as a standalone module, "proxy-of" maybe

const t = new Proxy ( {} as TestAPI, { //TSC
  get <K extends keyof TestAPI> ( target: {}, key: K ): TestAPI[K] | undefined {
    return tapi.current[key];
  },
  set <K extends keyof TestAPI> ( target: {}, key: K, value: TestAPI[K] ): boolean {
    tapi.current[key] = value;
    return true;
  },
  has <K extends keyof TestAPI> ( target: {}, key: K ): boolean {
    return ( key in tapi.current );
  }
});

/* EXPORT */

export default t;
export {tapi};
