/*
 * Metro 4 Components Library 4.4.3  (https://metroui.org.ua)
 * Copyright 2012-2021 by Serhii Pimenov (https://pimenov.com.ua). All rights reserved.
 * Built at 12/09/2021 08:54:35
 * Licensed under MIT
 */



/*
 * m4q v1.0.10, (https://github.com/olton/m4q.git)
 * Copyright 2018 - 2020 by Sergey Pimenov
 * Helper for DOM manipulation, animation, and ajax routines.
 * Licensed under MIT
 */

 (function (global, undefined) {

// Source: src/mode.js

/* jshint -W097 */
'use strict';

// Source: src/func.js

/* global dataSet */
/* exported isTouch, isSimple, isHidden, isPlainObject, isEmptyObject, isArrayLike, str2arr, parseUnit, getUnit, setStyleProp, acceptData, dataAttr, normName, strip, dashedName, isLocalhost */

var numProps = ['opacity', 'zIndex'];

function isSimple(v){
    return typeof v === "string" || typeof v === "boolean" || typeof v === "number";
}

function isVisible(elem) {
    return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
}

function isHidden(elem) {
    var s = getComputedStyle(elem);
    return !isVisible(elem) || +s.opacity === 0 || elem.hidden || s.visibility === "hidden";
}

function not(value){
    return value === undefined || value === null;
}

function camelCase(string){
    return string.replace( /-([a-z])/g, function(all, letter){
        return letter.toUpperCase();
    });
}

function dashedName(str){
    return str.replace(/([A-Z])/g, function(u) { return "-" + u.toLowerCase(); });
}

function isPlainObject( obj ) {
    var proto;
    if ( !obj || Object.prototype.toString.call( obj ) !== "[object Object]" ) {
        return false;
    }
    proto = obj.prototype !== undefined;
    if ( !proto ) {
        return true;
    }
    return proto.constructor && typeof proto.constructor === "function";
}

function isEmptyObject( obj ) {
    for (var name in obj ) {
        if (hasProp(obj, name)) return false;
    }
    return true;
}

function isArrayLike (o){
    return o instanceof Object && 'length' in o;
}

function str2arr (str, sep) {
    sep = sep || " ";
    return str.split(sep).map(function(el){
        return  (""+el).trim();
    }).filter(function(el){
        return el !== "";
    });
}

function parseUnit(str, out) {
    if (!out) out = [ 0, '' ];
    str = String(str);
    out[0] = parseFloat(str);
    out[1] = str.match(/[\d.\-+]*\s*(.*)/)[1] || '';
    return out;
}

function getUnit(val, und){
    var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
    return typeof split[1] !== "undefined" ? split[1] : und;
}

function setStyleProp(el, key, val){
    key = camelCase(key);

    if (["scrollLeft", "scrollTop"].indexOf(key) > -1) {
        el[key] = (parseInt(val));
    } else {
        el.style[key] = isNaN(val) || numProps.indexOf(""+key) > -1 ? val : val + 'px';
    }
}

function acceptData(owner){
    return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
}

function getData(data){
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
}

function dataAttr(elem, key, data){
    var name;

    if ( not(data) && elem.nodeType === 1 ) {
        name = "data-" + key.replace( /[A-Z]/g, "-$&" ).toLowerCase();
        data = elem.getAttribute( name );

        if ( typeof data === "string" ) {
            data = getData( data );
            dataSet.set( elem, key, data );
        } else {
            data = undefined;
        }
    }
    return data;
}

function normName(name) {
    return typeof name !== "string" ? undefined : name.replace(/-/g, "").toLowerCase();
}

function strip(name, what) {
    return typeof name !== "string" ? undefined : name.replace(what, "");
}

function hasProp(obj, prop){
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isLocalhost(host){
    var hostname = host || window.location.hostname;
    return (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "[::1]" ||
        hostname === "" ||
        hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) !== null
    );
}

function isTouch() {
    return (('ontouchstart' in window)
        || (navigator.maxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
}

// Source: src/setimmediate.js

/* global global */
/*
 * setImmediate polyfill
 * Version 1.0.5
 * Url: https://github.com/YuzuJS/setImmediate
 * Copyright (c) 2016 Yuzu (https://github.com/YuzuJS)
 * Licensed under MIT
 */
(function (global) {

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1;
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var registerImmediate;

    function setImmediate(callback) {
        if (typeof callback !== "function") {
            /* jshint -W054 */
            callback = new Function("" + callback);
        }
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i + 1];
        }
        tasksByHandle[nextHandle] = { callback: callback, args: args };
        registerImmediate(nextHandle);
        return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
        }
    }

    function runIfPresent(handle) {
        if (currentlyRunningATask) {
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    // global.process
    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            global.process.nextTick(function () { runIfPresent(handle); });
        };
    }

    // web workers
    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    // Browsers
    function installPostMessageImplementation() {
        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        global.addEventListener("message", onGlobalMessage, false);

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    if ({}.toString.call(global.process) === "[object process]") {

        installNextTickImplementation();

    } else if (global.MessageChannel) {

        installMessageChannelImplementation();

    } else {

        installPostMessageImplementation();

    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;

}(typeof self === "undefined" ? typeof global === "undefined" ? window : global : self));

// Source: src/promise.js

/* global setImmediate */

/*
 * Promise polyfill
 * Version 1.2.0
 * Url: https://github.com/lahmatiy/es6-promise-polyfill
 * Copyright (c) 2014 Roman Dvornov
 * Licensed under MIT
 */
(function (global) {

    if (global.Promise) {
        return;
    }

    // console.log("Promise polyfill v1.2.0");

    var PENDING = 'pending';
    var SEALED = 'sealed';
    var FULFILLED = 'fulfilled';
    var REJECTED = 'rejected';
    var NOOP = function(){};

    function isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }

    // async calls
    var asyncSetTimer = typeof setImmediate !== 'undefined' ? setImmediate : setTimeout;
    var asyncQueue = [];
    var asyncTimer;

    function asyncFlush(){
        // run promise callbacks
        for (var i = 0; i < asyncQueue.length; i++)
            asyncQueue[i][0](asyncQueue[i][1]);

        // reset async asyncQueue
        asyncQueue = [];
        asyncTimer = false;
    }

    function asyncCall(callback, arg){
        asyncQueue.push([callback, arg]);

        if (!asyncTimer)
        {
            asyncTimer = true;
            asyncSetTimer(asyncFlush, 0);
        }
    }

    function invokeResolver(resolver, promise) {
        function resolvePromise(value) {
            resolve(promise, value);
        }

        function rejectPromise(reason) {
            reject(promise, reason);
        }

        try {
            resolver(resolvePromise, rejectPromise);
        } catch(e) {
            rejectPromise(e);
        }
    }

    function invokeCallback(subscriber){
        var owner = subscriber.owner;
        var settled = owner.state_;
        var value = owner.data_;
        var callback = subscriber[settled];
        var promise = subscriber.then;

        if (typeof callback === 'function')
        {
            settled = FULFILLED;
            try {
                value = callback(value);
            } catch(e) {
                reject(promise, e);
            }
        }

        if (!handleThenable(promise, value))
        {
            if (settled === FULFILLED)
                resolve(promise, value);

            if (settled === REJECTED)
                reject(promise, value);
        }
    }

    function handleThenable(promise, value) {
        var resolved;

        try {
            if (promise === value)
                throw new TypeError('A promises callback cannot return that same promise.');

            if (value && (typeof value === 'function' || typeof value === 'object'))
            {
                var then = value.then;  // then should be retrived only once

                if (typeof then === 'function')
                {
                    then.call(value, function(val){
                        if (!resolved)
                        {
                            resolved = true;

                            if (value !== val)
                                resolve(promise, val);
                            else
                                fulfill(promise, val);
                        }
                    }, function(reason){
                        if (!resolved)
                        {
                            resolved = true;

                            reject(promise, reason);
                        }
                    });

                    return true;
                }
            }
        } catch (e) {
            if (!resolved)
                reject(promise, e);

            return true;
        }

        return false;
    }

    function resolve(promise, value){
        if (promise === value || !handleThenable(promise, value))
            fulfill(promise, value);
    }

    function fulfill(promise, value){
        if (promise.state_ === PENDING)
        {
            promise.state_ = SEALED;
            promise.data_ = value;

            asyncCall(publishFulfillment, promise);
        }
    }

    function reject(promise, reason){
        if (promise.state_ === PENDING)
        {
            promise.state_ = SEALED;
            promise.data_ = reason;

            asyncCall(publishRejection, promise);
        }
    }

    function publish(promise) {
        var callbacks = promise.then_;
        promise.then_ = undefined;

        for (var i = 0; i < callbacks.length; i++) {
            invokeCallback(callbacks[i]);
        }
    }

    function publishFulfillment(promise){
        promise.state_ = FULFILLED;
        publish(promise);
    }

    function publishRejection(promise){
        promise.state_ = REJECTED;
        publish(promise);
    }

    /**
     * @class
     */
    function Promise(resolver){
        if (typeof resolver !== 'function')
            throw new TypeError('Promise constructor takes a function argument');

        if (!(this instanceof Promise))
            throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');

        this.then_ = [];

        invokeResolver(resolver, this);
    }

    Promise.prototype = {
        constructor: Promise,

        state_: PENDING,
        then_: null,
        data_: undefined,

        then: function(onFulfillment, onRejection){
            var subscriber = {
                owner: this,
                then: new this.constructor(NOOP),
                fulfilled: onFulfillment,
                rejected: onRejection
            };

            if (this.state_ === FULFILLED || this.state_ === REJECTED)
            {
                // already resolved, call callback async
                asyncCall(invokeCallback, subscriber);
            }
            else
            {
                // subscribe
                this.then_.push(subscriber);
            }

            return subscriber.then;
        },

        done: function(onFulfillment){
            return this.then(onFulfillment, null);
        },

        always: function(onAlways){
            return this.then(onAlways, onAlways);
        },

        'catch': function(onRejection) {
            return this.then(null, onRejection);
        }
    };

    Promise.all = function(promises){
        var Class = this;

        if (!isArray(promises))
            throw new TypeError('You must pass an array to Promise.all().');

        return new Class(function(resolve, reject){
            var results = [];
            var remaining = 0;

            function resolver(index){
                remaining++;
                return function(value){
                    results[index] = value;
                    if (!--remaining)
                        resolve(results);
                };
            }

            for (var i = 0, promise; i < promises.length; i++)
            {
                promise = promises[i];

                if (promise && typeof promise.then === 'function')
                    promise.then(resolver(i), reject);
                else
                    results[i] = promise;
            }

            if (!remaining)
                resolve(results);
        });
    };

    Promise.race = function(promises){
        var Class = this;

        if (!isArray(promises))
            throw new TypeError('You must pass an array to Promise.race().');

        return new Class(function(resolve, reject) {
            for (var i = 0, promise; i < promises.length; i++)
            {
                promise = promises[i];

                if (promise && typeof promise.then === 'function')
                    promise.then(resolve, reject);
                else
                    resolve(promise);
            }
        });
    };

    Promise.resolve = function(value){
        var Class = this;

        if (value && typeof value === 'object' && value.constructor === Class)
            return value;

        return new Class(function(resolve){
            resolve(value);
        });
    };

    Promise.reject = function(reason){
        var Class = this;

        return new Class(function(resolve, reject){
            reject(reason);
        });
    };

    if (typeof  global.Promise === "undefined") {
        global.Promise = Promise;
    }
}(window));

// Source: src/core.js

/* global hasProp */

var m4qVersion = "v1.0.10. Built at 08/12/2020 00:01:48";

/* eslint-disable-next-line */
var matches = Element.prototype.matches
    || Element.prototype.matchesSelector
    || Element.prototype.webkitMatchesSelector
    || Element.prototype.mozMatchesSelector
    || Element.prototype.msMatchesSelector
    || Element.prototype.oMatchesSelector;

var $ = function(selector, context){
    return new $.init(selector, context);
};

$.version = m4qVersion;

$.fn = $.prototype = {
    version: m4qVersion,
    constructor: $,
    length: 0,
    uid: "",

    push: [].push,
    sort: [].sort,
    splice: [].splice,
    indexOf: [].indexOf,
    reverse: [].reverse
};

$.extend = $.fn.extend = function(){
    var options, name,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length;

    if ( typeof target !== "object" && typeof target !== "function" ) {
        target = {};
    }

    if ( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {
        if ( ( options = arguments[ i ] ) != null ) {
            for ( name in options ) {
                if (hasProp(options, name))
                    target[ name ] = options[ name ];
            }
        }
    }

    return target;
};

$.assign = function(){
    var options, name,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length;

    if ( typeof target !== "object" && typeof target !== "function" ) {
        target = {};
    }

    if ( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {
        if ( ( options = arguments[ i ] ) != null ) {
            for ( name in options ) {
                if (hasProp(options, name) && options[name] !== undefined)
                    target[ name ] = options[ name ];
            }
        }
    }

    return target;
};

// if (typeof window["hideM4QVersion"] === "undefined") console.info("m4q " + $.version);

// Source: src/interval.js

/* global $ */

var now = function(){
    return Date.now();
};

$.extend({

    intervalId: -1,
    intervalQueue: [],
    intervalTicking: false,
    intervalTickId: null,

    setInterval: function(fn, int){
        var that = this;

        this.intervalId++;

        this.intervalQueue.push({
            id: this.intervalId,
            fn: fn,
            interval: int,
            lastTime: now()
        });

        if (!this.intervalTicking) {
            var tick = function(){
                that.intervalTickId = requestAnimationFrame(tick);
                $.each(that.intervalQueue, function(){
                    var item = this;
                    if (item.interval < 17 || now() - item.lastTime >= item.interval) {
                        item.fn();
                        item.lastTime = now();
                    }
                });
            };
            this.intervalTicking = true;
            tick();
        }

        return this.intervalId;
    },

    clearInterval: function(id){
        for(var i = 0; i < this.intervalQueue.length; i++){
            if (id === this.intervalQueue[i].id) {
                this.intervalQueue.splice(i, 1);
                break;
            }
        }
        if (this.intervalQueue.length === 0) {
            cancelAnimationFrame(this.intervalTickId);
            this.intervalTicking = false;
        }
    },

    setTimeout: function(fn, interval){
        var that = this, id = this.setInterval(function(){
            that.clearInterval(id);
            fn();
        }, interval);

        return id;
    },

    clearTimeout: function(id){
        return this.clearInterval(id);
    }
});

// Source: src/contains.js

/* global $, not, matches, isArrayLike, isVisible */

$.fn.extend({
    index: function(sel){
        var el, _index = -1;

        if (this.length === 0) {
            return _index;
        }

        if (not(sel)) {
            el = this[0];
        } else if (sel instanceof $ && sel.length > 0) {
            el = sel[0];
        } else if (typeof sel === "string") {
            el = $(sel)[0];
        } else {
            el = undefined;
        }

        if (not(el)) {
            return _index;
        }

        if (el && el.parentNode) $.each(el.parentNode.children, function(i){
            if (this === el) {
                _index = i;
            }
        });
        return _index;
    },

    get: function(i){
        if (i === undefined) {
            return this.items();
        }
        return i < 0 ? this[ i + this.length ] : this[ i ];
    },

    eq: function(i){
        return !not(i) && this.length > 0 ? $.extend($(this.get(i)), {_prevObj: this}) : this;
    },

    is: function(s){
        var result = false;

        if (this.length === 0) {
            return false;
        }

        if (s instanceof $) {
            return this.same(s);
        }

        if (s === ":selected") {
            this.each(function(){
                if (this.selected) result = true;
            });
        } else

        if (s === ":checked") {
            this.each(function(){
                if (this.checked) result = true;
            });
        } else

        if (s === ":visible") {
            this.each(function(){
                if (isVisible(this)) result = true;
            });
        } else

        if (s === ":hidden") {
            this.each(function(){
                var styles = getComputedStyle(this);
                if (
                    this.getAttribute('type') === 'hidden'
                        || this.hidden
                        || styles.display === 'none'
                        || styles.visibility === 'hidden'
                        || parseInt(styles.opacity) === 0
                ) result = true;
            });
        } else

        if (typeof  s === "string" && [':selected'].indexOf(s) === -1) {
            this.each(function(){
                if (matches.call(this, s)) {
                    result = true;
                }
            });
        } else

        if (isArrayLike(s)) {
            this.each(function(){
                var el = this;
                $.each(s, function(){
                    var sel = this;
                    if (el === sel) {
                        result = true;
                    }
                });
            });
        } else

        if (typeof s === "object" && s.nodeType === 1) {
            this.each(function(){
                if  (this === s) {
                    result = true;
                }
            });
        }

        return result;
    },

    same: function(o){
        var result = true;

        if (!(o instanceof $)) {
            o = $(o);
        }

        if (this.length !== o.length) return false;

        this.each(function(){
            if (o.items().indexOf(this) === -1) {
                result = false;
            }
        });

        return result;
    },

    last: function(){
        return this.eq(this.length - 1);
    },

    first: function(){
        return this.eq(0);
    },

    odd: function(){
        var result = this.filter(function(el, i){
            return i % 2 === 0;
        });
        return $.extend(result, {_prevObj: this});
    },

    even: function(){
        var result = this.filter(function(el, i){
            return i % 2 !== 0;
        });
        return $.extend(result, {_prevObj: this});
    },

    filter: function(fn){
        if (typeof fn === "string") {
            var sel = fn;
            fn = function(el){
                return matches.call(el, sel);
            };
        }

        return $.extend($.merge($(), [].filter.call(this, fn)), {_prevObj: this});
    },

    find: function(s){
        var res = [], result;

        if (s instanceof $) return s;

        if (this.length === 0) {
            result = this;
        } else {
            this.each(function () {
                var el = this;
                if (typeof el.querySelectorAll === "undefined") {
                    return ;
                }
                res = res.concat([].slice.call(el.querySelectorAll(s)));
            });
            result = $.merge($(), res);
        }

        return $.extend(result, {_prevObj: this});
    },

    contains: function(s){
        return this.find(s).length > 0;
    },

    children: function(s){
        var i, res = [];

        if (s instanceof $) return s;

        this.each(function(){
            var el = this;
            for(i = 0; i < el.children.length; i++) {
                if (el.children[i].nodeType === 1)
                    res.push(el.children[i]);
            }
        });
        res = s ? res.filter(function(el){
            return matches.call(el, s);
        }) : res;

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    parent: function(s){
        var res = [];
        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            if (this.parentNode) {
                if (res.indexOf(this.parentNode) === -1) res.push(this.parentNode);
            }
        });
        res = s ? res.filter(function(el){
            return matches.call(el, s);
        }) : res;

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    parents: function(s){
        var res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            var par = this.parentNode;
            while (par) {
                if (par.nodeType === 1 && res.indexOf(par) === -1) {
                    if (!not(s)) {
                        if (matches.call(par, s)) {
                            res.push(par);
                        }
                    } else {
                        res.push(par);
                    }
                }
                par = par.parentNode;
            }
        });

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    siblings: function(s){
        var res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            var el = this;
            if (el.parentNode) {
                $.each(el.parentNode.children, function(){
                    if (el !== this) res.push(this);
                });
            }
        });

        if (s) {
            res = res.filter(function(el){
                return matches.call(el, s);
            });
        }

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    _siblingAll: function(dir, s){
        var res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            var el = this;
            while (el) {
                el = el[dir];
                if (!el) break;
                res.push(el);
            }
        });

        if (s) {
            res = res.filter(function(el){
                return matches.call(el, s);
            });
        }

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    _sibling: function(dir, s){
        var res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            var el = this[dir];
            if (el && el.nodeType === 1) {
                res.push(el);
            }
        });

        if (s) {
            res = res.filter(function(el){
                return matches.call(el, s);
            });
        }

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    prev: function(s){
        return this._sibling('previousElementSibling', s);
    },

    next: function(s){
        return this._sibling('nextElementSibling', s);
    },

    prevAll: function(s){
        return this._siblingAll('previousElementSibling', s);
    },

    nextAll: function(s){
        return this._siblingAll('nextElementSibling', s);
    },

    closest: function(s){
        var res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        if (!s) {
            return this.parent(s);
        }

        this.each(function(){
            var el = this;
            while (el) {
                if (!el) break;
                if (matches.call(el, s)) {
                    res.push(el);
                    return ;
                }
                el = el.parentElement;
            }
        });

        return $.extend($.merge($(), res.reverse()), {_prevObj: this});
    },

    has: function(selector){
        var res = [];

        if (this.length === 0) {
            return ;
        }

        this.each(function(){
            var el = $(this);
            var child = el.children(selector);
            if (child.length > 0) {
                res.push(this);
            }
        });

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    back: function(to_start){
        var ret;
        if (to_start === true) {
            ret = this._prevObj;
            while (ret) {
                if (!ret._prevObj) break;
                ret = ret._prevObj;
            }
        } else {
            ret = this._prevObj ? this._prevObj : this;
        }
        return ret;
    }
});

// Source: src/script.js

/* global $, not */

function createScript(script){
    var s = document.createElement('script');
    s.type = 'text/javascript';

    if (not(script)) return $(s);

    var _script = $(script)[0];

    if (_script.src) {
        s.src = _script.src;
    } else {
        s.textContent = _script.innerText;
    }

    document.body.appendChild(s);

    if (_script.parentNode) _script.parentNode.removeChild(_script);

    return s;
}

$.extend({
    script: function(el){

        if (not(el)) {
            return createScript();
        }

        var _el = $(el)[0];

        if (_el.tagName && _el.tagName === "SCRIPT") {
            createScript(_el);
        } else $.each($(_el).find("script"), function(){
            createScript(this);
        });
    }
});

$.fn.extend({
    script: function(){
        return this.each(function(){
            $.script(this);
        });
    }
});

// Source: src/prop.js

/* global $, not */

$.fn.extend({
    _prop: function(prop, value){
        if (arguments.length === 1) {
            return this.length === 0 ? undefined : this[0][prop];
        }

        if (not(value)) {
            value = '';
        }

        return this.each(function(){
            var el = this;

            el[prop] = value;

            if (prop === "innerHTML") {
                $.script(el);
            }
        });
    },

    prop: function(prop, value){
        return arguments.length === 1 ? this._prop(prop) : this._prop(prop, typeof value === "undefined" ? "" : value);
    },

    val: function(value){
        if (not(value)) {
            return this.length === 0 ? undefined : this[0].value;
        }

        return this.each(function(){
            var el = $(this);
            if (typeof this.value !== "undefined") {
                this.value = value;
            } else {
                el.html(value);
            }
        });
    },

    html: function(value){
        var that = this, v = [];

        if (arguments.length === 0) {
            return this._prop('innerHTML');
        }

        if (value instanceof $) {
            value.each(function(){
                v.push($(this).outerHTML());
            });
        } else {
            v.push(value);
        }

        that._prop('innerHTML', v.length === 1 && not(v[0]) ? "" : v.join("\n"));

        return this;
    },

    outerHTML: function(){
        return this._prop('outerHTML');
    },

    text: function(value){
        return arguments.length === 0 ? this._prop('textContent') : this._prop('textContent', typeof value === "undefined" ? "" : value);
    },

    innerText: function(value){
        return arguments.length === 0 ? this._prop('innerText') : this._prop('innerText', typeof value === "undefined" ? "" : value);
    },

    empty: function(){
        return this.each(function(){
            if (typeof this.innerHTML !== "undefined") this.innerHTML = "";
        });
    },

    clear: function(){
        return this.empty();
    }
});

// Source: src/each.js

/* global $, isArrayLike, hasProp */

$.each = function(ctx, cb){
    var index = 0;
    if (isArrayLike(ctx)) {
        [].forEach.call(ctx, function(val, key) {
            cb.apply(val, [key, val]);
        });
    } else {
        for(var key in ctx) {
            if (hasProp(ctx, key))
                cb.apply(ctx[key], [key, ctx[key],  index++]);
        }
    }

    return ctx;
};

$.fn.extend({
    each: function(cb){
        return $.each(this, cb);
    }
});


// Source: src/data.js

/* global acceptData, camelCase, $, not, dataAttr, isEmptyObject, hasProp */

/*
 * Data routines
 * Url: https://jquery.com
 * Copyright (c) Copyright JS Foundation and other contributors, https://js.foundation/
 * Licensed under MIT
 */
var Data = function(ns){
    this.expando = "DATASET:UID:" + ns.toUpperCase();
    Data.uid++;
};

Data.uid = -1;

Data.prototype = {
    cache: function(owner){
        var value = owner[this.expando];
        if (!value) {
            value = {};
            if (acceptData(owner)) {
                if (owner.nodeType) {
                    owner[this.expando] = value;
                } else {
                    Object.defineProperty(owner, this.expando, {
                        value: value,
                        configurable: true
                    });
                }
            }
        }
        return value;
    },

    set: function(owner, data, value){
        var prop, cache = this.cache(owner);

        if (typeof data === "string") {
            cache[camelCase(data)] = value;
        } else {
            for (prop in data) {
                if (hasProp(data, prop))
                    cache[camelCase(prop)] = data[prop];
            }
        }
        return cache;
    },

    get: function(owner, key){
        return key === undefined ? this.cache(owner) : owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
    },

    access: function(owner, key, value){
        if (key === undefined || ((key && typeof key === "string") && value === undefined) ) {
            return this.get(owner, key);
        }
        this.set(owner, key, value);
        return value !== undefined ? value : key;
    },

    remove: function(owner, key){
        var i, cache = owner[this.expando];
        if (cache === undefined) {
            return ;
        }
        if (key !== undefined) {
            if ( Array.isArray( key ) ) {
                key = key.map( camelCase );
            } else {
                key = camelCase( key );

                key = key in cache ? [ key ] : ( key.match( /[^\x20\t\r\n\f]+/g ) || [] ); // ???
            }

            i = key.length;

            while ( i-- ) {
                delete cache[ key[ i ] ];
            }
        }
        if ( key === undefined || isEmptyObject( cache ) ) {
            if ( owner.nodeType ) {
                owner[ this.expando ] = undefined;
            } else {
                delete owner[ this.expando ];
            }
        }
        return true;
    },

    hasData: function(owner){
        var cache = owner[ this.expando ];
        return cache !== undefined && !isEmptyObject( cache );
    }
};

var dataSet = new Data('m4q');

$.extend({
    hasData: function(elem){
        return dataSet.hasData(elem);
    },

    data: function(elem, key, val){
        return dataSet.access(elem, key, val);
    },

    removeData: function(elem, key){
        return dataSet.remove(elem, key);
    },

    dataSet: function(ns){
        if (not(ns)) return dataSet;
        if (['INTERNAL', 'M4Q'].indexOf(ns.toUpperCase()) > -1) {
            throw Error("You can not use reserved name for your dataset");
        }
        return new Data(ns);
    }
});

$.fn.extend({
    data: function(key, val){
        var res, elem, data, attrs, name, i;

        if (this.length === 0) {
            return ;
        }

        elem = this[0];

        if ( arguments.length === 0 ) {
            if ( this.length ) {
                data = dataSet.get( elem );

                if ( elem.nodeType === 1) {
                    attrs = elem.attributes;
                    i = attrs.length;
                    while ( i-- ) {
                        if ( attrs[ i ] ) {
                            name = attrs[ i ].name;
                            if ( name.indexOf( "data-" ) === 0 ) {
                                name = camelCase( name.slice( 5 ) );
                                dataAttr( elem, name, data[ name ] );
                            }
                        }
                    }
                }
            }

            return data;
        }

        if ( arguments.length === 1 ) {
            res = dataSet.get(elem, key);
            if (res === undefined) {
                if ( elem.nodeType === 1) {
                    if (elem.hasAttribute("data-"+key)) {
                        res = elem.getAttribute("data-"+key);
                    }
                }
            }
            return res;
        }

        return this.each( function() {
            dataSet.set( this, key, val );
        } );
    },

    removeData: function( key ) {
        return this.each( function() {
            dataSet.remove( this, key );
        } );
    },

    origin: function(name, value, def){

        if (this.length === 0) {
            return this;
        }

        if (not(name) && not(value)) {
            return $.data(this[0]);
        }

        if (not(value)) {
            var res = $.data(this[0], "origin-"+name);
            return !not(res) ? res : def;
        }

        this.data("origin-"+name, value);

        return this;
    }
});

// Source: src/utils.js

/* global $, not, camelCase, dashedName, isPlainObject, isEmptyObject, isArrayLike, acceptData, parseUnit, getUnit, isVisible, isHidden, matches, strip, normName, hasProp, isLocalhost, isTouch */

$.extend({

    device: (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())),
    localhost: isLocalhost(),
    isLocalhost: isLocalhost,
    touchable: isTouch(),

    uniqueId: function (prefix) {
        var d = new Date().getTime();
        if (not(prefix)) {
            prefix = 'm4q';
        }
        return (prefix !== '' ? prefix + '-' : '') + 'xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    },

    toArray: function(n){
        var i, out = [];

        for (i = 0 ; i < n.length; i++ ) {
            out.push(n[i]);
        }

        return out;
    },

    import: function(ctx){
        var res = [];
        this.each(ctx, function(){
            res.push(this);
        });
        return this.merge($(), res);
    },

    merge: function( first, second ) {
        var len = +second.length,
            j = 0,
            i = first.length;

        for ( ; j < len; j++ ) {
            first[ i++ ] = second[ j ];
        }

        first.length = i;

        return first;
    },

    type: function(obj){
        return Object.prototype.toString.call(obj).replace(/^\[object (.+)]$/, '$1').toLowerCase();
    },

    sleep: function(ms) {
        ms += new Date().getTime();
        /* eslint-disable-next-line */
        while (new Date() < ms){}
    },

    isSelector: function(selector){
        if (typeof selector !== 'string') {
            return false;
        }
        try {
            document.querySelector(selector);
        } catch(error) {
            return false;
        }
        return true;
    },

    remove: function(s){
        return $(s).remove();
    },

    camelCase: camelCase,
    dashedName: dashedName,
    isPlainObject: isPlainObject,
    isEmptyObject: isEmptyObject,
    isArrayLike: isArrayLike,
    acceptData: acceptData,
    not: not,
    parseUnit: parseUnit,
    getUnit: getUnit,
    unit: parseUnit,
    isVisible: isVisible,
    isHidden: isHidden,
    matches: function(el, s) {return matches.call(el, s);},
    random: function(from, to) {
        if (arguments.length === 1 && isArrayLike(from)) {
            return from[Math.floor(Math.random()*(from.length))];
        }
        return Math.floor(Math.random()*(to-from+1)+from);
    },
    strip: strip,
    normName: normName,
    hasProp: hasProp,

    serializeToArray: function(form){
        var _form = $(form)[0];
        if (!_form || _form.nodeName !== "FORM") {
            console.warn("Element is not a HTMLFromElement");
            return;
        }
        var i, j, q = [];
        for (i = _form.elements.length - 1; i >= 0; i = i - 1) {
            if (_form.elements[i].name === "") {
                continue;
            }
            switch (_form.elements[i].nodeName) {
                case 'INPUT':
                    switch (_form.elements[i].type) {
                        case 'checkbox':
                        case 'radio':
                            if (_form.elements[i].checked) {
                                q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                            }
                            break;
                        case 'file':
                            break;
                        default: q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                    }
                    break;
                case 'TEXTAREA':
                    q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                    break;
                case 'SELECT':
                    switch (_form.elements[i].type) {
                        case 'select-one':
                            q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                            break;
                        case 'select-multiple':
                            for (j = _form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                                if (_form.elements[i].options[j].selected) {
                                    q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].options[j].value));
                                }
                            }
                            break;
                    }
                    break;
                case 'BUTTON':
                    switch (_form.elements[i].type) {
                        case 'reset':
                        case 'submit':
                        case 'button':
                            q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                            break;
                    }
                    break;
            }
        }
        return q;
    },
    serialize: function(form){
        return $.serializeToArray(form).join("&");
    }
});

$.fn.extend({
    items: function(){
        return $.toArray(this);
    }
});

// Source: src/events.js

/* global $, not, camelCase, str2arr, normName, matches, isEmptyObject, isPlainObject */

(function () {
    if ( typeof window.CustomEvent === "function" ) return false;

    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

var overriddenStop =  Event.prototype.stopPropagation;
var overriddenPrevent =  Event.prototype.preventDefault;

Event.prototype.stopPropagation = function(){
    this.isPropagationStopped = true;
    overriddenStop.apply(this, arguments);
};
Event.prototype.preventDefault = function(){
    this.isPreventedDefault = true;
    overriddenPrevent.apply(this, arguments);
};

Event.prototype.stop = function(immediate){
    return immediate ? this.stopImmediatePropagation() : this.stopPropagation();
};

$.extend({
    events: [],
    eventHooks: {},

    eventUID: -1,

    /*
    * el, eventName, handler, selector, ns, id, options
    * */
    setEventHandler: function(obj){
        var i, freeIndex = -1, eventObj, resultIndex;
        if (this.events.length > 0) {
            for(i = 0; i < this.events.length; i++) {
                if (this.events[i].handler === null) {
                    freeIndex = i;
                    break;
                }
            }
        }

        eventObj = {
            element: obj.el,
            event: obj.event,
            handler: obj.handler,
            selector: obj.selector,
            ns: obj.ns,
            id: obj.id,
            options: obj.options
        };

        if (freeIndex === -1) {
            this.events.push(eventObj);
            resultIndex = this.events.length - 1;
        } else {
            this.events[freeIndex] = eventObj;
            resultIndex = freeIndex;
        }

        return resultIndex;
    },

    getEventHandler: function(index){
        if (this.events[index] !== undefined && this.events[index] !== null) {
            this.events[index] = null;
            return this.events[index].handler;
        }
        return undefined;
    },

    off: function(){
        $.each(this.events, function(){
            this.element.removeEventListener(this.event, this.handler, true);
        });
        this.events = [];
        return this;
    },

    getEvents: function(){
        return this.events;
    },

    getEventHooks: function(){
        return this.eventHooks;
    },

    addEventHook: function(event, handler, type){
        if (not(type)) {
            type = "before";
        }
        $.each(str2arr(event), function(){
            this.eventHooks[camelCase(type+"-"+this)] = handler;
        });
        return this;
    },

    removeEventHook: function(event, type){
        if (not(type)) {
            type = "before";
        }
        $.each(str2arr(event), function(){
            delete this.eventHooks[camelCase(type+"-"+this)];
        });
        return this;
    },

    removeEventHooks: function(event){
        var that = this;
        if (not(event)) {
            this.eventHooks = {};
        } else {
            $.each(str2arr(event), function(){
                delete that.eventHooks[camelCase("before-"+this)];
                delete that.eventHooks[camelCase("after-"+this)];
            });
        }
        return this;
    }
});

$.fn.extend({
    on: function(eventsList, sel, handler, options){
        if (this.length === 0) {
            return ;
        }

        if (typeof sel === 'function') {
            options = handler;
            handler = sel;
            sel = undefined;
        }

        if (!isPlainObject(options)) {
            options = {};
        }

        return this.each(function(){
            var el = this;
            $.each(str2arr(eventsList), function(){
                var h, ev = this,
                    event = ev.split("."),
                    name = normName(event[0]),
                    ns = options.ns ? options.ns : event[1],
                    index, originEvent;

                $.eventUID++;

                h = function(e){
                    var target = e.target;
                    var beforeHook = $.eventHooks[camelCase("before-"+name)];
                    var afterHook = $.eventHooks[camelCase("after-"+name)];

                    if (typeof beforeHook === "function") {
                        beforeHook.call(target, e);
                    }

                    if (!sel) {
                        handler.call(el, e);
                    } else {
                        while (target && target !== el) {
                            if (matches.call(target, sel)) {
                                handler.call(target, e);
                                if (e.isPropagationStopped) {
                                    e.stopImmediatePropagation();
                                    break;
                                }
                            }
                            target = target.parentNode;
                        }
                    }

                    if (typeof afterHook === "function") {
                        afterHook.call(target, e);
                    }

                    if (options.once) {
                        index = +$(el).origin( "event-"+e.type+(sel ? ":"+sel:"")+(ns ? ":"+ns:"") );
                        if (!isNaN(index)) $.events.splice(index, 1);
                    }
                };

                Object.defineProperty(h, "name", {
                    value: handler.name && handler.name !== "" ? handler.name : "func_event_"+name+"_"+$.eventUID
                });

                originEvent = name+(sel ? ":"+sel:"")+(ns ? ":"+ns:"");

                el.addEventListener(name, h, !isEmptyObject(options) ? options : false);

                index = $.setEventHandler({
                    el: el,
                    event: name,
                    handler: h,
                    selector: sel,
                    ns: ns,
                    id: $.eventUID,
                    options: !isEmptyObject(options) ? options : false
                });
                $(el).origin('event-'+originEvent, index);
            });
        });
    },

    one: function(events, sel, handler, options){
        if (!isPlainObject(options)) {
            options = {};
        }

        options.once = true;

        return this.on.apply(this, [events, sel, handler, options]);
    },

    off: function(eventsList, sel, options){

        if (isPlainObject(sel)) {
            options = sel;
            sel = null;
        }

        if (!isPlainObject(options)) {
            options = {};
        }

        if (not(eventsList) || eventsList.toLowerCase() === 'all') {
            return this.each(function(){
                var el = this;
                $.each($.events, function(){
                    var e = this;
                    if (e.element === el) {
                        el.removeEventListener(e.event, e.handler, e.options);
                        e.handler = null;
                        $(el).origin("event-"+name+(e.selector ? ":"+e.selector:"")+(e.ns ? ":"+e.ns:""), null);
                    }
                });
            });
        }

        return this.each(function(){
            var el = this;
            $.each(str2arr(eventsList), function(){
                var evMap = this.split("."),
                    name = normName(evMap[0]),
                    ns = options.ns ? options.ns : evMap[1],
                    originEvent, index;

                originEvent = "event-"+name+(sel ? ":"+sel:"")+(ns ? ":"+ns:"");
                index = $(el).origin(originEvent);

                if (index !== undefined && $.events[index].handler) {
                    el.removeEventListener(name, $.events[index].handler, $.events[index].options);
                    $.events[index].handler = null;
                }

                $(el).origin(originEvent, null);
            });
        });
    },

    trigger: function(name, data){
        return this.fire(name, data);
    },

    fire: function(name, data){
        var _name, e;

        if (this.length === 0) {
            return ;
        }

        _name = normName(name);

        if (['focus', 'blur'].indexOf(_name) > -1) {
            this[0][_name]();
            return this;
        }

        if (typeof CustomEvent !== "undefined") {
            e = new CustomEvent(_name, {
                bubbles: true,
                cancelable: true,
                detail: data
            });
        } else {
            e = document.createEvent('Events');
            e.detail = data;
            e.initEvent(_name, true, true);
        }

        return this.each(function(){
            this.dispatchEvent(e);
        });
    }
});

( "blur focus resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu touchstart touchend touchmove touchcancel" )
    .split( " " )
    .forEach(
    function( name ) {
        $.fn[ name ] = function( sel, fn, opt ) {
            return arguments.length > 0 ?
                this.on( name, sel, fn, opt ) :
                this.fire( name );
        };
});

$.fn.extend( {
    hover: function( fnOver, fnOut ) {
        return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    }
});

$.ready = function(fn, options){
    document.addEventListener('DOMContentLoaded', fn, (options || false));
};

$.load = function(fn){
    return $(window).on("load", fn);
};

$.unload = function(fn){
    return $(window).on("unload", fn);
};

$.fn.extend({
    unload: function(fn){
        return (this.length === 0 || this[0].self !== window) ? undefined : $.unload(fn);
    }
});

$.beforeunload = function(fn){
    if (typeof fn === "string") {
        return $(window).on("beforeunload", function(e){
            e.returnValue = fn;
            return fn;
        });
    } else {
        return $(window).on("beforeunload", fn);
    }
};

$.fn.extend({
    beforeunload: function(fn){
        return (this.length === 0 || this[0].self !== window) ? undefined : $.beforeunload(fn);
    }
});

$.fn.extend({
    ready: function(fn){
        if (this.length && this[0] === document && typeof fn === 'function') {
            return $.ready(fn);
        }
    }
});

// Source: src/ajax.js

/* global $, Promise, not, isSimple, isPlainObject, isEmptyObject, camelCase */

$.ajax = function(p){
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest(), data;
        var method = (p.method || "GET").toUpperCase();
        var headers = [];
        var async = not(p.async) ? true : p.async;
        var url = p.url;

        var exec = function(fn, params){
            if (typeof fn === "function") {
                fn.apply(null, params);
            }
        };

        var isGet = function(method){
            return ["GET", "JSON"].indexOf(method) !== -1;
        };

        var plainObjectToData = function(obj){
            var _data = [];
            $.each(obj, function(k, v){
                var _v = isSimple(v) ? v : JSON.stringify(v);
                _data.push(k+"=" + _v);
            });
            return _data.join("&");
        };

        if (p.data instanceof HTMLFormElement) {
            var _action = p.data.getAttribute("action");
            var _method = p.data.getAttribute("method");

            if (not(url) && _action && _action.trim() !== "") {url = _action;}
            if (_method && _method.trim() !== "") {method = _method.toUpperCase();}
        }


        if (p.timeout) {
            xhr.timeout = p.timeout;
        }

        if (p.withCredentials) {
            xhr.withCredentials = p.withCredentials;
        }

        if (p.data instanceof HTMLFormElement) {
            data = $.serialize(p.data);
        } else if (p.data instanceof HTMLElement && p.data.getAttribute("type") && p.data.getAttribute("type").toLowerCase() === "file") {
            var _name = p.data.getAttribute("name");
            data = new FormData();
            for (var i = 0; i < p.data.files.length; i++) {
                data.append(_name, p.data.files[i]);
            }
        } else if (isPlainObject(p.data)) {
            data = plainObjectToData(p.data);
        } else if (p.data instanceof FormData) {
            data = p.data;
        } else if (typeof p.data === "string") {
            data = p.data;
        } else {
            data = new FormData();
            data.append("_data", JSON.stringify(p.data));
        }

        if (isGet(method)) {
            url += (typeof data === "string" ? "?"+data : isEmptyObject(data) ? "" : "?"+JSON.stringify(data));
        }

        xhr.open(method, url, async, p.user, p.password);
        if (p.headers) {
            $.each(p.headers, function(k, v){
                xhr.setRequestHeader(k, v);
                headers.push(k);
            });
        }
        if (!isGet(method)) {
            if (headers.indexOf("Content-type") === -1 && p.contentType !== false) {
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            }
        }
        xhr.send(data);

        xhr.addEventListener("load", function(e){
            if (xhr.readyState === 4 && xhr.status < 300) {
                var _return = p.returnValue && p.returnValue === 'xhr' ? xhr : xhr.response;
                if (p.parseJson) {
                    try {
                        _return = JSON.parse(_return);
                    } catch (ex) {
                        _return = {};
                    }
                }
                exec(resolve, [_return]);
                exec(p.onSuccess, [e, xhr]);
            } else {
                exec(reject, [xhr]);
                exec(p.onFail, [e, xhr]);
            }
            exec(p.onLoad, [e, xhr]);
        });

        $.each(["readystatechange", "error", "timeout", "progress", "loadstart", "loadend", "abort"], function(){
            var ev = camelCase("on-"+(this === 'readystatechange' ? 'state' : this));
            xhr.addEventListener(ev, function(e){
                exec(p[ev], [e, xhr]);
            });
        });
    });
};

['get', 'post', 'put', 'patch', 'delete', 'json'].forEach(function(method){
    $[method] = function(url, data, options){
        var _method = method.toUpperCase();
        var _options = {
            method: _method === 'JSON' ? 'GET' : _method,
            url: url,
            data: data,
            parseJson: _method === 'JSON'
        };
        return $.ajax($.extend({}, _options, options));
    };
});

$.fn.extend({
    load: function(url, data, options){
        var that = this;

        if (this.length && this[0].self === window ) {
            return $.load(url);
        }

        return $.get(url, data, options).then(function(data){
            that.each(function(){
                this.innerHTML = data;
            });
        });
    }
});

// Source: src/css.js

/* global $, not, setStyleProp */

$.fn.extend({

    style: function(name, pseudo){
        var el;

        function _getStyle(el, prop, pseudo){
            return ["scrollLeft", "scrollTop"].indexOf(prop) > -1 ? $(el)[prop]() : getComputedStyle(el, pseudo)[prop];
        }

        if (typeof name === 'string' && this.length === 0) {
            return undefined;
        }

        if (this.length === 0) {
            return this;
        }

        el = this[0];

        if (not(name) || name === "all") {
            return getComputedStyle(el, pseudo);
        } else {
            var result = {}, names = name.split(", ").map(function(el){
                return (""+el).trim();
            });
            if (names.length === 1)  {
                return _getStyle(el, names[0], pseudo);
            } else {
                $.each(names, function () {
                    var prop = this;
                    result[this] = _getStyle(el, prop, pseudo);
                });
                return result;
            }
        }
    },

    removeStyleProperty: function(name){
        if (not(name) || this.length === 0) return this;
        var names = name.split(", ").map(function(el){
            return (""+el).trim();
        });

        return this.each(function(){
            var el = this;
            $.each(names, function(){
                el.style.removeProperty(this);
            });
        });
    },

    css: function(key, val){
        key = key || 'all';

        if (typeof key === "string" && not(val)) {
            return  this.style(key);
        }

        return this.each(function(){
            var el = this;
            if (typeof key === "object") {
                $.each(key, function(key, val){
                    setStyleProp(el, key, val);
                });
            } else if (typeof key === "string") {
                setStyleProp(el, key, val);
            }
        });
    },

    scrollTop: function(val){
        if (not(val)) {
            return this.length === 0 ? undefined : this[0] === window ? pageYOffset : this[0].scrollTop;
        }
        return this.each(function(){
            this.scrollTop = val;
        });
    },

    scrollLeft: function(val){
        if (not(val)) {
            return this.length === 0 ? undefined : this[0] === window ? pageXOffset : this[0].scrollLeft;
        }
        return this.each(function(){
            this.scrollLeft = val;
        });
    }
});



// Source: src/classes.js

/* global $, not */

$.fn.extend({
    addClass: function(){},
    removeClass: function(){},
    toggleClass: function(){},

    containsClass: function(cls){
        return this.hasClass(cls);
    },

    hasClass: function(cls){
        var result = false;
        var classes = cls.split(" ").filter(function(v){
            return (""+v).trim() !== "";
        });

        if (not(cls)) {
            return false;
        }

        this.each(function(){
            var el = this;

            $.each(classes, function(){
                if (!result && el.classList && el.classList.contains(this)) {
                    result = true;
                }
            });
        });

        return result;
    },

    clearClasses: function(){
        return this.each(function(){
            this.className = "";
        });
    },

    cls: function(array){
        return this.length === 0 ? undefined : array ? this[0].className.split(" ") : this[0].className;
    },

    removeClassBy: function(mask){
        return this.each(function(){
            var el = $(this);
            var classes = el.cls(true);
            $.each(classes, function(){
                var elClass = this;
                if (elClass.indexOf(mask) > -1) {
                    el.removeClass(elClass);
                }
            });
        });
    }
});

['add', 'remove', 'toggle'].forEach(function (method) {
    $.fn[method + "Class"] = function(cls){
        if (not(cls) || (""+cls).trim() === "") return this;
        return this.each(function(){
            var el = this;
            var hasClassList = typeof el.classList !== "undefined";
            $.each(cls.split(" ").filter(function(v){
                return (""+v).trim() !== "";
            }), function(){
                if (hasClassList) el.classList[method](this);
            });
        });
    };
});


// Source: src/parser.js

/* global $ */

$.parseHTML = function(data){
    var base, singleTag, result = [], ctx, _context;
    var regexpSingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i; // eslint-disable-line

    if (typeof data !== "string") {
        return [];
    }

    data = data.trim();

    ctx = document.implementation.createHTMLDocument("");
    base = ctx.createElement( "base" );
    base.href = document.location.href;
    ctx.head.appendChild( base );
    _context = ctx.body;

    singleTag = regexpSingleTag.exec(data);

    if (singleTag) {
        result.push(document.createElement(singleTag[1]));
    } else {
        _context.innerHTML = data;
        for(var i = 0; i < _context.childNodes.length; i++) {
            result.push(_context.childNodes[i]);
        }
    }

    return result;
};


// Source: src/size.js

/* global $, not */

$.fn.extend({
    _size: function(prop, val){
        if (this.length === 0) return ;

        if (not(val)) {

            var el = this[0];

            if (prop === 'height') {
                return el === window ? window.innerHeight : el === document ? el.body.clientHeight : parseInt(getComputedStyle(el).height);
            }
            if (prop === 'width') {
                return el === window ? window.innerWidth : el === document ? el.body.clientWidth : parseInt(getComputedStyle(el).width);
            }
        }

        return this.each(function(){
            var el = this;
            if (el === window || el === document) {return ;}
            el.style[prop] = isNaN(val) ? val : val + 'px';
        });
    },

    height: function(val){
        return this._size('height', val);
    },

    width: function(val){
        return this._size('width', val);
    },

    _sizeOut: function(prop, val){
        var el, size, style, result;

        if (this.length === 0) {
            return ;
        }

        if (!not(val) && typeof val !== "boolean") {
            return this.each(function(){
                var el = this;
                if (el === window || el === document) {return ;}
                var h, style = getComputedStyle(el),
                    bs = prop === 'width' ? parseInt(style['border-left-width']) + parseInt(style['border-right-width']) : parseInt(style['border-top-width']) + parseInt(style['border-bottom-width']),
                    pa = prop === 'width' ? parseInt(style['padding-left']) + parseInt(style['padding-right']) : parseInt(style['padding-top']) + parseInt(style['padding-bottom']);

                h = $(this)[prop](val)[prop]() - bs - pa;
                el.style[prop] = h + 'px';
            });
        }

        el = this[0];
        size = el[prop === 'width' ? 'offsetWidth' : 'offsetHeight'];
        style = getComputedStyle(el);
        result = size + parseInt(style[prop === 'width' ? 'margin-left' : 'margin-top']) + parseInt(style[prop === 'width' ? 'margin-right' : 'margin-bottom']);
        return val === true ? result : size;
    },

    outerWidth: function(val){
        return this._sizeOut('width', val);
    },

    outerHeight: function(val){
        return this._sizeOut('height', val);
    },

    padding: function(p){
        if (this.length === 0) return;
        var s = getComputedStyle(this[0], p);

        return {
            top: parseInt(s["padding-top"]),
            right: parseInt(s["padding-right"]),
            bottom: parseInt(s["padding-bottom"]),
            left: parseInt(s["padding-left"])
        };
    },

    margin: function(p){
        if (this.length === 0) return;
        var s = getComputedStyle(this[0], p);

        return {
            top: parseInt(s["margin-top"]),
            right: parseInt(s["margin-right"]),
            bottom: parseInt(s["margin-bottom"]),
            left: parseInt(s["margin-left"])
        };
    },

    border: function(p){
        if (this.length === 0) return;
        var s = getComputedStyle(this[0], p);

        return {
            top: parseInt(s["border-top-width"]),
            right: parseInt(s["border-right-width"]),
            bottom: parseInt(s["border-bottom-width"]),
            left: parseInt(s["border-left-width"])
        };
    }
});

// Source: src/position.js

/* global $, not */

$.fn.extend({
    offset: function(val){
        var rect;

        if (not(val)) {
            if (this.length === 0) return undefined;
            rect = this[0].getBoundingClientRect();
            return {
                top: rect.top + pageYOffset,
                left: rect.left + pageXOffset
            };
        }

        return this.each(function(){ //?
            var el = $(this),
                top = val.top,
                left = val.left,
                position = getComputedStyle(this).position,
                offset = el.offset();

            if (position === "static") {
                el.css("position", "relative");
            }

            if (["absolute", "fixed"].indexOf(position) === -1) {
                top = top - offset.top;
                left = left - offset.left;
            }

            el.css({
                top: top,
                left: left
            });
        });
    },

    position: function(margin){
        var ml = 0, mt = 0, el, style;

        if (not(margin) || typeof margin !== "boolean") {
            margin = false;
        }

        if (this.length === 0) {
            return undefined;
        }

        el = this[0];
        style = getComputedStyle(el);

        if (margin) {
            ml = parseInt(style['margin-left']);
            mt = parseInt(style['margin-top']);
        }

        return {
            left: el.offsetLeft - ml,
            top: el.offsetTop - mt
        };
    },

    left: function(val, margin){
        if (this.length === 0) return ;
        if (not(val)) {
            return this.position(margin).left;
        }
        if (typeof val === "boolean") {
            margin = val;
            return this.position(margin).left;
        }
        return this.each(function(){
            $(this).css({
                left: val
            });
        });
    },

    top: function(val, margin){
        if (this.length === 0) return ;
        if (not(val)) {
            return this.position(margin).top;
        }
        if (typeof val === "boolean") {
            margin = val;
            return this.position(margin).top;
        }
        return this.each(function(){
            $(this).css({
                top: val
            });
        });
    },

    coord: function(){
        return this.length === 0 ? undefined : this[0].getBoundingClientRect();
    },

    pos: function(){
        if (this.length === 0) return ;
        return {
            top: parseInt($(this[0]).style("top")),
            left: parseInt($(this[0]).style("left"))
        };
    }
});

// Source: src/attr.js

/* global $, not, isPlainObject */

$.fn.extend({
    attr: function(name, val){
        var attributes = {};

        if (this.length === 0 && arguments.length === 0) {
            return undefined;
        }

        if (this.length && arguments.length === 0) {
            $.each(this[0].attributes, function(){
                attributes[this.nodeName] = this.nodeValue;
            });
            return attributes;
        }

        if (arguments.length === 1 && typeof name === "string") {
            return this.length && this[0].nodeType === 1 && this[0].hasAttribute(name) ? this[0].getAttribute(name) : undefined;
        }

        return this.each(function(){
            var el = this;
            if (isPlainObject(name)) {
                $.each(name, function(k, v){
                    el.setAttribute(k, v);
                });
            } else {
                el.setAttribute(name, val);
                // console.log(name, val);
            }
        });
    },

    removeAttr: function(name){
        var attributes;

        if (not(name)) {
            return this.each(function(){
                var el = this;
                $.each(this.attributes, function(){
                    el.removeAttribute(this);
                });
            });
        }

        attributes = typeof name === "string" ? name.split(",").map(function(el){
            return el.trim();
        }) : name;

        return this.each(function(){
            var el = this;
            $.each(attributes, function(){
                if (el.hasAttribute(this)) el.removeAttribute(this);
            });
        });
    },

    toggleAttr: function(name, val){
        return this.each(function(){
            var el = this;

            if (not(val)) {
                el.removeAttribute(name);
            } else {
                el.setAttribute(name, val);
            }

        });
    },

    id: function(val){
        return this.length ? $(this[0]).attr("id", val) : undefined;
    }
});

$.extend({
    meta: function(name){
        return not(name) ? $("meta") : $("meta[name='$name']".replace("$name", name));
    },

    metaBy: function(name){
        return not(name) ? $("meta") : $("meta[$name]".replace("$name", name));
    },

    doctype: function(){
        return $("doctype");
    },

    html: function(){
        return $("html");
    },

    head: function(){
        return $("html").find("head");
    },

    body: function(){
        return $("body");
    },

    document: function(){
        return $(document);
    },

    window: function(){
        return $(window);
    },

    charset: function(val){
        var meta = $("meta[charset]");
        if (val) {
            meta.attr("charset", val);
        }
        return meta.attr("charset");
    }
});

// Source: src/proxy.js

/* global $ */

$.extend({
    proxy: function(fn, ctx){
        return typeof fn !== "function" ? undefined : fn.bind(ctx);
    },

    bind: function(fn, ctx){
        return this.proxy(fn, ctx);
    }
});


// Source: src/manipulation.js

/* global $, isArrayLike, not, matches, hasProp */

(function (arr) {
    arr.forEach(function (item) {
        ['append', 'prepend'].forEach(function(where){
            if (hasProp(item, where)) {
                return;
            }

            Object.defineProperty(item, where, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function () {
                    var argArr = Array.prototype.slice.call(arguments),
                        docFrag = document.createDocumentFragment();

                    argArr.forEach(function (argItem) {
                        var isNode = argItem instanceof Node;
                        docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                    });

                    if (where === 'prepend')
                        this.insertBefore(docFrag, this.firstChild);
                    else
                        this.appendChild(docFrag);
                }
            });
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

var normalizeElements = function(s){
    var result;

    if (typeof s === "string") result = $.isSelector(s) ? $(s) : $.parseHTML(s);
    else if (s instanceof HTMLElement) result = [s];
    else if (isArrayLike(s)) result = s;
    return result;
};

$.fn.extend({

    appendText: function(text){
        return this.each(function(elIndex, el){
            el.innerHTML += text;
        });
    },

    prependText: function(text){
        return this.each(function(elIndex, el){
            el.innerHTML = text + el.innerHTML;
        });
    },

    append: function(elements){
        var _elements = normalizeElements(elements);

        return this.each(function(elIndex, el){
            $.each(_elements, function(){
                if (el === this) return ;
                var child = elIndex === 0 ? this : this.cloneNode(true);
                $.script(child);
                if (child.tagName && child.tagName !== "SCRIPT") el.append(child);
            });
        });
    },

    appendTo: function(elements){
        var _elements = normalizeElements(elements);

        return this.each(function(){
            var el = this;
            $.each(_elements, function(parIndex, parent){
                if (el === this) return ;
                parent.append(parIndex === 0 ? el : el.cloneNode(true));
            });
        });
    },

    prepend: function(elements){
        var _elements = normalizeElements(elements);

        return this.each(function (elIndex, el) {
            $.each(_elements, function(){
                if (el === this) return ;
                var child = elIndex === 0 ? this : this.cloneNode(true);
                $.script(child);
                if (child.tagName && child.tagName !== "SCRIPT") el.prepend(child);
            });
        });
    },

    prependTo: function(elements){
        var _elements = normalizeElements(elements);

        return this.each(function(){
            var el = this;
            $.each(_elements, function(parIndex, parent){
                if (el === this) return ;
                $(parent).prepend(parIndex === 0 ? el : el.cloneNode(true));
            });
        });
    },

    insertBefore: function(elements){
        var _elements = normalizeElements(elements);

        return this.each(function(){
            var el = this;
            $.each(_elements, function(elIndex){
                if (el === this) return ;
                var parent = this.parentNode;
                if (parent) {
                    parent.insertBefore(elIndex === 0 ? el : el.cloneNode(true), this);
                }
            });
        });
    },

    insertAfter: function(elements){
        var _elements = normalizeElements(elements);

        return this.each(function(){
            var el = this;
            $.each(_elements, function(elIndex, element){
                if (el === this) return ;
                var parent = this.parentNode;
                if (parent) {
                    parent.insertBefore(elIndex === 0 ? el : el.cloneNode(true), element.nextSibling);
                }
            });
        });
    },

    after: function(html){
        return this.each(function(){
            var el = this;
            if (typeof html === "string") {
                el.insertAdjacentHTML('afterend', html);
            } else {
                $(html).insertAfter(el);
            }
        });
    },

    before: function(html){
        return this.each(function(){
            var el = this;
            if (typeof html === "string") {
                el.insertAdjacentHTML('beforebegin', html);
            } else {
                $(html).insertBefore(el);
            }
        });
    },

    clone: function(deep, withData){
        var res = [];
        if (not(deep)) {
            deep = false;
        }
        if (not(withData)) {
            withData = false;
        }
        this.each(function(){
            var el = this.cloneNode(deep);
            var $el = $(el);
            var data;
            if (withData && $.hasData(this)) {
                data = $(this).data();
                $.each(data, function(k, v){
                    $el.data(k, v);
                });
            }
            res.push(el);
        });
        return $.merge($(), res);
    },

    import: function(deep){
        var res = [];
        if (not(deep)) {
            deep = false;
        }
        this.each(function(){
            res.push(document.importNode(this, deep));
        });
        return $.merge($(), res);
    },

    adopt: function(){
        var res = [];
        this.each(function(){
            res.push(document.adoptNode(this));
        });
        return $.merge($(), res);
    },

    remove: function(selector){
        var i = 0, node, out, res = [];

        if (this.length === 0) {
            return ;
        }

        out = selector ? this.filter(function(el){
            return matches.call(el, selector);
        }) : this.items();

        for ( ; ( node = out[ i ] ) != null; i++ ) {
            if (node.parentNode) {
                res.push(node.parentNode.removeChild(node));
                $.removeData(node);
            }
        }

        return $.merge($(), res);
    },

    wrap: function( el ){
        if (this.length === 0) {
            return ;
        }

        var wrapper = $(normalizeElements(el));

        if (!wrapper.length) {
            return ;
        }

        var res = [];

        this.each(function(){
            var _target, _wrapper;

            _wrapper = wrapper.clone(true, true);
            _wrapper.insertBefore(this);

            _target = _wrapper;
            while (_target.children().length) {
                _target = _target.children().eq(0);
            }
            _target.append(this);

            res.push(_wrapper);
        });

        return $(res);
    },

    wrapAll: function( el ){
        var wrapper, _wrapper, _target;

        if (this.length === 0) {
            return ;
        }

        wrapper = $(normalizeElements(el));

        if (!wrapper.length) {
            return ;
        }

        _wrapper = wrapper.clone(true, true);
        _wrapper.insertBefore(this[0]);

        _target = _wrapper;
        while (_target.children().length) {
            _target = _target.children().eq(0);
        }

        this.each(function(){
            _target.append(this);
        })

        return _wrapper;
    },

    wrapInner: function( el ){
        if (this.length === 0) {
            return ;
        }

        var wrapper = $(normalizeElements(el));

        if (!wrapper.length) {
            return ;
        }

        var res = [];

        this.each(function(){
            var elem = $(this);
            var html = elem.html();
            var wrp = wrapper.clone(true, true);
            elem.html(wrp.html(html));
            res.push(wrp);
        });

        return $(res);
    }
});

// Source: src/animation.js

/* global $, not, camelCase, parseUnit, Promise, getUnit, matches */

$.extend({
    animation: {
        duration: 1000,
        ease: "linear",
        elements: {}
    }
});

if (typeof window["setupAnimation"] === 'object') {
    $.each(window["setupAnimation"], function(key, val){
        if (typeof $.animation[key] !== "undefined" && !not(val))
            $.animation[key] = val;
    });
}

var transformProps = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY'];
var numberProps = ['opacity', 'zIndex'];
var floatProps = ['opacity', 'volume'];
var scrollProps = ["scrollLeft", "scrollTop"];
var reverseProps = ["opacity", "volume"];

function _validElement(el) {
    return el instanceof HTMLElement || el instanceof SVGElement;
}

/**
 *
 * @param to
 * @param from
 * @returns {*}
 * @private
 */
function _getRelativeValue (to, from) {
    var operator = /^(\*=|\+=|-=)/.exec(to);
    if (!operator) return to;
    var u = getUnit(to) || 0;
    var x = parseFloat(from);
    var y = parseFloat(to.replace(operator[0], ''));
    switch (operator[0][0]) {
        case '+':
            return x + y + u;
        case '-':
            return x - y + u;
        case '*':
            return x * y + u;
        case '/':
            return x / y + u;
    }
}

/**
 *
 * @param el
 * @param prop
 * @param pseudo
 * @returns {*|number|string}
 * @private
 */
function _getStyle (el, prop, pseudo){
    if (typeof el[prop] !== "undefined") {
        if (scrollProps.indexOf(prop) > -1) {
            return prop === "scrollLeft" ? el === window ? pageXOffset : el.scrollLeft : el === window ? pageYOffset : el.scrollTop;
        } else {
            return el[prop] || 0;
        }
    }

    return el.style[prop] || getComputedStyle(el, pseudo)[prop];
}

/**
 *
 * @param el
 * @param key
 * @param val
 * @param unit
 * @param toInt
 * @private
 */
function _setStyle (el, key, val, unit, toInt) {

    if (not(toInt)) {
        toInt = false;
    }

    key = camelCase(key);

    if (toInt) {
        val  = parseInt(val);
    }

    if (_validElement(el)) {
        if (typeof el[key] !== "undefined") {
            el[key] = val;
        } else {
            el.style[key] = key === "transform" || key.toLowerCase().indexOf('color') > -1 ? val : val + unit;
        }
    } else {
        el[key] = val;
    }
}

/**
 *
 * @param el
 * @param mapProps
 * @param p
 * @private
 */
function _applyStyles (el, mapProps, p) {
    $.each(mapProps, function (key, val) {
        _setStyle(el, key, val[0] + (val[2] * p), val[3], val[4]);
    });
}

/**
 *
 * @param el
 * @returns {{}}
 * @private
 */
function _getElementTransforms (el) {
    if (!_validElement(el)) return {};
    var str = el.style.transform || '';
    var reg = /(\w+)\(([^)]*)\)/g;
    var transforms = {};
    var m;

    /* jshint ignore:start */
    // eslint-disable-next-line
    while (m = reg.exec(str))
        transforms[m[1]] = m[2];
    /* jshint ignore:end */

    return transforms;
}

/**
 *
 * @param val
 * @returns {number[]}
 * @private
 */
function _getColorArrayFromHex (val){
    var a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val ? val : "#000000");
    return a.slice(1).map(function(v) {
            return parseInt(v, 16);
    });
}

/**
 *
 * @param el
 * @param key
 * @returns {number[]}
 * @private
 */
function _getColorArrayFromElement (el, key) {
    return getComputedStyle(el)[key].replace(/[^\d.,]/g, '').split(',').map(function(v) {
        return parseInt(v);
    });
}

/**
 *
 * @param el
 * @param mapProps
 * @param p
 * @private
 */
function _applyTransform (el, mapProps, p) {
    var t = [];
    var elTransforms = _getElementTransforms(el);

    $.each(mapProps, function(key, val) {
        var from = val[0], to = val[1], delta = val[2], unit = val[3];
        key = "" + key;

        if ( key.indexOf("rotate") > -1 || key.indexOf("skew") > -1) {
            if (unit === "") unit = "deg";
        }

        if (key.indexOf('scale') > -1) {
            unit = '';
        }

        if (key.indexOf('translate') > -1 && unit === '') {
            unit = 'px';
        }

        if (unit === "turn") {
            t.push(key+"(" + (to * p) + unit + ")");
        } else {
            t.push(key +"(" + (from + (delta * p)) + unit+")");
        }
    });

    $.each(elTransforms, function(key, val) {
        if (mapProps[key] === undefined) {
            t.push(key+"("+val+")");
        }
    });

    el.style.transform = t.join(" ");
}

/**
 *
 * @param el
 * @param mapProps
 * @param p
 * @private
 */
function _applyColors (el, mapProps, p) {
    $.each(mapProps, function (key, val) {
        var i, result = [0, 0, 0], v;
        for (i = 0; i < 3; i++) {
            result[i] = Math.floor(val[0][i] + (val[2][i] * p));
        }
        v = "rgb("+(result.join(","))+")";
        el.style[key] = v;
    });
}

/**
 *
 * @param val
 * @returns {string|*}
 * @private
 */
function _expandColorValue (val) {
    var regExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    if (val[0] === "#" && val.length === 4) {
        return "#" + val.replace(regExp, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
    }
    return val[0] === "#" ? val : "#"+val;
}

/**
 *
 * @param el
 * @param map
 * @param p
 */
function applyProps (el, map, p) {
    _applyStyles(el, map.props, p);
    _applyTransform(el, map.transform, p);
    _applyColors(el, map.color, p);
}

/**
 *
 * @param el
 * @param draw
 * @param dir
 * @returns {{transform: {}, color: {}, props: {}}}
 */
function createAnimationMap (el, draw, dir) {
    var map = {
        props: {},
        transform: {},
        color: {}
    };
    var i, from, to, delta, unit, temp;
    var elTransforms = _getElementTransforms(el);

    if (not(dir)) {
        dir = "normal";
    }

    $.each(draw, function(key, val) {

        var isTransformProp = transformProps.indexOf(""+key) > -1;
        var isNumProp = numberProps.indexOf(""+key) > -1;
        var isColorProp = (""+key).toLowerCase().indexOf("color") > -1;

        if (Array.isArray(val) && val.length === 1) {
            val = val[0];
        }

        if (!Array.isArray(val)) {
            if (isTransformProp) {
                from = elTransforms[key] || 0;
            } else if (isColorProp) {
                from = _getColorArrayFromElement(el, key);
            } else {
                from = _getStyle(el, key);
            }
            from = !isColorProp ? parseUnit(from) : from;
            to = !isColorProp ? parseUnit(_getRelativeValue(val, Array.isArray(from) ? from[0] : from)) : _getColorArrayFromHex(val);
        } else {
            from = !isColorProp ? parseUnit(val[0]) : _getColorArrayFromHex(_expandColorValue(val[0]));
            to = !isColorProp ? parseUnit(val[1]) : _getColorArrayFromHex(_expandColorValue(val[1]));
        }

        if (reverseProps.indexOf(""+key) > -1 && from[0] === to[0]) {
            from[0] = to[0] > 0 ? 0 : 1;
        }

        if (dir === "reverse") {
            temp = from;
            from = to;
            to = temp;
        }

        unit = el instanceof HTMLElement && to[1] === '' && !isNumProp && !isTransformProp ? 'px' : to[1];

        if (isColorProp) {
            delta = [0, 0, 0];
            for (i = 0; i < 3; i++) {
                delta[i] = to[i] - from[i];
            }
        } else {
            delta = to[0] - from[0];
        }

        if (isTransformProp) {
            map.transform[key] = [from[0], to[0], delta, unit];
        } else if (isColorProp) {
            map.color[key] = [from, to, delta, unit];
        } else {
            map.props[key] = [from[0], to[0], delta, unit, floatProps.indexOf(""+key) === -1];
        }
    });

    return map;
}

function minMax(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

var Easing = {
    linear: function(){return function(t) {return t;};}
};

Easing.default = Easing.linear;

var eases = {
    Sine: function(){
        return function(t){
            return 1 - Math.cos(t * Math.PI / 2);
        };
    },
    Circ: function(){
        return function(t){
            return 1 - Math.sqrt(1 - t * t);
        };
    },
    Back: function(){
        return function(t){
            return t * t * (3 * t - 2);
        };
    },
    Bounce: function(){
        return function(t){
            var pow2, b = 4;
            // eslint-disable-next-line
            while (t < (( pow2 = Math.pow(2, --b)) - 1) / 11) {}
            return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow(( pow2 * 3 - 2 ) / 22 - t, 2);
        };
    },
    Elastic: function(amplitude, period){
        if (not(amplitude)) {
            amplitude = 1;
        }

        if (not(period)) {
            period = 0.5;
        }
        var a = minMax(amplitude, 1, 10);
        var p = minMax(period, 0.1, 2);
        return function(t){
            return (t === 0 || t === 1) ? t :
                -a * Math.pow(2, 10 * (t - 1)) * Math.sin((((t - 1) - (p / (Math.PI * 2) * Math.asin(1 / a))) * (Math.PI * 2)) / p);
        };
    }
};

['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'].forEach(function(name, i) {
    eases[name] = function(){
        return function(t){
            return Math.pow(t, i + 2);
        };
    };
});

Object.keys(eases).forEach(function(name) {
    var easeIn = eases[name];
    Easing['easeIn' + name] = easeIn;
    Easing['easeOut' + name] = function(a, b){
        return function(t){
            return 1 - easeIn(a, b)(1 - t);
        };
    };
    Easing['easeInOut' + name] = function(a, b){
        return function(t){
            return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 1 - easeIn(a, b)(t * -2 + 2) / 2;
        };
    };
});

var defaultAnimationProps = {
    id: null,
    el: null,
    draw: {},
    dur: $.animation.duration,
    ease: $.animation.ease,
    loop: 0,
    pause: 0,
    dir: "normal",
    defer: 0,
    onStart: function(){},
    onStop: function(){},
    onStopAll: function(){},
    onPause: function(){},
    onPauseAll: function(){},
    onResume: function(){},
    onResumeAll: function(){},
    onFrame: function(){},
    onDone: function(){}
};

function animate(args){
    return new Promise(function(resolve){
        var that = this;
        var props = $.assign({}, defaultAnimationProps, {dur: $.animation.duration, ease: $.animation.ease}, args);
        var id = props.id, el = props.el, draw = props.draw, dur = props.dur, ease = props.ease, loop = props.loop,
            onStart = props.onStart, onFrame = props.onFrame, onDone = props.onDone,
            pauseStart = props.pause, dir = props.dir, defer = props.defer;
        var map = {};
        var easeName = "linear", easeArgs = [], easeFn = Easing.linear, matchArgs;
        var direction = dir === "alternate" ? "normal" : dir;
        var replay = false;
        var animationID = id ? id : +(performance.now() * Math.pow(10, 14));

        if (not(el)) {
            throw new Error("Unknown element!");
        }

        if (typeof el === "string") {
            el = document.querySelector(el);
        }

        if (typeof draw !== "function" && typeof draw !== "object") {
            throw new Error("Unknown draw object. Must be a function or object!");
        }

        if (dur === 0) {
            dur = 1;
        }

        if (dir === "alternate" && typeof loop === "number") {
            loop *= 2;
        }

        if (typeof ease === "string") {
            matchArgs = /\(([^)]+)\)/.exec(ease);
            easeName = ease.split("(")[0];
            easeArgs = matchArgs ? matchArgs[1].split(',').map(function(p){return parseFloat(p);}) : [];
            easeFn = Easing[easeName] || Easing.linear;
        } else if (typeof ease === "function") {
            easeFn = ease;
        } else {
            easeFn = Easing.linear;
        }

        $.animation.elements[animationID] = {
            element: el,
            id: null,
            stop: 0,
            pause: 0,
            loop: 0,
            t: -1,
            started: 0,
            paused: 0
        };

        var play = function() {
            if (typeof draw === "object") {
                map = createAnimationMap(el, draw, direction);
            }

            if (typeof onStart === "function") {
                onStart.apply(el);
            }

            // start = performance.now();
            $.animation.elements[animationID].loop += 1;
            $.animation.elements[animationID].started = performance.now();
            $.animation.elements[animationID].duration = dur;
            $.animation.elements[animationID].id = requestAnimationFrame(animate);
        };

        var done = function() {
            cancelAnimationFrame($.animation.elements[animationID].id);
            delete $.animation.elements[id];

            if (typeof onDone === "function") {
                onDone.apply(el);
            }

            resolve(that);
        };

        var animate = function(time) {
            var p, t;
            var stop = $.animation.elements[animationID].stop;
            var pause = $.animation.elements[animationID].pause;
            var start = $.animation.elements[animationID].started;

            if ($.animation.elements[animationID].paused) {
                start = time - $.animation.elements[animationID].t * dur;
                $.animation.elements[animationID].started = start;
            }

            t = ((time - start) / dur).toFixed(4);

            if (t > 1) t = 1;
            if (t < 0) t = 0;

            p = easeFn.apply(null, easeArgs)(t);

            $.animation.elements[animationID].t = t;
            $.animation.elements[animationID].p = p;

            if (pause) {
                $.animation.elements[animationID].id = requestAnimationFrame(animate);
                // $.animation.elements[animationID].started = performance.now();
                return;
            }

            if ( stop > 0) {
                if (stop === 2) {
                    if (typeof draw === "function") {
                        draw.bind(el)(1, 1);
                    } else {
                        applyProps(el, map, 1);
                    }
                }
                done();
                return;
            }

            if (typeof draw === "function") {
                draw.bind(el)(t, p);
            } else {
                applyProps(el, map, p);
            }

            if (typeof onFrame === 'function') {
                onFrame.apply(el, [t, p]);
            }

            if (t < 1) {
                $.animation.elements[animationID].id = requestAnimationFrame(animate);
            }

            if (parseInt(t) === 1) {
                if (loop) {
                    if (dir === "alternate") {
                        direction = direction === "normal" ? "reverse" : "normal";
                    }

                    if (typeof loop === "boolean") {
                        setTimeout(function () {
                            play();
                        }, pauseStart);
                    } else {
                        if (loop > $.animation.elements[animationID].loop) {
                            setTimeout(function () {
                                play();
                            }, pauseStart);
                        } else {
                            done();
                        }
                    }
                } else {
                    if (dir === "alternate" && !replay) {
                        direction = direction === "normal" ? "reverse" : "normal";
                        replay = true;
                        play();
                    } else {
                        done();
                    }
                }
            }
        };
        if (defer > 0) {
            setTimeout(function() {
                play();
            }, defer);
        } else {
            play();
        }
    });
}

// Stop animation
function stopAnimation(id, done){
    var an = $.animation.elements[id];

    if (typeof an === "undefined") {
        return ;
    }

    if (not(done)) {
        done = true;
    }

    an.stop = done === true ? 2 : 1;

    if (typeof an.onStop === "function") {
        an.onStop.apply(an.element);
    }
}

function stopAnimationAll(done, filter){
    $.each($.animation.elements, function(k, v){
        if (filter) {
            if (typeof filter === "string") {
                if (matches.call(v.element, filter)) stopAnimation(k, done);
            } else if (filter.length) {
                $.each(filter, function(){
                    if (v.element === this) stopAnimation(k, done);
                });
            } else if (filter instanceof Element) {
                if (v.element === filter) stopAnimation(k, done);
            }
        } else {
            stopAnimation(k, done);
        }
    });
}
// end of stop

// Pause and resume animation
function pauseAnimation(id){
    var an = $.animation.elements[id];

    if (typeof an === "undefined") {
        return ;
    }

    an.pause = 1;
    an.paused = performance.now();

    if (typeof an.onPause === "function") {
        an.onPause.apply(an.element);
    }
}

function pauseAnimationAll(filter){
    $.each($.animation.elements, function(k, v){
        if (filter) {
            if (typeof filter === "string") {
                if (matches.call(v.element, filter)) pauseAnimation(k);
            } else if (filter.length) {
                $.each(filter, function(){
                    if (v.element === this) pauseAnimation(k);
                });
            } else if (filter instanceof Element) {
                if (v.element === filter) pauseAnimation(k);
            }
        } else {
            pauseAnimation(k);
        }
    });
}
// end of pause

function resumeAnimation(id){
    var an = $.animation.elements[id];

    if (typeof an === "undefined") {
        return ;
    }

    an.pause = 0;
    an.paused = 0;

    if (typeof an.onResume === "function") {
        an.onResume.apply(an.element);
    }
}

function resumeAnimationAll(filter){
    $.each($.animation.elements, function(k, v){
        if (filter) {
            if (typeof filter === "string") {
                if (matches.call(v.element, filter)) resumeAnimation(k);
            } else if (filter.length) {
                $.each(filter, function(){
                    if (v.element === this) resumeAnimation(k);
                });
            } else if (filter instanceof Element) {
                if (v.element === filter) resumeAnimation(k);
            }
        } else {
            resumeAnimation(k);
        }
    });
}

/* eslint-enable */

var defaultChainOptions = {
    loop: false,
    onChainItem: null,
    onChainItemComplete: null,
    onChainComplete: null
}

function chain(arr, opt){
    var o = $.extend({}, defaultChainOptions, opt);

    if (typeof o.loop !== "boolean") {
        o.loop--;
    }

    if (!Array.isArray(arr)) {
        console.warn("Chain array is not defined!");
        return false;
    }

    var reducer = function(acc, item){
        return acc.then(function(){
            if (typeof o["onChainItem"] === "function") {
                o["onChainItem"](item);
            }
            return animate(item).then(function(){
                if (typeof o["onChainItemComplete"] === "function") {
                    o["onChainItemComplete"](item);
                }
            });
        });
    };

    arr.reduce(reducer, Promise.resolve()).then(function(){
        if (typeof o["onChainComplete"] === "function") {
            o["onChainComplete"]();
        }

        if (o.loop) {
            chain(arr, o);
        }
    });
}

$.easing = {};

$.extend($.easing, Easing);

$.extend({
    animate: function(args){
        var el, draw, dur, ease, cb;

        if (arguments.length > 1) {
            el = $(arguments[0])[0];
            draw = arguments[1];
            dur = arguments[2] || $.animation.duration;
            ease = arguments[3] || $.animation.ease;
            cb = arguments[4];

            if (typeof dur === 'function') {
                cb = dur;
                ease = $.animation.ease;
                dur = $.animation.duration;
            }

            if (typeof ease === 'function') {
                cb = ease;
                ease = $.animation.ease;
            }

            return animate({
                el: el,
                draw: draw,
                dur: dur,
                ease: ease,
                onDone: cb
            });
        }

        return animate(args);
    },
    chain: chain,
    stop: stopAnimation,
    stopAll: stopAnimationAll,
    resume: resumeAnimation,
    resumeAll: resumeAnimationAll,
    pause: pauseAnimation,
    pauseAll: pauseAnimationAll
});

$.fn.extend({
    /**
     *

     args = {
         draw: {} | function,
         dur: 1000,
         ease: "linear",
         loop: 0,
         pause: 0,
         dir: "normal",
         defer: 0,
         onFrame: function,
         onDone: function
     }

     * @returns {this}
     */
    animate: function(args){
        var that = this;
        var draw, dur, easing, cb;
        var a = args;
        var compatibilityMode;

        compatibilityMode = !Array.isArray(args) && (arguments.length > 1 || (arguments.length === 1 && typeof arguments[0].draw === 'undefined'));

        if ( compatibilityMode ) {
            draw = arguments[0];
            dur = arguments[1] || $.animation.duration;
            easing = arguments[2] || $.animation.ease;
            cb = arguments[3];

            if (typeof dur === 'function') {
                cb = dur;
                dur = $.animation.duration;
                easing = $.animation.ease;
            }

            if (typeof easing === 'function') {
                cb = easing;
                easing = $.animation.ease;
            }

            return this.each(function(){
                return $.animate({
                    el: this,
                    draw: draw,
                    dur: dur,
                    ease: easing,
                    onDone: cb
                });
            });
        }

        if (Array.isArray(args)) {
            $.each(args, function(){
                var a = this;
                that.each(function(){
                    a.el = this;
                    $.animate(a);
                });
            });
            return this;
        }

        return this.each(function(){
            a.el = this;
            $.animate(a);
        });
    },

    chain: function(arr, loop){
        return this.each(function(){
            var el = this;
            $.each(arr, function(){
                this.el = el;
            });
            $.chain(arr, loop);
        });
    },

    /**
     *
     * @param done
     * @returns {this}
     */
    stop: function(done){
        return this.each(function(){
            var el = this;
            $.each($.animation.elements, function(k, o){
                if (o.element === el) {
                    stopAnimation(k, done);
                }
            });
        });
    },

    pause: function(){
        return this.each(function(){
            var el = this;
            $.each($.animation.elements, function(k, o){
                if (o.element === el) {
                    pauseAnimation(k);
                }
            });
        });
    },

    resume: function(){
        return this.each(function(){
            var el = this;
            $.each($.animation.elements, function(k, o){
                if (o.element === el) {
                    resumeAnimation(k);
                }
            });
        });
    }
});


// Source: src/visibility.js

/* global $ */

$.extend({
    hidden: function(el, val, cb){
        el = $(el)[0];

        if (typeof val === "string") {
            val = val.toLowerCase() === "true";
        }

        if (typeof val === "function") {
            cb = val;
            val = !el.hidden;
        }

        el.hidden = val;

        if (typeof cb === "function") {
            $.bind(cb, el);
            cb.call(el, arguments);
        }

        return this;
    },

    hide: function(el, cb){
        var $el = $(el);

        $el.origin('display', (el.style.display ? el.style.display : getComputedStyle(el, null).display));
        el.style.display = 'none';

        if (typeof cb === "function") {
            $.bind(cb, el);
            cb.call(el, arguments);
        }

        return this;
    },

    show: function(el, cb){
        var display = $(el).origin('display', undefined, "block");
        el.style.display = display ? display === 'none' ? 'block' : display : '';
        if (parseInt(el.style.opacity) === 0) {
            el.style.opacity = "1";
        }
        if (typeof cb === "function") {
            $.bind(cb, el);
            cb.call(el, arguments);
        }
        return this;
    },

    visible: function(el, mode, cb){
        if (mode === undefined) {
            mode = true;
        }
        el.style.visibility = mode ? 'visible' : 'hidden';
        if (typeof cb === "function") {
            $.bind(cb, el);
            cb.call(el, arguments);
        }
        return this;
    },

    toggle: function(el, cb){
        var func = getComputedStyle(el, null).display !== 'none' ? 'hide' : 'show';
        return $[func](el, cb);
    }
});

$.fn.extend({
    hide: function(){
        var callback;

        $.each(arguments, function(){
            if (typeof this === 'function') {
                callback = this;
            }
        });

        return this.each(function(){
            $.hide(this, callback);
        });
    },

    show: function(){
        var callback;

        $.each(arguments, function(){
            if (typeof this === 'function') {
                callback = this;
            }
        });

        return this.each(function(){
            $.show(this, callback);
        });
    },

    visible: function(mode, cb){
        return this.each(function(){
            $.visible(this, mode, cb);
        });
    },

    toggle: function(cb){
        return this.each(function(){
            $.toggle(this, cb);
        });
    },

    hidden: function(val, cb){
        return this.each(function(){
            $.hidden(this, val, cb);
        });
    }
});



// Source: src/effects.js

/* global $, not, isVisible */

$.extend({
    fx: {
        off: false
    }
});

$.fn.extend({
    fadeIn: function(dur, easing, cb){
        return this.each(function(){
            var el = this;
            var $el = $(el);
            var visible = !(!isVisible(el) || (isVisible(el) && +($el.style('opacity')) === 0));

            if (visible) {
                return this;
            }

            if (not(dur) && not(easing) && not(cb)) {
                cb = null;
                dur = $.animation.duration;
            } else if (typeof dur === "function") {
                cb = dur;
                dur = $.animation.duration;
            }

            if (typeof easing === "function") {
                cb = easing;
                easing = $.animation.ease;
            }

            if ($.fx.off) {
                dur = 0;
            }

            var originDisplay = $el.origin("display", undefined, 'block');

            el.style.opacity = "0";
            el.style.display = originDisplay;

            return $.animate({
                el: el,
                draw: {
                    opacity: 1
                },
                dur: dur,
                ease: easing,
                onDone: function(){
                    if (typeof cb === 'function') {
                        $.proxy(cb, this)();
                    }
                }
            });
        });
    },

    fadeOut: function(dur, easing, cb){
        return this.each(function(){
            var el = this;
            var $el = $(el);

            if ( !isVisible(el) ) return ;

            if (not(dur) && not(easing) && not(cb)) {
                cb = null;
                dur = $.animation.duration;
            } else
            if (typeof dur === "function") {
                cb = dur;
                dur = $.animation.duration;
            }
            if (typeof easing === "function") {
                cb = easing;
                easing = $.animation.ease;
            }

            $el.origin("display", $el.style('display'));

            return $.animate({
                el: el,
                draw: {
                    opacity: 0
                },
                dur: dur,
                ease: easing,
                onDone: function(){
                    this.style.display = 'none';

                    if (typeof cb === 'function') {
                        $.proxy(cb, this)();
                    }
                }
            });
        });
    },

    slideUp: function(dur, easing, cb){
        return this.each(function(){
            var el = this;
            var $el = $(el);
            var currHeight;

            if ($el.height() === 0) return ;

            if (not(dur) && not(easing) && not(cb)) {
                cb = null;
                dur = $.animation.duration;
            } else
            if (typeof dur === "function") {
                cb = dur;
                dur = $.animation.duration;
            }
            if (typeof easing === "function") {
                cb = easing;
                easing = $.animation.ease;
            }

            currHeight = $el.height();
            $el.origin("height", currHeight);
            $el.origin("display", $(el).style('display'));

            $el.css({
                overflow: "hidden"
            });

            return $.animate({
                el: el,
                draw: {
                    height: 0
                },
                dur: dur,
                ease: easing,
                onDone: function(){
                    $el.hide().removeStyleProperty("overflow, height");
                    if (typeof cb === 'function') {
                        $.proxy(cb, this)();
                    }
                }
            });
        });
    },

    slideDown: function(dur, easing, cb){
        return this.each(function(){
            var el = this;
            var $el = $(el);
            var targetHeight, originDisplay;

            if (not(dur) && not(easing) && not(cb)) {
                cb = null;
                dur = $.animation.duration;
            } else
            if (typeof dur === "function") {
                cb = dur;
                dur = $.animation.duration;
            }
            if (typeof easing === "function") {
                cb = easing;
                easing = $.animation.ease;
            }

            $el.show().visible(false);
            targetHeight = +$el.origin("height", undefined, $el.height());
            if (parseInt(targetHeight) === 0) {
                targetHeight = el.scrollHeight;
            }
            originDisplay = $el.origin("display", $el.style('display'), "block");
            $el.height(0).visible(true);

            $el.css({
                overflow: "hidden",
                display: originDisplay === "none" ? "block" : originDisplay
            });

            return $.animate({
                el: el,
                draw: {
                    height: targetHeight
                },
                dur: dur,
                ease: easing,
                onDone: function(){
                    $(el).removeStyleProperty("overflow, height, visibility");
                    if (typeof cb === 'function') {
                        $.proxy(cb, this)();
                    }
                }
            });
        });
    },

    moveTo: function(x, y, dur, easing, cb){
        var draw = {
            top: y,
            left: x
        };

        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            easing = $.animation.ease;
        }

        if (typeof easing === "function") {
            cb = easing;
            easing = $.animation.ease;
        }

        return this.each(function(){
            $.animate({
                el: this,
                draw: draw,
                dur: dur,
                ease: easing,
                onDone: cb
            });
        });
    },

    centerTo: function(x, y, dur, easing, cb){
        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            easing = $.animation.ease;
        }

        if (typeof easing === "function") {
            cb = easing;
            easing = $.animation.ease;
        }

        return this.each(function(){
            var draw = {
                left: x - this.clientWidth / 2,
                top: y - this.clientHeight / 2
            };
            $.animate({
                el: this,
                draw: draw,
                dur: dur,
                ease: easing,
                onDone: cb
            });
        });
    },

    colorTo: function(color, dur, easing, cb){
        var draw = {
            color: color
        };

        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            easing = $.animation.ease;
        }

        if (typeof easing === "function") {
            cb = easing;
            easing = $.animation.ease;
        }

        return this.each(function(){
            $.animate({
                el: this,
                draw: draw,
                dur: dur,
                ease: easing,
                onDone: cb
            });
        });
    },

    backgroundTo: function(color, dur, easing, cb){
        var draw = {
            backgroundColor: color
        };

        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            easing = $.animation.ease;
        }

        if (typeof easing === "function") {
            cb = easing;
            easing = $.animation.ease;
        }

        return this.each(function(){
            $.animate({
                el: this,
                draw: draw,
                dur: dur,
                ease: easing,
                onDone: cb
            });
        });
    }
});

// Source: src/init.js

/* global $, isArrayLike, isPlainObject, hasProp, str2arr */

$.init = function(sel, ctx){
    var parsed;
    var that = this;

    if (typeof sel === "string") {
        sel = sel.trim();
    }

    this.uid = $.uniqueId();

    if (!sel) {
        return this;
    }

    if (typeof sel === "function") {
        return $.ready(sel);
    }

    if (sel instanceof Element) {
        this.push(sel);
        return this;
    }

    if (sel instanceof $) {
        $.each(sel, function(){
            that.push(this);
        });
        return this;
    }

    if (sel === "window") sel = window;
    if (sel === "document") sel = document;
    if (sel === "body") sel = document.body;
    if (sel === "html") sel = document.documentElement;
    if (sel === "doctype") sel = document.doctype;
    if (sel && (sel.nodeType || sel.self === window)) {
        this.push(sel);
        return this;
    }

    if (isArrayLike(sel)) {
        $.each(sel, function(){
            $(this).each(function(){
                that.push(this);
            });
        });
        return this;
    }

    if (typeof sel !== "string" && (sel.self && sel.self !== window)) {
        return this;
    }

    if (sel === "#" || sel === ".") {
        console.error("Selector can't be # or .") ;
        return this;
    }

    if (sel[0] === "@") {

        $("[data-role]").each(function(){
            var roles = str2arr($(this).attr("data-role"), ",");
            if (roles.indexOf(sel.slice(1)) > -1) {
                that.push(this);
            }
        });

    } else {

        parsed = $.parseHTML(sel);

        if (parsed.length === 1 && parsed[0].nodeType === 3) { // Must be a text node -> css sel
            try {
                [].push.apply(this, document.querySelectorAll(sel));
            } catch (e) {
                //console.error(sel + " is not a valid selector");
            }
        } else {
            $.merge(this, parsed);
        }
    }

    if (ctx !== undefined) {
        if (ctx instanceof $) {
            this.each(function () {
                $(ctx).append(that);
            });
        } else if (ctx instanceof HTMLElement) {
            $(ctx).append(that);
        } else {
            if (isPlainObject(ctx)) {
                $.each(this,function(){
                    for(var name in ctx) {
                        if (hasProp(ctx, name))
                            this.setAttribute(name, ctx[name]);
                    }
                });
            }
        }
    }

    return this;
};

$.init.prototype = $.fn;


// Source: src/populate.js

/* global Promise, $ */

var _$ = window.$;

$.Promise = Promise;

window.m4q = $;

if (typeof window.$ === "undefined") {
    window.$ = $;
}

$.global = function(){
    _$ = window.$;
    window.$ = $;
};

$.noConflict = function() {
    if ( window.$ === $ ) {
        window.$ = _$;
    }

    return $;
};

}(window));



(function($) {
    'use strict';

    var meta_init = $.meta('metro4:init').attr("content");
    var meta_locale = $.meta('metro4:locale').attr("content");
    var meta_week_start = $.meta('metro4:week_start').attr("content");
    var meta_date_format = $.meta('metro4:date_format').attr("content");
    var meta_date_format_input = $.meta('metro4:date_format_input').attr("content");
    var meta_animation_duration = $.meta('metro4:animation_duration').attr("content");
    var meta_callback_timeout = $.meta('metro4:callback_timeout').attr("content");
    var meta_timeout = $.meta('metro4:timeout').attr("content");
    var meta_scroll_multiple = $.meta('metro4:scroll_multiple').attr("content");
    var meta_cloak = $.meta('metro4:cloak').attr("content");
    var meta_cloak_duration = $.meta('metro4:cloak_duration').attr("content");
    var meta_global_common = $.meta('metro4:global_common').attr("content");
    var meta_blur_image = $.meta('metro4:blur_image').attr("content");

    if (window.METRO_BLUR_IMAGE === undefined) {
        window.METRO_BLUR_IMAGE = meta_blur_image !== undefined ? JSON.parse(meta_global_common) : false;
    }

    if (window.METRO_GLOBAL_COMMON === undefined) {
        window.METRO_GLOBAL_COMMON = meta_global_common !== undefined ? JSON.parse(meta_global_common) : false;
    }

    var meta_jquery = $.meta('metro4:jquery').attr("content"); //undefined
    window.jquery_present = typeof jQuery !== "undefined";
    if (window.METRO_JQUERY === undefined) {
        window.METRO_JQUERY = meta_jquery !== undefined ? JSON.parse(meta_jquery) : true;
    }
    window.useJQuery = window.jquery_present && window.METRO_JQUERY;


    /* Added by Ken Kitay https://github.com/kens-code*/
    var meta_about = $.meta('metro4:about').attr("content");
    if (window.METRO_SHOW_ABOUT === undefined) {
        window.METRO_SHOW_ABOUT = meta_about !== undefined ? JSON.parse(meta_about) : true;
    }
    /* --- end ---*/

    var meta_compile = $.meta('metro4:compile').attr("content");
    if (window.METRO_SHOW_COMPILE_TIME === undefined) {
        window.METRO_SHOW_COMPILE_TIME = meta_compile !== undefined ? JSON.parse(meta_compile) : true;
    }

    if (window.METRO_INIT === undefined) {
        window.METRO_INIT = meta_init !== undefined ? JSON.parse(meta_init) : true;
    }

    if (window.METRO_DEBUG === undefined) {window.METRO_DEBUG = true;}

    if (window.METRO_WEEK_START === undefined) {
        window.METRO_WEEK_START = meta_week_start !== undefined ? parseInt(meta_week_start) : 0;
    }
    if (window.METRO_DATE_FORMAT === undefined) {
        window.METRO_DATE_FORMAT = meta_date_format !== undefined ? meta_date_format : "%Y-%m-%d";
    }
    if (window.METRO_DATE_FORMAT_INPUT === undefined) {
        window.METRO_DATE_FORMAT_INPUT = meta_date_format_input !== undefined ? meta_date_format_input : "%Y-%m-%d";
    }
    if (window.METRO_LOCALE === undefined) {
        window.METRO_LOCALE = meta_locale !== undefined ? meta_locale : 'en-US';
    }
    if (window.METRO_ANIMATION_DURATION === undefined) {
        window.METRO_ANIMATION_DURATION = meta_animation_duration !== undefined ? parseInt(meta_animation_duration) : 100;
    }
    if (window.METRO_CALLBACK_TIMEOUT === undefined) {
        window.METRO_CALLBACK_TIMEOUT = meta_callback_timeout !== undefined ? parseInt(meta_callback_timeout) : 500;
    }
    if (window.METRO_TIMEOUT === undefined) {
        window.METRO_TIMEOUT = meta_timeout !== undefined ? parseInt(meta_timeout) : 2000;
    }
    if (window.METRO_SCROLL_MULTIPLE === undefined) {
        window.METRO_SCROLL_MULTIPLE = meta_scroll_multiple !== undefined ? parseInt(meta_scroll_multiple) : 20;
    }
    if (window.METRO_CLOAK_REMOVE === undefined) {
        window.METRO_CLOAK_REMOVE = meta_cloak !== undefined ? (""+meta_cloak).toLowerCase() : "fade";
    }
    if (window.METRO_CLOAK_DURATION === undefined) {
        window.METRO_CLOAK_DURATION = meta_cloak_duration !== undefined ? parseInt(meta_cloak_duration) : 300;
    }

    if (window.METRO_HOTKEYS_FILTER_CONTENT_EDITABLE === undefined) {window.METRO_HOTKEYS_FILTER_CONTENT_EDITABLE = true;}
    if (window.METRO_HOTKEYS_FILTER_INPUT_ACCEPTING_ELEMENTS === undefined) {window.METRO_HOTKEYS_FILTER_INPUT_ACCEPTING_ELEMENTS = true;}
    if (window.METRO_HOTKEYS_FILTER_TEXT_INPUTS === undefined) {window.METRO_HOTKEYS_FILTER_TEXT_INPUTS = true;}
    if (window.METRO_HOTKEYS_BUBBLE_UP === undefined) {window.METRO_HOTKEYS_BUBBLE_UP = false;}
    if (window.METRO_THROWS === undefined) {window.METRO_THROWS = true;}

    window.METRO_MEDIA = [];

}(m4q));


/* global jQuery, define */
/* Metro 4 Core */
(function( factory ) {
    if ( typeof define === 'function' && define.amd ) {
        define('metro4', factory );
    } else {
        factory( );
    }
}(function( ) {
    'use strict';

    var $ = m4q; // eslint-disable-line

    if (typeof m4q === 'undefined') {
        throw new Error('Metro 4 requires m4q helper!');
    }

    if (!('MutationObserver' in window)) {
        throw new Error('Metro 4 requires MutationObserver!');
    }

    var isTouch = (('ontouchstart' in window) || (navigator["MaxTouchPoints"] > 0) || (navigator["msMaxTouchPoints"] > 0));

    var normalizeComponentName = function(name){
        return typeof name !== "string" ? undefined : name.replace(/-/g, "").toLowerCase();
    };

    var Metro = {

        version: "4.4.3",
        compileTime: "12/09/2021 08:54:38",
        buildNumber: "",
        isTouchable: isTouch,
        fullScreenEnabled: document.fullscreenEnabled,
        sheet: null,


        controlsPosition: {
            INSIDE: "inside",
            OUTSIDE: "outside"
        },

        groupMode: {
            ONE: "one",
            MULTI: "multi"
        },

        aspectRatio: {
            HD: "hd",
            SD: "sd",
            CINEMA: "cinema"
        },

        fullScreenMode: {
            WINDOW: "window",
            DESKTOP: "desktop"
        },

        position: {
            TOP: "top",
            BOTTOM: "bottom",
            LEFT: "left",
            RIGHT: "right",
            TOP_RIGHT: "top-right",
            TOP_LEFT: "top-left",
            BOTTOM_LEFT: "bottom-left",
            BOTTOM_RIGHT: "bottom-right",
            LEFT_BOTTOM: "left-bottom",
            LEFT_TOP: "left-top",
            RIGHT_TOP: "right-top",
            RIGHT_BOTTOM: "right-bottom"
        },

        popoverEvents: {
            CLICK: "click",
            HOVER: "hover",
            FOCUS: "focus"
        },

        stepperView: {
            SQUARE: "square",
            CYCLE: "cycle",
            DIAMOND: "diamond"
        },

        listView: {
            LIST: "list",
            CONTENT: "content",
            ICONS: "icons",
            ICONS_MEDIUM: "icons-medium",
            ICONS_LARGE: "icons-large",
            TILES: "tiles",
            TABLE: "table"
        },

        events: {
            click: 'click',
            start: isTouch ? 'touchstart' : 'mousedown',
            stop: isTouch ? 'touchend' : 'mouseup',
            move: isTouch ? 'touchmove' : 'mousemove',
            enter: isTouch ? 'touchstart' : 'mouseenter',

            startAll: 'mousedown touchstart',
            stopAll: 'mouseup touchend',
            moveAll: 'mousemove touchmove',

            leave: 'mouseleave',
            focus: 'focus',
            blur: 'blur',
            resize: 'resize',
            keyup: 'keyup',
            keydown: 'keydown',
            keypress: 'keypress',
            dblclick: 'dblclick',
            input: 'input',
            change: 'change',
            cut: 'cut',
            paste: 'paste',
            scroll: 'scroll',
            mousewheel: 'mousewheel',
            inputchange: "change input propertychange cut paste copy drop",
            dragstart: "dragstart",
            dragend: "dragend",
            dragenter: "dragenter",
            dragover: "dragover",
            dragleave: "dragleave",
            drop: 'drop',
            drag: 'drag'
        },

        keyCode: {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            BREAK: 19,
            CAPS: 20,
            ESCAPE: 27,
            SPACE: 32,
            PAGEUP: 33,
            PAGEDOWN: 34,
            END: 35,
            HOME: 36,
            LEFT_ARROW: 37,
            UP_ARROW: 38,
            RIGHT_ARROW: 39,
            DOWN_ARROW: 40,
            COMMA: 188
        },

        media_queries: {
            FS: "(min-width: 0px)",
            XS: "(min-width: 360px)",
            SM: "(min-width: 576px)",
            MD: "(min-width: 768px)",
            LG: "(min-width: 992px)",
            XL: "(min-width: 1200px)",
            XXL: "(min-width: 1452px)"
        },

        media_sizes: {
            FS: 0,
            XS: 360,
            SM: 576,
            LD: 640,
            MD: 768,
            LG: 992,
            XL: 1200,
            XXL: 1452
        },

        media_mode: {
            FS: "fs",
            XS: "xs",
            SM: "sm",
            MD: "md",
            LG: "lg",
            XL: "xl",
            XXL: "xxl"
        },

        media_modes: ["fs","xs","sm","md","lg","xl","xxl"],

        actions: {
            REMOVE: 1,
            HIDE: 2
        },

        hotkeys: {},
        locales: {},
        utils: {},
        colors: {},
        dialog: null,
        pagination: null,
        md5: null,
        storage: null,
        export: null,
        animations: null,
        cookie: null,
        template: null,
        defaults: {},

        about: function(){
            var content =
                "<h3>About</h3>" +
                "<hr>" +
                "<div><b>Metro 4</b> - v" + Metro.version +". "+ Metro.showCompileTime() + "</div>" +
                "<div><b>M4Q</b> - " + m4q.version + "</div>";
            Metro.infobox.create(content)
        },

        info: function(){
            console.info("Metro 4 - v" + Metro.version +". "+ Metro.showCompileTime());
            console.info("m4q - " + m4q.version);
        },

        showCompileTime: function(){
            return "Built at: " + Metro.compileTime;
        },

        aboutDlg: function(){
            alert("Metro 4 - v" + Metro.version +". "+ Metro.showCompileTime());
        },

        ver: function(){
            return Metro.version;
        },

        build: function(){
            return Metro.build;
        },

        compile: function(){
            return Metro.compileTime;
        },

        observe: function(){
            var observer, observerCallback;
            var observerConfig = {
                childList: true,
                attributes: true,
                subtree: true
            };
            observerCallback = function(mutations){
                mutations.map(function(mutation){
                    if (mutation.type === 'attributes' && mutation.attributeName !== "data-role") {
                        if (mutation.attributeName === 'data-hotkey') {
                            Metro.initHotkeys([mutation.target], true);
                        } else {
                            var element = $(mutation.target);
                            var mc = element.data('metroComponent');
                            var attr = mutation.attributeName, newValue = element.attr(attr), oldValue = mutation.oldValue;

                            if (mc !== undefined) {
                                element.fire("attr-change", {
                                    attr: attr,
                                    newValue: newValue,
                                    oldValue: oldValue,
                                    __this: element[0]
                                });

                                $.each(mc, function(){
                                    var plug = Metro.getPlugin(element, this);
                                    if (plug && typeof plug.changeAttribute === "function") {
                                        plug.changeAttribute(attr, newValue, oldValue);
                                    }
                                });
                            }
                        }
                    } else

                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        var i, widgets = [];
                        var $node, node, nodes = mutation.addedNodes;

                        if (nodes.length) {
                            for(i = 0; i < nodes.length; i++) {
                                node = nodes[i];
                                $node = $(node);

                                if ($node.attr("data-role") !== undefined) {
                                    widgets.push(node);
                                }

                                $.each($node.find("[data-role]"), function(){
                                    var o = this;
                                    if (widgets.indexOf(o) !== -1) {
                                        return;
                                    }
                                    widgets.push(o);
                                });
                            }

                            if (widgets.length) Metro.initWidgets(widgets, "observe");
                        }

                    } else  {
                        //console.log(mutation);
                    }
                });
            };
            observer = new MutationObserver(observerCallback);
            observer.observe($("html")[0], observerConfig);
        },

        init: function(){
            var widgets = $("[data-role]");
            var hotkeys = $("[data-hotkey]");
            var html = $("html");
            var that = this;

            if (window.METRO_BLUR_IMAGE) {
                html.addClass("use-blur-image");
            }

            if (window.METRO_SHOW_ABOUT) Metro.info(true);

            if (isTouch === true) {
                html.addClass("metro-touch-device");
            } else {
                html.addClass("metro-no-touch-device");
            }

            Metro.sheet = this.utils.newCssSheet();

            this.utils.addCssRule(Metro.sheet, "*, *::before, *::after", "box-sizing: border-box;");

            window.METRO_MEDIA = [];
            $.each(Metro.media_queries, function(key, query){
                if (that.utils.media(query)) {
                    window.METRO_MEDIA.push(Metro.media_mode[key]);
                }
            });

            Metro.observe();

            Metro.initHotkeys(hotkeys);
            Metro.initWidgets(widgets, "init");

            if (window.METRO_CLOAK_REMOVE !== "fade") {
                $(".m4-cloak").removeClass("m4-cloak");
                $(window).fire("metro-initiated");
            } else {
                $(".m4-cloak").animate({
                    draw: {
                        opacity: 1
                    },
                    dur: 300,
                    onDone: function(){
                        $(".m4-cloak").removeClass("m4-cloak");
                        $(window).fire("metro-initiated");
                    }
                });
            }
        },

        initHotkeys: function(hotkeys, redefine){
            $.each(hotkeys, function(){
                var element = $(this);
                var hotkey = element.attr('data-hotkey') ? element.attr('data-hotkey').toLowerCase() : false;
                var fn = element.attr('data-hotkey-func') ? element.attr('data-hotkey-func') : false;

                if (hotkey === false) {
                    return;
                }

                if (element.data('hotKeyBonded') === true && redefine !== true) {
                    return;
                }

                Metro.hotkeys[hotkey] = [this, fn];
                element.data('hotKeyBonded', true);
                element.fire("hot-key-bonded", {
                    __this: element[0],
                    hotkey: hotkey,
                    fn: fn
                });
            });
        },

        initWidgets: function(widgets) {
            var that = this;

            $.each(widgets, function () {
                var $this = $(this), roles;

                if (!this.hasAttribute("data-role")) {
                    return ;
                }

                roles = $this.attr('data-role').split(/\s*,\s*/);

                roles.map(function (func) {

                    var $$ = that.utils.$();
                    var _func = normalizeComponentName(func);

                    if ($$.fn[_func] !== undefined && $this.attr("data-role-"+_func) === undefined) {
                        try {
                            $$.fn[_func].call($this);
                            $this.attr("data-role-"+_func, true);

                            var mc = $this.data('metroComponent');

                            if (mc === undefined) {
                                mc = [_func];
                            } else {
                                mc.push(_func);
                            }
                            $this.data('metroComponent', mc);

                            $this.fire("create", {
                                __this: $this[0],
                                name: _func
                            });
                            $(document).fire("component-create", {
                                element: $this[0],
                                name: _func
                            });
                        } catch (e) {
                            console.error("Error creating component " + func + " for ", $this[0]);
                            throw e;
                        }
                    }
                });
            });
        },

        plugin: function(name, object){
            var _name = normalizeComponentName(name);

            var register = function($){
                $.fn[_name] = function( options ) {
                    return this.each(function() {
                        $.data( this, _name, Object.create(object).init(options, this ));
                    });
                };
            }

            register(m4q);

            if (window.useJQuery) {
                register(jQuery);
            }
        },

        pluginExists: function(name){
            var $ = window.useJQuery ? jQuery : m4q;
            return typeof $.fn[normalizeComponentName(name)] === "function";
        },

        destroyPlugin: function(element, name){
            var p, mc;
            var el = $(element);
            var _name = normalizeComponentName(name);

            p = Metro.getPlugin(el, _name);

            if (typeof p === 'undefined') {
                console.warn("Component "+name+" can not be destroyed: the element is not a Metro 4 component.");
                return ;
            }

            if (typeof p['destroy'] !== 'function') {
                console.warn("Component "+name+" can not be destroyed: method destroy not found.");
                return ;
            }

            p['destroy']();
            mc = el.data("metroComponent");
            this.utils.arrayDelete(mc, _name);
            el.data("metroComponent", mc);
            $.removeData(el[0], _name);
            el.removeAttr("data-role-"+_name);
        },

        destroyPluginAll: function(element){
            var el = $(element);
            var mc = el.data("metroComponent");

            if (mc !== undefined && mc.length > 0) $.each(mc, function(){
                Metro.destroyPlugin(el[0], this);
            });
        },

        noop: function(){},
        noop_true: function(){return true;},
        noop_false: function(){return false;},

        requestFullScreen: function(element){
            if (element["mozRequestFullScreen"]) {
                element["mozRequestFullScreen"]();
            } else if (element["webkitRequestFullScreen"]) {
                element["webkitRequestFullScreen"]();
            } else if (element["msRequestFullscreen"]) {
                element["msRequestFullscreen"]();
            } else {
                element.requestFullscreen().catch( function(err){
                    console.warn("Error attempting to enable full-screen mode: "+err.message+" "+err.name);
                });
            }
        },

        exitFullScreen: function(){
            if (document["mozCancelFullScreen"]) {
                document["mozCancelFullScreen"]();
            }
            else if (document["webkitCancelFullScreen"]) {
                document["webkitCancelFullScreen"]();
            }
            else if (document["msExitFullscreen"]) {
                document["msExitFullscreen"]();
            } else {
                document.exitFullscreen().catch( function(err){
                    console.warn("Error attempting to disable full-screen mode: "+err.message+" "+err.name);
                });
            }
        },

        inFullScreen: function(){
            var fsm = (document.fullscreenElement || document["webkitFullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"]);
            return fsm !== undefined;
        },

        $: function(){
            return window.useJQuery ? jQuery : m4q;
        },

        get$el: function(el){
            return Metro.$()($(el)[0]);
        },

        get$elements: function(el){
            return Metro.$()($(el));
        },

        getPlugin: function(el, name){
            var _name = normalizeComponentName(name);
            var $el = Metro.get$el(el);
            return $el.length ? $el.data(_name) : undefined;
        },

        makePlugin: function(el, name, options){
            var _name = normalizeComponentName(name);
            var $el = Metro.get$elements(el);
            return $el.length && typeof $el[_name] === "function" ? $el[_name](options) : undefined;
        },

        Component: function(nameName, compObj){
            var name = normalizeComponentName(nameName);
            var Utils = Metro.utils;
            var component = $.extend({name: name}, {
                _super: function(el, options, defaults, setup){
                    var self = this;

                    this.elem = el;
                    this.element = $(el);
                    this.options = $.extend( {}, defaults, options );
                    this.component = this.elem;

                    this._setOptionsFromDOM();
                    this._runtime();

                    if (setup && typeof setup === 'object') {
                        $.each(setup, function(key, val){
                            self[key] = val;
                        })
                    }

                    this._createExec();
                },

                _setOptionsFromDOM: function(){
                    var element = this.element, o = this.options;

                    $.each(element.data(), function(key, value){
                        if (key in o) {
                            try {
                                o[key] = JSON.parse(value);
                            } catch (e) {
                                o[key] = value;
                            }
                        }
                    });
                },

                _runtime: function(){
                    var element = this.element, mc;
                    var roles = (element.attr("data-role") || "").toArray(",").map(function(v){
                        return normalizeComponentName(v);
                    }).filter(function(v){
                        return v.trim() !== "";
                    });

                    if (!element.attr('data-role-'+this.name)) {
                        element.attr("data-role-"+this.name, true);
                        if (roles.indexOf(this.name) === -1) {
                            roles.push(this.name);
                            element.attr("data-role", roles.join(","));
                        }

                        mc = element.data('metroComponent');
                        if (mc === undefined) {
                            mc = [this.name];
                        } else {
                            mc.push(this.name);
                        }
                        element.data('metroComponent', mc);
                    }
                },

                _createExec: function(){
                    var that = this, timeout = this.options[this.name+'Deferred'];

                    if (timeout) {
                        setTimeout(function(){
                            that._create();
                        }, timeout)
                    } else {
                        that._create();
                    }
                },

                _fireEvent: function(eventName, data, log, noFire){
                    var element = this.element, o = this.options;
                    var _data;
                    var event = eventName.camelCase().capitalize();

                    data = $.extend({}, data, {__this: element[0]});

                    _data = data ? Object.values(data) : {};

                    if (log) {
                        console.warn(log);
                        console.warn("Event: " + "on"+eventName.camelCase().capitalize());
                        console.warn("Data: ", data);
                        console.warn("Element: ", element[0]);
                    }

                    if (noFire !== true)
                        element.fire(event.toLowerCase(), data);

                    return Utils.exec(o["on"+event], _data, element[0]);
                },

                _fireEvents: function(events, data, log, noFire){
                    var that = this, _events;

                    if (arguments.length === 0) {
                        return ;
                    }

                    if (arguments.length === 1) {

                        $.each(events, function () {
                            var ev = this;
                            that._fireEvent(ev.name, ev.data, ev.log, ev.noFire);
                        });

                        return Utils.objectLength(events);
                    }

                    if (!Array.isArray(events) && typeof events !== "string") {
                        return ;
                    }

                    _events = Array.isArray(events) ? events : events.toArray(",");

                    $.each(_events, function(){
                        that._fireEvent(this, data, log, noFire);
                    });
                },

                getComponent: function(){
                    return this.component;
                },

                getComponentName: function(){
                    return this.name;
                }
            }, compObj);

            Metro.plugin(name, component);

            return component;
        }
    };

    $(window).on(Metro.events.resize, function(){
        window.METRO_MEDIA = [];
        $.each(Metro.media_queries, function(key, query){
            if (Metro.utils.media(query)) {
                window.METRO_MEDIA.push(Metro.media_mode[key]);
            }
        });
    });

    window.Metro = Metro;

    if (window.METRO_INIT ===  true) {
        $(function(){
            Metro.init()
        });
    }

    return Metro;

}));



(function() {
    'use strict';

    if (typeof Array.shuffle !== "function") {
        Array.prototype.shuffle = function () {
            var currentIndex = this.length, temporaryValue, randomIndex;

            while (0 !== currentIndex) {

                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                temporaryValue = this[currentIndex];
                this[currentIndex] = this[randomIndex];
                this[randomIndex] = temporaryValue;
            }

            return this;
        };
    }

    if (typeof Array.clone !== "function") {
        Array.prototype.clone = function () {
            return this.slice(0);
        };
    }

    if (typeof Array.unique !== "function") {
        Array.prototype.unique = function () {
            var a = this.concat();
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j])
                        a.splice(j--, 1);
                }
            }

            return a;
        };
    }

    if (typeof Array.from !== "function") {
        Array.prototype.from = function(val) {
            var i, a = [];

            if (val.length === undefined && typeof val === "object") {
                return Object.values(val);
            }

            if (val.length !== undefined) {
                for(i = 0; i < val.length; i++) {
                    a.push(val[i]);
                }
                return a;
            }

            throw new Error("Value can not be converted to array");
        };
    }

    if (typeof Array.contains !== "function") {
        Array.prototype.contains = function(val, from){
            return this.indexOf(val, from) > -1;
        }
    }

    if (typeof Array.includes !== "function") {
        Array.prototype.includes = function(val, from){
            return this.indexOf(val, from) > -1;
        }
    }
}());


/* global Metro, METRO_WEEK_START */
(function(Metro) {
    'use strict';
    Date.prototype.getWeek = function (dowOffset) {
        var nYear, nday, newYear, day, daynum, weeknum;

        dowOffset = typeof dowOffset === "undefined" || isNaN(dowOffset) ? METRO_WEEK_START : typeof dowOffset === 'number' ? parseInt(dowOffset) : 0;
        newYear = new Date(this.getFullYear(),0,1);
        day = newYear.getDay() - dowOffset;
        day = (day >= 0 ? day : day + 7);
        daynum = Math.floor((this.getTime() - newYear.getTime() -
            (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;

        if(day < 4) {
            weeknum = Math.floor((daynum+day-1)/7) + 1;
            if(weeknum > 52) {
                nYear = new Date(this.getFullYear() + 1,0,1);
                nday = nYear.getDay() - dowOffset;
                nday = nday >= 0 ? nday : nday + 7;
                weeknum = nday < 4 ? 1 : 53;
            }
        }
        else {
            weeknum = Math.floor((daynum+day-1)/7);
        }
        return weeknum;
    };

    Date.prototype.getYear = function(){
        return this.getFullYear().toString().substr(-2);
    };

    Date.prototype.format = function(format, locale){

        if (locale === undefined) {
            locale = "en-US";
        }

        var cal = (Metro.locales !== undefined && Metro.locales[locale] !== undefined ? Metro.locales[locale] : Metro.locales["en-US"])['calendar'];

        var date = this;
        var nDay = date.getDay(),
            nDate = date.getDate(),
            nMonth = date.getMonth(),
            nYear = date.getFullYear(),
            nHour = date.getHours(),
            aDays = cal['days'],
            aMonths = cal['months'],
            aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
            isLeapYear = function() {
                return (nYear%4===0 && nYear%100!==0) || nYear%400===0;
            },
            getThursday = function() {
                var target = new Date(date);
                target.setDate(nDate - ((nDay+6)%7) + 3);
                return target;
            },
            zeroPad = function(nNum, nPad) {
                return ('' + (Math.pow(10, nPad) + nNum)).slice(1);
            };
        return format.replace(/(%[a-z])/gi, function(sMatch) {
            return {
                '%a': aDays[nDay].slice(0,3),
                '%A': aDays[nDay],
                '%b': aMonths[nMonth].slice(0,3),
                '%B': aMonths[nMonth],
                '%c': date.toUTCString(),
                '%C': Math.floor(nYear/100),
                '%d': zeroPad(nDate, 2),
                'dd': zeroPad(nDate, 2),
                '%e': nDate,
                '%F': date.toISOString().slice(0,10),
                '%G': getThursday().getFullYear(),
                '%g': ('' + getThursday().getFullYear()).slice(2),
                '%H': zeroPad(nHour, 2),
                // 'HH': zeroPad(nHour, 2),
                '%I': zeroPad((nHour+11)%12 + 1, 2),
                '%j': zeroPad(aDayCount[nMonth] + nDate + ((nMonth>1 && isLeapYear()) ? 1 : 0), 3),
                '%k': '' + nHour,
                '%l': (nHour+11)%12 + 1,
                '%m': zeroPad(nMonth + 1, 2),
                // 'mm': zeroPad(nMonth + 1, 2),
                '%M': zeroPad(date.getMinutes(), 2),
                // 'MM': zeroPad(date.getMinutes(), 2),
                '%p': (nHour<12) ? 'AM' : 'PM',
                '%P': (nHour<12) ? 'am' : 'pm',
                '%s': Math.round(date.getTime()/1000),
                // 'ss': Math.round(date.getTime()/1000),
                '%S': zeroPad(date.getSeconds(), 2),
                // 'SS': zeroPad(date.getSeconds(), 2),
                '%u': nDay || 7,
                '%V': (function() {
                    var target = getThursday(),
                        n1stThu = target.valueOf();
                    target.setMonth(0, 1);
                    var nJan1 = target.getDay();
                    if (nJan1!==4) target.setMonth(0, 1 + ((4-nJan1)+7)%7);
                    return zeroPad(1 + Math.ceil((n1stThu-target)/604800000), 2);
                })(),
                '%w': '' + nDay,
                '%x': date.toLocaleDateString(),
                '%X': date.toLocaleTimeString(),
                '%y': ('' + nYear).slice(2),
                // 'yy': ('' + nYear).slice(2),
                '%Y': nYear,
                // 'YYYY': nYear,
                '%z': date.toTimeString().replace(/.+GMT([+-]\d+).+/, '$1'),
                '%Z': date.toTimeString().replace(/.+\((.+?)\)$/, '$1')
            }[sMatch] || sMatch;
        });
    };

    Date.prototype.addHours = function(n) {
        this.setTime(this.getTime() + (n*60*60*1000));
        return this;
    };

    Date.prototype.addDays = function(n) {
        this.setDate(this.getDate() + (n));
        return this;
    };

    Date.prototype.addMonths = function(n) {
        this.setMonth(this.getMonth() + (n));
        return this;
    };

    Date.prototype.addYears = function(n) {
        this.setFullYear(this.getFullYear() + (n));
        return this;
    };
}(Metro));


(function() {
    'use strict';

    /**
     * Number.prototype.format(n, x, s, c)
     *
     * @param  n: length of decimal
     * @param  x: length of whole part
     * @param  s: sections delimiter
     * @param  c: decimal delimiter
     */
    Number.prototype.format = function(n, x, s, c) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
            num = this.toFixed(Math.max(0, ~~n));

        return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    };
}());


(function() {
    'use strict';

    if ( typeof Object.create !== 'function' ) {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    if (typeof Object.values !== 'function') {
        Object.values = function(obj) {
            return Object.keys(obj).map(function(e) {
                return obj[e]
            });
        }
    }
}());


/* global Metro */
(function(Metro, $) {
    'use strict';

    String.prototype.camelCase = function(){
        return $.camelCase(this);
    };

    String.prototype.dashedName = function(){
        return $.dashedName(this);
    };

    String.prototype.shuffle = function(){
        var _shuffle = function (a) {
            var currentIndex = a.length, temporaryValue, randomIndex;

            while (0 !== currentIndex) {

                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                temporaryValue = a[currentIndex];
                a[currentIndex] = a[randomIndex];
                a[randomIndex] = temporaryValue;
            }

            return a;
        };

        return _shuffle(this.split("")).join("");
    }

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    String.prototype.contains = function() {
        return !!~String.prototype.indexOf.apply(this, arguments);
    };

    if (typeof String.includes !== "function") {
        String.prototype.includes = function(){
            return !!~String.prototype.indexOf.apply(this, arguments);
        }
    }

    String.prototype.toDate = function(format, locale) {
        var result;
        var normalized, normalizedFormat, formatItems, dateItems, checkValue;
        var monthIndex, dayIndex, yearIndex, hourIndex, minutesIndex, secondsIndex;
        var year, month, day, hour, minute, second;
        var parsedMonth;

        locale = locale || "en-US";

        var monthNameToNumber = function(month){
            var d, months, index, i;
            var Locales = Metro.locales;

            if (typeof month === "undefined" || month === null) {
                return -1;
            }

            month = month.substr(0, 3);

            if (
                locale !== undefined
                && locale !== "en-US"
                && Locales !== undefined
                && Locales[locale] !== undefined
                && Locales[locale]['calendar'] !== undefined
                && Locales[locale]['calendar']['months'] !== undefined
            ) {
                months = Locales[locale]['calendar']['months'];
                for(i = 12; i < months.length; i++) {
                    if (months[i].toLowerCase() === month.toLowerCase()) {
                        index = i - 12;
                        break;
                    }
                }
                month = Locales["en-US"]['calendar']['months'][index];
            }

            d = Date.parse(month + " 1, 1972");
            if(!isNaN(d)){
                return new Date(d).getMonth() + 1;
            }
            return -1;
        };

        if (format === undefined || format === null || format === "") {
            return new Date(this);
        }

        /* eslint-disable-next-line */
        normalized      = this.replace(/[\/,.:\s]/g, '-');
        /* eslint-disable-next-line */
        normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9%]/g, '-');
        formatItems     = normalizedFormat.split('-');
        dateItems       = normalized.split('-');
        checkValue      = normalized.replace(/-/g,"");

        if (checkValue.trim() === "") {
            return "Invalid Date";
        }

        monthIndex  = formatItems.indexOf("mm") > -1 ? formatItems.indexOf("mm") : formatItems.indexOf("%m");
        dayIndex    = formatItems.indexOf("dd") > -1 ? formatItems.indexOf("dd") : formatItems.indexOf("%d");
        yearIndex   = formatItems.indexOf("yyyy") > -1 ? formatItems.indexOf("yyyy") : formatItems.indexOf("yy") > -1 ? formatItems.indexOf("yy") : formatItems.indexOf("%y");
        hourIndex     = formatItems.indexOf("hh") > -1 ? formatItems.indexOf("hh") : formatItems.indexOf("%h");
        minutesIndex  = formatItems.indexOf("ii") > -1 ? formatItems.indexOf("ii") : formatItems.indexOf("mi") > -1 ? formatItems.indexOf("mi") : formatItems.indexOf("%i");
        secondsIndex  = formatItems.indexOf("ss") > -1 ? formatItems.indexOf("ss") : formatItems.indexOf("%s");

        if (monthIndex > -1 && dateItems[monthIndex] !== "") {
            if (isNaN(parseInt(dateItems[monthIndex]))) {
                dateItems[monthIndex] = monthNameToNumber(dateItems[monthIndex]);
                if (dateItems[monthIndex] === -1) {
                    return "Invalid Date";
                }
            } else {
                parsedMonth = parseInt(dateItems[monthIndex]);
                if (parsedMonth < 1 || parsedMonth > 12) {
                    return "Invalid Date";
                }
            }
        } else {
            return "Invalid Date";
        }

        year  = yearIndex >-1 && dateItems[yearIndex] !== "" ? dateItems[yearIndex] : null;
        month = monthIndex >-1 && dateItems[monthIndex] !== "" ? dateItems[monthIndex] : null;
        day   = dayIndex >-1 && dateItems[dayIndex] !== "" ? dateItems[dayIndex] : null;

        hour    = hourIndex >-1 && dateItems[hourIndex] !== "" ? dateItems[hourIndex] : null;
        minute  = minutesIndex>-1 && dateItems[minutesIndex] !== "" ? dateItems[minutesIndex] : null;
        second  = secondsIndex>-1 && dateItems[secondsIndex] !== "" ? dateItems[secondsIndex] : null;

        result = new Date(year,month-1,day,hour,minute,second);

        return result;
    };

    String.prototype.toArray = function(delimiter, type, format){
        var str = this;
        var a;

        type = type || "string";
        delimiter = delimiter || ",";
        format = format === undefined || format === null ? false : format;

        a = (""+str).split(delimiter);

        return a.map(function(s){
            var result;

            switch (type) {
                case "int":
                case "integer": result = isNaN(s) ? s.trim() : parseInt(s); break;
                case "number":
                case "float": result = isNaN(s) ? s : parseFloat(s); break;
                case "date": result = !format ? new Date(s) : s.toDate(format); break;
                default: result = s.trim();
            }

            return result;
        });
    };
}(Metro, m4q));


/* global jQuery, Metro */
(function(Metro, $) {
    'use strict';
    Metro.utils = {
        isVisible: function(element){
            var el = $(element)[0];
            return this.getStyleOne(el, "display") !== "none"
                && this.getStyleOne(el, "visibility") !== "hidden"
                && el.offsetParent !== null;
        },

        isUrl: function (val) {
            /* eslint-disable-next-line */
            return /^(\.\/|\.\.\/|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/.test(val);
        },

        isTag: function(val){
            /* eslint-disable-next-line */
            return /^<\/?[\w\s="/.':;#-\/\?]+>/gi.test(val);
        },

        isEmbedObject: function(val){
            var embed = ["iframe", "object", "embed", "video"];
            var result = false;
            $.each(embed, function(){
                if (typeof val === "string" && val.toLowerCase() === this) {
                    result = true;
                } else if (val.nodeType !== undefined && val.tagName.toLowerCase() === this) {
                    result = true;
                }
            });
            return result;
        },

        isVideoUrl: function(val){
            return /youtu\.be|youtube|twitch|vimeo/gi.test(val);
        },

        isDate: function(val, format){
            var result;

            if (this.isDateObject(val)) {
                return true;
            }

            if (this.isValue(format)) {
                result = String(val).toDate(format);
            } else {
                result = String(new Date(val));
            }

            return result !== "Invalid Date";
        },

        isDateObject: function(v){
            return typeof v === 'object' && v.getMonth !== undefined;
        },

        isInt: function(n){
            return !isNaN(n) && +n % 1 === 0;
        },

        isFloat: function(n){
            return (!isNaN(n) && +n % 1 !== 0) || /^\d*\.\d+$/.test(n);
        },

        isFunc: function(f){
            return this.isType(f, 'function');
        },

        isObject: function(o){
            return this.isType(o, 'object');
        },

        isType: function(o, t){
            if (!this.isValue(o)) {
                return false;
            }

            if (typeof o === t) {
                return o;
            }

            if ((""+t).toLowerCase() === 'tag' && this.isTag(o)) {
                return o;
            }

            if ((""+t).toLowerCase() === 'url' && this.isUrl(o)) {
                return o;
            }

            if ((""+t).toLowerCase() === 'array' && Array.isArray(o)) {
                return o;
            }

            if (this.isTag(o) || this.isUrl(o)) {
                return false;
            }

            if (typeof window[o] === t) {
                return window[o];
            }

            if (typeof o === 'string' && o.indexOf(".") === -1) {
                return false;
            }

            if (typeof o === 'string' && /[/\s([]+/gm.test(o)) {
                return false;
            }

            if (typeof o === "number" && t.toLowerCase() !== "number") {
                return false;
            }

            var ns = o.split(".");
            var i, context = window;

            for(i = 0; i < ns.length; i++) {
                context = context[ns[i]];
            }

            return typeof context === t ? context : false;
        },

        $: function(){
            return window.useJQuery ? jQuery : m4q;
        },

        isMetroObject: function(el, type){
            var $el = $(el), el_obj = Metro.getPlugin(el, type);

            if ($el.length === 0) {
                console.warn(type + ' ' + el + ' not found!');
                return false;
            }

            if (el_obj === undefined) {
                console.warn('Element not contain role '+ type +'! Please add attribute data-role="'+type+'" to element ' + el);
                return false;
            }

            return true;
        },

        isJQuery: function(el){
            return (typeof jQuery !== "undefined" && el instanceof jQuery);
        },

        isM4Q: function(el){
            return (typeof m4q !== "undefined" && el instanceof m4q);
        },

        isQ: function(el){
            return this.isJQuery(el) || this.isM4Q(el);
        },

        isIE11: function(){
            return !!window.MSInputMethodContext && !!document["documentMode"];
        },

        embedUrl: function(val){
            if (val.indexOf("youtu.be") !== -1) {
                val = "https://www.youtube.com/embed/" + val.split("/").pop();
            }
            return "<div class='embed-container'><iframe src='"+val+"'></iframe></div>";
        },

        elementId: function(prefix){
            return prefix+"-"+(new Date()).getTime()+$.random(1, 1000);
        },

        secondsToTime: function(secs) {
            var hours = Math.floor(secs / (60 * 60));

            var divisor_for_minutes = secs % (60 * 60);
            var minutes = Math.floor(divisor_for_minutes / 60);

            var divisor_for_seconds = divisor_for_minutes % 60;
            var seconds = Math.ceil(divisor_for_seconds);

            return {
                "h": hours,
                "m": minutes,
                "s": seconds
            };
        },

        secondsToFormattedString: function(time){
            var sec_num = parseInt(time, 10);
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}

            return [hours, minutes, seconds].join(":");
        },

        func: function(f){
            /* jshint -W054 */
            return new Function("a", f);
        },

        exec: function(f, args, context){
            var result;
            if (f === undefined || f === null) {return false;}
            var func = this.isFunc(f);

            if (func === false) {
                func = this.func(f);
            }

            try {
                result = func.apply(context, args);
            } catch (err) {
                result = null;
                if (window.METRO_THROWS === true) {
                    throw err;
                }
            }
            return result;
        },

        isOutsider: function(element) {
            var el = $(element);
            var inViewport;
            var clone = el.clone();

            clone.removeAttr("data-role").css({
                visibility: "hidden",
                position: "absolute",
                display: "block"
            });
            el.parent().append(clone);

            inViewport = this.inViewport(clone[0]);

            clone.remove();

            return !inViewport;
        },

        inViewport: function(el){
            var rect = this.rect(el);

            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        rect: function(el){
            return el.getBoundingClientRect();
        },

        getCursorPosition: function(el, e){
            var a = this.rect(el);
            return {
                x: this.pageXY(e).x - a.left - window.pageXOffset,
                y: this.pageXY(e).y - a.top - window.pageYOffset
            };
        },

        getCursorPositionX: function(el, e){
            return this.getCursorPosition(el, e).x;
        },

        getCursorPositionY: function(el, e){
            return this.getCursorPosition(el, e).y;
        },

        objectLength: function(obj){
            return Object.keys(obj).length;
        },

        percent: function(total, part, round_value){
            if (total === 0) {
                return 0;
            }
            var result = part * 100 / total;
            return round_value === true ? Math.round(result) : Math.round(result * 100) / 100;
        },

        objectShift: function(obj){
            var min = 0;
            $.each(obj, function(i){
                if (min === 0) {
                    min = i;
                } else {
                    if (min > i) {
                        min = i;
                    }
                }
            });
            delete obj[min];

            return obj;
        },

        objectDelete: function(obj, key){
            if (obj[key] !== undefined) delete obj[key];
        },

        arrayDeleteByMultipleKeys: function(arr, keys){
            keys.forEach(function(ind){
                delete arr[ind];
            });
            return arr.filter(function(item){
                return item !== undefined;
            });
        },

        arrayDelete: function(arr, val){
            if (arr.indexOf(val) > -1) arr.splice(arr.indexOf(val), 1);
        },

        arrayDeleteByKey: function(arr, key){
            arr.splice(key, 1);
        },

        nvl: function(data, other){
            return data === undefined || data === null ? other : data;
        },

        objectClone: function(obj){
            var copy = {};
            for(var key in obj) {
                if ($.hasProp(obj, key)) {
                    copy[key] = obj[key];
                }
            }
            return copy;
        },

        github: function(repo, callback){
            var that = this;
            $.json('https://api.github.com/repos/' + repo).then(function(data){
                that.exec(callback, [data]);
            });
        },

        detectIE: function() {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }

            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }

            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }

            // other browser
            return false;
        },

        detectChrome: function(){
            return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        },

        encodeURI: function(str){
            return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
        },

        pageHeight: function(){
            var body = document.body,
                html = document.documentElement;

            return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
        },

        cleanPreCode: function(selector){
            var els = Array.prototype.slice.call(document.querySelectorAll(selector), 0);

            els.forEach(function(el){
                var txt = el.textContent
                    .replace(/^[\r\n]+/, "")	// strip leading newline
                    .replace(/\s+$/g, "");

                if (/^\S/gm.test(txt)) {
                    el.textContent = txt;
                    return;
                }

                var mat, str, re = /^[\t ]+/gm, len, min = 1e3;

                /* jshint -W084 */
                /* eslint-disable-next-line */
                while (mat = re.exec(txt)) {
                    len = mat[0].length;

                    if (len < min) {
                        min = len;
                        str = mat[0];
                    }
                }

                if (min === 1e3)
                    return;

                el.textContent = txt.replace(new RegExp("^" + str, 'gm'), "").trim();
            });
        },

        coords: function(element){
            var el = $(element)[0];
            var box = el.getBoundingClientRect();

            return {
                top: box.top + window.pageYOffset,
                left: box.left + window.pageXOffset
            };
        },

        positionXY: function(e, t){
            switch (t) {
                case 'client': return this.clientXY(e);
                case 'screen': return this.screenXY(e);
                case 'page': return this.pageXY(e);
                default: return {x: 0, y: 0};
            }
        },

        /**
         *
         * @param {TouchEvent|Event|MouseEvent} e
         * @returns {{x: (*), y: (*)}}
         */
        clientXY: function(e){
            return {
                x: e.changedTouches ? e.changedTouches[0].clientX : e.clientX,
                y: e.changedTouches ? e.changedTouches[0].clientY : e.clientY
            };
        },

        /**
         *
         * @param {TouchEvent|Event|MouseEvent} e
         * @returns {{x: (*), y: (*)}}
         */
        screenXY: function(e){
            return {
                x: e.changedTouches ? e.changedTouches[0].screenX : e.screenX,
                y: e.changedTouches ? e.changedTouches[0].screenY : e.screenY
            };
        },

        /**
         *
         * @param {TouchEvent|Event|MouseEvent} e
         * @returns {{x: (*), y: (*)}}
         */
        pageXY: function(e){
            return {
                x: e.changedTouches ? e.changedTouches[0].pageX : e.pageX,
                y: e.changedTouches ? e.changedTouches[0].pageY : e.pageY
            };
        },

        isRightMouse: function(e){
            return "which" in e ? e.which === 3 : "button" in e ? e.button === 2 : undefined;
        },

        hiddenElementSize: function(el, includeMargin){
            var width, height, clone = $(el).clone(true);

            clone.removeAttr("data-role").css({
                visibility: "hidden",
                position: "absolute",
                display: "block"
            });
            $("body").append(clone);

            if (!this.isValue(includeMargin)) {
                includeMargin = false;
            }

            width = clone.outerWidth(includeMargin);
            height = clone.outerHeight(includeMargin);
            clone.remove();
            return {
                width: width,
                height: height
            };
        },

        getStyle: function(element, pseudo){
            var el = $(element)[0];
            return window.getComputedStyle(el, pseudo);
        },

        getStyleOne: function(el, property){
            return this.getStyle(el).getPropertyValue(property);
        },

        getInlineStyles: function(element){
            var i, l, styles = {}, el = $(element)[0];
            for (i = 0, l = el.style.length; i < l; i++) {
                var s = el.style[i];
                styles[s] = el.style[s];
            }

            return styles;
        },

        updateURIParameter: function(uri, key, value) {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            else {
                return uri + separator + key + "=" + value;
            }
        },

        getURIParameter: function(url, name){
            if (!url) url = window.location.href;
            /* eslint-disable-next-line */
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },

        getLocales: function(){
            return Object.keys(Metro.locales);
        },

        addLocale: function(locale){
            Metro.locales = $.extend( {}, Metro.locales, locale );
        },

        aspectRatioH: function(width, a){
            if (a === "16/9") return width * 9 / 16;
            if (a === "21/9") return width * 9 / 21;
            if (a === "4/3") return width * 3 / 4;
        },

        aspectRatioW: function(height, a){
            if (a === "16/9") return height * 16 / 9;
            if (a === "21/9") return height * 21 / 9;
            if (a === "4/3") return height * 4 / 3;
        },

        valueInObject: function(obj, value){
            return Object.values(obj).indexOf(value) > -1;
        },

        keyInObject: function(obj, key){
            return Object.keys(obj).indexOf(key) > -1;
        },

        inObject: function(obj, key, val){
            return obj[key] !== undefined && obj[key] === val;
        },

        newCssSheet: function(media){
            var style = document.createElement("style");

            if (media !== undefined) {
                style.setAttribute("media", media);
            }

            style.appendChild(document.createTextNode(""));

            document.head.appendChild(style);

            return style.sheet;
        },

        addCssRule: function(sheet, selector, rules, index){
            if("insertRule" in sheet) {
                sheet.insertRule(selector + "{" + rules + "}", index);
            }
            else if("addRule" in sheet) {
                sheet.addRule(selector, rules, index);
            }
        },

        media: function(query){
            return window.matchMedia(query).matches;
        },

        mediaModes: function(){
            return window.METRO_MEDIA;
        },

        mediaExist: function(media){
            return window.METRO_MEDIA.indexOf(media) > -1;
        },

        inMedia: function(media){
            return window.METRO_MEDIA.indexOf(media) > -1 && window.METRO_MEDIA.indexOf(media) === window.METRO_MEDIA.length - 1;
        },

        isValue: function(val){
            return val !== undefined && val !== null && val !== "";
        },

        isNull: function(val){
            return val === undefined || val === null;
        },

        isNegative: function(val){
            return parseFloat(val) < 0;
        },

        isPositive: function(val){
            return parseFloat(val) > 0;
        },

        isZero: function(val){
            return (parseFloat(val.toFixed(2))) === 0.00;
        },

        between: function(val, bottom, top, equals){
            return equals === true ? val >= bottom && val <= top : val > bottom && val < top;
        },

        parseMoney: function(val){
            return Number(parseFloat(val.replace(/[^0-9-.]/g, '')));
        },

        parseCard: function(val){
            return val.replace(/[^0-9]/g, '');
        },

        parsePhone: function(val){
            return this.parseCard(val);
        },

        parseNumber: function(val, thousand, decimal){
            return val.replace(new RegExp('\\'+thousand, "g"), "").replace(new RegExp('\\'+decimal, 'g'), ".");
        },

        nearest: function(val, precision, down){
            val /= precision;
            val = Math[down === true ? 'floor' : 'ceil'](val) * precision;
            return val;
        },

        bool: function(value){
            switch(value){
                case true:
                case "true":
                case 1:
                case "1":
                case "on":
                case "yes":
                    return true;
                default:
                    return false;
            }
        },

        copy: function(element){
            var body = document.body, range, sel;
            var el = $(element)[0];

            if (document.createRange && window.getSelection) {
                range = document.createRange();
                sel = window.getSelection();
                sel.removeAllRanges();
                try {
                    range.selectNodeContents(el);
                    sel.addRange(range);
                } catch (e) {
                    range.selectNode(el);
                    sel.addRange(range);
                }
            } else if (body["createTextRange"]) {
                range = body["createTextRange"]();
                range["moveToElementText"](el);
                range.select();
            }

            document.execCommand("Copy");

            if (window.getSelection) {
                if (window.getSelection().empty) {  // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {  // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if (document["selection"]) {  // IE?
                document["selection"].empty();
            }
        },

        decCount: function(v){
            return v % 1 === 0 ? 0 : v.toString().split(".")[1].length;
        },

        /**
         * Add symbols to string on the left side
         * @param str Where
         * @param pad what
         * @param length to length
         */
        lpad: function(str, pad, length){
            var _str = ""+str;
            if (length && _str.length >= length) {
                return _str;
            }
            return Array((length + 1) - _str.length).join(pad) + _str;
        },

        rpad: function(str, pad, length){
            var _str = ""+str;
            if (length && _str.length >= length) {
                return _str;
            }
            return _str + Array((length + 1) - _str.length).join(pad);
        }
    };

    if (window.METRO_GLOBAL_COMMON === true) {
        window.Utils = Metro.utils;
    }
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    $.extend(Metro.locales, {
        'en-US': {
            "calendar": {
                "months": [
                    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ],
                "days": [
                    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
                    "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa",
                    "Sun", "Mon", "Tus", "Wen", "Thu", "Fri", "Sat"
                ],
                "time": {
                    "days": "DAYS",
                    "hours": "HOURS",
                    "minutes": "MINS",
                    "seconds": "SECS",
                    "month": "MON",
                    "day": "DAY",
                    "year": "YEAR"
                }
            },
            "buttons": {
                "ok": "OK",
                "cancel": "Cancel",
                "done": "Done",
                "today": "Today",
                "now": "Now",
                "clear": "Clear",
                "help": "Help",
                "yes": "Yes",
                "no": "No",
                "random": "Random",
                "save": "Save",
                "reset": "Reset"
            },
            "table": {
                "rowsCount": "Show entries:",
                "search": "Search:",
                "info": "Showing $1 to $2 of $3 entries",
                "prev": "Prev",
                "next": "Next",
                "all": "All",
                "inspector": "Inspector",
                "skip": "Goto page",
                "empty": "Nothing to show"
            },
            "colorSelector": {
                addUserColorButton: "ADD TO SWATCHES",
                userColorsTitle: "USER COLORS"
            }
        }
    });
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var WizardDefaultConfig = {
        wizardDeferred: 0,
        start: 1,
        finish: 0,
        iconHelp: "<span class='default-icon-help'></span>",
        iconPrev: "<span class='default-icon-left-arrow'></span>",
        iconNext: "<span class='default-icon-right-arrow'></span>",
        iconFinish: "<span class='default-icon-check'></span>",

        buttonMode: "cycle", // default, cycle, square
        buttonOutline: true,
        duration: 300,

        clsWizard: "",
        clsActions: "",
        clsHelp: "",
        clsPrev: "",
        clsNext: "",
        clsFinish: "",

        onPage: Metro.noop,
        onNextPage: Metro.noop,
        onPrevPage: Metro.noop,
        onFirstPage: Metro.noop,
        onLastPage: Metro.noop,
        onFinishPage: Metro.noop,
        onHelpClick: Metro.noop,
        onPrevClick: Metro.noop,
        onNextClick: Metro.noop,
        onFinishClick: Metro.noop,
        onBeforePrev: Metro.noop_true,
        onBeforeNext: Metro.noop_true,
        onWizardCreate: Metro.noop
    };

    Metro.wizardSetup = function (options) {
        WizardDefaultConfig = $.extend({}, WizardDefaultConfig, options);
    };

    if (typeof window["metroWizardSetup"] !== undefined) {
        Metro.wizardSetup(window["metroWizardSetup"]);
    }

    Metro.Component('wizard', {
        init: function( options, elem ) {
            this._super(elem, options, WizardDefaultConfig, {
                id: Utils.elementId('wizard')
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createWizard();
            this._createEvents();

            this._fireEvent("wizard-create", {
                element: element
            });
        },

        _createWizard: function(){
            var element = this.element, o = this.options;
            var bar;

            element.addClass("wizard").addClass(o.view).addClass(o.clsWizard);

            bar = $("<div>").addClass("action-bar").addClass(o.clsActions).appendTo(element);

            var buttonMode = o.buttonMode === "button" ? "" : o.buttonMode;
            if (o.buttonOutline === true) {
                buttonMode += " outline";
            }

            if (o.iconHelp !== false) $("<button>").attr("type", "button").addClass("button wizard-btn-help").addClass(buttonMode).addClass(o.clsHelp).html(Utils.isTag(o.iconHelp) ? o.iconHelp : $("<img>").attr('src', o.iconHelp)).appendTo(bar);
            if (o.iconPrev !== false) $("<button>").attr("type", "button").addClass("button wizard-btn-prev").addClass(buttonMode).addClass(o.clsPrev).html(Utils.isTag(o.iconPrev) ? o.iconPrev : $("<img>").attr('src', o.iconPrev)).appendTo(bar);
            if (o.iconNext !== false) $("<button>").attr("type", "button").addClass("button wizard-btn-next").addClass(buttonMode).addClass(o.clsNext).html(Utils.isTag(o.iconNext) ? o.iconNext : $("<img>").attr('src', o.iconNext)).appendTo(bar);
            if (o.iconFinish !== false) $("<button>").attr("type", "button").addClass("button wizard-btn-finish").addClass(buttonMode).addClass(o.clsFinish).html(Utils.isTag(o.iconFinish) ? o.iconFinish : $("<img>").attr('src', o.iconFinish)).appendTo(bar);

            this.toPage(o.start);

            this._setHeight();
        },

        _setHeight: function(){
            var element = this.element;
            var pages = element.children("section");
            var max_height = 0;

            pages.children(".page-content").css("max-height", "none");

            $.each(pages, function(){
                var h = $(this).height();
                if (max_height < parseInt(h)) {
                    max_height = h;
                }
            });

            element.height(max_height);
        },

        _createEvents: function(){
            var that = this, element = this.element;

            element.on(Metro.events.click, ".wizard-btn-help", function(){
                var pages = element.children("section");
                var page = pages.get(that.current - 1);

                that._fireEvent("help-click", {
                    index: that.current,
                    page: page
                });
            });

            element.on(Metro.events.click, ".wizard-btn-prev", function(){
                that.prev();
                var pages = element.children("section");
                var page = pages.get(that.current - 1);

                that._fireEvent("prev-click", {
                    index: that.current,
                    page: page
                });
            });

            element.on(Metro.events.click, ".wizard-btn-next", function(){
                that.next();
                var pages = element.children("section");
                var page = pages.get(that.current - 1);

                that._fireEvent("next-click", {
                    index: that.current,
                    page: page
                });
            });

            element.on(Metro.events.click, ".wizard-btn-finish", function(){
                var pages = element.children("section");
                var page = pages.get(that.current - 1);

                that._fireEvent("finish-click", {
                    index: that.current,
                    page: page
                });
            });

            element.on(Metro.events.click, ".complete", function(){
                var index = $(this).index() + 1;
                that.toPage(index);
            });

            $(window).on(Metro.events.resize, function(){
                that._setHeight();
            }, {ns: this.id});
        },

        next: function(){
            var that = this, element = this.element, o = this.options;
            var pages = element.children("section");
            var page = $(element.children("section").get(this.current - 1));

            if (this.current + 1 > pages.length || Utils.exec(o.onBeforeNext, [this.current, page, element]) === false) {
                return ;
            }

            this.current++;

            this.toPage(this.current);

            page = $(element.children("section").get(this.current - 1));

            this._fireEvent("next-page", {
                index: that.current,
                page: page[0]
            });
        },

        prev: function(){
            var that = this, element = this.element, o = this.options;
            var page = $(element.children("section").get(this.current - 1));

            if (this.current - 1 === 0 || Utils.exec(o.onBeforePrev, [this.current, page, element]) === false) {
                return ;
            }

            this.current--;

            this.toPage(this.current);

            page = $(element.children("section").get(this.current - 1));

            this._fireEvent("prev-page", {
                index: that.current,
                page: page[0]
            });
        },

        last: function(){
            var that = this, element = this.element;
            var page;

            this.toPage(element.children("section").length);

            page = $(element.children("section").get(this.current - 1));

            this._fireEvent("last-page", {
                index: that.current,
                page: page[0]
            });
        },

        first: function(){
            var that = this, element = this.element;
            var page;

            this.toPage(1);

            page = $(element.children("section").get(0));

            this._fireEvent("first-page", {
                index: that.current,
                page: page[0]
            });
        },

        toPage: function(page){
            var element = this.element, o = this.options;
            var target = $(element.children("section").get(page - 1));
            var sections = element.children("section");
            var actions = element.find(".action-bar");

            if (target.length === 0) {
                return ;
            }

            var finish = element.find(".wizard-btn-finish").addClass("disabled");
            var next = element.find(".wizard-btn-next").addClass("disabled");
            var prev = element.find(".wizard-btn-prev").addClass("disabled");

            this.current = page;

            element.children("section")
                .removeClass("complete current")
                .removeClass(o.clsCurrent)
                .removeClass(o.clsComplete);

            target.addClass("current").addClass(o.clsCurrent);
            target.prevAll().addClass("complete").addClass(o.clsComplete);

            var border_size = element.children("section.complete").length === 0 ? 0 : parseInt(Utils.getStyleOne(element.children("section.complete")[0], "border-left-width"));

            actions.animate({
                draw: {
                    left: element.children("section.complete").length * border_size + 41
                },
                dur: o.duration
            });

            if (
                (this.current === sections.length) || (o.finish > 0 && this.current >= o.finish)
            ) {
                finish.removeClass("disabled");
            }

            if (parseInt(o.finish) > 0 && this.current === parseInt(o.finish)) {

                this._fireEvent("finish-page", {
                    index: this.current,
                    page: target[0]
                });
            }

            if (this.current < sections.length) {
                next.removeClass("disabled");
            }

            if (this.current > 1) {
                prev.removeClass("disabled");
            }

            this._fireEvent("page", {
                index: this.current,
                page: target[0]
            });
        },

        changeAttribute: function(){
        },

        destroy: function(){
            var element = this.element;

            element.off(Metro.events.click, ".wizard-btn-help");
            element.off(Metro.events.click, ".wizard-btn-prev");
            element.off(Metro.events.click, ".wizard-btn-next");
            element.off(Metro.events.click, ".wizard-btn-finish");
            element.off(Metro.events.click, ".complete");
            $(window).off(Metro.events.resize,{ns: this.id});

            return element;
        }
    });
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var WindowDefaultConfig = {
        windowDeferred: 0,
        hidden: false,
        width: "auto",
        height: "auto",
        btnClose: true,
        btnMin: true,
        btnMax: true,
        draggable: true,
        dragElement: ".window-caption .icon, .window-caption .title",
        dragArea: "parent",
        shadow: false,
        icon: "",
        title: "Window",
        content: null,
        resizable: true,
        overlay: false,
        overlayColor: 'transparent',
        overlayAlpha: .5,
        modal: false,
        position: "absolute",
        checkEmbed: true,
        top: "auto",
        left: "auto",
        place: "auto",
        closeAction: Metro.actions.REMOVE,
        customButtons: null,

        clsCustomButton: "",
        clsCaption: "",
        clsContent: "",
        clsWindow: "",

        _runtime: false,

        minWidth: 0,
        minHeight: 0,
        maxWidth: 0,
        maxHeight: 0,
        onDragStart: Metro.noop,
        onDragStop: Metro.noop,
        onDragMove: Metro.noop,
        onCaptionDblClick: Metro.noop,
        onCloseClick: Metro.noop,
        onMaxClick: Metro.noop,
        onMinClick: Metro.noop,
        onResizeStart: Metro.noop,
        onResizeStop: Metro.noop,
        onResize: Metro.noop,
        onWindowCreate: Metro.noop,
        onShow: Metro.noop,
        onWindowDestroy: Metro.noop,
        onCanClose: Metro.noop_true,
        onClose: Metro.noop
    };

    Metro.windowSetup = function (options) {
        WindowDefaultConfig = $.extend({}, WindowDefaultConfig, options);
    };

    if (typeof window["metroWindowSetup"] !== undefined) {
        Metro.windowSetup(window["metroWindowSetup"]);
    }

    Metro.Component('window', {
        init: function( options, elem ) {
            this._super(elem, options, WindowDefaultConfig, {
                win: null,
                overlay: null,
                position: {
                    top: 0,
                    left: 0
                },
                hidden: false,
                content: null
            });

            return this;
        },

        _create: function(){
            var that = this, element = this.element, o = this.options;
            var win, overlay;
            var parent = o.dragArea === "parent" ? element.parent() : $(o.dragArea);
            var _content;

            if (o.modal === true) {
                o.btnMax = false;
                o.btnMin = false;
                o.resizable = false;
            }

            if (Utils.isNull(o.content)) {
                o.content = element;
            } else {
                if (Utils.isUrl(o.content) && Utils.isVideoUrl(o.content)) {
                    o.content = Utils.embedUrl(o.content);
                    element.css({
                        height: "100%"
                    });
                } else

                if (!Utils.isQ(o.content) && Utils.isFunc(o.content)) {
                    o.content = Utils.exec(o.content);
                }

                _content = $(o.content);
                if (_content.length === 0) {
                    element.appendText(o.content);
                } else {
                    element.append(_content);
                }
                o.content = element;
            }

            if (o._runtime === true) {
                this._runtime(element, "window");
            }

            win = this._window(o);
            win.addClass("no-visible");

            parent.append(win);

            if (o.overlay === true) {
                overlay = this._overlay();
                overlay.appendTo(win.parent());
                this.overlay = overlay;
            }

            this.win = win;

            this._fireEvent("window-create", {
                win: this.win[0],
                element: element
            });

            setTimeout(function(){
                that._setPosition();

                if (o.hidden !== true) {
                    that.win.removeClass("no-visible");
                }

                that._fireEvent("show", {
                    win: that.win[0],
                    element: element
                });
            }, 100);
        },

        _setPosition: function(){
            var o = this.options;
            var win = this.win;
            var parent = o.dragArea === "parent" ? win.parent() : $(o.dragArea);
            var top_center = parent.height() / 2 - win[0].offsetHeight / 2;
            var left_center = parent.width() / 2 - win[0].offsetWidth / 2;
            var top, left, right, bottom;

            if (o.place !== 'auto') {

                switch (o.place.toLowerCase()) {
                    case "top-left": top = 0; left = 0; right = "auto"; bottom = "auto"; break;
                    case "top-center": top = 0; left = left_center; right = "auto"; bottom = "auto"; break;
                    case "top-right": top = 0; right = 0; left = "auto"; bottom = "auto"; break;
                    case "right-center": top = top_center; right = 0; left = "auto"; bottom = "auto"; break;
                    case "bottom-right": bottom = 0; right = 0; left = "auto"; top = "auto"; break;
                    case "bottom-center": bottom = 0; left = left_center; right = "auto"; top = "auto"; break;
                    case "bottom-left": bottom = 0; left = 0; right = "auto"; top = "auto"; break;
                    case "left-center": top = top_center; left = 0; right = "auto"; bottom = "auto"; break;
                    default: top = top_center; left = left_center; bottom = "auto"; right = "auto";
                }

                win.css({
                    top: top,
                    left: left,
                    bottom: bottom,
                    right: right
                });
            }
        },

        _window: function(o){
            var that = this;
            var win, caption, content, icon, title, buttons, btnClose, btnMin, btnMax, resizer, status;
            var width = o.width, height = o.height;

            win = $("<div>").addClass("window");

            if (o.modal === true) {
                win.addClass("modal");
            }

            caption = $("<div>").addClass("window-caption");
            content = $("<div>").addClass("window-content");

            win.append(caption);
            win.append(content);

            if (o.status === true) {
                status = $("<div>").addClass("window-status");
                win.append(status);
            }

            if (o.shadow === true) {
                win.addClass("win-shadow");
            }

            if (Utils.isValue(o.icon)) {
                icon = $("<span>").addClass("icon").html(o.icon);
                icon.appendTo(caption);
            }

            title = $("<span>").addClass("title").html(Utils.isValue(o.title) ? o.title : "&nbsp;");
            title.appendTo(caption);

            if (!Utils.isNull(o.content)) {
                if (Utils.isQ(o.content)) {
                    o.content.appendTo(content);
                } else {
                    content.html(o.content);
                }
            }

            buttons = $("<div>").addClass("buttons");
            buttons.appendTo(caption);

            if (o.btnMax === true) {
                btnMax = $("<span>").addClass("button btn-max sys-button");
                btnMax.appendTo(buttons);
            }

            if (o.btnMin === true) {
                btnMin = $("<span>").addClass("button btn-min sys-button");
                btnMin.appendTo(buttons);
            }

            if (o.btnClose === true) {
                btnClose = $("<span>").addClass("button btn-close sys-button");
                btnClose.appendTo(buttons);
            }

            if (Utils.isValue(o.customButtons)) {
                var customButtons = [];

                if (Utils.isObject(o.customButtons) !== false) {
                    o.customButtons = Utils.isObject(o.customButtons);
                }

                if (typeof o.customButtons === "string" && o.customButtons.indexOf("{") > -1) {
                    customButtons = JSON.parse(o.customButtons);
                } else if (typeof o.customButtons === "object" && Utils.objectLength(o.customButtons) > 0) {
                    customButtons = o.customButtons;
                } else {
                    console.warn("Unknown format for custom buttons");
                }

                $.each(customButtons, function(){
                    var item = this;
                    var customButton = $("<span>");

                    customButton
                        .addClass("button btn-custom")
                        .addClass(o.clsCustomButton)
                        .addClass(item.cls)
                        .attr("tabindex", -1)
                        .html(item.html);

                    if (item.attr && typeof item.attr === 'object') {
                        $.each(item.attr, function(k, v){
                            customButton.attr($.dashedName(k), v);
                        });
                    }

                    customButton.data("action", item.onclick);

                    buttons.prepend(customButton);
                });
            }

            caption.on(Metro.events.stop, ".btn-custom", function(e){
                if (Utils.isRightMouse(e)) return;
                var button = $(this);
                var action = button.data("action");
                Utils.exec(action, [button], this);
            });

            win.attr("id", o.id === undefined ? Utils.elementId("window") : o.id);

            win.on(Metro.events.dblclick, ".window-caption", function(e){
                that.maximized(e);
            });

            caption.on(Metro.events.click, ".btn-max, .btn-min, .btn-close", function(e){
                if (Utils.isRightMouse(e)) return;
                var target = $(e.target);
                if (target.hasClass("btn-max")) that.maximized(e);
                if (target.hasClass("btn-min")) that.minimized(e);
                if (target.hasClass("btn-close")) that.close(e);
            });

            if (o.draggable === true) {
                Metro.makePlugin(win, "draggable", {
                    dragContext: win[0],
                    dragElement: o.dragElement,
                    dragArea: o.dragArea,
                    onDragStart: o.onDragStart,
                    onDragStop: o.onDragStop,
                    onDragMove: o.onDragMove
                });
            }

            win.addClass(o.clsWindow);
            caption.addClass(o.clsCaption);
            content.addClass(o.clsContent);

            if (o.minWidth === 0) {
                o.minWidth = 34;
                $.each(buttons.children(".btn-custom"), function(){
                    o.minWidth += Utils.hiddenElementSize(this).width;
                });
                if (o.btnMax) o.minWidth += 34;
                if (o.btnMin) o.minWidth += 34;
                if (o.btnClose) o.minWidth += 34;
            }

            if (o.minWidth > 0 && !isNaN(o.width) && o.width < o.minWidth) {
                width = o.minWidth;
            }
            if (o.minHeight > 0 && !isNaN(o.height) && o.height > o.minHeight) {
                height = o.minHeight;
            }

            if (o.resizable === true) {
                resizer = $("<span>").addClass("resize-element");
                resizer.appendTo(win);
                win.addClass("resizable");

                Metro.makePlugin(win, "resizable", {
                    minWidth: o.minWidth,
                    minHeight: o.minHeight,
                    maxWidth: o.maxWidth,
                    maxHeight: o.maxHeight,
                    resizeElement: ".resize-element",
                    onResizeStart: o.onResizeStart,
                    onResizeStop: o.onResizeStop,
                    onResize: o.onResize
                });
            }

            win.css({
                width: width,
                height: height,
                position: o.position,
                top: o.top,
                left: o.left
            });

            return win;
        },

        _overlay: function(){
            var o = this.options;

            var overlay = $("<div>");
            overlay.addClass("overlay");

            if (o.overlayColor === 'transparent') {
                overlay.addClass("transparent");
            } else {
                overlay.css({
                    background: Metro.colors.toRGBA(o.overlayColor, o.overlayAlpha)
                });
            }

            return overlay;
        },

        width: function(v){
            var win = this.win;

            if (!Utils.isValue(v)) {
                return win.width();
            }

            win.css("width", parseInt(v));

            return this;
        },

        height: function(v){
            var win = this.win;

            if (!Utils.isValue(v)) {
                return win.height();
            }

            win.css("height", parseInt(v));

            return this;
        },

        maximized: function(e){
            var win = this.win, o = this.options;
            var target = $(e.currentTarget);

            if (o.btnMax) {
                win.removeClass("minimized");
                win.toggleClass("maximized");
            }

            if (target.hasClass && target.hasClass("window-caption")) {

                this._fireEvent("caption-dbl-click", {
                    win: win[0]
                });

            } else {

                this._fireEvent("max-click", {
                    win: win[0]
                });

            }
        },

        minimized: function(){
            var win = this.win, o = this.options;

            if (o.btnMin) {
                win.removeClass("maximized");
                win.toggleClass("minimized");
            }

            this._fireEvent("min-click", {
                win: win[0]
            });
        },

        close: function(){
            var that = this, win = this.win,  o = this.options;

            if (Utils.exec(o.onCanClose, [win]) === false) {
                return false;
            }

            var timeout = 0;

            if (o.onClose !== Metro.noop) {
                timeout = 500;
            }

            this._fireEvent("close", {
                win: win[0]
            });

            setTimeout(function(){
                if (o.modal === true) {
                    win.siblings(".overlay").remove();
                }

                that._fireEvent("close-click", {
                    win: win[0]
                });

                if (o.closeAction === Metro.actions.REMOVE) {
                    that._fireEvent("window-destroy", {
                        win: win[0]
                    });
                    win.remove();
                } else {
                    that.hide();
                }

            }, timeout);
        },

        hide: function(){
            var win = this.win;

            win.css({
                display: "none"
            });

            this._fireEvent("hide", {
                win: win[0]
            });
        },

        show: function(){
            var win = this.win;

            win
                .removeClass("no-visible")
                .css({
                    display: "flex"
                });

            this._fireEvent("show", {
                win: win[0]
            });

        },

        toggle: function(){
            if (this.win.css("display") === "none" || this.win.hasClass("no-visible")) {
                this.show();
            } else {
                this.hide();
            }
        },

        isOpen: function(){
            return this.win.hasClass("no-visible");
        },

        min: function(a){
            a ? this.win.addClass("minimized") : this.win.removeClass("minimized");
        },

        max: function(a){
            a ? this.win.addClass("maximized") : this.win.removeClass("maximized");
        },

        changeClass: function(a){
            var element = this.element, win = this.win, o = this.options;

            if (a === "data-cls-window") {
                win[0].className = "window " + (o.resizable ? " resizable " : " ") + element.attr("data-cls-window");
            }
            if (a === "data-cls-caption") {
                win.find(".window-caption")[0].className = "window-caption " + element.attr("data-cls-caption");
            }
            if (a === "data-cls-content") {
                win.find(".window-content")[0].className = "window-content " + element.attr("data-cls-content");
            }
        },

        toggleShadow: function(){
            var element = this.element, win = this.win;
            var flag = JSON.parse(element.attr("data-shadow"));
            if (flag === true) {
                win.addClass("win-shadow");
            } else {
                win.removeClass("win-shadow");
            }
        },

        setContent: function(c){
            var element = this.element, win = this.win;
            var content = Utils.isValue(c) ? c : element.attr("data-content");
            var result;

            if (!Utils.isQ(content) && Utils.isFunc(content)) {
                result = Utils.exec(content);
            } else if (Utils.isQ(content)) {
                result = content.html();
            } else {
                result = content;
            }

            win.find(".window-content").html(result);
        },

        setTitle: function(t){
            var element = this.element, win = this.win;
            var title = Utils.isValue(t) ? t : element.attr("data-title");
            win.find(".window-caption .title").html(title);
        },

        setIcon: function(i){
            var element = this.element, win = this.win;
            var icon = Utils.isValue(i) ? i : element.attr("data-icon");
            win.find(".window-caption .icon").html(icon);
        },

        getIcon: function(){
            return this.win.find(".window-caption .icon").html();
        },

        getTitle: function(){
            return this.win.find(".window-caption .title").html();
        },

        toggleDraggable: function(f){
            var win = this.win;
            var flag = Utils.bool(f);
            var drag = Metro.getPlugin(win, "draggable");
            if (flag === true) {
                drag.on();
            } else {
                drag.off();
            }
        },

        toggleResizable: function(f){
            var win = this.win;
            var flag = Utils.bool(f);
            var resize = Metro.getPlugin(win, "resizable");
            if (flag === true) {
                resize.on();
                win.find(".resize-element").removeClass("resize-element-disabled");
            } else {
                resize.off();
                win.find(".resize-element").addClass("resize-element-disabled");
            }
        },

        changePlace: function (p) {
            var element = this.element, win = this.win;
            var place = Utils.isValue(p) ? p : element.attr("data-place");
            win.addClass(place);
        },

        pos: function(top, left){
            var win = this.win;
            win.css({
                top: top,
                left: left
            });
            return this;
        },

        top: function(v){
            this.win.css({
                top: v
            });
            return this;
        },

        left: function(v){
            this.win.css({
                left: v
            });
            return this;
        },

        changeAttribute: function(attr, value){
            var changePos = function(a, v){
                var win = this.win;
                var pos;
                if (a === "data-top") {
                    pos = parseInt(v);
                    if (!isNaN(pos)) {
                        return ;
                    }
                    win.css("top", pos);
                }
                if (a === "data-left") {
                    pos = parseInt(v);
                    if (!isNaN(pos)) {
                        return ;
                    }
                    win.css("left", pos);
                }
            };

            var toggleButtons = function(a, v) {
                var win = this.win;
                var btnClose = win.find(".btn-close");
                var btnMin = win.find(".btn-min");
                var btnMax = win.find(".btn-max");
                var _v = Utils.bool(v);
                var func = _v ? "show" : "hide";

                switch (a) {
                    case "data-btn-close": btnClose[func](); break;
                    case "data-btn-min": btnMin[func](); break;
                    case "data-btn-max": btnMax[func](); break;
                }
            };

            var changeSize = function(a, v){
                var win = this.win;
                if (a === "data-width") {
                    win.css("width", +v);
                }
                if (a === "data-height") {
                    win.css("height", +v);
                }
            };

            switch (attr) {
                case "data-btn-close":
                case "data-btn-min":
                case "data-btn-max": toggleButtons(attr, value); break;
                case "data-width":
                case "data-height": changeSize(attr, value); break;
                case "data-cls-window":
                case "data-cls-caption":
                case "data-cls-content": this.changeClass(attr); break;
                case "data-shadow": this.toggleShadow(); break;
                case "data-icon": this.setIcon(); break;
                case "data-title": this.setTitle(); break;
                case "data-content": this.setContent(); break;
                case "data-draggable": this.toggleDraggable(value); break;
                case "data-resizable": this.toggleResizable(value); break;
                case "data-top":
                case "data-left": changePos(attr, value); break;
                case "data-place": this.changePlace(); break;
            }
        },

        destroy: function(){
            return this.element;
        }
    });

    Metro['window'] = {

        isWindow: function(el){
            return Utils.isMetroObject(el, "window");
        },

        min: function(el, a){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el,"window").min(a);
        },

        max: function(el, a){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").max(a);
        },

        show: function(el){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").show();
        },

        hide: function(el){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").hide();
        },

        toggle: function(el){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").toggle();
        },

        isOpen: function(el){
            if (!this.isWindow(el)) {
                return false;
            }
            var win = Metro.getPlugin(el,"window");
            return win.isOpen();
        },

        close: function(el){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").close();
        },

        pos: function(el, top, left){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").pos(top, left);
        },

        top: function(el, top){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").top(top);
        },

        left: function(el, left){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").left(left);
        },

        width: function(el, width){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").width(width);
        },

        height: function(el, height){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").height(height);
        },

        create: function(options, parent){
            var w;

            w = $("<div>").appendTo(parent ? $(parent) : $("body"));

            var w_options = $.extend({
                _runtime: true
            }, (options ? options : {}));

            return Metro.makePlugin(w, "window", w_options);
        }
    };
}(Metro, m4q));


/* global Metro, METRO_TIMEOUT, METRO_ANIMATION_DURATION */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var ToastDefaultConfig = {
        callback: Metro.noop,
        timeout: METRO_TIMEOUT,
        distance: 20,
        showTop: false,
        clsToast: ""
    };

    Metro.toastSetup = function(options){
        ToastDefaultConfig = $.extend({}, ToastDefaultConfig, options);
    };

    if (typeof window["metroToastSetup"] !== undefined) {
        Metro.toastSetup(window["metroToastSetup"]);
    }

    var Toast = {
        create: function(message, /*callback, timeout, cls, */options){
            var o, toast, width;
            var args = Array.from(arguments);
            var timeout, callback, cls;

            if (!$.isPlainObject(options)) {
                options = args[4];
                callback = args[1];
                timeout = args[2];
                cls = args[3];
            }

            o = $.extend({}, ToastDefaultConfig, options);

            toast = $("<div>").addClass("toast").html(message).appendTo($("body"));
            width = toast.outerWidth();
            toast.hide();

            timeout = timeout || o.timeout;
            callback = callback || o.callback;
            cls = cls || o.clsToast;

            if (o.showTop === true) {
                toast.addClass("show-top").css({
                    top: o.distance
                });
            } else {
                toast.css({
                    bottom: o.distance
                })
            }

            toast
                .css({
                    'left': '50%',
                    'margin-left': -(width / 2)
                })
                .addClass(o.clsToast)
                .addClass(cls)
                .fadeIn(METRO_ANIMATION_DURATION, function(){
                    setTimeout(function(){
                        Toast.remove(toast, callback);
                    }, timeout);
                });
        },

        remove: function(toast, cb){
            if (!toast) return ;

            toast.fadeOut(METRO_ANIMATION_DURATION, function(){
                toast.remove();
                Utils.exec(cb, null, toast[0]);
            });
        }
    };

    Metro['toast'] = Toast;
    Metro['createToast'] = Toast.create;
}(Metro, m4q));


/* global Metro, METRO_LOCALE */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var TimePickerDefaultConfig = {
        label: "",
        timepickerDeferred: 0,
        hoursStep: 1,
        minutesStep: 1,
        secondsStep: 1,
        value: null,
        locale: METRO_LOCALE,
        distance: 3,
        hours: true,
        minutes: true,
        seconds: true,
        showLabels: true,
        scrollSpeed: 4,
        copyInlineStyles: false,
        clsPicker: "",
        clsPart: "",
        clsHours: "",
        clsMinutes: "",
        clsSeconds: "",
        clsLabel: "",
        clsButton: "",
        clsOkButton: "",
        clsCancelButton: "",
        okButtonIcon: "<span class='default-icon-check'></span>",
        cancelButtonIcon: "<span class='default-icon-cross'></span>",
        onSet: Metro.noop,
        onOpen: Metro.noop,
        onClose: Metro.noop,
        onScroll: Metro.noop,
        onTimePickerCreate: Metro.noop
    };

    Metro.timePickerSetup = function (options) {
        TimePickerDefaultConfig = $.extend({}, TimePickerDefaultConfig, options);
    };

    if (typeof window["metroTimePickerSetup"] !== undefined) {
        Metro.timePickerSetup(window["metroTimePickerSetup"]);
    }

    Metro.Component('time-picker', {
        init: function( options, elem ) {
            this._super(elem, options, TimePickerDefaultConfig, {
                picker: null,
                isOpen: false,
                value: [],
                locale: Metro.locales[METRO_LOCALE]['calendar'],
                listTimer: {
                    hours: null,
                    minutes: null,
                    seconds: null
                },
                id: Utils.elementId("time-picker")
            });

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;
            var i;

            if (o.distance < 1) {
                o.distance = 1;
            }

            if (o.hoursStep < 1) {o.hoursStep = 1;}
            if (o.hoursStep > 23) {o.hoursStep = 23;}

            if (o.minutesStep < 1) {o.minutesStep = 1;}
            if (o.minutesStep > 59) {o.minutesStep = 59;}

            if (o.secondsStep < 1) {o.secondsStep = 1;}
            if (o.secondsStep > 59) {o.secondsStep = 59;}

            if (element.val() === "" && (!Utils.isValue(o.value))) {
                o.value = (new Date()).format("%H:%M:%S");
            }

            this.value = (element.val() !== "" ? element.val() : ""+o.value).toArray(":");

            for(i = 0; i < 3; i++) {
                if (this.value[i] === undefined || this.value[i] === null) {
                    this.value[i] = 0;
                } else {
                    this.value[i] = parseInt(this.value[i]);
                }
            }

            this._normalizeValue();

            if (Metro.locales[o.locale] === undefined) {
                o.locale = METRO_LOCALE;
            }

            this.locale = Metro.locales[o.locale]['calendar'];

            this._createStructure();
            this._createEvents();
            this._set();

            this._fireEvent("time-picker-create", {
                element: element
            });
        },

        _normalizeValue: function(){
            var o = this.options;

            if (o.hoursStep > 1) {
                this.value[0] = Utils.nearest(this.value[0], o.hoursStep, true);
            }
            if (o.minutesStep > 1) {
                this.value[1] = Utils.nearest(this.value[1], o.minutesStep, true);
            }
            if (o.minutesStep > 1) {
                this.value[2] = Utils.nearest(this.value[2], o.secondsStep, true);
            }
        },

        _createStructure: function(){
            var element = this.element, o = this.options;
            var picker, hours, minutes, seconds, i;
            var timeWrapper, selectWrapper, selectBlock, actionBlock;

            picker = $("<div>").addClass("wheel-picker time-picker " + element[0].className).addClass(o.clsPicker);

            picker.insertBefore(element);
            element.attr("readonly", true).appendTo(picker);

            if (o.label) {
                var label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(picker);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            timeWrapper = $("<div>").addClass("time-wrapper").appendTo(picker);

            if (o.hours === true) {
                hours = $("<div>").attr("data-title", this.locale['time']['hours']).addClass("hours").addClass(o.clsPart).addClass(o.clsHours).appendTo(timeWrapper);
            }
            if (o.minutes === true) {
                minutes = $("<div>").attr("data-title", this.locale['time']['minutes']).addClass("minutes").addClass(o.clsPart).addClass(o.clsMinutes).appendTo(timeWrapper);
            }
            if (o.seconds === true) {
                seconds = $("<div>").attr("data-title", this.locale['time']['seconds']).addClass("seconds").addClass(o.clsPart).addClass(o.clsSeconds).appendTo(timeWrapper);
            }

            selectWrapper = $("<div>").addClass("select-wrapper").appendTo(picker);

            selectBlock = $("<div>").addClass("select-block").appendTo(selectWrapper);
            if (o.hours === true) {
                hours = $("<ul>").addClass("sel-hours").appendTo(selectBlock);
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(hours);
                for (i = 0; i < 24; i = i + o.hoursStep) {
                    $("<li>").addClass("js-hours-"+i).html(i < 10 ? "0"+i : i).data("value", i).appendTo(hours);
                }
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(hours);
            }
            if (o.minutes === true) {
                minutes = $("<ul>").addClass("sel-minutes").appendTo(selectBlock);
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(minutes);
                for (i = 0; i < 60; i = i + o.minutesStep) {
                    $("<li>").addClass("js-minutes-"+i).html(i < 10 ? "0"+i : i).data("value", i).appendTo(minutes);
                }
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(minutes);
            }
            if (o.seconds === true) {
                seconds = $("<ul>").addClass("sel-seconds").appendTo(selectBlock);
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(seconds);
                for (i = 0; i < 60; i = i + o.secondsStep) {
                    $("<li>").addClass("js-seconds-"+i).html(i < 10 ? "0"+i : i).data("value", i).appendTo(seconds);
                }
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(seconds);
            }

            selectBlock.height((o.distance * 2 + 1) * 40);

            actionBlock = $("<div>").addClass("action-block").appendTo(selectWrapper);
            $("<button>").attr("type", "button").addClass("button action-ok").addClass(o.clsButton).addClass(o.clsOkButton).html(o.okButtonIcon).appendTo(actionBlock);
            $("<button>").attr("type", "button").addClass("button action-cancel").addClass(o.clsButton).addClass(o.clsCancelButton).html(o.cancelButtonIcon).appendTo(actionBlock);


            element[0].className = '';
            if (o.copyInlineStyles === true) {
                for (i = 0; i < element[0].style.length; i++) {
                    picker.css(element[0].style[i], element.css(element[0].style[i]));
                }
            }

            if (o.showLabels === true) {
                picker.addClass("show-labels");
            }

            if (element.prop("disabled")) {
                picker.addClass("disabled");
            }

            this.picker = picker;
        },

        _createEvents: function(){
            var that = this, o = this.options;
            var picker = this.picker;

            picker.on(Metro.events.start, ".select-block ul", function(e){

                if (e.changedTouches) {
                    return ;
                }

                var target = this;
                var pageY = Utils.pageXY(e).y;

                $(document).on(Metro.events.move, function(e){

                    target.scrollTop -= o.scrollSpeed * (pageY  > Utils.pageXY(e).y ? -1 : 1);

                    pageY = Utils.pageXY(e).y;
                }, {ns: that.id});

                $(document).on(Metro.events.stop, function(){
                    $(document).off(Metro.events.move, {ns: that.id});
                    $(document).off(Metro.events.stop, {ns: that.id});
                }, {ns: that.id});
            });

            picker.on(Metro.events.click, function(e){
                if (that.isOpen === false) that.open();
                e.stopPropagation();
            });

            picker.on(Metro.events.click, ".action-ok", function(e){
                var h, m, s;
                var sh = picker.find(".sel-hours li.active"),
                    sm = picker.find(".sel-minutes li.active"),
                    ss = picker.find(".sel-seconds li.active");

                h = sh.length === 0 ? 0 : sh.data("value");
                m = sm.length === 0 ? 0 : sm.data("value");
                s = ss.length === 0 ? 0 : ss.data("value");

                that.value = [h, m, s];
                that._normalizeValue();
                that._set();

                that.close();
                e.stopPropagation();
            });

            picker.on(Metro.events.click, ".action-cancel", function(e){
                that.close();
                e.stopPropagation();
            });

            var scrollLatency = 150;
            $.each(['hours', 'minutes', 'seconds'], function(){
                var part = this, list = picker.find(".sel-"+part);

                list.on("scroll", function(){
                    if (!that.isOpen) {
                        return ;
                    }

                    if (that.listTimer[part]) {
                        clearTimeout(that.listTimer[part]);
                        that.listTimer[part] = null;
                    }

                    if (!that.listTimer[part]) that.listTimer[part] = setTimeout(function () {

                        var target, targetElement, scrollTop;

                        that.listTimer[part] = null;

                        target = Math.round((Math.ceil(list.scrollTop()) / 40));

                        if (part === "hours" && o.hoursStep) {
                            target *= parseInt(o.hoursStep);
                        }
                        if (part === "minutes" && o.minutesStep) {
                            target *= parseInt(o.minutesStep);
                        }
                        if (part === "seconds" && o.secondsStep) {
                            target *= parseInt(o.secondsStep);
                        }

                        targetElement = list.find(".js-" + part + "-" + target);
                        scrollTop = targetElement.position().top - (o.distance * 40);

                        list.find(".active").removeClass("active");

                        list[0].scrollTop = scrollTop;
                        targetElement.addClass("active");
                        Utils.exec(o.onScroll, [targetElement, list, picker], list[0]);

                    }, scrollLatency);

                })
            });
        },

        _set: function(){
            var element = this.element, o = this.options;
            var picker = this.picker;
            var h = "00", m = "00", s = "00";

            if (o.hours === true) {
                h = parseInt(this.value[0]);
                if (h < 10) {
                    h = "0"+h;
                }
                picker.find(".hours").html(h);
            }
            if (o.minutes === true) {
                m = parseInt(this.value[1]);
                if (m < 10) {
                    m = "0"+m;
                }
                picker.find(".minutes").html(m);
            }
            if (o.seconds === true) {
                s = parseInt(this.value[2]);
                if (s < 10) {
                    s = "0"+s;
                }
                picker.find(".seconds").html(s);
            }

            element.val([h, m, s].join(":")).trigger("change");

            this._fireEvent("set", {
                val: this.value,
                elementVal: element.val()
            });

        },

        open: function(){
            var o = this.options;
            var picker = this.picker;
            var h, m, s;
            var h_list, m_list, s_list;
            var items = picker.find("li");
            var select_wrapper = picker.find(".select-wrapper");
            var select_wrapper_in_viewport, select_wrapper_rect;
            var h_item, m_item, s_item;

            select_wrapper.parent().removeClass("for-top for-bottom");
            select_wrapper.show(0);
            items.removeClass("active");

            select_wrapper_in_viewport = Utils.inViewport(select_wrapper[0]);
            select_wrapper_rect = Utils.rect(select_wrapper[0]);

            if (!select_wrapper_in_viewport && select_wrapper_rect.top > 0) {
                select_wrapper.parent().addClass("for-bottom");
            }

            if (!select_wrapper_in_viewport && select_wrapper_rect.top < 0) {
                select_wrapper.parent().addClass("for-top");
            }

            var animateList = function(list, item){
                list
                    .scrollTop(0)
                    .animate({
                        draw: {
                            scrollTop: item.position().top - (o.distance * 40) + list.scrollTop()
                        },
                        dur: 100
                    });
            };

            if (o.hours === true) {
                h = parseInt(this.value[0]);
                h_list = picker.find(".sel-hours");
                h_item = h_list.find("li.js-hours-" + h).addClass("active");
                animateList(h_list, h_item);
            }
            if (o.minutes === true) {
                m = parseInt(this.value[1]);
                m_list = picker.find(".sel-minutes");
                m_item = m_list.find("li.js-minutes-" + m).addClass("active");
                animateList(m_list, m_item);
            }
            if (o.seconds === true) {
                s = parseInt(this.value[2]);
                s_list = picker.find(".sel-seconds");
                s_item = s_list.find("li.js-seconds-" + s).addClass("active");
                animateList(s_list, s_item);
            }

            this.isOpen = true;

            this._fireEvent("open", {
                val: this.value
            });

        },

        close: function(){
            var picker = this.picker;
            picker.find(".select-wrapper").hide(0);
            this.isOpen = false;

            this._fireEvent("close", {
                val: this.value
            });
        },

        _convert: function(t){
            var result;

            if (Array.isArray(t)) {
                result = t;
            } else if (typeof  t.getMonth === 'function') {
                result = [t.getHours(), t.getMinutes(), t.getSeconds()];
            } else if (Utils.isObject(t)) {
                result = [t.h, t.m, t.s];
            } else {
                result = t.toArray(":");
            }

            return result;
        },

        val: function(t){
            if (t === undefined) {
                return this.element.val();
            }
            this.value = this._convert(t);
            this._normalizeValue();
            this._set();
        },

        time: function(t){
            if (t === undefined) {
                return {
                    h: this.value[0],
                    m: this.value[1],
                    s: this.value[2]
                }
            }

            this.value = this._convert(t);
            this._normalizeValue();
            this._set();
        },

        date: function(t){
            if (t === undefined || typeof t.getMonth !== 'function') {
                var ret = new Date();
                ret.setHours(this.value[0]);
                ret.setMinutes(this.value[1]);
                ret.setSeconds(this.value[2]);
                ret.setMilliseconds(0);
                return ret;
            }

            this.value = this._convert(t);
            this._normalizeValue();
            this._set();
        },

        disable: function(){
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function(){
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggleState: function(){
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        changeAttribute: function(attr, newValue){
            switch (attr) {
                case "data-value":
                    this.val(newValue);
                    break;
                case "disabled":
                    this.toggleState();
                    break;
            }
        },

        destroy: function(){
            var element = this.element;
            var picker = this.picker;

            $.each(['hours', 'minutes', 'seconds'], function(){
                picker.find(".sel-"+this).off("scroll");
            });

            picker.off(Metro.events.start, ".select-block ul");
            picker.off(Metro.events.click);
            picker.off(Metro.events.click, ".action-ok");
            picker.off(Metro.events.click, ".action-cancel");

            return element;
        }

    });

    $(document).on(Metro.events.click, function(){
        $.each($(".time-picker"), function(){
            $(this).find("input").each(function(){
                Metro.getPlugin(this, "timepicker").close();
            });
        });
    });
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var effects = [
        "slide-up", "slide-down", "slide-left", "slide-right", "fade", "zoom", "swirl", "switch"
    ];
    var TileDefaultConfig = {
        tileDeferred: 0,
        size: "medium",
        cover: "",
        coverPosition: "center",
        effect: "", // slide-up, slide-down, slide-left, slide-right, fade, zoom, swirl, switch
        effectInterval: 3000,
        effectDuration: 500,
        target: null,
        canTransform: true,
        onTileClick: Metro.noop,
        onTileCreate: Metro.noop
    };

    Metro.tileSetup = function (options) {
        TileDefaultConfig = $.extend({}, TileDefaultConfig, options);
    };

    if (typeof window["metroTileSetup"] !== undefined) {
        Metro.tileSetup(window["metroTileSetup"]);
    }

    Metro.Component('tile', {
        init: function( options, elem ) {
            this._super(elem, options, TileDefaultConfig, {
                effectInterval: false,
                images: [],
                slides: [],
                currentSlide: -1,
                unload: false
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createTile();
            this._createEvents();

            this._fireEvent("tile-create", {
                element: element
            });
        },

        _createTile: function(){
            function switchImage(el, img_src, i){
                $.setTimeout(function(){
                    el.fadeOut(500, function(){
                        el.css("background-image", "url(" + img_src + ")");
                        el.fadeIn();
                    });
                }, i * 300);
            }

            var that = this, element = this.element, o = this.options;
            var slides = element.find(".slide");
            var slides2 = element.find(".slide-front, .slide-back");

            element.addClass("tile-" + o.size);

            if (o.effect.indexOf("hover-") > -1) {
                element.addClass("effect-" + o.effect);
                $.each(slides2, function(){
                    var slide = $(this);

                    if (slide.data("cover") !== undefined) {
                        that._setCover(slide, slide.data("cover"), slide.data("cover-position"));
                    }
                })
            }

            if (effects.includes(o.effect) && slides.length > 1) {
                $.each(slides, function(i){
                    var slide = $(this);

                    that.slides.push(this);

                    if (slide.data("cover") !== undefined) {
                        that._setCover(slide, slide.data("cover"), slide.data("cover-position"));
                    }

                    if (i > 0) {
                        if (["slide-up", "slide-down"].indexOf(o.effect) > -1) slide.css("top", "100%");
                        if (["slide-left", "slide-right"].indexOf(o.effect) > -1) slide.css("left", "100%");
                        if (["fade", "zoom", "swirl", "switch"].indexOf(o.effect) > -1) slide.css("opacity", 0);
                    }
                });

                this.currentSlide = 0;

                this._runEffects();
            }

            if (o.cover !== "") {
                this._setCover(element, o.cover);
            }

            if (o.effect === "image-set") {
                element.addClass("image-set");

                $.each(element.children("img"), function(){
                    that.images.push(this);
                    $(this).remove();
                });

                var temp = this.images.slice();

                for(var i = 0; i < 5; i++) {
                    var rnd_index = $.random(0, temp.length - 1);
                    var div = $("<div>").addClass("img -js-img-"+i).css("background-image", "url("+temp[rnd_index].src+")");
                    element.prepend(div);
                    temp.splice(rnd_index, 1);
                }

                var a = [0, 1, 4, 3, 2];

                $.setInterval(function(){
                    var temp = that.images.slice();
                    var bg = Metro.colors.random();

                    element.css("background-color", bg);

                    for(var i = 0; i < a.length; i++) {
                        var rnd_index = $.random(0, temp.length - 1);
                        var div = element.find(".-js-img-"+a[i]);
                        switchImage(div, temp[rnd_index].src, i);
                        temp.splice(rnd_index, 1);
                    }

                    a = a.reverse();
                }, 5000);
            }
        },

        _runEffects: function(){
            var that = this, o = this.options;

            if (this.effectInterval === false) this.effectInterval = $.setInterval(function(){
                var current, next;

                current = $(that.slides[that.currentSlide]);

                that.currentSlide++;
                if (that.currentSlide === that.slides.length) {
                    that.currentSlide = 0;
                }

                next = that.slides[that.currentSlide];

                if (effects.includes(o.effect)) {
                    Metro.animations[o.effect.camelCase()]($(current), $(next), {duration: o.effectDuration});
                }

            }, o.effectInterval);
        },

        _stopEffects: function(){
            $.clearInterval(this.effectInterval);
            this.effectInterval = false;
        },

        _setCover: function(to, src, pos){
            if (!Utils.isValue(pos)) {
                pos = this.options.coverPosition;
            }
            to.css({
                backgroundImage: "url("+src+")",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: pos
            });
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

            element.on(Metro.events.startAll, function(e){
                var tile = $(this);
                var dim = {w: element.width(), h: element.height()};
                var X = Utils.pageXY(e).x - tile.offset().left,
                    Y = Utils.pageXY(e).y - tile.offset().top;
                var side;

                if (Utils.isRightMouse(e) === false) {

                    if (X < dim.w * 1 / 3 && (Y < dim.h * 1 / 2 || Y > dim.h * 1 / 2)) {
                        side = 'left';
                    } else if (X > dim.w * 2 / 3 && (Y < dim.h * 1 / 2 || Y > dim.h * 1 / 2)) {
                        side = 'right';
                    } else if (X > dim.w * 1 / 3 && X < dim.w * 2 / 3 && Y > dim.h / 2) {
                        side = 'bottom';
                    } else {
                        side = "top";
                    }

                    if (o.canTransform === true) tile.addClass("transform-" + side);

                    if (o.target !== null) {
                        setTimeout(function(){
                            document.location.href = o.target;
                        }, 100);
                    }

                    that._fireEvent("tile-click", {
                        side: side
                    });
                }
            });

            element.on([Metro.events.stopAll, Metro.events.leave].join(" "), function(){
                $(this)
                    .removeClass("transform-left")
                    .removeClass("transform-right")
                    .removeClass("transform-top")
                    .removeClass("transform-bottom");
            });
        },

        changeAttribute: function(){
        },

        destroy: function(){
            var element = this.element;

            element.off(Metro.events.startAll);

            element.off([Metro.events.stopAll, Metro.events.leave].join(" "));

            return element;
        }
    });
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';

    var Utils = Metro.utils;
    var TagInputDefaultConfig = {
        autocomplete: null,
        autocompleteUnique: true,
        autocompleteUrl: null,
        autocompleteUrlMethod: "GET",
        autocompleteUrlKey: null,
        autocompleteDivider: ",",
        autocompleteListHeight: 200,

        label: "",
        size: "normal",
        taginputDeferred: 0,
        static: false,
        clearButton: true,
        clearButtonIcon: "<span class='default-icon-cross'></span>",

        randomColor: false,
        maxTags: 0,
        tagSeparator: ",",
        tagTrigger: "Enter, Space, Comma",
        backspace: true,

        clsComponent: "",
        clsInput: "",
        clsClearButton: "",
        clsTag: "",
        clsTagTitle: "",
        clsTagRemover: "",
        clsLabel: "",

        onBeforeTagAdd: Metro.noop_true,
        onTagAdd: Metro.noop,
        onBeforeTagRemove: Metro.noop_true,
        onTagRemove: Metro.noop,
        onTag: Metro.noop,
        onClear: Metro.noop,
        onTagTrigger: Metro.noop,
        onTagInputCreate: Metro.noop
    };

    Metro.tagInputSetup = function (options) {
        TagInputDefaultConfig = $.extend({}, TagInputDefaultConfig, options);
    };

    if (typeof window["metroTagInputSetup"] !== undefined) {
        Metro.tagInputSetup(window["metroTagInputSetup"]);
    }

    Metro.Component('tag-input', {
        init: function( options, elem ) {
            this._super(elem, options, TagInputDefaultConfig, {
                values: [],
                triggers: [],
                autocomplete: []
            });

            return this;
        },

        _create: function(){
            this.triggers = (""+this.options.tagTrigger).toArray(",");

            if (this.triggers.contains("Space") || this.triggers.contains("Spacebar")) {
                this.triggers.push(" ");
                this.triggers.push("Spacebar");
            }

            if (this.triggers.contains("Comma")) {
                this.triggers.push(",");
            }

            this._createStructure();
            this._createEvents();

            this._fireEvent("tag-input-create", {
                element: this.element
            });
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;
            var container, input, clearButton;
            var values = element.val().trim();

            container = $("<div>").addClass("tag-input "  + element[0].className).addClass(o.clsComponent).insertBefore(element);
            element.appendTo(container);

            container.addClass("input-" + o.size)

            element[0].className = "";

            element.addClass("original-input");
            input = $("<input type='text'>").addClass("input-wrapper").addClass(o.clsInput).attr("size", 1);
            input.appendTo(container);

            if (o.clearButton !== false && !element[0].readOnly) {
                container.addClass("padding-for-clear");
                clearButton = $("<button>").addClass("button input-clear-button").attr("tabindex", -1).attr("type", "button").html(o.clearButtonIcon);
                clearButton.appendTo(container);
            }

            if (Utils.isValue(values)) {
                $.each(values.toArray(o.tagSeparator), function(){
                    that._addTag(this);
                })
            }

            if (o.label) {
                var label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(container);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }

            if (o.static === true || element.attr("readonly") !== undefined) {
                container.addClass("static-mode");
            }

            if (!Utils.isNull(o.autocomplete) || !Utils.isNull(o.autocompleteUrl)) {
                $("<div>").addClass("autocomplete-list").css({
                    maxHeight: o.autocompleteListHeight,
                    display: "none"
                }).appendTo(container);
            }

            if (Utils.isValue(o.autocomplete)) {
                var autocomplete_obj = Utils.isObject(o.autocomplete);

                if (autocomplete_obj !== false) {
                    this.autocomplete = autocomplete_obj;
                } else {
                    this.autocomplete = o.autocomplete.toArray(o.autocompleteDivider);
                }
            }

            if (Utils.isValue(o.autocompleteUrl)) {
                $.ajax({
                    url: o.autocompleteUrl,
                    method: o.autocompleteUrlMethod
                }).then(function(response){
                    var newData = [];

                    try {
                        newData = JSON.parse(response);
                        if (o.autocompleteUrlKey) {
                            newData = newData[o.autocompleteUrlKey];
                        }
                    } catch (e) {
                        newData = response.split("\n");
                    }

                    that.autocomplete = that.autocomplete.concat(newData);
                });
            }
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var container = element.closest(".tag-input");
            var input = container.find(".input-wrapper");
            var autocompleteList = container.find(".autocomplete-list");

            input.on(Metro.events.focus, function(){
                container.addClass("focused");
            });

            input.on(Metro.events.blur, function(){
                container.removeClass("focused");
            });

            input.on(Metro.events.inputchange, function(){
                input.attr("size", Math.ceil(input.val().length / 2) + 2);
            });

            input.on(Metro.events.keydown, function(e){
                var val = input.val().trim();
                var key = e.key;

                if (key === "Enter") e.preventDefault();

                if (o.backspace === true && key === "Backspace" && val.length === 0) {
                    if (that.values.length > 0) {
                        that.values.splice(-1,1);
                        element.siblings(".tag").last().remove();
                        element.val(that.values.join(o.tagSeparator));
                    }
                    return ;
                }

                if (val === "") {return ;}

                if (!that.triggers.contains(key)) {
                    return ;
                }

                that._fireEvent("tag-trigger", {
                    key: key
                });

                input.val("");
                that._addTag(val);
                input.attr("size", 1);
            });

            input.on(Metro.events.keyup, function(e){
                var val = input.val();
                var key = e.key;

                if (that.triggers.contains(key) && val[val.length - 1] === key) {
                    input.val(val.slice(0, -1));
                }
            });

            container.on(Metro.events.click, ".tag .remover", function(){
                var tag = $(this).closest(".tag");
                that._delTag(tag);
            });

            container.on(Metro.events.click, function(){
                input.focus();
            });

            container.on(Metro.events.click, ".input-clear-button", function(){
                var val = element.val();
                that.clear();

                that._fireEvent("clear", {
                    val: val
                });
            });

            input.on(Metro.events.input, function(){
                var val = this.value.toLowerCase();
                that._drawAutocompleteList(val);
            });

            container.on(Metro.events.click, ".autocomplete-list .item", function(){
                var val = $(this).attr("data-autocomplete-value");

                input.val("");
                that._addTag(val);
                input.attr("size", 1);

                autocompleteList.css({
                    display: "none"
                });
                that._fireEvent("autocomplete-select", {
                    value: val
                });
            });
        },

        _drawAutocompleteList: function(val){
            var that = this, element = this.element, o = this.options;
            var container = element.closest(".tag-input");
            var input = container.find(".input-wrapper");
            var autocompleteList = container.find(".autocomplete-list");
            var items;

            if (autocompleteList.length === 0) {
                return;
            }

            autocompleteList.html("");

            items = this.autocomplete.filter(function(item){
                return item.toLowerCase().indexOf(val) > -1;
            });

            autocompleteList.css({
                display: items.length > 0 ? "block" : "none",
                left: input.position().left
            });

            $.each(items, function(){
                if (o.autocompleteUnique && that.values.indexOf(this) !== -1) {
                    return ;
                }

                var v = this;
                var index = v.toLowerCase().indexOf(val), content;
                var item = $("<div>").addClass("item").attr("data-autocomplete-value", v);

                if (index === 0) {
                    content = "<strong>"+v.substr(0, val.length)+"</strong>"+v.substr(val.length);
                } else {
                    content = v.substr(0, index) + "<strong>"+v.substr(index, val.length)+"</strong>"+v.substr(index + val.length);
                }

                item.html(content).appendTo(autocompleteList);

                that._fireEvent("draw-autocomplete-item", {
                    item: item
                })
            });
        },

        _addTag: function(val){
            var element = this.element, o = this.options;
            var container = element.closest(".tag-input");
            var input = container.find(".input-wrapper");
            var tag, title, remover;
            var tagSize, tagStatic;

            if (container.hasClass("input-large")) {
                tagSize = "large";
            } else if (container.hasClass("input-small")) {
                tagSize = "small"
            }

            if (o.maxTags > 0 && this.values.length === o.maxTags) {
                return ;
            }

            if ((""+val).trim() === "") {
                return ;
            }

            if (!Utils.exec(o.onBeforeTagAdd, [val, this.values], element[0])) {
                return ;
            }


            tag = $("<span>")
                .addClass("tag")
                .addClass(tagSize)
                .addClass(o.clsTag)
                .insertBefore(input);
            tag.data("value", val);

            tagStatic = o.static || container.hasClass("static-mode") || element.readonly || element.disabled || container.hasClass("disabled");
            if (tagStatic) {
                tag.addClass("static");
            }

            title = $("<span>").addClass("title").addClass(o.clsTagTitle).html(val);
            remover = $("<span>").addClass("remover").addClass(o.clsTagRemover).html("&times;");

            title.appendTo(tag);
            remover.appendTo(tag);

            if (o.randomColor === true) {
                var colors = Metro.colors.colors(Metro.colors.PALETTES.ALL), bg, fg, bg_r;

                bg = colors[$.random(0, colors.length - 1)];
                bg_r = Metro.colors.darken(bg, 15);
                fg = Metro.colors.isDark(bg) ? "#ffffff" : "#000000";

                tag.css({
                    backgroundColor: bg,
                    color: fg
                });
                remover.css({
                    backgroundColor: bg_r,
                    color: fg
                });
            }

            this.values.push(val);
            element.val(this.values.join(o.tagSeparator));

            this._fireEvent("tag-add", {
                tag: tag[0],
                val: val,
                values: this.values
            });

            this._fireEvent("tag", {
                tag: tag[0],
                val: val,
                values: this.values
            });
        },

        _delTag: function(tag) {
            var element = this.element, o = this.options;
            var val = tag.data("value");

            if (!Utils.exec(o.onBeforeTagRemove, [tag, val, this.values], element[0])) {
                return ;
            }

            Utils.arrayDelete(this.values, val);
            element.val(this.values.join(o.tagSeparator));

            this._fireEvent("tag-remove", {
                tag: tag[0],
                val: val,
                values: this.values
            });

            this._fireEvent("tag", {
                tag: tag[0],
                val: val,
                values: this.values
            });

            tag.remove();
        },

        tags: function(){
            return this.values;
        },

        val: function(v){
            var that = this, element = this.element, o = this.options;
            var container = element.closest(".tag-input");
            var newValues = [];

            if (!Utils.isValue(v)) {
                return this.tags();
            }

            this.values = [];
            container.find(".tag").remove();

            if (typeof v === "string") {
                newValues = (""+v).toArray(o.tagSeparator);
            } else {
                if (Array.isArray(v)) {
                    newValues = v;
                }
            }

            $.each(newValues, function(){
                that._addTag(this);
            });

            return this;
        },

        append: function(v){
            var that = this, o = this.options;
            var newValues = this.values;

            if (typeof v === "string") {
                newValues = (""+v).toArray(o.tagSeparator);
            } else {
                if (Array.isArray(v)) {
                    newValues = v;
                }
            }

            $.each(newValues, function(){
                that._addTag(this);
            });

            return this;
        },

        clear: function(){
            var element = this.element;
            var container = element.closest(".tag-input");

            this.values = [];

            element.val("").trigger("change");

            container.find(".tag").remove();

            return this;
        },

        disable: function(){
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function(){
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggleState: function(){
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        toggleStatic: function(val){
            var container = this.element.closest(".tag-input");
            var staticMode;

            if (Utils.isValue(val)) {
                staticMode = Utils.bool(val);
            } else {
                staticMode = !container.hasClass("static-mode");
            }

            if (staticMode) {
                container.addClass("static-mode");
            } else {
                container.removeClass("static-mode");
            }
        },

        setAutocompleteList: function(l){
            var autocomplete_list = Utils.isObject(l);
            if (autocomplete_list !== false) {
                this.autocomplete = autocomplete_list;
            } else if (typeof l === "string") {
                this.autocomplete = l.toArray(this.options.autocompleteDivider);
            }
        },

        changeAttribute: function(attributeName){
            var that = this, element = this.element, o = this.options;

            var changeValue = function(){
                var val = element.attr("value").trim();
                that.clear();
                if (!Utils.isValue(val)) {
                    return ;
                }
                that.val(val.toArray(o.tagSeparator));
            };

            switch (attributeName) {
                case "value": changeValue(); break;
                case "disabled": this.toggleState(); break;
                case "static": this.toggleStatic(); break;
            }
        },

        destroy: function(){
            var element = this.element;
            var container = element.closest(".tag-input");
            var input = container.find(".input-wrapper");

            input.off(Metro.events.focus);
            input.off(Metro.events.blur);
            input.off(Metro.events.keydown);
            container.off(Metro.events.click, ".tag .remover");
            container.off(Metro.events.click);

            return element;
        }
    });

    $(document).on(Metro.events.click, function(){
        $('.tag-input .autocomplete-list').hide();
    });

}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';

    var Utils = Metro.utils;
    var TabsDefaultConfig = {
        tabsDeferred: 0,
        expand: false,
        expandPoint: null,
        tabsPosition: "top",
        tabsType: "default",

        clsTabs: "",
        clsTabsList: "",
        clsTabsListItem: "",
        clsTabsListItemActive: "",

        onTab: Metro.noop,
        onBeforeTab: Metro.noop_true,
        onTabsCreate: Metro.noop
    };

    Metro.tabsSetup = function (options) {
        TabsDefaultConfig = $.extend({}, TabsDefaultConfig, options);
    };

    if (typeof window["metroTabsSetup"] !== undefined) {
        Metro.tabsSetup(window["metroTabsSetup"]);
    }

    Metro.Component('tabs', {
        init: function( options, elem ) {
            this._super(elem, options, TabsDefaultConfig, {
                _targets: [],
                id: Utils.elementId('tabs')
            });

            return this;
        },

        _create: function(){
            var element = this.element;
            var tab = element.find(".active").length > 0 ? $(element.find(".active")[0]) : undefined;

            this._createStructure();
            this._createEvents();
            this._open(tab);

            this._fireEvent("tabs-create", {
                element: element
            });
        },

        _createStructure: function(){
            var element = this.element, o = this.options;
            var parent = element.parent();
            var right_parent = parent.hasClass("tabs");
            var container = right_parent ? parent : $("<div>").addClass("tabs tabs-wrapper");
            var expandTitle, hamburger;

            container.addClass(o.tabsPosition.replace(["-", "_", "+"], " "));

            element.addClass("tabs-list");
            if (o.tabsType !== "default") {
                element.addClass("tabs-"+o.tabsType);
            }
            if (!right_parent) {
                container.insertBefore(element);
                element.appendTo(container);
            }

            element.data('expanded', false);

            expandTitle = $("<div>").addClass("expand-title"); container.prepend(expandTitle);
            hamburger = container.find(".hamburger");
            if (hamburger.length === 0) {
                hamburger = $("<button>").attr("type", "button").addClass("hamburger menu-down").appendTo(container);
                for(var i = 0; i < 3; i++) {
                    $("<span>").addClass("line").appendTo(hamburger);
                }

                if (Metro.colors.isLight(Utils.getStyleOne(container, "background-color")) === true) {
                    hamburger.addClass("dark");
                }
            }

            container.addClass(o.clsTabs);
            element.addClass(o.clsTabsList);
            element.children("li").addClass(o.clsTabsListItem);

            if (o.expand === true && !o.tabsPosition.contains("vertical")) {
                container.addClass("tabs-expand");
            } else {
                if (Utils.isValue(o.expandPoint) && Utils.mediaExist(o.expandPoint) && !o.tabsPosition.contains("vertical")) {
                    container.addClass("tabs-expand");
                }
            }

            if (o.tabsPosition.contains("vertical")) {
                container.addClass("tabs-expand");
            }

        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var container = element.parent();

            $(window).on(Metro.events.resize, function(){

                if (o.tabsPosition.contains("vertical")) {
                    return ;
                }

                if (o.expand === true && !o.tabsPosition.contains("vertical")) {
                    container.addClass("tabs-expand");
                } else {
                    if (Utils.isValue(o.expandPoint) && Utils.mediaExist(o.expandPoint) && !o.tabsPosition.contains("vertical")) {
                        if (!container.hasClass("tabs-expand")) container.addClass("tabs-expand");
                    } else {
                        if (container.hasClass("tabs-expand")) container.removeClass("tabs-expand");
                    }
                }
            }, {ns: this.id});

            container.on(Metro.events.click, ".hamburger, .expand-title", function(){
                if (element.data('expanded') === false) {
                    element.addClass("expand");
                    element.data('expanded', true);
                    container.find(".hamburger").addClass("active");
                } else {
                    element.removeClass("expand");
                    element.data('expanded', false);
                    container.find(".hamburger").removeClass("active");
                }
            });

            element.on(Metro.events.click, "a", function(e){
                var link = $(this);
                var href = link.attr("href").trim();
                var tab = link.parent("li");

                if (tab.hasClass("active")) {
                    e.preventDefault();
                }

                if (element.data('expanded') === true) {
                    element.removeClass("expand");
                    element.data('expanded', false);
                    container.find(".hamburger").removeClass("active");
                }

                if (Utils.exec(o.onBeforeTab, [tab, element], tab[0]) !== true) {
                    return false;
                }

                if (Utils.isValue(href) && href[0] === "#") {
                    that._open(tab);
                    e.preventDefault();
                }
            });
        },

        _collectTargets: function(){
            var that = this, element = this.element;
            var tabs = element.find("li");

            this._targets = [];

            $.each(tabs, function(){
                var target = $(this).find("a").attr("href").trim();
                if (target.length > 1 && target[0] === "#") {
                    that._targets.push(target);
                }
            });
        },

        _open: function(tab){
            var element = this.element, o = this.options;
            var tabs = element.find("li");
            var expandTitle = element.siblings(".expand-title");


            if (tabs.length === 0) {
                return;
            }

            this._collectTargets();

            if (tab === undefined) {
                tab = $(tabs[0]);
            }

            var target = tab.find("a").attr("href");

            if (target === undefined) {
                return;
            }

            tabs.removeClass("active").removeClass(o.clsTabsListItemActive);
            if (tab.parent().hasClass("d-menu")) {
                tab.parent().parent().addClass("active");
            } else {
                tab.addClass("active");
            }

            $.each(this._targets, function(){
                var t = $(this);
                if (t.length > 0) t.hide();
            });

            if (target !== "#" && target[0] === "#") {
                $(target).show();
            }

            expandTitle.html(tab.find("a").html());

            tab.addClass(o.clsTabsListItemActive);

            this._fireEvent("tab", {
                tab: tab[0]
            });
        },

        next: function(){
            var element = this.element;
            var next, active_tab = element.find("li.active");

            next = active_tab.next("li");
            if (next.length > 0) {
                this._open(next);
            }
        },

        prev: function(){
            var element = this.element;
            var next, active_tab = element.find("li.active");

            next = active_tab.prev("li");
            if (next.length > 0) {
                this._open(next);
            }
        },

        open: function(tab){
            var element = this.element;
            var tabs = element.find("li");

            if (!Utils.isValue(tab)) {
                tab = 1;
            }

            if (Utils.isInt(tab)) {
                if (Utils.isValue(tabs[tab-1])) this._open($(tabs[tab-1]));
            } else {
                this._open($(tab));
            }
        },

        changeAttribute: function(){
        },

        destroy: function(){
            var element = this.element;
            var container = element.parent();

            $(window).off(Metro.events.resize,{ns: this.id});

            container.off(Metro.events.click, ".hamburger, .expand-title");

            element.off(Metro.events.click, "a");

            return element;
        }
    });
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var SpinnerDefaultConfig = {
        spinnerDeferred: 0,
        label: "",
        step: 1,
        plusIcon: "<span class='default-icon-plus'></span>",
        minusIcon: "<span class='default-icon-minus'></span>",
        buttonsPosition: "default",
        defaultValue: 0,
        minValue: null,
        maxValue: null,
        fixed: 0,
        repeatThreshold: 1000,
        hideCursor: false,
        clsSpinner: "",
        clsSpinnerInput: "",
        clsSpinnerButton: "",
        clsSpinnerButtonPlus: "",
        clsSpinnerButtonMinus: "",
        clsLabel: "",
        onBeforeChange: Metro.noop_true,
        onChange: Metro.noop,
        onPlusClick: Metro.noop,
        onMinusClick: Metro.noop,
        onArrowUp: Metro.noop,
        onArrowDown: Metro.noop,
        onButtonClick: Metro.noop,
        onArrowClick: Metro.noop,
        onSpinnerCreate: Metro.noop
    };

    Metro.spinnerSetup = function (options) {
        SpinnerDefaultConfig = $.extend({}, SpinnerDefaultConfig, options);
    };

    if (typeof window["metroSpinnerSetup"] !== undefined) {
        Metro.spinnerSetup(window["metroSpinnerSetup"]);
    }

    Metro.Component('spinner', {
        init: function( options, elem ) {
            this._super(elem, options, SpinnerDefaultConfig, {
                repeat_timer: false
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("spinner-create", {
                element: element
            });
        },

        _createStructure: function(){
            var element = this.element, o = this.options;
            var spinner = $("<div>").addClass("spinner").addClass("buttons-"+o.buttonsPosition).addClass(element[0].className).addClass(o.clsSpinner);
            var button_plus = $("<button>").attr("type", "button").addClass("button spinner-button spinner-button-plus").addClass(o.clsSpinnerButton + " " + o.clsSpinnerButtonPlus).html(o.plusIcon);
            var button_minus = $("<button>").attr("type", "button").addClass("button spinner-button spinner-button-minus").addClass(o.clsSpinnerButton + " " + o.clsSpinnerButtonMinus).html(o.minusIcon);
            var init_value = element.val().trim();

            if (!Utils.isValue(init_value)) {
                element.val(0);
            }

            element[0].className = '';

            spinner.insertBefore(element);
            element.appendTo(spinner).addClass(o.clsSpinnerInput);

            element.addClass("original-input");

            button_plus.appendTo(spinner);
            button_minus.appendTo(spinner);

            if (o.hideCursor === true) {
                spinner.addClass("hide-cursor");
            }

            if (o.label) {
                var label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(spinner);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (o.disabled === true || element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var spinner = element.closest(".spinner");
            var spinner_buttons = spinner.find(".spinner-button");
            var value;

            var spinnerButtonClick = function(plus, threshold){
                var events = [plus ? "plus-click" : "minus-click", plus ? "arrow-up" : "arrow-down", "button-click", "arrow-click"];
                var curr = +element.val();
                var val = +element.val();
                var step = +o.step;

                if (plus) {
                    val += step;
                } else {
                    val -= step;
                }

                that._setValue(val.toFixed(o.fixed), true);

                that._fireEvents(events, {
                    curr: curr,
                    val: val,
                    elementVal: element.val(),
                    button: plus ? "plus" : "minus"
                });

                setTimeout(function(){
                    if (that.repeat_timer) {
                        spinnerButtonClick(plus, 100);
                    }
                }, threshold);
            };

            spinner.on(Metro.events.click, function(e){
                $(".focused").removeClass("focused");
                spinner.addClass("focused");

                e.preventDefault();
                e.stopPropagation();
            });

            spinner_buttons.on(Metro.events.startAll, function(e){
                var plus = $(this).closest(".spinner-button").hasClass("spinner-button-plus");

                if (that.repeat_timer) return ;

                that.repeat_timer = true;
                spinnerButtonClick(plus, o.repeatThreshold);

                e.preventDefault();
            });

            spinner_buttons.on(Metro.events.stopAll, function(){
                that.repeat_timer = false;
            });

            element.on(Metro.events.keydown, function(e){
                if (e.keyCode === Metro.keyCode.UP_ARROW || e.keyCode === Metro.keyCode.DOWN_ARROW) {

                    if (that.repeat_timer) return ;

                    that.repeat_timer = true;
                    spinnerButtonClick(e.keyCode === Metro.keyCode.UP_ARROW, o.repeatThreshold);

                } else {
                    var key = e.key;
                    if (key === "Backspace" || key === "Delete" || key === "ArrowLeft" || key === "ArrowRight" ) {
                        //
                    } else
                    if (isNaN(key) || parseInt(key) < 0 && parseInt(key) > 9) {
                        e.preventDefault();
                    }

                    value = parseInt(this.value);
                }
            });

            element.on(Metro.events.keyup, function(){
                var val = parseInt(this.value);
                if ((o.minValue && val < o.minValue) || (o.maxValue && val > o.maxValue)) {
                    this.value = value;
                }
            });

            spinner.on(Metro.events.keyup, function(){
                that.repeat_timer = false;
            });
        },

        _setValue: function(val, trigger_change){
            var element = this.element, o = this.options;

            if (Utils.exec(o.onBeforeChange, [val], element[0]) !== true) {
                return ;
            }

            if (Utils.isValue(o.maxValue) && val > Number(o.maxValue)) {
                val =  Number(o.maxValue);
            }

            if (Utils.isValue(o.minValue) && val < Number(o.minValue)) {
                val =  Number(o.minValue);
            }

            element.val(val);

            this._fireEvent("change", {val: val}, false, true);

            if (trigger_change === true) {
                element.fire("change", {
                    val: val
                });
            }
        },

        val: function(val){
            var that = this, element = this.element, o = this.options;
            if (!Utils.isValue(val)) {
                return element.val();
            }

            that._setValue(val.toFixed(o.fixed), true);
        },

        toDefault: function(){
            var o = this.options;
            var val = Utils.isValue(o.defaultValue) ? Number(o.defaultValue) : 0;
            this._setValue(val.toFixed(o.fixed), true);

            this._fireEvent("change", {
                val: val
            });
        },

        disable: function(){
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function(){
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggleState: function(){
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        changeAttribute: function(attributeName){
            var that = this, element = this.element;

            var changeValue = function(){
                var val = element.attr('value').trim();
                if (Utils.isValue(val)) {
                    that._setValue(Number(val), false);
                }
            };

            switch (attributeName) {
                case 'disabled': this.toggleState(); break;
                case 'value': changeValue(); break;
            }
        },

        destroy: function(){
            var element = this.element;
            var spinner = element.closest(".spinner");
            var spinner_buttons = spinner.find(".spinner-button");

            spinner.off(Metro.events.click);
            spinner_buttons.off(Metro.events.start);
            spinner_buttons.off(Metro.events.stop);
            element.off(Metro.events.keydown);
            spinner.off(Metro.events.keyup);

            return element;
        }
    });

    $(document).on(Metro.events.click, function(){
        $(".spinner").removeClass("focused");
    });
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var SliderDefaultConfig = {
        sliderDeferred: 0,
        roundValue: true,
        min: 0,
        max: 100,
        accuracy: 0,
        showMinMax: false,
        minMaxPosition: Metro.position.TOP,
        value: 0,
        buffer: 0,
        hint: false,
        hintAlways: false,
        hintPosition: Metro.position.TOP,
        hintMask: "$1",
        vertical: false,
        target: null,
        returnType: "value", // value or percent
        size: 0,

        clsSlider: "",
        clsBackside: "",
        clsComplete: "",
        clsBuffer: "",
        clsMarker: "",
        clsHint: "",
        clsMinMax: "",
        clsMin: "",
        clsMax: "",

        onStart: Metro.noop,
        onStop: Metro.noop,
        onMove: Metro.noop,
        onSliderClick: Metro.noop,
        onChange: Metro.noop,
        onChangeValue: Metro.noop,
        onChangeBuffer: Metro.noop,
        onFocus: Metro.noop,
        onBlur: Metro.noop,
        onSliderCreate: Metro.noop
    };

    Metro.sliderSetup = function (options) {
        SliderDefaultConfig = $.extend({}, SliderDefaultConfig, options);
    };

    if (typeof window["metroSliderSetup"] !== undefined) {
        Metro.sliderSetup(window["metroSliderSetup"]);
    }

    Metro.Component('slider', {
        init: function( options, elem ) {
            this._super(elem, options, SliderDefaultConfig, {
                slider: null,
                value: 0,
                percent: 0,
                pixel: 0,
                buffer: 0,
                keyInterval: false,
                id: Utils.elementId('slider')
            });

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;

            this._createSlider();
            this._createEvents();
            this.buff(o.buffer);
            this.val(o.value);

            this._fireEvent("slider-create", {
                element: element
            });
        },

        _createSlider: function(){
            var element = this.element, o = this.options;

            var prev = element.prev();
            var parent = element.parent();
            var slider = $("<div>").addClass("slider " + element[0].className).addClass(o.clsSlider);
            var backside = $("<div>").addClass("backside").addClass(o.clsBackside);
            var complete = $("<div>").addClass("complete").addClass(o.clsComplete);
            var buffer = $("<div>").addClass("buffer").addClass(o.clsBuffer);
            var marker = $("<button>").attr("type", "button").addClass("marker").addClass(o.clsMarker);
            var hint = $("<div>").addClass("hint").addClass(o.hintPosition + "-side").addClass(o.clsHint);
            var i;

            if (o.size > 0) {
                if (o.vertical === true) {
                    slider.outerHeight(o.size);
                } else {
                    slider.outerWidth(o.size);
                }
            }

            if (o.vertical === true) {
                slider.addClass("vertical-slider");
            }

            if (prev.length === 0) {
                parent.prepend(slider);
            } else {
                slider.insertAfter(prev);
            }

            if (o.hintAlways === true) {
                hint.css({
                    display: "block"
                }).addClass("permanent-hint");
            }

            element.appendTo(slider);
            backside.appendTo(slider);
            complete.appendTo(slider);
            buffer.appendTo(slider);
            marker.appendTo(slider);
            hint.appendTo(marker);

            if (o.showMinMax === true) {
                var min_max_wrapper = $("<div>").addClass("slider-min-max").addClass(o.clsMinMax);
                $("<span>").addClass("slider-text-min").addClass(o.clsMin).html(o.min).appendTo(min_max_wrapper);
                $("<span>").addClass("slider-text-max").addClass(o.clsMax).html(o.max).appendTo(min_max_wrapper);
                if (o.minMaxPosition === Metro.position.TOP) {
                    min_max_wrapper.insertBefore(slider);
                } else {
                    min_max_wrapper.insertAfter(slider);
                }
            }

            element[0].className = '';
            if (o.copyInlineStyles === true) {
                for (i = 0; i < element[0].style.length; i++) {
                    slider.css(element[0].style[i], element.css(element[0].style[i]));
                }
            }

            if (element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }

            this.slider = slider;
        },

        _createEvents: function(){
            var that = this, slider = this.slider, o = this.options;
            var marker = slider.find(".marker");
            var hint = slider.find(".hint");

            marker.on(Metro.events.startAll, function(){
                if (o.hint === true && o.hintAlways !== true) {
                    hint.fadeIn(300);
                }

                $(document).on(Metro.events.moveAll, function(e){
                    if (e.cancelable) e.preventDefault();
                    that._move(e);

                    that._fireEvent("move", {
                        val: that.value,
                        percent: that.percent
                    });

                }, {ns: that.id, passive: false});

                $(document).on(Metro.events.stopAll, function(){
                    $(document).off(Metro.events.moveAll, {ns: that.id});
                    $(document).off(Metro.events.stopAll, {ns: that.id});

                    if (o.hintAlways !== true) {
                        hint.fadeOut(300);
                    }

                    that._fireEvent("stop", {
                        val: that.value,
                        percent: that.percent
                    });
                }, {ns: that.id});

                that._fireEvent("start", {
                    val: that.value,
                    percent: that.percent
                });
            });

            marker.on(Metro.events.focus, function(){
                that._fireEvent("focus", {
                    val: that.value,
                    percent: that.percent
                });
            });

            marker.on(Metro.events.blur, function(){
                that._fireEvent("blur", {
                    val: that.value,
                    percent: that.percent
                });
            });

            marker.on(Metro.events.keydown, function(e){

                var key = e.keyCode ? e.keyCode : e.which;

                if ([37,38,39,40].indexOf(key) === -1) {
                    return;
                }

                var step = o.accuracy === 0 ? 1 : o.accuracy;

                if (that.keyInterval) {
                    return ;
                }
                that.keyInterval = setInterval(function(){

                    var val = that.value;

                    if (e.keyCode === 37 || e.keyCode === 40) { // left, down
                        if (val - step < o.min) {
                            val = o.min;
                        } else {
                            val -= step;
                        }
                    }

                    if (e.keyCode === 38 || e.keyCode === 39) { // right, up
                        if (val + step > o.max) {
                            val = o.max;
                        } else {
                            val += step;
                        }
                    }

                    that.value = that._correct(val);
                    that.percent = that._convert(that.value, 'val2prc');
                    that.pixel = that._convert(that.percent, 'prc2pix');

                    that._redraw();
                }, 100);

                e.preventDefault();
            });

            marker.on(Metro.events.keyup, function(){
                clearInterval(that.keyInterval);
                that.keyInterval = false;
            });

            slider.on(Metro.events.click, function(e){
                that._move(e);

                that._fireEvent("slider-click", {
                    val: that.value,
                    percent: that.percent
                });

                that._fireEvent("stop", {
                    val: that.value,
                    percent: that.percent
                });
            });

            $(window).on(Metro.events.resize,function(){
                that.val(that.value);
                that.buff(that.buffer);
            }, {ns: that.id});
        },

        _convert: function(v, how){
            var slider = this.slider, o = this.options;
            var length = (o.vertical === true ? slider.outerHeight() : slider.outerWidth()) - slider.find(".marker").outerWidth();
            switch (how) {
                case "pix2prc": return ( v * 100 / length );
                case "pix2val": return ( this._convert(v, 'pix2prc') * ((o.max - o.min) / 100) + o.min );
                case "val2prc": return ( (v - o.min)/( (o.max - o.min) / 100 )  );
                case "prc2pix": return ( v / ( 100 / length ));
                case "val2pix": return ( this._convert(this._convert(v, 'val2prc'), 'prc2pix') );
            }

            return 0;
        },

        _correct: function(value){
            var res = value;
            var accuracy  = this.options.accuracy;
            var min = this.options.min, max = this.options.max;

            if (accuracy === 0 || isNaN(accuracy)) {
                return res;
            }

            res = Math.round(value/accuracy)*accuracy;

            if (res < min) {
                res = min;
            }

            if (res > max) {
                res = max;
            }

            return res.toFixed(Utils.decCount(accuracy));
        },

        _move: function(e){
            var slider = this.slider, o = this.options;
            var offset = slider.offset(),
                marker_size = slider.find(".marker").outerWidth(),
                length = o.vertical === true ? slider.outerHeight() : slider.outerWidth(),
                cPos, cPix, cStart = 0, cStop = length - marker_size;

            cPos = o.vertical === true ? Utils.pageXY(e).y - offset.top : Utils.pageXY(e).x - offset.left;
            cPix = o.vertical === true ? length - cPos - marker_size / 2 : cPos - marker_size / 2;

            if (cPix < cStart || cPix > cStop) {
                return ;
            }

            this.value = this._correct(this._convert(cPix, 'pix2val'));
            this.percent = this._convert(this.value, 'val2prc');
            this.pixel = this._convert(this.percent, 'prc2pix');

            this._redraw();
        },

        _hint: function(){
            var o = this.options, slider = this.slider, hint = slider.find(".hint");
            var value = +this.value || 0;
            var percent = +this.percent || 0;

            if (o.roundValue) {
                value = (Utils.isValue(value) ? +value : 0).toFixed(Utils.decCount(o.accuracy));
                percent = (Utils.isValue(percent) ? +percent : 0).toFixed(Utils.decCount(o.accuracy));
            }

            hint.text(o.hintMask.replace("$1", value).replace("$2", percent));
        },

        _value: function(){
            var element = this.element, o = this.options;
            var value = o.returnType === 'value' ? this.value : this.percent;
            var percent = this.percent;
            var buffer = this.buffer;

            if (o.roundValue) {
                value = (Utils.isValue(value) ? +value : 0).toFixed(Utils.decCount(o.accuracy));
                percent = (Utils.isValue(percent) ? +percent : 0).toFixed(Utils.decCount(o.accuracy));
                buffer = (Utils.isValue(buffer) ? +buffer : 0).toFixed(Utils.decCount(o.accuracy));
            }

            if (element[0].tagName === "INPUT") {
                element.val(value);
            }

            if (o.target !== null) {
                var target = $(o.target);
                if (target.length !== 0) {

                    $.each(target, function(){
                        var t = $(this);
                        if (this.tagName === "INPUT") {
                            t.val(value);
                        } else {
                            t.text(value);
                        }
                        t.trigger("change");
                    });
                }
            }

            this._fireEvent("change-value", {
                val: value
            });

            this._fireEvent("change", {
                val: value,
                percent: percent,
                buffer: buffer
            });
        },

        _marker: function(){
            var slider = this.slider, o = this.options;
            var marker = slider.find(".marker"), complete = slider.find(".complete");
            var length = o.vertical === true ? slider.outerHeight() : slider.outerWidth();
            var marker_size = parseInt(Utils.getStyleOne(marker, "width"));
            var slider_visible = Utils.isVisible(slider);

            if (slider_visible) {
                marker.css({
                    'margin-top': 0,
                    'margin-left': 0
                });
            }

            if (o.vertical === true) {
                if (slider_visible) {
                    marker.css('top', length - this.pixel);
                } else {
                    marker.css('top', (100 - this.percent) + "%");
                    marker.css('margin-top', marker_size / 2);
                }
                complete.css('height', this.percent+"%");
            } else {
                if (slider_visible) {
                    marker.css('left', this.pixel);
                } else {
                    marker.css('left', this.percent + "%");
                    marker.css('margin-left', this.percent === 0 ? 0 : -1 * marker_size / 2);
                }
                complete.css('width', this.percent+"%");
            }
        },

        _redraw: function(){
            this._marker();
            this._value();
            this._hint();
        },

        _buffer: function(){
            var element = this.element, o = this.options;
            var buffer = this.slider.find(".buffer");

            if (o.vertical === true) {
                buffer.css("height", this.buffer + "%");
            } else {
                buffer.css("width", this.buffer + "%");
            }

            this._fireEvent("change-buffer", {
                val: this.buffer
            });

            this._fireEvent("change", {
                val: element.val(),
                percent: this.percent,
                buffer: this.buffer
            });
        },

        val: function(v){
            var o = this.options;

            if (v === undefined || isNaN(v)) {
                return this.value;
            }

            if (v < o.min) {
                v = o.min;
            }

            if (v > o.max) {
                v = o.max;
            }

            this.value = this._correct(v);
            this.percent = this._convert(this.value, 'val2prc');
            this.pixel = this._convert(this.percent, 'prc2pix');

            this._redraw();
        },

        buff: function(v){
            var slider = this.slider;
            var buffer = slider.find(".buffer");

            if (v === undefined || isNaN(v)) {
                return this.buffer;
            }

            if (buffer.length === 0) {
                return false;
            }

            v = parseInt(v);

            if (v > 100) {
                v = 100;
            }

            if (v < 0) {
                v = 0;
            }

            this.buffer = v;
            this._buffer();
        },

        changeValue: function(){
            var element = this.element, o = this.options;
            var val = element.attr("data-value");
            if (val < o.min) {
                val = o.min
            }
            if (val > o.max) {
                val = o.max
            }
            this.val(val);
        },

        changeBuffer: function(){
            var element = this.element;
            var val = parseInt(element.attr("data-buffer"));
            if (val < 0) {
                val = 0
            }
            if (val > 100) {
                val = 100
            }
            this.buff(val);
        },

        disable: function(){
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function(){
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggleState: function(){
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case "data-value": this.changeValue(); break;
                case "data-buffer": this.changeBuffer(); break;
                case 'disabled': this.toggleState(); break;
            }
        },

        destroy: function(){
            var element = this.element, slider = this.slider;
            var marker = slider.find(".marker");

            marker.off(Metro.events.startAll);
            marker.off(Metro.events.focus);
            marker.off(Metro.events.blur);
            marker.off(Metro.events.keydown);
            marker.off(Metro.events.keyup);
            slider.off(Metro.events.click);
            $(window).off(Metro.events.resize, {ns: this.id});

            return element;
        }
    });
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var RibbonMenuDefaultConfig = {
        ribbonmenuDeferred: 0,
        onStatic: Metro.noop,
        onBeforeTab: Metro.noop_true,
        onTab: Metro.noop,
        onRibbonMenuCreate: Metro.noop
    };

    Metro.ribbonMenuSetup = function (options) {
        RibbonMenuDefaultConfig = $.extend({}, RibbonMenuDefaultConfig, options);
    };

    if (typeof window["metroRibbonMenuSetup"] !== undefined) {
        Metro.ribbonMenuSetup(window["metroRibbonMenuSetup"]);
    }

    Metro.Component('ribbon-menu', {
        init: function( options, elem ) {
            this._super(elem, options, RibbonMenuDefaultConfig);

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("ribbon-menu-create", {
                element: element
            });
        },

        _createStructure: function(){
            var element = this.element;

            element.addClass("ribbon-menu");

            var tabs = element.find(".tabs-holder li:not(.static)");
            var active_tab = element.find(".tabs-holder li.active");
            if (active_tab.length > 0) {
                this.open($(active_tab[0]));
            } else {
                if (tabs.length > 0) {
                    this.open($(tabs[0]));
                }
            }

            var fluentGroups = element.find(".ribbon-toggle-group");
            $.each(fluentGroups, function(){
                var g = $(this);
                g.buttongroup({
                    clsActive: "active"
                });

                var gw = 0;
                var btns = g.find(".ribbon-icon-button");
                $.each(btns, function(){
                    var b = $(this);
                    var w = b.outerWidth(true);
                    if (w > gw) gw = w;
                });

                g.css("width", gw * Math.ceil(btns.length / 3) + 4);
            });
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

            element.on(Metro.events.click, ".tabs-holder li a", function(e){
                var link = $(this);
                var tab = $(this).parent("li");

                if (tab.hasClass("static")) {
                    if (o.onStatic === Metro.noop && link.attr("href") !== undefined) {
                        document.location.href = link.attr("href");
                    } else {
                        that._fireEvent("static", {
                            tab: tab[0]
                        });
                    }
                } else {
                    if (Utils.exec(o.onBeforeTab, [tab[0]], element[0]) === true) {
                        that.open(tab[0]);
                    }
                }
                e.preventDefault();
            })
        },

        open: function(tab){
            var element = this.element;
            var $tab = $(tab);
            var tabs = element.find(".tabs-holder li");
            var sections = element.find(".content-holder .section");
            var target = $tab.children("a").attr("href");
            var target_section = target !== "#" ? element.find(target) : null;

            tabs.removeClass("active");
            $tab.addClass("active");

            sections.removeClass("active");
            if (target_section) target_section.addClass("active");

            this._fireEvent("tab", {
                tab: $tab[0]
            });
        },

        changeAttribute: function(){
        },

        destroy: function(){
            var element = this.element;
            element.off(Metro.events.click, ".tabs-holder li a");
            return element;
        }
    });
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var ProgressDefaultConfig = {
        progressDeferred: 0,
        showValue: false,
        valuePosition: "free", // center, free
        showLabel: false,
        labelPosition: "before", // before, after
        labelTemplate: "",
        value: 0,
        buffer: 0,
        type: "bar",
        small: false,
        clsBack: "",
        clsBar: "",
        clsBuffer: "",
        clsValue: "",
        clsLabel: "",
        onValueChange: Metro.noop,
        onBufferChange: Metro.noop,
        onComplete: Metro.noop,
        onBuffered: Metro.noop,
        onProgressCreate: Metro.noop
    };

    Metro.progressSetup = function (options) {
        ProgressDefaultConfig = $.extend({}, ProgressDefaultConfig, options);
    };

    if (typeof window["metroProgressSetup"] !== undefined) {
        Metro.progressSetup(window["metroProgressSetup"]);
    }

    Metro.Component('progress', {
        init: function( options, elem ) {
            this._super(elem, options, ProgressDefaultConfig, {
                value: 0,
                buffer: 0
            });

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;
            var value;

            if (typeof o.type === "string") o.type = o.type.toLowerCase();

            element
                .html("")
                .addClass("progress");

            function _progress(){
                $("<div>").addClass("bar").appendTo(element);
            }

            function _buffer(){
                $("<div>").addClass("bar").appendTo(element);
                $("<div>").addClass("buffer").appendTo(element);
            }

            function _load(){
                element.addClass("with-load");
                $("<div>").addClass("bar").appendTo(element);
                $("<div>").addClass("buffer").appendTo(element);
                $("<div>").addClass("load").appendTo(element);
            }

            function _line(){
                element.addClass("line");
            }

            switch (o.type) {
                case "buffer": _buffer(); break;
                case "load": _load(); break;
                case "line": _line(); break;
                default: _progress();
            }

            if (o.type !== 'line') {
                value = $("<span>").addClass("value").addClass(o.clsValue).appendTo(element);
                if (o.valuePosition === "center") value.addClass("centered");
                if (o.showValue === false) value.hide();
            }

            if (o.small === true) element.addClass("small");

            element.addClass(o.clsBack);
            element.find(".bar").addClass(o.clsBar);
            element.find(".buffer").addClass(o.clsBuffer);

            if (o.showLabel === true) {
                var label = $("<span>").addClass("progress-label").addClass(o.clsLabel).html(o.labelTemplate === "" ? o.value+"%" : o.labelTemplate.replace("%VAL%", o.value));
                if (o.labelPosition === 'before') {
                    label.insertBefore(element);
                } else {
                    label.insertAfter(element);
                }
            }

            this.val(o.value);
            this.buff(o.buffer);

            this._fireEvent("progress-create", {
                element: element
            });
        },

        val: function(v){
            var that = this, element = this.element, o = this.options;
            var value = element.find(".value");

            if (v === undefined) {
                return that.value;
            }

            var bar  = element.find(".bar");

            if (bar.length === 0) {
                return false;
            }

            this.value = parseInt(v, 10);

            bar.css("width", this.value + "%");
            value.html(this.value+"%");

            var diff = element.width() - bar.width();
            var valuePosition = value.width() > diff ? {left: "auto", right: diff + 'px'} : {left: v + '%'};

            if (o.valuePosition === "free") value.css(valuePosition);

            if (o.showLabel === true) {
                var label = element[o.labelPosition === "before" ? "prev" : "next"](".progress-label");
                if (label.length) {
                    label.html(o.labelTemplate === "" ? o.value+"%" : o.labelTemplate.replace("%VAL%", o.value));
                }
            }

            this._fireEvent("value-change", {
                val: this.value
            });

            if (this.value === 100) {

                this._fireEvent("complete", {
                    val: this.value
                });

            }
        },

        buff: function(v){
            var that = this, element = this.element;

            if (v === undefined) {
                return that.buffer;
            }

            var bar  = element.find(".buffer");

            if (bar.length === 0) {
                return false;
            }

            this.buffer = parseInt(v, 10);

            bar.css("width", this.buffer + "%");

            this._fireEvent("buffer-change", {
                val: this.buffer
            });

            if (this.buffer === 100) {
                this._fireEvent("buffered", {
                    val: this.buffer
                });
            }
        },

        changeValue: function(){
            this.val(this.element.attr('data-value'));
        },

        changeBuffer: function(){
            this.buff(this.element.attr('data-buffer'));
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case 'data-value': this.changeValue(); break;
                case 'data-buffer': this.changeBuffer(); break;
            }
        },

        destroy: function(){
            return this.element;
        }
    });
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var InputDefaultConfig = {
        inputDeferred: 0,

        label: "",

        autocomplete: null,
        autocompleteUrl: null,
        autocompleteUrlMethod: "GET",
        autocompleteUrlKey: null,
        autocompleteDivider: ",",
        autocompleteListHeight: 200,

        history: false,
        historyPreset: "",
        historyDivider: "|",
        preventSubmit: false,
        defaultValue: "",
        size: "default",
        prepend: "",
        append: "",
        copyInlineStyles: false,
        searchButton: false,
        clearButton: true,
        revealButton: true,
        clearButtonIcon: "<span class='default-icon-cross'></span>",
        revealButtonIcon: "<span class='default-icon-eye'></span>",
        searchButtonIcon: "<span class='default-icon-search'></span>",
        customButtons: [],
        searchButtonClick: 'submit',

        clsComponent: "",
        clsInput: "",
        clsPrepend: "",
        clsAppend: "",
        clsClearButton: "",
        clsRevealButton: "",
        clsCustomButton: "",
        clsSearchButton: "",
        clsLabel: "",

        onAutocompleteSelect: Metro.noop,
        onHistoryChange: Metro.noop,
        onHistoryUp: Metro.noop,
        onHistoryDown: Metro.noop,
        onClearClick: Metro.noop,
        onRevealClick: Metro.noop,
        onSearchButtonClick: Metro.noop,
        onEnterClick: Metro.noop,
        onInputCreate: Metro.noop
    };

    Metro.inputSetup = function (options) {
        InputDefaultConfig = $.extend({}, InputDefaultConfig, options);
    };

    if (typeof window["metroInputSetup"] !== undefined) {
        Metro.inputSetup(window["metroInputSetup"]);
    }

    Metro.Component('input', {
        init: function( options, elem ) {
            this._super(elem, options, InputDefaultConfig, {
                history: [],
                historyIndex: -1,
                autocomplete: []
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("input-create", {
                element: element
            });
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;
            var container = $("<div>").addClass("input " + element[0].className);
            var buttons = $("<div>").addClass("button-group");
            var clearButton, revealButton, searchButton;

            if (Utils.isValue(o.historyPreset)) {
                $.each(o.historyPreset.toArray(o.historyDivider), function(){
                    that.history.push(this);
                });
                that.historyIndex = that.history.length - 1;
            }

            if (element.attr("type") === undefined) {
                element.attr("type", "text");
            }

            container.insertBefore(element);
            element.appendTo(container);
            buttons.appendTo(container);

            if (!Utils.isValue(element.val().trim())) {
                element.val(o.defaultValue);
            }

            if (o.clearButton === true && !element[0].readOnly) {
                clearButton = $("<button>").addClass("button input-clear-button").addClass(o.clsClearButton).attr("tabindex", -1).attr("type", "button").html(o.clearButtonIcon);
                clearButton.appendTo(buttons);
            }
            if (element.attr('type') === 'password' && o.revealButton === true) {
                revealButton = $("<button>").addClass("button input-reveal-button").addClass(o.clsRevealButton).attr("tabindex", -1).attr("type", "button").html(o.revealButtonIcon);
                revealButton.appendTo(buttons);
            }
            if (o.searchButton === true) {
                searchButton = $("<button>").addClass("button input-search-button").addClass(o.clsSearchButton).attr("tabindex", -1).attr("type", o.searchButtonClick === 'submit' ? "submit" : "button").html(o.searchButtonIcon);
                searchButton.appendTo(buttons);
            }

            if (Utils.isValue(o.prepend)) {
                var prepend = $("<div>").html(o.prepend);
                prepend.addClass("prepend").addClass(o.clsPrepend).appendTo(container);
            }

            if (Utils.isValue(o.append)) {
                var append = $("<div>").html(o.append);
                append.addClass("append").addClass(o.clsAppend).appendTo(container);
            }

            if (typeof o.customButtons === "string") {
                o.customButtons = Utils.isObject(o.customButtons);
            }

            if (typeof o.customButtons === "object" && Utils.objectLength(o.customButtons) > 0) {
                $.each(o.customButtons, function(){
                    var item = this;
                    var customButton = $("<button>");

                    customButton
                        .addClass("button input-custom-button")
                        .addClass(o.clsCustomButton)
                        .addClass(item.cls)
                        .attr("tabindex", -1)
                        .attr("type", "button")
                        .html(item.html);

                    if (item.attr && typeof item.attr === 'object') {
                        $.each(item.attr, function(k, v){
                            customButton.attr($.dashedName(k), v);
                        });
                    }

                    customButton.data("action", item.onclick);

                    customButton.appendTo(buttons);
                });
            }

            if (Utils.isValue(element.attr('data-exclaim'))) {
                container.attr('data-exclaim', element.attr('data-exclaim'));
            }

            if (element.attr('dir') === 'rtl' ) {
                container.addClass("rtl").attr("dir", "rtl");
            }

            element[0].className = '';
            if (o.copyInlineStyles === true) {
                for (var i = 0, l = element[0].style.length; i < l; i++) {
                    container.css(element[0].style[i], element.css(element[0].style[i]));
                }
            }

            container.addClass(o.clsComponent);
            element.addClass(o.clsInput);

            if (o.size !== "default") {
                container.css({
                    width: o.size
                });
            }

            if (!Utils.isNull(o.autocomplete) || !Utils.isNull(o.autocompleteUrl)) {
                $("<div>").addClass("autocomplete-list").css({
                    maxHeight: o.autocompleteListHeight,
                    display: "none"
                }).appendTo(container);
            }

            if (Utils.isValue(o.autocomplete)) {
                var autocomplete_obj = Utils.isObject(o.autocomplete);

                if (autocomplete_obj !== false) {
                    this.autocomplete = autocomplete_obj;
                } else {
                    this.autocomplete = o.autocomplete.toArray(o.autocompleteDivider);
                }
            }

            if (Utils.isValue(o.autocompleteUrl)) {
                $.ajax({
                    url: o.autocompleteUrl,
                    method: o.autocompleteUrlMethod
                }).then(function(response){
                    var newData = [];

                    try {
                        newData = JSON.parse(response);
                        if (o.autocompleteUrlKey) {
                            newData = newData[o.autocompleteUrlKey];
                        }
                    } catch (e) {
                        newData = response.split("\n");
                    }

                    that.autocomplete = that.autocomplete.concat(newData);
                });
            }

            if (o.label) {
                var label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(container);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var container = element.closest(".input");
            var autocompleteList = container.find(".autocomplete-list");

            container.on(Metro.events.click, ".input-clear-button", function(){
                var curr = element.val();
                element.val(Utils.isValue(o.defaultValue) ? o.defaultValue : "").fire('clear').fire('change').fire('keyup').focus();
                if (autocompleteList.length > 0) {
                    autocompleteList.css({
                        display: "none"
                    })
                }

                that._fireEvent("clear-click", {
                    prev: curr,
                    val: element.val()
                });

            });

            container.on(Metro.events.click, ".input-reveal-button", function(){
                if (element.attr('type') === 'password') {
                    element.attr('type', 'text');
                } else {
                    element.attr('type', 'password');
                }

                that._fireEvent("reveal-click", {
                    val: element.val()
                });

            });

            container.on(Metro.events.click, ".input-search-button", function(){
                if (o.searchButtonClick !== 'submit') {

                    that._fireEvent("search-button-click", {
                        val: element.val(),
                        button: this
                    });

                } else {
                    this.form.submit();
                }
            });

            // container.on(Metro.events.stop, ".input-reveal-button", function(){
            //     element.attr('type', 'password').focus();
            // });

            container.on(Metro.events.click, ".input-custom-button", function(){
                var button = $(this);
                var action = button.data("action");
                Utils.exec(action, [element.val(), button], this);
            });

            element.on(Metro.events.keyup, function(e){
                var val = element.val().trim();

                if (o.history && e.keyCode === Metro.keyCode.ENTER && val !== "") {
                    element.val("");
                    that.history.push(val);
                    that.historyIndex = that.history.length - 1;

                    that._fireEvent("history-change", {
                        val: val,
                        history: that.history,
                        historyIndex: that.historyIndex
                    })

                    if (o.preventSubmit === true) {
                        e.preventDefault();
                    }
                }

                if (o.history && e.keyCode === Metro.keyCode.UP_ARROW) {
                    that.historyIndex--;
                    if (that.historyIndex >= 0) {
                        element.val("");
                        element.val(that.history[that.historyIndex]);

                        that._fireEvent("history-down", {
                            val: element.val(),
                            history: that.history,
                            historyIndex: that.historyIndex
                        })
                    } else {
                        that.historyIndex = 0;
                    }
                    e.preventDefault();
                }

                if (o.history && e.keyCode === Metro.keyCode.DOWN_ARROW) {
                    that.historyIndex++;
                    if (that.historyIndex < that.history.length) {
                        element.val("");
                        element.val(that.history[that.historyIndex]);

                        that._fireEvent("history-up", {
                            val: element.val(),
                            history: that.history,
                            historyIndex: that.historyIndex
                        })
                    } else {
                        that.historyIndex = that.history.length - 1;
                    }
                    e.preventDefault();
                }
            });

            element.on(Metro.events.keydown, function(e){
                if (e.keyCode === Metro.keyCode.ENTER) {
                    that._fireEvent("enter-click", {
                        val: element.val()
                    });
                }
            });

            element.on(Metro.events.blur, function(){
                container.removeClass("focused");
            });

            element.on(Metro.events.focus, function(){
                container.addClass("focused");
            });

            element.on(Metro.events.input, function(){
                var val = this.value.toLowerCase();
                that._drawAutocompleteList(val);
            });

            container.on(Metro.events.click, ".autocomplete-list .item", function(){
                var val = $(this).attr("data-autocomplete-value");
                element.val(val);
                autocompleteList.css({
                    display: "none"
                });
                element.trigger("change");
                that._fireEvent("autocomplete-select", {
                    value: val
                });
            });
        },

        _drawAutocompleteList: function(val){
            var that = this, element = this.element;
            var container = element.closest(".input");
            var autocompleteList = container.find(".autocomplete-list");
            var items;

            if (autocompleteList.length === 0) {
                return;
            }

            autocompleteList.html("");

            items = this.autocomplete.filter(function(item){
                return item.toLowerCase().indexOf(val) > -1;
            });

            autocompleteList.css({
                display: items.length > 0 ? "block" : "none"
            });

            $.each(items, function(){
                var v = this;
                var index = v.toLowerCase().indexOf(val), content;
                var item = $("<div>").addClass("item").attr("data-autocomplete-value", v);

                if (index === 0) {
                    content = "<strong>"+v.substr(0, val.length)+"</strong>"+v.substr(val.length);
                } else {
                    content = v.substr(0, index) + "<strong>"+v.substr(index, val.length)+"</strong>"+v.substr(index + val.length);
                }

                item.html(content).appendTo(autocompleteList);

                that._fireEvent("draw-autocomplete-item", {
                    item: item
                })
            });
        },

        getHistory: function(){
            return this.history;
        },

        getHistoryIndex: function(){
            return this.historyIndex;
        },

        setHistoryIndex: function(val){
            this.historyIndex = val >= this.history.length ? this.history.length - 1 : val;
        },

        setHistory: function(history, append) {
            var that = this, o = this.options;
            if (Utils.isNull(history)) return;
            if (!Array.isArray(history) && typeof history === 'string') {
                history = history.toArray(o.historyDivider);
            }
            if (append === true) {
                $.each(history, function () {
                    that.history.push(this);
                })
            } else{
                this.history = history;
            }
            this.historyIndex = this.history.length - 1;
        },

        clear: function(){
            this.element.val('');
        },

        toDefault: function(){
            this.element.val(Utils.isValue(this.options.defaultValue) ? this.options.defaultValue : "");
        },

        disable: function(){
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function(){
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggleState: function(){
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        setAutocompleteList: function(l){
            var autocomplete_list = Utils.isObject(l);
            if (autocomplete_list !== false) {
                this.autocomplete = autocomplete_list;
            } else if (typeof l === "string") {
                this.autocomplete = l.toArray(this.options.autocompleteDivider);
            }
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case 'disabled': this.toggleState(); break;
            }
        },

        destroy: function(){
            var element = this.element;
            var parent = element.parent();
            var clearBtn = parent.find(".input-clear-button");
            var revealBtn = parent.find(".input-reveal-button");
            var customBtn = parent.find(".input-custom-button");

            if (clearBtn.length > 0) {
                clearBtn.off(Metro.events.click);
            }
            if (revealBtn.length > 0) {
                revealBtn.off(Metro.events.start);
                revealBtn.off(Metro.events.stop);
            }
            if (customBtn.length > 0) {
                clearBtn.off(Metro.events.click);
            }

            element.off(Metro.events.blur);
            element.off(Metro.events.focus);

            return element;
        }
    });

    $(document).on(Metro.events.click, function(){
        $('.input .autocomplete-list').hide();
    });
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var InfoBoxDefaultConfig = {
        infoboxDeferred: 0,
        type: "",
        width: 480,
        height: "auto",
        overlay: true,
        overlayColor: '#000000',
        overlayAlpha: .5,
        overlayClickClose: false,
        autoHide: 0,
        removeOnClose: false,
        closeButton: true,
        clsBox: "",
        clsBoxContent: "",
        clsOverlay: "",
        onOpen: Metro.noop,
        onClose: Metro.noop,
        onInfoBoxCreate: Metro.noop
    };

    Metro.infoBoxSetup = function (options) {
        InfoBoxDefaultConfig = $.extend({}, InfoBoxDefaultConfig, options);
    };

    if (typeof window["metroInfoBoxSetup"] !== undefined) {
        Metro.infoBoxSetup(window["metroInfoBoxSetup"]);
    }

    Metro.Component('info-box', {
        init: function( options, elem ) {
            this._super(elem, options, InfoBoxDefaultConfig, {
                overlay: null,
                id: Utils.elementId("info-box")
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("info-box-create", {
                element: element
            });
        },

        _overlay: function(){
            var o = this.options;

            var overlay = $("<div>");
            overlay.addClass("overlay").addClass(o.clsOverlay);

            if (o.overlayColor === 'transparent') {
                overlay.addClass("transparent");
            } else {
                overlay.css({
                    background: Metro.colors.toRGBA(o.overlayColor, o.overlayAlpha)
                });
            }

            return overlay;
        },

        _createStructure: function(){
            var element = this.element, o = this.options;
            var closer, content;

            if (o.overlay === true) {
                this.overlay = this._overlay();
            }

            element.addClass("info-box").addClass(o.type).addClass(o.clsBox);

            closer = element.find("closer");
            if (closer.length === 0) {
                closer = $("<span>").addClass("button square closer");
                closer.appendTo(element);
            }

            if (o.closeButton !== true) {
                closer.hide();
            }

            content = element.find(".info-box-content");
            if (content.length > 0) {
                content.addClass(o.clsBoxContent);
            }

            element.css({
                width: o.width,
                height: o.height,
                visibility: "hidden",
                top: '100%',
                left: ( $(window).width() - element.outerWidth() ) / 2
            });

            element.appendTo($('body'));
        },

        _createEvents: function(){
            var that = this, element = this.element;

            element.on(Metro.events.click, ".closer", function(){
                that.close();
            });

            element.on(Metro.events.click, ".js-dialog-close", function(){
                that.close();
            });

            $(window).on(Metro.events.resize, function(){
                that.reposition();
            }, {ns: this.id});
        },

        _setPosition: function(){
            var element = this.element;
            element.css({
                top: ( $(window).height() - element.outerHeight() ) / 2,
                left: ( $(window).width() - element.outerWidth() ) / 2
            });
        },

        reposition: function(){
            this._setPosition();
        },

        setContent: function(c){
            var element = this.element;
            var content = element.find(".info-box-content");
            if (content.length === 0) {
                return ;
            }
            content.html(c);
            this.reposition();
        },

        setType: function(t){
            var element = this.element;
            element.removeClass("success info alert warning").addClass(t);
        },

        open: function(){
            var that = this, element = this.element, o = this.options;

            // if (o.overlay === true) {
            //     this.overlay.appendTo($("body"));
            // }
            if (o.overlay === true && $(".overlay").length === 0) {
                this.overlay.appendTo($("body"));
                if (o.overlayClickClose === true) {
                    this.overlay.on(Metro.events.click, function(){
                        that.close();
                    });
                }
            }

            this._setPosition();

            element.css({
                visibility: "visible"
            });

            this._fireEvent("open");

            element.data("open", true);

            if (parseInt(o.autoHide) > 0) {
                setTimeout(function(){
                    that.close();
                }, parseInt(o.autoHide));
            }
        },

        close: function(){
            var element = this.element, o = this.options;

            if (o.overlay === true) {
                $('body').find('.overlay').remove();
            }

            element.css({
                visibility: "hidden",
                top: "100%"
            });

            this._fireEvent("close");

            element.data("open", false);

            if (o.removeOnClose === true) {
                this.destroy();
                element.remove();
            }
        },

        isOpen: function(){
            return this.element.data("open") === true;
        },

        /* eslint-disable-next-line */
        changeAttribute: function(attributeName){
        },

        destroy: function(){
            var element = this.element;

            element.off("all");
            $(window).off(Metro.events.resize, {ns: this.id});

            return element;
        }
    });

    Metro['infobox'] = {
        isInfoBox: function(el){
            return Utils.isMetroObject(el, "infobox");
        },

        open: function(el, c, t){
            if (!this.isInfoBox(el)) {
                return false;
            }
            var ib = Metro.getPlugin(el, "infobox");
            if (c !== undefined) {
                ib.setContent(c);
            }
            if (t !== undefined) {
                ib.setType(t);
            }
            ib.open();
        },

        close: function(el){
            if (!this.isInfoBox(el)) {
                return false;
            }
            var ib = Metro.getPlugin(el, "infobox");
            ib.close();
        },

        setContent: function(el, c){
            if (!this.isInfoBox(el)) {
                return false;
            }

            if (c === undefined) {
                c = "";
            }

            var ib = Metro.getPlugin(el, "infobox");
            ib.setContent(c);
            ib.reposition();
        },

        setType: function(el, t){
            if (!this.isInfoBox(el)) {
                return false;
            }

            var ib = Metro.getPlugin(el, "infobox");
            ib.setType(t);
            ib.reposition();
        },

        isOpen: function(el){
            if (!this.isInfoBox(el)) {
                return false;
            }
            var ib = Metro.getPlugin(el, "infobox");
            return ib.isOpen();
        },

        create: function(c, t, o, open){
            var $$ = Utils.$();
            var el, ib, box_type;

            box_type = t !== undefined ? t : "";

            el = $$("<div>").appendTo($$("body"));
            $$("<div>").addClass("info-box-content").appendTo(el);

            var ib_options = $$.extend({}, {
                removeOnClose: true,
                type: box_type
            }, (o !== undefined ? o : {}));

            ib_options._runtime = true;

            el.infobox(ib_options);

            ib = Metro.getPlugin(el, 'infobox');
            ib.setContent(c);
            if (open !== false) {
                ib.open();
            }

            return el;
        }
    };
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var FileDefaultConfig = {
        fileDeferred: 0,
        label: "",
        mode: "input",
        buttonTitle: "Choose file(s)",
        filesTitle: "file(s) selected",
        dropTitle: "<strong>Choose a file(s)</strong> or drop it here",
        dropIcon: "<span class='default-icon-upload'></span>",
        prepend: "",
        clsComponent: "",
        clsPrepend: "",
        clsButton: "",
        clsCaption: "",
        clsLabel: "",
        copyInlineStyles: false,
        onSelect: Metro.noop,
        onFileCreate: Metro.noop
    };

    Metro.fileSetup = function (options) {
        FileDefaultConfig = $.extend({}, FileDefaultConfig, options);
    };

    if (typeof window["metroFileSetup"] !== undefined) {
        Metro.fileSetup(window["metroFileSetup"]);
    }

    Metro.Component('file', {
        init: function( options, elem ) {
            this._super(elem, options, FileDefaultConfig);

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("file-create", {
                element: element
            });
        },

        _createStructure: function(){
            var element = this.element, o = this.options;
            var container = $("<label>").addClass((o.mode === "input" ? " file " : o.mode === "button" ? " file-button " : " drop-zone ") + element[0].className).addClass(o.clsComponent);
            var caption = $("<span>").addClass("caption").addClass(o.clsCaption);
            var files = $("<span>").addClass("files").addClass(o.clsCaption);
            var icon, button;


            container.insertBefore(element);
            element.appendTo(container);

            if (o.mode === 'drop' || o.mode === 'dropzone') {
                icon = $(o.dropIcon).addClass("icon").appendTo(container);
                caption.html(o.dropTitle).insertAfter(icon);
                files.html("0" + " " + o.filesTitle).insertAfter(caption);
            } else if (o.mode === 'button') {

                button = $("<span>").addClass("button").attr("tabindex", -1).html(o.buttonTitle);
                button.appendTo(container);
                button.addClass(o.clsButton);

            } else {
                caption.insertBefore(element);

                button = $("<span>").addClass("button").attr("tabindex", -1).html(o.buttonTitle);
                button.appendTo(container);
                button.addClass(o.clsButton);

                if (element.attr('dir') === 'rtl' ) {
                    container.addClass("rtl");
                }

                if (o.prepend !== "") {
                    var prepend = $("<div>").html(o.prepend);
                    prepend.addClass("prepend").addClass(o.clsPrepend).appendTo(container);
                }
            }

            element[0].className = '';

            if (o.copyInlineStyles === true) {
                for (var i = 0, l = element[0].style.length; i < l; i++) {
                    container.css(element[0].style[i], element.css(element[0].style[i]));
                }
            }

            if (o.label) {
                var label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(container);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var container = element.closest("label");
            var caption = container.find(".caption");
            var files = container.find(".files");
            var form = element.closest("form");

            if (form.length) {
                form.on("reset", function(){
                    that.clear();
                })
            }

            container.on(Metro.events.click, "button", function(){
                element[0].click();
            });

            element.on(Metro.events.change, function(){
                var fi = this;
                var file_names = [];
                var entry;

                // if (fi.files.length === 0) {
                //     return ;
                // }

                Array.from(fi.files).forEach(function(file){
                    file_names.push(file.name);
                });

                if (o.mode === "input") {

                    entry = file_names.join(", ");

                    caption.html(entry);
                    caption.attr('title', entry);
                } else {
                    files.html(element[0].files.length + " " +o.filesTitle);
                }

                that._fireEvent("select", {
                    files: fi.files
                });
            });

            element.on(Metro.events.focus, function(){container.addClass("focused");});
            element.on(Metro.events.blur, function(){container.removeClass("focused");});

            if (o.mode !== "input") {
                container.on('drag dragstart dragend dragover dragenter dragleave drop', function(e){
                    e.preventDefault();
                });

                container.on('dragenter dragover', function(){
                    container.addClass("drop-on");
                });

                container.on('dragleave', function(){
                    container.removeClass("drop-on");
                });

                container.on('drop', function(e){
                    element[0].files = e.dataTransfer.files;
                    files.html(element[0].files.length + " " +o.filesTitle);
                    container.removeClass("drop-on");
                    element.trigger("change");
                });
            }
        },

        clear: function(){
            var element = this.element, o = this.options;
            if (o.mode === "input") {
                element.siblings(".caption").html("");
            } else {
                element.siblings(".caption").html(o.dropTitle);
                element.siblings(".files").html("0" + " " + o.filesTitle);
            }

            element.val("");
        },

        disable: function(){
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function(){
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggleState: function(){
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        toggleDir: function(){
            if (this.element.attr("dir") === 'rtl') {
                this.element.parent().addClass("rtl");
            } else {
                this.element.parent().removeClass("rtl");
            }
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case 'disabled': this.toggleState(); break;
                case 'dir': this.toggleDir(); break;
            }
        },

        destroy: function(){
            var element = this.element;
            var parent = element.parent();
            element.off(Metro.events.change);
            parent.off(Metro.events.click, "button");
            return element;
        }
    });
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var DropdownDefaultConfig = {
        dropdownDeferred: 0,
        dropFilter: null,
        toggleElement: null,
        noClose: false,
        duration: 50,
        checkDropUp: false,
        dropUp: false,
        onDrop: Metro.noop,
        onUp: Metro.noop,
        onDropdownCreate: Metro.noop
    };

    Metro.dropdownSetup = function (options) {
        DropdownDefaultConfig = $.extend({}, DropdownDefaultConfig, options);
    };

    if (typeof window["metroDropdownSetup"] !== undefined) {
        Metro.dropdownSetup(window["metroDropdownSetup"]);
    }

    Metro.Component('dropdown', {
        init: function( options, elem ) {
            this._super(elem, options, DropdownDefaultConfig, {
                _toggle: null,
                displayOrigin: null,
                isOpen: false
            });

            return this;
        },

        _create: function(){
            var that = this, element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("dropdown-create", {
                element: element
            });

            if (element.hasClass("open")) {
                element.removeClass("open");
                setTimeout(function(){
                    that.open(true);
                },0);
            }
        },

        _createStructure: function(){
            var element = this.element, o = this.options;
            var toggle;

            if (o.dropUp) {
                element.addClass("drop-up");
            }

            toggle = o.toggleElement !== null ? $(o.toggleElement) : element.siblings('.dropdown-toggle').length > 0 ? element.siblings('.dropdown-toggle') : element.prev();

            this.displayOrigin = Utils.getStyleOne(element, "display");

            if (element.hasClass("v-menu")) {
                element.addClass("for-dropdown");
            }

            element.css("display", "none");

            this._toggle = toggle;
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var toggle = this._toggle, parent = element.parent();

            toggle.on(Metro.events.click, function(e){
                parent.siblings(parent[0].tagName).removeClass("active-container");
                $(".active-container").removeClass("active-container");

                if (element.css('display') !== 'none' && !element.hasClass('keep-open')) {
                    that._close(element);
                } else {
                    $('[data-role*=dropdown]').each(function(i, el){
                        if (!element.parents('[data-role*=dropdown]').is(el) && !$(el).hasClass('keep-open') && $(el).css('display') !== 'none') {
                            if (!Utils.isValue(o.dropFilter)) {
                                that._close(el);
                            } else {
                                if ($(el).closest(o.dropFilter).length > 0) {
                                    that._close(el);
                                }
                            }
                        }
                    });
                    if (element.hasClass('horizontal')) {
                        element.css({
                            'visibility': 'hidden',
                            'display': 'block'
                        });
                        var children_width = 0;
                        $.each(element.children('li'), function(){
                            children_width += $(this).outerWidth(true);
                        });

                        element.css({
                            'visibility': 'visible',
                            'display': 'none'
                        });
                        element.css('width', children_width);
                    }
                    that._open(element);
                    parent.addClass("active-container");
                }
                e.preventDefault();
                e.stopPropagation();
            });

            if (o.noClose === true) {
                element.addClass("keep-open").on(Metro.events.click, function (e) {
                    //e.preventDefault();
                    e.stopPropagation();
                });
            }

            $(element).find('li.disabled a').on(Metro.events.click, function(e){
                e.preventDefault();
            });
        },

        _close: function(el, immediate){
            el = $(el);

            var dropdown  = Metro.getPlugin(el, "dropdown");
            var toggle = dropdown._toggle;
            var options = dropdown.options;
            var func = "slideUp";

            toggle.removeClass('active-toggle').removeClass("active-control");
            dropdown.element.parent().removeClass("active-container");

            if (immediate) {
                func = 'hide'
            }

            el[func](immediate ? 0 : options.duration, function(){
                dropdown._fireEvent("close");
                dropdown._fireEvent("up");

                if (!options.dropUp && options.checkDropUp) {
                    dropdown.element.removeClass("drop-up");
                }
            });

            this.isOpen = false;
        },

        _open: function(el, immediate){
            el = $(el);

            var dropdown  = Metro.getPlugin(el, "dropdown");
            var toggle = dropdown._toggle;
            var options = dropdown.options;
            var func = "slideDown";

            toggle.addClass('active-toggle').addClass("active-control");

            el[func](immediate ? 0 : options.duration, function(){

                if (!options.dropUp && options.checkDropUp) {
                    // dropdown.element.removeClass("drop-up");
                    if (!Utils.inViewport(dropdown.element[0])) {
                        dropdown.element.addClass("drop-up");
                    }
                }

                dropdown._fireEvent("open");
                dropdown._fireEvent("drop");
            });

            // this._fireEvent("drop");

            this.isOpen = true;
        },

        close: function(immediate){
            this._close(this.element, immediate);
        },

        open: function(immediate){
            this._open(this.element, immediate);
        },

        toggle: function(){
            if (this.isOpen)
                this.close();
            else
                this.open();
        },

        /* eslint-disable-next-line */
        changeAttribute: function(){
        },

        destroy: function(){
            this._toggle.off(Metro.events.click);
        }
    });

    $(document).on(Metro.events.click, function(){
        $('[data-role*=dropdown]').each(function(){
            var el = $(this);

            if (el.css('display')!=='none' && !el.hasClass('keep-open') && !el.hasClass('stay-open') && !el.hasClass('ignore-document-click')) {
                Metro.getPlugin(el, 'dropdown').close();
            }
        });
    });
}(Metro, m4q));


/* global Metro, setImmediate */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var DraggableDefaultConfig = {
        dragContext: null,
        draggableDeferred: 0,
        dragElement: 'self',
        dragArea: "parent",
        timeout: 0,
        boundaryRestriction: true,
        onCanDrag: Metro.noop_true,
        onDragStart: Metro.noop,
        onDragStop: Metro.noop,
        onDragMove: Metro.noop,
        onDraggableCreate: Metro.noop
    };

    Metro.draggableSetup = function (options) {
        DraggableDefaultConfig = $.extend({}, DraggableDefaultConfig, options);
    };

    if (typeof window["metroDraggableSetup"] !== undefined) {
        Metro.draggableSetup(window["metroDraggableSetup"]);
    }

    Metro.Component('draggable', {
        init: function( options, elem ) {
            this._super(elem, options, DraggableDefaultConfig, {
                drag: false,
                move: false,
                backup: {
                    cursor: 'default',
                    zIndex: '0'
                },
                dragArea: null,
                dragElement: null,
                id: Utils.elementId("draggable")
            });

            return this;
        },

        _create: function(){
            this._createStructure();
            this._createEvents();

            this._fireEvent("draggable-create", {
                element: this.element
            });
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;
            var offset = element.offset();
            var dragElement  = o.dragElement !== 'self' ? element.find(o.dragElement) : element;

            element.data("canDrag", true);

            this.dragElement = dragElement;

            dragElement[0].ondragstart = function(){return false;};

            element.css("position", "absolute");

            if (o.dragArea === 'document' || o.dragArea === 'window') {
                o.dragArea = "body";
            }

            setImmediate(function(){
                that.dragArea = o.dragArea === 'parent' ? element.parent() : $(o.dragArea);
                if (o.dragArea !== 'parent') {
                    element.appendTo(that.dragArea);
                    element.css({
                        top: offset.top,
                        left: offset.left
                    });
                }
            });

            if (!element.attr("id")) {
                element.attr("id", Utils.elementId("draggable"));
            }
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var position = {
                x: 0,
                y: 0
            };

            this.dragElement.on(Metro.events.startAll, function(e){

                var coord = o.dragArea !== "parent" ? element.offset() : element.position(),
                    shiftX = Utils.pageXY(e).x - coord.left,
                    shiftY = Utils.pageXY(e).y - coord.top;

                var moveElement = function(e){
                    var top = Utils.pageXY(e).y - shiftY;
                    var left = Utils.pageXY(e).x - shiftX;

                    if (o.boundaryRestriction) {
                        if (top < 0) top = 0;
                        if (left < 0) left = 0;

                        if (top > that.dragArea.outerHeight() - element.outerHeight()) top = that.dragArea.outerHeight() - element.outerHeight();
                        if (left > that.dragArea.outerWidth() - element.outerWidth()) left = that.dragArea.outerWidth() - element.outerWidth();
                    }

                    position.y = top;
                    position.x = left;

                    element.css({
                        left: left,
                        top: top
                    });
                };


                if (element.data("canDrag") === false || Utils.exec(o.onCanDrag, [element]) !== true) {
                    return ;
                }

                if (Metro.isTouchable === false && e.which !== 1) {
                    return ;
                }

                that.drag = true;

                that.backup.cursor = element.css("cursor");
                that.backup.zIndex = element.css("z-index");

                element.addClass("draggable");

                moveElement(e);

                that._fireEvent("drag-start", {
                    position: position,
                    context: o.dragContext
                });

                $(document).on(Metro.events.moveAll, function(e){
                    e.preventDefault();
                    moveElement(e);

                    that._fireEvent("drag-move", {
                        position: position,
                        context: o.dragContext
                    });

                }, {ns: that.id, passive: false});

                $(document).on(Metro.events.stopAll, function(){
                    // element.css({
                    //     cursor: that.backup.cursor,
                    //     zIndex: that.backup.zIndex
                    // });
                    element.removeClass("draggable");

                    if (that.drag) {
                        $(document).off(Metro.events.moveAll, {ns: that.id});
                        $(document).off(Metro.events.stopAll, {ns: that.id});
                    }

                    that.drag = false;
                    that.move = false;

                    that._fireEvent("drag-stop", {
                        position: position,
                        context: o.dragContext
                    });

                }, {ns: that.id});
            });
        },

        off: function(){
            this.element.data("canDrag", false);
        },

        on: function(){
            this.element.data("canDrag", true);
        },

        /* eslint-disable-next-line */
        changeAttribute: function(attributeName, newValue){
        },

        destroy: function(){
            var element = this.element;
            this.dragElement.off(Metro.events.startAll);
            return element;
        }
    });
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var DonutDefaultConfig = {
        donutDeferred: 0,
        size: 100,
        radius: 50,
        hole: .8,
        value: 0,
        background: "#ffffff",
        color: "",
        stroke: "#d1d8e7",
        fill: "#49649f",
        fontSize: 24,
        total: 100,
        cap: "%",
        showText: true,
        showValue: false,
        animate: 0,
        onChange: Metro.noop,
        onDonutCreate: Metro.noop
    };

    Metro.donutSetup = function (options) {
        DonutDefaultConfig = $.extend({}, DonutDefaultConfig, options);
    };

    if (typeof window["metroDonutSetup"] !== undefined) {
        Metro.donutSetup(window["metroDonutSetup"]);
    }

    Metro.Component('donut', {
        init: function( options, elem ) {
            this._super(elem, options, DonutDefaultConfig, {
                value: 0,
                animation_change_interval: null
            });

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;
            var html = "";
            var r = o.radius  * (1 - (1 - o.hole) / 2);
            var width = o.radius * (1 - o.hole);
            var transform = 'rotate(-90 ' + o.radius + ',' + o.radius + ')';
            var fontSize = r * o.hole * 0.6;

            element.addClass("donut");

            element.css({
                width: o.size,
                height: o.size,
                background: o.background
            });

            html += "<svg>";
            html += "   <circle class='donut-back' r='"+(r)+"px' cx='"+(o.radius)+"px' cy='"+(o.radius)+"px' transform='"+(transform)+"' fill='none' stroke='"+(o.stroke)+"' stroke-width='"+(width)+"'/>";
            html += "   <circle class='donut-fill' r='"+(r)+"px' cx='"+(o.radius)+"px' cy='"+(o.radius)+"px' transform='"+(transform)+"' fill='none' stroke='"+(o.fill)+"' stroke-width='"+(width)+"'/>";
            if (o.showText === true) html += "   <text   class='donut-title' x='"+(o.radius)+"px' y='"+(o.radius)+"px' dy='"+(fontSize/3)+"px' text-anchor='middle' fill='"+(o.color !== "" ? o.color: o.fill)+"' font-size='"+(fontSize)+"px'>0"+(o.cap)+"</text>";
            html += "</svg>";

            element.html(html);

            this.val(o.value);

            this._fireEvent("donut-create", {
                element: element
            });
        },

        _setValue: function(v){
            var element = this.element, o = this.options;

            var fill = element.find(".donut-fill");
            var title = element.find(".donut-title");
            var r = o.radius  * (1 - (1 - o.hole) / 2);
            var circumference = Math.round(2 * Math.PI * r);
            var title_value = (o.showValue ? v : Utils.percent(o.total, v, true))/*  + (o.cap)*/;
            var fill_value = Math.round(((+v * circumference) / o.total));// + ' ' + circumference;

            var sda = fill.attr("stroke-dasharray");
            if (typeof sda === "undefined") {
                sda = 0;
            } else {
                sda = +sda.split(" ")[0];
            }
            var delta = fill_value - sda;

            fill.animate({
                draw: function(t, p){
                    $(this).attr("stroke-dasharray", (sda + delta * p ) + ' ' + circumference);
                },
                dur: o.animate
            })
            title.animate({
                draw: {
                    innerHTML: title_value
                },
                dur: o.animate,
                onFrame: function(){
                    this.innerHTML += o.cap;
                }
            });
        },

        val: function(v){
            var o = this.options;

            if (v === undefined) {
                return this.value
            }

            if (parseInt(v) < 0 || parseInt(v) > o.total) {
                return false;
            }

            this._setValue(v);

            this.value = v;

            this._fireEvent("change", {
                value: this.value
            });
        },

        changeValue: function(){
            this.val(this.element.attr("data-value"));
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case "data-value": this.changeValue(); break;
            }
        },

        destroy: function(){
            return this.element;
        }
    });
}(Metro, m4q));


/* global Metro, METRO_LOCALE */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var DialogDefaultConfig = {
        dialogDeferred: 0,
        closeButton: false,
        leaveOverlayOnClose: false,
        toTop: false,
        toBottom: false,
        locale: METRO_LOCALE,
        title: "",
        content: "",
        actions: {},
        actionsAlign: "right",
        defaultAction: true,
        overlay: true,
        overlayColor: '#000000',
        overlayAlpha: .5,
        overlayClickClose: false,
        width: '480',
        height: 'auto',
        shadow: true,
        closeAction: true,
        clsDialog: "",
        clsTitle: "",
        clsContent: "",
        clsAction: "",
        clsDefaultAction: "",
        clsOverlay: "",
        autoHide: 0,
        removeOnClose: false,
        show: false,

        _runtime: false,

        onShow: Metro.noop,
        onHide: Metro.noop,
        onOpen: Metro.noop,
        onClose: Metro.noop,
        onDialogCreate: Metro.noop
    };

    Metro.dialogSetup = function (options) {
        DialogDefaultConfig = $.extend({}, DialogDefaultConfig, options);
    };

    if (typeof window["metroDialogSetup"] !== undefined) {
        Metro.dialogSetup(window["metroDialogSetup"]);
    }

    Metro.Component('dialog', {
        _counter: 0,

        init: function( options, elem ) {
            this._super(elem, options, DialogDefaultConfig, {
                interval: null,
                overlay: null,
                id: Utils.elementId("dialog")
            });

            return this;
        },

        _create: function(){
            var o = this.options;
            this.locale = Metro.locales[o.locale] !== undefined ? Metro.locales[o.locale] : Metro.locales["en-US"];
            this._build();
        },

        _build: function(){
            var that = this, element = this.element, o = this.options;
            var body = $("body");
            var overlay;

            element.addClass("dialog");

            if (o.shadow === true) {
                element.addClass("shadow-on");
            }

            if (o.title !== "") {
                this.setTitle(o.title);
            }

            if (o.content !== "") {
                this.setContent(o.content);
            }

            if (o.defaultAction === true || (o.actions !== false && typeof o.actions === 'object' && Utils.objectLength(o.actions) > 0)) {
                var buttons = element.find(".dialog-actions");
                var button;

                if (buttons.length === 0) {
                    buttons = $("<div>").addClass("dialog-actions").addClass("text-"+o.actionsAlign).appendTo(element);
                }

                if (o.defaultAction === true && (Utils.objectLength(o.actions) === 0 && element.find(".dialog-actions > *").length === 0)) {
                    button = $("<button>").addClass("button js-dialog-close").addClass(o.clsDefaultAction).html(this.locale["buttons"]["ok"]);
                    button.appendTo(buttons);
                }

                if (Utils.isObject(o.actions)) $.each(Utils.isObject(o.actions), function(){
                    var item = this;
                    button = $("<button>").addClass("button").addClass(item.cls).html(item.caption);
                    if (item.onclick !== undefined) button.on(Metro.events.click, function(){
                        Utils.exec(item.onclick, [element]);
                    });
                    button.appendTo(buttons);
                });
            }

            if (o.overlay === true) {
                overlay  = this._overlay();
                this.overlay = overlay;
            }

            if (o.closeAction === true) {
                element.on(Metro.events.click, ".js-dialog-close", function(){
                    that.close();
                });
            }

            var closer = element.find("closer");
            if (closer.length === 0) {
                closer = $("<span>").addClass("button square closer js-dialog-close");
                closer.appendTo(element);
            }
            if (o.closeButton !== true) {
                closer.hide();
            }

            element.css({
                width: o.width,
                height: o.height,
                visibility: "hidden",
                top: '100%',
                left: ( $(window).width() - element.outerWidth() ) / 2
            });

            element.addClass(o.clsDialog);
            element.find(".dialog-title").addClass(o.clsTitle);
            element.find(".dialog-content").addClass(o.clsContent);
            element.find(".dialog-actions").addClass(o.clsAction);

            element.appendTo(body);

            if (o.show) {
                this.open();
            }

            $(window).on(Metro.events.resize, function(){
                that.setPosition();
            }, {ns: this.id});

            this._fireEvent("dialog-create", {
                element: element
            });
        },

        _overlay: function(){
            var o = this.options;

            var overlay = $("<div>");
            overlay.addClass("overlay").addClass(o.clsOverlay);

            if (o.overlayColor === 'transparent') {
                overlay.addClass("transparent");
            } else {
                overlay.css({
                    background: Metro.colors.toRGBA(o.overlayColor, o.overlayAlpha)
                });
            }

            return overlay;
        },

        hide: function(callback){
            var element = this.element, o = this.options;
            var timeout = 0;
            if (o.onHide !== Metro.noop) {
                timeout = 500;

                this._fireEvent("hide");
            }
            setTimeout(function(){
                Utils.exec(callback, null, element[0]);
                element.css({
                    visibility: "hidden",
                    top: "100%"
                });
            }, timeout);
        },

        show: function(callback){
            var element = this.element;
            this.setPosition();
            element.css({
                visibility: "visible"
            });

            this._fireEvent("show");

            Utils.exec(callback, null, element[0]);
        },

        setPosition: function(){
            var element = this.element, o = this.options;
            var top, bottom;
            if (o.toTop !== true && o.toBottom !== true) {
                top = ( $(window).height() - element.outerHeight() ) / 2;
                if (top < 0) {
                    top = 0;
                }
                bottom = "auto";
            } else {
                if (o.toTop === true) {
                    top = 0;
                    bottom = "auto";
                }
                if (o.toTop !== true && o.toBottom === true) {
                    bottom = 0;
                    top = "auto";
                }
            }
            element.css({
                top: top,
                bottom: bottom,
                left: ( $(window).width() - element.outerWidth() ) / 2
            });
        },

        setContent: function(c){
            var element = this.element;
            var content = element.find(".dialog-content");
            if (content.length === 0) {
                content = $("<div>").addClass("dialog-content");
                content.appendTo(element);
            }

            if (!Utils.isQ(c) && Utils.isFunc(c)) {
                c = Utils.exec(c);
            }

            if (Utils.isQ(c)) {
                c.appendTo(content);
            } else {
                content.html(c);
            }
        },

        setTitle: function(t){
            var element = this.element;
            var title = element.find(".dialog-title");
            if (title.length === 0) {
                title = $("<div>").addClass("dialog-title");
                title.appendTo(element);
            }
            title.html(t);
        },

        close: function(){
            var that = this, element = this.element, o = this.options;

            if (!Utils.bool(o.leaveOverlayOnClose)) {
                $('body').find('.overlay').remove();
            }

            this.hide(function(){
                element.data("open", false);

                that._fireEvent("close")

                if (o.removeOnClose === true) {
                    element.remove();
                }
            });
        },

        open: function(){
            var that = this, element = this.element, o = this.options;

            if (o.overlay === true && $(".overlay").length === 0) {
                this.overlay.appendTo($("body"));
                if (o.overlayClickClose === true) {
                    this.overlay.on(Metro.events.click, function(){
                        that.close();
                    });
                }
            }

            this.show(function(){

                that._fireEvent("open");

                element.data("open", true);
                if (parseInt(o.autoHide) > 0) {
                    setTimeout(function(){
                        that.close();
                    }, parseInt(o.autoHide));
                }
            });
        },

        toggle: function(){
            var element = this.element;
            if (element.data('open')) {
                this.close();
            } else {
                this.open();
            }
        },

        isOpen: function(){
            return this.element.data('open') === true;
        },

        /* eslint-disable-next-line */
        changeAttribute: function(attributeName){
        },

        destroy: function(){
            var element = this.element;

            element.off(Metro.events.click, ".js-dialog-close");
            element.find(".button").off(Metro.events.click);
            $(window).off(Metro.events.resize,{ns: this.id});

            return element;
        }
    });

    Metro.dialog = {
        isDialog: function(el){
            return Utils.isMetroObject(el, "dialog");
        },

        open: function(el, content, title){
            if (!this.isDialog(el)) {
                return false;
            }
            var dialog = Metro.getPlugin(el, "dialog");
            if (title !== undefined) {
                dialog.setTitle(title);
            }
            if (content !== undefined) {
                dialog.setContent(content);
            }
            dialog.open();
        },

        close: function(el){
            if (!this.isDialog(el)) {
                return false;
            }
            Metro.getPlugin($(el)[0], "dialog").close();
        },

        toggle: function(el){
            if (!this.isDialog(el)) {
                return false;
            }
            Metro.getPlugin($(el)[0], "dialog").toggle();
        },

        isOpen: function(el){
            if (!this.isDialog(el)) {
                return false;
            }
            Metro.getPlugin($(el)[0], "dialog").isOpen();
        },

        remove: function(el){
            if (!this.isDialog(el)) {
                return false;
            }
            var dialog = Metro.getPlugin($(el)[0], "dialog");
            dialog.options.removeOnClose = true;
            dialog.close();
        },

        create: function(options){
            var dlg;

            dlg = $("<div>").appendTo($("body"));

            var dlg_options = $.extend({}, {
                show: true,
                closeAction: true,
                removeOnClose: true
            }, (options !== undefined ? options : {}));

            dlg_options._runtime = true;

            return Metro.makePlugin(dlg, "dialog", dlg_options);
        }
    };
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var Types = {
        HEX: "hex",
        HEXA: "hexa",
        RGB: "rgb",
        RGBA: "rgba",
        HSV: "hsv",
        HSL: "hsl",
        HSLA: "hsla",
        CMYK: "cmyk",
        UNKNOWN: "unknown"
    };

    Metro.colorsSetup = function (options) {
        ColorsDefaultConfig = $.extend({}, ColorsDefaultConfig, options);
    };

    if (typeof window["metroColorsSetup"] !== undefined) {
        Metro.colorsSetup(window["metroColorsSetup"]);
    }

    var ColorsDefaultConfig = {
        angle: 30,
        resultType: 'hex',
        results: 6,
        baseLight: "#ffffff",
        baseDark: "self"
    };

    // function HEX(r, g, b) {
    //     this.r = r || "00";
    //     this.g = g || "00";
    //     this.b = b || "00";
    // }
    //
    // HEX.prototype.toString = function(){
    //     return "#" + [this.r, this.g, this.b].join("");
    // }

    // function dec2hex(d){
    //     return Math.round(parseFloat(d) * 255).toString(16);
    // }
    //
    // function hex2dec(h){
    //     return (parseInt(h, 16) / 255);
    // }

    function shift(h, angle){
        h += angle;
        while (h >= 360.0) h -= 360.0;
        while (h < 0.0) h += 360.0;
        return h;
    }

    function clamp(val){
        return Math.min(1, Math.max(0, val));
    }

    function RGB(r, g, b){
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
    }

    RGB.prototype.toString = function(){
        return "rgb(" + [this.r, this.g, this.b].join(", ") + ")";
    }

    function RGBA(r, g, b, a){
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a === 0 ? 0 : a || 1;
    }

    RGBA.prototype.toString = function(){
        return "rgba(" + [this.r, this.g, this.b, parseFloat(this.a).toFixed(2)].join(", ") + ")";
    }

    function HSV(h, s, v){
        this.h = h || 0;
        this.s = s || 0;
        this.v = v || 0;
    }

    HSV.prototype.toString2 = function(){
        return "hsv(" + [this.h, this.s, this.v].join(", ") + ")";
    }

    HSV.prototype.toString = function(){
        return "hsv(" + [Math.round(this.h), Math.round(this.s*100)+"%", Math.round(this.v*100)+"%"].join(", ") + ")";
    }

    function HSL(h, s, l){
        this.h = h || 0;
        this.s = s || 0;
        this.l = l || 0;
    }

    HSL.prototype.toString2 = function(){
        return "hsl(" + [this.h, this.s, this.l].join(", ") + ")";
    }

    HSL.prototype.toString = function(){
        return "hsl(" + [Math.round(this.h), Math.round(this.s*100)+"%", Math.round(this.l*100)+"%"].join(", ") + ")";
    }

    function HSLA(h, s, l, a){
        this.h = h || 0;
        this.s = s || 0;
        this.l = l || 0;
        this.a = a === 0 ? 0 : a || 1;
    }

    HSLA.prototype.toString2 = function(){
        return "hsla(" + [this.h, this.s, this.l, this.a].join(", ") + ")";
    }

    HSLA.prototype.toString = function(){
        return "hsla(" + [Math.round(this.h), Math.round(this.s*100)+"%", Math.round(this.l*100)+"%", parseFloat(this.a).toFixed(2)].join(", ") + ")";
    }

    function CMYK(c, m, y, k){
        this.c = c || 0;
        this.m = m || 0;
        this.y = y || 0;
        this.k = k || 0;
    }

    CMYK.prototype.toString = function(){
        return "cmyk(" + [this.c, this.m, this.y, this.k].join(", ") + ")";
    }

    var Colors = {

        PALETTES: {
            ALL: "all",
            METRO: "metro",
            STANDARD: "standard"
        },

        metro: {
            lime: '#a4c400',
            green: '#60a917',
            emerald: '#008a00',
            blue: '#00AFF0',
            teal: '#00aba9',
            cyan: '#1ba1e2',
            cobalt: '#0050ef',
            indigo: '#6a00ff',
            violet: '#aa00ff',
            pink: '#dc4fad',
            magenta: '#d80073',
            crimson: '#a20025',
            red: '#CE352C',
            orange: '#fa6800',
            amber: '#f0a30a',
            yellow: '#fff000',
            brown: '#825a2c',
            olive: '#6d8764',
            steel: '#647687',
            mauve: '#76608a',
            taupe: '#87794e'
        },

        standard: {
            aliceblue: "#f0f8ff",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedalmond: "#ffebcd",
            blue: "#0000ff",
            blueviolet: "#8a2be2",
            brown: "#a52a2a",
            burlywood: "#deb887",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerblue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkgray: "#a9a9a9",
            darkgreen: "#006400",
            darkkhaki: "#bdb76b",
            darkmagenta: "#8b008b",
            darkolivegreen: "#556b2f",
            darkorange: "#ff8c00",
            darkorchid: "#9932cc",
            darkred: "#8b0000",
            darksalmon: "#e9967a",
            darkseagreen: "#8fbc8f",
            darkslateblue: "#483d8b",
            darkslategray: "#2f4f4f",
            darkturquoise: "#00ced1",
            darkviolet: "#9400d3",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            dimgray: "#696969",
            dodgerblue: "#1e90ff",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            forestgreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#DCDCDC",
            ghostwhite: "#F8F8FF",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gray: "#808080",
            green: "#008000",
            greenyellow: "#adff2f",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            indianred: "#cd5c5c",
            indigo: "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderblush: "#fff0f5",
            lawngreen: "#7cfc00",
            lemonchiffon: "#fffacd",
            lightblue: "#add8e6",
            lightcoral: "#f08080",
            lightcyan: "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgray: "#d3d3d3",
            lightgreen: "#90ee90",
            lightpink: "#ffb6c1",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            lightskyblue: "#87cefa",
            lightslategray: "#778899",
            lightsteelblue: "#b0c4de",
            lightyellow: "#ffffe0",
            lime: "#00ff00",
            limegreen: "#32dc32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumaquamarine: "#66cdaa",
            mediumblue: "#0000cd",
            mediumorchid: "#ba55d3",
            mediumpurple: "#9370db",
            mediumseagreen: "#3cb371",
            mediumslateblue: "#7b68ee",
            mediumspringgreen: "#00fa9a",
            mediumturquoise: "#48d1cc",
            mediumvioletred: "#c71585",
            midnightblue: "#191970",
            mintcream: "#f5fffa",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajowhite: "#ffdead",
            navy: "#000080",
            oldlace: "#fdd5e6",
            olive: "#808000",
            olivedrab: "#6b8e23",
            orange: "#ffa500",
            orangered: "#ff4500",
            orchid: "#da70d6",
            palegoldenrod: "#eee8aa",
            palegreen: "#98fb98",
            paleturquoise: "#afeeee",
            palevioletred: "#db7093",
            papayawhip: "#ffefd5",
            peachpuff: "#ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderblue: "#b0e0e6",
            purple: "#800080",
            rebeccapurple: "#663399",
            red: "#ff0000",
            rosybrown: "#bc8f8f",
            royalblue: "#4169e1",
            saddlebrown: "#8b4513",
            salmon: "#fa8072",
            sandybrown: "#f4a460",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            slyblue: "#87ceeb",
            slateblue: "#6a5acd",
            slategray: "#708090",
            snow: "#fffafa",
            springgreen: "#00ff7f",
            steelblue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            wheat: "#f5deb3",
            white: "#ffffff",
            whitesmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowgreen: "#9acd32"
        },

        all: {},

        init: function(){
            this.all = $.extend( {}, this.standard, this.metro );
            return this;
        },

        color: function(name, palette){
            palette = palette || this.PALETTES.ALL;
            return this[palette][name] !== undefined ? this[palette][name] : false;
        },

        palette: function(palette){
            palette = palette || this.PALETTES.ALL;
            return Object.keys(this[palette]);
        },

        expandHexColor: function(hex){
            if (typeof hex !== "string") {
                throw new Error("Value is not a string!");
            }
            if (hex[0] === "#" && hex.length === 4) {
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                return (
                    "#" +
                    hex.replace(shorthandRegex, function(m, r, g, b) {
                        return r + r + g + g + b + b;
                    })
                );
            }
            return hex[0] === "#" ? hex : "#" + hex;
        },

        colors: function(palette){
            palette = palette || this.PALETTES.ALL;
            return Object.values(this[palette]);
        },

        random: function(colorType, alpha){
            colorType = colorType || Types.HEX;
            alpha = typeof alpha !== "undefined" ? alpha : 1;

            var hex, r, g, b;

            r = $.random(0, 255);
            g = $.random(0, 255);
            b = $.random(0, 255);

            hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

            return colorType === "hex" ? hex : this.toColor(hex, colorType, alpha);
        },

        parse: function(color){
            var _color = color.toLowerCase().trim();

            var a = _color
                .replace(/[^%\d.,]/g, "")
                .split(",")
                .map(function(v) {
                    if (v.indexOf('%') > -1) {
                        v = ""+parseInt(v)/100;
                    }
                    return v.indexOf(".") > -1 ? parseFloat(v) : parseInt(v);
                });

            if (this.metro[_color]) {
                return this.expandHexColor(this.metro[_color]);
            }

            if (this.standard[_color]) {
                return this.expandHexColor(this.standard[_color]);
            }

            if (_color[0] === "#") {
                return this.expandHexColor(_color);
            }

            if (_color.indexOf("rgba") === 0 && a.length === 4) {
                return new RGBA(a[0], a[1], a[2], a[3]);
            }
            if (_color.indexOf("rgb") === 0 && a.length === 3) {
                return new RGB(a[0], a[1], a[2]);
            }
            if (_color.indexOf("cmyk") === 0 && a.length === 4) {
                return new CMYK(a[0], a[1], a[2], a[3]);
            }
            if (_color.indexOf("hsv") === 0 && a.length === 3) {
                return new HSV(a[0], a[1], a[2]);
            }
            if (_color.indexOf("hsla") === 0 && a.length === 4) {
                return new HSLA(a[0], a[1], a[2], a[3]);
            }
            if (_color.indexOf("hsl")  === 0 && a.length === 3) {
                return new HSL(a[0], a[1], a[2]);
            }
            return undefined;
        },

        createColor: function(colorType, from){
            colorType = colorType || "hex";
            from = from || "#000000";

            var baseColor;

            if (typeof from === "string") {
                baseColor = this.parse(from);
            }

            if (!this.isColor(baseColor)) {
                baseColor = "#000000";
            }

            return this.toColor(baseColor, colorType.toLowerCase());
        },

        isDark: function(color){
            if (!this.isColor(color)) return;
            var rgb = this.toRGB(color);
            var YIQ = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
            return YIQ < 128;
        },

        isLight: function(color){
            return !this.isDark(color);
        },

        isHSV: function(color){
            return color instanceof HSV;
        },

        isHSL: function(color){
            return color instanceof HSL;
        },

        isHSLA: function(color){
            return color instanceof HSLA;
        },

        isRGB: function(color){
            return color instanceof RGB;
        },

        isRGBA: function(color){
            return color instanceof RGBA;
        },

        isCMYK: function(color){
            return color instanceof CMYK;
        },

        isHEX: function(color){
            return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
        },

        isColor: function(val){
            var color = typeof val === "string" ? this.parse(val) : val;

            return !color
                ? false
                : this.isHEX(color) ||
                  this.isRGB(color) ||
                  this.isRGBA(color) ||
                  this.isHSV(color) ||
                  this.isHSL(color) ||
                  this.isHSLA(color) ||
                  this.isCMYK(color);
        },

        check: function(color, type){
            var that = this, checkFor = typeof type === "string" ? [type] : type;
            var result = false;

            $.each(checkFor, function(){
                if (that["is"+this.toUpperCase()](color)) {
                    result = true;
                }
            });

            if (!result) {
                throw new Error("Value is not a " + type + " color type!");
            }
        },

        colorType: function(color){
            if (this.isHEX(color)) return Types.HEX;
            if (this.isRGB(color)) return Types.RGB;
            if (this.isRGBA(color)) return Types.RGBA;
            if (this.isHSV(color)) return Types.HSV;
            if (this.isHSL(color)) return Types.HSL;
            if (this.isHSLA(color)) return Types.HSLA;
            if (this.isCMYK(color)) return Types.CMYK;

            return Types.UNKNOWN;
        },

        equal: function(color1, color2){
            if (!this.isColor(color1) || !this.isColor(color2)) {
                return false;
            }

            return this.toHEX(color1) === this.toHEX(color2);
        },

        colorToString: function(color){
            return color.toString();
        },

        hex2rgb: function(color){
            if (typeof color !== "string") {
                throw new Error("Value is not a string!")
            }
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
                this.expandHexColor(color)
            );
            var rgb = [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ];
            return result ? new RGB(rgb[0], rgb[1], rgb[2]) : null;
        },

        rgb2hex: function(color){
            this.check(color, "rgb");
            return (
                "#" +
                ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1)
            );
        },

        rgb2hsv: function(color){
            this.check(color, "rgb");
            var hsv = new HSV();
            var h, s, v;
            var r = color.r / 255,
                g = color.g / 255,
                b = color.b / 255;

            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);
            var delta = max - min;

            v = max;

            if (max === 0) {
                s = 0;
            } else {
                s = 1 - min / max;
            }

            if (max === min) {
                h = 0;
            } else if (max === r && g >= b) {
                h = 60 * ((g - b) / delta);
            } else if (max === r && g < b) {
                h = 60 * ((g - b) / delta) + 360;
            } else if (max === g) {
                h = 60 * ((b - r) / delta) + 120;
            } else if (max === b) {
                h = 60 * ((r - g) / delta) + 240;
            } else {
                h = 0;
            }

            hsv.h = h;
            hsv.s = s;
            hsv.v = v;

            return hsv;
        },

        hsv2rgb: function(color){
            this.check(color, "hsv");
            var r, g, b;
            var h = color.h,
                s = color.s * 100,
                v = color.v * 100;
            var Hi = Math.floor(h / 60);
            var Vmin = ((100 - s) * v) / 100;
            var alpha = (v - Vmin) * ((h % 60) / 60);
            var Vinc = Vmin + alpha;
            var Vdec = v - alpha;

            switch (Hi) {
                case 0:
                    r = v;
                    g = Vinc;
                    b = Vmin;
                    break;
                case 1:
                    r = Vdec;
                    g = v;
                    b = Vmin;
                    break;
                case 2:
                    r = Vmin;
                    g = v;
                    b = Vinc;
                    break;
                case 3:
                    r = Vmin;
                    g = Vdec;
                    b = v;
                    break;
                case 4:
                    r = Vinc;
                    g = Vmin;
                    b = v;
                    break;
                case 5:
                    r = v;
                    g = Vmin;
                    b = Vdec;
                    break;
            }

            return new RGB(
                Math.round((r * 255) / 100),
                Math.round((g * 255) / 100),
                Math.round((b * 255) / 100)
            );
        },

        hsv2hex: function(color){
            this.check(color, "hsv");
            return this.rgb2hex(this.hsv2rgb(color));
        },

        hex2hsv: function(color){
            this.check(color, "hex");
            return this.rgb2hsv(this.hex2rgb(color));
        },

        rgb2cmyk: function(color){
            this.check(color, "rgb");
            var cmyk = new CMYK();

            var r = color.r / 255;
            var g = color.g / 255;
            var b = color.b / 255;

            cmyk.k = Math.min(1 - r, 1 - g, 1 - b);

            cmyk.c = 1 - cmyk.k === 0 ? 0 : (1 - r - cmyk.k) / (1 - cmyk.k);
            cmyk.m = 1 - cmyk.k === 0 ? 0 : (1 - g - cmyk.k) / (1 - cmyk.k);
            cmyk.y = 1 - cmyk.k === 0 ? 0 : (1 - b - cmyk.k) / (1 - cmyk.k);

            cmyk.c = Math.round(cmyk.c * 100);
            cmyk.m = Math.round(cmyk.m * 100);
            cmyk.y = Math.round(cmyk.y * 100);
            cmyk.k = Math.round(cmyk.k * 100);

            return cmyk;
        },

        cmyk2rgb: function(color){
            this.check(color, "cmyk");
            var r = Math.floor(255 * (1 - color.c / 100) * (1 - color.k / 100));
            var g = Math.ceil(255 * (1 - color.m / 100) * (1 - color.k / 100));
            var b = Math.ceil(255 * (1 - color.y / 100) * (1 - color.k / 100));

            return new RGB(r, g, b);
        },

        hsv2hsl: function(color){
            this.check(color, "hsv");
            var h, s, l, d;
            h = color.h;
            l = (2 - color.s) * color.v;
            s = color.s * color.v;
            if (l === 0) {
                s = 0;
            } else {
                d = l <= 1 ? l : 2 - l;
                if (d === 0) {
                    s = 0;
                } else {
                    s /= d;
                }
            }
            l /= 2;
            return new HSL(h, s, l);
        },

        hsl2hsv: function(color){
            this.check(color, ["hsl", "hsla"]);
            var h, s, v, l;
            h = color.h;
            l = color.l * 2;
            s = color.s * (l <= 1 ? l : 2 - l);

            v = (l + s) / 2;

            if (l + s === 0) {
                s = 0;
            } else {
                s = (2 * s) / (l + s);
            }

            return new HSV(h, s, v);
        },

        rgb2websafe: function(color){
            this.check(color, "rgb");
            return new RGB(
                Math.round(color.r / 51) * 51,
                Math.round(color.g / 51) * 51,
                Math.round(color.b / 51) * 51
            );
        },

        rgba2websafe: function(color){
            this.check(color, "rgba");
            var rgbWebSafe = this.rgb2websafe(color);
            return new RGBA(rgbWebSafe.r, rgbWebSafe.g, rgbWebSafe.b, color.a);
        },

        hex2websafe: function(color){
            this.check(color, "hex");
            return this.rgb2hex(this.rgb2websafe(this.hex2rgb(color)));
        },

        hsv2websafe: function(color){
            this.check(color, "hsv");
            return this.rgb2hsv(this.rgb2websafe(this.toRGB(color)));
        },

        hsl2websafe: function(color){
           this.check(color, "hsl");
            return this.hsv2hsl(this.rgb2hsv(this.rgb2websafe(this.toRGB(color))));
        },

        cmyk2websafe: function(color){
            this.check(color, "cmyk");
            return this.rgb2cmyk(this.rgb2websafe(this.cmyk2rgb(color)));
        },

        websafe: function(color){
            if (this.isHEX(color)) return this.hex2websafe(color);
            if (this.isRGB(color)) return this.rgb2websafe(color);
            if (this.isRGBA(color)) return this.rgba2websafe(color);
            if (this.isHSV(color)) return this.hsv2websafe(color);
            if (this.isHSL(color)) return this.hsl2websafe(color);
            if (this.isCMYK(color)) return this.cmyk2websafe(color);

            return color;
        },

        toColor: function(color, type, alpha){
            var result;
            switch (type.toLowerCase()) {
                case "hex":
                    result = this.toHEX(color);
                    break;
                case "rgb":
                    result = this.toRGB(color);
                    break;
                case "rgba":
                    result = this.toRGBA(color, alpha);
                    break;
                case "hsl":
                    result = this.toHSL(color);
                    break;
                case "hsla":
                    result = this.toHSLA(color, alpha);
                    break;
                case "hsv":
                    result = this.toHSV(color);
                    break;
                case "cmyk":
                    result = this.toCMYK(color);
                    break;
                default:
                    result = color;
            }
            return result;
        },

        toHEX: function(val){
            var color = typeof val === "string" ? this.parse(val) : val;

            if (!color) {
                throw new Error("Unknown color format!");
            }

            return typeof color === "string"
                ? color
                : this.rgb2hex(this.toRGB(color));
        },

        toRGB: function(val){
            var color = typeof val === "string" ? this.parse(val) : val;

            if (this.isRGB(color)) return color;
            if (this.isRGBA(color)) return new RGB(color.r, color.g, color.b);
            if (this.isHSV(color)) return this.hsv2rgb(color);
            if (this.isHSL(color)) return this.hsv2rgb(this.hsl2hsv(color));
            if (this.isHSLA(color)) return this.hsv2rgb(this.hsl2hsv(color));
            if (this.isHEX(color)) return this.hex2rgb(color);
            if (this.isCMYK(color)) return this.cmyk2rgb(color);

            throw new Error("Unknown color format!");
        },

        toRGBA: function(color, alpha){
            if (this.isRGBA(color)) {
                if (alpha) {
                    color.a = alpha;
                }
                return color;
            }
            var rgb = this.toRGB(color);
            return new RGBA(rgb.r, rgb.g, rgb.b, alpha);
        },

        toHSV: function(color){
            return this.rgb2hsv(this.toRGB(color));
        },

        toHSL: function(color){
            return this.hsv2hsl(this.rgb2hsv(this.toRGB(color)));
        },

        toHSLA: function(color, alpha){
            if (this.isHSLA(color)) {
                if (alpha) {
                    color.a = alpha;
                }
                return color;
            }
            var hsla = this.hsv2hsl(this.rgb2hsv(this.toRGB(color)));
            hsla.a = alpha;
            return new HSLA(hsla.h, hsla.s, hsla.l, hsla.a);
        },

        toCMYK: function(color){
            return this.rgb2cmyk(this.toRGB(color));
        },

        grayscale: function(color){
            return this.desaturate(color, 100);
        },

        lighten: function(color, amount){
            var hsl, type, alpha;

            if (!this.isColor(color)) {
                throw new Error(color + " is not a valid color value!");
            }

            amount = (amount === 0) ? 0 : (amount || 10);
            hsl = this.toHSL(color);
            hsl.l += amount / 100;
            hsl.l = clamp(hsl.l);

            type = this.colorType(color).toLowerCase();

            if (type === Types.RGBA || type === Types.HSLA) {
                alpha = color.a;
            }

            return this.toColor(hsl, type, alpha);
        },

        darken: function(color, amount){
            return this.lighten(color, -amount);
        },

        spin: function(color, amount){
            var hsl, type, alpha, hue;

            if (!this.isColor(color)) {
                throw new Error(color + " is not a valid color value!");
            }

            hsl = this.toHSL(color);
            hue = (hsl.h + amount) % 360;
            hsl.h = hue < 0 ? 360 + hue : hue;

            type = this.colorType(color).toLowerCase();

            if (type === Types.RGBA || type === Types.HSLA) {
                alpha = color.a;
            }

            return this.toColor(hsl, type, alpha);
        },

        brighten: function(color, amount){
            var rgb, type, alpha;

            if (!this.isColor(color)) {
                throw new Error(color + " is not a valid color value!");
            }

            rgb = this.toRGB(color);
            rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * - (amount / 100))));
            rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * - (amount / 100))));
            rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * - (amount / 100))));

            type = this.colorType(color).toLowerCase();

            if (type === Types.RGBA || type === Types.HSLA) {
                alpha = color.a;
            }

            return this.toColor(rgb, type, alpha);
        },

        saturate: function(color, amount){
            var hsl, type, alpha;

            if (!this.isColor(color)) {
                throw new Error(color + " is not a valid color value!");
            }

            hsl = this.toHSL(color);
            hsl.s += amount / 100;
            hsl.s = clamp(hsl.s);

            type = this.colorType(color).toLowerCase();

            if (type === Types.RGBA || type === Types.HSLA) {
                alpha = color.a;
            }

            return this.toColor(hsl, type, alpha);
        },

        desaturate: function(color, amount){
            var hsl, type, alpha;

            if (!this.isColor(color)) {
                throw new Error(color + " is not a valid color value!");
            }

            hsl = this.toHSL(color);
            hsl.s -= amount / 100;
            hsl.s = clamp(hsl.s);

            type = this.colorType(color).toLowerCase();

            if (type === Types.RGBA || type === Types.HSLA) {
                alpha = color.a;
            }

            return this.toColor(hsl, type, alpha);
        },

        hueShift: function(color, hue, saturation, value){
            var hsv = this.toHSV(color);
            var type = this.colorType(color).toLowerCase();
            var h = hsv.h;
            var alpha;
            var _h = hue || 0;
            var _s = saturation || 0;
            var _v = value || 0;

            h += _h;
            while (h >= 360.0) h -= 360.0;
            while (h < 0.0) h += 360.0;
            hsv.h = h;

            hsv.s += _s;
            if (hsv.s > 1) {hsv.s = 1;}
            if (hsv.s < 0) {hsv.s = 0;}

            hsv.v += _v;
            if (hsv.v > 1) {hsv.v = 1;}
            if (hsv.v < 0) {hsv.v = 0;}

            if (type === Types.RGBA || type === Types.HSLA) {
                alpha = color.a;
            }

            return this.toColor(hsv, type, alpha);
        },

        shade: function(color, amount){
            if (!this.isColor(color)) {
                throw new Error(color + " is not a valid color value!");
            }

            amount /= 100;

            var type = this.colorType(color).toLowerCase();
            var rgb = this.toRGB(color);
            var t = amount < 0 ? 0 : 255;
            var p = amount < 0 ? amount * -1 : amount;
            var r, g, b, a;

            r = (Math.round((t - rgb.r) * p) + rgb.r);
            g = (Math.round((t - rgb.g) * p) + rgb.g);
            b = (Math.round((t - rgb.b) * p) + rgb.b);

            if (type === Types.RGBA || type === Types.HSLA) {
                a = color.a;
            }

            return this.toColor(new RGB(r, g, b), type, a);
        },

        mix: function(color1, color2, amount){

            amount = (amount === 0) ? 0 : (amount || 50);

            var rgb = new RGB(0,0,0);
            var rgb1 = this.toRGB(color1);
            var rgb2 = this.toRGB(color2);

            var p = amount / 100;

            rgb.r = Math.round(((rgb2.r - rgb1.r) * p) + rgb1.r);
            rgb.g = Math.round(((rgb2.g - rgb1.g) * p) + rgb1.g);
            rgb.b = Math.round(((rgb2.b - rgb1.b) * p) + rgb1.b);

            return this.toHEX(rgb);
        },

        multiply: function(color1, color2){
            var rgb1 = this.toRGB(color1);
            var rgb2 = this.toRGB(color2);
            var rgb = new RGB();

            rgb1.b = Math.floor(rgb1.b * rgb2.b / 255);
            rgb1.g = Math.floor(rgb1.g * rgb2.g / 255);
            rgb1.r = Math.floor(rgb1.r * rgb2.r / 255);

            return this.toHEX(rgb);
        },

        materialPalette: function(color, options){
            var opt = $.extend({}, ColorsDefaultConfig, options);
            var baseLight = opt.baseLight;
            var baseDark = opt.baseDark === "self" || !opt.baseDark ? this.multiply(color, color) : opt.baseDark;

            return {
                "50": this.mix(baseLight, color, 10),
                "100": this.mix(baseLight, color, 30),
                "200": this.mix(baseLight, color, 50),
                "300": this.mix(baseLight, color, 70),
                "400": this.mix(baseLight, color, 85),
                "500": this.mix(baseLight, color, 100),
                "600": this.mix(baseDark, color, 92),
                "700": this.mix(baseDark, color, 83),
                "800": this.mix(baseDark, color, 74),
                "900": this.mix(baseDark, color, 65),

                "A100": this.lighten(this.saturate(this.mix(baseDark, color, 15), 80), 65),
                "A200": this.lighten(this.saturate(this.mix(baseDark, color, 15), 80), 55),
                "A400": this.lighten(this.saturate(this.mix(baseLight, color, 100), 55), 10),
                "A700": this.lighten(this.saturate(this.mix(baseDark, color, 83), 65), 10)
            };
        },

        monochromatic: function(color, options){
            var opt = $.extend({}, ColorsDefaultConfig, options);
            var returnAs = opt.resultType;
            var results = opt.results;
            var hsv = this.toHSV(color);
            var h = hsv.h,
                s = hsv.s,
                v = hsv.v;
            var result = [];
            var mod = 1 / results;
            var self = this;

            while (results--) {
                result.push(new HSV(h, s, v));
                v = (v + mod) % 1;
            }

            return result.map(function(el){
                return self["to"+returnAs.toUpperCase()](el);
            });
        },

        complementary: function(color, options){
            var opt = $.extend({}, ColorsDefaultConfig, options);
            var hsl = this.toHSL(color);
            var result;
            var self = this;

            var returnAs = opt.resultType;

            result = [
                hsl,
                new HSL(shift(hsl.h, 180), hsl.s, hsl.l)
            ];

            return result.map(function(el){
                return self["to"+returnAs.toUpperCase()](el);
            });
        },

        splitComplementary: function(color, options){
            var opt = $.extend({}, ColorsDefaultConfig, options);
            var hsl = this.toHSL(color);
            var h = hsl.h;
            var result, self = this;

            var returnAs = opt.resultType;
            var angle = opt.angle;

            result = [
                hsl,
                new HSL(shift(h, 180 - angle), hsl.s, hsl.l ),
                new HSL(shift(h, 180 + angle), hsl.s, hsl.l )
            ];

            return result.map(function(el){
                return self["to"+returnAs.toUpperCase()](el);
            });
        },

        doubleComplementary: function(color, options){
            var opt = $.extend({}, ColorsDefaultConfig, options);
            var returnAs = opt.resultType;
            var angle = opt.angle;
            var hsl = this.toHSL(color);
            var h = hsl.h;
            var result, self = this;

            result = [
                hsl,
                new HSL(shift(h, 180), hsl.s, hsl.l ),
                new HSL(shift(h, angle), hsl.s, hsl.l ),
                new HSL(shift(h, 180 + angle), hsl.s, hsl.l )
            ];

            return result.map(function(el){
                return self["to"+returnAs.toUpperCase()](el);
            });
        },

        square: function(color, options){
            var opt = $.extend({}, ColorsDefaultConfig, options);
            var returnAs = opt.resultType;
            var result = [], i;
            var hsl = this.toHSL(color);
            var h = hsl.h , self = this;

            result.push(hsl);

            for (i = 1; i < 4; i++) {
                h = shift(h, 90.0);
                result.push(new HSL(h, hsl.s, hsl.l));
            }

            return result.map(function(el){
                return self["to"+returnAs.toUpperCase()](el);
            });
        },

        tetradic: function(color, options){
            var opt = $.extend({}, ColorsDefaultConfig, options);
            var returnAs = opt.resultType;
            var angle = opt.angle;
            var result;
            var hsl = this.toHSL(color);
            var h = hsl.h;
            var self = this;

            result = [
                hsl,
                new HSL(shift(h, 180), hsl.s, hsl.l),
                new HSL(shift(h, 180 - angle), hsl.s, hsl.l),
                new HSL(shift(h, -angle), hsl.s, hsl.l)
            ];

            return result.map(function(el){
                return self["to"+returnAs.toUpperCase()](el);
            });
        },

        triadic: function(color, options){
            var opt = $.extend({}, ColorsDefaultConfig, options);
            var returnAs = opt.resultType;
            var result;
            var hsl = this.toHSL(color);
            var h = hsl.h;
            var self = this;

            result = [
                hsl,
                new HSL(shift(h,120), hsl.s, hsl.l),
                new HSL(shift(h,240), hsl.s, hsl.l)
            ];

            return result.map(function(el){
                return self["to"+returnAs.toUpperCase()](el);
            });
        },

        analogous: function(color, options){
            var opt = $.extend({}, ColorsDefaultConfig, options);
            var returnAs = opt.resultType;
            var angle = opt.angle;

            var hsl = this.toHSL(color);
            var result, self = this;

            result = [
                hsl,
                new HSL(shift(hsl.h, -angle), hsl.s, hsl.l),
                new HSL(shift(hsl.h, +angle), hsl.s, hsl.l)
            ];

            return result.map(function(el){
                return self["to"+returnAs.toUpperCase()](el);
            });
        },

        createScheme: function(color, name, options){
            switch (name.toLowerCase()) {
                case "analogous":
                case "analog": return this.analogous(color, options);

                case "triadic":
                case "triad": return this.triadic(color, options);

                case "tetradic":
                case "tetra": return this.tetradic(color, options);

                case "monochromatic":
                case "mono": return this.monochromatic(color, options);

                case "complementary":
                case "complement":
                case "comp": return this.complementary(color, options);

                case "double-complementary":
                case "double-complement":
                case "double": return this.doubleComplementary(color, options);

                case "split-complementary":
                case "split-complement":
                case "split": return this.splitComplementary(color, options);

                case "square": return this.square(color, options);
                case "material": return this.materialPalette(color, options);
            }
        },

        getScheme: function(){
            return this.createScheme.apply(this, arguments)
        },

        add: function(val1, val2, returnAs){
            var color1 = typeof val1 === "string" ? this.parse(val1) : val1;
            var color2 = typeof val2 === "string" ? this.parse(val2) : val2;
            var c1 = this.toRGBA(color1);
            var c2 = this.toRGBA(color2);
            var result = new RGBA();
            var to = (""+returnAs).toLowerCase() || "hex";

            result.r = Math.round((c1.r + c2.r) / 2);
            result.g = Math.round((c1.g + c2.g) / 2);
            result.b = Math.round((c1.b + c2.b) / 2);
            result.a = Math.round((c1.a + c2.a) / 2);

            return this["to"+to.toUpperCase()](result);
        }
    };

    var Color = function(color, options){
        this._setValue(color);
        this._setOptions(options);
    }

    Color.prototype = {
        _setValue: function(color){
            var _color;

            if (typeof color === "string") {
                _color = Colors.parse(color);
            } else {
                _color = color;
            }

            if (!Colors.isColor(_color)) {
                _color = "#000000";
            }

            this._value = _color;
            this._type = Colors.colorType(this._value);
        },

        _setOptions: function(options){
            options = typeof options === "object" ? options : {};
            this._options = $.extend({}, ColorsDefaultConfig, options);
        },

        getOptions: function(){
            return this._options;
        },

        setOptions: function(options){
            this._setOptions(options);
        },

        setValue: function(color){
            this._setValue(color);
        },

        getValue: function(){
            return this._value;
        },

        channel: function(ch, val){
            var currentType = this._type.toUpperCase();

            if (["red", "green", "blue"].indexOf(ch) > -1) {
                this.toRGB();
                this._value[ch[0]] = val;
                this["to"+currentType]();
            }
            if (ch === "alpha" && this._value.a) {
                this._value.a = val;
            }
            if (["hue", "saturation", "value"].indexOf(ch) > -1) {
                this.toHSV();
                this._value[ch[0]] = val;
                this["to"+currentType]();
            }
            if (["lightness"].indexOf(ch) > -1) {
                this.toHSL();
                this._value[ch[0]] = val;
                this["to"+currentType]();
            }
            if (["cyan", "magenta", "yellow", "black"].indexOf(ch) > -1) {
                this.toCMYK();
                this._value[ch[0]] = val;
                this["to"+currentType]();
            }

            return this;
        },

        channels: function(obj){
            var that = this;

            $.each(obj, function(key, val){
                that.channel(key, val);
            });

            return this;
        },

        toRGB: function() {
            this._value = Colors.toRGB(this._value);
            this._type = Types.RGB;
            return this;
        },

        rgb: function(){
            return this._value ? new Color(Colors.toRGB(this._value)) : undefined;
        },

        toRGBA: function(alpha) {
            if (Colors.isRGBA(this._value)) {
                if (alpha) {
                    this._value = Colors.toRGBA(this._value, alpha);
                }
            } else {
                this._value = Colors.toRGBA(this._value, alpha);
            }
            this._type = Types.RGBA;
            return this;
        },

        rgba: function(alpha) {
            return this._value ? new Color(Colors.toRGBA(this._value, alpha)) : undefined;
        },

        toHEX: function() {
            this._value = Colors.toHEX(this._value);
            this._type = Types.HEX;
            return this;
        },

        hex: function() {
            return this._value ? new Color(Colors.toHEX(this._value)) : undefined;
        },

        toHSV: function() {
            this._value = Colors.toHSV(this._value);
            this._type = Types.HSV;
            return this;
        },

        hsv: function() {
            return this._value ? new Color(Colors.toHSV(this._value)) : undefined;
        },

        toHSL: function() {
            this._value = Colors.toHSL(this._value);
            this._type = Types.HSL;
            return this;
        },

        hsl: function() {
            return this._value ? new Color(Colors.toHSL(this._value)) : undefined;
        },

        toHSLA: function(alpha) {
            if (Colors.isHSLA(this._value)) {
                if (alpha) {
                    this._value = Colors.toHSLA(this._value, alpha);
                }
            } else {
                this._value = Colors.toHSLA(this._value, alpha);
            }
            this._type = Types.HSLA;
            return this;
        },

        hsla: function(alpha) {
            return this._value ? new Color(Colors.toHSLA(this._value, alpha)) : undefined;
        },

        toCMYK: function() {
            this._value = Colors.toCMYK(this._value);
            this._type = Types.CMYK;
            return this;
        },

        cmyk: function() {
            return this._value ? new Color(Colors.toCMYK(this._value)) : undefined;
        },

        toWebsafe: function() {
            this._value = Colors.websafe(this._value);
            this._type = Colors.colorType(this._value);
            return this;
        },

        websafe: function() {
            return this._value ? new Color(Colors.websafe(this._value)) : undefined;
        },

        toString: function() {
            return this._value ? Colors.colorToString(this._value) : "undefined";
        },

        toDarken: function(amount) {
            this._value = Colors.darken(this._value, amount);
            return this;
        },

        darken: function(amount){
            return new Color(Colors.darken(this._value, amount));
        },

        toLighten: function(amount) {
            this._value = Colors.lighten(this._value, amount);
            return this;
        },

        lighten: function(amount){
            return new Color(Colors.lighten(this._value, amount))
        },

        isDark: function() {
            return this._value ? Colors.isDark(this._value) : undefined;
        },

        isLight: function() {
            return this._value ? Colors.isLight(this._value) : undefined;
        },

        toHueShift: function(hue, saturation, value) {
            this._value = Colors.hueShift(this._value, hue, saturation, value);
            return this;
        },

        hueShift: function (hue, saturation, value) {
            return new Color(Colors.hueShift(this._value, hue, saturation, value));
        },

        toGrayscale: function() {
            this._value = Colors.grayscale(this._value, this._type);
            return this;
        },

        grayscale: function(){
            return new Color(Colors.grayscale(this._value, this._type));
        },

        type: function() {
            return Colors.colorType(this._value);
        },

        createScheme: function(name, format, options) {
            return this._value
                ? Colors.createScheme(this._value, name, format, options)
                : undefined;
        },

        getScheme: function(){
            return this.createScheme.apply(this, arguments);
        },

        equal: function(color) {
            return Colors.equal(this._value, color);
        },

        toAdd: function(color){
            this._value = Colors.add(this._value, color, this._type);
            return this;
        },

        add: function(color){
            return new Color(Colors.add(this._value, color, this._type));
        }
    }

    Metro.colors = Colors.init();
    window.Color = Metro.Color = Color;
    window.ColorPrimitive = Metro.colorPrimitive = {
        RGB: RGB,
        RGBA: RGBA,
        HSV: HSV,
        HSL: HSL,
        HSLA: HSLA,
        CMYK: CMYK
    };

    if (window.METRO_GLOBAL_COMMON === true) {
        window.Colors = Metro.colors;
    }

}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var defaultAvatar = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAUABQAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+t+KKPxo/GgA70Yo/Gj8aADFH4VesdC1HUl3WtjcXCf344yV/PGKW+0HUtNXddWNzbp/fkjIX88YoAofhR+FH40fjQAfhR+FH40fjQAUUUUAFepeAPh5D9li1LVYhK8g3Q27j5VXszDuT6f5HA+FtOXVvEWn2rjMcko3j1UckfkDX0MBgYHAoARVCKFUBVHAA6ClZQwKkZBGCDS0UAec+Pvh3BJay6lpUQimjBeW3QYVx3Kjsfbv/PyqvpuvnvxfpqaT4l1C1QbY0lJUDsrfMB+RoAyKKKKACiiigDa8GXq6f4p02eQgIJQpJ7Bvlz+tfQP4V8yDg17P4A8cw65ZxWV5IE1KMbfmP+uA7j39R+NAHaUfhSUUAL+FeA+OL1NQ8WalNGQU83YCO+0Bf6V6b498cQ6BZyWlrIJNSkXaApz5QP8AEff0FeKk5OTyTQAUUUUAH40fjRU1naTX93DbQIXmlYIijuTQBc0Dw/eeI74W1mm49XkbhUHqTXsHhz4eaXoCpI8YvbscmaYZAP8Asr0H8/etHwv4cg8M6XHaxANIfmllxy7dz9PStigA/Gk/GlooA5bxJ8PdL19XkWMWd43PnwjGT/tL0P8AP3rx/X/D954cvjbXibT1SReVceoNfRFZHijw5B4m0uS1lAWQfNFLjlG7H6etAHz5+NH41NeWk1hdzW06FJonKMp7EGoaACvQfhBowudTudRkXK2y7I8j+Nup/Afzrz6vafhRaCDwmkgHM8zufwO3/wBloA7Kiij8KACkpaSgBaSj8KKAPJvi/owttTttRjXC3K7JMf3l6H8R/KvPq9p+K1qJ/CbyEcwTI4P1O3/2avFqAP/Z";
    var ChatDefaultConfig = {
        chatDeferred: 0,
        inputTimeFormat: "%m-%d-%y",
        timeFormat: "%d %b %l:%M %p",
        name: "John Doe",
        avatar: defaultAvatar,
        welcome: null,
        title: null,
        width: "100%",
        height: "auto",
        randomColor: false,
        messages: null,
        sendButtonTitle: "Send",
        readonly: false,

        clsChat: "",
        clsName: "",
        clsTime: "",
        clsInput: "",
        clsSendButton: "",
        clsMessageLeft: "default",
        clsMessageRight: "default",

        onMessage: Metro.noop,
        onSend: Metro.noop,
        onSendButtonClick: Metro.noop,
        onChatCreate: Metro.noop
    };

    Metro.chatSetup = function (options) {
        ChatDefaultConfig = $.extend({}, ChatDefaultConfig, options);
    };

    if (typeof window["metroChatSetup"] !== undefined) {
        Metro.chatSetup(window["metroChatSetup"]);
    }

    Metro.Component('chat', {
        init: function( options, elem ) {
            this._super(elem, options, ChatDefaultConfig, {
                input: null,
                classes: "primary secondary success alert warning yellow info dark light".split(" "),
                lastMessage: null
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("chat-create", {
                element: element
            });
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;
            var messages, messageInput, input;
            var customButtons = [
                {
                    html: o.sendButtonTitle,
                    cls: o.clsSendButton+" js-chat-send-button",
                    onclick: o.onSendButtonClick
                }
            ];

            element.addClass("chat").addClass(o.clsChat);

            element.css({
                width: o.width,
                height: o.height
            });

            if (Utils.isValue(o.title)) {
                $("<div>").addClass("title").html(o.title).appendTo(element);
            }

            messages = $("<div>").addClass("messages");
            messages.appendTo(element);
            messageInput = $("<div>").addClass("message-input").appendTo(element);
            input = $("<input type='text'>");
            input.appendTo(messageInput);
            input.input({
                customButtons: customButtons,
                clsInput: o.clsInput
            });

            if (o.welcome) {
                this.add({
                    text: o.welcome,
                    time: (new Date()),
                    position: "left",
                    name: "Welcome",
                    avatar: defaultAvatar
                })
            }

            if (Utils.isValue(o.messages) && typeof o.messages === "string") {
                o.messages = Utils.isObject(o.messages);
            }

            if (!Utils.isNull(o.messages) && typeof o.messages === "object" && Utils.objectLength(o.messages) > 0) {
                $.each(o.messages, function(){
                    that.add(this);
                });
            }

            element.find(".message-input")[o.readonly ? 'addClass':'removeClass']("disabled");
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var sendButton = element.find(".js-chat-send-button");
            var input = element.find("input[type=text]");

            var send = function(){
                var msg = ""+input.val(), m;
                if (msg.trim() === "") {return false;}
                m = {
                    id: Utils.elementId("chat-message"),
                    name: o.name,
                    avatar: o.avatar,
                    text: msg,
                    position: "right",
                    time: (new Date())
                };
                that.add(m);
                input.val("");
                that._fireEvent("send", {
                    msg: m
                });
            };

            sendButton.on(Metro.events.click, function () {
                send();
            });

            input.on(Metro.events.keyup, function(e){
                if (e.keyCode === Metro.keyCode.ENTER) {
                    send();
                }
            })
        },

        add: function(msg){
            var that = this, element = this.element, o = this.options;
            var index, message, sender, time, item, avatar, text;
            var messages = element.find(".messages");
            var messageDate;

            messageDate = typeof msg.time === 'string' ? msg.time.toDate(o.inputTimeFormat) : msg.time;

            message = $("<div>").addClass("message").addClass(msg.position).appendTo(messages);
            sender = $("<div>").addClass("message-sender").addClass(o.clsName).html(msg.name).appendTo(message);
            time = $("<div>").addClass("message-time").addClass(o.clsTime).html(messageDate.format(o.timeFormat)).appendTo(message);
            item = $("<div>").addClass("message-item").appendTo(message);
            avatar = $("<img>").attr("src", msg.avatar).addClass("message-avatar").appendTo(item);
            text = $("<div>").addClass("message-text").html(msg.text).appendTo(item);

            if (Utils.isValue(msg.id)) {
                message.attr("id", msg.id);
            }

            if (o.randomColor === true) {
                index = $.random(0, that.classes.length - 1);
                text.addClass(that.classes[index]);
            } else {
                if (msg.position === 'left' && Utils.isValue(o.clsMessageLeft)) {
                    text.addClass(o.clsMessageLeft);
                }
                if (msg.position === 'right' && Utils.isValue(o.clsMessageRight)) {
                    text.addClass(o.clsMessageRight);
                }
            }

            that._fireEvent("message", {
                msg: msg,
                el: {
                    message: message,
                    sender: sender,
                    time: time,
                    item: item,
                    avatar: avatar,
                    text: text
                }
            });

            messages.animate({
                draw: {
                    scrollTop: messages[0].scrollHeight
                },
                dur: 1000
            });

            this.lastMessage = msg;

            return this;
        },

        addMessages: function(messages){
            var that = this;

            if (Utils.isValue(messages) && typeof messages === "string") {
                messages = Utils.isObject(messages);
            }

            if (typeof messages === "object" && Utils.objectLength(messages) > 0) {
                $.each(messages, function(){
                    that.add(this);
                });
            }

            return this;
        },

        delMessage: function(id){
            var element = this.element;

            element.find(".messages").find("#"+id).remove();

            return this;
        },

        updMessage: function(msg){
            var element = this.element;
            var message = element.find(".messages").find("#"+msg.id);

            if (message.length === 0) return this;

            message.find(".message-text").html(msg.text);
            message.find(".message-time").html(msg.time);

            return this;
        },

        clear: function(){
            var element = this.element;
            var messages = element.find(".messages");
            messages.html("");
            this.lastMessage = null;
        },

        toggleReadonly: function(readonly){
            var element = this.element, o = this.options;
            o.readonly = typeof readonly === "undefined" ? !o.readonly : readonly;
            element.find(".message-input")[o.readonly ? 'addClass':'removeClass']("disabled");
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case "data-readonly": this.toggleReadonly(); break;
            }
        },

        destroy: function(){
            var element = this.element;
            var sendButton = element.find(".js-chat-send-button");
            var input = element.find("input[type=text]");

            sendButton.off(Metro.events.click);
            input.off(Metro.events.keyup);

            return element;
        }
    });
}(Metro, m4q));


/* global Metro, METRO_LOCALE, METRO_WEEK_START, METRO_DATE_FORMAT */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var CalendarPickerDefaultConfig = {
        showTime: false,
        initialTime: null,
        initialHours: null,
        initialMinutes: null,
        clsCalendarTime: "",
        clsTime: "",
        clsTimeHours: "",
        clsTimeMinutes: "",
        clsTimeButton: "",
        clsTimeButtonPlus: "",
        clsTimeButtonMinus: "",

        label: "",
        value:'',
        calendarpickerDeferred: 0,
        nullValue: true,
        useNow: false,

        prepend: "",

        calendarWide: false,
        calendarWidePoint: null,


        dialogMode: false,
        dialogPoint: 640,
        dialogOverlay: true,
        overlayColor: '#000000',
        overlayAlpha: .5,

        locale: METRO_LOCALE,
        size: "100%",
        format: METRO_DATE_FORMAT,
        inputFormat: null,
        headerFormat: "%A, %b %e",
        clearButton: false,
        calendarButtonIcon: "<span class='default-icon-calendar'></span>",
        clearButtonIcon: "<span class='default-icon-cross'></span>",
        copyInlineStyles: false,
        clsPicker: "",
        clsInput: "",

        yearsBefore: 100,
        yearsAfter: 100,
        weekStart: METRO_WEEK_START,
        outside: true,
        ripple: false,
        rippleColor: "#cccccc",
        exclude: null,
        minDate: null,
        maxDate: null,
        special: null,
        showHeader: true,

        showWeekNumber: false,

        clsCalendar: "",
        clsCalendarHeader: "",
        clsCalendarContent: "",
        clsCalendarMonths: "",
        clsCalendarYears: "",
        clsToday: "",
        clsSelected: "",
        clsExcluded: "",
        clsPrepend: "",
        clsLabel: "",

        onDayClick: Metro.noop,
        onCalendarPickerCreate: Metro.noop,
        onCalendarShow: Metro.noop,
        onCalendarHide: Metro.noop,
        onChange: Metro.noop,
        onPickerChange: Metro.noop,
        onMonthChange: Metro.noop,
        onYearChange: Metro.noop
    };

    Metro.calendarPickerSetup = function (options) {
        CalendarPickerDefaultConfig = $.extend({}, CalendarPickerDefaultConfig, options);
    };

    if (typeof window["metroCalendarPickerSetup"] !== undefined) {
        Metro.calendarPickerSetup(window["metroCalendarPickerSetup"]);
    }

    Metro.Component('calendar-picker', {
        init: function( options, elem ) {
            this._super(elem, options, CalendarPickerDefaultConfig, {
                value: null,
                value_date: null,
                calendar: null,
                overlay: null,
                id: Utils.elementId("calendar-picker"),
                time: [new Date().getHours(), new Date().getMinutes()]
            });

            return this;
        },

        _create: function(){

            this._createStructure();
            this._createEvents();

            this._fireEvent("calendar-picker-create", {
                element: this.element
            });
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;
            var container = $("<div>").addClass("input " + element[0].className + " calendar-picker");
            var buttons = $("<div>").addClass("button-group");
            var calendarButton, clearButton, cal = $("<div>").addClass("drop-shadow");
            var curr, _curr, initTime, initHours, initMinutes, elementValue, h, m;
            var body = $("body");

            element.attr("type", "text");
            element.attr("autocomplete", "off");
            element.attr("readonly", true);

            if (Utils.isValue(o.initialTime)) {
                this.time = o.initialTime.trim().split(":");
            }

            if (Utils.isValue(o.initialHours)) {
                this.time[0] = parseInt(o.initialHours);
            }

            if (Utils.isValue(o.initialHours)) {
                this.time[1] = parseInt(o.initialMinutes);
            }

            curr = (""+o.value).trim() !== '' ? o.value : element.val().trim();

            if (!Utils.isValue(curr)) {
                if (o.useNow) {
                    this.value = new Date();
                    this.time = [this.value.getHours(), this.value.getMinutes()];
                }
            } else {
                _curr = curr.split(" ");
                this.value = !Utils.isValue(o.inputFormat) ? new Date(_curr[0]) : _curr[0].toDate(o.inputFormat, o.locale);
                if (_curr[1]) {
                    this.time = _curr[1].trim().split(":");
                }
            }

            if (Utils.isValue(this.value)) this.value.setHours(0,0,0,0);

            elementValue = !Utils.isValue(curr) && o.nullValue === true ? "" : that.value.format(o.format, o.locale);

            if (o.showTime && this.time && elementValue) {
                h = Utils.lpad(this.time[0], "0", 2);
                m = Utils.lpad(this.time[1], "0", 2);
                elementValue += " " + h + ":" + m;
            }

            element.val(elementValue);

            container.insertBefore(element);
            element.appendTo(container);
            buttons.appendTo(container);
            cal.appendTo(o.dialogMode ? body : container);

            if (this.time && this.time.length) {
                initHours = this.time[0];
                if (typeof this.time[1] !== "undefined")
                    initMinutes = this.time[1];
            }

            initTime = o.initialTime;

            if (o.initialHours) {
                initHours = o.initialHours;
            }

            if (o.initialHours) {
                initMinutes = o.initialMinutes;
            }

            Metro.makePlugin(cal, "calendar", {
                showTime: o.showTime,
                initialTime: initTime,
                initialHours: initHours,
                initialMinutes: initMinutes,
                clsCalendarTime: o.clsCalendarTime,
                clsTime: o.clsTime,
                clsTimeHours: o.clsTimeHours,
                clsTimeMinutes: o.clsTimeMinutes,
                clsTimeButton: o.clsTimeButton,
                clsTimeButtonPlus: o.clsTimeButtonPlus,
                clsTimeButtonMinus: o.clsTimeButtonMinus,

                wide: o.calendarWide,
                widePoint: o.calendarWidePoint,

                format: o.format,
                inputFormat: o.inputFormat,
                pickerMode: true,
                show: o.value,
                locale: o.locale,
                weekStart: o.weekStart,
                outside: o.outside,
                buttons: false,
                headerFormat: o.headerFormat,

                clsCalendar: [o.clsCalendar, "calendar-for-picker", (o.dialogMode ? "dialog-mode":"")].join(" "),
                clsCalendarHeader: o.clsCalendarHeader,
                clsCalendarContent: o.clsCalendarContent,
                clsCalendarFooter: "d-none",
                clsCalendarMonths: o.clsCalendarMonths,
                clsCalendarYears: o.clsCalendarYears,
                clsToday: o.clsToday,
                clsSelected: o.clsSelected,
                clsExcluded: o.clsExcluded,

                ripple: o.ripple,
                rippleColor: o.rippleColor,
                exclude: o.exclude,
                minDate: o.minDate,
                maxDate: o.maxDate,
                yearsBefore: o.yearsBefore,
                yearsAfter: o.yearsAfter,
                special: o.special,
                showHeader: o.showHeader,
                showFooter: false,
                showWeekNumber: o.showWeekNumber,
                onDayClick: function(sel, day, time, el){
                    var date = new Date(sel[0]);
                    var elementValue, h, m;

                    date.setHours(0,0,0,0);

                    that._removeOverlay();

                    that.value = date;
                    that.time = time;

                    elementValue = date.format(o.format, o.locale);

                    if (o.showTime) {
                        h = Utils.lpad(time[0], "0", 2);
                        m = Utils.lpad(time[1], "0", 2);
                        elementValue += " " + h + ":" + m;
                    }

                    element.val(elementValue);
                    element.trigger("change");
                    cal.removeClass("open open-up");
                    cal.hide();

                    that._fireEvent("change", {
                        val: that.value,
                        time: that.time
                    });

                    that._fireEvent("day-click", {
                        sel: sel,
                        day: day,
                        time: time,
                        el: el
                    });

                    that._fireEvent("picker-change", {
                        val: that.value,
                        time: that.time
                    });
                },
                onTimeChange: function(time){
                    var elementValue, h, m;

                    that.time = time;

                    if (!that.value) {
                        that.value = new Date();
                    }
                    elementValue = that.value.format(o.format, o.locale);

                    if (o.showTime) {
                        h = Utils.lpad(time[0], "0", 2);
                        m = Utils.lpad(time[1], "0", 2);
                        elementValue += " " + h + ":" + m;
                    }

                    element.val(elementValue);

                    that._fireEvent("change", {
                        val: that.value,
                        time: that.time
                    });

                    that._fireEvent("picker-change", {
                        val: that.value,
                        time: that.time
                    });
                },
                onMonthChange: o.onMonthChange,
                onYearChange: o.onYearChange
            });

            this.calendar = cal;

            if (o.clearButton === true) {
                clearButton = $("<button>").addClass("button input-clear-button").attr("tabindex", -1).attr("type", "button").html(o.clearButtonIcon);
                clearButton.appendTo(buttons);
            }

            calendarButton = $("<button>").addClass("button").attr("tabindex", -1).attr("type", "button").html(o.calendarButtonIcon);
            calendarButton.appendTo(buttons);

            if (o.prepend !== "") {
                var prepend = $("<div>").html(o.prepend);
                prepend.addClass("prepend").addClass(o.clsPrepend).appendTo(container);
            }

            if (element.attr('dir') === 'rtl' ) {
                container.addClass("rtl");
            }

            if (String(o.size).indexOf("%") > -1) {
                container.css({
                    width: o.size
                });
            } else {
                container.css({
                    width: parseInt(o.size) + "px"
                });
            }

            element[0].className = '';

            if (o.copyInlineStyles === true) {
                $.each(Utils.getInlineStyles(element), function(key, value){
                    container.css(key, value);
                });
            }

            container.addClass(o.clsPicker);
            element.addClass(o.clsInput);

            if (o.dialogOverlay === true) {
                this.overlay = that._overlay();
            }

            if (o.dialogMode === true) {
                container.addClass("dialog-mode");
            } else {
                if (Utils.media("(max-width: "+o.dialogPoint+"px)")) {
                    container.addClass("dialog-mode");
                    this.calendar.addClass("dialog-mode");
                }
            }

            if (o.label) {
                var label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(container);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }

        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var container = element.parent();
            var clear = container.find(".input-clear-button");
            var cal = this.calendar;
            var cal_plugin = Metro.getPlugin(cal[0], 'calendar');
            var calendar = this.calendar;

            $(window).on(Metro.events.resize, function(){
                if (o.dialogMode !== true) {
                    if (Utils.media("(max-width: " + o.dialogPoint + "px)")) {
                        container.addClass("dialog-mode");
                        calendar.appendTo("body").addClass("dialog-mode");
                    } else {
                        container.removeClass("dialog-mode");
                        calendar.appendTo(container).removeClass("dialog-mode");
                    }
                }
            }, {ns: this.id});

            if (clear.length > 0) clear.on(Metro.events.click, function(e){
                element.val("").trigger('change').blur(); // TODO change blur
                that.value = null;
                e.preventDefault();
                e.stopPropagation();
            });

            container.on(Metro.events.click, "button, input", function(e){

                var value = Utils.isValue(that.value) ? that.value : new Date();

                value.setHours(0,0,0,0);

                if (cal.hasClass("open") === false && cal.hasClass("open-up") === false) {

                    $(".calendar-picker .calendar").removeClass("open open-up").hide();

                    cal_plugin.setPreset([value]);
                    cal_plugin.setShow(value);
                    cal_plugin.setToday(value);

                    if (container.hasClass("dialog-mode")) {
                        that.overlay.appendTo($('body'));
                    }
                    cal.addClass("open");
                    if (!Utils.inViewport(cal[0])) {
                        cal.addClass("open-up");
                    }
                    // if (Utils.isOutsider(cal) === false) {
                    //     cal.addClass("open-up");
                    // }

                    that._fireEvent("calendar-show", {
                        calendar: cal
                    });

                } else {

                    that._removeOverlay();
                    cal.removeClass("open open-up");

                    that._fireEvent("calendar-hide", {
                        calendar: cal
                    });

                }
                e.preventDefault();
                e.stopPropagation();
            });

            element.on(Metro.events.blur, function(){container.removeClass("focused");});
            element.on(Metro.events.focus, function(){container.addClass("focused");});
            element.on(Metro.events.change, function(){
                Utils.exec(o.onChange, [that.value], element[0]);
            });

            container.on(Metro.events.click, function(e){
                e.preventDefault();
                e.stopPropagation();
            })
        },

        _overlay: function(){
            var o = this.options;

            var overlay = $("<div>");
            overlay.addClass("overlay for-calendar-picker").addClass(o.clsOverlay);

            if (o.overlayColor === 'transparent') {
                overlay.addClass("transparent");
            } else {
                overlay.css({
                    background: Metro.colors.toRGBA(o.overlayColor, o.overlayAlpha)
                });
            }

            return overlay;
        },

        _removeOverlay: function(){
            $('body').find('.overlay.for-calendar-picker').remove();
        },

        val: function(v){
            var element = this.element, o = this.options;
            var elementValue, h, m;

            if (Utils.isNull(v) || arguments.length === 0)  {
                return {
                    date: this.value,
                    time: this.time
                };
            }

            if (!Utils.isDate(v, o.format) && !Utils.isDateObject(v)) {
                throw new Error(v + " is a not valid date value");
            }

            var _curr = v.split(" ");
            this.value = Utils.isValue(o.inputFormat) === false ? new Date(_curr[0]) : _curr[0].toDate(o.inputFormat, o.locale);
            if (_curr[1]) {
                this.time = _curr[1].trim().split(":");
            }

            this.value.setHours(0,0,0,0);
            this.calendar.data('calendar').setTime(this.time);

            elementValue = this.value.format(o.format);

            if (o.showTime && this.time && elementValue) {
                h = Utils.lpad(this.time[0], "0", 2);
                m = Utils.lpad(this.time[1], "0", 2);
                elementValue += " " + h + ":" + m;
            }

            element.val(elementValue);
            element.trigger("change");
        },

        disable: function(){
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function(){
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggleState: function(){
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        i18n: function(val){
            var o = this.options;
            var hidden;
            var cal = this.calendar;
            if (val === undefined) {
                return o.locale;
            }
            if (Metro.locales[val] === undefined) {
                return false;
            }

            hidden = cal[0].hidden;
            if (hidden) {
                cal.css({
                    visibility: "hidden",
                    display: "block"
                });
            }
            Metro.getPlugin(cal[0], 'calendar').i18n(val);
            if (hidden) {
                cal.css({
                    visibility: "visible",
                    display: "none"
                });
            }
        },

        getTime: function(asString){
            var h, m;

            asString = asString || false;

            h = Utils.lpad(this.time[0], "0", 2);
            m = Utils.lpad(this.time[1], "0", 2);

            return asString ? h +":"+ m : this.time;
        },

        changeAttribute: function(attributeName, newValue){
            var that = this;
            var cal = Metro.getPlugin(this.calendar[0], "calendar");

            switch (attributeName) {
                case "value": that.val(newValue); break;
                case 'disabled': this.toggleState(); break;
                case 'data-locale': that.i18n(newValue); break;
                case 'data-special': cal.setSpecial(newValue); break;
                case 'data-exclude': cal.setExclude(newValue); break;
                case 'data-min-date': cal.setMinDate(newValue); break;
                case 'data-max-date': cal.setMaxDate(newValue); break;
                case 'data-value': that.val(newValue); break;
            }
        },

        destroy: function(){
            var element = this.element;
            var container = element.parent();
            var clear = container.find(".input-clear-button");

            $(window).off(Metro.events.resize, {ns: this.id});
            clear.off(Metro.events.click);
            container.off(Metro.events.click, "button, input");
            element.off(Metro.events.blur);
            element.off(Metro.events.focus);
            element.off(Metro.events.change);

            Metro.getPlugin(this.calendar, "calendar").destroy();

            return element;
        }
    });

    $(document).on(Metro.events.click, ".overlay.for-calendar-picker",function(){
        $(this).remove();
        $(".calendar-for-picker.open").removeClass("open open-up");
    });

    $(document).on(Metro.events.click, function(){
        $(".calendar-picker .calendar").removeClass("open open-up");
    });
}(Metro, m4q));


/* global Metro, METRO_LOCALE, METRO_WEEK_START, METRO_DATE_FORMAT */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var CalendarDefaultConfig = {
        showCoincidentalDay: true,
        events: null,
        startContent: "days",
        showTime: false,
        initialTime: null,
        initialHours: null,
        initialMinutes: null,
        clsCalendarTime: "",
        clsTime: "",
        clsTimeHours: "",
        clsTimeMinutes: "",
        clsTimeButton: "",
        clsTimeButtonPlus: "",
        clsTimeButtonMinus: "",
        labelTimeHours: null,
        labelTimeMinutes: null,

        animationContent: true,
        animationSpeed: 10,

        calendarDeferred: 0,
        dayBorder: false,
        excludeDay: null,
        prevMonthIcon: "<span class='default-icon-chevron-left'></span>",
        nextMonthIcon: "<span class='default-icon-chevron-right'></span>",
        prevYearIcon: "<span class='default-icon-chevron-left'></span>",
        nextYearIcon: "<span class='default-icon-chevron-right'></span>",
        compact: false,
        wide: false,
        widePoint: null,
        pickerMode: false,
        show: null,
        locale: METRO_LOCALE,
        weekStart: METRO_WEEK_START,
        outside: true,
        buttons: 'cancel, today, clear, done',
        yearsBefore: 100,
        yearsAfter: 100,
        headerFormat: "%A, %b %e",
        showHeader: true,
        showFooter: true,
        showTimeField: true,
        showWeekNumber: false,
        clsCalendar: "",
        clsCalendarHeader: "",
        clsCalendarContent: "",
        clsCalendarFooter: "",
        clsCalendarMonths: "",
        clsCalendarYears: "",
        clsToday: "",
        clsSelected: "",
        clsExcluded: "",
        clsCancelButton: "",
        clsTodayButton: "",
        clsClearButton: "",
        clsDoneButton: "",
        clsEventCounter: "",
        isDialog: false,
        ripple: false,
        rippleColor: "#cccccc",
        exclude: null,
        preset: null,
        minDate: null,
        maxDate: null,
        weekDayClick: false,
        weekNumberClick: false,
        multiSelect: false,
        special: null,
        format: METRO_DATE_FORMAT,
        inputFormat: null,
        onCancel: Metro.noop,
        onToday: Metro.noop,
        onClear: Metro.noop,
        onDone: Metro.noop,
        onDayClick: Metro.noop,
        onDrawDay: Metro.noop,
        onDrawMonth: Metro.noop,
        onDrawYear: Metro.noop,
        onWeekDayClick: Metro.noop,
        onWeekNumberClick: Metro.noop,
        onMonthChange: Metro.noop,
        onYearChange: Metro.noop,
        onTimeChange: Metro.noop,
        onHoursChange: Metro.noop,
        onMinutesChange: Metro.noop,
        onCalendarCreate: Metro.noop
    };

    Metro.calendarSetup = function (options) {
        CalendarDefaultConfig = $.extend({}, CalendarDefaultConfig, options);
    };

    if (typeof window["metroCalendarSetup"] !== undefined) {
        Metro.calendarSetup(window["metroCalendarSetup"]);
    }

    Metro.Component('calendar', {
        init: function( options, elem ) {

            var now = new Date();
            now.setHours(0,0,0,0);

            this._super(elem, options, CalendarDefaultConfig, {
                today: now,
                show: now,
                current: {
                    year: now.getFullYear(),
                    month: now.getMonth(),
                    day: now.getDate()
                },
                preset: [],
                selected: [],
                exclude: [],
                special: [],
                excludeDay: [],
                events: [],
                min: null,
                max: null,
                locale: null,
                minYear: null,
                maxYear: null,
                offset: null,
                id: Utils.elementId("calendar"),
                time: [new Date().getHours(), new Date().getMinutes()],
                content: "days",
                yearDistance: 11,
                yearGroupStart: now.getFullYear()
            });

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;

            this.content = o.startContent;
            this.minYear = this.current.year - this.options.yearsBefore;
            this.maxYear = this.current.year + this.options.yearsAfter;
            this.offset = (new Date()).getTimezoneOffset() / 60 + 1;

            element.html("").addClass("calendar " + (o.compact === true ? "compact" : "")).addClass(o.clsCalendar);

            if (Utils.isValue(o.initialTime)) {
                this.time = o.initialTime.split(":");
            }

            if (Utils.isValue(o.initialHours) && Utils.between(o.initialHours, 0, 23, true)) {
                this.time[0] = parseInt(o.initialHours);
            }

            if (Utils.isValue(o.initialMinutes) && Utils.between(o.initialMinutes, 0, 59, true)) {
                this.time[1] = parseInt(o.initialMinutes);
            }

            if (o.dayBorder === true) {
                element.addClass("day-border");
            }

            if (Utils.isValue(o.excludeDay)) {
                this.excludeDay = (""+o.excludeDay).toArray(",", "int");
            }

            if (Utils.isValue(o.preset)) {
                this._dates2array(o.preset, 'selected');
            }

            if (Utils.isValue(o.exclude)) {
                this._dates2array(o.exclude, 'exclude');
            }

            if (Utils.isValue(o.special)) {
                this._dates2array(o.special, 'special');
            }

            if (Utils.isValue(o.events)) {
                this._dates2array(o.events, 'events');
            }

            if (o.buttons !== false) {
                if (Array.isArray(o.buttons) === false) {
                    o.buttons = o.buttons.split(",").map(function(item){
                        return item.trim();
                    });
                }
            }

            if (o.minDate !== null && Utils.isDate(o.minDate, o.inputFormat)) {
                this.min = Utils.isValue(o.inputFormat) ? o.minDate.toDate(o.inputFormat) : (new Date(o.minDate));
            }

            if (o.maxDate !== null && Utils.isDate(o.maxDate, o.inputFormat)) {
                this.max = Utils.isValue(o.inputFormat) ? o.maxDate.toDate(o.inputFormat) : (new Date(o.maxDate));
            }

            if (o.show !== null && Utils.isDate(o.show, o.inputFormat)) {
                this.show = Utils.isValue(o.inputFormat) ? o.show.toDate(o.inputFormat) : (new Date(o.show));
                this.show.setHours(0,0,0,0);
                this.current = {
                    year: this.show.getFullYear(),
                    month: this.show.getMonth(),
                    day: this.show.getDate()
                }
            }

            this.locale = Metro.locales[o.locale] !== undefined ? Metro.locales[o.locale] : Metro.locales["en-US"];

            this._drawCalendar();
            this._createEvents();

            if (o.wide === true) {
                element.addClass("calendar-wide");
            } else {
                if (!Utils.isNull(o.widePoint) && Utils.mediaExist(o.widePoint)) {
                    element.addClass("calendar-wide");
                }
            }


            if (o.ripple === true && Utils.isFunc(element.ripple) !== false) {
                element.ripple({
                    rippleTarget: ".button, .prev-month, .next-month, .prev-year, .next-year, .day",
                    rippleColor: this.options.rippleColor
                });
            }

            this._fireEvent("calendar-create");
        },

        _dates2array: function(val, category){
            var that = this, o = this.options;
            var dates;

            if (Utils.isNull(val)) {
                return ;
            }

            dates = typeof val === 'string' ? val.toArray() : val;

            $.each(dates, function(){
                var _d;

                if (!Utils.isDateObject(this)) {
                    _d = Utils.isValue(o.inputFormat) ? this.toDate(o.inputFormat) : new Date(this);
                    if (Utils.isDate(_d) === false) {
                        return ;
                    }
                    _d.setHours(0,0,0,0);
                } else {
                    _d = this;
                }

                that[category].push(_d.getTime());
            });
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

            $(window).on(Metro.events.resize, function(){
                if (o.wide !== true) {
                    if (!Utils.isNull(o.widePoint) && Utils.mediaExist(o.widePoint)) {
                        element.addClass("calendar-wide");
                    } else {
                        element.removeClass("calendar-wide");
                    }
                }
            }, {ns: this.id});

            element.on(Metro.events.click, ".prev-year-group, .next-year-group", function(){
                if ($(this).hasClass("prev-year-group")) {
                    that.yearGroupStart -= that.yearDistance;
                } else {
                    that.yearGroupStart += that.yearDistance;
                }
                that._drawContent();
            });

            element.on(Metro.events.click, ".prev-month, .next-month, .prev-year, .next-year", function(){
                var new_date, el = $(this);

                if (el.hasClass("prev-month")) {
                    new_date = new Date(that.current.year, that.current.month - 1, 1);
                    if (new_date.getFullYear() < that.minYear) {
                        return ;
                    }
                }
                if (el.hasClass("next-month")) {
                    new_date = new Date(that.current.year, that.current.month + 1, 1);
                    if (new_date.getFullYear() > that.maxYear) {
                        return ;
                    }
                }
                if (el.hasClass("prev-year")) {
                    new_date = new Date(that.current.year - 1, that.current.month, 1);
                    if (new_date.getFullYear() < that.minYear) {
                        return ;
                    }
                }
                if (el.hasClass("next-year")) {
                    new_date = new Date(that.current.year + 1, that.current.month, 1);
                    if (new_date.getFullYear() > that.maxYear) {
                        return ;
                    }
                }

                that.current = {
                    year: new_date.getFullYear(),
                    month: new_date.getMonth(),
                    day: new_date.getDate()
                };
                setTimeout(function(){
                    that._drawContent();
                    if (el.hasClass("prev-month") || el.hasClass("next-month")) {
                        that._fireEvent("month-change", {
                            current: that.current
                        });
                    }
                    if (el.hasClass("prev-year") || el.hasClass("next-year")) {
                        that._fireEvent("year-change", {
                            current: that.current
                        });
                    }
                }, o.ripple ? 300 : 1);
            });

            element.on(Metro.events.click, ".button.today", function(){
                that.toDay();
                that._fireEvent("today", {
                    today: that.today,
                    time: that.time
                });
            });

            element.on(Metro.events.click, ".button.clear", function(){
                that.selected = [];
                that.time = [new Date().getHours(), new Date().getMinutes()];
                that.yearGroupStart = new Date().getFullYear();
                that._drawContent();
                that._fireEvent("clear");
            });

            element.on(Metro.events.click, ".button.cancel", function(){
                that._drawContent();
                that._fireEvent("cancel");
            });

            element.on(Metro.events.click, ".button.done", function(){
                that._drawContent();
                that._fireEvent("done", {
                    selected: that.selected,
                    time: that.time
                });
            });

            if (o.weekDayClick === true) {
                element.on(Metro.events.click, ".week-days .day", function (e) {
                    var day, index, days;

                    day = $(this);
                    index = day.index();

                    if (o.multiSelect === true) {
                        days = o.outside === true ? element.find(".days-row .day:nth-child(" + (index + 1) + ")") : element.find(".days-row .day:not(.outside):nth-child(" + (index + 1) + ")");
                        $.each(days, function () {
                            var d = $(this);
                            var dd = d.data('day');

                            if (d.hasClass("disabled") || d.hasClass("excluded")) return;

                            if (!that.selected.contains(dd))
                                that.selected.push(dd);
                            d.addClass("selected").addClass(o.clsSelected);
                        });
                    }

                    that._fireEvent("week-day-click", {
                        selected: that.selected,
                        day: day
                    });

                    e.preventDefault();
                    e.stopPropagation();
                });
            }

            if (o.weekNumberClick) {
                element.on(Metro.events.click, ".days-row .week-number", function (e) {
                    var weekNumElement, weekNumber, days;

                    weekNumElement = $(this);
                    weekNumber = weekNumElement.text();

                    if (o.multiSelect === true) {
                        days = $(this).siblings(".day");
                        $.each(days, function () {
                            var d = $(this);
                            var dd = d.data('day');

                            if (d.hasClass("disabled") || d.hasClass("excluded")) return;

                            if (!that.selected.contains(dd))
                                that.selected.push(dd);
                            d.addClass("selected").addClass(o.clsSelected);
                        });
                    }

                    that._fireEvent("week-number-click", {
                        selected: that.selected,
                        num: weekNumber,
                        numElement: weekNumElement
                    });

                    e.preventDefault();
                    e.stopPropagation();
                });
            }

            element.on(Metro.events.click, ".days-row .day", function(e){
                var day = $(this);
                var index, date;

                date = day.data('day');
                index = that.selected.indexOf(date);

                if (day.hasClass("outside")) {
                    date = new Date(date);
                    that.current = {
                        year: date.getFullYear(),
                        month: date.getMonth(),
                        day: date.getDate()
                    };
                    that._drawContent();

                    that._fireEvent("month-change", {
                        current: that.current
                    });

                    return ;
                }

                if (!day.hasClass("disabled")) {

                    if (o.pickerMode === true) {
                        that.selected = [date];
                        that.today = new Date(date);
                        that.current.year = that.today.getFullYear();
                        that.current.month = that.today.getMonth();
                        that.current.day = that.today.getDate();
                        that._drawHeader();
                        that._drawContent();
                    } else {
                        if (index === -1) {
                            if (o.multiSelect === false) {
                                element.find(".days-row .day").removeClass("selected").removeClass(o.clsSelected);
                                that.selected = [];
                            }
                            that.selected.push(date);
                            day.addClass("selected").addClass(o.clsSelected);
                        } else {
                            day.removeClass("selected").removeClass(o.clsSelected);
                            Utils.arrayDelete(that.selected, date);
                        }
                    }

                }

                that._fireEvent("day-click", {
                    selected: that.selected,
                    day: day,
                    time: that.time
                });

                e.preventDefault();
                e.stopPropagation();
            });

            element.on(Metro.events.click, ".curr-month", function(e){
                that.content = "months";
                that._drawContent();

                e.preventDefault();
                e.stopPropagation();
            });

            element.on(Metro.events.click, ".month", function(e){
                that.current.month = parseInt($(this).attr("data-month"));
                that.content = "days";
                that._drawContent();

                that._fireEvent("month-change", {
                    current: that.current
                });

                e.preventDefault();
                e.stopPropagation();
            });

            element.on(Metro.events.click, ".curr-year", function(e){
                if (that.content === "years") {
                    return ;
                }
                that.content = "years";
                that._drawContent();

                e.preventDefault();
                e.stopPropagation();
            });

            element.on(Metro.events.click, ".year", function(e){
                that.current.year = parseInt($(this).attr("data-year"));
                that.yearGroupStart = that.current.year;
                that.content = "months";
                that._drawContent();

                that._fireEvent("year-change", {
                    current: that.current
                });

                e.preventDefault();
                e.stopPropagation();
            });
        },

        _drawHeader: function(){
            var element = this.element, o = this.options;
            var header = element.find(".calendar-header");

            if (header.length === 0) {
                header = $("<div>").addClass("calendar-header").addClass(o.clsCalendarHeader).appendTo(element);
            }

            header.html("");

            $("<div>").addClass("header-year").html(this.today.getFullYear()).appendTo(header);
            $("<div>").addClass("header-day").html(this.today.format(o.headerFormat, o.locale)).appendTo(header);

            if (o.showHeader === false) {
                header.hide();
            }
        },

        _drawFooter: function(){
            var element = this.element, o = this.options;
            var buttons_locale = this.locale['buttons'];
            var footer = element.find(".calendar-footer");

            if (o.buttons === false) {
                return ;
            }

            if (footer.length === 0) {
                footer = $("<div>").addClass("calendar-footer").addClass(o.clsCalendarFooter).appendTo(element);
            }

            footer.html("");

            $.each(o.buttons, function(){
                var button = $("<button>").attr("type", "button").addClass("button " + this + " " + o['cls'+this.capitalize()+'Button']).html(buttons_locale[this]).appendTo(footer);
                if (this === 'cancel' || this === 'done') {
                    button.addClass("js-dialog-close");
                }
            });

            if (o.showFooter === false) {
                footer.hide();
            }
        },

        _drawTime: function(){
            var that = this, element = this.element, o = this.options;
            var calendarContent = element.find(".calendar-content");
            var time = $("<div>").addClass("calendar-time").addClass(o.clsCalendarTime).appendTo(calendarContent);
            var inner, hours, minutes, row;
            var h = ""+this.time[0];
            var m = ""+this.time[1];
            var locale = this.locale['calendar']['time'];

            var onChange = function(val){
                var value = parseInt(val);
                if ($(this).attr("data-time-part") === "hours") {
                    that.time[0] = value;
                    that._fireEvent("hours-change", {
                        time: that.time,
                        hours: value
                    });
                } else {
                    that.time[1] = value;
                    that._fireEvent("minutes-change", {
                        time: that.time,
                        minutes: value
                    });
                }

                that._fireEvent("time-change", {
                    time: that.time
                });
            }

            time.append( inner = $("<div>").addClass("calendar-time__inner") );

            inner.append( row = $("<div>").addClass("calendar-time__inner-row") );
            row.append( $("<div>").addClass("calendar-time__inner-cell").append( $("<span>").html(o.labelTimeHours || locale['hours']) ));
            row.append( $("<div>").addClass("calendar-time__inner-cell").append( $("<span>").html(o.labelTimeMinutes || locale['minutes']) ));

            time.append( inner = $("<div>").addClass("calendar-time__inner spinners").addClass(o.clsTime) );
            inner.append( hours = $("<input type='text' data-cls-spinner-input='"+o.clsTimeHours+"' data-time-part='hours' data-buttons-position='right' data-min-value='0' data-max-value='23'>").addClass("hours").addClass(o.compact ? "input-small" : "input-normal") );
            inner.append( minutes = $("<input type='text' data-cls-spinner-input='"+o.clsTimeMinutes+"' data-time-part='minutes' data-buttons-position='right' data-min-value='0' data-max-value='59'>").addClass("minutes").addClass(o.compact ? "input-small" : "input-normal") );

            h = Utils.lpad(h, "0", 2);
            m = Utils.lpad(m, "0", 2);

            hours.val(h);
            minutes.val(m);

            inner.find("input[type=text]").spinner({
                onChange: onChange,
                clsSpinnerButton: o.clsTimeButton,
                clsSpinnerButtonPlus: o.clsTimeButtonPlus,
                clsSpinnerButtonMinus: o.clsTimeButtonMinus
            });

            if (o.showTime === false) {
                time.hide();
            }
        },

        _drawContentDays: function(){
            var element = this.element, o = this.options;
            var content = element.find(".calendar-content"), toolbar;
            var calendar_locale = this.locale['calendar'];
            var i, j, d, s, counter = 0;
            var first = new Date(this.current.year, this.current.month, 1);
            var first_day, first_time, today = {
                year: this.today.getFullYear(),
                month: this.today.getMonth(),
                day: this.today.getDate(),
                time: this.today.getTime()
            };
            var prev_month_days = (new Date(this.current.year, this.current.month, 0)).getDate();
            var year, month, eventsCount, totalDays = 0;
            var min_time = this.min ? this.min.getTime() : null,
                max_time = this.max ? this.max.getTime() : null,
                show_time= this.show ? this.show.getTime() : null;

            if (content.length === 0) {
                content = $("<div>").addClass("calendar-content").addClass(o.clsCalendarContent).appendTo(element);
            }

            content.html("");

            toolbar = $("<div>").addClass("calendar-toolbar").appendTo(content);

            /**
             * Calendar toolbar
             */
            $("<span>").addClass("prev-month").html(o.prevMonthIcon).appendTo(toolbar);
            $("<span>").addClass("curr-month").html(calendar_locale['months'][this.current.month]).appendTo(toolbar);
            $("<span>").addClass("next-month").html(o.nextMonthIcon).appendTo(toolbar);

            $("<span>").addClass("prev-year").html(o.prevYearIcon).appendTo(toolbar);
            $("<span>").addClass("curr-year").html(this.current.year).appendTo(toolbar);
            $("<span>").addClass("next-year").html(o.nextYearIcon).appendTo(toolbar);

            /**
             * Week days
             */
            var week_days = $("<div>").addClass("week-days").appendTo(content);
            var day_class = "day";

            if (o.showWeekNumber === true) {
                $("<span>").addClass("week-number").html("#").appendTo(week_days);
                day_class += " and-week-number";
            }

            for (i = 0; i < 7; i++) {
                if (o.weekStart === 0) {
                    j = i;
                } else {
                    j = i + 1;
                    if (j === 7) j = 0;
                }
                $("<span>").addClass(day_class).html(calendar_locale["days"][j + 7]).appendTo(week_days);
            }

            /**
             * Calendar days
             */
            var days = $("<div>").addClass("days").appendTo(content);
            var days_row = $("<div>").addClass("days-row").appendTo(days);

            first_day = o.weekStart === 0 ? first.getDay() : (first.getDay() === 0 ? 6 : first.getDay() - 1);

            if (this.current.month - 1 < 0) {
                month = 11;
                year = this.current.year - 1;
            } else {
                month = this.current.month - 1;
                year = this.current.year;
            }

            if (o.showWeekNumber === true) {
                $("<div>").addClass("week-number").html((new Date(year, month, prev_month_days - first_day + 1)).getWeek(o.weekStart)).appendTo(days_row);
            }

            // Days for previous month
            for(i = 0; i < first_day; i++) {
                var v = prev_month_days - first_day + i + 1;
                d = $("<div>").addClass(day_class+" outside").appendTo(days_row);
                totalDays++;
                if (o.animationContent) {
                    d.addClass("to-animate");
                }

                s = new Date(year, month, v);
                s.setHours(0,0,0,0);

                d.data('day', s.getTime());

                if (o.outside === true) {
                    d.html(v);

                    if (this.excludeDay.length > 0) {
                        if (this.excludeDay.indexOf(s.getDay()) > -1) {
                            d.addClass("disabled excluded").addClass(o.clsExcluded);
                        }
                    }

                    this._fireEvent("draw-day", {
                        date: s,
                        day: s.getDate(),
                        month: s.getMonth(),
                        year: s.getFullYear(),
                        cell: d[0]
                    });
                }

                counter++;
            }

            // Days for current month
            first.setHours(0,0,0,0);

            while(first.getMonth() === this.current.month) {
                first_time = first.getTime();

                d = $("<div>").addClass(day_class).html(first.getDate()).appendTo(days_row);

                totalDays++;

                if (o.animationContent) {
                    d.addClass("to-animate");
                }

                if (first.getDate() === today.day && first_time !== today.time && o.showCoincidentalDay) {
                    d.addClass("coincidental");
                }

                d.data('day', first_time);

                if (show_time && show_time === first_time) {
                    d.addClass("showed");
                }

                if (today.time === first_time) {
                    d.addClass("today").addClass(o.clsToday);
                }

                if (this.special.length === 0) {

                    if (this.selected.length && this.selected.indexOf(first_time) !== -1) {
                        d.addClass("selected").addClass(o.clsSelected);
                    }
                    if (this.exclude.length && this.exclude.indexOf(first_time) !== -1) {
                        d.addClass("disabled excluded").addClass(o.clsExcluded);
                    }

                    if (min_time && first_time < min_time) {
                        d.addClass("disabled excluded").addClass(o.clsExcluded);
                    }
                    if (max_time && first_time > max_time) {
                        d.addClass("disabled excluded").addClass(o.clsExcluded);
                    }

                    if (this.excludeDay.length > 0) {
                        if (this.excludeDay.indexOf(first.getDay()) > -1) {
                            d.addClass("disabled excluded").addClass(o.clsExcluded);
                        }
                    }
                } else {

                    if (this.special.length && this.special.indexOf(first_time) === -1) {
                        d.addClass("disabled excluded").addClass(o.clsExcluded);
                    }

                }

                if (this.events.length) {
                    eventsCount = 0;
                    $.each(this.events, function(){
                        if (this === first_time) {
                            eventsCount++;
                        }
                    });

                    if (eventsCount) {
                        d.append( $("<div>").addClass("badge inside").addClass(o.clsEventCounter).html(eventsCount) );
                    }
                }

                this._fireEvent("draw-day", {
                    date: first,
                    day: first.getDate(),
                    month: first.getMonth(),
                    year: first.getFullYear(),
                    cell: d[0]
                });

                counter++;
                if (counter % 7 === 0) {
                    days_row = $("<div>").addClass("days-row").appendTo(days);
                    if (o.showWeekNumber === true) {
                        $("<div>").addClass("week-number").html((new Date(first.getFullYear(), first.getMonth(), first.getDate() + 1)).getWeek(o.weekStart)).appendTo(days_row);
                    }
                }
                first.setDate(first.getDate() + 1);
                first.setHours(0,0,0,0);
            }

            // Days for next month
            //first_day = o.weekStart === 0 ? first.getDay() : (first.getDay() === 0 ? 6 : first.getDay() - 1);

            if (this.current.month + 1 > 11) {
                month = 0;
                year = this.current.year + 1;
            } else {
                month = this.current.month + 1;
                year = this.current.year;
            }

//            if (first_day > 0) for(i = 0; i < 7 - first_day; i++) {
            for(i = 0; i < 42 - totalDays; i++) {
                d = $("<div>").addClass(day_class+" outside").appendTo(days_row);

                if (o.animationContent) {
                    d.addClass("to-animate");
                }

                s = new Date(year, month, i + 1);
                s.setHours(0,0,0,0);
                d.data('day', s.getTime());
                if (o.outside === true) {
                    d.html(i + 1);

                    if (this.excludeDay.length > 0) {
                        if (this.excludeDay.indexOf(s.getDay()) > -1) {
                            d.addClass("disabled excluded").addClass(o.clsExcluded);
                        }
                    }

                    this._fireEvent("draw-day", {
                        date: s,
                        day: s.getDate(),
                        month: s.getMonth(),
                        year: s.getFullYear(),
                        cell: d[0]
                    });

                }

                counter++;
                if (counter % 7 === 0) {
                    days_row = $("<div>").addClass("days-row").appendTo(days);
                    if (o.showWeekNumber === true) {
                        $("<div>").addClass("week-number").html((new Date(first.getFullYear(), first.getMonth(), first.getDate() + 1)).getWeek(o.weekStart)).appendTo(days_row);
                    }
                }

            }

            this._drawTime();
            this._animateContent(".days .day");
        },

        _drawContentMonths: function(){
            var element = this.element, o = this.options;
            var content = element.find(".calendar-content");
            var locale = this.locale['calendar']['months'];
            var toolbar, months, month, yearToday = new Date().getFullYear(), monthToday = new Date().getMonth();

            if (content.length === 0) {
                content = $("<div>").addClass("calendar-content").addClass(o.clsCalendarContent).appendTo(element);
            }

            content.clear();

            toolbar = $("<div>").addClass("calendar-toolbar").appendTo(content);

            /**
             * Calendar toolbar
             */

            $("<span>").addClass("prev-year").html(o.prevYearIcon).appendTo(toolbar);
            $("<span>").addClass("curr-year").html(this.current.year).appendTo(toolbar);
            $("<span>").addClass("next-year").html(o.nextYearIcon).appendTo(toolbar);

            content.append( months = $("<div>").addClass("months") );

            for(var i = 12; i < 24; i++) {
                months.append(
                    month = $("<div>")
                        .attr("data-month", i - 12)
                        .addClass("month")
                        .addClass(i - 12 === monthToday && this.current.year === yearToday ? "today" : "")
                        .html(locale[i])
                );

                if (o.animationContent) {
                    month.addClass("to-animate");
                }

                this._fireEvent("draw-month", {
                    month: i - 12,
                    year: this.current.year,
                    cell: month[0]
                });
            }

            this._animateContent(".months .month");
        },

        _drawContentYears: function(){
            var element = this.element, o = this.options;
            var content = element.find(".calendar-content");
            var toolbar, years, year;

            if (content.length === 0) {
                content = $("<div>").addClass("calendar-content").addClass(o.clsCalendarContent).appendTo(element);
            }

            content.clear();

            toolbar = $("<div>").addClass("calendar-toolbar").appendTo(content);

            /**
             * Calendar toolbar
             */

            $("<span>").addClass("prev-year-group").html(o.prevYearIcon).appendTo(toolbar);
            $("<span>").addClass("curr-year").html(this.yearGroupStart + " - " + (this.yearGroupStart + this.yearDistance)).appendTo(toolbar);
            $("<span>").addClass("next-year-group").html(o.nextYearIcon).appendTo(toolbar);

            content.append( years = $("<div>").addClass("years") );

            for(var i = this.yearGroupStart; i <= this.yearGroupStart + this.yearDistance; i++) {
                years.append(
                    year = $("<div>")
                        .attr("data-year", i)
                        .addClass("year")
                        .addClass(i === this.current.year ? "today" : "")
                        .html(i)
                );

                if (o.animationContent) {
                    year.addClass("to-animate");
                }

                if (i < o.minYear || i > o.maxYear) {
                    year.addClass("disabled");
                }

                this._fireEvent("draw-year", {
                    year: i,
                    cell: year[0]
                });
            }

            this._animateContent(".years .year");
        },

        _drawContent: function(){
            switch (this.content) {
                case "years": this._drawContentYears(); break;
                case "months": this._drawContentMonths(); break;
                default: this._drawContentDays();
            }
        },

        _drawCalendar: function(){
            var that = this;
            setTimeout(function(){
                that.element.html("");
                that._drawHeader();
                that._drawContent();
                that._drawFooter();
            }, 0);
        },

        _animateContent: function(target, cls){
            var element = this.element, o = this.options;
            var content = element.find(".calendar-content");

            cls = cls || "to-animate";

            content.find(target).each(function(k){
                var day = $(this);
                setTimeout(function(){
                    day.removeClass(cls);
                }, o.animationSpeed * k);
            });
        },

        getTime: function(asString){
            var h, m;

            asString = asString || false;

            h = (""+this.time[0]).length < 2 ? "0"+this.time[0] : this.time[0];
            m = (""+this.time[1]).length < 2 ? "0"+this.time[1] : this.time[1];

            return asString ? h +":"+ m : this.time;
        },

        setTime: function(time){
            if (Array.isArray(time)) {
                this.time = time;
            } else {
                this.time = time.split(":");
            }
            this._drawCalendar();
        },

        getPreset: function(){
            return this.preset;
        },

        getSelected: function(){
            return this.selected;
        },

        getExcluded: function(){
            return this.exclude;
        },

        getToday: function(){
            return this.today;
        },

        getCurrent: function(){
            return this.current;
        },

        clearSelected: function(){
            this.selected = [];
            this._drawContent();
        },

        toDay: function(){
            this.today = new Date();
            this.today.setHours(0,0,0,0);
            this.current = {
                year: this.today.getFullYear(),
                month: this.today.getMonth(),
                day: this.today.getDate()
            };
            this.time = [new Date().getHours(), new Date().getMinutes()];
            this.yearGroupStart = new Date().getFullYear();
            this.content = "days";
            this._drawHeader();
            this._drawContent();
        },

        setExclude: function(exclude){
            var element = this.element, o = this.options;
            if (Utils.isNull(exclude) && Utils.isNull(element.attr("data-exclude"))) {
                return ;
            }
            o.exclude = !Utils.isNull(exclude) ? exclude : element.attr("data-exclude");
            this._dates2array(o.exclude, 'exclude');
            this._drawContent();
        },

        setPreset: function(preset){
            var element = this.element, o = this.options;
            if (Utils.isNull(preset) && Utils.isNull(element.attr("data-preset"))) {
                return ;
            }

            o.preset = !Utils.isNull(preset) ? preset : element.attr("data-preset");
            this._dates2array(o.preset, 'selected');
            this._drawContent();
        },

        setSpecial: function(special){
            var element = this.element, o = this.options;
            if (Utils.isNull(special) && Utils.isNull(element.attr("data-special"))) {
                return ;
            }
            o.special = !Utils.isNull(special) ? special : element.attr("data-special");
            this._dates2array(o.exclude, 'special');
            this._drawContent();
        },

        setShow: function(show){
            var element = this.element, o = this.options;

            if (Utils.isNull(show) && Utils.isNull(element.attr("data-show"))) {
                return ;
            }
            o.show = !Utils.isNull(show) ? show : element.attr("data-show");

            this.show = Utils.isDateObject(show) ? show : Utils.isValue(o.inputFormat) ? o.show.toDate(o.inputFormat) : new Date(o.show);
            this.show.setHours(0,0,0,0);
            this.current = {
                year: this.show.getFullYear(),
                month: this.show.getMonth(),
                day: this.show.getDate()
            };

            this._drawContent();
        },

        setMinDate: function(date){
            var element = this.element, o = this.options;

            o.minDate = Utils.isValue(date) ? date : element.attr("data-min-date");
            if (Utils.isValue(o.minDate) && Utils.isDate(o.minDate, o.inputFormat)) {
                this.min = Utils.isValue(o.inputFormat) ? o.minDate.toDate(o.inputFormat) : (new Date(o.minDate));
            }

            this._drawContent();
        },

        setMaxDate: function(date){
            var element = this.element, o = this.options;

            o.maxDate = Utils.isValue(date) ? date : element.attr("data-max-date");
            if (Utils.isValue(o.maxDate) && Utils.isDate(o.maxDate, o.inputFormat)) {
                this.max = Utils.isValue(o.inputFormat) ? o.maxDate.toDate(o.inputFormat) : (new Date(o.maxDate));
            }

            this._drawContent();
        },

        setToday: function(val){
            var o = this.options;

            if (!Utils.isValue(val)) {
                val = new Date();
            }
            this.today = Utils.isDateObject(val) ? val : Utils.isValue(o.inputFormat) ? val.toDate(o.inputFormat) : new Date(val);
            this.today.setHours(0,0,0,0);
            this._drawHeader();
            this._drawContent();
        },

        i18n: function(val){
            var o = this.options;
            if (val === undefined) {
                return o.locale;
            }
            if (Metro.locales[val] === undefined) {
                return false;
            }
            o.locale = val;
            this.locale = Metro.locales[o.locale];
            this._drawCalendar();
        },

        changeAttrLocale: function(){
            var element = this.element;
            this.i18n(element.attr("data-locale"));
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case 'data-exclude': this.setExclude(); break;
                case 'data-preset': this.setPreset(); break;
                case 'data-special': this.setSpecial(); break;
                case 'data-show': this.setShow(); break;
                case 'data-min-date': this.setMinDate(); break;
                case 'data-max-date': this.setMaxDate(); break;
                case 'data-locale': this.changeAttrLocale(); break;
            }
        },

        destroy: function(){
            var element = this.element, o = this.options;

            element.off(Metro.events.click, ".prev-month, .next-month, .prev-year, .next-year");
            element.off(Metro.events.click, ".button.today");
            element.off(Metro.events.click, ".button.clear");
            element.off(Metro.events.click, ".button.cancel");
            element.off(Metro.events.click, ".button.done");
            element.off(Metro.events.click, ".week-days .day");
            element.off(Metro.events.click, ".days-row .day");
            element.off(Metro.events.click, ".curr-month");
            element.off(Metro.events.click, ".calendar-months li");
            element.off(Metro.events.click, ".curr-year");
            element.off(Metro.events.click, ".calendar-years li");
            element.off(Metro.events.click);

            if (o.ripple === true) {
                element.data("ripple").destroy();
            }

            $(window).off(Metro.events.resize, {ns: this.id});

            return element;
        }
    });

    $(document).on(Metro.events.click, function(){
        $('.calendar .calendar-years').each(function(){
            $(this).removeClass("open");
        });
        $('.calendar .calendar-months').each(function(){
            $(this).removeClass("open");
        });
    });
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var AudioButtonDefaultConfig = {
        audioVolume: 0.5,
        audioSrc: "",
        onAudioStart: Metro.noop,
        onAudioEnd: Metro.noop,
        onAudioButtonCreate: Metro.noop
    };

    Metro.audioButtonSetup = function (options) {
        AudioButtonDefaultConfig = $.extend({}, AudioButtonDefaultConfig, options);
    };

    if (typeof window["metroAudioButtonSetup"] !== undefined) {
        Metro.audioButtonSetup(window["metroAudioButtonSetup"]);
    }

    Metro.Component('audio-button', {
        init: function( options, elem ) {

            this._super(elem, options, AudioButtonDefaultConfig, {
                audio: null,
                canPlay: null,
                id: Utils.elementId("audioButton")
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent('audioButtonCreate', {
                element: element
            });
        },

        _createStructure: function(){
            var o = this.options;
            this.audio = new Audio(o.audioSrc);
            this.audio.volume = o.audioVolume;
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var audio = this.audio;

            audio.addEventListener('loadeddata', function(){
                that.canPlay = true;
            });

            audio.addEventListener('ended', function(){
                that._fireEvent("audioEnd", {
                    src: o.audioSrc,
                    audio: audio
                });
            })

            element.on(Metro.events.click, function(){
                that.play();
            }, {ns: this.id});
        },

        play: function(cb){
            var element = this.element, o = this.options;
            var audio = this.audio;

            if (o.audioSrc !== "" && this.audio.duration && this.canPlay) {

                this._fireEvent("audioStart", {
                    src: o.audioSrc,
                    audio: audio
                });

                audio.pause();
                audio.currentTime = 0;
                audio.play();

                Utils.exec(cb, [audio], element[0]);
            }
        },

        stop: function(cb){
            var element = this.element, o = this.options;
            var audio = this.audio;

            audio.pause();
            audio.currentTime = 0;

            this._fireEvent("audioEnd", {
                src: o.audioSrc,
                audio: audio
            });

            Utils.exec(cb, [audio], element[0]);
        },

        changeAttribute: function(attributeName){
            var element = this.element, o = this.options;
            var audio = this.audio;

            var changeSrc = function(){
                var src = element.attr('data-audio-src');
                if (src && src.trim() !== "") {
                    o.audioSrc = src;
                    audio.src = src;
                }
            }

            var changeVolume = function(){
                var volume = parseFloat(element.attr('data-audio-volume'));
                if (isNaN(volume)) {
                    return ;
                }
                o.audioVolume = volume;
                audio.volume = volume;
            }

            if (attributeName === 'data-audio-src') {
                changeSrc();
            }

            if (attributeName === 'data-audio-volume') {
                changeVolume();
            }
        },

        destroy: function(){
            var element = this.element;

            element.off(Metro.events.click, {ns: this.id});
        }
    });

    Metro["playSound"] = function(data){
        var audio;
        var src = typeof data === "string" ? data : data.audioSrc;
        var volume = data && data.audioVolume ? data.audioVolume : 0.5;

        if (!src) {
            return;
        }

        audio = new Audio(src);
        audio.volume = parseFloat(volume);

        audio.addEventListener('loadeddata', function(){
            if (data && data.onAudioStart)
                Utils.exec(data.onAudioStart, [src], this);
            this.play();
        });

        audio.addEventListener('ended', function(){
            if (data && data.onAudioEnd)
                Utils.exec(data.onAudioEnd, [null], this);
        });
    };
}(Metro, m4q));


/* global Metro */
(function(Metro, $) {
    'use strict';

    var Utils = Metro.utils;
    var AppBarDefaultConfig = {
        appbarDeferred: 0,
        expand: false,
        expandPoint: null,
        duration: 100,
        onMenuOpen: Metro.noop,
        onMenuClose: Metro.noop,
        onBeforeMenuOpen: Metro.noop,
        onBeforeMenuClose: Metro.noop,
        onMenuCollapse: Metro.noop,
        onMenuExpand: Metro.noop,
        onAppBarCreate: Metro.noop
    };

    Metro.appBarSetup = function (options) {
        AppBarDefaultConfig = $.extend({}, AppBarDefaultConfig, options);
    };

    if (typeof window["metroAppBarSetup"] !== undefined) {
        Metro.appBarSetup(window["metroAppBarSetup"]);
    }

    Metro.Component('app-bar', {
        init: function (options, elem) {
            this._super(elem, options, AppBarDefaultConfig, {
                id: Utils.elementId('app-bar')
            });

            return this;
        },

        _create: function () {
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("app-bar-create", {
                element: element
            })
        },

        _createStructure: function () {
            var element = this.element, o = this.options;
            var hamburger, menu, elementColor = Utils.getStyleOne(element, "background-color");

            element.addClass("app-bar");

            hamburger = element.find(".hamburger");
            if (hamburger.length === 0) {
                hamburger = $("<button>").attr("type", "button").addClass("hamburger menu-down");
                for (var i = 0; i < 3; i++) {
                    $("<span>").addClass("line").appendTo(hamburger);
                }

                if (elementColor === "rgba(0, 0, 0, 0)" || Metro.colors.isLight(elementColor) === true) {
                    hamburger.addClass("dark");
                }
            }

            element.prepend(hamburger);
            menu = element.find(".app-bar-menu");

            if (menu.length === 0) {
                hamburger.css("display", "none");
            } else {
                Utils.addCssRule(Metro.sheet, ".app-bar-menu li", "list-style: none!important;"); // This special for IE11 and Edge
            }

            if (hamburger.css('display') === 'block') {
                menu.hide().addClass("collapsed");
                hamburger.removeClass("hidden");
            } else {
                hamburger.addClass("hidden");
            }

            if (o.expand === true) {
                element.addClass("app-bar-expand");
                hamburger.addClass("hidden");
            } else {
                if (Utils.isValue(o.expandPoint) && Utils.mediaExist(o.expandPoint)) {
                    element.addClass("app-bar-expand");
                    hamburger.addClass("hidden");
                }
            }
        },

        _createEvents: function () {
            var that = this, element = this.element, o = this.options;
            var menu = element.find(".app-bar-menu");
            var hamburger = element.find(".hamburger");

            element.on(Metro.events.click, ".hamburger", function () {
                if (menu.length === 0) return;
                var collapsed = menu.hasClass("collapsed");
                if (collapsed) {
                    that.open();
                } else {
                    that.close();
                }
            });

            $(window).on(Metro.events.resize, function () {

                if (o.expand !== true) {
                    if (Utils.isValue(o.expandPoint) && Utils.mediaExist(o.expandPoint)) {
                        element.addClass("app-bar-expand");
                        that._fireEvent("menu-expand");
                    } else {
                        element.removeClass("app-bar-expand");
                        that._fireEvent("menu-collapse");
                    }
                }

                if (menu.length === 0) return;

                if (hamburger.css('display') !== 'block') {
                    menu.show(function () {
                        $(this).removeStyleProperty("display");
                    });
                    hamburger.addClass("hidden");
                } else {
                    hamburger.removeClass("hidden");
                    if (hamburger.hasClass("active")) {
                        menu.show().removeClass("collapsed");
                    } else {
                        menu.hide().addClass("collapsed");
                    }
                }
            }, {ns: this.id});
        },

        close: function () {
            var that = this, element = this.element, o = this.options;
            var menu = element.find(".app-bar-menu");
            var hamburger = element.find(".hamburger");

            that._fireEvent("before-menu-close", {
                menu: menu[0]
            });

            menu.slideUp(o.duration, function () {
                menu.addClass("collapsed").removeClass("opened");
                hamburger.removeClass("active");

                that._fireEvent("menu-close", {
                    menu: menu[0]
                });
            });
        },

        open: function () {
            var that = this, element = this.element, o = this.options;
            var menu = element.find(".app-bar-menu");
            var hamburger = element.find(".hamburger");

            that._fireEvent("before-menu-open", {
                menu: menu[0]
            });

            menu.slideDown(o.duration, function () {
                menu.removeClass("collapsed").addClass("opened");
                hamburger.addClass("active");

                that._fireEvent("menu-open", {
                    menu: menu[0]
                });
            });
        },

        /* eslint-disable-next-line */
        changeAttribute: function (attributeName) {
        },

        destroy: function () {
            var element = this.element;
            element.off(Metro.events.click, ".hamburger");
            $(window).off(Metro.events.resize, {ns: this.id});
            return element;
        }
    });
}(Metro, m4q));


/* global Metro, METRO_ANIMATION_DURATION */
(function(Metro, $) {
    'use strict';
    var AnimationDefaultConfig = {
        duration: METRO_ANIMATION_DURATION,
        ease: "linear"
    }

    Metro.animations = {

        switchIn: function(el){
            $(el)
                .hide()
                .css({
                    left: 0,
                    top: 0
                })
                .show();
        },

        switchOut: function(el){
            $(el).hide();
        },

        switch: function(current, next){
            this.switchOut(current);
            this.switchIn(next);
        },

        slideUpIn: function(el, o){
            var op, $el = $(el);
            var h = $el.parent().outerHeight(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    top: h,
                    left: 0,
                    zIndex: 2
                })
                .animate({
                    draw: {
                        top: 0,
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideUpOut: function(el, o){
            var op, $el = $(el);
            var h = $el.parent().outerHeight(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    zIndex: 1
                })
                .animate({
                    draw: {
                        top: -h,
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideUp: function(current, next, o){
            this.slideUpOut(current, o);
            this.slideUpIn(next, o);
        },

        slideDownIn: function(el, o){
            var op, $el = $(el);
            var h = $el.parent().outerHeight(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    left: 0,
                    top: -h,
                    zIndex: 2
                })
                .animate({
                    draw: {
                        top: 0,
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideDownOut: function(el, o){
            var op, $el = $(el);
            var h = $el.parent().outerHeight(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    zIndex: 1
                })
                .animate({
                    draw: {
                        top: h,
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideDown: function(current, next, o){
            this.slideDownOut(current, o);
            this.slideDownIn(next, o);
        },

        slideLeftIn: function(el, o){
            var op, $el = $(el);
            var w = $el.parent().outerWidth(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    left: w,
                    zIndex: 2
                })
                .animate({
                    draw: {
                        left: 0,
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideLeftOut: function(el, o){
            var op, $el = $(el);
            var w = $el.parent().outerWidth(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    zIndex: 1
                })
                .animate({
                    draw: {
                        left: -w,
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideLeft: function(current, next, o){
            this.slideLeftOut(current, o);
            this.slideLeftIn(next, o);
        },

        slideRightIn: function(el, o){
            var op, $el = $(el);
            var w = $el.parent().outerWidth(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    left: -w,
                    zIndex: 2
                })
                .animate({
                    draw: {
                        left: 0,
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideRightOut: function(el, o){
            var op, $el = $(el);
            var w = $el.parent().outerWidth(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    zIndex: 1
                })
                .animate({
                    draw: {
                        left:  w,
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideRight: function(current, next, o){
            this.slideRightOut(current, o);
            this.slideRightIn(next, o);
        },

        fadeIn: function(el, o){
            var op = $.extend({}, AnimationDefaultConfig, o);
            var $el = $(el);

            $el
                .css({
                    top: 0,
                    left: 0,
                    opacity: 0
                })
                .animate({
                    draw: {
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        fadeOut: function(el, o){
            var op = $.extend({}, AnimationDefaultConfig, o);
            var $el = $(el);

            $el
                .animate({
                    draw: {
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        fade: function(current, next, o){
            this.fadeOut(current, o);
            this.fadeIn(next, o);
        },

        zoomIn: function(el, o){
            var op = $.extend({}, AnimationDefaultConfig, o);
            var $el = $(el);

            $el
                .css({
                    top: 0,
                    left: 0,
                    opacity: 0,
                    transform: "scale(3)",
                    zIndex: 2
                })
                .animate({
                    draw: {
                        scale: 1,
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        zoomOut: function(el, o){
            var op = $.extend({}, AnimationDefaultConfig, o);
            var $el = $(el);

            $el
                .css({
                    zIndex: 1
                })
                .animate({
                    draw: {
                        scale: 3,
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        zoom: function(current, next, o){
            this.zoomOut(current, o);
            this.zoomIn(next, o);
        },

        swirlIn: function(el, o){
            var op = $.extend({}, AnimationDefaultConfig, o);
            var $el = $(el);

            $el
                .css({
                    top: 0,
                    left: 0,
                    opacity: 0,
                    transform: "scale(3) rotate(180deg)",
                    zIndex: 2
                })
                .animate({
                    draw: {
                        scale: 1,
                        rotate: 0,
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        swirlOut: function(el, o){
            var op = $.extend({}, AnimationDefaultConfig, o);
            var $el = $(el);

            $el
                .css({
                    zIndex: 1
                })
                .animate({
                    draw: {
                        scale: 3,
                        rotate: "180deg",
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        swirl: function(current, next, o){
            this.swirlOut(current, o);
            this.swirlIn(next, o);
        }
    };

    if (window.METRO_GLOBAL_COMMON === true) {
        window.Animations = Metro.animations;
    }
}(Metro, m4q));


/*global Metro, METRO_ANIMATION_DURATION */
(function(Metro, $){
    'use strict';
    var Utils = Metro.utils;
    var AccordionDefaultConfig = {
        accordionDeferred: 0,
        showMarker: true,
        material: false,
        duration: METRO_ANIMATION_DURATION,
        oneFrame: true,
        showActive: true,
        activeFrameClass: "",
        activeHeadingClass: "",
        activeContentClass: "",
        onFrameOpen: Metro.noop,
        onFrameBeforeOpen: Metro.noop_true,
        onFrameClose: Metro.noop,
        onFrameBeforeClose: Metro.noop_true,
        onAccordionCreate: Metro.noop
    };

    Metro.accordionSetup = function(options){
        AccordionDefaultConfig = $.extend({}, AccordionDefaultConfig, options);
    };

    if (typeof window["metroAccordionSetup"] !== undefined) {
        Metro.accordionSetup(window["metroAccordionSetup"]);
    }

    Metro.Component('accordion', {
        init: function( options, elem ) {
            this._super(elem, options, AccordionDefaultConfig);
            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent('accordionCreate', {
                element: element
            });
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;
            var frames = element.children(".frame");
            var active = element.children(".frame.active");
            var frame_to_open;

            element.addClass("accordion");

            if (o.showMarker === true) {
                element.addClass("marker-on");
            }

            if (o.material === true) {
                element.addClass("material");
            }

            if (active.length === 0) {
                frame_to_open = frames[0];
            } else {
                frame_to_open = active[0];
            }

            this._hideAll();

            if (o.showActive === true) {
                if (o.oneFrame === true) {
                    this._openFrame(frame_to_open);
                } else {
                    $.each(active, function(){
                        that._openFrame(this);
                    });
                }
            }
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var active = element.children(".frame.active");

            element.on(Metro.events.click, ".heading", function(){
                var heading = $(this);
                var frame = heading.parent();

                if (heading.closest(".accordion")[0] !== element[0]) {
                    return false;
                }

                if (frame.hasClass("active")) {
                    if (active.length === 1 && o.oneFrame) {
                        /* eslint-disable-next-line */

                    } else {
                        that._closeFrame(frame);
                    }
                } else {
                    that._openFrame(frame);
                }
            });
        },

        _openFrame: function(f){
            var element = this.element, o = this.options;
            var frame = $(f);

            if (Utils.exec(o.onFrameBeforeOpen, [frame[0]], element[0]) === false) {
                return false;
            }

            if (o.oneFrame === true) {
                this._closeAll(frame[0]);
            }

            frame.addClass("active " + o.activeFrameClass);
            frame.children(".heading").addClass(o.activeHeadingClass);
            frame.children(".content").addClass(o.activeContentClass).slideDown(o.duration);

            this._fireEvent("frameOpen", {
                frame: frame[0]
            });
        },

        _closeFrame: function(f){
            var element = this.element, o = this.options;
            var frame = $(f);

            if (!frame.hasClass("active")) {
                return ;
            }

            if (Utils.exec(o.onFrameBeforeClose, [frame[0]], element[0]) === false) {
                return ;
            }

            frame.removeClass("active " + o.activeFrameClass);
            frame.children(".heading").removeClass(o.activeHeadingClass);
            frame.children(".content").removeClass(o.activeContentClass).slideUp(o.duration);

            this._fireEvent("frameClose", {
                frame: frame[0]
            });
        },

        _closeAll: function(skip){
            var that = this, element = this.element;
            var frames = element.children(".frame");

            $.each(frames, function(){
                if (skip === this) return;
                that._closeFrame(this);
            });
        },

        _hideAll: function(){
            var element = this.element;
            var frames = element.children(".frame");

            $.each(frames, function(){
                $(this).children(".content").hide();
            });
        },

        _openAll: function(){
            var that = this, element = this.element;
            var frames = element.children(".frame");

            $.each(frames, function(){
                that._openFrame(this);
            });
        },

        /* eslint-disable-next-line */
        changeAttribute: function(attributeName){
        },

        destroy: function(){
            var element = this.element;
            element.off(Metro.events.click, ".heading");
            return element;
        }
    });
}(Metro, m4q));

