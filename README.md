[![npm version](https://img.shields.io/npm/v/promise-delegate.svg)](https://www.npmjs.com/package/promise-delegate)
[![Join the chat at https://gitter.im/promise-delegate/Lobby](https://badges.gitter.im/UselessPickles/ts-event-publisher//Lobby.svg)](https://gitter.im/UselessPickles/promise-delegate)
[![Build Status](https://travis-ci.org/UselessPickles/promise-delegate.svg?branch=main)](https://travis-ci.org/UselessPickles/promise-delegate)
[![Coverage Status](https://coveralls.io/repos/github/UselessPickles/promise-delegate/badge.svg?branch=main)](https://coveralls.io/github/UselessPickles/promise-delegate?branch=main)

# PromiseDelegate

A simple type-safe wrapper around a `Promise` that provides an object-oriented interface
for settling (resolving/rejecting) the promise.

Written in TypeScript, and distributed as both an ES module and CJS module with type
definitions and source maps.

# Contents

<!-- TOC depthFrom:1 -->

-   [PromiseDelegate](#promisedelegate)
-   [Contents](#contents)
-   [Why? (example)](#why-example)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Import](#import)
    -   [Instantiate](#instantiate)
    -   [Properties](#properties)
        -   [promise](#promise)
        -   [settled](#settled)
    -   [Methods](#methods)
        -   [resolve](#resolve)
        -   [reject](#reject)

<!-- /TOC -->

# Why? (example)

Sometimes code is designed/organized in such a way that implementing a Promise becomes
very tedious. For example, if you need to instantiate and have a reference to your Promise
before and separate from code that triggers the eventual settling of that Promise.

NOTE: I'm not promoting this as "good practice" in general if avoidable, but just
acknowledging that it is sometimes practically/pragmatically unavoidable for a variety
of reasons.

Here's an oversimplified example with a raw `Promise`:

```ts
class Foo {
    private readonly namePromise: Promise<string>;
    private resolveNamePromise!: (value: string) => void;

    constructor() {
        this.namePromise = new Promise<string>((resolve) => {
            // Store the resolve function so we can call it
            // later.
            this.resolveNamePromise = resolve;
        });
    }

    public getName(): Promise<string> {
        return this.namePromise;
    }

    public initStuff(): void {
        // hardcoded value for simplified example only
        this.resolveNamePromise("Bob");
    }
}
```

Here's the same example, but simplified by using `PromiseDelegate`:

```ts
import { PromiseDelegate } from "promise-delegate";

class Foo {
    private readonly namePromiseDelegate = new PromiseDelegate<string>();

    public getName(): Promise<string> {
        return this.namePromiseDelegate.promise;
    }

    public initStuff(): void {
        // hardcoded value for simplified example only
        this.namePromiseDelegate.resolve("Bob");
    }
}
```

# Installation

Install via [NPM](https://www.npmjs.com/package/promise-delegate):

```
npm i -s promise-delegate
```

# Usage

## Import

TypeScript/ES6:

```ts
import { PromiseDelegate } from "promise-delegate";
```

JavaScript:

```js
const PromiseDelegate = require("promise-delegate").PromiseDelegate;
```

## Instantiate

```ts
constructor<ValueType = void>(ignoreMultipleSettles: boolean = false)
```

Use the `PromiseDelegate` constructor to create a new `PromiseDelegate` with a
corresponding new underlying `Promise`.

The `ValueType` type parameter specifies the type of resolve value. Defaults to
`void` if unspecified, which represents a `PromiseDelegate` that can resolved without
a value to simply indicate that something has finished.

The optional `ignoreMultipleSettles` parameter controls what happens if you attempt
to settle (resolve/reject) the `PromiseDelegate` after it has already been settled:

-   `false`: (default) An exception is thrown upon subsequent attempts to settle.
-   `true`: Subsequent attempts to settle are silently ignored.

TypeScript:

```ts
// specify type of the promise value
const numberPromiseDelegate = new PromiseDelegate<number>();

// defaults to a `void` promise if type is unspecified
// (no resolved value; only signals the completion of something)
const voidPromiseDelegate = new PromiseDelegate();
```

JavaScript:

```js
// You're on your own for the type of the value :)
const promiseDelegate = new PromiseDelegate();
```

## Properties

### promise

```ts
promise: Promise<ValueType>
```

A reference to the underlying `Promise` that can be settled (resolved/rejected)
by the `PromiseDelegate`.

### settled

```ts
settled: boolean;
```

True if this `PromiseDelegate` has been settled (resolved/rejected).

## Methods

### resolve

```ts
resolve(value: ValueType | PromiseLike<ValueType>): void
```

Resolves the underlying `Promise` with the specified `value` and
marks this `PromiseDelegate` as `settled`.

Throws an error if this `PromiseDelegate` was already previously settled, and it
was not [instantiated](#instantiate) with `allowMultipleSettles = true`.

NOTE: If `ValueType` is `void`, then the `value` parameter may be omitted
completely, or must be exactly `undefined` if specified.

### reject

```ts
reject(reason?: any): void
```

Rejects the underlying `Promise` with the specified `reason` and
marks this `PromiseDelegate` as `settled`.

Throws an error if this `PromiseDelegate` was already previously settled, and it
was not [instantiated](#instantiate) with `allowMultipleSettles = true`.
