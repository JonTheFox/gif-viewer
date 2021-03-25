import Logger from "../logg";
const logger = new Logger({ label: "issy" });
const { logg, loggError } = logger;

//might be used by other functions below
const sanitizeVarName = (name) => {
    //create a JS-safe variable name (i.e. a string that starts with a letter or an underscore, and then has only alphanumeric characters or underscores)
    if (!name) throw new Error(`sanitizeVarName: no variable name provided`);
    const onlyCharsAndDigits = name.replace(/[^a-zA-Z\d]+/g, "_");
    const firstChar = name[0];
    const firstCharIsLetterOrUnderscore = firstChar.replace(/[^a-zA-Z]+/g, "_");
    const sanitizedName =
        firstCharIsLetterOrUnderscore + onlyCharsAndDigits.slice(1);
    return sanitizedName;
};

var issy = (function() {
    class Validator {
        constructor(arg, negate) {
            this.arg = arg;
            this.negate = negate || false;
        }

        _is = (aType = "") => {
            if (!aType) return null;
            const { arg } = this;
            let result;
            switch (aType) {
                case "aNumber":
                    result = typeof this.arg === "number" && !isNaN(arg);
                    break;
                case "aString":
                    result =
                        (!arg && arg === "") ||
                        typeof arg === "string" ||
                        arg instanceof String;
                    break;
                case "aFunction":
                    result = typeof arg === "function";
                    break;
                case "anArray":
                    result =
                        Object.prototype.toString.call(this.arg) ===
                        "[object Array]";
                    break;
                case "anObject":
                    result =
                        arg !== null &&
                        Object(arg) &&
                        typeof arg === "object" &&
                        !this.anArray;
                    break;
                case "aDate":
                    result =
                        Object.prototype.toString.call(this.arg) ===
                            "[object Date]" && !isNaN(this.arg.getTime())
                            ? true
                            : false;
                    break;
                case "aValidDate":
                    const _date = new Date(this.arg);
                    result = _date instanceof Date && !isNaN(_date);
                    break;

                default:
                    throw new Error(
                        "Unrecognized data type argument provided to issy"
                    );
            }

            const finalResult = this.negate ? !result : result;
            return finalResult;
        };

        get aNumber() {
            return this._is("aNumber");
        }
        get aString() {
            return this._is("aString");
        }
        get anArray() {
            return this._is("anArray");
        }
        get aFunction() {
            return this._is("aFunction");
        }
        get anObject() {
            return this._is("anObject");
        }
        get aDate() {
            return this._is("aDate");
        }

        get is() {
            return this; //to chain another getter
            //e.g. : our(items).is.anArray ? items[0] : items
        }
        get isNot() {
            this.negate = true;
            return this; //keep it goin'..
        }
    }

    const our = (arg) => {
        return new Validator(arg);
        // For use within an if statement
        // 1. if(our(users).is.anArray) users.push(newUser);
        // 2. const wrongType = our(users).is.not.anArray; users.push(newUser);
    };

    const is = (arg) => {
        return new Validator(arg);
        // For use within a ternary operator
        // const wrongType = is(users).anArray() ? false : true;
        // if(wrongType) throw new Error('Invalid "user" parameter');
    };

    const isNot = (arg) => {
        return new Validator(arg, "negate");
        // For use within a ternary operator
        // const wrongType = is(users).anArray() ? false : true;
        // if(wrongType) throw new Error('Invalid "user" parameter');
    };
    return { our, is, isNot, Validator };
})(); //closure self-executing function

const { our, is, isNot } = issy;

const getRandomUpTo = (max, numGenerations = 1, min = 0) => {
    //returns an integer that is >= 0 and <= max
    let rand;
    for (let i = 0; i < numGenerations; i++) {
        rand = Math.random();
    }
    const randInt = Math.floor(rand * (max + 1));
    return randInt;
};

const getIntBetween = (min, max) => {
    //returns an integer that is >= min and <= max
    return Math.floor(Math.random() * (max - min)) + min;
};

const pickRandomFrom = (arr, numItems = 1, excludedIndexes = []) => {
    if (!our(arr).anArray) {
        return null;
    }
    const ln = arr.length;
    numItems = numItems > ln ? ln : numItems;
    let randomIndex = -1;
    const randomIndexes = [];
    const randomItems = [];
    for (let i = 0; i < numItems; i++) {
        let numIterations = 0;
        do {
            randomIndex = getRandomUpTo(ln - 1, 3);
            numIterations++;
        } while (
            numIterations < 200 &&
            (randomIndexes.includes(randomIndex) ||
                excludedIndexes.includes(randomIndex))
        );
        randomIndexes.push(randomIndex);
        randomItems.push(arr[randomIndex]);
    }
    //For a single item, return it directly. For more than one items, return an array.
    return numItems === 1 ? randomItems[0] : randomItems;
};

var timing = (function() {
    const COMPLETE_TYPES = ["resolve", "reject"];
    const _isTimeout = (str) =>
        str &&
        str.length &&
        ["timeout", "timeouts"].includes(str.toLowerCase());
    let timeoutIndex = 0;
    let intervalIndex = 0;
    const _clear = (timeoutOrInterval = "timeout", timerID, timerItem = {}) => {
        if (!timerID) {
            loggError(`_clear(): called without a timerID`);
            return null;
        }
        // const { label, ms, numTimesSet } = timerItem;
        const isTimeout = _isTimeout(timeoutOrInterval);
        try {
            isTimeout
                ? window.clearTimeout(timerID)
                : window.clearInterval(timerID);
            return true;
        } catch (err) {
            debugger;
            return null;
        }
    };

    // Promise Keeper
    // ===================================
    // Enhance a Promise object with resolve() and reject() methods, to allow for easy triggering of promise completion from the outside (e.g.: from inside state reducer), at any time.
    // Handle multiple promises in a straight-forward way: Resolve when at least one promise resolves (and ignore rejections)

    //PromiseKeeper.prototype.stall and .every work great with async/await.

    //They are trickir with PromiseKeeper.prototype.then
    //The normal Promise.prototype.then method returns a simple Promise object. We want to keep our powerful, remote-controller, labelled UltimatePromise and lose its precious, useful data. So we assign it a method called andThen, which accepts a callback and invokes it upon completion.

    let promiseIndex = 1;
    class PromiseKeeper {
        promises = {};
        numPromises = 0;
        latestPromise = {};
        label = "";
        logLabel = "";
        constructor({ label = "" } = {}) {
            this.label = label;
            this.logLabel = `PromiseKeeper("${this.label}"): `;
        }

        _addOrUpdateUltimatePromise = (ultimatePromise) => {
            if (!is(ultimatePromise).anObject) {
                loggError(
                    "_addOrUpdateUltimatePromise() was called without an ultimatePromise"
                );
                return null;
            }

            const {
                // isTimeout,
                // isInterval,
                //id, //still no id at this point. will be added to the ultimatePromise once this method is done
                //ms = 0,
                label = "",
                sanitizedLabel = "",
            } = ultimatePromise;

            if (!label) {
                loggError(
                    "_addOrUpdateUltimatePromise() was called without a label"
                );
                return null;
            }

            // if (ultimatePromise.isTimeout) {
            //     this.clear("timeout", label);
            // } else if (ultimatePromise.isInterval) {
            //     this.clear("interval", label);
            // }

            let promiseEntry = this.promises[sanitizedLabel];
            if (!promiseEntry) {
                ultimatePromise.numTimesSet = 1;
                ultimatePromise.numTimesSet = 1;
            } else {
                //an UltimatePromise with the provided (sanitized) label already exists.
                ultimatePromise.numTimesSet = promiseEntry.numTimesSet + 1;

                //If it's a timer element (i.e. timout or interval), clear it.
                if (promiseEntry.isTimeout) {
                    if (!promiseEntry.id) {
                        loggError(
                            `_addOrUpdateUltimatePromise(): an existing timeout promise does NOT have a timer id`
                        );
                        debugger;
                    }
                    _clear("timeout", promiseEntry.id);
                } else if (promiseEntry.isInterval) {
                    if (!promiseEntry.id) {
                        loggError(
                            `_addOrUpdateUltimatePromise(): an existing interval promise does NOT have a timer id`
                        );
                        debugger;
                    }
                    _clear("interval", promiseEntry.id);
                }
            }

            this.promises[sanitizedLabel] = ultimatePromise;
            this.latestPromise = ultimatePromise;
            return ultimatePromise;
        };

        // public API //
        ////////////////
        andThen = function(callback) {
            //the normal Promise.prototype.then function returns a regular Promise object. This means that if we invoke promiseKeeper.stall, .every, withRC, etc., and chaining the returned value with .then(), we will not get our wrapper -  i.e. ultimatePromise - back, but rather a regular promise. This is undesired if we also want to await the completion (i.e. resolve/reject) of the promise later on in the code.
            //andThen allows us to both chain a callback when the promise is resolved AND await for it later in the code, making for really flexible async handling. We can, for example, stall(). andThen do something, and MEANWHILE continue to do other operations. Once those task are done, we can await the completion of the promise.
            const { originalPromise } = this;

            originalPromise.then((resolvedValue) => {
                callback(resolvedValue);
            });
            return this;
        };

        stall = function(ms = 50, label, config) {
            const STALL_TILL = "stall till ";

            label =
                (is(label).aString && label && STALL_TILL + label) ||
                `${
                    this.label ? this.label + " - " : ""
                }stall (timeout${timeoutIndex})`;

            const ultimatePromiseConfig = {
                label,
                ms,
                isTimeout: true,
            };

            if (is(config).anObject) {
                //aditional configuration passed by caller
                Object.assign(ultimatePromiseConfig, config);
            }

            let stallPromise;
            let timeoutId;
            stallPromise = this.withRC(
                new Promise((resolve) => {
                    //resolve in provided ms
                    timeoutId = setTimeout(() => {
                        resolve({ ms, label });
                    }, ms);
                }),
                ultimatePromiseConfig
            );

            //now we can add the timeout id to the ultimatePromise
            stallPromise.id = timeoutId;
            return stallPromise;
        };

        every = (ms = 1000, callback, label) => {
            if (!callback) {
                loggError(
                    `every() was called without a callback. Ignoring call. `
                );
                return null;
            }
            intervalIndex++;

            const EVERY = "_every_";
            label =
                (is(label).aString && label && label + EVERY + `${ms}_ms`) ||
                `${
                    this.label ? this.label + " - " : ""
                }every (interval${intervalIndex})`;

            // const ultimatePromiseConfig = {
            //     label,
            //     ms,
            //     isInterval: true,
            // };

            let everyPromise;
            let intervalId;
            everyPromise = this.withRC(
                new Promise((resolve, reject) => {
                    intervalId = setInterval(callback, ms);
                }),
                { label, isInterval: true }
            );

            //now we can add the interval id to the ultimatePromise
            everyPromise.id = intervalId;
        };

        clear = (
            timeoutOrInterval = "timeout",
            label = "",
            removeFromCache = false
        ) => {
            /* return values :
            /* true -   indeed cleared
            /* false -  not found, and thus not cleared
            /* null -   error 
            */

            const sanitizedLabel = sanitizeVarName(label);

            if (!["timeout", "interval"].includes(timeoutOrInterval)) {
                loggError("clear(): timeoutOrInterval is neither!");
                return null;
            }

            const timerType = timeoutOrInterval;

            try {
                let timerElement;
                switch (sanitizedLabel) {
                    case "":
                        //clear last PromiseKeeper element
                        timerElement = this.latestPromise;
                        if (!timerElement) {
                            logg(`clear(): there are no promises to clear`);
                            return false;
                        }

                        _clear(timerType, timerElement.id, timerElement);
                        timerElement.cleared = true;
                        this.latestPromise = {};
                        if (removeFromCache) {
                            const {
                                sanitizedLabel: _sanitizedLabel,
                            } = timerElement;
                            delete this.promises[_sanitizedLabel];
                        }

                    case "all":
                        for (let [key, _timerElement] of Object.entries(
                            this.promises
                        )) {
                            if (_timerElement.id) {
                                _clear(
                                    timerType,
                                    _timerElement.id,
                                    _timerElement
                                );
                                _timerElement.cleared = true;
                                if (removeFromCache) {
                                    delete this.promises[sanitizedLabel];
                                }
                            }
                        }

                        return true;

                    default:
                        //label provided
                        // timerElement = batch.filter(element => {
                        //     return element.sanitizedLabel === sanitizedLabel;
                        // })[0];
                        timerElement = this.promises[sanitizedLabel];
                        if (!timerElement) {
                            logg(
                                `clear(): Did not find a promise with label ${label}`
                            );
                            return false;
                        }
                        if (!timerElement.id) {
                            logg(
                                `promise ${sanitizedLabel} is not a timer element (timeout or interval)`
                            );
                            return null;
                        }
                        _clear(timerType, timerElement.id, timerElement);
                        timerElement.cleared = true;

                        if (removeFromCache) {
                            delete this.promises[sanitizedLabel];
                        }
                        return true;
                } //switch
            } catch (err) {
                logg(
                    this.logLabel + `Could not clear ${timerType} "${label}"`,
                    err
                );
                return null;
            }
        };

        clearTimeout = (label = "") => {
            this.clear("timeout", label);
        };
        clearInterval = (label = "") => {
            this.clear("interval", label);
        };

        clearAll = () => {
            const timeoutsDidClear = this.clear("timeout", "all");
            const intervalsDidClear = this.clear("interval", "all");
            const promisesDidReject = this.rejectAll();
            return timeoutsDidClear && intervalsDidClear && promisesDidReject;
        };

        withRC = function(originalPromise, config = {}) {
            //wrap a given promise with an UltimatePromise, i.e: a higher-order promise that can be resolved/rejected from anywhere, anytime! :)
            // const ultimate = new UltimatePromise(originalPromise);
            // logg("ultimatePromise: ", ultimate);

            const label =
                (is(config.label).aString && config.label) ||
                `ultimatePromise${promiseIndex}`;
            //create a version of the label that is suitable for serving as a variable name
            const sanitizedLabel = sanitizeVarName(label);

            let logMsg = this.logLabel + `UltimatePromise "${label}": `;

            if (!originalPromise) {
                logg(logMsg + "Missing promise argument.");
                return null;
            }

            const {
                noRejection = false, //you can ignore rejections to continue normal execution flow. Useful!
                resolveOnError = false,
                rejectOnResolve = false,
            } = config;

            let _ultimateResolve, _ultimateReject;

            const ultimatePromise = new Promise(
                (ultimateResolve, ultimateReject) => {
                    //save references to resolve() and reject() to enable manual resolve/rejection from anywhere, anytime
                    _ultimateResolve = ultimateResolve;
                    _ultimateReject = ultimateReject;
                }
            );

            Object.assign(ultimatePromise, config);
            ultimatePromise.sanitizedLabel = sanitizedLabel;
            ultimatePromise.i = promiseIndex;
            ultimatePromise.andThen = this.andThen.bind(ultimatePromise);

            //enhance the original Promise with custom resolve/reject callbacks, that communicate completion (either resolve or reject) back to to the wrapping (ultimate) Promise
            originalPromise.then((resolvedValue) => {
                ultimatePromise.originalPromise.result = {
                    resolved: true,
                    resolvedValue: resolvedValue,
                };
                if (rejectOnResolve) {
                    ultimatePromise.rejectedOnResolve = true;

                    return _ultimateReject("rejectOnResolve : true");
                }
                ultimatePromise.resolved = true;
                return _ultimateResolve(resolvedValue);
            });

            originalPromise.catch((reason = "") => {
                try {
                    const reasonString = is(reason).aString
                        ? reason
                        : is(reason).anObject
                        ? JSON.stringify(reason)
                        : "No reason supplied";

                    ultimatePromise.originalPromise.result = {
                        rejected: true,
                        reason,
                    };

                    logMsg +=
                        "a wrapped Promise has been rejected for the following reason: \n" +
                        reasonString +
                        "\n";

                    ultimatePromise.rejected = true;
                    if (resolveOnError) {
                        ultimatePromise.resolved = true;
                        ultimatePromise.resolvedOnError = true;
                        logg(logMsg + "--> RESOLVING ON ERROR!");
                        return _ultimateResolve(null, reasonString);
                    }

                    if (noRejection) {
                        ultimatePromise.rejectionIgnored = true;
                        logg(
                            logMsg +
                                "--> REJECTION IGNORED! Resolving instead. ",
                            ultimatePromise
                        );
                        return _ultimateResolve(null, reasonString);
                        // return true;
                    }

                    return _ultimateReject(reasonString);
                } catch (err) {
                    loggError(err.message);
                    return true;
                }
            });

            originalPromise.finally(() => {
                ultimatePromise.originalPromise.completed = true;
            });

            //keep a reference to the orignal Promise object for easy debugging or any other use case
            ultimatePromise.originalPromise = originalPromise;

            promiseIndex++;

            //add methods for remotely completing the ultimate promise
            ultimatePromise.resolve = (value = "") => {
                if (!ultimatePromise.resolved && !ultimatePromise.rejected) {
                    ultimatePromise.resolved = true;
                    return _ultimateResolve(value);
                }
            };
            ultimatePromise.reject = (reason = "") => {
                if (!ultimatePromise.resolved && !ultimatePromise.rejected) {
                    ultimatePromise.rejected = true;
                    return _ultimateReject(reason);
                }
            };

            //for easy completion (great for debugging and fast-forwarding)
            this._addOrUpdateUltimatePromise(ultimatePromise); //for easy completion (great for debugging and fast-forwarding)
            return ultimatePromise;
        };

        reject = (promiseLabel, reason = "unspecified") => {
            try {
                if (!promiseLabel) {
                    loggError(
                        `Can't reject a promise without a specified label`
                    );
                    return null;
                }

                const sanitizedLabel = sanitizeVarName(promiseLabel);

                const promiseToReject = this.promises[sanitizedLabel];

                if (!promiseToReject) {
                    logg(
                        `Did not find a promise with a label of "${promiseLabel}")`
                    );
                    return null;
                }
                if (promiseToReject.reject) {
                    promiseToReject.reject(reason, promiseToReject);
                    logg(
                        `${this.logLabel} rejected promise "${promiseToReject.label}". Reason: ${reason}`,
                        promiseToReject
                    );
                }
            } catch (err) {
                loggError(err.message);
                return null;
            }
        };

        resolve = (promiseLabel, resolveValue) => {
            try {
                if (!promiseLabel) {
                    loggError(
                        `Can't resolve a promise without a specified label`
                    );
                    return null;
                }

                const sanitizedLabel = sanitizeVarName(promiseLabel);

                const promiseToResolve = this.promises[sanitizedLabel];
                if (!promiseToResolve) {
                    throw new Error(
                        `Did not find a promise with a label of "${promiseLabel}"`
                    );
                }
                if (promiseToResolve.reject) {
                    promiseToResolve.resolve(resolveValue, promiseToResolve);
                    logg(
                        `${this.logLabel} resolving promise "${promiseToResolve.label}". resolveValue:`,
                        resolveValue,
                        promiseToResolve
                    );
                }
            } catch (err) {
                loggError(err.message);
                return null;
            }
        };

        _completeLatest = (completeType = "", logPromise = true) => {
            if (!completeType) {
                loggError(
                    "completeAll() was called without completeType (resolve / reject"
                );
                return null;
            }

            if (!COMPLETE_TYPES.includes(completeType)) {
                loggError(
                    "completeAll() was called with an illegal completeType (resolve / reject"
                );
                return null;
            }

            const { latestPromise } = this;
            const msg = this.logLabel + `${completeType}Latest(): `;
            if (!latestPromise || !latestPromise.resolve) {
                logg(`${msg}There isn't any promise `);
                return false;
            }

            latestPromise[completeType](`manual ${completeType}`);
            if (logPromise) logg(msg, latestPromise);
            this.latestPromise = {};
            return true;
        };

        resolveLatest = () => {
            this._completeLatest("resolve");
        };

        rejectLatest = () => {
            this._completeLatest("reject");
        };

        completeAll = (resolveOrReject = "reject", valOrReason = "") => {
            const { promises } = this;
            if (!promises) {
                loggError("No this.promises object?");
                return false;
            }

            const completefunc =
                resolveOrReject === "resolve" ? "resolve" : "reject";
            const reason = `completeAll(): manual ${completefunc}()`;

            const _promises = this.promises;
            for (let [key, _promise] of Object.entries(_promises)) {
                _promise[completefunc](reason);
                logg(
                    `${this.logLabel || ""} ${reason} of promise "${
                        _promise.label
                    }". `,
                    valOrReason ? valOrReason : `\nNo reason provided.`,
                    _promise
                );
            }
            this.promises = {};
        };

        resolveAll = () => {
            this.completeAll("resolve");
        };
        rejectAll = () => {
            this.completeAll("reject");
        };

        any = (promises = [], config = {}, label) => {
            //ultimately-resolves upon resolve of any of the provided promises. Ignores any rejections.

            // const { autoResolve = false, timeout = 0 } = config;

            const numPromises = promises.length;
            //let numRejected = 0;
            let numCompleted = 0;
            let _ultimateResolve;
            let _ultimateReject;

            const softPromises = promises.map((promise, i) => {
                return this.withRC(promise, { noRejection: true });
            });

            //TODO: replace this vanilla promise with withRC() to get an actual remote-controlled ultimatePromise
            const ultimatePromise = this.withRC(
                new Promise(async (ultimateResolve, ultimateReject) => {
                    _ultimateResolve = ultimateResolve;
                    _ultimateReject = ultimateReject;
                    await Promise.race(softPromises);
                    // const fullfiller = softPromises[fullfillerIndex];
                    const morePromisesLeft = numCompleted < numPromises;
                    const numPromisesRejected = softPromises.reduce(
                        (numRejected, promiseHolder, i) => {
                            if (!promiseHolder.originalPromise) {
                                debugger;
                            }
                            if (promiseHolder.originalPromise.rejected) {
                                numRejected++;
                            }
                            return numRejected;
                        },
                        0
                    );

                    logg(
                        this.logLabel +
                            `".any(): resolved! (${numPromisesRejected} promises rejected. ${
                                morePromisesLeft
                                    ? numPromises -
                                      numPromisesRejected +
                                      " haven't completed as of yet)"
                                    : ""
                            }`
                    );
                })
            );

            ultimatePromise.promises = softPromises;
            ultimatePromise.resolve = _ultimateResolve;
            ultimatePromise.reject = _ultimateReject;
            ultimatePromise.label = label;

            // this.addPromise(ultimatePromise, label);
            return this._addOrUpdateUltimatePromise(ultimatePromise);
        };

        allCompleted = (promises = [], config = {}) => {
            const { label, noRejection = true } = config;

            //ultimately-resolves upon completion of ALL provided promises (whether resolved or rejected - completion of any kind)
            // this is achieved by the default config.noRejections === true. You can pass a value of false to stop execution upon first rejection, similar to Promise.prototyp.all()
            // NOTE #1: chaining a .then() to a promise prior to passing it to allCompleted, will cause allCompleted to receive a regular Promise object and not an UltimatePromise (which includes properties such as manual resolve() & reject(), result and label).
            // NOTE #2: Chain a callback to an individual Promise without losing the UltimatePromise instance by calling the equivalent ultimatePromise.andThen(callback) :)
            //NOTE: chaining .catch to one of the promises will return a regualr Promise object instead of an UltimatePromise, which means that it will lose its label and custom resolve() and reject() RC methods.
            // Instead, you should chain an individual .catch() to the promise AFTER you passed it to allCompleted
            // wrap all the promise triggering in a single try-catch statement and handle errors there

            /*  //example usage:
                try { 
                const firstPromise = promiseKeeper
                .stall(500, "first promise")
                .andThen(resolvedVal => {
                    logg("firstPromise resolvedVal: ", resolvedVal); //{ms:500, label: "first promise"
                });

                const secondPromise = promiseKeeper
                .stall(3000, "second promise")
                .andThen(val => {
                     logg("secondPromise resolvedVal: ", resolvedVal); //{ms:3000, label: "second promise"
                });

                const secondPromiseCanceller = promiseKeeper
                .stall(2000, "canceller")
                .andThen(val => {
                     logg("secondPromiseCanceller resolvedVal: ", resolvedVal); //{ms:500, label: "secondPromiseCanceller"
                });

                const thirdPromise = promiseKeeper
                .stall(2000, "third promise")
                .andThen(val => {
                     logg("thirdPromise resolvedVal: ", resolvedVal); //{ms:2000, label: "third promise"
                });

                promiseKeeper
                .allCompleted([firstPromise, secondPromise, thirdPromise], {
                    label: "all three have completed"
                })
                .andThen(res => {
                    logg(
                        "promiseKeeper.allCompleted ultimately resolved!",
                        res
                    );
                });

        } catch (err) {
            console.error(err.message);
        }
                
            */

            //label of the wrapping, final ultimate promise

            //turn the provided Promises (hence forth: "keptPromises") into remote-controlled Promises that don't reject, only resolve, so that the ultimate process won't stop prior to the completion of ALL of the passed promises

            const softPromises = promises.map((promise, i) => {
                return this.withRC(promise, {
                    noRejection,
                    label: promise.label,
                });
            });

            const ultimateFinishers = {
                ultimateResolve: undefined,
                ultimateReject: undefined,
            };

            let _ultimateResolve;
            let _ultimateReject;
            const finalUltimatePromise = this.withRC(
                new Promise(async (ultimateResolve, ultimateReject) => {
                    ultimateFinishers.ultimateResolve = ultimateResolve;
                    ultimateFinishers.ultimateReject = ultimateReject;
                    await Promise.all(softPromises);

                    //check the result (resolve/reject) of the underlying, original promises
                    let atLeastOneResolved = false;

                    const results = softPromises.map((softPromise, j) => {
                        const {
                            originalPromise,
                            label = "no_label",
                        } = softPromise;

                        const {
                            resolved,
                            rejected,
                            completed,
                            result,
                        } = originalPromise;

                        if (!atLeastOneResolved) {
                            atLeastOneResolved = result.resolved;
                        }
                        return { label, result };
                    });

                    logg(
                        this.logLabel +
                            ` completeAll() finished. ${
                                atLeastOneResolved
                                    ? "at least one actually resolved!"
                                    : "Not a single promise was actually resolved. All were either rejected or somehow managed to complete without resolving or rejecting. "
                            }`,
                        results
                    );

                    if (noRejection) {
                        return ultimateResolve(results);
                    }
                    if (atLeastOneResolved) {
                        return ultimateResolve(results);
                    }

                    return ultimateReject(results);
                }),
                { label }
            );

            Object.assign(finalUltimatePromise, config);

            finalUltimatePromise.keptPromises = softPromises;
            finalUltimatePromise.resolve = ultimateFinishers.ultimateResolve;
            finalUltimatePromise.reject = ultimateFinishers.ultimateReject;

            this._addOrUpdateUltimatePromise(finalUltimatePromise);

            // this.addPromise(finalUltimatePromise, label);

            return finalUltimatePromise;
        };
    }
    return { PromiseKeeper };
})(); //

const { PromiseKeeper } = timing;
const promiseKeeper = new PromiseKeeper({ label: "issy" });

const shuffleOnce = (arr = []) => {
    //start after the last item
    const arrClone = arr.slice(0);
    let needleIndex = arrClone.length; //start from the end

    // Go back (almost) all the way to the start
    while (needleIndex > 0) {
        // Pick a random index, smaller than the current index
        let index = Math.floor(Math.random() * needleIndex);

        // Decrease it by 1
        needleIndex--;

        // And swap the item at the random index, with the one we started with
        let temp = arrClone[needleIndex];
        arrClone[needleIndex] = arrClone[index];
        arrClone[index] = temp;
    }

    return arrClone;
};

const shuffle = (arr = [], numShuffles = 1) => {
    if (!arr) {
        logg(
            "shuffle() : Error! Can't shuffle a non-Array. \nReceived param: ",
            arr
        );
        return null;
    }
    let shuffled;
    for (let i = 0; i < numShuffles; i++) {
        shuffled = shuffleOnce(arr);
    }
    return shuffled;
};
const getLastXItems = (arr = [], x = 6) => {
    const minusX = parseInt("-" + x);
    return arr.slice(minusX);
};

const toTime = (dateString) => {
    const sliced = dateString.slice(-8, dateString.length - 3);
    return sliced;
};

const getFormattedTime = (date) => {
    // logg("typeof dateObj === " + Object.prototype.toString.call(dateObj));
    let dateObj;
    if (our(date).is.aDate) {
        dateObj = date;
    } else if (our(date).is.aNumber) {
        try {
            dateObj = date.parse();
        } catch (err) {
            logg(err);
        }
    } else {
        logg("Not a valid date format");
        return null;
    }

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    // const seconds = dateObj.getSeconds();
    const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
        minutes < 10 ? "0" : ""
    }${minutes}`;
    return formattedTime;
};

// winDough
// ===================================

//Scroll enable & disable
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

const ScrollControl = {
    enableScroll() {
        if (window.removeEventListener)
            window.removeEventListener("DOMMouseScroll", preventDefault, false);
        // window.onmousewheel = document.onmousewheel = null;
        // window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
        logg("ScrollControl: Scrolling is now ENabled.");
    },
    disableScroll() {
        if (window.addEventListener)
            // older FF
            window.addEventListener("DOMMouseScroll", preventDefault, false);
        // window.onwheel = preventDefault; // modern standard
        // window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
        window.ontouchmove = preventDefault; // mobile
        document.onkeydown = preventDefaultForScrollKeys;
        logg("ScrollControl: Scrolling is now DISabled.");
    },
};

const copyToClipboard = (text, printMsg = true) => {
    //Check browser support prior to using this function in prodution environment
    navigator.clipboard
        .writeText(text)
        .then(() => printMsg && logg(`copyToClipboard(): Copied "${text}"`))
        .catch((err) =>
            logg(
                "copyToClipboard(): Error: could NOT copy the following text: ",
                text
            )
        );
};

const isInViewport = (elem) => {
    const rect = elem.getBoundingClientRect();
    const isIn =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
            (window.innerHeight ||
                document.documentElement
                    .clientHeight) /*or $(window).height() */ &&
        rect.right <=
            (window.innerWidth ||
                document.documentElement.clientWidth); /*or $(window).width() */
    logg(
        `isInViewport() DOM element ${elem.nodeName} is ${
            isIn ? "" : "not "
        }inside the visible Viewport.`
    );

    return isIn;
};

const scrollTo = (domRef, config = {}) => {
    try {
        if (!domRef) {
            throw new Error(`missing paramter "domRef"`);
        }
        if (!domRef.scrollIntoView) {
            //maybe a ref object was passed (i.e. {current: domRef})
            domRef = domRef.current;
        }
        if (!domRef.scrollIntoView) {
            //not a DOM a ref, or scrollIntoView is not supported in current environment
            throw new Error(
                `domRef does not contain a property named scrollIntoView`
            );
        }
        domRef.scrollIntoView({
            block: config.block || "end",
            behavior: (config.block && config.block.behavior) || "smooth",
        });
    } catch (err) {
        logg(`scrollTo(${domRef}): `, err.message);
        return null;
    }
};

const pollyfills = {
    requestAnimationFrame: () => {
        let requestFunction = window.requestAnimationFrame;
        let vendorCancel = window.cancelAnimationFrame;

        if (!requestFunction) {
            const vendors = ["ms", "moz", "webkit", "o"];
            for (let x = 0; x < vendors.length && !requestFunction; ++x) {
                requestFunction = window[vendors[x] + "RequestAnimationFrame"];
                vendorCancel = window.cancelAnimationFrame =
                    window[vendors[x] + "CancelAnimationFrame"] ||
                    window[vendors[x] + "CancelRequestAnimationFrame"];
            }
        }

        if (!requestFunction) {
            logg(
                "shimme(): window.requestAnimationFrame is not availble in current environemnt (browser / Node.js). Timeouts will be used in its place."
            );
            let lastTime = 0;
            const fallback = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
            requestFunction = fallback;
        }

        window.requestAnimationFrame = requestFunction;
        window.cancelAnimationFrame = vendorCancel;
        return true;
    },
};

const shimme = (functionName = "requestAnimationFrame") => {
    if (pollyfills[functionName]) {
        return pollyfills[functionName]();
    } else {
        debugger;
        return null;
    }
};

const loadImage = (url = "", domElement) => {
    return new Promise((resolve, reject) => {
        if (!url) return reject("no URL");
        const imgNode = domElement ? domElement : document.body;
        const image = new Image(0, 0); //invisible (still forces to load the image)
        image.style.opacity = 0; //just to be extra sure
        //image.classList.add("hidden");
        image.onload = (ev) => {
            if (!image.decode) {
                //older versions of FireFox don't support decode()
                logg(
                    "Image.decode() is not supported in browser (older Firefox?)"
                );
                return resolve({ unsupported: true });
            }
            image.decode().then(() => {
                logg(
                    `loadImage(): image ${url} is loaded & decoded, ready to be inserted to the DOM.`
                );
                promiseKeeper
                    .stall(100, "loadImage() removes loaded image")
                    .then(() => {
                        if (!image.parentNode) {
                            debugger;
                            logg("Could not remove image-fetching img node");
                            return null;
                        }
                        imgNode.removeChild(image);
                    });
                return resolve(url);
            });
        };
        image.src = url;
        imgNode.appendChild(image);
    });
};

const removeDoubleSlashes = (path = "") => {
    const result = path.replace(/\/\//gi, "/");
    return result;
};

const navigateTo = (path, history, callback = emptyFunc) => {
    try {
        if (!path || !history || (!history.length && history.length !== 0)) {
            throw new Error(`missing parameter path and / or history`);
        }
        const completePath = removeDoubleSlashes(path);
        logg(`Navigating to: ${completePath}`);
        history.push({
            pathname: completePath,
            //state: { linkedScreen: completePath }
        });
        if (callback) callback(path);
    } catch (err) {
        loggError(err.message);
        return null;
    }
};

var pwa = (() => {
    const addToHomescreen = () => {
        let deferredPrompt;
        window.addEventListener("beforeinstallprompt", (e) => {
            logg("addToHomescreen(): beforeinstallprompt event");
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt = e;
            // Update UI to notify the user that she can add the app to the device's home screen
            const addToHomescreenBtn = document.querySelector("#root");
            logg('addToHomescreen(): Adding the class "snackbar-in" to #root');
            addToHomescreen.classList.add("snackbar-in");
            addToHomescreenBtn.addEventListener(
                "click",
                (ev) => {
                    //ev.preventDefault();
                    ev.stopPropagation();
                    //handle the event here

                    logg("addToHomescreen(): addToHomescreenBtn clicked");

                    deferredPrompt.prompt();
                    // Wait for the user to respond to the prompt
                    deferredPrompt.userChoice.then((choiceResult) => {
                        console("this === ", this);
                        this.classList.remove("snackbar-in");
                        addToHomescreen.classList.remove("snackbar-in");
                        const logMsg = `User ${
                            choiceResult.outcome === "accepted"
                                ? "accepted"
                                : "dismissed"
                        } the A2HS prompt`;
                        logg("addToHomescreen(): ", logMsg);
                        deferredPrompt = null;
                    });
                    //document.getElementById('add-to-homescreen').removeEventListener('click', clickHandler, false);
                },
                false
            ); // handleClick()
        });
    };
    return {
        addToHomescreen,
    };
})(); //pwaUtils self-executing Closure

//keyboard input
const keyEventHandlers = {};

// const defaultCallback = (keyEvent, registeredKeyEventHandler) => {
//     const { eventType, key } = keyEvent;
//     logg(
//         `Event "${eventType}" was triggered by the "${keyEvent.key}" key.`,
//         keyEvent,
//         registeredKeyEventHandler
//     );
// };

// const registerKey = (config = {}) => {
//     const { key = "", on = "keyup", callback = defaultCallback } = config;
//     if (!key || !on || !callback || isNot(callback).aFunction) {
//         logg("registerKey(): Missing parameter arguments!");
//         return null;
//     }

//     //The event.which property normalizes event.keyCode and event.charCode. It is recommended to watch event.which for keyboard key input.
//     //In a keypress event, the Unicode value of the key pressed is stored in either the keyCode or charCode property, never both. If the key pressed generates a character (e.g. 'a'), charCode is set to the code of that character, respecting the letter case. (i.e. charCode takes into account whether the shift key is held down). Otherwise, the code of the pressed key is stored in keyCode.
//     //for some problematic keys that don't have consistent implementation across browsers, we'll use their keyCode instead of their normal `key` name property
//     let keyToRegisterCode;
//     const _keyToRegister = key.toLowerCase();
//     switch (_keyToRegister) {
//         case "spacebar":
//             keyToRegisterCode = 32;
//             break;
//         case "enter":
//             keyToRegisterCode = 13;
//             break;
//         default:
//             keyToRegisterCode = -1;
//             break;
//     }

//     const _evenType = on.toLowerCase();
//     const _key = key.toLowerCase();

//     if (!keyEventHandlers[_evenType]) {
//         //first handler for the given event type. create a new entry
//         keyEventHandlers[_evenType] = {};
//     }
//     logg(
//         `Registering "on${on}" event handler for the "${key}" key. All registered key event handlers: `,
//         keyEventHandlers
//     );
//     keyEventHandlers[_evenType][_key] = callback;

//     //attach an event listener that will invoke the relevant registered callbacks
//     document.body["on" + _evenType] = function(ev) {
//         const eventType = ev.type;
//         const pressedKey = ev.key;
//         const _pressedKey = pressedKey.toLowerCase();

//         const handlers = keyEventHandlers[_evenType];
//         for (let [key, value] of Object.entries(handlers)) {
//             if (
//                 _pressedKey === key ||
//                 ev.keyCode === keyToRegisterCode ||
//                 ev.charCode === keyToRegisterCode ||
//                 ev.which === keyToRegisterCode
//             ) {
//                 handlers[key]({ key: pressedKey, eventType }, keyEventHandlers);
//             }
//         }
//     };
// };
const defaultKeyCallback = ({ key, on }) => {
    console.log(`The "${key}" key has just fired an "on${on}" event.`);
};
const handlePress = (
    {
        key = " ",
        keyCode = "",
        charCode = "",
        on = "keyup",
        preventDefault = false,
    },
    callback
) => {
    callback = is(callback).aFunction ? callback : defaultKeyCallback;
    on = on.toLowerCase();
    key = key.toLowerCase();
    if (!keyEventHandlers[on]) {
        keyEventHandlers[on] = {};
    }
    //add the provided callback to the store
    //e.g. : {keyup: {{enter:  fn}, {KeyDown: fn2}}}
    keyEventHandlers[on][key] = callback;

    document.body["on" + on] = (ev) => {
        try {
            if (preventDefault) ev.preventDefault(); //TODO: fix. doesn't actually prevents it
            const handlers = keyEventHandlers[on];

            //iterate over the previously-registered handlers for the event (e.g.: "keydown"). Look for a handler that has  "key" property (e.g.: key==="enter") that matches the "key" property of the native event. If such handler is found, trigger its callback.
            for (let [_key, callback] of Object.entries(handlers)) {
                if (!_key || !_key.toLowerCase) {
                    throw new Error(`key of a handler is not a string`);
                }

                if (!ev.key || !ev.key.toLowerCase) {
                    //Native event does not have a "key" property. It's probably not a KeyEvent
                    return false;
                }

                if (_key.toLowerCase() === ev.key.toLowerCase()) {
                    //bingo
                    callback({
                        on,
                        key: ev.key,
                        keyCode: ev.keyCode,
                        charCode: ev.charCode,
                    });
                }
            }
        } catch (err) {
            loggError(err.message);
        }
    };
    logg("Added key binding: ", keyEventHandlers);
};
const removePressHandlers = (eventType = "onkeyup") => {
    try {
        document.body[eventType] = null;
        logg(`unRegistered the "on${eventType}" event for all keys.`);
    } catch (err) {
        loggError(err.message);
    }
};
/* //Example usage:
  onKeyPress({ key: " " }, () => {
        console.log("space bar was pressed!!");
    });
*/

//String manipulation
const capitalizeFirstLetter = (str = "", config = {}) => {
    if (!str) return null;
    if (!is(str).aString) {
        throw new Error(`str is not a string!`);
    }
    const firstLetter = str[0].toUpperCase();
    const rest = str.slice(1);
    const finalRest = config.lowerCaseRest ? rest : rest.toLowerCase();
    return firstLetter + finalRest;
};

const capitalizeTitle = (str = "", config = {}) => {
    if (!str) return "";
    if (!is(str).aString) {
        throw new Error(`str is not a string!`);
    }
    const words = str.split(" ");
    const capitalizedWords = words.map((word) => {
        return capitalizeFirstLetter(word);
    });

    return capitalizedWords.join(" ");
};

//easy api for accessing and setting browser's localStorage
class LocalStorage {
    get(key = "") {
        if (!key) return null;
        const rawString = window.localStorage.getItem(key);
        return rawString;
    }
    getObj(key = "") {
        const str = this.get(key);
        if (!str) return null;
        const obj = JSON.parse(str);
        return obj;
    }
    getArray(key = "") {
        //JSON.parse is good with arrays, too
        const canAccessOtherMethods = this.getObj(key);
        return canAccessOtherMethods;
    }
    set(key = "", val = "") {
        if (!key) return null;
        window.localStorage.setItem(key, val);
    }
    setObj(key = "", val = {}) {
        if (!key) return null;
        this.set(key, JSON.stringify(val));
    }
    setArray(key = "", val = []) {
        if (!key) return null;
        //see comment above
        this.set(key, JSON.stringify(val));
    }
}
const localStorage = new LocalStorage();

//create hash string
const getUniqueString = (numChars = 10) => {
    let rand = Math.random()
        .toString(36)
        .slice(2, numChars);
    return "_" + rand;
};

const IssyLoop = (function() {
    class Looper {
        constructor(array = []) {
            if (!array) return null;
            //gets called by goOver
            //save a reference to the array argument for later use by looper.do()
            this.array = array;
        }
        do = (callback) => {
            if (!callback) return null;
            const _arr = this.array;
            _arr.forEach((item, i) => {
                callback(item, i, _arr);
            });
        };
    }
    const convertToArray = (collection) => {
        if (our(collection).is.anArray) return collection;
        let asArray;
        try {
            asArray = [...collection];
        } catch (err) {
            logg("convertToArray(): ", err);
            return null;
        }
        if (!asArray) return null;
        return asArray;
    };
    const goOver = (arr) => {
        //accepting only Array and Array-like objects (such as NodeList)
        let _arr = convertToArray(arr);
        return new Looper(_arr ? _arr : []);
        //e.g.:
        // goOver(items).do((item, i, _arr)=>console.log(item));
    };
    const forAll = (items, callback) => {
        //accepting only Array and Array-like objects (such as NodeList)
        let _arr = convertToArray(items);
        new Looper(_arr).do(callback);
        //e.g.:
        // forAll(items, (item, i, _arr)=>console.log(item));
    };
    return { forAll, goOver };
})(); //Looper self-executing Closure

const { forAll, goOver } = IssyLoop;

// DOM traversing
const findAncestor = (config = {}) => {
    const { domNode, styleAttribute = "", value } = config;
    if (!domNode || !is(domNode).anObject || !styleAttribute) return null;
    const maxIterations = 100;
    let isFound = false;
    let numIterations = 0;
    let ancestor = domNode.parentNode;
    try {
        do {
            numIterations++;
            if (!ancestor) break;
            const currentStyles = getComputedStyle(ancestor);
            isFound = currentStyles[styleAttribute] === value;
            if (isFound) break;
            ancestor = ancestor.parentNode;
        } while (!isFound && numIterations < maxIterations);
    } catch (err) {
        logg(err);
    }
    return isFound ? ancestor : false;
};

class DomClimberError {
    constructor(config = {}) {
        const { missingParam } = config;
        this.msg = `invalid "${missingParam}" argument.`;
    }
}

class DOMClimber {
    constructor(domElem) {
        // if (!domElem || !(domElem instanceof HTMLElement))
        //     return new DomClimberError({ missingParam: "domElem" });

        this.offsetElem = domElem;
    }
    upTo = (config = {}) => {
        if (!config || !is(config).anObject) {
            return new DomClimberError({
                missingParam: "config (first parameter)",
            });
        }
        const { attr, className = "" } = config;
        if (!className && (!attr || !is(attr).anObject)) {
            return new DomClimberError({
                missingParam: "any config value (attr, className..",
            });
        }

        const { maxIterations } = config;
        const _maxIterations =
            maxIterations && is(maxIterations).aNumber ? maxIterations : 100;

        //here is the juicy part
        let isFound = false;
        let numIterations = 0;
        let ancestor = this.offsetElem; //start from the provided elem itself.
        try {
            do {
                numIterations++;
                if (!ancestor) break;

                let hasDifferentVal = false;

                if (attr) {
                    //go over the required attributes and look for an ancestor DOM element that contains all of them, with the same values as the required ones
                    for (let [attrName, attrValue] of Object.entries(attr)) {
                        const ancestorAttrValue = ancestor.getAttribute(
                            attrName
                        );
                        if (ancestorAttrValue !== attrValue) {
                            hasDifferentVal = true;
                            //it's not this element, so...
                            break;
                        }
                    }
                }

                if (!hasDifferentVal && className) {
                    const hasClass = ancestor.classList.contains(className);
                    if (!hasClass) {
                        hasDifferentVal = true;
                    }
                }

                if (hasDifferentVal) {
                    //encestor was NOT FOUND. climb up another level
                    ancestor = ancestor.parentNode;
                    continue;
                } else {
                    // all specified requirement have been met! We found the one!
                    isFound = true;
                    break;
                }
            } while (!isFound && numIterations < _maxIterations);
        } catch (err) {
            logg(err);
        }
        return isFound ? ancestor : false;
    };
}

const climbFrom = (domElem) => {
    // if (!domElem || !(domElem instanceof HTMLElement))
    //     return new DomClimberError({ missingParam: "domElem" });
    return new DOMClimber(domElem);
};

const getCurrentFromRef = (elemOrRef) => {
    if (!elemOrRef || !is(elemOrRef).anObject) return null;
    if (elemOrRef.current && elemOrRef.current.style) {
        return elemOrRef.current;
    }

    if (elemOrRef.style) {
        return elemOrRef;
    }

    return null;
};

// dynamic DOM element positioning
const alignElements = ({ movingElem = {}, targetElem = {}, top = 0 }) => {
    try {
        const _movingElem = getCurrentFromRef(movingElem);
        if (!_movingElem)
            throw new Error(`Missing or bad argument: movingElem`);
        const _targetElem = getCurrentFromRef(targetElem);
        if (!_targetElem)
            throw new Error(`Missing or bad argument: targetElem`);

        const movingElemStyle = _movingElem.style;
        if (!movingElemStyle)
            throw new Error(`movingElem does not have a style property`);
        const targetBox = _targetElem.getBoundingClientRect();
        const movingBox = _movingElem.getBoundingClientRect();

        if (top) {
            movingElemStyle.top = targetBox.top + top + "px";
        }
    } catch (err) {
        loggError(err);
        return null;
    }

    // Note: elem.getBoundingClientRect().top !== elem.style.top
    //the first is relative to the viewport (i.e. the window in its current scrolling position) while the second is relative to the nearest parent element with a position of "relative". This means that if the moving element is inside a relative-positioned element that starts from below the top of the viewport, than
    // elem.getBoundingClientRect().top > elem.style.top
    // to get around this, you can:
    //give the moving element a position of "absolute" or "fixed" and make sure that it doesn't have any "realtive"-positioned parents that get in the way all the until the edge of the viewport. ORRRR... :)

    // Simply pass in
    /*
            {offsetProp: "top", 
            extraPadding: 56, 
            movingElem: ..., targetElem: ...}
        */

    //This will align the moving element to the top of the target element, by removing the interfering appbar (56px) that is above the moving element.
};

//AJAX
const handleBadResponse = (res, uri) => {
    if (!res || res.status === 404 || !res.ok) {
        throw new Error(`404: route ${uri} was not found`);
    }
    if (!res.json) {
        throw new Error(
            `Response object doesn't have a .json() method. The server is probably not an Express one (res.json is an Express method).`
        );
    }
};
const handleBadData = (data, uri) => {
    if (data.code === 404 || data.notFound)
        throw new Error(`404: route ${uri} not found`);
};

const request = async (method = "GET", uri = "", payload = {}, config = {}) => {
    //make an AJAX request and either catch errors or parse the received response
    if (!uri) {
        throw new Error(`missing parameter "uri"`);
    }
    method = method ? method.toUpperCase() : "GET";
    if (["POST", "PUT", "DELETE"].includes(method) && !is(payload).anObject) {
        throw new Error("payload should be an object! Instead got: ", payload);
    }

    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    if (config && config.headers) {
        Object.assign(headers, config.headers);
    }

    let parsedResponse;
    try {
        let res;
        if (method === "GET") {
            let uriWithQueryParams = uri;
            if (payload) {
                let queryParams = "?";
                for (let [key, value] of Object.entries(payload)) {
                    if (queryParams.length > 1) {
                        //this is the second or latter query param
                        queryParams = queryParams.concat("&");
                    }
                    queryParams = queryParams.concat(`${key}=${value}`);
                }
                queryParams = queryParams.replace(/\"/gi, "");
                queryParams = queryParams.replace(/\'/gi, "");
                const containsQuotes = queryParams.indexOf("'") > -1;
                queryParams = queryParams.replace(/\"/gi, "");
                const containsDQuotes = queryParams.indexOf('"') > -1;

                uriWithQueryParams = uriWithQueryParams.concat(queryParams);
            }

            res = await fetch(uriWithQueryParams, { headers });
        } else {
            res = await fetch(uri, {
                method,
                headers,
                body: JSON.stringify(payload),
            });
        }

        if (!res || res.status === 404) {
            throw new Error(`404: URI ${uri} was not found`);
        }

        if (!res.ok) {
            const problem = await res.json();
            loggError(problem.error || problem);
            throw new Error(`bad response from URI ${uri}`, problem.error);
        }
        if (!res.json) {
            throw new Error(
                `Response object doesn't have a .json() method. The server is probably not an Express one (res.json is an Express method).`
            );
        }

        parsedResponse = await res.json();
        if (parsedResponse.code === 404 || parsedResponse.notFound) {
            throw new Error(
                `AJAX request result ::: 404: route "${uri}" was not found within the addressed server.`
            );
        }

        //proper response was received!
        return parsedResponse;
    } catch (err) {
        const ajaxResult = {
            error: err,
            response: parsedResponse,
        };

        logg(ajaxResult);
        const throwOnError = config.throwOnError || false;
        if (throwOnError) {
            throw new Error(err);
        } else {
            return ajaxResult;
        }
    }
};

//fallbacks
const emptyFunc = () => {};

const getRandomColor = (alpha = "1") => {
    //***returns an rgba color string, e.g. :"rgba(20,200,255,0.5)"
    const rgb = [
        getRandomUpTo(255, 2),
        getRandomUpTo(255, 2),
        getRandomUpTo(255, 3),
    ];
    alpha =
        alpha || alpha === 0
            ? alpha
            : (Math.random(1) + 0.1).toString().slice(0, 3);
    if (alpha === "0.0") alpha = "0";
    const rgba = `rgba(${rgb.join(", ")}, ${alpha})`;
    return rgba;
};

const asyncForEach = async (array, callback) => {
    //iterate syncly over an array, awaiting the complettion of an async callback for each item in the array
    for (let index = 0; index < array.length; index++) {
        //fire the callback with the arguments that a regular forEach function expects: [item, index, originalArray]
        await callback(array[index], index, array);
    }
};

const setDomProperty = (config = {}) => {
    try {
        if (!is(config).anObject) {
            throw new Error(
                "setDomProperty was called without a config object"
            );
        }
        const {
            domElem = document.documentElement, //i.e. <html> tag
            propertyName = "",
            value = "",
            cssVar = "",
        } = config;
        if (
            !value ||
            !is(value).aString ||
            ((!propertyName || !is(propertyName).aString) &&
                (!cssVar || !is(cssVar).aString))
        ) {
            throw new Error("bad or missing config arguments");
        }
        const _propertyName = cssVar ? `--${cssVar}` : propertyName;
        domElem.style.setProperty(_propertyName, value);
        return { propertyName: _propertyName, value, domElem, success: true };
    } catch (err) {
        loggError(err.message);
        return null;
    }
};

export default is;
export {
    is,
    isNot,
    our,
    getRandomUpTo,
    getIntBetween,
    pickRandomFrom,
    PromiseKeeper,
    shuffle,
    getLastXItems,
    getFormattedTime,
    toTime,
    ScrollControl,
    copyToClipboard,
    isInViewport,
    scrollTo,
    shimme,
    loadImage,
    navigateTo,
    pwa,
    capitalizeFirstLetter,
    capitalizeTitle,
    localStorage,
    getUniqueString,
    forAll,
    goOver,
    handlePress,
    removePressHandlers,
    findAncestor,
    alignElements,
    request,
    DOMClimber,
    climbFrom,
    emptyFunc,
    getRandomColor,
    asyncForEach,
    sanitizeVarName,
    setDomProperty,
};
