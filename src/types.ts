
/* HELPERS */

type FN<Arguments extends any[] = any[], Return = any> = ( ...args: Arguments ) => Return;

type Promisable<T> = Promise<T> | T;

type DescribeFN = typeof import ( './describe' ).default;

// type Describer<Context> = import ( './describer' ).default<Context>;

type TestFN = typeof import ( './test' ).default;

type Tester<Context> = import ( './tester' ).default<Context>;

// type SuiteFN = typeof import ( './suite' ).default;

// type Suiter = import ( './suiter' ).default;

/* MAIN */

type AssertErrorExpectation = {
  instanceOf?: () => any,
  is?: unknown,
  code?: string | number,
  message?: RegExp | string,
  name?: string
};

type Callback = () => void;

type Color = 'red' | 'green' | 'yellow';

type DescribeImplementation = ( test: TestFN ) => void;

type Exception = Error & {
  code: string | number
};

type ErrorLine = {
  url: string,
  nr: number,
  content: string
};

type Options = {
  failFast?: boolean,
  match?: string[],
  timeout?: number | string,
  verbose?: boolean,
  watch?: boolean
};

type SuiteImplementation = ( describe: DescribeFN ) => void;

type Teardown = () => Promisable<void>;

type TestAPI<Context> = Pick<Tester<Context>, 'title' | 'passed' | 'ctx' | 'log' | 'plan' | 'teardown' | 'timeout' | 'pass' | 'fail' | 'assert' | 'truthy' | 'falsy' | 'true' | 'false' | 'is' | 'not' | 'deepEqual' | 'notDeepEqual' | 'like' | 'notLike' | 'throws' | 'throwsAsync' | 'notThrows' | 'notThrowsAsync' | 'regex' | 'notRegex'> & { context: TestContext<Context> };

type TestContext<Context> = Partial<Context> | {}; //TSC: Not sure why the union type is needed here

type TestFlag = 'failing' | 'only' | 'serial' | 'skip' | 'todo';

type TestFlags = Record<TestFlag, boolean>;

type TestHook = 'before' | 'after' | 'beforeEach' | 'afterEach';

type TestHooks<Context> = Record<TestHook, TestHookImplementation<Context>>;

type TestHookImplementation<Context> = TestImplementation<Context>;

type TestImplementation<Context> = ( t: TestAPI<Context> ) => Promisable<void>;

type TestLog = any;

type TestPassed = -1 | 0 | 1;

type TestStat = 'failed' | 'passed' | 'planned' | 'total';

type TestStats = Record<TestStat, number>;

type TestStatus = '✔' | '✖' | '⚠';

/* EXPORT */

export type {FN, Promisable, AssertErrorExpectation, Callback, Color, DescribeImplementation, Exception, ErrorLine, Options, SuiteImplementation, Teardown, TestAPI, TestContext, TestFlag, TestFlags, TestHook, TestHooks, TestHookImplementation, TestImplementation, TestLog, TestPassed, TestStat, TestStats, TestStatus};
