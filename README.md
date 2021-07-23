
<p align="center">
  <img src="./resources/logo/logo.svg" alt="Fava's logo" width="300" />
</p>

# [Fava](https://en.wikipedia.org/wiki/Vicia_faba) (WIP)

A wannabe tiny largely-drop-in replacement for [`ava`](https://github.com/avajs/ava) that works in the browser too.

## Features

- **`ava`-like**: if you like `ava`'s APIs you'll like `fava`'s too, because it provides essentially the same APIs.
- **Tiny**: it requires about 90% fewer dependencies, that's ~8MB less code to download and execute, and most of the dependencies used I maintain myself.
- **Isomorphic**: it works everywhere, Node CLI, Node runtime, Electron, Browser, maybe even Deno.

## Drawbacks

This is still very much a work in progress, compared to `ava` it currently has the following drawbacks (and probably more):

- It's **untested**, testing software with an untested testing framework isn't really recommended.
- Tests are always run serially, even across multiple test files, no two tests are ever running at the same time.
- Test files are not preprocessed with Babel or TypeScript, they are just plain JS files.
- The textual output of the library is pretty bare-bones in general, it's pretty far from being as nice as `ava`'s.
- Error outputs in particular are pretty basic, no fancy diffs.
- The `snapshot` and `try` assertions are not implemented.
- Observables are not supported.
- TAP reporters are not supported.
- Callback tests are not supported.
- Coverage reports are not supported.

Basically unless you want to play with this or you absolutely need an `ava`-like testing framework in the browser I wouldn't recommend using this.

## Install

```sh
npm install --save-dev fava
```

## Usage

```ts
import {assert, test, describe, suite} from 'fava';

// A standalone assertion library is provided

assert.deepEqual ( [1], [1] );

// A "suite" function is provided, for opt-in better code organization
// You can totally just not use it at all

suite ( 'Example suite', describe => {

  // A "describe" function is provided, for opt-in better code organization
  // "describe" functions can be nested indefinitely
  // You can totally just not use it at all

  describe ( 'Example describe', test => {

    // A "test" function is provided, it should work just like ava's

    test ( 'Example test', t => {

      // A "t" context object is provided, it should work just like ava's

      t.pass ();

    });

  });

});
```

For further documentation for now just refer to [`ava`'s](https://github.com/avajs/ava).

## License

MIT © Fabio Spampinato
