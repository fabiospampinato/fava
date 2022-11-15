
/* HELPERS */

const registry: Partial<Record<'describe' | 'test', unknown>> = {};

/* MAIN */

// This module exists in order to avoid cyclic dependency issues

const EnhancerRegistry = {

  /* API */

  get: ( key: 'describe' | 'test' ): any => {

    const value = registry[key];

    if ( !value ) throw new Error ( `Missing registry value "${key}"` );

    return value;

  },

  set: <T extends Function> ( key: 'describe' | 'test', value: T ): T => {

    return registry[key] = value;

  }

};

/* EXPORT */

export default EnhancerRegistry;
