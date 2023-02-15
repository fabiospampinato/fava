
/* HELPERS */

const isNode = ( typeof process === 'object' );

/* MAIN */

const Env = <const> {
  is: {
    browser: !isNode,
    node: isNode,
    cli: isNode && Boolean ( Number ( process.env['FAVA_CLI'] ) )
  },
  options: {
    failFast: isNode && Boolean ( Number ( process.env['FAVA_FAIL_FAST'] ) ), //TODO: Actually handle this within a single file also
    match: isNode ? ( process.env['FAVA_MATCH'] || '' ).split ( ',' ).filter ( x => x ) : [],
    timeout: ( isNode && Number ( process.env['FAVA_TIMEOUT'] ) ) || 10_000,
    verbose: isNode && Boolean ( Number ( process.env['FAVA_VERBOSE'] ) )
  }
};

/* EXPORT */

export default Env;
