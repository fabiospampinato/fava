
/* IMPORT */

import {NOOP} from './constants';
import Flags from './flags';
import Hooks from './hooks';
import Tester from './tester';
import type {FN, Promisable, TestFlags} from './types';

/* MAIN */

class Describer<Context extends {} = {}> {

  /* VARIABLES */

  describers: Describer<any>[] = [];
  executed: boolean = false;
  flags: TestFlags;
  hooks: Hooks = new Hooks ();
  testers: Tester[] = [];
  title: string;

  /* CONSTRUCTOR */

  constructor ( title: string, flags: TestFlags ) {

    this.flags = flags;
    this.title = title;

  }

  /* EXECUTION API */

  execute = async (): Promise<void> => {

    //TODO: Make sure that hooks are called reliably, even in case of exceptions

    this.executed = true;

    const global = new Tester<Context> ( 'global', NOOP, new Flags ().flags ).api ();

    await this.hooks.hooks.before ( global );

    await this.visit ({
      recursive: false,
      onDescriber: describer => {

        return describer.execute ();

      },
      onTester: async tester => {

        const local = new Tester<Context> ( 'local', NOOP, new Flags ().flags ).api ();

        local.ctx = { ...global.ctx };

        await this.hooks.hooks.beforeEach ( local );

        await tester.execute ();

        await this.hooks.hooks.afterEach ( local );

      }
    });

    await this.hooks.hooks.after ( global );

  }

  visit = async ({ onDescriber, onTester, recursive = true }: { onDescriber?: FN<[Describer], Promisable<void>>, onTester?: FN<[Tester], Promisable<void>>, recursive?: boolean }): Promise<void> => {

    for ( const describer of this.describers ) {

      await onDescriber?.( describer );

      if ( !recursive ) continue;

      await describer.visit ({ onDescriber, onTester, recursive });

    }

    for ( const tester of this.testers ) {

      await onTester?.( tester );

    }

  }

}

/* EXPORT */

export default Describer;
