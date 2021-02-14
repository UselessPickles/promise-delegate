import { PromiseDelegate } from "./PromiseDelegate";
import { expectError, expectType } from "tsd";

// Default ValueType
{
    // Type of promise defaults to `void` if not specified.
    expectType<PromiseDelegate<void>>(new PromiseDelegate());
}

// General tests for promise types other than `void`
{
    const numberPromise = new PromiseDelegate<number>();

    // Validate type of public properties
    expectType<Promise<number>>(numberPromise.promise);
    expectType<boolean>(numberPromise.settled);

    // Can resolve to correct type
    expectType<void>(numberPromise.resolve(10));
    // Can resolve to a Promise of the correct type
    expectType<void>(numberPromise.resolve(Promise.resolve(10)));

    // Cannot resolve without an explicit value
    // TODO: Uncomment this line after `tsd` bug is fixed:
    //       https://github.com/SamVerschueren/tsd/issues/94
    // expectError(numberPromise.resolve())

    // Cannot resolve to incorrect type
    expectError(numberPromise.resolve("hello"));
    expectError(numberPromise.resolve(undefined));
    expectError(numberPromise.resolve(null));

    // Cannot resolve to a Promise of an incorrect type
    expectError(numberPromise.resolve(Promise.resolve("hello")));
}

// PromiseDelegate<void> (special case)
{
    const voidPromise = new PromiseDelegate<void>();

    // Can resolve to explicit udnefiend value
    expectType<void>(voidPromise.resolve(undefined));
    // Can resolve without an explicit value
    expectType<void>(voidPromise.resolve());

    // Cannot resolve to incorrect type
    expectError(voidPromise.resolve(10));
    expectError(voidPromise.resolve(null));
}
