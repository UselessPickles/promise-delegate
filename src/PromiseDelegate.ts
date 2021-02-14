/**
 * A simple wrapper around a Promise that provides an object-oriented interface
 * for resolving (or rejecting) the Promise.
 * @template ValueType - The type of the value the Promise will resolve to.
 */
export class PromiseDelegate<ValueType = void> {
    /**
     * The underlying raw Promise.
     */
    public readonly promise: Promise<ValueType>;

    /**
     * Resolve function for the raw Promise.
     */
    private resolveCallback!: (
        value: ValueType | PromiseLike<ValueType>
    ) => void;

    /**
     * Reject function for the raw Promise.
     */
    private rejectCallback!: (reason?: any) => void;

    /**
     * True if this PromiseDelegate has been settled (resolved/rejected).
     */
    private isSettled: boolean = false;

    /**
     * @param ignoreMultipleSettles - True to silently ignore attempts to settle (resolve/reject) this
     *        PromiseDelegate after it has already been settled once. Otherwise, an error will be thrown
     *        when an attempt is made to settle an already-settled PromiseDelegate (default behavior).
     */
    constructor(private readonly ignoreMultipleSettles: boolean = false) {
        this.promise = new Promise<ValueType>((resolve, reject) => {
            this.resolveCallback = resolve;
            this.rejectCallback = reject;
        });
    }

    /**
     * Marks this PromiseDelegate as settled.
     * @return true if this is the first time this PromiseDelegate is being marked as settled.
     * @throws Error if this PromiseDelegate was initialized with ResolvablePromise=true and has
     *         already been previously settled (resolved/rejected).
     */
    private markAsSettled(): boolean {
        const wasSettled = this.isSettled;
        if (wasSettled && !this.ignoreMultipleSettles) {
            throw new Error("PromiseDelegate is already settled!");
        }
        this.isSettled = true;
        return !wasSettled;
    }

    /**
     * True if this PromiseDelegate has been settled (resolved/rejected).
     */
    public get settled(): boolean {
        return this.isSettled;
    }

    /**
     * Resolve the Promise.
     * @param value - The resolved value.
     * @throws Error if this PromiseDelegate was initialized with ResolvablePromise=true and has
     *         already been previously settled (resolved/rejected).
     */
    public resolve(
        this: PromiseDelegate<void>,
        value?: ValueType | PromiseLike<ValueType>
    ): void;
    public resolve(value: ValueType | PromiseLike<ValueType>): void;
    public resolve(value: ValueType | PromiseLike<ValueType>): void {
        if (this.markAsSettled()) {
            this.resolveCallback(value);
        }
    }

    /**
     * Reject the Promise.
     * @param reason - The reason for rejecting.
     * @throws Error if this PromiseDelegate was initialized with ResolvablePromise=true and has
     *         already been previously settled (resolved/rejected).
     */
    public reject(reason?: any): void {
        if (this.markAsSettled()) {
            this.rejectCallback(reason);
        }
    }
}
