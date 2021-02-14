import { PromiseDelegate } from "./PromiseDelegate";

function noop(): void {
    // do nothing
}

describe("resolve()", () => {
    test("resolves the underlying promise with a value", (done) => {
        const promiseDelegate = new PromiseDelegate<number>();

        expect(promiseDelegate.settled).toBe(false);

        promiseDelegate.promise.then((value) => {
            expect(promiseDelegate.settled).toBe(true);
            expect(value).toBe(42);
            done();
        });

        promiseDelegate.resolve(42);
        expect(promiseDelegate.settled).toBe(true);
    });

    test("resolves the underlying promise with a resolved Promise", (done) => {
        const promiseDelegate = new PromiseDelegate<number>();

        expect(promiseDelegate.settled).toBe(false);

        promiseDelegate.promise.then((value) => {
            expect(promiseDelegate.settled).toBe(true);
            expect(value).toBe(42);
            done();
        });

        promiseDelegate.resolve(Promise.resolve(42));
        expect(promiseDelegate.settled).toBe(true);
    });

    test("rejects the underlying promise with a rejected Promise", (done) => {
        const promiseDelegate = new PromiseDelegate<number>();

        expect(promiseDelegate.settled).toBe(false);

        promiseDelegate.promise.catch((reason) => {
            expect(promiseDelegate.settled).toBe(true);
            expect(reason).toBe(42);
            done();
        });

        promiseDelegate.resolve(Promise.reject(42));
        expect(promiseDelegate.settled).toBe(true);
    });

    test("does not require a value if type == void", (done) => {
        const promiseDelegate = new PromiseDelegate();

        promiseDelegate.promise.then((value) => {
            expect(value).toBe(undefined);
            done();
        });

        // call resolve() without a value argument
        promiseDelegate.resolve();
    });

    test("throws if already resolved", () => {
        const promiseDelegate = new PromiseDelegate<number>();

        // avoid NodeJS warnings about unhandled promise
        promiseDelegate.promise.then(noop, noop);

        promiseDelegate.resolve(42);

        expect(() => {
            promiseDelegate.resolve(1337);
        }).toThrow();
    });

    test("throws if already rejected", () => {
        const promiseDelegate = new PromiseDelegate<number>();

        // avoid NodeJS warnings about unhandled promise
        promiseDelegate.promise.then(noop, noop);

        promiseDelegate.reject(42);

        expect(() => {
            promiseDelegate.resolve(1337);
        }).toThrow();
    });

    test("does not throw if already resolved and ignoreMultipleSettles=true", (done) => {
        const promiseDelegate = new PromiseDelegate<number>(true);

        promiseDelegate.resolve(42);

        expect(() => {
            promiseDelegate.resolve(1337);
        }).not.toThrow();

        promiseDelegate.promise.then((value) => {
            // confirm the promise is resolved with the first value
            expect(value).toBe(42);
            done();
        });
    });

    test("does not throw if already rejected and ignoreMultipleSettles=true", (done) => {
        const promiseDelegate = new PromiseDelegate<number>(true);

        promiseDelegate.reject(42);

        expect(() => {
            promiseDelegate.resolve(1337);
        }).not.toThrow();

        promiseDelegate.promise.catch((reason) => {
            // confirm the promise is rejected
            expect(reason).toBe(42);
            done();
        });
    });
});

describe("reject()", () => {
    test("rejects the underlying promise", (done) => {
        const promiseDelegate = new PromiseDelegate<number>();

        expect(promiseDelegate.settled).toBe(false);

        promiseDelegate.promise.catch((reason) => {
            expect(promiseDelegate.settled).toBe(true);
            expect(reason).toBe(42);
            done();
        });

        promiseDelegate.reject(42);
        expect(promiseDelegate.settled).toBe(true);
    });

    test("throws if already resolved", () => {
        const promiseDelegate = new PromiseDelegate<number>();

        // avoid NodeJS warnings about unhandled promise
        promiseDelegate.promise.then(noop, noop);

        promiseDelegate.resolve(42);

        expect(() => {
            promiseDelegate.reject(1337);
        }).toThrow();
    });

    test("throws if already rejected", () => {
        const promiseDelegate = new PromiseDelegate<number>();

        // avoid NodeJS warnings about unhandled promise
        promiseDelegate.promise.then(noop, noop);

        promiseDelegate.reject(42);

        expect(() => {
            promiseDelegate.reject(1337);
        }).toThrow();
    });

    test("does not throw if already resolved and ignoreMultipleSettles=true", (done) => {
        const promiseDelegate = new PromiseDelegate<number>(true);

        promiseDelegate.resolve(42);

        expect(() => {
            promiseDelegate.reject(1337);
        }).not.toThrow();

        promiseDelegate.promise.then((value) => {
            // confirm the promise is resolved
            expect(value).toBe(42);
            done();
        });
    });

    test("does not throw if already rejected and ignoreMultipleSettles=true", (done) => {
        const promiseDelegate = new PromiseDelegate<number>(true);

        promiseDelegate.reject(42);

        expect(() => {
            promiseDelegate.reject(1337);
        }).not.toThrow();

        promiseDelegate.promise.catch((reason) => {
            // confirm the promise is rejected with the first reason
            expect(reason).toBe(42);
            done();
        });
    });
});
