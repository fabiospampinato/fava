
/* IMPORT */

const {assert, describe} = require ( '..' );

/* MAIN */

describe ( 'Assert', test => {

  test ( 'pass', t => {

    t.notThrows ( () => assert.pass () );
    t.notThrows ( () => assert.pass ( 'message' ) );

  });

  test ( 'fail', t => {

    t.throws ( () => assert.fail () );
    t.throws ( () => assert.fail ( 'message' ) );

  });

  test ( 'assert', t => {

    t.notThrows ( () => assert.assert ( 1 ) );

    t.throws ( () => assert.assert ( 0 ) );
    t.throws ( () => assert.assert ( 0, 'message' ) );

  });

  test ( 'truthy', t => {

    t.notThrows ( () => assert.truthy ( 1 ) );

    t.throws ( () => assert.truthy ( 0 ) );
    t.throws ( () => assert.truthy ( 0, 'message' ) );

  });

  test ( 'falsy', t => {

    t.notThrows ( () => assert.falsy ( 0 ) );

    t.throws ( () => assert.falsy ( 1 ) );
    t.throws ( () => assert.falsy ( 1, 'message' ) );

  });

  test ( 'true', t => {

    t.notThrows ( () => assert.true ( true ) );

    t.throws ( () => assert.true ( false ) );
    t.throws ( () => assert.true ( false, 'message' ) );

  });

  test ( 'false', t => {

    t.notThrows ( () => assert.false ( false ) );

    t.throws ( () => assert.false ( true ) );
    t.throws ( () => assert.false ( true, 'message' ) );

  });

  test ( 'is', t => {

    t.notThrows ( () => assert.is ( -0, -0 ) );

    t.throws ( () => assert.is ( -0, 0 ) );
    t.throws ( () => assert.is ( -0, 0, 'message' ) );

  });

  test ( 'not', t => {

    t.notThrows ( () => assert.not ( -0, 0 ) );

    t.throws ( () => assert.not ( -0, -0 ) );
    t.throws ( () => assert.not ( -0, -0, 'message' ) );

  });

  test ( 'deepEqual', t => {

    const a = { foo: { bar: [NaN, 123] } };
    const b = { foo: { bar: [NaN, 123] } };
    const c = { foo: { bar: [] } };

    t.notThrows ( () => assert.deepEqual ( a, b ) );

    t.throws ( () => assert.deepEqual ( a, c ) );
    t.throws ( () => assert.deepEqual ( a, c, 'message' ) );

  });

  test ( 'notDeepEqual', t => {

    const a = { foo: { bar: [NaN, 123] } };
    const b = { foo: { bar: [NaN, 123] } };
    const c = { foo: { bar: [] } };

    t.notThrows ( () => assert.notDeepEqual ( a, c ) );

    t.throws ( () => assert.notDeepEqual ( a, b ) );
    t.throws ( () => assert.notDeepEqual ( a, b, 'message' ) );

  });

  test ( 'like', t => {

    const a = { foo: { bar: 321 }, bar: 123 };
    const b = { bar: 123 };
    const c = { foo: { baz: 321 }, bar: 123 };

    t.notThrows ( () => assert.like ( a, b ) );

    t.throws ( () => assert.like ( a, c ) );
    t.throws ( () => assert.like ( a, c, 'message' ) );

  });

  test ( 'notLike', t => {

    const a = { foo: { bar: 321 }, bar: 123 };
    const b = { bar: 123 };
    const c = { foo: { baz: 321 }, bar: 123 };

    t.notThrows ( () => assert.notLike ( a, c ) );

    t.throws ( () => assert.notLike ( a, b ) );
    t.throws ( () => assert.notLike ( a, b, 'message' ) );

  });

  test ( 'error', t => {

    const a = new Error ( 'msg' );
    const b = new Error ( 'msg' );
    const c = { message: 'msg' };

    a['code'] = 123;

    t.notThrows ( () => assert.error ( a ) );
    t.throws ( () => assert.error ( c ) );

    t.notThrows ( () => assert.error ( a, { instanceOf: Error } ) );
    t.throws ( () => assert.error ( a, { instanceOf: Array } ) );

    t.notThrows ( () => assert.error ( a, { is: a } ) );
    t.throws ( () => assert.error ( a, { is: b } ) );

    t.notThrows ( () => assert.error ( a, { message: 'msg' } ) );
    t.throws ( () => assert.error ( a, { message: '' } ) );

    t.notThrows ( () => assert.error ( a, { name: 'Error' } ) );
    t.throws ( () => assert.error ( a, { name: '' } ) );

    t.notThrows ( () => assert.error ( a, { code: 123 } ) );
    t.throws ( () => assert.error ( a, { code: 1 } ) );

  });

  test ( 'throws', t => {

    t.notThrows ( () => assert.throws ( () => { throw new Error () } ) );

    t.throws ( () => assert.throws ( () => {} ) );
    t.throws ( () => assert.throws ( () => 123 ) );
    t.throws ( () => assert.throws ( () => { throw 123 } ) );
    t.throws ( () => assert.throws ( () => { throw 123 }, undefined, 'message' ) ); //TODO: Test expectations too

  });

  test ( 'throwsAsync', async t => {

    await t.notThrowsAsync ( () => assert.throwsAsync ( async () => { throw new Error () } ) );
    await t.notThrowsAsync ( () => assert.throwsAsync ( () => Promise.reject ( new Error () ) ) );

    await t.throwsAsync ( () => assert.throwsAsync ( () => {} ) );
    await t.throwsAsync ( () => assert.throwsAsync ( () => 123 ) );
    await t.throwsAsync ( () => assert.throwsAsync ( () => Promise.resolve () ) );
    await t.throwsAsync ( () => assert.throwsAsync ( () => Promise.reject () ) );
    await t.throwsAsync ( () => assert.throwsAsync ( async () => 123, undefined, 'message' ) ); //TODO: Test expectations too

  });

  test ( 'notThrows', t => {

    t.notThrows ( () => assert.notThrows ( () => {} ) );

    t.throws ( () => assert.notThrows ( () => { throw new Error () } ) );
    t.throws ( () => assert.notThrows ( () => { throw 123 } ) );
    t.throws ( () => assert.notThrows ( () => { throw 123 }, 'message' ) );

  });

  test ( 'notThrowsAsync', async t => {

    await t.notThrowsAsync ( () => assert.notThrowsAsync ( async () => 123 ) );
    await t.notThrowsAsync ( () => assert.notThrowsAsync ( () => Promise.resolve () ) );

    await t.throwsAsync ( () => assert.notThrowsAsync ( async () => { throw new Error () } ) );
    await t.throwsAsync ( () => assert.notThrowsAsync ( () => Promise.reject () ) );
    await t.throwsAsync ( () => assert.notThrowsAsync ( () => Promise.reject (), 'message' ) );

  });

  test ( 'regex', t => {

    t.notThrows ( () => assert.regex ( 'foo123', /\d/ ) );

    t.throws ( () => assert.regex ( 'foo', /\d/ ) );
    t.throws ( () => assert.regex ( 'foo', /\d/, 'message' ) );

  });

  test ( 'notRegex', t => {

    t.notThrows ( () => assert.notRegex ( 'foo', /\d/ ) );

    t.throws ( () => assert.notRegex ( 'foo123', /\d/ ) );
    t.throws ( () => assert.notRegex ( 'foo123', /\d/, 'message' ) );

  });

});

describe.skip ( 'Assert (Errors)', test => {

  test ( 'pass', () => {

    assert.pass ();

  });

  test ( 'fail', () => {

    assert.fail ();

  });

  test ( 'assert', () => {

    assert.assert ( 0 );

  });

  test ( 'truthy', () => {

    assert.truthy ( 0 );

  });

  test ( 'falsy', () => {

    assert.falsy ( 1 );

  });

  test ( 'true', () => {

    assert.true ( false );

  });

  test ( 'false', () => {

    assert.false ( true );

  });

  test ( 'is', () => {

    assert.is ( -0, 0 );

  });

  test ( 'not', () => {

    assert.not ( -0, -0 );

  });

  test ( 'deepEqual', () => {

    const a = { foo: { bar: [NaN, 123] } };
    const c = { foo: { bar: [] } };

    assert.deepEqual ( a, c );

  });

  test ( 'notDeepEqual', () => {

    const a = { foo: { bar: [NaN, 123] } };
    const b = { foo: { bar: [NaN, 123] } };

    assert.notDeepEqual ( a, b );

  });

  test ( 'like', () => {

    const a = { foo: { bar: 321 }, bar: 123 };
    const c = { foo: { baz: 321 }, bar: 123 };

    assert.like ( a, c );

  });

  test ( 'notLike', () => {

    const a = { foo: { bar: 321 }, bar: 123 };
    const b = { bar: 123 };

    assert.notLike ( a, b );

  });

  test ( 'error', () => {

    const c = { message: 'msg' };

    assert.error ( c );

  });

  test ( 'error - instanceOf', () => {

    const a = new Error ( 'msg' );

    assert.error ( a, { instanceOf: Array } );

  });

  test ( 'error - is', () => {

    const a = new Error ( 'msg' );
    const b = new Error ( 'msg' );

    assert.error ( a, { is: b } );

  });

  test ( 'error - message', () => {

    const a = new Error ( 'msg' );

    assert.error ( a, { message: '' } );

  });

  test ( 'error - name', () => {

    const a = new Error ( 'msg' );

    assert.error ( a, { name: '' } );

  });

  test ( 'error - code', () => {

    const a = new Error ( 'msg' );

    a['code'] = 123;

    assert.error ( a, { code: 1 } );

  });

  test ( 'throws', () => {

    assert.throws ( () => {} );

  });

  test ( 'throwsAsync', async () => {

    await assert.throwsAsync ( () => {} );

  });

  test ( 'notThrows', () => {

    assert.notThrows ( () => { throw new Error () } );

  });

  test ( 'notThrowsAsync', async () => {

    await assert.notThrowsAsync ( async () => { throw new Error () } );

  });

  test ( 'regex', () => {

    assert.regex ( 'foo', /\d/ );

  });

  test ( 'notRegex', () => {

    assert.notRegex ( 'foo123', /\d/ );

  });

});
