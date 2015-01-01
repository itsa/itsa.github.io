require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (css, customDocument) {
  var doc = customDocument || document;
  if (doc.createStyleSheet) {
    var sheet = doc.createStyleSheet()
    sheet.cssText = css;
    return sheet.ownerNode;
  } else {
    var head = doc.getElementsByTagName('head')[0],
        style = doc.createElement('style');

    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(doc.createTextNode(css));
    }

    head.appendChild(style);
    return style;
  }
};

module.exports.byUrl = function(url) {
  if (document.createStyleSheet) {
    return document.createStyleSheet(url).ownerNode;
  } else {
    var head = document.getElementsByTagName('head')[0],
        link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = url;

    head.appendChild(link);
    return link;
  }
};

},{}],2:[function(require,module,exports){
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge]
 * @returns {Object} dest
 */
function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
function merge(dest, src) {
    return extend(dest, src, true);
}

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        extend(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument;
    return (doc.defaultView || doc.parentWindow);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = last.deltaX - input.deltaX;
        var deltaY = last.deltaY - input.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0,
        y = 0,
        i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y > 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.allow = true; // used by Input.TouchMouse to disable mouse events
    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down, and mouse events are allowed (see the TouchMouse input)
        if (!this.pressed || !this.allow) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            store.push(ev);
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // get index of the event in the store
        // it not found, so the pointer hasn't been down (so it's probably a hover)
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    /**
     * handle touch events
     * @param {Object} ev
     */
    handler: function TEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches = toArray(ev.targetTouches),
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [];

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */
function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        // when we're in a touch event, so  block all upcoming mouse events
        // most mobile browser also emit mouseevents, right after touchstart
        if (isTouch) {
            this.mouse.allow = false;
        } else if (isMouse && !this.mouse.allow) {
            return;
        }

        // reset the allowMouse when we're done
        if (inputEvent & (INPUT_END | INPUT_CANCEL)) {
            this.mouse.allow = true;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        // not needed with native support for the touchAction property
        if (NATIVE_TOUCH_ACTION) {
            return;
        }

        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // pan-x and pan-y can be combined
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_PAN_X + ' ' + TOUCH_ACTION_PAN_Y;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.id = uniqueId();

    this.manager = null;
    this.options = merge(options || {}, this.defaults);

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        extend(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(withState) {
            self.manager.emit(self.options.event + (withState ? stateStr(state) : ''), input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(true);
        }

        emit(); // simple 'eventName' events

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(true);
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = extend({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {
        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        this._super.emit.call(this, input);
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            this.manager.emit(this.options.event + inOut, input);
        }
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 500, // minimal time of the pointer to be pressed
        threshold: 5 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.65,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.velocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.velocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.velocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.direction &&
            input.distance > this.options.threshold &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 2, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED ) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create an manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.3';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, { enable: false }],
        [PinchRecognizer, { enable: false }, ['rotate']],
        [SwipeRecognizer,{ direction: DIRECTION_HORIZONTAL }],
        [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    options = options || {};

    this.options = merge(options, Hammer.defaults);
    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        extend(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        var recognizers = this.recognizers;
        recognizer = this.get(recognizer);
        recognizers.splice(inArray(recognizers, recognizer), 1);

        this.touchAction.update();
        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    each(manager.options.cssProps, function(value, name) {
        element.style[prefixed(element.style, name)] = add ? value : '';
    });
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

extend(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

if (typeof define == TYPE_FUNCTION && define.amd) {
    define(function() {
        return Hammer;
    });
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');

},{}],3:[function(require,module,exports){
function DOMParser(options){
	this.options = options ||{locator:{}};
	
}
DOMParser.prototype.parseFromString = function(source,mimeType){	
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var entityMap = {'lt':'<','gt':'>','amp':'&','quot':'"','apos':"'"}
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}
	
	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(/\/x?html?$/.test(mimeType)){
		entityMap.nbsp = '\xa0';
		entityMap.copy = '\xa9';
		defaultNSMap['']= 'http://www.w3.org/1999/xhtml';
	}
	if(source){
		sax.parse(source,defaultNSMap,entityMap);
	}else{
		sax.errorHandler.error("invalid document source");
	}
	return domBuilder.document;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn){
			if(isCallback){
				fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
			}else{
				var i=arguments.length;
				while(--i){
					if(fn = errorImpl[arguments[i]]){
						break;
					}
				}
			}
		}
		errorHandler[key] = fn && function(msg){
			fn(msg+_locator(locator));
		}||function(){};
	}
	build('warning','warn');
	build('error','warn','warning');
	build('fatalError','warn','warning','error');
	return errorHandler;
}
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler 
 * 
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */ 
DOMHandler.prototype = {
	startDocument : function() {
    	this.document = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.document.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.document;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;
	    
		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			if( attr.getOffset){
				position(attr.getOffset(1),attr)
			}
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
	    var tagName = current.tagName;
	    this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.document.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(this.currentElement && chars){
			if (this.cdata) {
				var charNode = this.document.createCDATASection(chars);
				this.currentElement.appendChild(charNode);
			} else {
				var charNode = this.document.createTextNode(chars);
				this.currentElement.appendChild(charNode);
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.document.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.document.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},
	
	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},
	
	startDTD:function(name, publicId, systemId) {
		var impl = this.document.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn(error,_locator(this.locator));
	},
	error:function(error) {
		console.error(error,_locator(this.locator));
	},
	fatalError:function(error) {
		console.error(error,_locator(this.locator));
	    throw error;
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.document.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

if(typeof require == 'function'){
	var XMLReader = require('./sax').XMLReader;
	var DOMImplementation = exports.DOMImplementation = require('./dom').DOMImplementation;
	exports.XMLSerializer = require('./dom').XMLSerializer ;
	exports.DOMParser = DOMParser;
}

},{"./dom":4,"./sax":5}],4:[function(require,module,exports){
/*
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 */

function copy(src,dest){
	for(var p in src){
		dest[p] = src[p];
	}
}
/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(Object.create){
		var ppt = Object.create(Super.prototype)
		pt.__proto__ = ppt;
	}
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknow Class:"+Class)
		}
		pt.constructor = Class
	}
}
var htmlns = 'http://www.w3.org/1999/xhtml' ;
// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);


function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0, 
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long 
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
	 */
	item: function(index) {
		return this[index] || null;
	}
};
function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
}

_extends(LiveNodeList,NodeList);
/**
 * 
 * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw DOMException(NOT_FOUND_ERR,new Error())
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		var i = this.length;
		while(i--){
			var attr = this[i];
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
		
		
	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
	
	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};
/**
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
 */
function DOMImplementation(/* Object */ features) {
	this._features = {};
	if (features) {
		for (var feature in features) {
			 this._features = features[feature];
		}
	}
};

DOMImplementation.prototype = {
	hasFeature: function(/* string */ feature, /* string */ version) {
		var versions = this._features[feature.toLowerCase()];
		if (versions && (!version || version in versions)) {
			return true;
		} else {
			return false;
		}
	},
	// Introduced in DOM Level 2:
	createDocument:function(namespaceURI,  qualifiedName, doctype){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
		var doc = new Document();
		doc.doctype = doctype;
		if(doctype){
			doc.appendChild(doctype);
		}
		doc.implementation = this;
		doc.childNodes = new NodeList();
		if(qualifiedName){
			var root = doc.createElementNS(namespaceURI,qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	// Introduced in DOM Level 2:
	createDocumentType:function(qualifiedName, publicId, systemId){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId;
		node.systemId = systemId;
		// Introduced in DOM Level 2:
		//readonly attribute DOMString        internalSubset;
		
		//TODO:..
		//  readonly attribute NamedNodeMap     entities;
		//  readonly attribute NamedNodeMap     notations;
		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises 
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises 
		this.insertBefore(newChild,oldChild);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
    				if(map[n] == namespaceURI){
    					return n;
    				}
    			}
    		}
    		el = el.nodeType == 2?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(prefix in map){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == 2?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
}
function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}
function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}
function _onUpdateChild(doc,el,newChild){
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if(newChild){
			cs[cs.length++] = newChild;
		}else{
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while(child){
				cs[i++] = child;
				child =child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode,child){
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if(previous){
		previous.nextSibling = next;
	}else{
		parentNode.firstChild = next
	}
	if(next){
		next.previousSibling = previous;
	}else{
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument,parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode,newChild,nextChild){
	var cp = newChild.parentNode;
	if(cp){
		cp.removeChild(newChild);//remove and update
	}
	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	}else{
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;
	
	
	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parentNode.firstChild = newFirst;
	}
	if(nextChild == null){
		parentNode.lastChild = newLast;
	}else{
		nextChild.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parentNode;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode,newChild){
	var cp = newChild.parentNode;
	if(cp){
		var pre = parentNode.lastChild;
		cp.removeChild(newChild);//remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if(pre){
		pre.nextSibling = newChild;
	}else{
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	doctype :  null,
	documentElement :  null,
	_inc : 1,
	
	insertBefore :  function(newChild, refChild){//raises 
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		if(this.documentElement == null && newChild.nodeType == 1){
			this.documentElement = newChild;
		}
		
		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == 1){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},
	
	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},
	
	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},
	
	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},
	
	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && node.namespaceURI === namespaceURI && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);
	
	},
	appendChild:function(newChild){
		//if(!(newChild instanceof CharacterData)){
			throw new Error(ExceptionMessage[3])
		//}
		return Node.prototype.appendChild.apply(this,arguments)
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node){
	var buf = [];
	serializeToString(node,buf);
	return buf.join('');
}
Node.prototype.toString =function(){
	return XMLSerializer.prototype.serializeToString(this);
}
function serializeToString(node,buf){
	switch(node.nodeType){
	case ELEMENT_NODE:
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		var isHTML = htmlns === node.namespaceURI
		buf.push('<',nodeName);
		for(var i=0;i<len;i++){
			serializeToString(attrs.item(i),buf,isHTML);
		}
		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				if(child){
					buf.push(child.data);
				}
			}else{
				while(child){
					serializeToString(child,buf);
					child = child.nextSibling;
				}
			}
			buf.push('</',nodeName,'>');
		}else{
			buf.push('/>');
		}
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child,buf);
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return buf.push(' ',node.name,'="',node.value.replace(/[<&"]/g,_xmlEncoder),'"');
	case TEXT_NODE:
		return buf.push(node.data.replace(/[<&]/g,_xmlEncoder));
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC "',pubid);
			if (sysid && sysid!='.') {
				buf.push( '" "',sysid);
			}
			buf.push('">');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM "',sysid,'">');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for(var n in node){
		var v = node[n];
		if(typeof v != 'object' ){
			if(v != node2[n]){
				node2[n] = v;
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});
		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},
			set:function(data){
				switch(this.nodeType){
				case 1:
				case 11:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;
				default:
					//TODO:
					this.data = data;
					this.value = value;
					this.nodeValue = data;
				}
			}
		})
		
		function getTextContent(node){
			switch(node.nodeType){
			case 1:
			case 11:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}
		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

if(typeof require == 'function'){
	exports.DOMImplementation = DOMImplementation;
	exports.XMLSerializer = XMLSerializer;
}

},{}],5:[function(require,module,exports){
//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\u00B7\u0300-\u036F\\ux203F-\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_V
//S_ATTR_S,	S_E,	S_S,	S_C
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring
var S_ATTR_S=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_V = 4;//attr value(no quot value only)
var S_E = 5;//attr value end and no space(quot end)
var S_S = 6;//(attr value end || tag end ) && (space offer)
var S_C = 7;//closed el<el />

function XMLReader(){

}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
  function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if(k in entityMap){
			return entityMap[k];
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
		locator&&position(start);
		domBuilder.characters(xt,0,end-start);
		start = end
	}
	function position(start,m){
		while(start>=endPos && (m = linePattern.exec(source))){
			startPos = m.index;
			endPos = startPos + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = start-startPos+1;
	}
	var startPos = 0;
	var endPos = 0;
	var linePattern = /.+(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;

	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		var i = source.indexOf('<',start);
		if(i<0){
			if(!source.substr(start).match(/^\s*$/)){
				var doc = domBuilder.document;
    			var text = doc.createTextNode(source.substr(start));
    			doc.appendChild(text);
    			domBuilder.currentElement = text;
			}
			return;
		}
		if(i>start){
			appendText(i);
		}
		switch(source.charAt(i+1)){
		case '/':
			var end = source.indexOf('>',i+3);
			var tagName = source.substring(i+2,end);
			var config = parseStack.pop();
			var localNSMap = config.localNSMap;

	        if(config.tagName != tagName){
	            errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName );
	        }
			domBuilder.endElement(config.uri,config.localName,tagName);
			if(localNSMap){
				for(var prefix in localNSMap){
					domBuilder.endPrefixMapping(prefix) ;
				}
			}
			end++;
			break;
			// end elment
		case '?':// <?...?>
			locator&&position(i);
			end = parseInstruction(source,i,domBuilder);
			break;
		case '!':// <!doctype,<![CDATA,<!--
			locator&&position(i);
			end = parseDCC(source,i,domBuilder,errorHandler);
			break;
		default:
			try{
				locator&&position(i);

				var el = new ElementAttributes();

				//elStartEnd
				var end = parseElementStartPart(source,i,el,entityReplacer,errorHandler);
				var len = el.length;
				//position fixed
				if(len && locator){
					var backup = copyLocator(locator,{});
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.offset = copyLocator(locator,{});
					}
					copyLocator(backup,locator);
				}
				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				appendElement(el,domBuilder,parseStack);


				if(el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed){
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				}else{
					end++;
				}
			}catch(e){
				errorHandler.error('element parse error: '+e);
				end = -1;
			}

		}
		if(end<0){
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(i+1);
		}else{
			start = end;
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;

}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,entityReplacer,errorHandler){
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_S){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName');
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ){//equal
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					el.add(attrName,value,start-1);
					s = S_E;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_V){
				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
				//console.log(attrName,value,start,p)
				el.add(attrName,value,start);
				//console.dir(el)
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_E
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="');
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_E:
			case S_S:
			case S_C:
				s = S_C;
				el.closed = true;
			case S_V:
			case S_ATTR:
			case S_ATTR_S:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')")
			}
			break;
		case ''://end document
			//throw new Error('unexpected end of input')
			errorHandler.error('unexpected end of input');
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_E:
			case S_S:
			case S_C:
				break;//normal
			case S_V://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_S:
				if(s === S_ATTR_S){
					value = attrName;
				}
				if(s == S_V){
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value.replace(/&#?\w+;/g,entityReplacer),start)
				}else{
					errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					el.add(value,value,start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_S;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_S;
					break;
				case S_V:
					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value,start)
				case S_E:
					s = S_S;
					break;
				//case S_S:
				//case S_EQ:
				//case S_ATTR_S:
				//	void();break;
				//case S_C:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_V
//S_ATTR_S,	S_E,	S_S,	S_C
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_V:void();break;
				case S_ATTR_S:
					errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead!!')
					el.add(attrName,attrName,start);
					start = p;
					s = S_ATTR;
					break;
				case S_E:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_S:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_V;
					start = p;
					break;
				case S_C:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}
		p++;
	}
}
/**
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function appendElement(el,domBuilder,parseStack){
	var tagName = el.tagName;
	var localNSMap = null;
	var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = 'http://www.w3.org/2000/xmlns/'
			domBuilder.startPrefixMapping(nsPrefix, value)
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = 'http://www.w3.org/XML/1998/namespace';
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix]

				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for(prefix in localNSMap){
				domBuilder.endPrefixMapping(prefix)
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		parseStack.push(el);
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}

		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos = closeMap[tagName] = source.lastIndexOf('</'+tagName+'>')
	}
	return pos<elStartEnd;
	//}
}
function _copy(source,target){
	for(var n in source){target[n] = source[n]}
}
function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA()
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId)
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = len>3 && /^public$/i.test(matchs[2][0]) && matchs[3][0]
			var sysid = len>4 && matchs[4][0];
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name,pubid && pubid.replace(/^(['"])(.*?)\1$/,'$2'),
					sysid && sysid.replace(/^(['"])(.*?)\1$/,'$2'));
			domBuilder.endDTD();

			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

/**
 * @param source
 */
function ElementAttributes(source){

}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	add:function(qName,value,offset){
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getOffset:function(i){return this[i].offset},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}




function _set_proto_(thiz,parent){
	thiz.__proto__ = parent;
	return thiz;
}
if(!(_set_proto_({},_set_proto_.prototype) instanceof _set_proto_)){
	_set_proto_ = function(thiz,parent){
		function p(){};
		p.prototype = parent;
		p = new p();
		for(parent in thiz){
			p[parent] = thiz[parent];
		}
		return p;
	}
}

function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

if(typeof require == 'function'){
	exports.XMLReader = XMLReader;
}


},{}],6:[function(require,module,exports){
var css = "*:focus {\n    outline: 0;\n}\n\na[target=\"_blank\"]:focus {\n    outline: 1px solid #129fea;\n}\n\n/* because we think the padding and margin should always be part of the size,\n   we define \"box-sizing: border-box\" for all elements */\n\n* {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}"; (require("/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify"))(css); module.exports = css;
},{"/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify":1}],7:[function(require,module,exports){
var css = ".pure-menu.pure-menu-open {\n    z-index: 3; /* prevent graph from crossing the menuarea */\n}\n\n.pure-button.pure-button-bordered,\n.pure-button.pure-button-bordered[disabled] {\n    box-shadow: 0 0 0 1px rgba(0,0,0, 0.15) inset;\n}\n\n.pure-button.pure-button-bordered:focus,\n.pure-button.pure-button-bordered[disabled]:focus,\n.pure-button.pure-button-bordered:focus,\n.pure-button.pure-button-bordered[disabled]:focus,\n.pure-button.pure-button-bordered.focussed,\n.pure-button.pure-button-bordered[disabled].focussed,\n.pure-button.pure-button-bordered.focussed,\n.pure-button.pure-button-bordered[disabled].focussed {\n    box-shadow: 0 0 0 1px rgba(0,0,0, 0.4) inset;\n}\n\n/* restore pure-button:active */\n.pure-button.pure-button-bordered:active,\n.pure-button.pure-button-bordered.pure-button-active,\n.pure-button:active:focus,\n.pure-button.pure-button-active:focus {\n    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4) inset, 0 0 10px rgba(0, 0, 0, 0.3) inset;\n}\n\n.pure-button.pure-button-rounded {\n    border-radius: 0.3em;\n}\n\n.pure-button.pure-button-heavyrounded {\n    border-radius: 0.5em;\n}\n\n.pure-button.pure-button-oval {\n    border-radius: 50%;\n}\n\n.pure-button.pure-button-halfoval {\n    border-radius: 25%;\n}\n"; (require("/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify"))(css); module.exports = css;
},{"/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify":1}],8:[function(require,module,exports){
var css = "/*!\nPure v0.5.0\nCopyright 2014 Yahoo! Inc. All rights reserved.\nLicensed under the BSD License.\nhttps://github.com/yahoo/pure/blob/master/LICENSE.md\n*/\n/*!\nnormalize.css v^3.0 | MIT License | git.io/normalize\nCopyright (c) Nicolas Gallagher and Jonathan Neal\n*/\n/*! normalize.css v3.0.2 | MIT License | git.io/normalize */\n\n/**\n * 1. Set default font family to sans-serif.\n * 2. Prevent iOS text size adjust after orientation change, without disabling\n *    user zoom.\n */\n\nhtml {\n  font-family: sans-serif; /* 1 */\n  -ms-text-size-adjust: 100%; /* 2 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/**\n * Remove default margin.\n */\n\nbody {\n  margin: 0;\n}\n\n/* HTML5 display definitions\n   ========================================================================== */\n\n/**\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\n * and Firefox.\n * Correct `block` display not defined for `main` in IE 11.\n */\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block;\n}\n\n/**\n * 1. Correct `inline-block` display not defined in IE 8/9.\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\n */\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block; /* 1 */\n  vertical-align: baseline; /* 2 */\n}\n\n/**\n * Prevent modern browsers from displaying `audio` without controls.\n * Remove excess height in iOS 5 devices.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Address `[hidden]` styling not present in IE 8/9/10.\n * Hide the `template` element in IE 8/9/11, Safari, and Firefox < 22.\n */\n\n[hidden],\ntemplate {\n  display: none;\n}\n\n/* Links\n   ========================================================================== */\n\n/**\n * Remove the gray background color from active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * Improve readability when focused and also mouse hovered in all browsers.\n */\n\na:active,\na:hover {\n  outline: 0;\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\n */\n\nabbr[title] {\n  border-bottom: 1px dotted;\n}\n\n/**\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\n */\n\nb,\nstrong {\n  font-weight: bold;\n}\n\n/**\n * Address styling not present in Safari and Chrome.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Address variable `h1` font-size and margin within `section` and `article`\n * contexts in Firefox 4+, Safari, and Chrome.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/**\n * Address styling not present in IE 8/9.\n */\n\nmark {\n  background: #ff0;\n  color: #000;\n}\n\n/**\n * Address inconsistent and variable font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsup {\n  top: -0.5em;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove border when inside `a` element in IE 8/9/10.\n */\n\nimg {\n  border: 0;\n}\n\n/**\n * Correct overflow not hidden in IE 9/10/11.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * Address margin not present in IE 8/9 and Safari.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * Address differences between Firefox and other browsers.\n */\n\nhr {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n  height: 0;\n}\n\n/**\n * Contain overflow in all browsers.\n */\n\npre {\n  overflow: auto;\n}\n\n/**\n * Address odd `em`-unit font size rendering in all browsers.\n */\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\n * styling of `select`, unless a `border` property is set.\n */\n\n/**\n * 1. Correct color not being inherited.\n *    Known issue: affects color of disabled elements.\n * 2. Correct font properties not being inherited.\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit; /* 1 */\n  font: inherit; /* 2 */\n  margin: 0; /* 3 */\n}\n\n/**\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\n */\n\nbutton {\n  overflow: visible;\n}\n\n/**\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\n * All other form control elements do not inherit `text-transform` values.\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\n * Correct `select` style inheritance in Firefox.\n */\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/**\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\n *    and `video` controls.\n * 2. Correct inability to style clickable `input` types in iOS.\n * 3. Improve usability and consistency of cursor style between image-type\n *    `input` and others.\n */\n\nbutton,\nhtml input[type=\"button\"], /* 1 */\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n  cursor: pointer; /* 3 */\n}\n\n/**\n * Re-set default cursor for disabled elements.\n */\n\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\n\n/**\n * Remove inner padding and border in Firefox 4+.\n */\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0;\n}\n\n/**\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\n * the UA stylesheet.\n */\n\ninput {\n  line-height: normal;\n}\n\n/**\n * It's recommended that you don't attempt to style these elements.\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\n *\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\n * 2. Remove excess padding in IE 8/9/10.\n */\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\n * `font-size` values of the `input`, it causes the cursor style of the\n * decrement button to change from `default` to `text`.\n */\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome\n *    (include `-moz` to future-proof).\n */\n\ninput[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  -moz-box-sizing: content-box;\n  -webkit-box-sizing: content-box; /* 2 */\n  box-sizing: content-box;\n}\n\n/**\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\n * Safari (but not Chrome) clips the cancel button when the search input has\n * padding (and `textfield` appearance).\n */\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * Define consistent border, margin, and padding.\n */\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\n\n/**\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\n */\n\nlegend {\n  border: 0; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Remove default vertical scrollbar in IE 8/9/10/11.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * Don't inherit the `font-weight` (applied by a rule above).\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\n */\n\noptgroup {\n  font-weight: bold;\n}\n\n/* Tables\n   ========================================================================== */\n\n/**\n * Remove most spacing between table cells.\n */\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\ntd,\nth {\n  padding: 0;\n}\n\n/*csslint important:false*/\n\n/* ==========================================================================\n   Pure Base Extras\n   ========================================================================== */\n\n/**\n * Extra rules that Pure adds on top of Normalize.css\n */\n\n/**\n * Always hide an element when it has the `hidden` HTML attribute.\n */\n\n[hidden] {\n    display: none !important;\n}\n\n/**\n * Add this class to an image to make it fit within it's fluid parent wrapper while maintaining\n * aspect ratio.\n */\n.pure-img {\n    max-width: 100%;\n    height: auto;\n    display: block;\n}\n\n/*csslint regex-selectors:false, known-properties:false, duplicate-properties:false*/\n\n.pure-g {\n    letter-spacing: -0.31em; /* Webkit: collapse white-space between units */\n    *letter-spacing: normal; /* reset IE < 8 */\n    *word-spacing: -0.43em; /* IE < 8: collapse white-space between units */\n    text-rendering: optimizespeed; /* Webkit: fixes text-rendering: optimizeLegibility */\n\n    /*\n    Sets the font stack to fonts known to work properly with the above letter\n    and word spacings. See: https://github.com/yahoo/pure/issues/41/\n\n    The following font stack makes Pure Grids work on all known environments.\n\n    * FreeSans: Ships with many Linux distros, including Ubuntu\n\n    * Arimo: Ships with Chrome OS. Arimo has to be defined before Helvetica and\n      Arial to get picked up by the browser, even though neither is available\n      in Chrome OS.\n\n    * Droid Sans: Ships with all versions of Android.\n\n    * Helvetica, Arial, sans-serif: Common font stack on OS X and Windows.\n    */\n    font-family: FreeSans, Arimo, \"Droid Sans\", Helvetica, Arial, sans-serif;\n\n    /*\n    Use flexbox when possible to avoid `letter-spacing` side-effects.\n\n    NOTE: Firefox (as of 25) does not currently support flex-wrap, so the\n    `-moz-` prefix version is omitted.\n    */\n\n    display: -webkit-flex;\n    -webkit-flex-flow: row wrap;\n\n    /* IE10 uses display: flexbox */\n    display: -ms-flexbox;\n    -ms-flex-flow: row wrap;\n}\n\n/* Opera as of 12 on Windows needs word-spacing.\n   The \".opera-only\" selector is used to prevent actual prefocus styling\n   and is not required in markup.\n*/\n.opera-only :-o-prefocus,\n.pure-g {\n    word-spacing: -0.43em;\n}\n\n.pure-u {\n    display: inline-block;\n    *display: inline; /* IE < 8: fake inline-block */\n    zoom: 1;\n    letter-spacing: normal;\n    word-spacing: normal;\n    vertical-align: top;\n    text-rendering: auto;\n}\n\n/*\nResets the font family back to the OS/browser's default sans-serif font,\nthis the same font stack that Normalize.css sets for the `body`.\n*/\n.pure-g [class *= \"pure-u\"] {\n    font-family: sans-serif;\n}\n\n.pure-u-1,\n.pure-u-1-1,\n.pure-u-1-2,\n.pure-u-1-3,\n.pure-u-2-3,\n.pure-u-1-4,\n.pure-u-3-4,\n.pure-u-1-5,\n.pure-u-2-5,\n.pure-u-3-5,\n.pure-u-4-5,\n.pure-u-5-5,\n.pure-u-1-6,\n.pure-u-5-6,\n.pure-u-1-8,\n.pure-u-3-8,\n.pure-u-5-8,\n.pure-u-7-8,\n.pure-u-1-12,\n.pure-u-5-12,\n.pure-u-7-12,\n.pure-u-11-12,\n.pure-u-1-24,\n.pure-u-2-24,\n.pure-u-3-24,\n.pure-u-4-24,\n.pure-u-5-24,\n.pure-u-6-24,\n.pure-u-7-24,\n.pure-u-8-24,\n.pure-u-9-24,\n.pure-u-10-24,\n.pure-u-11-24,\n.pure-u-12-24,\n.pure-u-13-24,\n.pure-u-14-24,\n.pure-u-15-24,\n.pure-u-16-24,\n.pure-u-17-24,\n.pure-u-18-24,\n.pure-u-19-24,\n.pure-u-20-24,\n.pure-u-21-24,\n.pure-u-22-24,\n.pure-u-23-24,\n.pure-u-24-24 {\n    display: inline-block;\n    *display: inline;\n    zoom: 1;\n    letter-spacing: normal;\n    word-spacing: normal;\n    vertical-align: top;\n    text-rendering: auto;\n}\n\n.pure-u-1-24 {\n    width: 4.1667%;\n    *width: 4.1357%;\n}\n\n.pure-u-1-12,\n.pure-u-2-24 {\n    width: 8.3333%;\n    *width: 8.3023%;\n}\n\n.pure-u-1-8,\n.pure-u-3-24 {\n    width: 12.5000%;\n    *width: 12.4690%;\n}\n\n.pure-u-1-6,\n.pure-u-4-24 {\n    width: 16.6667%;\n    *width: 16.6357%;\n}\n\n.pure-u-1-5 {\n    width: 20%;\n    *width: 19.9690%;\n}\n\n.pure-u-5-24 {\n    width: 20.8333%;\n    *width: 20.8023%;\n}\n\n.pure-u-1-4,\n.pure-u-6-24 {\n    width: 25%;\n    *width: 24.9690%;\n}\n\n.pure-u-7-24 {\n    width: 29.1667%;\n    *width: 29.1357%;\n}\n\n.pure-u-1-3,\n.pure-u-8-24 {\n    width: 33.3333%;\n    *width: 33.3023%;\n}\n\n.pure-u-3-8,\n.pure-u-9-24 {\n    width: 37.5000%;\n    *width: 37.4690%;\n}\n\n.pure-u-2-5 {\n    width: 40%;\n    *width: 39.9690%;\n}\n\n.pure-u-5-12,\n.pure-u-10-24 {\n    width: 41.6667%;\n    *width: 41.6357%;\n}\n\n.pure-u-11-24 {\n    width: 45.8333%;\n    *width: 45.8023%;\n}\n\n.pure-u-1-2,\n.pure-u-12-24 {\n    width: 50%;\n    *width: 49.9690%;\n}\n\n.pure-u-13-24 {\n    width: 54.1667%;\n    *width: 54.1357%;\n}\n\n.pure-u-7-12,\n.pure-u-14-24 {\n    width: 58.3333%;\n    *width: 58.3023%;\n}\n\n.pure-u-3-5 {\n    width: 60%;\n    *width: 59.9690%;\n}\n\n.pure-u-5-8,\n.pure-u-15-24 {\n    width: 62.5000%;\n    *width: 62.4690%;\n}\n\n.pure-u-2-3,\n.pure-u-16-24 {\n    width: 66.6667%;\n    *width: 66.6357%;\n}\n\n.pure-u-17-24 {\n    width: 70.8333%;\n    *width: 70.8023%;\n}\n\n.pure-u-3-4,\n.pure-u-18-24 {\n    width: 75%;\n    *width: 74.9690%;\n}\n\n.pure-u-19-24 {\n    width: 79.1667%;\n    *width: 79.1357%;\n}\n\n.pure-u-4-5 {\n    width: 80%;\n    *width: 79.9690%;\n}\n\n.pure-u-5-6,\n.pure-u-20-24 {\n    width: 83.3333%;\n    *width: 83.3023%;\n}\n\n.pure-u-7-8,\n.pure-u-21-24 {\n    width: 87.5000%;\n    *width: 87.4690%;\n}\n\n.pure-u-11-12,\n.pure-u-22-24 {\n    width: 91.6667%;\n    *width: 91.6357%;\n}\n\n.pure-u-23-24 {\n    width: 95.8333%;\n    *width: 95.8023%;\n}\n\n.pure-u-1,\n.pure-u-1-1,\n.pure-u-5-5,\n.pure-u-24-24 {\n    width: 100%;\n}\n.pure-button {\n    /* Structure */\n    display: inline-block;\n    *display: inline; /*IE 6/7*/\n    zoom: 1;\n    line-height: normal;\n    white-space: nowrap;\n    vertical-align: baseline;\n    text-align: center;\n    cursor: pointer;\n    -webkit-user-drag: none;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n\n/* Firefox: Get rid of the inner focus border */\n.pure-button::-moz-focus-inner {\n    padding: 0;\n    border: 0;\n}\n\n/*csslint outline-none:false*/\n\n.pure-button {\n    font-family: inherit;\n    font-size: 100%;\n    *font-size: 90%; /*IE 6/7 - To reduce IE's oversized button text*/\n    *overflow: visible; /*IE 6/7 - Because of IE's overly large left/right padding on buttons */\n    padding: 0.5em 1em;\n    color: #444; /* rgba not supported (IE 8) */\n    color: rgba(0, 0, 0, 0.80); /* rgba supported */\n    *color: #444; /* IE 6 & 7 */\n    border: 1px solid #999;  /*IE 6/7/8*/\n    border: none rgba(0, 0, 0, 0);  /*IE9 + everything else*/\n    background-color: #E6E6E6;\n    text-decoration: none;\n    border-radius: 2px;\n}\n\n.pure-button-hover,\n.pure-button:hover,\n.pure-button:focus {\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#1a000000',GradientType=0);\n    background-image: -webkit-gradient(linear, 0 0, 0 100%, from(transparent), color-stop(40%, rgba(0,0,0, 0.05)), to(rgba(0,0,0, 0.10)));\n    background-image: -webkit-linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10));\n    background-image: -moz-linear-gradient(top, rgba(0,0,0, 0.05) 0%, rgba(0,0,0, 0.10));\n    background-image: -o-linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10));\n    background-image: linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10));\n}\n.pure-button:focus {\n    outline: 0;\n}\n.pure-button-active,\n.pure-button:active {\n    box-shadow: 0 0 0 1px rgba(0,0,0, 0.15) inset, 0 0 6px rgba(0,0,0, 0.20) inset;\n}\n\n.pure-button[disabled],\n.pure-button-disabled,\n.pure-button-disabled:hover,\n.pure-button-disabled:focus,\n.pure-button-disabled:active {\n    border: none;\n    background-image: none;\n    filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\n    filter: alpha(opacity=40);\n    -khtml-opacity: 0.40;\n    -moz-opacity: 0.40;\n    opacity: 0.40;\n    cursor: not-allowed;\n    box-shadow: none;\n}\n\n.pure-button-hidden {\n    display: none;\n}\n\n/* Firefox: Get rid of the inner focus border */\n.pure-button::-moz-focus-inner{\n    padding: 0;\n    border: 0;\n}\n\n.pure-button-primary,\n.pure-button-selected,\na.pure-button-primary,\na.pure-button-selected {\n    background-color: rgb(0, 120, 231);\n    color: #fff;\n}\n\n.pure-form input[type=\"text\"],\n.pure-form input[type=\"password\"],\n.pure-form input[type=\"email\"],\n.pure-form input[type=\"url\"],\n.pure-form input[type=\"date\"],\n.pure-form input[type=\"month\"],\n.pure-form input[type=\"time\"],\n.pure-form input[type=\"datetime\"],\n.pure-form input[type=\"datetime-local\"],\n.pure-form input[type=\"week\"],\n.pure-form input[type=\"number\"],\n.pure-form input[type=\"search\"],\n.pure-form input[type=\"tel\"],\n.pure-form input[type=\"color\"],\n.pure-form select,\n.pure-form textarea {\n    padding: 0.5em 0.6em;\n    display: inline-block;\n    border: 1px solid #ccc;\n    box-shadow: inset 0 1px 3px #ddd;\n    border-radius: 4px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}\n\n/*\nNeed to separate out the :not() selector from the rest of the CSS 2.1 selectors\nsince IE8 won't execute CSS that contains a CSS3 selector.\n*/\n.pure-form input:not([type]) {\n    padding: 0.5em 0.6em;\n    display: inline-block;\n    border: 1px solid #ccc;\n    box-shadow: inset 0 1px 3px #ddd;\n    border-radius: 4px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}\n\n\n/* Chrome (as of v.32/34 on OS X) needs additional room for color to display. */\n/* May be able to remove this tweak as color inputs become more standardized across browsers. */\n.pure-form input[type=\"color\"] {\n    padding: 0.2em 0.5em;\n}\n\n\n.pure-form input[type=\"text\"]:focus,\n.pure-form input[type=\"password\"]:focus,\n.pure-form input[type=\"email\"]:focus,\n.pure-form input[type=\"url\"]:focus,\n.pure-form input[type=\"date\"]:focus,\n.pure-form input[type=\"month\"]:focus,\n.pure-form input[type=\"time\"]:focus,\n.pure-form input[type=\"datetime\"]:focus,\n.pure-form input[type=\"datetime-local\"]:focus,\n.pure-form input[type=\"week\"]:focus,\n.pure-form input[type=\"number\"]:focus,\n.pure-form input[type=\"search\"]:focus,\n.pure-form input[type=\"tel\"]:focus,\n.pure-form input[type=\"color\"]:focus,\n.pure-form select:focus,\n.pure-form textarea:focus {\n    outline: 0;\n    outline: thin dotted \\9; /* IE6-9 */\n    border-color: #129FEA;\n}\n\n/*\nNeed to separate out the :not() selector from the rest of the CSS 2.1 selectors\nsince IE8 won't execute CSS that contains a CSS3 selector.\n*/\n.pure-form input:not([type]):focus {\n    outline: 0;\n    outline: thin dotted \\9; /* IE6-9 */\n    border-color: #129FEA;\n}\n\n.pure-form input[type=\"file\"]:focus,\n.pure-form input[type=\"radio\"]:focus,\n.pure-form input[type=\"checkbox\"]:focus {\n    outline: thin dotted #333;\n    outline: 1px auto #129FEA;\n}\n.pure-form .pure-checkbox,\n.pure-form .pure-radio {\n    margin: 0.5em 0;\n    display: block;\n}\n\n.pure-form input[type=\"text\"][disabled],\n.pure-form input[type=\"password\"][disabled],\n.pure-form input[type=\"email\"][disabled],\n.pure-form input[type=\"url\"][disabled],\n.pure-form input[type=\"date\"][disabled],\n.pure-form input[type=\"month\"][disabled],\n.pure-form input[type=\"time\"][disabled],\n.pure-form input[type=\"datetime\"][disabled],\n.pure-form input[type=\"datetime-local\"][disabled],\n.pure-form input[type=\"week\"][disabled],\n.pure-form input[type=\"number\"][disabled],\n.pure-form input[type=\"search\"][disabled],\n.pure-form input[type=\"tel\"][disabled],\n.pure-form input[type=\"color\"][disabled],\n.pure-form select[disabled],\n.pure-form textarea[disabled] {\n    cursor: not-allowed;\n    background-color: #eaeded;\n    color: #cad2d3;\n}\n\n/*\nNeed to separate out the :not() selector from the rest of the CSS 2.1 selectors\nsince IE8 won't execute CSS that contains a CSS3 selector.\n*/\n.pure-form input:not([type])[disabled] {\n    cursor: not-allowed;\n    background-color: #eaeded;\n    color: #cad2d3;\n}\n.pure-form input[readonly],\n.pure-form select[readonly],\n.pure-form textarea[readonly] {\n    background: #eee; /* menu hover bg color */\n    color: #777; /* menu text color */\n    border-color: #ccc;\n}\n\n.pure-form input:focus:invalid,\n.pure-form textarea:focus:invalid,\n.pure-form select:focus:invalid {\n    color: #b94a48;\n    border-color: #ee5f5b;\n}\n.pure-form input:focus:invalid:focus,\n.pure-form textarea:focus:invalid:focus,\n.pure-form select:focus:invalid:focus {\n    border-color: #e9322d;\n}\n.pure-form input[type=\"file\"]:focus:invalid:focus,\n.pure-form input[type=\"radio\"]:focus:invalid:focus,\n.pure-form input[type=\"checkbox\"]:focus:invalid:focus {\n    outline-color: #e9322d;\n}\n.pure-form select {\n    border: 1px solid #ccc;\n    background-color: white;\n}\n.pure-form select[multiple] {\n    height: auto;\n}\n.pure-form label {\n    margin: 0.5em 0 0.2em;\n}\n.pure-form fieldset {\n    margin: 0;\n    padding: 0.35em 0 0.75em;\n    border: 0;\n}\n.pure-form legend {\n    display: block;\n    width: 100%;\n    padding: 0.3em 0;\n    margin-bottom: 0.3em;\n    color: #333;\n    border-bottom: 1px solid #e5e5e5;\n}\n\n.pure-form-stacked input[type=\"text\"],\n.pure-form-stacked input[type=\"password\"],\n.pure-form-stacked input[type=\"email\"],\n.pure-form-stacked input[type=\"url\"],\n.pure-form-stacked input[type=\"date\"],\n.pure-form-stacked input[type=\"month\"],\n.pure-form-stacked input[type=\"time\"],\n.pure-form-stacked input[type=\"datetime\"],\n.pure-form-stacked input[type=\"datetime-local\"],\n.pure-form-stacked input[type=\"week\"],\n.pure-form-stacked input[type=\"number\"],\n.pure-form-stacked input[type=\"search\"],\n.pure-form-stacked input[type=\"tel\"],\n.pure-form-stacked input[type=\"color\"],\n.pure-form-stacked select,\n.pure-form-stacked label,\n.pure-form-stacked textarea {\n    display: block;\n    margin: 0.25em 0;\n}\n\n/*\nNeed to separate out the :not() selector from the rest of the CSS 2.1 selectors\nsince IE8 won't execute CSS that contains a CSS3 selector.\n*/\n.pure-form-stacked input:not([type]) {\n    display: block;\n    margin: 0.25em 0;\n}\n.pure-form-aligned input,\n.pure-form-aligned textarea,\n.pure-form-aligned select,\n/* NOTE: pure-help-inline is deprecated. Use .pure-form-message-inline instead. */\n.pure-form-aligned .pure-help-inline,\n.pure-form-message-inline {\n    display: inline-block;\n    *display: inline;\n    *zoom: 1;\n    vertical-align: middle;\n}\n.pure-form-aligned textarea {\n    vertical-align: top;\n}\n\n/* Aligned Forms */\n.pure-form-aligned .pure-control-group {\n    margin-bottom: 0.5em;\n}\n.pure-form-aligned .pure-control-group label {\n    text-align: right;\n    display: inline-block;\n    vertical-align: middle;\n    width: 10em;\n    margin: 0 1em 0 0;\n}\n.pure-form-aligned .pure-controls {\n    margin: 1.5em 0 0 10em;\n}\n\n/* Rounded Inputs */\n.pure-form input.pure-input-rounded,\n.pure-form .pure-input-rounded {\n    border-radius: 2em;\n    padding: 0.5em 1em;\n}\n\n/* Grouped Inputs */\n.pure-form .pure-group fieldset {\n    margin-bottom: 10px;\n}\n.pure-form .pure-group input {\n    display: block;\n    padding: 10px;\n    margin: 0;\n    border-radius: 0;\n    position: relative;\n    top: -1px;\n}\n.pure-form .pure-group input:focus {\n    z-index: 2;\n}\n.pure-form .pure-group input:first-child {\n    top: 1px;\n    border-radius: 4px 4px 0 0;\n}\n.pure-form .pure-group input:last-child {\n    top: -2px;\n    border-radius: 0 0 4px 4px;\n}\n.pure-form .pure-group button {\n    margin: 0.35em 0;\n}\n\n.pure-form .pure-input-1 {\n    width: 100%;\n}\n.pure-form .pure-input-2-3 {\n    width: 66%;\n}\n.pure-form .pure-input-1-2 {\n    width: 50%;\n}\n.pure-form .pure-input-1-3 {\n    width: 33%;\n}\n.pure-form .pure-input-1-4 {\n    width: 25%;\n}\n\n/* Inline help for forms */\n/* NOTE: pure-help-inline is deprecated. Use .pure-form-message-inline instead. */\n.pure-form .pure-help-inline,\n.pure-form-message-inline {\n    display: inline-block;\n    padding-left: 0.3em;\n    color: #666;\n    vertical-align: middle;\n    font-size: 0.875em;\n}\n\n/* Block help for forms */\n.pure-form-message {\n    display: block;\n    color: #666;\n    font-size: 0.875em;\n}\n\n@media only screen and (max-width : 480px) {\n    .pure-form button[type=\"submit\"] {\n        margin: 0.7em 0 0;\n    }\n\n    .pure-form input:not([type]),\n    .pure-form input[type=\"text\"],\n    .pure-form input[type=\"password\"],\n    .pure-form input[type=\"email\"],\n    .pure-form input[type=\"url\"],\n    .pure-form input[type=\"date\"],\n    .pure-form input[type=\"month\"],\n    .pure-form input[type=\"time\"],\n    .pure-form input[type=\"datetime\"],\n    .pure-form input[type=\"datetime-local\"],\n    .pure-form input[type=\"week\"],\n    .pure-form input[type=\"number\"],\n    .pure-form input[type=\"search\"],\n    .pure-form input[type=\"tel\"],\n    .pure-form input[type=\"color\"],\n    .pure-form label {\n        margin-bottom: 0.3em;\n        display: block;\n    }\n\n    .pure-group input:not([type]),\n    .pure-group input[type=\"text\"],\n    .pure-group input[type=\"password\"],\n    .pure-group input[type=\"email\"],\n    .pure-group input[type=\"url\"],\n    .pure-group input[type=\"date\"],\n    .pure-group input[type=\"month\"],\n    .pure-group input[type=\"time\"],\n    .pure-group input[type=\"datetime\"],\n    .pure-group input[type=\"datetime-local\"],\n    .pure-group input[type=\"week\"],\n    .pure-group input[type=\"number\"],\n    .pure-group input[type=\"search\"],\n    .pure-group input[type=\"tel\"],\n    .pure-group input[type=\"color\"] {\n        margin-bottom: 0;\n    }\n\n    .pure-form-aligned .pure-control-group label {\n        margin-bottom: 0.3em;\n        text-align: left;\n        display: block;\n        width: 100%;\n    }\n\n    .pure-form-aligned .pure-controls {\n        margin: 1.5em 0 0 0;\n    }\n\n    /* NOTE: pure-help-inline is deprecated. Use .pure-form-message-inline instead. */\n    .pure-form .pure-help-inline,\n    .pure-form-message-inline,\n    .pure-form-message {\n        display: block;\n        font-size: 0.75em;\n        /* Increased bottom padding to make it group with its related input element. */\n        padding: 0.2em 0 0.8em;\n    }\n}\n\n/*csslint adjoining-classes:false, outline-none:false*/\n/*TODO: Remove this lint rule override after a refactor of this code.*/\n\n.pure-menu ul {\n    position: absolute;\n    visibility: hidden;\n}\n\n.pure-menu.pure-menu-open {\n    visibility: visible;\n    z-index: 2;\n    width: 100%;\n}\n\n.pure-menu ul {\n    left: -10000px;\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    top: -10000px;\n    z-index: 1;\n}\n\n.pure-menu > ul { position: relative; }\n\n.pure-menu-open > ul {\n    left: 0;\n    top: 0;\n    visibility: visible;\n}\n\n.pure-menu-open > ul:focus {\n    outline: 0;\n}\n\n.pure-menu li { position: relative; }\n\n.pure-menu a,\n.pure-menu .pure-menu-heading {\n    display: block;\n    color: inherit;\n    line-height: 1.5em;\n    padding: 5px 20px;\n    text-decoration: none;\n    white-space: nowrap;\n}\n\n.pure-menu.pure-menu-horizontal > .pure-menu-heading {\n    display: inline-block;\n    *display: inline;\n    zoom: 1;\n    margin: 0;\n    vertical-align: middle;\n}\n.pure-menu.pure-menu-horizontal > ul {\n    display: inline-block;\n    *display: inline;\n    zoom: 1;\n    vertical-align: middle;\n}\n\n.pure-menu li a { padding: 5px 20px; }\n\n.pure-menu-can-have-children > .pure-menu-label:after {\n    content: '\\25B8';\n    float: right;\n    /* These specific fonts have the Unicode char we need. */\n    font-family: 'Lucida Grande', 'Lucida Sans Unicode', 'DejaVu Sans', sans-serif;\n    margin-right: -20px;\n    margin-top: -1px;\n}\n\n.pure-menu-can-have-children > .pure-menu-label {\n    padding-right: 30px;\n}\n\n.pure-menu-separator {\n    background-color: #dfdfdf;\n    display: block;\n    height: 1px;\n    font-size: 0;\n    margin: 7px 2px;\n    overflow: hidden;\n}\n\n.pure-menu-hidden {\n    display: none;\n}\n\n/* FIXED MENU */\n.pure-menu-fixed {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n}\n\n\n/* HORIZONTAL MENU CODE */\n\n/* Initial menus should be inline-block so that they are horizontal */\n.pure-menu-horizontal li {\n    display: inline-block;\n    *display: inline;\n    zoom: 1;\n    vertical-align: middle;\n}\n\n/* Submenus should still be display: block; */\n.pure-menu-horizontal li li {\n    display: block;\n}\n\n/* Content after should be down arrow */\n.pure-menu-horizontal > .pure-menu-children > .pure-menu-can-have-children > .pure-menu-label:after {\n    content: \"\\25BE\";\n}\n/*Add extra padding to elements that have the arrow so that the hover looks nice */\n.pure-menu-horizontal > .pure-menu-children > .pure-menu-can-have-children > .pure-menu-label {\n    padding-right: 30px;\n}\n\n/* Adjusting separator for vertical menus */\n.pure-menu-horizontal li.pure-menu-separator {\n    height: 50%;\n    width: 1px;\n    margin: 0 7px;\n}\n\n/* Submenus should be horizontal separator again */\n.pure-menu-horizontal li li.pure-menu-separator {\n    height: 1px;\n    width: auto;\n    margin: 7px 2px;\n}\n\n\n/*csslint adjoining-classes:false*/\n/*TODO: Remove this lint rule override after a refactor of this code.*/\n\n/* MAIN MENU STYLING */\n\n.pure-menu.pure-menu-open,\n.pure-menu.pure-menu-horizontal li .pure-menu-children {\n    background: #fff; /* Old browsers */\n    border: 1px solid #b7b7b7;\n}\n\n/* remove borders for horizontal menus */\n.pure-menu.pure-menu-horizontal,\n.pure-menu.pure-menu-horizontal .pure-menu-heading {\n    border: none;\n}\n\n\n/* LINK STYLES */\n\n.pure-menu a {\n    border: 1px solid transparent;\n    border-left: none;\n    border-right: none;\n\n}\n\n.pure-menu a,\n.pure-menu .pure-menu-can-have-children > li:after {\n    color: #777;\n}\n\n.pure-menu .pure-menu-can-have-children > li:hover:after {\n    color: #fff;\n}\n\n/* Focus style for a dropdown menu-item when the parent has been opened */\n.pure-menu .pure-menu-open {\n    background: #dedede;\n}\n\n\n.pure-menu li a:hover,\n.pure-menu li a:focus {\n    background: #eee;\n}\n\n/* DISABLED STATES */\n.pure-menu li.pure-menu-disabled a:hover,\n.pure-menu li.pure-menu-disabled a:focus {\n    background: #fff;\n    color: #bfbfbf;\n}\n\n.pure-menu .pure-menu-disabled > a {\n    background-image: none;\n    border-color: transparent;\n    cursor: default;\n}\n\n.pure-menu .pure-menu-disabled > a,\n.pure-menu .pure-menu-can-have-children.pure-menu-disabled > a:after {\n    color: #bfbfbf;\n}\n\n/* HEADINGS */\n.pure-menu .pure-menu-heading {\n    color: #565d64;\n    text-transform: uppercase;\n    font-size: 90%;\n    margin-top: 0.5em;\n    border-bottom-width: 1px;\n    border-bottom-style: solid;\n    border-bottom-color: #dfdfdf;\n}\n\n/* ACTIVE MENU ITEM */\n.pure-menu .pure-menu-selected a {\n    color: #000;\n}\n\n/* FIXED MENU */\n.pure-menu.pure-menu-open.pure-menu-fixed {\n    border: none;\n    border-bottom: 1px solid #b7b7b7;\n}\n\n/*csslint box-model:false*/\n/*TODO: Remove this lint rule override after a refactor of this code.*/\n\n\n.pure-paginator {\n\n    /* `pure-g` Grid styles */\n    letter-spacing: -0.31em; /* Webkit: collapse white-space between units */\n    *letter-spacing: normal; /* reset IE < 8 */\n    *word-spacing: -0.43em; /* IE < 8: collapse white-space between units */\n    text-rendering: optimizespeed; /* Webkit: fixes text-rendering: optimizeLegibility */\n\n    /* `pure-paginator` Specific styles */\n    list-style: none;\n    margin: 0;\n    padding: 0;\n}\n.opera-only :-o-prefocus,\n.pure-paginator {\n    word-spacing: -0.43em;\n}\n\n/* `pure-u` Grid styles */\n.pure-paginator li {\n    display: inline-block;\n    *display: inline; /* IE < 8: fake inline-block */\n    zoom: 1;\n    letter-spacing: normal;\n    word-spacing: normal;\n    vertical-align: top;\n    text-rendering: auto;\n}\n\n\n.pure-paginator .pure-button {\n    border-radius: 0;\n    padding: 0.8em 1.4em;\n    vertical-align: top;\n    height: 1.1em;\n}\n.pure-paginator .pure-button:focus,\n.pure-paginator .pure-button:active {\n    outline-style: none;\n}\n.pure-paginator .prev,\n.pure-paginator .next {\n    color: #C0C1C3;\n    text-shadow: 0 -1px 0 rgba(0,0,0, 0.45);\n}\n.pure-paginator .prev {\n    border-radius: 2px 0 0 2px;\n}\n.pure-paginator .next {\n    border-radius: 0 2px 2px 0;\n}\n\n@media (max-width: 480px) {\n    .pure-menu-horizontal {\n        width: 100%;\n    }\n\n    .pure-menu-children li {\n        display: block;\n        border-bottom: 1px solid black;\n    }\n}\n\n.pure-table {\n    /* Remove spacing between table cells (from Normalize.css) */\n    border-collapse: collapse;\n    border-spacing: 0;\n    empty-cells: show;\n    border: 1px solid #cbcbcb;\n}\n\n.pure-table caption {\n    color: #000;\n    font: italic 85%/1 arial, sans-serif;\n    padding: 1em 0;\n    text-align: center;\n}\n\n.pure-table td,\n.pure-table th {\n    border-left: 1px solid #cbcbcb;/*  inner column border */\n    border-width: 0 0 0 1px;\n    font-size: inherit;\n    margin: 0;\n    overflow: visible; /*to make ths where the title is really long work*/\n    padding: 0.5em 1em; /* cell padding */\n}\n.pure-table td:first-child,\n.pure-table th:first-child {\n    border-left-width: 0;\n}\n\n.pure-table thead {\n    background: #e0e0e0;\n    color: #000;\n    text-align: left;\n    vertical-align: bottom;\n}\n\n/*\nstriping:\n   even - #fff (white)\n   odd  - #f2f2f2 (light gray)\n*/\n.pure-table td {\n    background-color: transparent;\n}\n.pure-table-odd td {\n    background-color: #f2f2f2;\n}\n\n/* nth-child selector for modern browsers */\n.pure-table-striped tr:nth-child(2n-1) td {\n    background-color: #f2f2f2;\n}\n\n/* BORDERED TABLES */\n.pure-table-bordered td {\n    border-bottom: 1px solid #cbcbcb;\n}\n.pure-table-bordered tbody > tr:last-child > td {\n    border-bottom-width: 0;\n}\n\n\n/* HORIZONTAL BORDERED TABLES */\n\n.pure-table-horizontal td,\n.pure-table-horizontal th {\n    border-width: 0 0 1px 0;\n    border-bottom: 1px solid #cbcbcb;\n}\n.pure-table-horizontal tbody > tr:last-child > td {\n    border-bottom-width: 0;\n}\n"; (require("/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify"))(css); module.exports = css;
},{"/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify":1}],9:[function(require,module,exports){
require('./css/default.css');
require('./css/purecss-0.5.0.css');
require('./css/pure-finetuned.css');
},{"./css/default.css":6,"./css/pure-finetuned.css":7,"./css/purecss-0.5.0.css":8}],10:[function(require,module,exports){
var css = "[dd-draggable] {\n    -moz-user-select: none;\n    -khtml-user-select: none;\n    -webkit-user-select: none;\n    user-select: none;\n    float: left;\n    position: relative;\n}\n.dd-hidden-source {\n    visibility: hidden !important;\n}\n.dd-dragging {\n    cursor: move;\n}\n.dd-transition {\n    -webkit-transition: top 0.25s ease-out, left 0.25s ease-out;\n    -moz-transition: top 0.25s ease-out, left 0.25s ease-out;\n    -ms-transition: top 0.25s ease-out, left 0.25s ease-out;\n    -o-transition: top 0.25s ease-out, left 0.25s ease-out;\n    transition: top 0.25s ease-out, left 0.25s ease-out;\n}\n.dd-high-z {\n    z-index: 999 !important;\n}\n.dd-opacity {\n    opacity: 0.6;\n    filter: alpha(opacity=60); /* For IE8 and earlier */\n}\n[dropzone] {\n    position: relative; /* otherwise we cannot place absolute positioned items */\n}"; (require("/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify"))(css); module.exports = css;
},{"/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify":1}],11:[function(require,module,exports){
"use strict";

/**
 * Provides `drag and drop` functionality with dropzones
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @example
 * DD = require('drag-drop')(window);
 * DD.init();
 *
 * @module drag-drop
 * @class DD
 * @since 0.0.4
*/


// Redefine the API for the events `dd`, `dd-drag` and `dd-drop`, for they have more properties:

/**
* Emitted during the drag-cycle of a draggable Element (while it is dragged).
*
* @event *:dd-drag (extended by drag-drop)
* @param e {Object} eventobject including:
* @param e.target {HtmlElement} the HtmlElement that is being dragged
* @param e.dragNode {HtmlElement} The HtmlElement that is being dragged (equals e.target)
* @param [e.sourceNode] {HtmlElement} The original Element. Only when a `copy` is made --> e.dragNode is being moved while
*        e.sourceNode stand at its place.
* @param e.currentTarget {HtmlElement} the HtmlElement that is delegating
* @param e.sourceTarget {HtmlElement} the deepest HtmlElement where the mouse lies upon
* @param [e.dropTarget] {HtmlElement} The dropzone HtmlElement that will be available whenever the draggable gets over a dropzone.
* @param e.dd {Promise} Promise that gets fulfilled when dragging is ended. The fullfilled-callback has no arguments.
* @param [e.dropzone] {Promise} a Promise that will be available whenever the draggable gets over a dropzone.
*        The Promise that gets fulfilled as soon as the draggable is dropped, or outside the dropzone
*        Will fulfill with one argument: `onDropzone` {Boolean} when `true`, the draggable is dropped inside the dropzone, otherwise
*        the draggable got outside the dropzone without beging dropped.
* @param e.ctrlKey {Boolean} Whether the Ctrl/cmd key is pressed
* @param e.isCopied {Boolean} Whether the drag is a copy-drag
* @param e.xMouse {Number} the current x-position in the window-view
* @param e.yMouse {Number} the current y-position in the window-view
* @param e.clientX {Number} the current x-position in the window-view
* @param e.clientY {Number} the current y-position in the window-view
* @param e.xMouseOrigin {Number} the original x-position in the document when drag started (incl. scrollOffset)
* @param e.yMouseOrigin {Number} the original y-position in the document when drag started (incl. scrollOffset)
* @param [e.relatives] {NodeList} an optional list that the user could set in a `before`-subscriber of the `dd`-event
*        to inform which nodes are related to the draggable node and should be dragged as well.
* @param [e.relativeDragNodes] {NodeList} an optional list that holds the HtmlElements that corresponds with
*        the `e.relative` list, but is a list with draggable Elements.

* @since 0.0.1
*/

/**
* Emitted when drag-cycle of a draggable Element is ended.
*
* @event *:dd-drop (extended by drag-drop)
* @param e {Object} eventobject including:
* @param e.target {HtmlElement} the HtmlElement that is being dragged
* @param e.dragNode {HtmlElement} The HtmlElement that is being dragged (equals e.target)
* @param [e.sourceNode] {HtmlElement} The original Element. Only when a `copy` is made --> e.dragNode is being moved while
*        e.sourceNode stand at its place.
* @param e.currentTarget {HtmlElement} the HtmlElement that is delegating
* @param e.sourceTarget {HtmlElement} the deepest HtmlElement where the mouse lies upon
* @param [e.dropTarget] {HtmlElement} The dropzone HtmlElement that will be available whenever the draggable gets over a dropzone.
* @param e.dd {Promise} Promise that gets fulfilled when dragging is ended. The fullfilled-callback has no arguments.
* @param [e.dropzone] {Promise} a Promise that will be available whenever the draggable gets over a dropzone.
*        The Promise that gets fulfilled as soon as the draggable is dropped, or outside the dropzone
*        Will fulfill with one argument: `onDropzone` {Boolean} when `true`, the draggable is dropped inside the dropzone, otherwise
*        the draggable got outside the dropzone without beging dropped.
* @param e.ctrlKey {Boolean} Whether the Ctrl/cmd key is pressed
* @param e.isCopied {Boolean} Whether the drag is a copy-drag
* @param e.xMouse {Number} the current x-position in the window-view
* @param e.yMouse {Number} the current y-position in the window-view
* @param e.clientX {Number} the current x-position in the window-view
* @param e.clientY {Number} the current y-position in the window-view
* @param e.xMouseOrigin {Number} the original x-position in the document when drag started (incl. scrollOffset)
* @param e.yMouseOrigin {Number} the original y-position in the document when drag started (incl. scrollOffset)
* @param [e.relatives] {NodeList} an optional list that the user could set in a `before`-subscriber of the `dd`-event
*        to inform which nodes are related to the draggable node and should be dragged as well.
* @param [e.relativeDragNodes] {NodeList} an optional list that holds the HtmlElements that corresponds with
*        the `e.relative` list, but is a list with draggable Elements.

* @since 0.0.1
*/

/**
* Emitted when a draggable Element's drag-cycle starts. You can use a `before`-subscriber to specify
* e.relatives, which should be a nodelist with HtmlElements, that should be dragged togehter with the master
* draggable Element.
*
* @event dd (extended by drag-drop)
* @param e {Object} eventobject including:
* @param e.target {HtmlElement} the HtmlElement that is being dragged
* @param e.dragNode {HtmlElement} The HtmlElement that is being dragged (equals e.target)
* @param [e.sourceNode] {HtmlElement} The original Element. Only when a `copy` is made --> e.dragNode is being moved while
*        e.sourceNode stand at its place.
* @param e.currentTarget {HtmlElement} the HtmlElement that is delegating
* @param e.sourceTarget {HtmlElement} the deepest HtmlElement where the mouse lies upon
* @param e.dd {Promise} Promise that gets fulfilled when dragging is ended. The fullfilled-callback has no arguments.
* @param e.ctrlKey {Boolean} Whether the Ctrl/cmd key is pressed
* @param e.isCopied {Boolean} Whether the drag is a copy-drag
* @param e.xMouse {Number} the current x-position in the window-view
* @param e.yMouse {Number} the current y-position in the window-view
* @param e.clientX {Number} the current x-position in the window-view
* @param e.clientY {Number} the current y-position in the window-view
* @param e.xMouseOrigin {Number} the original x-position in the document when drag started (incl. scrollOffset)
* @param e.yMouseOrigin {Number} the original y-position in the document when drag started (incl. scrollOffset)
* @param [e.relatives] {NodeList} an optional list that the user could set in a `before`-subscriber of the `dd`-event
*        to inform which nodes are related to the draggable node and should be dragged as well.
* @param [e.relativeDragNodes] {NodeList} an optional list that holds the HtmlElements that corresponds with
*        the `e.relative` list, but is a list with draggable Elements.

* @since 0.0.1
*/

/**
 * Objecthash containing all specific information about the particular drag-cycle.
 * It has a structure like this:
 *
 * ddProps = {
 *     sourceNode {HtmlElement} original node (defined by drag-drop)
 *     dragNode {HtmlElement} Element that is dragged
 *     x {Number} absolute x-position of the draggable inside `document` when the drag starts
 *     y {Number} absolute y-position of the draggable inside `document` when the drag starts
 *     inlineLeft {String} inline css of the property `left` when drag starts
 *     inlineTop {String} inline css of the property `top` when drag starts
 *     winConstrained {Boolean} whether the draggable should be constrained to `window`
 *     xMouseLast {Number} absolute x-position of the mouse inside `document` when the drag starts
 *     yMouseLast {Number} absolute y-position of the draggable inside `document` when the drag starts
 *     winScrollLeft {Number} the left-scroll of window when drag starts
 *     winScrollTop {Number} the top-scroll of window when drag starts
 *     constrain = { // constrain-properties when constrained to a HtmlElement
 *         xOrig {Number} x-position in the document, included with left-border-width
 *         yOrig {Number} y-position in the document, included with top-border-width
 *         x {Number} xOrig corrected with scroll-left of the constrained node
 *         y {Number} yOrig corrected with scroll-top of the constrained node
 *         w {Number} scrollWidth
 *         h {Number} scrollHeight
 *     };
 *     dropzoneSpecified {Boolean} whether the draggable has a dropzone specified (either by `dd-dropzone` or by `dd-emitter`) (defined by drag-drop)
 *     dragOverEv {Object} Eventhandler that watches for `mousemove` to detect dropzone-over events (defined by drag-drop)
 *     relatives[{ // Array with objects that represent all draggables that come along with the master-draggable (in case of multiple items), excluded the master draggable itself
 *         sourceNode {HtmlElement} original node (defined by drag-drop)
 *         dragNode {HtmlElement} draggable node
 *         shiftX {Number} the amount of left-pixels that this HtmlElement differs from the dragged element
 *         shiftY {Number} the amount of top-pixels that this HtmlElement differs from the dragged element
 *         inlineLeft {String} inline css of the property `left` when drag starts
 *         inlineTop {String} inline css of the property `top` when drag starts
 *     }]
 *     relativeDragNodes [HtmlElements] Array with all `copyied` Nodes corresponding to `ddProps.relatives`. Only in case of copying multiple items (defined by drag-drop)
 * }
 *
 * @property ddProps (extended by drag-drop)
 * @default {}
 * @type Object
 * @since 0.0.1
*/

var DRAG = 'drag',
    DROP = 'drop',
    NAME = '['+DRAG+'-'+DROP+']: ',
    COPY = 'copy',
    DROPZONE = DROP+'zone',
    SOURCE = 'source',
    DRAGGABLE = DRAG+'gable',
    DEL_DRAGGABLE = 'del-'+DRAGGABLE,
    DD_MINUS = 'dd-',
    DD_DRAGGING_CLASS = DD_MINUS+DRAG+'ging',
    DD_MASTER_CLASS = DD_MINUS+'master',
    DD_HANDLE = DD_MINUS+'handle',
    DD_SOURCE_ISCOPIED_CLASS = DD_MINUS+COPY+SOURCE,
    DD_COPIED_CLASS = DD_MINUS+COPY,
    DD_DROPZONE_MOVABLE = DD_MINUS+DROPZONE+'-movable',
    CONSTRAIN_ATTR = 'constrain-selector',
    MOUSE = 'mouse',
    DROPZONE_OVER = DROPZONE+'-over',
    DROPZONE_DROP = DROPZONE+'-'+DROP,
    DD_DROPZONE = DD_MINUS+DROPZONE,
    NO_TRANS_CLASS = 'el-notrans', // delivered by `vdom`
    DD_HIDDEN_SOURCE_CLASS = DD_MINUS+'hidden-'+SOURCE,
    INVISIBLE_CLASS = 'el-invisible', // delivered by `vdom`
    DD_TRANSITION_CLASS = DD_MINUS+'transition',
    DD_OPACITY_CLASS = DD_MINUS+'opacity',
    HIGH_Z_CLASS = DD_MINUS+'high-z',
    DD_DROPACTIVE_CLASS = DROPZONE+'-awake',
    DD_ABOVE_DROPZONE_CLASS = DD_MINUS+'above'+DROPZONE,
    REGEXP_MOVE = /\bmove\b/i,
    REGEXP_COPY = /\bcopy\b/i,
    REGEXP_ALL = /\b(all|true)\b/i,
    EMITTER = 'emitter',
    REGEXP_EMITTER = /\bemitter=((\w|,)+)\b/,
    DD_EMITTER = DD_MINUS+EMITTER,
    MOVE = 'move',
    DROPZONE_OUT = DROPZONE+'-out',
    DD_DROP = DD_MINUS+DROP,
    DD_FAKE = DD_MINUS+'fake-',
    DOWN = 'down',
    UP = 'up',
    KEY = 'key',
    MOUSEMOVE = MOUSE+MOVE,
    PANMOVE = 'pan'+MOVE,
    DD_FAKE_MOUSEMOVE = DD_FAKE+MOUSEMOVE,
    UI = 'UI',
    DROPZONE_BRACKETS = '[' + DD_DROPZONE + ']',
    DD_EFFECT_ALLOWED = DD_MINUS+'effect-allowed',
    BORDER = 'border',
    WIDTH = 'width',
    BORDER_LEFT_WIDTH = BORDER+'-left-'+WIDTH,
    BORDER_RIGHT_WIDTH = BORDER+'-right-'+WIDTH,
    BORDER_TOP_WIDTH = BORDER+'-top-'+WIDTH,
    BORDER_BOTTOM_WIDTH = BORDER+'-bottom-'+WIDTH,
    LEFT = 'left',
    TOP = 'top',
    POSITION = 'position',
    ABSOLUTE = 'absolute',
    TRUE = 'true',
    DD_MINUSDRAGGABLE = DD_MINUS+DRAGGABLE,
    PLUGIN_ATTRS = [DD_DROPZONE, CONSTRAIN_ATTR, DD_EMITTER, DD_HANDLE, DD_EFFECT_ALLOWED, DD_DROPZONE_MOVABLE];

require('polyfill/polyfill-base.js');
require('js-ext');
require('./css/drag-drop.css');

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.DragDrop) {
        return window._ITSAmodules.DragDrop; // DragDrop was already created
    }

    var Event = require('event-dom')(window),
        nodePlugin = require('vdom')(window).Plugins.nodePlugin,
        DragModule = require('drag')(window),
        $superInit = DragModule.DD.init,
        ctrlPressed = false,
        dropEffect = MOVE,
        DOCUMENT = window.document,
        isMobile = require('useragent')(window).isMobile,
        supportHammer = !!Event.Hammer,
        mobileEvents = supportHammer && isMobile,
        DD, DD_Object;

    require('window-ext')(window);

    DD = {
      /**
        * Returns the allowed effects on the dragable-HtmlElement. Is determined by the attribute `dd-effect-allowed`
        * Will be set to "move" when undefined.
        *
        * @method _allowedEffects
        * @param dragableElement {HtmlElement} HtmlElement that is checked for its allowed effects
        * @return {String} allowed effects: "move", "copy" or "all"
        * @private
        * @since 0.0.1
        */
        _allowedEffects: function(dragableElement) {
            console.log(NAME, '_allowedEffects');
            var allowedEffects = dragableElement.getAttr(DD_EFFECT_ALLOWED);
            return allowedEffects || MOVE;
        },

        /**
         * Default function for the `*:dd-drop`-event. Overrides the definition of the `drag`-module.
         *
         * @method _defFnDrop (extended by drag-drop)
         * @param e {Object} eventobject
         * @param sourceNode {HtmlElement} the original HtmlElement
         * @param dragNode {HtmlElement} the dragged HtmlElement (either original or clone)
         * @param dropzoneSpecified {Boolean} whether the sourceNode had a dropzone specified
         * @param relatives {Array} hash with all draggables that are being move togerther with the master draggable
         * @private
         * @since 0.0.1
         */
        _defFnDrop: function(e, ddProps) {
            console.log(NAME, '_defFnDrop: default function dd-drop. dropzoneSpecified: '+ddProps.dropzoneSpecified);
            var instance = this,
                sourceNode = ddProps.sourceNode,
                dragNode = ddProps.dragNode,
                dropzoneSpecified = ddProps.dropzoneSpecified,
                relatives = ddProps.relatives,
                willBeCopied,
                removeClasses = function (node) {
                    node.removeClass([NO_TRANS_CLASS, HIGH_Z_CLASS, DD_DRAGGING_CLASS, DEL_DRAGGABLE, DD_MASTER_CLASS, DD_SOURCE_ISCOPIED_CLASS]);
                };

            willBeCopied =  (e.dropTarget && ((ctrlPressed && instance.allowCopy(dragNode)) || instance.onlyCopy(dragNode)));
            willBeCopied || (e.relativeDragNodes=null);
            e.isCopied = willBeCopied;

            // handle drop
            if (dropzoneSpecified) {
                instance._handleDrop(e, sourceNode, dragNode, relatives);
            }
            else {
                PLUGIN_ATTRS.forEach(function(attribute) {
                    var data = '_del_'+attribute;
                    if (dragNode.getData(data)) {
                        dragNode.removeAttr(attribute);
                        dragNode.removeData(data);
                    }
                });
                removeClasses(dragNode);
                ddProps.relatives && ddProps.relatives.forEach(
                    function(item) {
                        removeClasses(item.dragNode);
                    }
                );
            }
            instance.restoreDraggables = function() {/* NOOP */ return this;};
        },

       /**
         * Default function for the `*:dropzone`-event
         *
         * @method _defFnOver
         * @param e {Object} eventobject
         * @private
         * @since 0.0.1
         */
        _defFnOver: function(e) {
            console.log(NAME, '_defFnOver: default function dropzone');
            var dropzone = e.target;
            dropzone.setClass(DD_DROPACTIVE_CLASS);
            e.sourceNode.setClass(DD_ABOVE_DROPZONE_CLASS);
            e.dragNode.setClass(DD_ABOVE_DROPZONE_CLASS);
            e.dropzone.then(
                function(insideDropTarget) {
                    dropzone.removeClass(DD_DROPACTIVE_CLASS);
                    e.sourceNode.removeClass(DD_ABOVE_DROPZONE_CLASS);
                    e.dragNode.removeClass(DD_ABOVE_DROPZONE_CLASS);
                    /**
                    * Emitted when the draggable gets out of the dropzone.
                    *
                    * @event *:dropzone-out
                    * @param e {Object} eventobject including:
                    * @param e.target {HtmlElement} the dropzone
                    * @param e.dragNode {HtmlElement} The HtmlElement that is being dragged
                    * @param e.dropzone {Promise} The Promise that gets fulfilled as soon as the draggable is dropped, or outside the dropzone
                    *        Will fulfill with one argument: `onDropzone` {Boolean} when `true`, the draggable is dropped inside the dropzone, otherwise
                    *        the draggable got outside the dropzone without beging dropped.
                    * @param e.dropTarget {HtmlElement} The dropzone HtmlElement. Equals e.target
                    * @param e.ctrlKey {Boolean} Whether the Ctrl/cmd key is pressed
                    * @param e.isCopied {Boolean} Whether the drag is a copy-drag
                    * @param [e.sourceNode] {HtmlElement} The original Element. Only when a `copy` is made --> e.dragNode is being moved while
                    *        e.sourceNode stand at its place.
                    * @param e.currentTarget {HtmlElement} the HtmlElement that is delegating the draggable
                    * @param e.sourceTarget {HtmlElement} the deepest HtmlElement of the draggable where the mouse lies upon
                    * @param e.dd {Promise} Promise that gets fulfilled when dragging is ended. The fullfilled-callback has no arguments.
                    * @param e.xMouse {Number} the current x-position in the window-view
                    * @param e.yMouse {Number} the current y-position in the window-view
                    * @param e.clientX {Number} the current x-position in the window-view
                    * @param e.clientY {Number} the current y-position in the window-view
                    * @param e.xMouseOrigin {Number} the original x-position in the document when drag started (incl. scrollOffset)
                    * @param e.yMouseOrigin {Number} the original y-position in the document when drag started (incl. scrollOffset)
                    * @param [e.relatives] {NodeList} an optional list that the user could set in a `before`-subscriber of the `dd`-event
                    *        to inform which nodes are related to the draggable node and should be dragged as well.
                    * @param [e.relativeDragNodes] {NodeList} an optional list that holds the HtmlElements that corresponds with
                    *        the `e.relative` list, but is a list with draggable Elements.
                    * @since 0.1
                    */
                    insideDropTarget || e._noDDoutEvt || Event.emit(dropzone, e.emitter+':'+DROPZONE_OUT, e);
                }
            );
        },

        /**
         * Defines the definition of the `dd-drop` event: the last phase of the drag-eventcycle (dd-start, *:dd-drag, *:dd-drop)
         *
         * @method _defineDropEv
         * @param e {Object} eventobject
         * @param sourceNode {HtmlElement} the original HtmlElement
         * @param dragNode {HtmlElement} the dragged HtmlElement (either original or clone)
         * @param dropzoneSpecified {Boolean} whether the sourceNode had a dropzone specified
         * @param x {Number} x-position in coordinaties relative to `document` (like getX())
         * @param y {Number} y-position in coordinaties relative to `document` (like getX())
         * @param inlineLeft {String} inline css `left` for the original sourceNode
         * @param inlineTop {String} inline css `top` for the original sourceNode
         * @param relatives {Array} hash with all draggables that are being move togerther with the master draggable
         * @private
         * @since 0.0.1
         */
        _defineDropEv: function(e, ddProps) {
            console.log(NAME, '_defineDropEv '+ddProps.dragNode);
            var instance = this;
            instance.restoreDraggables = instance._restoreDraggables.bind(instance, e, ddProps);
            Event.defineEvent(e.emitter+':'+DD_DROP)
                .defaultFn(instance._defFnDrop.rbind(instance, ddProps))
                .forceAssign(); // need to reassign, because all arguments need to be bound again and we need to override the definition of the `drag`-module
        },

        /**
         * Defines the definition of the `dropzone` event.
         * Also sets up listeners to tricker dd-over when the mouse is above an dropzone.
         *
         * @method _defineOverEv
         * @param e {Object} eventobject
         * @param dropzones {NodeList} list with dropzonenodes
         * @private
         * @since 0.0.1
         */
        _defineOverEv: function(e, dropzones) {
            console.log(NAME, '_defineOverEv');
            var instance = this,
                emitterName = e.emitter,
                ddProps = instance.ddProps;
            Event.defineEvent(emitterName+':'+DROPZONE_OVER)
                 .defaultFn(instance._defFnOver.bind(instance)); // no need to reassign
            return Event.after([mobileEvents ? PANMOVE : MOUSEMOVE, DD_FAKE_MOUSEMOVE], function(e2) {
                var overDropzone = false,
                    dragNode = ddProps.dragNode;
                if (typeof e2.center==='object') {
                    e2.clientX = e2.center.x;
                    e2.clientY = e2.center.y;
                }
                ddProps.mouseOverNode = e.target;
                if (e2.clientX) {
                    ddProps.xMouseLast = e2.clientX + window.getScrollLeft();
                    ddProps.yMouseLast = e2.clientY + window.getScrollTop();
                }
                dropzones.forEach(
                    function(dropzone) {
                        // don't do double:
                        if (dropzone === e.dropTarget) {
                            overDropzone = true;
                            return;
                        }
                        var dropzoneAccept = dropzone.getAttr(DD_DROPZONE) || '',
                            dropzoneMove = REGEXP_MOVE.test(dropzoneAccept),
                            dropzoneCopy = REGEXP_COPY.test(dropzoneAccept),
                            dropzoneDefDraggable = dragNode.getAttr(DD_DROPZONE),
                            dragOverPromise, dragOutEvent, effectAllowed, emitterAllowed, dropzoneEmitter, xMouseLast, yMouseLast, dropzoneAllowed;

                        // check if the mouse is inside the dropzone
                        // also check if the mouse is inside the dragged node: the dragged node might have been constrained
                        // and check if the dragged node is effectAllowed to go into the dropzone
                        xMouseLast = ddProps.xMouseLast;
                        yMouseLast = ddProps.yMouseLast;

                        if (dropzone.insidePos(xMouseLast, yMouseLast) && dragNode.insidePos(xMouseLast, yMouseLast)) {
                            effectAllowed = (!dropzoneMove && !dropzoneCopy) || (dropzoneCopy && (dropEffect===COPY)) || (dropzoneMove && (dropEffect===MOVE));
                            dropzoneEmitter = instance.getDropzoneEmitter(dropzoneAccept);
                            emitterAllowed = !dropzoneEmitter || (dropzoneEmitter.contains(emitterName));
                            dropzoneAllowed = !dropzoneDefDraggable || ((dropzoneDefDraggable===TRUE) || dropzone.matchesSelector(dropzoneDefDraggable));
                            if (dropzoneAllowed && effectAllowed && emitterAllowed) {
                                overDropzone = true;
                                e.dropTarget = dropzone;
                                // mouse is in area of dropzone
                                dragOverPromise = Promise.manage();
                                e.dropzone = dragOverPromise;
                                dragOutEvent = Event.after(
                                    [mobileEvents ? PANMOVE : MOUSEMOVE, DD_FAKE_MOUSEMOVE],
                                    function() {
                                        dragOverPromise.fulfill(false);
                                    },
                                    function(e3) {
                                        var effectAllowed, dropzoneAccept, dropzoneMove, dropzoneCopy;
                                        if (e3.type===DD_FAKE_MOUSEMOVE) {
                                            dropzoneAccept = dropzone.getAttr(DD_DROPZONE) || '';
                                            dropzoneMove = REGEXP_MOVE.test(dropzoneAccept);
                                            dropzoneCopy = REGEXP_COPY.test(dropzoneAccept);
                                            effectAllowed = (!dropzoneMove && !dropzoneCopy) || (dropzoneCopy && (dropEffect===COPY)) || (dropzoneMove && (dropEffect===MOVE));
                                            return !effectAllowed;
                                        }
                                        return !dropzone.insidePos((e3.clientX || e3.center.x)+window.getScrollLeft(), (e3.clientY || e3.center.y)+window.getScrollTop());
                                    }
                                );
                                dragOverPromise.finally(
                                    function(insideDropzone) {
                                        dragOutEvent.detach();
                                        insideDropzone || (e.dropTarget=null);
                                    }
                                );
                                ddProps.dragOverList.push(dragOverPromise);
                                /**
                                * Emitted when the draggable gets inside a dropzone.
                                *
                                * @event *:dropzone-over
                                * @param e {Object} eventobject including:
                                * @param e.target {HtmlElement} the dropzone
                                * @param e.dragNode {HtmlElement} The HtmlElement that is being dragged
                                * @param e.dropzone {Promise} The Promise that gets fulfilled as soon as the draggable is dropped, or outside the dropzone
                                *        Will fulfill with one argument: `onDropzone` {Boolean} when `true`, the draggable is dropped inside the dropzone, otherwise
                                *        the draggable got outside the dropzone without beging dropped.
                                * @param e.dropTarget {HtmlElement} The dropzone HtmlElement. Equals e.target
                                * @param e.ctrlKey {Boolean} Whether the Ctrl/cmd key is pressed
                                * @param e.isCopied {Boolean} Whether the drag is a copy-drag
                                * @param [e.sourceNode] {HtmlElement} The original Element. Only when a `copy` is made --> e.dragNode is being moved while
                                *        e.sourceNode stand at its place.
                                * @param e.currentTarget {HtmlElement} the HtmlElement that is delegating the draggable
                                * @param e.sourceTarget {HtmlElement} the deepest HtmlElement of the draggable where the mouse lies upon
                                * @param e.dd {Promise} Promise that gets fulfilled when dragging is ended. The fullfilled-callback has no arguments.
                                * @param e.xMouse {Number} the current x-position in the window-view
                                * @param e.yMouse {Number} the current y-position in the window-view
                                * @param e.clientX {Number} the current x-position in the window-view
                                * @param e.clientY {Number} the current y-position in the window-view
                                * @param e.xMouseOrigin {Number} the original x-position in the document when drag started (incl. scrollOffset)
                                * @param e.yMouseOrigin {Number} the original y-position in the document when drag started (incl. scrollOffset)
                                * @param [e.relatives] {NodeList} an optional list that the user could set in a `before`-subscriber of the `dd`-event
                                *        to inform which nodes are related to the draggable node and should be dragged as well.
                                * @param [e.relativeDragNodes] {NodeList} an optional list that holds the HtmlElements that corresponds with
                                *        the `e.relative` list, but is a list with draggable Elements.
                                * @since 0.1
                                */
                                Event.emit(dropzone, emitterName+':'+DROPZONE_OVER, e);
                            }
                        }
                    }
                );
                overDropzone || (e.dropTarget=null);
            });
        },

       /**
         * Emits a dropzone-drop event.
         *
         * @method _emitDropzoneDrop
         * @param e {Object} eventobject to pass arround
         * @private
         * @since 0.0.1
         */
        _emitDropzoneDrop: function(e) {
            /**
            * Emitted when a draggable gets dropped inside a dropzone.
            *
            * @event *:dropzone-drop
            * @param e {Object} eventobject including:
            * @param e.target {HtmlElement} the dropzone
            * @param e.dragNode {HtmlElement} The HtmlElement that is being dragged
            * @param e.dropzone {Promise} The Promise that gets fulfilled as soon as the draggable is dropped, or outside the dropzone
            *        Will fulfill with one argument: `onDropzone` {Boolean} when `true`, the draggable is dropped inside the dropzone, otherwise
            *        the draggable got outside the dropzone without beging dropped.
            * @param e.dropTarget {HtmlElement} The dropzone HtmlElement. Equals e.target
            * @param e.ctrlKey {Boolean} Whether the Ctrl/cmd key is pressed
            * @param e.isCopied {Boolean} Whether the drag is a copy-drag
            * @param [e.sourceNode] {HtmlElement} The original Element. Only when a `copy` is made --> e.dragNode is being moved while
            *        e.sourceNode stand at its place.
            * @param e.currentTarget {HtmlElement} the HtmlElement that is delegating the draggable
            * @param e.sourceTarget {HtmlElement} the deepest HtmlElement of the draggable where the mouse lies upon
            * @param e.dd {Promise} Promise that gets fulfilled when dragging is ended. The fullfilled-callback has no arguments.
            * @param e.xMouse {Number} the current x-position in the window-view
            * @param e.yMouse {Number} the current y-position in the window-view
            * @param e.clientX {Number} the current x-position in the window-view
            * @param e.clientY {Number} the current y-position in the window-view
            * @param e.xMouseOrigin {Number} the original x-position in the document when drag started (incl. scrollOffset)
            * @param e.yMouseOrigin {Number} the original y-position in the document when drag started (incl. scrollOffset)
            * @param [e.relatives] {NodeList} an optional list that the user could set in a `before`-subscriber of the `dd`-event
            *        to inform which nodes are related to the draggable node and should be dragged as well.
            * @param [e.relativeDragNodes] {NodeList} an optional list that holds the HtmlElements that corresponds with
            *        the `e.relative` list, but is a list with draggable Elements.
            * @since 0.1
            */
            Event.emit(e.dropTarget, e.emitter+':'+DROPZONE_DROP, e);
        },

      /**
        * Sets the draggable node back to its original position
        *
        * @method _handleDrop
        * @param e {Object} eventobject
        * @param sourceNode {HtmlElement} the original HtmlElement
        * @param dragNode {HtmlElement} the dragged HtmlElement (either original or clone)
        * @param relatives {Array} hash with all draggables that are being move togerther with the master draggable
        * @private
        * @since 0.0.1
        */
        _handleDrop: function(e, sourceNode, dragNode, relatives) {
            console.log(NAME, '_handleDrop '+dragNode);
            var instance = this,
                dropzoneNode = e.dropTarget,
                delegatedDragging = sourceNode.hasClass(DEL_DRAGGABLE),
                constrainRectangle, borderLeft, borderTop, dragNodeX, dragNodeY, copyToDropzone, moveToDropzone,
                moveInsideDropzone, isCopied, dropzoneDelegatedDraggable, dropzoneIsDelegated;
            if (dropzoneNode) {
                dropzoneDelegatedDraggable = dropzoneNode.getAttr(DD_MINUSDRAGGABLE);
                dropzoneIsDelegated = dropzoneDelegatedDraggable && (dropzoneNode.getAttr(DD_MINUSDRAGGABLE)!=='true');
                copyToDropzone = function(nodeSource, nodeDrag, shiftX, shiftY) {
                    if (delegatedDragging) {
                        dropzoneIsDelegated || nodeDrag.setAttr(DD_MINUSDRAGGABLE, TRUE);
                        nodeDrag.removeClass(DEL_DRAGGABLE);
                    }
                    PLUGIN_ATTRS.forEach(function(attribute) {
                        var data = '_del_'+attribute,
                            attr = sourceNode.getData(data);
                        if (attr) {
                            if (dropzoneIsDelegated) {
                                nodeDrag.removeAttr(attribute);
                            }
                            else {
                                nodeDrag.setAttr(attribute, attr);
                            }
                            nodeSource.removeAttr(attribute);
                            nodeSource.removeData(data);
                            nodeDrag.removeData(data);
                        }
                    });
                    dropzoneNode.append(nodeDrag);
                    nodeDrag.removeClass([DD_OPACITY_CLASS, DD_TRANSITION_CLASS, HIGH_Z_CLASS, DD_DRAGGING_CLASS, NO_TRANS_CLASS, DD_MASTER_CLASS, DD_COPIED_CLASS]);
                    nodeSource.removeClass(DD_SOURCE_ISCOPIED_CLASS);
                    nodeDrag.setXY(dragNodeX+shiftX, dragNodeY+shiftY, constrainRectangle, true);
                    // make the new HtmlElement non-copyable: it only can be replaced inside its dropzone
                    dropzoneIsDelegated || nodeDrag.setAttr(DD_EFFECT_ALLOWED, MOVE).setAttr(DD_DROPZONE_MOVABLE, TRUE); // to make moving inside the dropzone possible without return to its startposition
                };
                moveToDropzone = function(nodeSource, nodeDrag, shiftX, shiftY) {
                    nodeSource.setInlineStyle(POSITION, ABSOLUTE);
                    if (delegatedDragging) {
                        dropzoneIsDelegated || nodeSource.setAttr(DD_MINUSDRAGGABLE, TRUE);
                        nodeSource.removeClass(DEL_DRAGGABLE);
                    }
                    PLUGIN_ATTRS.forEach(function(attribute) {
                        var data = '_del_'+attribute,
                            attr = sourceNode.getData(data);
                        if (attr) {
                            if (dropzoneIsDelegated) {
                                nodeSource.removeAttr(attribute);
                            }
                            else {
                                nodeSource.setAttr(attribute, attr);
                            }
                            nodeSource.removeData(data);
                        }
                    });
                    dropzoneNode.append(nodeSource);
                    nodeSource.setXY(dragNodeX+shiftX, dragNodeY+shiftY, constrainRectangle, true);
                    // make the new HtmlElement non-copyable: it only can be replaced inside its dropzone
                    dropzoneIsDelegated || nodeSource.setAttr(DD_EFFECT_ALLOWED, MOVE).setAttr(DD_DROPZONE_MOVABLE, TRUE); // to make moving inside the dropzone possible without return to its startposition
                    nodeSource.removeClass(DD_HIDDEN_SOURCE_CLASS);
                    nodeDrag.remove();
                };
                // reset its position, only now constrain it to the dropzondenode
                // we need to specify exactly the droparea: because we don't want to compare to any
                // scrollWidth/scrollHeight, but exaclty to the visible part of the dropzone
                borderLeft = parseInt(dropzoneNode.getStyle(BORDER_LEFT_WIDTH), 10);
                borderTop = parseInt(dropzoneNode.getStyle(BORDER_TOP_WIDTH), 10);
                constrainRectangle = {
                    x: dropzoneNode.left + borderLeft,
                    y: dropzoneNode.top + borderTop,
                    w: dropzoneNode.offsetWidth - borderLeft - parseInt(dropzoneNode.getStyle(BORDER_RIGHT_WIDTH), 10),
                    h: dropzoneNode.offsetHeight - borderTop - parseInt(dropzoneNode.getStyle(BORDER_BOTTOM_WIDTH), 10)
                };
                isCopied = (ctrlPressed && instance.allowCopy(dragNode)) || instance.onlyCopy(dragNode);
                if (isCopied) {
                    // backup x,y before move it into dropzone (which leads to new x,y)
                    dragNodeX = dragNode.left;
                    dragNodeY = dragNode.top;
                    // now move the dragNode into dropzone
                    relatives && relatives.forEach(
                        function(item) {
                            (dragNode!==item.dragNode) && copyToDropzone(item.sourceNode, item.dragNode, item.shiftX, item.shiftY);
                        }
                    );
                    copyToDropzone(sourceNode, dragNode, 0 ,0);
                }
                else {
                    dragNodeX = dragNode.left;
                    dragNodeY = dragNode.top;
                    relatives && relatives.forEach(
                        function(item) {
                           (dragNode!==item.dragNode) && moveToDropzone(item.sourceNode, item.dragNode, item.shiftX, item.shiftY);
                        }
                    );
                    moveToDropzone(sourceNode, dragNode, 0, 0);
                }

                sourceNode.removeClass(DEL_DRAGGABLE);
                instance._emitDropzoneDrop(e);
            }
            else {
                (dragNode.hasAttr(DD_DROPZONE_MOVABLE)) && (dropzoneNode=dragNode.inside(DROPZONE_BRACKETS));
                if (dropzoneNode && dragNode.rectangleInside(dropzoneNode)) {
                    moveInsideDropzone = function(hasMatch, nodeSource, nodeDrag, shiftX, shiftY) {
                        hasMatch && nodeSource.setXY(nodeSource+shiftX, nodeSource+shiftY, constrainRectangle, true);
                        if (delegatedDragging) {
                            nodeSource.removeClass(DEL_DRAGGABLE);
                        }
                        PLUGIN_ATTRS.forEach(function(attribute) {
                            var data = '_del_'+attribute,
                                attr = dragNode.getData(data);
                            if (attr) {
                                if (dropzoneIsDelegated) {
                                    nodeSource.removeAttr(attribute);
                                }
                                else {
                                    nodeSource.setAttr(attribute, attr);
                                }
                                nodeSource.removeData(data);
                            }
                        });
                        nodeSource.removeClass(DD_HIDDEN_SOURCE_CLASS);
                        nodeDrag.remove();
                    };
                    // reset its position, only now constrain it to the dropzondenode
                    // we need to specify exactly the droparea: because we don't want to compare to any
                    // scrollWidth/scrollHeight, but exaclty to the visible part of the dropzone
                    dropzoneDelegatedDraggable = dropzoneNode.getAttr(DD_MINUSDRAGGABLE);
                    dropzoneIsDelegated = dropzoneDelegatedDraggable && (dropzoneNode.getAttr(DD_MINUSDRAGGABLE)!=='true');
                    borderLeft = parseInt(dropzoneNode.getStyle(BORDER_LEFT_WIDTH), 10);
                    borderTop = parseInt(dropzoneNode.getStyle(BORDER_TOP_WIDTH), 10);
                    constrainRectangle = {
                        x: dropzoneNode.left + borderLeft,
                        y: dropzoneNode.top + borderTop,
                        w: dropzoneNode.offsetWidth - borderLeft - parseInt(dropzoneNode.getStyle(BORDER_RIGHT_WIDTH), 10),
                        h: dropzoneNode.offsetHeight - borderTop - parseInt(dropzoneNode.getStyle(BORDER_BOTTOM_WIDTH), 10)
                    };
                    dragNodeX = dragNode.left;
                    dragNodeY = dragNode.top;
                    relatives && relatives.forEach(
                        function(item) {
                            (sourceNode!==item.sourceNode) && moveInsideDropzone(dropzoneNode, item.sourceNode, item.dragNode, item.shiftX, item.shiftY);
                        }
                    );
                    moveInsideDropzone(dropzoneNode, sourceNode, dragNode, 0, 0);
                }
                else {
                    instance.restoreDraggables();
                }
            }
            sourceNode.removeClass(DD_MASTER_CLASS);
            dragNode.removeClass(DD_MASTER_CLASS);
        },

       /**
         * Sets the draggable items back to their original place. Should only be used when you prevent the default-function of `dd-drop`,
         * so you can choose to do set the draggables back conditionally.
         *
         * @method _restoreDraggables
         * @param e {Object} eventobject
         * @param sourceNode {HtmlElement} the original HtmlElement
         * @param dragNode {HtmlElement} the dragged HtmlElement (either original or clone)
         * @param dropzoneSpecified {Boolean} whether the sourceNode had a dropzone specified
         * @param x {Number} x-position in coordinaties relative to `document` (like getX())
         * @param y {Number} y-position in coordinaties relative to `document` (like getX())
         * @param inlineLeft {String} inline css `left` for the original sourceNode
         * @param inlineTop {String} inline css `top` for the original sourceNode
         * @param relatives {Array} hash with all draggables that are being move togerther with the master draggable
         * @private
         * @since 0.0.1
         */
        _restoreDraggables: function(e, ddProps) {
            console.log(NAME, '_restoreDraggables');
            var instance = this,
                sourceNode = ddProps.sourceNode,
                dragNode = ddProps.dragNode,
                dropzoneSpecified = ddProps.dropzoneSpecified,
                x = ddProps.x,
                y = ddProps.y,
                inlineLeft = ddProps.inlineLeft,
                inlineTop = ddProps.inlineTop,
                relatives = ddProps.relatives;
            instance.restoreDraggables = function() {/* NOOP */ return this;};
            instance._setBack(e, sourceNode, dragNode, dropzoneSpecified, x, y, inlineLeft, inlineTop, e.dropzone);
            relatives && relatives.forEach(
                function(item) {
                    (dragNode!==item.dragNode) && instance._setBack(e, item.sourceNode, item.dragNode, dropzoneSpecified, x+item.shiftX, y+item.shiftY, item.inlineLeft, item.inlineTop);
                }
            );
            return instance;
        },

      /**
        * Sets the draggable node back to its original position
        *
        * @method _setBack
        * @param sourceNode {HtmlElement} the original HtmlElement
        * @param dragNode {HtmlElement} the dragged HtmlElement (either original or clone)
        * @param dropzoneSpecified {Boolean} whether the sourceNode had a dropzone specified
        * @param x {Number} x-position in coordinaties relative to `document` (like getX())
        * @param y {Number} y-position in coordinaties relative to `document` (like getX())
        * @param inlineLeft {String} inline css `left` for the original sourceNode
        * @param inlineTop {String} inline css `top` for the original sourceNode
        * @param [emitDropzoneEvent] {Boolean} whether dropzone-event should be emitted
        * @private
        * @since 0.0.1
        */
        _setBack: function(e, sourceNode, dragNode, dropzoneSpecified, x, y, inlineLeft, inlineTop, emitDropzoneEvent) {
            console.log(NAME, '_setBack to '+x+', '+y);
            var tearedDown,
                winScrollTop,
                winScrollLeft,
                dropzones,
                tearDown = function() {
                    // dragNode might be gone when this method is called for the second time
                    // therefor check its existance:
                    if (!tearedDown) {
                        tearedDown = true;
// notransRemoval || (dragNode.removeEventListener && dragNode.removeEventListener(TRANS_END, tearDown, true));
                        if (dropzoneSpecified) {
                            sourceNode.removeClass([DD_HIDDEN_SOURCE_CLASS, DEL_DRAGGABLE, DD_MASTER_CLASS, DD_SOURCE_ISCOPIED_CLASS]);
                            dragNode.remove();
                        }
                        else {
                            dragNode.removeClass([DD_TRANSITION_CLASS, HIGH_Z_CLASS, DD_DRAGGING_CLASS, DEL_DRAGGABLE, DD_MASTER_CLASS, DD_SOURCE_ISCOPIED_CLASS]);
                            dragNode.setInlineStyle(LEFT, inlineLeft)
                                    .setInlineStyle(TOP, inlineTop);
                        }
                        PLUGIN_ATTRS.forEach(function(attribute) {
                            var data = '_del_'+attribute;
                            if (sourceNode.getData(data)) {
                                sourceNode.removeAttr(attribute)
                                          .removeData(data);
                            }
                        });
                    }
                };
            dragNode.removeClass([NO_TRANS_CLASS, DD_DRAGGING_CLASS]);
            dragNode.setClass(DD_TRANSITION_CLASS);
            // transitions only work with IE10+, and that browser has addEventListener
            // when it doesn't have, it doesn;t harm to leave the transitionclass on: it would work anyway
            // nevertheless we will remove it with a timeout
// if (dragNode.addEventListener) {
    // dragNode.addEventListener(TRANS_END, tearDown, true);
// }
// ALWAYS tearDowm after delay --> when there was no repositioning, there never will be a transition-event
// LATER(tearDown, 260);
            dragNode.setXY(x, y).finally(tearDown);
            // now we might need to fire a last `dropzone` event when the dragged element returns to a dropzone when it wasn't before set it back
            if (emitDropzoneEvent) {
                dropzones = DOCUMENT.getAll(DROPZONE_BRACKETS);
                if (dropzones) {
                    winScrollTop = window.getScrollTop();
                    winScrollLeft = window.getScrollLeft();
                    dropzones.forEach(
                        function(dropzone) {
                            if (dropzone.insidePos(x, y) && !dropzone.insidePos(e.xMouse+winScrollLeft, e.yMouse+winScrollTop)) {
                                e.dropTarget = dropzone;
                                e._noDDoutEvt = true;
                                Event.emit(dropzone, e.emitter+':'+DROPZONE_OVER, e);
                            }
                        }
                    );
                }
            }
        },

      /**
        * Sets up a `keydown` and `keyup` listener, to monitor whether a `ctrlKey` (windows) or `metaKey` (Mac)
        * is pressed to support the copying of draggable items
        *
        * @method _setupKeyEv
        * @private
        * @since 0.0.1
        */
        _setupKeyEv: function() {
            console.log(NAME, '_setupKeyEv');
            var instance = this,
                changeClasses = function(sourceNode, dragNode) {
                    sourceNode.toggleClass(DD_HIDDEN_SOURCE_CLASS, !ctrlPressed);
                    sourceNode.toggleClass(DD_SOURCE_ISCOPIED_CLASS, ctrlPressed);
                    dragNode.toggleClass([DD_OPACITY_CLASS, DD_COPIED_CLASS], ctrlPressed);
                };
            Event.after([KEY+DOWN, KEY+UP], function(e) {
                console.log(NAME, 'event '+e.type);
                var ddProps = instance.ddProps,
                    sourceNode = ddProps.sourceNode,
                    dragNode, mouseOverNode;
                ctrlPressed = e.ctrlKey || e.metaKey;
                if (sourceNode && instance.allowSwitch(sourceNode)) {
                    dragNode = ddProps.dragNode;
                    mouseOverNode = ddProps.mouseOverNode;
                    dropEffect = ctrlPressed ? COPY : MOVE;
                    changeClasses(sourceNode, dragNode);
                    ddProps.relatives && ddProps.relatives.forEach(
                        function(item) {
                            changeClasses(item.sourceNode, item.dragNode);
                        }
                    );
                    // now, it could be that any droptarget should change its appearance (DD_DROPACTIVE_CLASS).
                    // we need to recalculate it for all targets
                    // we do this by emitting a DD_FAKE_MOUSEMOVE event
                    /**
                    * Fired when the mouse comes back into the browser-window while dd-drag was busy yet no buttons are pressed.
                    * This is a correction to the fact that the mouseup-event wasn't noticed because the mouse was outside the browser.
                    *
                    * @event dd-fake-mousemove
                    * @private
                    * @since 0.1
                    */
                    mouseOverNode && Event.emit(mouseOverNode, UI+':'+DD_FAKE_MOUSEMOVE);
                }
            });
        },

      /**
        * Cleansup the dragover subscriber and fulfills any dropzone-promise.
        *
        * @method _teardownOverEvent
        * @param e {Object} eventobject
        * @private
        * @since 0.0.1
        */
        _teardownOverEvent: function(e, ddProps) {
            console.log('_teardownOverEvent');
            var dragOverEvent = ddProps.dragOverEv,
                mouseX = e.xMouse,
                mouseY = e.yMouse,
                winScrollTop, winScrollLeft;
            if (dragOverEvent) {
                dragOverEvent.detach();
                winScrollTop = window.getScrollTop();
                winScrollLeft = window.getScrollLeft();
                ddProps.dragOverList.forEach(function(promise) {
                    promise.fulfill(e.dropTarget && e.dropTarget.insidePos(mouseX+winScrollLeft, mouseY+winScrollTop));
                });
            }
        },

       /**
         * Returns true if the dropzone-HtmlElement accepts copy-dragables.
         * Is determined by the attribute `dd-effect-allowed="copy"` or `dd-effect-allowed="all"`
         *
         * @method allowCopy
         * @param dropzone {HtmlElement} HtmlElement that is checked for its allowed effects
         * @return {Boolean} if copy-dragables are allowed
         * @since 0.0.1
         */
        allowCopy: function(dropzone) {
            var allowedEffects = this._allowedEffects(dropzone);
            console.log('allowCopy --> '+REGEXP_ALL.test(allowedEffects) || REGEXP_COPY.test(allowedEffects));
            return REGEXP_ALL.test(allowedEffects) || REGEXP_COPY.test(allowedEffects);
        },

       /**
         * Returns true if the dragable-HtmlElement allowes to switch between `copy` and `move`.
         *
         * @method allowSwitch
         * @param dragableElement {HtmlElement} HtmlElement that is checked for its allowed effects
         * @return {Boolean} if copy-dragables are allowed
         * @since 0.0.1
         */
        allowSwitch: function(dragableElement) {
            console.log('allowSwitch --> '+REGEXP_ALL.test(this._allowedEffects(dragableElement)));
            return REGEXP_ALL.test(this._allowedEffects(dragableElement));
        },

       /**
         * Returns the emitterName that the dropzone accepts.
         *
         * @method getDropzoneEmitter
         * @param dropzone {String} dropzone attribute of the dropzone HtmlElement
         * @return {String|null} the emitterName that is accepted
         * @since 0.0.1
         */
        getDropzoneEmitter: function(dropzone) {
            var extract = dropzone.match(REGEXP_EMITTER);
            console.log('getDropzoneEmitter --> '+(extract && extract[1]));
            return extract && (','+extract[1]+',');
        },

       /**
         * Initializes dragdrop. Needs to be invoked, otherwise DD won't run.
         *
         * @method init (extended by drag-drop)
         * @param dragableElement {HtmlElement} HtmlElement that is checked for its allowed effects
         * @return {Boolean} if copy-dragables are allowed
         * @since 0.0.1
         */
        init: function() {
            console.log(NAME, 'init');
            var instance = this;
            if (!instance._ddInited) {
                // we will initialize `Drag` --> don;t worry if it was initialised before,
                // Drag.init() will only run once
                $superInit.call(instance);
                instance._setupKeyEv();

                instance.notify(function(e, ddProps) {
                    var dropzones, sourceNode,
                        dragNode = ddProps.dragNode,
                        dropzoneSpecified = ddProps.dropzoneSpecified = dragNode.hasAttr(DD_DROPZONE) || dragNode.hasAttr(DD_EMITTER) || (e.emitter!==UI),
                        setupDragnode = function(nodeSource, nodeDrag, shiftX, shiftY) {
                            if (dropEffect===COPY) {
                                nodeDrag.setClass([DD_OPACITY_CLASS, DD_COPIED_CLASS]);
                                nodeSource.setClass(DD_SOURCE_ISCOPIED_CLASS);
                            }
                            else {
                                nodeSource.setClass(DD_HIDDEN_SOURCE_CLASS);
                            }
                            nodeDrag.setClass(INVISIBLE_CLASS);
                            nodeDrag.setInlineStyle(POSITION, ABSOLUTE);
                            nodeSource.parentNode.append(nodeDrag, false, nodeSource);
                            nodeDrag.setXY(ddProps.xMouseLast+shiftX, ddProps.yMouseLast+shiftY, ddProps.constrain, true);
                            nodeDrag.removeClass(INVISIBLE_CLASS);
                        };
                    if (dropzoneSpecified) {
                        sourceNode = e.sourceNode = ddProps.sourceNode = ddProps.dragNode;
                        e.dragNode = ddProps.dragNode = ddProps.sourceNode.cloneNode(true);
                        // correct sourceNode class: reset CSS set by `drag`:
                        sourceNode.removeClass([NO_TRANS_CLASS, HIGH_Z_CLASS, DD_DRAGGING_CLASS]);
                        // also correct inline CSS style for `left` and `top` of the sourceNode:
                        sourceNode.setInlineStyle(LEFT, ddProps.inlineLeft);
                        sourceNode.setInlineStyle(TOP, ddProps.inlineTop);

                        dropEffect = (instance.onlyCopy(dragNode) || (ctrlPressed && instance.allowCopy(dragNode))) ? COPY : MOVE;
                        setupDragnode(ddProps.sourceNode, ddProps.dragNode, 0, 0);
                        if (ddProps.relatives) {
                            e.relativeDragNodes = [];
                            ddProps.relatives.forEach(
                                function(item) {
                                    item.sourceNode = item.dragNode;
                                    item.dragNode = item.dragNode.cloneNode(true);
                                    setupDragnode(item.sourceNode, item.dragNode, item.shiftX, item.shiftY);
                                    e.relativeDragNodes.push(item.dragNode);
                                }
                            );
                        }
                        dropzones = DOCUMENT.getAll(DROPZONE_BRACKETS);
                        if (dropzones.length>0) {
                            // create a custom over-event that fires exactly when the mouse is over any dropzone
                            // we cannot use `hover`, because that event fails when there is an absolute floated element outsize `dropzone`
                            // lying on top of the dropzone. -> we need to check by coördinates
                            ddProps.dragOverEv = instance._defineOverEv(e, dropzones);

                        }
                    }
                    else {
                        e.dragNode = ddProps.dragNode;
                    }
                    ddProps.dragDropEv = instance._defineDropEv(e, ddProps);
                }, instance, true);

                instance.notify(instance._teardownOverEvent, instance);

            }
            instance._ddInited = true;
        },

       /**
         * Returns true if the dragable-HtmlElement accepts only copy-dragables (no moveable)
         * Is determined by the attribute `dd-effect-allowed="copy"`
         *
         * @method onlyCopy
         * @param dragableElement {HtmlElement} HtmlElement that is checked for its allowed effects
         * @return {Boolean} if only copy-dragables are allowed
         * @since 0.0.1
         */
        onlyCopy: function(dragableElement) {
            console.log('onlyCopy --> '+REGEXP_COPY.test(this._allowedEffects(dragableElement)));
            return REGEXP_COPY.test(this._allowedEffects(dragableElement));
        },

       /**
         * Sets the draggable items back to their original place. Should only be used when you prevent the default-function of `dd-drop`,
         * so you can choose to do set the draggables back conditionally.
         *
         * @method restoreDraggables
         * @private
         * @chainable
         * @since 0.0.1
         */
        restoreDraggables: function() {/* NOOP */ return this;}

    };

    DD_Object = window._ITSAmodules.DragDrop = {
        DD: DragModule.DD.merge(DD, true),
        Plugins: {
            nodeDD: DragModule.Plugins.nodeDD,
            nodeDropzone: nodePlugin.definePlugin('dd', {dropzone: 'true'})
        }
    };

    return DD_Object;

};
},{"./css/drag-drop.css":10,"drag":13,"event-dom":14,"js-ext":29,"polyfill/polyfill-base.js":40,"useragent":41,"vdom":55,"window-ext":56}],12:[function(require,module,exports){
module.exports=require(10)
},{"/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify":1}],13:[function(require,module,exports){
"use strict";

/**
 * Provides `drag and drop` functionality, without dropzones.
 * For `dropzone`-support, you should use the module: `drag-drop`.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @example
 * DD = require('drag')(window);
 * DD.init();
 *
 * @module drag
 * @class DD
 * @since 0.0.4
*/

var NAME = '[drag]: ',
    DRAG = 'drag',
    DROP = 'drop',
    DRAGGABLE = DRAG+'gable',
    DEL_DRAGGABLE = 'del-'+DRAGGABLE,
    DD_MINUS = 'dd-',
    DD_DRAGGING_CLASS = DD_MINUS+DRAG+'ging',
    DD_MASTER_CLASS = DD_MINUS+'master',
    DD_HANDLE = DD_MINUS+'handle',
    DD_DROPZONE_MOVABLE = DD_MINUS+'dropzone-movable',
    CONSTRAIN_ATTR = 'constrain-selector',
    MOUSE = 'mouse',
    DROPZONE = 'dropzone',
    NO_TRANS_CLASS = 'el-notrans', // delivered by `vdom`
    HIGH_Z_CLASS = DD_MINUS+'high-z',
    REGEXP_NODE_ID = /^#\S+$/,
    EMITTER = 'emitter',
    DD_EMITTER = DD_MINUS+EMITTER,
    DD_DRAG = DD_MINUS+DRAG,
    DD_DROP = DD_MINUS+DROP,
    DD_FAKE = DD_MINUS+'fake-',
    DOWN = 'down',
    UP = 'up',
    MOVE = 'move',
    MOUSEUP = MOUSE+UP,
    MOUSEDOWN = MOUSE+DOWN,
    MOUSEMOVE = MOUSE+MOVE,
    PAN = 'pan',
    PANSTART = PAN+'start',
    PANMOVE = PAN+MOVE,
    PANEND = PAN+'end',
    DD_FAKE_MOUSEUP = DD_FAKE+MOUSEUP,
    UI = 'UI',
    DD_EFFECT_ALLOWED = DD_MINUS+'effect-allowed',
    BORDER = 'border',
    WIDTH = 'width',
    BORDER_LEFT_WIDTH = BORDER+'-left-'+WIDTH,
    BORDER_TOP_WIDTH = BORDER+'-top-'+WIDTH,
    LEFT = 'left',
    TOP = 'top',
    WINDOW = 'window',
    TRUE = 'true',
    NO_OVERFLOW = 'itsa-no-overflow',
    DD_MINUSDRAGGABLE = DD_MINUS+DRAGGABLE,
    PLUGIN_ATTRS = [DD_MINUS+DROPZONE, CONSTRAIN_ATTR, DD_EMITTER, DD_HANDLE, DD_EFFECT_ALLOWED, DD_DROPZONE_MOVABLE];

require('polyfill');
require('js-ext');
require('./css/drag.css');

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.Drag) {
        return window._ITSAmodules.Drag; // Drag was already created
    }

    var Event = require('event-dom')(window),
        nodePlugin = require('vdom')(window).Plugins.nodePlugin,
        isMobile = require('useragent')(window).isMobile,
        bodyNode = window.document.body,
        supportHammer = !!Event.Hammer,
        mobileEvents = supportHammer && isMobile,
        DD, DD_Object;

    require('window-ext')(window);

    DD = {
        /**
         * Objecthash containing all specific information about the particular drag-cycle.
         * It has a structure like this:
         *
         * ddProps = {
         *     dragNode {HtmlElement} Element that is dragged
         *     x {Number} absolute x-position of the draggable inside `document` when the drag starts
         *     y {Number} absolute y-position of the draggable inside `document` when the drag starts
         *     inlineLeft {String} inline css of the property `left` when drag starts
         *     inlineTop {String} inline css of the property `top` when drag starts
         *     winConstrained {Boolean} whether the draggable should be constrained to `window`
         *     xMouseLast {Number} absolute x-position of the mouse inside `document` when the drag starts
         *     yMouseLast {Number} absolute y-position of the draggable inside `document` when the drag starts
         *     winScrollLeft {Number} the left-scroll of window when drag starts
         *     winScrollTop {Number} the top-scroll of window when drag starts
         *     constrain = { // constrain-properties when constrained to a HtmlElement
         *         xOrig {Number} x-position in the document, included with left-border-width
         *         yOrig {Number} y-position in the document, included with top-border-width
         *         x {Number} xOrig corrected with scroll-left of the constrained node
         *         y {Number} yOrig corrected with scroll-top of the constrained node
         *         w {Number} scrollWidth
         *         h {Number} scrollHeight
         *     };
         *     relatives[{ // Array with objects that represent all draggables that come along with the master-draggable (in case of multiple items), excluded the master draggable itself
         *         sourceNode {HtmlElement} original node (defined by drag-drop)
         *         dragNode {HtmlElement} draggable node
         *         shiftX {Number} the amount of left-pixels that this HtmlElement differs from the dragged element
         *         shiftY {Number} the amount of top-pixels that this HtmlElement differs from the dragged element
         *         inlineLeft {String} inline css of the property `left` when drag starts
         *         inlineTop {String} inline css of the property `top` when drag starts
         *     }]
         * }
         *
         * @property ddProps
         * @default {}
         * @type Object
         * @since 0.0.1
        */
       ddProps: {},

        /**
         * Internal hash with notifiers to response after each `Drag` event is set up, or teared down.
         * You can use this to hook in into the drag-eventcycle: the `drop`-module uses it this way.
         * Is filled by using `notify()`.
         *
         * @property _notifiers
         * @default []
         * @type Array
         * @private
         * @since 0.0.1
         */
        _notifiers: [],

        /**
        * Default function for the `*:dd-drag`-event
        *
        * @method _defFnDrag
        * @param e {Object} eventobject
        * @private
        * @since 0.0.1
        */
        _defFnDrag: function(e) {
            console.log(NAME, '_defFnDrag: default function dd-drag');
            var ddProps = this.ddProps,
                dragNode = ddProps.dragNode,
                constrainNode = ddProps.constrainNode,
                winConstrained = ddProps.winConstrained,
                x, y;
            // is the drag is finished, there will be no ddProps.defined
            // return then, to prevent any events that stayed behind
            if (!ddProps.defined) {
                return;
            }

            // caution: the user might have put the mouse out of the screen and released the mousebutton!
            // If that is the case, the a mouseup-event should be initiated instead of draggin the element
            if (e.buttons===0) {
                // no more button pressed
                /**
                * Fired when the mouse comes back into the browser-window while dd-drag was busy yet no buttons are pressed.
                * This is a correction to the fact that the mouseup-event wasn't noticed because the mouse was outside the browser.
                *
                * @event dd-fake-mouseup
                * @private
                * @since 0.1
                */
                Event.emit(dragNode, DD_FAKE_MOUSEUP);
            }
            else {
                console.log(NAME, '_defFnDrag: dragging:');
                if (constrainNode) {
                    ddProps.constrain.x = ddProps.constrain.xOrig - constrainNode.scrollLeft;
                    ddProps.constrain.y = ddProps.constrain.yOrig - constrainNode.scrollTop;
                }

                x = ddProps.x+e.xMouse+(winConstrained ? ddProps.winScrollLeft : window.getScrollLeft())-e.xMouseOrigin;
                y = ddProps.y+e.yMouse+(winConstrained ? ddProps.winScrollTop : window.getScrollTop())-e.yMouseOrigin;

                dragNode.setXY(x, y, ddProps.constrain, true);

                ddProps.relatives && ddProps.relatives.forEach(
                    function(item) {
                        item.dragNode.setXY(x+item.shiftX, y+item.shiftY, null, true);
                    }
                );
                ddProps.winConstrained || dragNode.forceIntoView(true);
                constrainNode && dragNode.forceIntoNodeView(constrainNode);
            }
        },

        /**
         * Default function for the `*:dd-drop`-event
         *
         * @method _defFnDrop
         * @param e {Object} eventobject
         * @private
         * @since 0.0.1
         */
        _defFnDrop: function(e) {
            console.log(NAME, '_defFnDrop');
            var dragNode = e.target,
                removeClasses = function (node) {
                    node.removeClass([NO_TRANS_CLASS, HIGH_Z_CLASS, DD_DRAGGING_CLASS, DEL_DRAGGABLE, DD_MASTER_CLASS]);
                };

            PLUGIN_ATTRS.forEach(function(attribute) {
                var data = '_del_'+attribute;
                if (dragNode.getData(data)) {
                    dragNode.removeAttr(attribute);
                    dragNode.removeData(data);
                }
            });
            removeClasses(dragNode);
            e.relatives && e.relatives.forEach(
                function(node) {
                    removeClasses(node);
                }
            );
        },

        /**
         * Default function for the `*:dd`-event
         *
         * @method _defFnStart
         * @param e {Object} eventobject
         * @private
         * @since 0.0.1
         */
        _defFnStart: function(e) {
            var instance = this,
                customEvent;
            customEvent = e.emitter + ':'+DD_DRAG;
            console.log(NAME, '_defFnStart: default function UI:dd-start. Defining customEvent '+customEvent);
            Event.defineEvent(customEvent).defaultFn(instance._defFnDrag.bind(instance));
            window.document.getAll('.'+DD_MASTER_CLASS).removeClass(DD_MASTER_CLASS);
            instance._initializeDrag(e);
        },

      /**
        * Defines the definition of the `dd` event: the first phase of the drag-eventcycle (dd, *:dd-drag, *:dd-drop)
        *
        * @method _defineDDStart
        * @param emitterName {String} the emitterName, which leads into the definition of event `emitterName:dd`
        * @private
        * @since 0.0.1
        */
        _defineDDStart: function(emitterName) {
            console.log(NAME, '_defineDDStart');
            var instance = this;
            // by using dd before dd-drag, the user can create a `before`-subscriber to dd
            // and define e.emitter and/or e.relatives before going into `dd-drag`
            Event.defineEvent(emitterName+':dd')
                .defaultFn(instance._defFnStart.bind(instance))
                .preventedFn(instance._prevFnStart.bind(instance));
        },

       /**
         * Default function for the `*:dd-drag`-event
         *
         * @method _initializeDrag
         * @param e {Object} eventobject
         * @private
         * @since 0.0.1
         */
        _initializeDrag: function(e) {
            console.log(NAME, '_initializeDrag '+e.xMouseOrigin);
            var instance = this,
                dragNode = e.target,
                constrain = dragNode.getAttr(CONSTRAIN_ATTR),
                ddProps = instance.ddProps,
                emitterName = e.emitter,
                moveEv, x, y, byExactId, match, constrainNode, winConstrained, winScrollLeft, winScrollTop,
                inlineLeft, inlineTop, xOrig, yOrig;

            // define ddProps --> internal object with data about the draggable instance
            ddProps.dragNode = dragNode;
            ddProps.x = x = dragNode.left;
            ddProps.y = y = dragNode.top;
            ddProps.inlineLeft = inlineLeft = dragNode.getInlineStyle(LEFT);
            ddProps.inlineTop = inlineTop = dragNode.getInlineStyle(TOP);
            ddProps.winConstrained = winConstrained = (constrain===WINDOW);
            ddProps.xMouseLast = x;
            ddProps.yMouseLast = y;

            if (constrain) {
                if (ddProps.winConstrained) {
                    ddProps.winScrollLeft = winScrollLeft = window.getScrollLeft();
                    ddProps.winScrollTop = winScrollTop = window.getScrollTop();
                    ddProps.constrain = {
                        x: winScrollLeft,
                        y: winScrollTop,
                        w: window.getWidth(),
                        h: window.getHeight()
                    };
                    // if constrained to window:
                    // set a class that makes overflow hidden --> this will prevent
                    // some browsers from scrolling the window when a pressed mouse
                    // gets out of the window
                    bodyNode.setClass(NO_OVERFLOW);
                }
                else {
                    byExactId = REGEXP_NODE_ID.test(constrain);
                    constrainNode = dragNode.parentNode;
                    while (constrainNode.matchesSelector && !match) {
                        match = byExactId ? (constrainNode.id===constrain.substr(1)) : constrainNode.matchesSelector(constrain);
                        // if there is a match, then make sure x and y fall within the region
                        if (match) {
                            ddProps.constrainNode = constrainNode;
                            xOrig = constrainNode.left + parseInt(constrainNode.getStyle(BORDER_LEFT_WIDTH), 10);
                            yOrig = constrainNode.top + parseInt(constrainNode.getStyle(BORDER_TOP_WIDTH), 10);
                            ddProps.constrain = {
                                xOrig: xOrig,
                                yOrig: yOrig,
                                x: xOrig - constrainNode.scrollLeft,
                                y: yOrig - constrainNode.scrollTop,
                                w: constrainNode.scrollWidth,
                                h: constrainNode.scrollHeight
                            };
                        }
                        else {
                            constrainNode = constrainNode.parentNode;
                        }
                    }
                }
            }

            // create listener for `mousemove` and transform it into the `*:dd:drag`-event
            moveEv = Event.after(mobileEvents ? PANMOVE : MOUSEMOVE, function(e2) {
                if (typeof e2.center==='object') {
                    e2.clientX = e2.center.x;
                    e2.clientY = e2.center.y;
                }
                if (!e2.clientX) {
                    return;
                }
                // move the object
                e.xMouse = e2.clientX;
                e.yMouse = e2.clientY;
                /**
                * Emitted during the drag-cycle of a draggable Element (while it is dragged).
                *
                * @event *:dd-drag
                * @param e {Object} eventobject including:
                * @param e.target {HtmlElement} the HtmlElement that is being dragged
                * @param e.currentTarget {HtmlElement} the HtmlElement that is delegating
                * @param e.sourceTarget {HtmlElement} the deepest HtmlElement where the mouse lies upon
                * @param e.dd {Promise} Promise that gets fulfilled when dragging is ended. The fullfilled-callback has no arguments.
                * @param e.xMouse {Number} the current x-position in the window-view
                * @param e.yMouse {Number} the current y-position in the window-view
                * @param e.clientX {Number} the current x-position in the window-view
                * @param e.clientY {Number} the current y-position in the window-view
                * @param e.xMouseOrigin {Number} the original x-position in the document when drag started (incl. scrollOffset)
                * @param e.yMouseOrigin {Number} the original y-position in the document when drag started (incl. scrollOffset)
                * @param [e.relatives] {NodeList} an optional list that the user could set in a `before`-subscriber of the `dd`-event
                *        to inform which nodes are related to the draggable node and should be dragged as well.
                * @since 0.1
                */
                Event.emit(dragNode, emitterName+':'+DD_DRAG, e);
                e.dd.callback();
            });

            // prepare dragNode class for the right CSS:
            dragNode.setClass([NO_TRANS_CLASS, HIGH_Z_CLASS, DD_DRAGGING_CLASS]);

            Event.onceAfter([mobileEvents ? PANEND : MOUSEUP, DD_FAKE_MOUSEUP], function(e3) {
                moveEv.detach();
                // set mousepos for the last time:
                if (typeof e3.center==='object') {
                    e3.clientX = e3.center.x;
                    e3.clientY = e3.center.y;
                }
                e.xMouse = e3.clientX;
                e.yMouse = e3.clientY;
                // invoke all teardown notifiers:
                instance._notifiers.forEach(
                    function(notifier) {
                        notifier.s || notifier.cb.call(notifier.o, e, ddProps);
                    }
                );

                if (constrain && ddProps.winConstrained) {
                    // if constrained to window:
                    // remove overflow=hidden from the bodynode
                    bodyNode.removeClass(NO_OVERFLOW);
                }

                instance.ddProps = {};
                /**
                * Emitted when drag-cycle of a draggable Element is ended.
                *
                * @event *:dd-drop
                * @param e {Object} eventobject including:
                * @param e.target {HtmlElement} the HtmlElement that is being dragged
                * @param e.currentTarget {HtmlElement} the HtmlElement that is delegating
                * @param e.sourceTarget {HtmlElement} the deepest HtmlElement where the mouse lies upon
                * @param e.dd {Promise} Promise that gets fulfilled when dragging is ended. The fullfilled-callback has no arguments.
                * @param e.xMouse {Number} the current x-position in the window-view
                * @param e.yMouse {Number} the current y-position in the window-view
                * @param e.clientX {Number} the current x-position in the window-view
                * @param e.clientY {Number} the current y-position in the window-view
                * @param e.xMouseOrigin {Number} the original x-position in the document when drag started (incl. scrollOffset)
                * @param e.yMouseOrigin {Number} the original y-position in the document when drag started (incl. scrollOffset)
                * @param [e.relatives] {NodeList} an optional list that the user could set in a `before`-subscriber of the `dd`-event
                *        to inform which nodes are related to the draggable node and should be dragged as well.
                * @since 0.1
                */
                Event.emit(dragNode, emitterName+':'+DD_DROP, e);
                e.dd.fulfill();
            });

            dragNode.setXY(ddProps.xMouseLast, ddProps.yMouseLast, ddProps.constrain, true);

            if (e.relatives) {
                // relatives are extra HtmlElements that should be moved aside with the main dragged element
                // e.relatives is a selector, e.relativeNodes will be an array with nodes
                e.relativeNodes = [];
                dragNode.setClass(DD_MASTER_CLASS);
                dragNode.setClass(DD_MASTER_CLASS);
                ddProps.relatives = [];
                e.relatives.forEach(
                    function(node) {
                        var item;
                        if (node !== dragNode) {
                            item = {
                                dragNode: node,
                                shiftX: node.left - x,
                                shiftY: node.top - y,
                                inlineLeft: node.getInlineStyle(LEFT),
                                inlineTop: node.getInlineStyle(TOP)
                            };
                            item.dragNode.setClass([NO_TRANS_CLASS, HIGH_Z_CLASS, DD_DRAGGING_CLASS]);
                            ddProps.relatives.push(item);
                            e.relativeNodes.push(item.dragNode);
                        }
                    }
                );
            }
            // invoke all setup notifiers:
            instance._notifiers.forEach(
                function(notifier) {
                    notifier.s && notifier.cb.call(notifier.o, e, ddProps);
                }
            );
        },

        /**
         * Prevented function for the `*:dd-start`-event
         *
         * @method _prevFnStart
         * @param e {Object} eventobject
         * @private
         * @since 0.0.1
         */
        _prevFnStart: function(e) {
            console.log(NAME, '_prevFnStart');
            e.dd.reject();
        },

      /**
        * Engine behind the drag-drop-cycle.
        * Sets up a `mousedown` listener to initiate a drag-drop eventcycle. The eventcycle start whenever
        * one of these events happens on a HtmlElement with the attribute `dd-draggable="true"`.
        * The drag-drop eventcycle consists of the events: `dd-start`, `emitterName:dd-drag` and `emitterName:dd-drop`
        *
        *
        * @method _setupMouseEv
        * @private
        * @since 0.0.1
        */
        _setupMouseEv: function() {
            console.log(NAME, '_setupMouseEv: setting up mousedown event');
            var instance = this,
                nodeTargetFn,
                delegatedTargetFn;

            nodeTargetFn = function(e) {
                var node = e.target,
                    handle, availableHandles, insideHandle, emitterName;

                // first check if there is a handle to determine if the drag started here:
                handle = node.getAttr(DD_HANDLE);
                if (handle) {
                    availableHandles = node.getAll(handle);
                    insideHandle = false;
                    availableHandles.some(function(handleNode) {
                        insideHandle = handleNode.contains(e.sourceTarget);
                        return insideHandle;
                    });
                    if (!insideHandle) {
                        return;
                    }
                }

                // initialize ddProps: have to do here, because the event might not start because it wasn't inside the handle when it should be
                instance.ddProps = {
                    defined: true,
                    dragOverList: []
                };

                // prevent the emitter from resetting e.target to e.sourceTarget:
                e._noResetSourceTarget = true;
                // add `dd`-Promise to the eventobject --> this Promise will be resolved once the pointer has released.
                e.dd = Promise.manage();
                // define e.setOnDrag --> users
                e.setOnDrag = function(callbackFn) {
                    e.dd.setCallback(callbackFn);
                };
                // store the orriginal mouseposition:
                e.xMouseOrigin = e.clientX + window.getScrollLeft();
                e.yMouseOrigin = e.clientY + window.getScrollTop();

                //set the emitterName:
                emitterName = e.target.getAttr(DD_EMITTER) || UI,
                // now we can start the eventcycle by emitting emitterName:dd:
                /**
                * Emitted when a draggable Element's drag-cycle starts. You can use a `before`-subscriber to specify
                * e.relatives, which should be a nodelist with HtmlElements, that should be dragged togehter with the master
                * draggable Element.
                *
                * @event *:dd
                * @param e {Object} eventobject including:
                * @param e.target {HtmlElement} the HtmlElement that is being dragged
                * @param e.currentTarget {HtmlElement} the HtmlElement that is delegating
                * @param e.sourceTarget {HtmlElement} the deepest HtmlElement where the mouse lies upon
                * @param e.dd {Promise} Promise that gets fulfilled when dragging is ended. The fullfilled-callback has no arguments.
                * @param e.xMouse {Number} the current x-position in the window-view
                * @param e.yMouse {Number} the current y-position in the window-view
                * @param e.clientX {Number} the current x-position in the window-view
                * @param e.clientY {Number} the current y-position in the window-view
                * @param e.xMouseOrigin {Number} the original x-position in the document when drag started (incl. scrollOffset)
                * @param e.yMouseOrigin {Number} the original y-position in the document when drag started (incl. scrollOffset)
                * @param [e.relatives] {NodeList} an optional list that the user could set in a `before`-subscriber of the `dd`-event
                *        to inform which nodes are related to the draggable node and should be dragged as well.
                * @since 0.1
                */
                instance._defineDDStart(emitterName);
                Event.emit(e.target, emitterName+':dd', e);
            };

            delegatedTargetFn = function(e, cssSelector) {
                var container = e.target,
                    nodelist = container.getAll(cssSelector),
                    foundNode;
                nodelist.some(
                    function(node) {
                        (node.contains(e.sourceTarget)) && (foundNode=node);
                        return foundNode;
                    }
                );
                if (foundNode) {
                    e.currentTarget = container;
                    e.target = foundNode;
                    // Mark the delegated node, so it has the same style as [draggable]:
                    foundNode.setClass(DEL_DRAGGABLE);
                    // We must transport the other relevant dd-attributes (and constrain-selector)
                    // which we will remove when finished dragging:
                    PLUGIN_ATTRS.forEach(function(attribute) {
                        var attr = container.getAttr(attribute);
                        if (attr && !foundNode.hasAttr(attribute)) {
                            foundNode.setData('_del_'+attribute, attr);
                            foundNode.setAttr(attribute, attr);
                        }
                    });
                    nodeTargetFn(e);
                }
            };
            Event.after(mobileEvents ? PANSTART : MOUSEDOWN, function(e) {
                var draggableAttr = e.target.getAttr(DD_MINUSDRAGGABLE);
                if (typeof e.center==='object') {
                    e.clientX = e.center.x;
                    e.clientY = e.center.y;
                }
                (draggableAttr===TRUE) ? nodeTargetFn(e) : delegatedTargetFn(e, draggableAttr);
            }, '['+DD_MINUSDRAGGABLE+']');

        },

       /**
         * Initializes dragdrop. Needs to be invoked, otherwise DD won't run.
         *
         * @method init
         * @param dragableElement {HtmlElement} HtmlElement that is checked for its allowed effects
         * @return {Boolean} if copy-dragables are allowed
         * @since 0.0.1
         */
        init: function() {
            console.log(NAME, 'init');
            var instance = this;
            if (!instance._inited) {
                instance._setupMouseEv(); // engine behind the dragdrop-eventcycle
                if (mobileEvents) {
                    Event.before(['touchstart', 'touchmove'], function(ev) {
                        (instance.ddProps.size()>0) && ev.preventDefault();
                    });
                }
                Event.defineEvent('UI:'+DD_DROP)
                     .defaultFn(instance._defFnDrop.rbind(instance));
            }
            instance._inited = true;
        },

        /**
         * Creates a notifier to response after each `Drag` event is set up, or teared down.
         * You can use this to hook in into the drag-eventcycle: the `drop`-module uses it this way.
         *
         * @static
         * @method notify
         * @param callback {Function} subscriber: will be invoked after every drag-event is set up.
         *                 Recieves 2 arguments: the `eventobject` and the internal property: `ddProps`
         * @param context {Object} context of the callback
         * @param setup {Boolean} wheter the callback should be invoked on setup (true) or teardown (false)
         * @return {Object} handle with a method `detach()` which you can use to remove it from the `notifier-hash`
         * @since 0.0.1
        */
        notify: function(callback, context, setup) {
            console.log(NAME, 'notify');
            var notifier = {
                cb: callback,
                o: context,
                s: setup
            };
            this._notifiers.push(notifier);
            return {
                detach: function() {
                    this._notifiers.remove(notifier);
                }
            };
        }

    };

    DD_Object = window._ITSAmodules.Drag = {
        DD: DD,
        Plugins: {
            nodeDD: nodePlugin.definePlugin('dd', {draggable: 'true'})
        }
    };

    return DD_Object;
};
},{"./css/drag.css":12,"event-dom":14,"js-ext":29,"polyfill":40,"useragent":41,"vdom":55,"window-ext":56}],14:[function(require,module,exports){
"use strict";

/**
 * Integrates DOM-events to event. more about DOM-events:
 * http://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @example
 * Event = require('event-dom')(window);
 *
 * @module event
 * @submodule event-dom
 * @class Event
 * @since 0.0.1
*/


var NAME = '[event-dom]: ',
    Event = require('event'),
    later = require('utils').later,
    OUTSIDE = 'outside',
    REGEXP_NODE_ID = /^#\S+$/,
    REGEXP_EXTRACT_NODE_ID = /#(\S+)/,
    REGEXP_UI_OUTSIDE = /^.+outside$/,
    TIME_BTN_PRESSED = 200,
    PURE_BUTTON_ACTIVE = 'pure-button-active',

    /*
     * Internal hash containing all DOM-events that are listened for (at `document`).
     *
     * DOMEvents = {
     *     'click': callbackFn,
     *     'mousemove': callbackFn,
     *     'keypress': callbackFn
     * }
     *
     * @property DOMEvents
     * @default {}
     * @type Object
     * @private
     * @since 0.0.1
    */
    DOMEvents = {};

    require('vdom');
    require('js-ext/lib/string.js');
    require('js-ext/lib/array.js');
    require('js-ext/lib/object.js');
    require('polyfill/polyfill-base.js');

module.exports = function (window) {
    var DOCUMENT = window.document,
        _domSelToFunc, _evCallback, _findCurrentTargets, _preProcessor, _setupEvents,
        _setupDomListener, _teardownDomListener, SORT, _sortFunc, _sortFuncReversed, _getSubscribers, _selToFunc;

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.EventDom) {
        return Event; // Event was already extended
    }

    /*
     * Transfprms the selector to a valid function
     *
     * @method _evCallback
     * @param customEvent {String} the customEvent that is transported to the eventsystem
     * @param subscriber {Object} subscriber
     * @param subscriber.o {Object} context
     * @param subscriber.cb {Function} callbackFn
     * @param subscriber.f {Function|String} filter
     * @private
     * @since 0.0.1
     */
    _selToFunc = function(customEvent, subscriber) {
        Event._sellist.some(function(selFn) {
            return selFn(customEvent, subscriber);
        });
    },

    /*
     * Creates a filterfunction out of a css-selector. To be used for catching any dom-element, without restrictions
     * of any context (like Parcels can --> Parcel.Event uses _parcelSelToDom instead)
     * On "non-outside" events, subscriber.t is set to the node that first matches the selector
     * so it can be used to set as e.target in the final subscriber
     *
     * @method _domSelToFunc
     * @param customEvent {String} the customEvent that is transported to the eventsystem
     * @param subscriber {Object} subscriber
     * @param subscriber.o {Object} context
     * @param subscriber.cb {Function} callbackFn
     * @param subscriber.f {Function|String} filter
     * @private
     * @since 0.0.1
     */
    _domSelToFunc = function(customEvent, subscriber) {
        // this stage is runned during subscription
        var outsideEvent = REGEXP_UI_OUTSIDE.test(customEvent),
            selector = subscriber.f,
            nodeid, byExactId;

        console.log(NAME, '_domSelToFunc type of selector = '+typeof selector);
        // note: selector could still be a function: in case another subscriber
        // already changed it.
        if (!selector || (typeof selector === 'function')) {
            subscriber.n || (subscriber.n=DOCUMENT);
            return true;
        }

        nodeid = selector.match(REGEXP_EXTRACT_NODE_ID);
        nodeid ? (subscriber.nId=nodeid[1]) : (subscriber.n=DOCUMENT);

        byExactId = REGEXP_NODE_ID.test(selector);

        subscriber.f = function(e) {
            // this stage is runned when the event happens
            console.log(NAME, '_domSelToFunc inside filter. selector: '+selector);
            var node = e.target,
                vnode = node.vnode,
                character1 = selector.substr(1),
                match = false;
            // e.target is the most deeply node in the dom-tree that caught the event
            // our listener uses `selector` which might be a node higher up the tree.
            // we will reset e.target to this node (if there is a match)
            // note that e.currentTarget will always be `document` --> we're not interested in that
            // also, we don't check for `node`, but for node.matchesSelector: the highest level `document`
            // is not null, yet it doesn;t have .matchesSelector so it would fail
            if (vnode) {
                // we go through the vdom
                while (vnode && !match) {
                    console.log(NAME, '_domSelToFunc inside filter check match using the vdom');
                    match = byExactId ? (vnode.id===character1) : vnode.matchesSelector(selector);
                    // if there is a match, then set
                    // e.target to the target that matches the selector
                    if (match && !outsideEvent) {
                        subscriber.t = vnode.domNode;
                    }
                    vnode = vnode.vParent;
                }
            }
            else {
                // we go through the dom
                while (node.matchesSelector && !match) {
                    console.log(NAME, '_domSelToFunc inside filter check match using the dom');
                    match = byExactId ? (node.id===character1) : node.matchesSelector(selector);
                    // if there is a match, then set
                    // e.target to the target that matches the selector
                    if (match && !outsideEvent) {
                        subscriber.t = node;
                    }
                    node = node.parentNode;
                }
            }
            console.log(NAME, '_domSelToFunc filter returns '+(!outsideEvent ? match : !match));
            return !outsideEvent ? match : !match;
        };
        return true;
    };

    // at this point, we need to find out what are the current node-refs. whenever there is
    // a filter that starts with `#` --> in those cases we have a bubble-chain, because the selector isn't
    // set up with `document` at its root.
    // we couldn't do this at time of subscribtion, for the nodes might not be there at that time.
    // however, we only need to do this once: we store the value if we find them
    // no problem when the nodes leave the dom later: the previous filter wouldn't pass
    _findCurrentTargets = function(subscribers) {
        console.log(NAME, '_findCurrentTargets');
        subscribers.forEach(
            function(subscriber) {
                console.log(NAME, '_findCurrentTargets for single subscriber. nId: '+subscriber.nId);
                subscriber.nId && (subscriber.n=DOCUMENT.getElementById(subscriber.nId));
            }
        );
    };

    /*
     * Generates an event through our Event-system. Does the actual transportation from DOM-events
     * into our Eventsystem. It also looks at the response of our Eventsystem: if our system
     * halts or preventDefaults the customEvent, then the original DOM-event will be preventDefaulted.
     *
     * @method _evCallback
     * @param e {Object} eventobject
     * @private
     * @since 0.0.1
     */
    _evCallback = function(e) {
        console.log(NAME, '_evCallback');
        var allSubscribers = Event._subs,
            eventName = e.type,
            customEvent = 'UI:'+eventName,
            eventobject, subs, wildcard_named_subs, named_wildcard_subs, wildcard_wildcard_subs, subsOutside,
            subscribers, eventobjectOutside, wildcard_named_subsOutside;

        subs = allSubscribers[customEvent];
        wildcard_named_subs = allSubscribers['*:'+eventName];
        named_wildcard_subs = allSubscribers['UI:*'];
        wildcard_wildcard_subs = allSubscribers['*:*'];

        // Emit the dom-event though our eventsystem:
        // NOTE: emit() needs to be synchronous! otherwise we wouldn't be able
        // to preventDefault in time
        //
        // e = eventobject from the DOM-event OR gesture-event
        // eventobject = eventobject from our Eventsystem, which get returned by calling `emit()`

        subscribers = _getSubscribers(e, true, subs, wildcard_named_subs, named_wildcard_subs, wildcard_wildcard_subs);
        eventobject = Event._emit(e.target, customEvent, e, subscribers, [], _preProcessor);

        // now check outside subscribers
        subsOutside = allSubscribers[customEvent+OUTSIDE];
        wildcard_named_subsOutside = allSubscribers['*:'+eventName+OUTSIDE];
        subscribers = _getSubscribers(e, true, subsOutside, wildcard_named_subsOutside);
        eventobjectOutside = Event._emit(e.target, customEvent+OUTSIDE, e, subscribers, [], _preProcessor);

        // if eventobject was preventdefaulted or halted: take appropriate action on
        // the original dom-event. Note: only the original event can caused this, not the outsideevent
        // stopPropagation on the original eventobject has no impact on our eventsystem, but who know who else is watching...
        // be carefull though: not all gesture events have e.stopPropagation
        eventobject.status.halted && e.stopPropagation && e.stopPropagation();
        // now we might need to preventDefault the original event.
        // be carefull though: not all gesture events have e.preventDefault
        if ((eventobject.status.halted || eventobject.status.defaultPrevented || eventobject.status.defaultPreventedContinue) && e.preventDefault) {
            e.preventDefault();
        }

        if (eventobject.status.ok) {
            // last step: invoke the aftersubscribers
            // we need to do this asynchronous: this way we pass them AFTER the DOM-event's defaultFn
            // also make sure to paas-in the payload of the manipulated eventobject
            subscribers = _getSubscribers(e, false, subs, wildcard_named_subs, named_wildcard_subs, wildcard_wildcard_subs);
            (subscribers.length>0) && later(Event._emit.bind(Event, e.target, customEvent, eventobject, [], subscribers, _preProcessor, true), 10, false);

            // now check outside subscribers
            subscribers = _getSubscribers(e, false, subsOutside, wildcard_named_subsOutside);
            (subscribers.length>0) && later(Event._emit.bind(Event, e.target, customEvent+OUTSIDE, eventobjectOutside, [], subscribers, _preProcessor, true), 10, false);
        }
    };

    /*
     * Creates an array of subscribers in the right order, conform their position in the DOM.
     * Only subscribers that match the filter are involved.
     *
     * @method _getSubscribers
     * @param e {Object} eventobject
     * @param before {Boolean} whether it is a before- or after-subscriber
     * @param subs {Array} array with subscribers
     * @param wildcard_named_subs {Array} array with subscribers
     * @param named_wildcard_subs {Array} array with subscribers
     * @param wildcard_wildcard_subs {Array} array with subscribers
     * @private
     * @since 0.0.1
     */
    _getSubscribers = function(e, before, subs, wildcard_named_subs, named_wildcard_subs, wildcard_wildcard_subs) {
        var subscribers = [],
            beforeOrAfter = before ? 'b' : 'a',
            saveConcat = function(extrasubs) {
                extrasubs && extrasubs[beforeOrAfter] && (subscribers=subscribers.concat(extrasubs[beforeOrAfter]));
            };
        saveConcat(subs);
        saveConcat(wildcard_named_subs);
        saveConcat(named_wildcard_subs);
        saveConcat(wildcard_wildcard_subs);
        if (subscribers.length>0) {
            subscribers = function(array, testFunc) {
                // quickest way to filter an array: see http://jsperf.com/array-filter-performance/4
                var filtered = array.slice(0), i;
                for (i=array.length-1; i>=0; i--) {
                    console.log(NAME, 'filtercheck for subscriber');
                    testFunc(array[i]) || filtered.splice(i, 1);
                }
                return filtered;
            }(subscribers, function(subscriber) {return (!subscriber.f || subscriber.f.call(subscriber.o, e));});
            if (subscribers.length>0) {
                _findCurrentTargets(subscribers);
                // sorting, based upon the sortFn
                subscribers.sort(SORT);
            }
        }
        return subscribers;
    };

    /*
     * Sets e.target, e.currentTarget and e.sourceTarget for the single subscriber.
     * Needs to be done for evenry single subscriber, because with a single event, these values change for each subscriber
     *
     * @method _preProcessor
     * @param subscriber {Object} subscriber
     * @param subscriber.o {Object} context
     * @param subscriber.cb {Function} callbackFn
     * @param subscriber.f {Function|String} filter
     * @param e {Object} eventobject
     * @private
     * @since 0.0.1
     */
    _preProcessor = function(subscriber, e) {
        console.log(NAME, '_preProcessor');
        // inside the aftersubscribers, we may need exit right away.
        // this would be the case whenever stopPropagation or stopImmediatePropagation was called
        // in case the subscribernode equals the node on which stopImmediatePropagation was called: return true
        var propagationStopped, immediatePropagationStopped,
            targetnode = (subscriber.t || subscriber.n);

        immediatePropagationStopped = e.status.immediatePropagationStopped;
        if (immediatePropagationStopped && ((immediatePropagationStopped===targetnode) || !immediatePropagationStopped.contains(targetnode))) {
            console.log(NAME, '_preProcessor will return true because of immediatePropagationStopped');
            return true;
        }
        // in case the subscribernode does not fall within or equals the node on which stopPropagation was called: return true
        propagationStopped = e.status.propagationStopped;
        if (propagationStopped && (propagationStopped!==targetnode) && !propagationStopped.contains(targetnode)) {
            console.log(NAME, '_preProcessor will return true because of propagationStopped');
            return true;
        }

        e.currentTarget = subscriber.n;
        // now we might need to set e.target to the right node:
        // the filterfunction might have found the true domnode that should act as e.target
        // and set it at subscriber.t
        // also, we need to backup the original e.target: this one should be reset when
        // we encounter a subscriber with its own filterfunction instead of selector
        if (subscriber.t) {
            e.sourceTarget || (e.sourceTarget=e.target);
            e.target = subscriber.t;
        }
        else {
            e.sourceTarget && (e.target=e.sourceTarget);
        }
        return false;
    };

    /*
     * Transports DOM-events to the Event-system. Catches events at their most early stage:
     * their capture-phase. When these events happen, a new customEvent is generated by our own
     * Eventsystem, by calling _evCallback(). This way we keep DOM-events and our Eventsystem completely separated.
     *
     * @method _setupDomListener
     * @param customEvent {String} the customEvent that is transported to the eventsystem
     * @param subscriber {Object} subscriber
     * @param subscriber.o {Object} context
     * @param subscriber.cb {Function} callbackFn
     * @param subscriber.f {Function|String} filter
     * @private
     * @since 0.0.1
     */
    _setupDomListener = function(customEvent, subscriber) {
        console.log(NAME, '_setupDomListener');
        var eventSplitted = customEvent.split(':'),
            eventName = eventSplitted[1],
            outsideEvent = REGEXP_UI_OUTSIDE.test(eventName);

        // be careful: anyone could also register an `outside`-event.
        // in those cases, the DOM-listener must be set up without `outside`
        outsideEvent && (eventName=eventName.substring(0, eventName.length-7));

        // if eventName equals `mouseover` or `mouseleave` then we quit:
        // people should use `mouseover` and `mouseout`
        if ((eventName==='mouseenter') || (eventName==='mouseleave')) {
            console.warn(NAME, 'Subscription to '+eventName+' not supported, use mouseover and mouseout: this eventsystem uses these non-noisy so they act as mouseenter and mouseleave');
            return;
        }

        // now transform the subscriber's filter from css-string into a filterfunction
        _selToFunc(customEvent, subscriber);

        // already registered? then return, also return if someone registered for UI:*
        if (DOMEvents[eventName] || (eventName==='*')) {
            // cautious: one might have registered the event, but not yet the outsideevent.
            // in that case: save this setting:
            outsideEvent && (DOMEvents[eventName+OUTSIDE]=true);
            return;
        }

        // one exception: windowresize should listen to the window-object
        if (eventName==='resize') {
            window.addEventListener(eventName, _evCallback);
        }
        else {
            // important: set the third argument `true` so we listen to the capture-phase.
            DOCUMENT.addEventListener(eventName, _evCallback, true);
        }
        DOMEvents[eventName] = true;
        outsideEvent && (DOMEvents[eventName+OUTSIDE]=true);
    };

    _setupEvents = function() {

        // make sure disabled buttons don't work:
        Event.before(['click', 'tap'], function(e) {
            e.preventDefault();
        }, '.pure-button-disabled, button[disabled]');

        // make sure that a focussed button which recieves an keypress also fires the `tap`-event
        // note: the `click`-event will always be fired by the browser
        Event.before(
            'keydown',
            function(e) {
                e._buttonPressed = true;
                Event.emit(e.target, 'UI:tap', e);
            },
            function(e) {
                var keyCode = e.keyCode;
                return (e.target.getTagName()==='BUTTON') && ((keyCode===13) || (keyCode===32));
            }
        );

        // make sure that a focussed button which recieves an keypress also fires the `tap`-event
        // note: the `click`-event will always be fired by the browser
        Event.after(
            'tap',
            function(e) {
                var buttonNode = e.target;
                if (e._buttonPressed) {
                    buttonNode.setClass(PURE_BUTTON_ACTIVE);
                    // even if the node isn't in the DOM, we can still try to manipulate it:
                    // the vdom makes sure no errors occur when the node is already removed
                    later(buttonNode.removeClass.bind(buttonNode, PURE_BUTTON_ACTIVE), TIME_BTN_PRESSED);
                }
            }
        );

    };

    /*
     *
     * @method _sortFunc
     * @param customEvent {String}
     * @private
     * @return {Function|undefined} sortable function
     * @since 0.0.1
     */
    _sortFunc = function(subscriberOne, subscriberTwo) {
        return (subscriberTwo.t || subscriberTwo.n).contains(subscriberOne.t || subscriberOne.n) ? -1 : 1;
    };

    /*
     *
     * @method _sortFunc
     * @param customEvent {String}
     * @private
     * @return {Function|undefined} sortable function
     * @since 0.0.1
     */
    _sortFuncReversed = function(subscriberOne, subscriberTwo) {
        return (subscriberOne.t || subscriberOne.n).contains(subscriberTwo.t || subscriberTwo.n) ? 1 : -1;
    };

    /*
     * Removes DOM-eventsubscribers from document when they are no longer needed.
     *
     * @method _teardownDomListener
     * @param customEvent {String} the customEvent that is transported to the eventsystem
     * @private
     * @since 0.0.2
     */
    _teardownDomListener = function(customEvent) {
        var customEventWithoutOutside = customEvent.endsWith(OUTSIDE) ? customEvent.substr(0, customEvent.length-7) : customEvent,
            eventSplitted = customEventWithoutOutside.split(':'),
            eventName = eventSplitted[1];

        if (!Event._subs[customEventWithoutOutside] && !Event._subs[customEventWithoutOutside+OUTSIDE]) {
            console.log(NAME, '_teardownDomListener '+customEvent);
            // remove eventlistener from `document`
            // one exeption: windowresize should listen to the window-object
            if (eventName==='resize') {
                window.removeEventListener(eventName, _evCallback);
            }
            else {
                // important: set the third argument `true` so we listen to the capture-phase.
                DOCUMENT.removeEventListener(eventName, _evCallback, true);
            }
            delete DOMEvents[eventName];
        }
    };

    // Now a very tricky one:
    // Some browsers do an array.sort down-top instead of top-down.
    // In those cases we need another sortFn, for the position on an equal match should fall
    // behind instead of before (which is the case on top-down sort)
    [1,2].sort(function(a /*, b */) {
        SORT || (SORT=(a===2) ? _sortFuncReversed : _sortFunc);
    });

    // Now we do some initialization in order to make DOM-events work:

    // Notify when someone subscribes to an UI:* event
    // if so: then we might need to define a customEvent for it:
    // alse define the specific DOM-methods that can be called on the eventobject: `stopPropagation` and `stopImmediatePropagation`
    Event.notify('UI:*', _setupDomListener, Event)
         ._setEventObjProperty('stopPropagation', function() {this.status.ok || (this.status.propagationStopped = this.target);})
         ._setEventObjProperty('stopImmediatePropagation', function() {this.status.ok || (this.status.immediatePropagationStopped = this.target);});

    // Notify when someone detaches an UI:* event
    // if so: then we might need to detach the native listener on `document`
    Event.notifyDetach('UI:*', _teardownDomListener, Event);

    Event._sellist = [_domSelToFunc];

    _setupEvents();

    // Event._domCallback is the only method that is added to Event.
    // We need to do this, because `event-mobile` needs access to the same method.
    // We could have done without this method and instead listen for a custom-event to handle
    // Mobile events, however, that would lead into 2 eventcycli which isn't performant.

   /**
    * Does the actual transportation from DOM-events into the Eventsystem. It also looks at the response of
    * the Eventsystem: on e.halt() or e.preventDefault(), the original DOM-event will be preventDefaulted.
    *
    * @method _domCallback
    * @param eventName {String} the customEvent that is transported to the eventsystem
    * @param e {Object} eventobject
    * @private
    * @since 0.0.1
    */
    Event._domCallback = function(e) {
        _evCallback(e);
    };

    // store module:
    window._ITSAmodules.EventDom = Event;
    return Event;
};

},{"event":21,"js-ext/lib/array.js":30,"js-ext/lib/object.js":32,"js-ext/lib/string.js":34,"polyfill/polyfill-base.js":40,"utils":42,"vdom":55}],15:[function(require,module,exports){
"use strict";

/**
 * Adds the `hover` event as a DOM-event to event-dom. more about DOM-events:
 * http://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/
 *
 * Should be called using  the provided `mergeInto`-method like this:
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @example
 * Event = require('event-dom/hover.js')(window);
 *
 * or
 *
 * @example
 * Event = require('event-dom')(window);
 * require('event-dom/event-hover.js')(window);
 *
 * @module event
 * @submodule event-hover
 * @class Event
 * @since 0.0.2
*/


var NAME = '[event-hover]: ';

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.EventHover) {
        return window._ITSAmodules.EventHover; // EventHover was already created
    }

    var Event = require('../event-dom.js')(window),

    subscriber,

    /*
     * Creates the `hover` event. The eventobject has the property `e.hover` which is a `Promise`.
     * You can use this Promise to get notification of the end of hover. The Promise e.hover gets resolved with
     * `relatedTarget` as argument: the node where the mouse went into when leaving a.target.
     *
     * @method setupHover
     * @private
     * @since 0.0.2
     */
    setupHover = function() {
        // create only after subscribing to the `hover`-event
        subscriber = Event.after('mouseover', function(e) {
            console.log(NAME, 'setupHover: setting up mouseover event');
            var node = e.target;
            e.hover = new Promise(function(fulfill) {
                Event.onceAfter(
                    'mouseout',
                    function(e) {
                        fulfill(e.relatedTarget);
                    },
                    function(ev) {
                        return (ev.target===node);
                    }
                );
            });
            Event.emit(node, 'UI:hover', e);
        });
    },

    /*
     * Removes the `hover` event. Because there are no subscribers anymore.
     *
     * @method teardownHover
     * @private
     * @since 0.0.2
     */
    teardownHover = function() {
        // check if there aren't any subscribers anymore.
        // in that case, we detach the `mouseover` lister because we don't want to
        // loose performance.
        if (!Event._subs['UI:hover']) {
            console.log(NAME, 'teardownHover: stop setting up mouseover event');
            subscriber.detach();
            // reinit notifier, because it is a one-time notifier:
            Event.notify('UI:hover', setupHover, Event, true);
        }
    };

    Event.notify('UI:hover', setupHover, Event, true);
    Event.notifyDetach('UI:hover', teardownHover, Event);

    window._ITSAmodules.EventHover = Event;

    return Event;
};

},{"../event-dom.js":14}],16:[function(require,module,exports){
"use strict";

/**
 * Adds the `hover` event as a DOM-event to event-dom. more about DOM-events:
 * http://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/
 *
 * Should be called using  the provided `mergeInto`-method like this:
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @example
 * Event = require('event-dom/hover.js')(window);
 *
 * or
 *
 * @example
 * Event = require('event-dom')(window);
 * require('event-dom/event-hover.js')(window);
 *
 * @module event
 * @submodule event-hover
 * @class Event
 * @since 0.0.2
*/
require('vdom');

var NAME = '[event-valuechange]: ',
    VALUE = 'value',
    DATA_KEY = 'valueChange',
    UTILS = require('utils'),

    /**
    Interval (in milliseconds) at which to poll for changes to the value of an
    element with one or more `valuechange` subscribers when the user is likely
    to be interacting with it.

    @property POLL_INTERVAL
    @type Number
    @default 50
    @static
    **/
    POLL_INTERVAL = 50;

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.EventValueChange) {
        return window._ITSAmodules.EventValueChange; // EventValueChange was already created
    }

    var Event = require('../event-dom.js')(window),
    DOCUMENT = window.document,
    subscriberBlur,
    subscriberFocus,

    /*
     * Checks if the HtmlElement is editable.
     *
     * @method editableNode
     * @param node {HtmlElement}
     * @private
     * @return {Boolean} whether the HtmlElement is editable.
     * @since 0.0.1
     */
    editableNode = function(node) {
        var editable;
        if (node===DOCUMENT) {
            return false;
        }
        console.log(NAME, 'editableNodes '+DOCUMENT.test(node, 'input, textarea, select') || ((editable=node.getAttr('contenteditable')) && (editable!=='false')));
        return DOCUMENT.test(node, 'input, textarea, select') || ((editable=node.getAttr('contenteditable')) && (editable!=='false'));
    },


    /*
     * Gets invokes when the HtmlElement gets focus. Initializes a `keypress` and `click`/'press' eventlisteners.
     *
     * @method startFocus
     * @param e {Object} eventobject
     * @private
     * @since 0.0.1
     */
    startFocus = function(e) {
        console.log(NAME, 'startFocus');
        var node = e.target,
            editable, valueChangeData;

        if (!editableNode(node)) {
            return;
        }

        // first backup the current value:
        editable = ((editable=node.getAttr('contenteditable')) && (editable!=='false'));
        valueChangeData = node.getData(DATA_KEY);

        if (!valueChangeData) {
            valueChangeData = {
                editable : editable
            };
            node.setData(DATA_KEY, valueChangeData);
        }
        valueChangeData.prevVal = editable ? node.innerHTML : node[VALUE];
        startPolling(e);
    },


    /*
     * Removes the `focus` and `blur` events and ends the polling - if running. Because there are no subscribers anymore.
     *
     * @method endFocus
     * @private
     * @since 0.0.1
     */
    endFocus = function(e) {
        console.log(NAME, 'endFocus');
        stopPolling(e.target);
    },

    /*
     * Creates the `focus` and `blur` events. Also invokes `startFocus` to do inititalization.
     *
     * @method setupValueChange
     * @private
     * @since 0.0.2
     */
    setupValueChange = function() {
        console.log(NAME, 'setupValueChange');
        // create only after subscribing to the `hover`-event
        subscriberBlur = Event.after('blur', endFocus);
        subscriberFocus = Event.after('focus', startFocus);
        startFocus({target: DOCUMENT.activeElement});
    },


    /*
     * Starts polling in case of mouseclicks.
     *
     * @method startPolling
     * @private
     * @since 0.0.1
     */
    startPolling = function(e) {
        var node = e.target,
            valueChangeData;

        if (!editableNode(node)) {
            return;
        }
        console.log(NAME, 'startPolling');

        valueChangeData = node.getData(DATA_KEY);
        // cancel previous timer: we don't want multiple timers:
        valueChangeData._pollTimer && valueChangeData._pollTimer.cancel();
        // setup a new timer:
        valueChangeData._pollTimer = UTILS.later(checkChanged.bind(null, e), POLL_INTERVAL, true);
    },


    /*
     * Stops polling on the specific HtmlElement
     *
     * @method stopPolling
     * @param node {HtmlElement} the HtmlElement that should stop polling.
     * @private
     * @since 0.0.1
     */
    stopPolling = function(node) {
        console.log(NAME, 'stopPolling');
        var valueChangeData;
        if (node && node.getData) {
            valueChangeData = node.getData(DATA_KEY);
            valueChangeData && valueChangeData._pollTimer && valueChangeData._pollTimer.cancel();
        }
    },


    /*
     * Checks e.target if its value has changed. If so, it will fire the `valuechange`-event.
     *
     * @method checkChanged
     * @param e {Object} eventobject
     * @private
     * @since 0.0.1
     */
    checkChanged = function(e) {
        console.log(NAME, 'checkChanged');
        var node = e.target;
        // because of delegating all matched HtmlElements come along: only check the node that has focus:
        if (DOCUMENT.activeElement!==node) {
            return;
        }
        var prevData = node.getData(DATA_KEY),
            editable = ((editable=node.getAttr('contenteditable')) && (editable!=='false')),
            currentData = editable ? node.innerHTML : node[VALUE];
        if (currentData!==prevData.prevVal) {
            console.log(NAME, 'checkChanged --> value has been changed');
            DOCUMENT._emitVC(node, currentData);
            prevData.prevVal = currentData;
        }
    },

    /*
     * Removes the `focus` and `blur` events and ends the polling - if running. Because there are no subscribers anymore.
     *
     * @method teardownValueChange
     * @private
     * @since 0.0.1
     */
    teardownValueChange = function() {
        // check if there aren't any subscribers anymore.
        // in that case, we detach the `mouseover` lister because we don't want to
        // loose performance.
        if (!Event._subs['UI:valuechange']) {
            console.log(NAME, 'teardownValueChange: stop setting up blur and focus-event');
            subscriberBlur.detach();
            subscriberFocus.detach();
            // also stop any possible action/listeners to a current element:
            endFocus({target: DOCUMENT.activeElement});
            // reinit notifier, because it is a one-time notifier:
            Event.notify('UI:valuechange', setupValueChange, Event, true);
        }
    };

    Event.notify('UI:valuechange', setupValueChange, Event, true);
    Event.notifyDetach('UI:valuechange', teardownValueChange, Event);

    /*
     * Emits the `valuechange`-event on the specified node. Also adds e.value with the new value.
     *
     * @method _emitVC
     * @param node {HtmlElement} the HtmlElement that fires the event
     * @param value {String} the new value
     * @private
     * @since 0.0.1
     */
    DOCUMENT._emitVC = function(node, value) {
        console.log(NAME, 'document._emitVC');
        var e = {
            value: value,
            currentTarget: DOCUMENT,
            sourceTarget: node
        };
        /**
        * @event valuechange
        * @param e.value {String} new value
        * @param e.sourceTarget {Element} Element whare the valuechange occured
        */
        Event.emit(node, 'UI:valuechange', e);
    };

    window._ITSAmodules.EventValueChange = Event;

    return Event;
};

},{"../event-dom.js":14,"utils":42,"vdom":55}],17:[function(require,module,exports){
"use strict";

/**
 * Integrates mobile-events to event-dom. more about DOM-events:
 * http://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @example
 * Event = require('event-mobile')(window);
 *
 * @module event
 * @submodule event-mobile
 * @class Event
 * @since 0.0.1
*/

var NAME = '[event-mobile]: ';

module.exports = function (window) {
    /**
     * The (only) Hammer-instance that `Event` uses. It is bound to the `body`-element.
     *
     * @property hammertime
     * @type Hammer-instance
     * @since 0.0.1
     */
    var Event = require('event-dom')(window),
        document = window.document,
        Hammer = require('hammerjs'),
        hammertime = Event.hammertime = new Hammer(document.body),
        singletap, doubletap, tripletap;

    if (window._ITSAmodules.EventMobile) {
        return Event; // Event was already extended
    }

    // create reference to the HammerClass:
    /**
     * Adds the `Hammer`-class to Event, so it can be used from within Event.
     *
     * @property Hammer
     * @type Hammer
     * @since 0.0.1
     */
    Event.Hammer = Hammer;

    // now we extend HammerJS with 2 events: doubletap and tripletap:
    doubletap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
    tripletap = new Hammer.Tap({ event: 'tripletap', taps: 3 });
    hammertime.add([
        doubletap,
        tripletap
    ]);

    // we want to recognize this simulatenous, so a doubletap and trippletap will be detected even while a tap has been recognized.
    // the tap event will be emitted on every tap
    singletap = hammertime.get('tap');
    doubletap.recognizeWith(singletap);
    tripletap.recognizeWith([doubletap, singletap]);

    // patch Hammer.Manager.prototype.emit --> it shouldn't emit to its own listeners,
    // but to our eventsystem. Inspired from Jorik Tangelder's own jquery plugin: https://github.com/hammerjs/jquery.hammer.js
    Hammer.Manager.prototype.emit = function(type, data) {
        if (type==='hammer.input') {
            return;
        }
        console.log(NAME, 'emit '+type);
        // label the eventobject by being a Hammer-event
        // is not being used internally, but we would like
        // to inform the subscribers
        data._isHammer = true;
        data.type = type;

        // Emitting 'ParcelaEvent:eventmobile' --> its defaultFn is defined inside `event-dom`
        // which will transport the event through the special dom-cycle
        /**
         * Is emitted whenever hammerjs detects a gestureevent.
         * By emitting its original event through ParcelaEvent:eventmobile, `event-dom`
         * will catch it and process it through the dom-event cycle.
         *
         * @event ParcelaEvent:eventmobile
         * @param e {Object} eventobject
         * @since 0.1
        **/
        Event._domCallback(data);
    };

    Hammer.Manager.prototype.set = (function(originalSet) {
        return function(options) {
            delete options.domEvents; // we don't want the user make Hammer fire domevents
            originalSet.call(this, options);
        };
    })(Hammer.Manager.prototype.set);

    // store module:
    window._ITSAmodules.EventMobile = Event;

    return Event;
};

},{"event-dom":14,"hammerjs":2}],18:[function(require,module,exports){
(function (global){
/**
 * Defines the Event-Class, which should be instantiated to get its functionality
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 *
 * @module event
 * @class Event
 * @constructor
 * @since 0.0.1
*/

require('polyfill/polyfill-base.js');
require('js-ext/lib/function.js');
require('js-ext/lib/object.js');

// to prevent multiple Event instances
// (which might happen: http://nodejs.org/docs/latest/api/modules.html#modules_module_caching_caveats)
// we make sure Event is defined only once. Therefore we bind it to `global` and return it if created before


(function (global, factory) {

    "use strict";

    if (!global._ITSAmodules) {
        Object.defineProperty(global, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }
    global._ITSAmodules.Event || (global._ITSAmodules.Event = factory());

    module.exports = global._ITSAmodules.Event;

}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this, function () {

    "use strict";

    var NAME = '[core-event]: ',
        REGEXP_CUSTOMEVENT = /^((?:\w|-)+):((?:\w|-)+)$/,
        REGEXP_WILDCARD_CUSTOMEVENT = /^(?:((?:(?:\w|-)+)|\*):)?((?:(?:\w|-)+)|\*)$/,
        /* REGEXP_WILDCARD_CUSTOMEVENT :
         *
         * valid:
         * 'red:save'
         * 'red:*'
         * '*:save'
         * '*:*'
         * 'save'
         *
         * invalid:
         * '*red:save'
         * 're*d:save'
         * 'red*:save'
         * 'red:*save'
         * 'red:sa*ve'
         * 'red:save*'
         * ':save'
         */
        REGEXP_EVENTNAME_WITH_SEMICOLON = /:((?:\w|-)+)$/,
        DEFINE_IMMUTAL_PROPERTY = function (obj, property, value) {
            Object.defineProperty(obj, property, {
                configurable: false,
                enumerable: false,
                writable: false,
                value: value // `writable` is false means we cannot chance the value-reference, but we can change {} or [] its members
            });
        },
        Event;

    Event = {
        /**
         * Subscribes to a customEvent. The callback will be executed `after` the defaultFn.
         *
         * @static
         * @method after
         * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
         *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
         *        If `emitterName` is not defined, `UI` is assumed.
         * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
         *        as its only argument.
         * @param [context] {Object} the instance that subscribes to the event.
         *        any object can passed through, even those are not extended with event-listener methods.
         *        Note: Objects who are extended with listener-methods should use instance.after() instead.
         * @param [filter] {String|Function} to filter the event.
         *        Use a String if you want to filter DOM-events by a `selector`
         *        Use a function if you want to filter by any other means. If the function returns a trully value, the
         *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
         *        the subscriber.
         * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
         * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
         * @since 0.0.1
        */
        after: function(customEvent, callback, context, filter, prepend) {
            console.log(NAME, 'add after subscriber to: '+customEvent);
            return this._addMultiSubs(false, customEvent, callback, context, filter, prepend);
        },

        /**
         * Subscribes to a customEvent. The callback will be executed `before` the defaultFn.
         *
         * @static
         * @method before
         * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
         *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
         *        If `emitterName` is not defined, `UI` is assumed.
         * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
         *        as its only argument.
         * @param [context] {Object} the instance that subscribes to the event.
         *        any object can passed through, even those are not extended with event-listener methods.
         *        Note: Objects who are extended with listener-methods should use instance.before() instead.
         * @param [filter] {String|Function} to filter the event.
         *        Use a String if you want to filter DOM-events by a `selector`
         *        Use a function if you want to filter by any other means. If the function returns a trully value, the
         *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
         *        the subscriber.
         * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of before-subscribers.
         * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
         * @since 0.0.1
        */
        before: function(customEvent, callback, context, filter, prepend) {
            console.log(NAME, 'add before subscriber to: '+customEvent);
            return this._addMultiSubs(true, customEvent, callback, context, filter, prepend);
        },

        /**
         * Defines an emitterName into the instance (emitter).
         * This will add a protected property `_emitterName` to the instance.
         *
         * @static
         * @method defineEmitter
         * @param emitter {Object} instance that should hold the emitterName
         * @param emitterName {String} identifier that will be added when events are sent (`emitterName:eventName`)
         * @since 0.0.1
         */
        defineEmitter: function (emitter, emitterName) {
            console.log(NAME, 'defineEmitter: '+emitterName);
            // ennumerable MUST be set `true` to enable merging
            Object.defineProperty(emitter, '_emitterName', {
                configurable: false,
                enumerable: true,
                writable: false,
                value: emitterName
            });
        },

        /**
         * Defines a CustomEvent. If the eventtype already exists, it will not be overridden,
         * unless you force to assign with `.forceAssign()`
         *
         * The returned object comes with 4 methods which can be invoked chainable:
         *
         * <ul>
         *     <li>defaultFn() --> the default-function of the event</li>
         *     <li>preventedFn() --> the function that should be invoked when the event is defaultPrevented</li>
         *     <li>forceAssign() --> overrides any previous definition</li>
         *     <li>unHaltable() --> makes the customEvent cannot be halted</li>
         *     <li>unPreventable() --> makes the customEvent's defaultFn cannot be prevented</li>
         *     <li>unSilencable() --> makes that emitters cannot make this event to perform silently (using e.silent)</li>
         *     <li>unRenderPreventable() --> makes that the customEvent's render cannot be prevented</li>
         *     <li>noRender() --> prevents this customEvent from render the dom. Overrules unRenderPreventable()</li>
         * </ul>
         *
         * @static
         * @method defineEvent
         * @param customEvent {String} name of the customEvent conform the syntax: `emitterName:eventName`
         * @return {Object} with extra methods that can be chained:
         * <ul>
         *      <li>unPreventable() --> makes the customEvent's defaultFn cannot be prevented</li>
         *      <li>unRenderPreventable() --> makes that the customEvent's render cannot be prevented</li>
         *      <li>forceAssign() --> overrides any previous definition</li>
         *      <li>defaultFn() --> the default-function of the event</li>
         *      <li>preventedFn() --> the function that should be invoked when the event is defaultPrevented</li>
         * </ul>
         * @since 0.0.1
         */
        defineEvent: function (customEvent) {
            console.log(NAME, 'Events.defineEvent: '+customEvent);
            var instance = this,
                customevents = instance._ce,
                extract, exists, newCustomEvent;

            if (typeof customEvent!=='string') {
                console.error(NAME, 'defineEvent should have a String-type as argument');
                return;
            }
            extract = customEvent.match(REGEXP_CUSTOMEVENT);
            if (!extract) {
                console.error(NAME, 'defined Customevent '+customEvent+' does not match pattern');
                return;
            }
            newCustomEvent = {
                preventable: true,
                renderPreventable: true
            };
            exists = customevents[customEvent];
            // if customEvent not yet exists, we can add it
            // else, we might need to wait for `forceAssign` to be called
            if (!exists) {
                // we can add it
                customevents[customEvent] = newCustomEvent;
            }
            return {
                defaultFn: function(defFn) {
                    newCustomEvent.defaultFn = defFn;
                    return this;
                },
                preventedFn: function(prevFn) {
                    newCustomEvent.preventedFn = prevFn;
                    return this;
                },
                unHaltable: function() {
                    newCustomEvent.unHaltable = true;
                    return this;
                },
                unSilencable: function() {
                    newCustomEvent.unSilencable = true;
                    return this;
                },
                unPreventable: function() {
                    newCustomEvent.unPreventable = true;
                    return this;
                },
                unRenderPreventable: function() {
                    newCustomEvent.unRenderPreventable = true;
                    return this;
                },
                noRender: function() {
                    newCustomEvent.noRender = true;
                    return this;
                },
                forceAssign: function() {
                    // only needed when not yet added:
                    // exists || (customevents[customEvent]=newCustomEvent);
                    customevents[customEvent] = newCustomEvent;
                    return this;
                }
            };
        },

        /**
         * Detaches (unsubscribes) the listener from the specified customEvent.
         *
         * @static
         * @method detach
         * @param [listener] {Object} The instance that is going to detach the customEvent.
         *        When not passed through (or undefined), all customevents of all instances are detached
         * @param customEvent {String} conform the syntax: `emitterName:eventName`, wildcard `*` may be used for both
         *        `emitterName` as well as only `eventName`, in which case 'UI' will become the emitterName.
         *        Can be set as the only argument.
         * @since 0.0.1
        */
        detach: function(listener, customEvent) {
            console.log('detach instance-subscriber: '+customEvent);
            // (typeof listener === 'string') means: only `customEvent` passed through
            (typeof listener === 'string') ? this._removeSubscribers(undefined, listener) : this._removeSubscribers(listener, customEvent);
        },

        /**
         * Detaches (unsubscribes) the listener from all customevents.
         *
         * @static
         * @method detachAll
         * @param listener {Object} The instance that is going to detach the customEvent
         * @since 0.0.1
        */
        detachAll: function(listener) {
            console.log(NAME, 'detach '+(listener ? 'all instance-' : 'ALL')+' subscribers');
            var instance = this;
            if (listener) {
                instance._removeSubscribers(listener, '*:*');
            }
            else {
                // we cannot just redefine _subs, for it is set as readonly
                instance._subs.each(
                    function(value, key) {
                        delete instance._subs[key];
                    }
                );
            }
        },

        /**
         * Emits the event `eventName` on behalf of `emitter`, which becomes e.target in the eventobject.
         * During this process, all subscribers and the defaultFn/preventedFn get an eventobject passed through.
         * The eventobject is created with at least these properties:
         *
         * <ul>
         *     <li>e.target --> source that triggered the event (instance or DOM-node), specified by `emitter`</li>
         *     <li>e.type --> eventName</li>
         *     <li>e.emitter --> emitterName</li>
         *     <li>e.status --> status-information:
         *          <ul>
         *               <li>e.status.ok --> `true|false` whether the event got executed (not halted or defaultPrevented)</li>
         *               <li>e.status.defaultFn (optional) --> `true` if any defaultFn got invoked</li>
         *               <li>e.status.preventedFn (optional) --> `true` if any preventedFn got invoked</li>
         *               <li>e.status.rendered (optional) --> `true` the vDOM rendered the dom</li>
         *               <li>e.status.halted (optional) --> `reason|true` if the event got halted and optional the why</li>
         *               <li>e.status.defaultPrevented (optional) -->  `reason|true` if the event got defaultPrevented and optional the why</li>
         *               <li>e.status.renderPrevented (optional) -->  `reason|true` if the event got renderPrevented and optional the why</li>
         *          </ul>
         *     </li>
         * </ul>
         *
         * The optional `payload` is merged into the eventobject and could be used by the subscribers and the defaultFn/preventedFn.
         * If payload.silent is set true, the subscribers are not getting invoked: only the defaultFn.
         *
         * The eventobject also has these methods:
         *
         * <ul>
         *     <li>e.halt() --> stops immediate all actions: no mer subscribers are invoked, no defaultFn/preventedFn</li>
         *     <li>e.preventDefault() --> instead of invoking defaultFn, preventedFn will be invoked. No aftersubscribers</li>
         *     <li>e.preventRender() --> by default, any event will trigger the vDOM (if exists) to re-render, this can be prevented by calling e.preventRender()</li>
         * </ul>
         *
         * <ul>
         *     <li>First, before-subscribers are invoked: this is the place where you might call `e.halt()`, `a.preventDefault()` or `e.preventRender()`</li>
         *     <li>Next, defaultFn or preventedFn gets invoked, depending on whether e.halt() or a.preventDefault() has been called</li>
         *     <li>Next, after-subscribers get invoked (unless e.halt() or a.preventDefault() has been called)</li>
         *     <li>Finally, the finalization takes place: any subscribers are invoked, unless e.halt() or a.preventDefault() has been called</li>
         * <ul>
         *
         * @static
         * @method emit
         * @param [emitter] {Object} instance that emits the events
         * @param customEvent {String} Full customEvent conform syntax `emitterName:eventName`.
         *        `emitterName` is available as **e.emitter**, `eventName` as **e.type**.
         * @param payload {Object} extra payload to be added to the event-object
         * @return {Object|undefined} eventobject or undefined when the event was halted or preventDefaulted.
         * @since 0.0.1
         */
        emit: function (emitter, customEvent, payload) {
            var instance = this;
            if (typeof emitter === 'string') {
                // emit is called with signature emit(customEvent, payload)
                // thus the source-emitter is the Event-instance
                payload = customEvent;
                customEvent = emitter;
                emitter = instance;
            }
            return instance._emit(emitter, customEvent, payload);
        },

        /**
         * Adds a subscriber to the finalization-cycle, which happens after the after-subscribers.
         * Only get invoked when the cycle was not preventDefaulted or halted.
         *
         * @method finalize
         * @param finallySubscriber {Function} callback to be invoked
         *        Function recieves the eventobject as its only argument
         * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
         * @since 0.0.1
         */
        finalize: function (finallySubscriber) {
            console.log(NAME, 'finalize');
            var finalHash = this._final;
            finalHash.push(finallySubscriber);
            return {
                detach: function() {
                    console.log(NAME, 'detach finalizer');
                    var index = finalHash.indexOf(finallySubscriber);
                    (index===-1) || finalHash.splice(index, 1);
                }
            };
        },

        /**
         * Creates a notifier for the customEvent.
         * You can use this to create delayed `defineEvents`. When the customEvent is called, the callback gets invoked
         * (even before the subsrcibers). Use this callback for delayed customEvent-definitions.
         *
         * Use **no** wildcards for the emitterName. You might use wildcards for the eventName. Without wildcards, the
         * notification will be unNotified (callback automaticly detached) on the first time the event occurs.

         * You **must** specify the full `emitterName:eventName` syntax.
         * The module `core-event-dom` uses `notify` to auto-define DOM-events (UI:*).
         *
         * @static
         * @method notify
         * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
         *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used only  for`eventName`.
         *        If `emitterName` should be defined.
         * @param callback {Function} subscriber: will be invoked when the customEvent is called (before any subscribers.
         *                 Recieves 2 arguments: the `customEvent` and `subscriber-object`.
         * @param context {Object} context of the callback
         * @param [once=false] {Boolean} whether the subscriptions should be removed after the first invokation
         * @chainable
         * @since 0.0.1
        */
        notify: function(customEvent, callback, context, once) {
            console.log(NAME, 'notify');
            this._notifiers[customEvent] = {
                cb: callback,
                o: context,
                r: once // r = remove automaticly
            };
            return this;
        },

        /**
         * Creates a detach-notifier for the customEvent.
         * You can use this to get informed whenever a subscriber detaches.
         *
         * Use **no** wildcards for the emitterName. You might use wildcards for the eventName. Without wildcards, the
         * notification will be unNotified (callback automaticly detached) on the first time the event occurs.

         * You **must** specify the full `emitterName:eventName` syntax.
         * The module `core-event-dom` uses `notify` to auto-define DOM-events (UI:*).
         *
         * @static
         * @method notifyDetach
         * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
         *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used only  for`eventName`.
         *        If `emitterName` should be defined.
         * @param callback {Function} subscriber: will be invoked when the customEvent is called (before any subscribers.
         *                 Recieves 1 arguments: the `customEvent`.
         * @param context {Object} context of the callback
         * @param [once=false] {Boolean} whether the subscriptions should be removed after the first invokation
         * @chainable
         * @since 0.0.1
        */
        notifyDetach: function(customEvent, callback, context, once) {
            console.log(NAME, 'notifyDetach');
            this._detachNotifiers[customEvent] = {
                cb: callback,
                o: context,
                r: once // r = remove automaticly
            };
            return this;
        },

        /**
         * Subscribes to a customEvent. The callback will be executed `after` the defaultFn.
         * The subscriber will be automaticly removed once the callback executed the first time.
         * No need to `detach()` (unless you want to undescribe before the first event)
         *
         * @static
         * @method onceAfter
         * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
         *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
         *        If `emitterName` is not defined, `UI` is assumed.
         * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
         *        as its only argument.
         * @param [context] {Object} the instance that subscribes to the event.
         *        any object can passed through, even those are not extended with event-listener methods.
         *        Note: Objects who are extended with listener-methods should use instance.onceAfter() instead.
         * @param [filter] {String|Function} to filter the event.
         *        Use a String if you want to filter DOM-events by a `selector`
         *        Use a function if you want to filter by any other means. If the function returns a trully value, the
         *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
         *        the subscriber.
         * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
         * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
         * @since 0.0.1
        */
        onceAfter: function(customEvent, callback, context, filter, prepend) {
            var instance = this,
                handler, wrapperFn;
            console.log(NAME, 'add onceAfter subscriber to: '+customEvent);
            wrapperFn = function(e) {
                // CAUTIOUS: removeing the handler right now would lead into a mismatch of the dispatcher
                // who loops through the array of subscribers!
                // therefore, we must remove once the eventcycle has finished --> we detach by setting it
                // at the end of the global-eventstack:
                // yet there still is a change that the event is called multiple times BEFORE it
                // will reach the defined `setTimeout` --> to avoid multiple invocations, handler is
                // extended with the property `_detached`
                handler._detached  || callback.call(this, e);
                handler._detached = true;
                setTimeout(function() {handler.detach();}, 0);
            };
            handler = instance._addMultiSubs(false, customEvent, wrapperFn, context, filter, prepend);
            return handler;
        },

        /**
         * Subscribes to a customEvent. The callback will be executed `before` the defaultFn.
         * The subscriber will be automaticly removed once the callback executed the first time.
         * No need to `detach()` (unless you want to undescribe before the first event)
         *
         * @static
         * @method onceBefore
         * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
         *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
         *        If `emitterName` is not defined, `UI` is assumed.
         * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
         *        as its only argument.
         * @param [context] {Object} the instance that subscribes to the event.
         *        any object can passed through, even those are not extended with event-listener methods.
         *        Note: Objects who are extended with listener-methods should use instance.onceBefore() instead.
         * @param [filter] {String|Function} to filter the event.
         *        Use a String if you want to filter DOM-events by a `selector`
         *        Use a function if you want to filter by any other means. If the function returns a trully value, the
         *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
         *        the subscriber.
         * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of before-subscribers.
         * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
         * @since 0.0.1
        */
        onceBefore: function(customEvent, callback, context, filter, prepend) {
            var instance = this,
                handler, wrapperFn;
            console.log(NAME, 'add onceBefore subscriber to: '+customEvent);
            wrapperFn = function(e) {
                // CAUTIOUS: removeing the handler right now would lead into a mismatch of the dispatcher
                // who loops through the array of subscribers!
                // therefore, we must remove once the eventcycle has finished --> we detach by setting it
                // at the end of the global-eventstack.
                // yet there still is a change that the event is called multiple times BEFORE it
                // will reach the defined `setTimeout` --> to avoid multiple invocations, handler is
                // extended with the property `_detached`
                handler._detached  || callback.call(this, e);
                handler._detached = true;
                setTimeout(function() {handler.detach();}, 0);
            };
            handler = instance._addMultiSubs(true, customEvent, wrapperFn, context, filter, prepend);
            return handler;
        },

        /**
         * Removes all event-definitions of an emitter, specified by its `emitterName`.
         * When `emitterName` is not set, ALL event-definitions will be removed.
         *
         * @static
         * @method undefAllEvents
         * @param [emitterName] {String} name of the customEvent conform the syntax: `emitterName:eventName`
         * @since 0.0.1
         */
        undefAllEvents: function (emitterName) {
            console.log(NAME, 'undefAllEvents');
            var instance = this,
                pattern;
            if (emitterName) {
                pattern = new RegExp('^'+emitterName+':');
                instance._ce.each(
                    function(value, key) {
                        key.match(pattern) && (delete instance._ce[key]);
                    }
                );
            }
            else {
                instance._ce.each(
                    function(value, key) {
                        delete instance._ce[key];
                    }
                );
            }
        },

        /**
         * Removes the event-definition of the specified customEvent.
         *
         * @static
         * @method undefEvent
         * @param customEvent {String} name of the customEvent conform the syntax: `emitterName:eventName`
         * @since 0.0.1
         */
        undefEvent: function (customEvent) {
            console.log(NAME, 'undefEvent '+customEvent);
            delete this._ce[customEvent];
        },

        /**
         * unNotifies (unsubscribes) the notifier of the specified customEvent.
         *
         * @static
         * @method unNotify
         * @param customEvent {String} conform the syntax: `emitterName:eventName`.
         * @since 0.0.1
        */
        unNotify: function(customEvent) {
            console.log(NAME, 'unNotify '+customEvent);
            delete this._notifiers[customEvent];
        },

        /**
         * unNotifies (unsubscribes) the detach-notifier of the specified customEvent.
         *
         * @static
         * @method unNotifyDetach
         * @param customEvent {String} conform the syntax: `emitterName:eventName`.
         * @since 0.0.1
        */
        unNotifyDetach: function(customEvent) {
            console.log(NAME, 'unNotifyDetach '+customEvent);
            delete this._detachNotifiers[customEvent];
        },

        //====================================================================================================
        // private methods:
        //====================================================================================================

        /**
         * Creates a subscriber to the specified customEvent. The customEvent must conform the syntax:
         * `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`
         * If `emitterName` is not defined, `UI` is assumed.
         *
         * Examples of valid customevents:
         *
         * <ul>
         *     <li>'redmodel:save'</li>
         *     <li>'UI:click'</li>
         *     <li>'click' --> alias for 'UI:click'</li>
         *     <li>'`*`:click' --> careful: will listen to both UIs and non-UI- click-events</li>
         *     <li>'redmodel:`*`'</li>
         *     <li>'`*`:`*`'</li>
         * </ul>
         *
         * @static
         * @method _addMultiSubs
         * @param before {Boolean} whether the subscriber is a `before` subscriber. On falsy, an `after`-subscriber is assumed.
         * @param customEvent {Array} Array of Strings. customEvent should conform the syntax: `emitterName:eventName`, wildcard `*`
         *         may be used for both `emitterName` as well as only `eventName`, in which case 'UI' will become the emitterName.
         * @param callback {Function} subscriber to the event.
         * @param listener {Object} Object that creates the subscriber (and will be listening by `listener.after(...)`)
         * @param [filter] {String|Function} to filter the event.
         *        Use a String if you want to filter DOM-events by a `selector`
         *        Use a function if you want to filter by any other means. If the function returns a trully value, the
         *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
         *        the subscriber.
         * @param [prepend=false] {Boolean} whether to make the subscriber the first in the list. By default it will pe appended.
         * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
         * @private
         * @since 0.0.1
        */
        _addMultiSubs: function(before, customEvent, callback, listener, filter, prepend) {
            console.log(NAME, '_addMultiSubs');
            var instance = this,
                subscribers;
            if ((typeof listener === 'string') || (typeof listener === 'function')) {
                prepend = filter;
                filter = listener;
                listener = null;
            }
            else if (typeof listener === 'boolean') {
                prepend = listener;
                filter = null;
                listener = null;
            }
            if ((typeof filter==='boolean') || (typeof filter===undefined) || (typeof filter===null)) {
                // filter was not set, instead `prepend` is set at this position
                prepend = filter;
                filter = null;
            }
            if (!Array.isArray(customEvent)) {
                return instance._addSubscriber(listener, before, customEvent, callback, filter, prepend);
            }
            subscribers = [];
            customEvent.forEach(
                function(ce) {
                    subscribers.push(instance._addSubscriber(listener, before, ce, callback, filter, prepend));
                }
            );
            return {
                detach: function() {
                    subscribers.each(
                        function(subscriber) {
                            subscriber.detach();
                        }
                    );
                }
            };
        },

        /**
         * Creates a subscriber to the specified customEvent. The customEvent must conform the syntax:
         * `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`
         * If `emitterName` is not defined, `UI` is assumed.
         *
         * Examples of valid customevents:
         *
         * <ul>
         *     <li>'redmodel:save'</li>
         *     <li>'UI:click'</li>
         *     <li>'click' --> alias for 'UI:click'</li>
         *     <li>'`*`:click' --> careful: will listen to both UIs and non-UI- click-events</li>
         *     <li>'redmodel:`*`'</li>
         *     <li>'`*`:`*`'</li>
         * </ul>
         *
         * @static
         * @method _addSubscriber
         * @param listener {Object} Object that creates the subscriber (and will be listening by `listener.after(...)`)
         * @param before {Boolean} whether the subscriber is a `before` subscriber. On falsy, an `after`-subscriber is assumed.
         * @param customEvent {String} conform the syntax: `emitterName:eventName`, wildcard `*` may be used for both
         *        `emitterName` as well as only `eventName`, in which case 'UI' will become the emitterName.
         * @param callback {Function} subscriber to the event.
         * @param [filter] {String|Function} to filter the event.
         *        Use a String if you want to filter DOM-events by a `selector`
         *        Use a function if you want to filter by any other means. If the function returns a trully value, the
         *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
         *        the subscriber.
         * @param [prepend=false] {Boolean} whether to make the subscriber the first in the list. By default it will pe appended.
         * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
         * @private
         * @since 0.0.1
        */
        _addSubscriber: function(listener, before, customEvent, callback, filter, prepend) {
            var instance = this,
                allSubscribers = instance._subs,
                extract = customEvent.match(REGEXP_WILDCARD_CUSTOMEVENT),
                hashtable, item, notifier, customEventWildcardEventName;

            if (!extract) {
                console.error(NAME, 'subscribe-error: eventname does not match pattern');
                return;
            }

            item = {
                o: listener || instance,
                cb: callback,
                f: filter
            };

            // if extract[1] is undefined, a simple customEvent is going to subscribe (without :)
            // therefore: recomposite customEvent:
            extract[1] || (customEvent='UI:'+customEvent);

            // if extract[1] === 'this', then a listener to its own emitterName is supposed
            if (extract[1]==='this') {
                if (listener._emitterName) {
                    customEvent = listener._emitterName+':'+extract[2];
                    item.s = true; // s --> self
                }
                else {
                    console.error(NAME, 'subscribe-error: "this" cannot be detemined because the object is no emitter');
                    return;
                }
            }

            allSubscribers[customEvent] || (allSubscribers[customEvent]={});
            if (before) {
                allSubscribers[customEvent].b || (allSubscribers[customEvent].b=[]);
            }
            else {
                allSubscribers[customEvent].a || (allSubscribers[customEvent].a=[]);
            }

            hashtable = allSubscribers[customEvent][before ? 'b' : 'a'];
            // we need to be able to process an array of customevents

            // in case of a defined subscription (no wildcard), we should look for notifiers
            if ((extract[1]!=='*') && (extract[2]!=='*')) {
                // before subscribing: we might need to activate notifiers --> with defined eventName should also be cleaned up:
                notifier = instance._notifiers[customEvent];
                if (notifier) {
                    notifier.cb.call(notifier.o, customEvent, item);
                    if (notifier.r) {
                        delete instance._notifiers[customEvent];
                    }
                }
                // check the same for wildcard eventName:
                customEventWildcardEventName = customEvent.replace(REGEXP_EVENTNAME_WITH_SEMICOLON, ':*');
                if ((customEventWildcardEventName !== customEvent) && (notifier=instance._notifiers[customEventWildcardEventName])) {
                    notifier.cb.call(notifier.o, customEvent, item);
                    if (notifier.r) {
                        delete instance._notifiers[customEvent];
                    }
                }
            }

            console.log(NAME, '_addSubscriber to customEvent: '+customEvent);
            prepend ? hashtable.unshift(item) : hashtable.push(item);

            return {
                detach: function() {
                    instance._removeSubscriber(listener, before, customEvent, callback);
                }
            };
        },

        /**
         * Emits the event `eventName` on behalf of `emitter`, which becomes e.target in the eventobject.
         * During this process, all subscribers and the defaultFn/preventedFn get an eventobject passed through.
         * The eventobject is created with at least these properties:
         *
         * <ul>
         *     <li>e.target --> source that triggered the event (instance or DOM-node), specified by `emitter`</li>
         *     <li>e.type --> eventName</li>
         *     <li>e.emitter --> emitterName</li>
         *     <li>e.status --> status-information:
         *          <ul>
         *               <li>e.status.ok --> `true|false` whether the event got executed (not halted or defaultPrevented)</li>
         *               <li>e.status.defaultFn (optional) --> `true` if any defaultFn got invoked</li>
         *               <li>e.status.preventedFn (optional) --> `true` if any preventedFn got invoked</li>
         *               <li>e.status.rendered (optional) --> `true` the vDOM rendered the dom</li>
         *               <li>e.status.halted (optional) --> `reason|true` if the event got halted and optional the why</li>
         *               <li>e.status.defaultPrevented (optional) -->  `reason|true` if the event got defaultPrevented and optional the why</li>
         *               <li>e.status.renderPrevented (optional) -->  `reason|true` if the event got renderPrevented and optional the why</li>
         *          </ul>
         *     </li>
         * </ul>
         *
         * The optional `payload` is merged into the eventobject and could be used by the subscribers and the defaultFn/preventedFn.
         * If payload.silent is set true, the subscribers are not getting invoked: only the defaultFn.
         *
         * The eventobject also has these methods:
         *
         * <ul>
         *     <li>e.halt() --> stops immediate all actions: no mer subscribers are invoked, no defaultFn/preventedFn</li>
         *     <li>e.preventDefault() --> instead of invoking defaultFn, preventedFn will be invoked. No aftersubscribers</li>
         *     <li>e.preventRender() --> by default, any event will trigger the vDOM (if exists) to re-render, this can be prevented by calling e.preventRender()</li>
         * </ul>
         *
         * <ul>
         *     <li>First, before-subscribers are invoked: this is the place where you might call `e.halt()`, `a.preventDefault()` or `e.preventRender()`</li>
         *     <li>Next, defaultFn or preventedFn gets invoked, depending on whether e.halt() or a.preventDefault() has been called</li>
         *     <li>Next, after-subscribers get invoked (unless e.halt() or a.preventDefault() has been called)</li>
         *     <li>Finally, the finalization takes place: any subscribers are invoked, unless e.halt() or a.preventDefault() has been called</li>
         * <ul>
         *
         * @static
         * @method emit
         * @param [emitter] {Object} instance that emits the events
         * @param customEvent {String} Full customEvent conform syntax `emitterName:eventName`.
         *        `emitterName` is available as **e.emitter**, `eventName` as **e.type**.
         * @param payload {Object} extra payload to be added to the event-object
         * @param [beforeSubscribers] {Array} array of functions to act as beforesubscribers. <b>should not be used</b> other than
         *                            by any submodule like `event-dom`. If used, than this list of subscribers gets invoked instead
         *                            of the subscribers that actually subscribed to the event.
         * @param [afterSubscribers] {Array} array of functions to act as afterSubscribers. <b>should not be used</b> other than
         *                            by any submodule like `event-dom`. If used, than this list of subscribers gets invoked instead
         *                            of the subscribers that actually subscribed to the event.
         * @param [preProcessor] {Function} if passed, this function will be invoked before every single subscriber
         *                       It is meant to manipulate the eventobject, something that `event-dom` needs to do
         *                       This function expects 2 arguments: `subscriber` and `eventobject`.
         *                       <b>should not be used</b> other than by any submodule like `event-dom`.
         * @param [keepPayload] {Boolean} whether `payload` should be used as the ventobject instead of creating a new
         *                      eventobject and merge payload. <b>should not be used</b> other than by any submodule like `event-dom`.
         * @return {Object|undefined} eventobject or undefined when the event was halted or preventDefaulted.
         * @since 0.0.1
         */
        _emit: function (emitter, customEvent, payload, beforeSubscribers, afterSubscribers, preProcessor, keepPayload) {
            // NOTE: emit() needs to be synchronous! otherwise we wouldn't be able
            // to preventDefault DOM-events in time.
            var instance = this,
                allCustomEvents = instance._ce,
                allSubscribers = instance._subs,
                customEventDefinition, extract, emitterName, eventName, subs, wildcard_named_subs,
                named_wildcard_subs, wildcard_wildcard_subs, e, invokeSubs;

            (customEvent.indexOf(':') !== -1) || (customEvent = emitter._emitterName+':'+customEvent);
            console.log(NAME, 'customEvent.emit: '+customEvent);

            extract = customEvent.match(REGEXP_CUSTOMEVENT);
            if (!extract) {
                console.error(NAME, 'defined emit-event does not match pattern');
                return;
            }
            emitterName = extract[1];
            eventName = extract[2];
            customEventDefinition = allCustomEvents[customEvent];

            subs = allSubscribers[customEvent];
            wildcard_named_subs = allSubscribers['*:'+eventName];
            named_wildcard_subs = allSubscribers[emitterName+':*'];
            wildcard_wildcard_subs = allSubscribers['*:*'];

            if (keepPayload) {
                e = payload;
            }
            else {
                e = Object.create(instance._defaultEventObj);
                // e.target = (payload && payload.target) || emitter; // make it possible to force a specific e.target
                e.target = emitter;
                e.type = eventName;
                e.emitter = emitterName;
                e.status = {};
                if (customEventDefinition) {
                    e._unPreventable = customEventDefinition.unPreventable;
                    e._unHaltable = customEventDefinition.unHaltable;
                    e._unRenderPreventable = customEventDefinition.unRenderPreventable;
                    customEventDefinition.unSilencable && (e.status.unSilencable = true);
                }
                if (payload) {
                    // e.merge(payload); is not enough --> DOM-eventobject has many properties that are not "own"-properties
                    for (var key in payload) {
                        e[key] || (e[key]=payload[key]);
                    }
                }
                if (e.status.unSilencable && e.silent) {
                    console.warn(NAME, ' event '+e.emitter+':'+e.type+' cannot made silent: this customEvent is defined as unSilencable');
                    e.silent = false;
                }
            }
            if (beforeSubscribers) {
                instance._invokeSubs(e, false, true, preProcessor, {b: beforeSubscribers});
            }
            else {
                invokeSubs = instance._invokeSubs.bind(instance, e, true, true, false);
                [subs, named_wildcard_subs, wildcard_named_subs, wildcard_wildcard_subs].forEach(invokeSubs);
            }
            e.status.ok = !e.status.halted && !e.status.defaultPrevented;
            // in case any subscriber changed e.target inside its filter (event-dom does this),
            // then we reset e.target to its original. But only if e._noResetSourceTarget is undefined:
            // (e._noResetSourceTarget can be used to supress this behaviour --> dragdrop uses this)
            e.sourceTarget && !e._noResetSourceTarget && (e.target=e.sourceTarget);
            if (customEventDefinition && !e.status.halted) {
                // now invoke defFn
                e.returnValue = (e.status.defaultPrevented || e.status.defaultPreventedContinue) ?
                                (customEventDefinition.preventedFn && (e.status.preventedFn=true) && customEventDefinition.preventedFn.call(e.target, e)) :
                                (customEventDefinition.defaultFn && (e.status.defaultFn=true) && customEventDefinition.defaultFn.call(e.target, e));
            }

            if (e.status.ok) {
                if (afterSubscribers) {
                    instance._invokeSubs(e, false, false, preProcessor, {a: afterSubscribers});
                }
                else {
                    invokeSubs = instance._invokeSubs.bind(instance, e, true, false, false);
                    [subs, named_wildcard_subs, wildcard_named_subs, wildcard_wildcard_subs].forEach(invokeSubs);
                }
                if (!e.silent) {
                    // in case any subscriber changed e.target inside its filter (event-dom does this),
                    // then we reset e.target to its original:
                    e.sourceTarget && (e.target=e.sourceTarget);
                    instance._final.some(function(finallySubscriber) {
                        !e.silent && finallySubscriber(e);
                        if (e.status.unSilencable && e.silent) {
                            console.warn(NAME, ' event '+e.emitter+':'+e.type+' cannot made silent: this customEvent is defined as unSilencable');
                            e.silent = false;
                        }
                        return e.silent;
                    });
                }
            }
            return e;
        },

        /**
         * Does the actual invocation of a subscriber.
         *
         * @method _invokeSubs
         * @param e {Object} event-object
         * @param [checkFilter] {Boolean}
         * @param [before] {Boolean} whether it concerns before subscribers
         * @param [checkFilter] {Boolean}
         * @param subscribers {Array} contains subscribers (objects) with these members:
         * <ul>
         *     <li>subscriber.o {Object} context of the callback</li>
         *     <li>subscriber.cb {Function} callback to be invoked</li>
         *     <li>subscriber.f {Function} filter to be applied</li>
         *     <li>subscriber.t {DOM-node} target for the specific selector, which will be set as e.target
         *         only when event-dom is active and there are filter-selectors</li>
         *     <li>subscriber.n {DOM-node} highest dom-node that acts as the container for delegation.
         *         only when event-dom is active and there are filter-selectors</li>
         *     <li>subscriber.s {Boolean} true when the subscription was set to itself by using "this:eventName"</li>
         * </ul>
         * @private
         * @since 0.0.1
         */
        _invokeSubs: function (e, checkFilter, before, preProcessor, subscribers) { // subscribers, plural
            console.log(NAME, '_invokeSubs');
            var subs, passesThis, passesFilter;
            if (subscribers && !e.status.halted && !e.silent) {
                subs = before ? subscribers.b : subscribers.a;
                subs && subs.some(function(subscriber) {
                    console.log(NAME, '_invokeSubs checking invokation for single subscriber');
                    if (preProcessor && preProcessor(subscriber, e)) {
                        return true;
                    }
                    // check: does it need to be itself because of subscribing through 'this'
                    passesThis = (!subscriber.s || (subscriber.o===e.target));
                    // check: does it pass the filter
                    passesFilter = (!checkFilter || !subscriber.f || subscriber.f.call(subscriber.o, e));
                    if (passesThis && passesFilter) {
                        // finally: invoke subscriber
                        console.log(NAME, '_invokeSubs is going to invoke subscriber');
                        subscriber.cb.call(subscriber.o, e);
                    }
                    if (e.status.unSilencable && e.silent) {
                        console.warn(NAME, ' event '+e.emitter+':'+e.type+' cannot made silent: this customEvent is defined as unSilencable');
                        e.silent = false;
                    }
                    return e.silent || (before && e.status.halted);  // remember to check whether it was halted for any reason
                });
            }
        },

        /**
         * Removes a subscriber from the specified customEvent. The customEvent must conform the syntax:
         * `emitterName:eventName`.
         *
         * @static
         * @method _removeSubscriber
         * @param listener {Object} Object that creates the subscriber (and will be listening by `listener.after(...)`)
         * @param before {Boolean} whether the subscriber is a `before` subscriber. On falsy, an `after`-subscriber is assumed.
         * @param customEvent {String} conform the syntax: `emitterName:eventName`, wildcard `*` may be used for both
         *        `emitterName` as well as only `eventName`, in which case 'UI' will become the emmiterName.
         * @param [callback] {Function} subscriber to the event, when not set, all subscribers of the listener to this customEvent
         *                   will be removed.
         * @private
         * @since 0.0.1
        */
        _removeSubscriber: function(listener, before, customEvent, callback) {
            console.log('_removeSubscriber: '+customEvent);
            var instance = this,
                eventSubscribers = instance._subs[customEvent],
                hashtable = eventSubscribers && eventSubscribers[before ? 'b' : 'a'],
                i, subscriber, beforeUsed, afterUsed, extract, detachNotifier, customEventWildcardEventName;
            if (hashtable) {
                // unfortunatly we cannot search by reference, because the array has composed objects
                // also: can't use native Array.forEach: removing items within its callback change the array
                // during runtime, making it to skip the next item of the one that's being removed
               for (i=0; i<hashtable.length; ++i) {
                    console.log(NAME, '_removeSubscriber for single subscriber');
                    subscriber = hashtable[i];
                    if ((subscriber.o===(listener || instance)) && (!callback || (subscriber.cb===callback))) {
                        console.log('removing subscriber');
                        hashtable.splice(i--, 1);
                    }
                }
            }
            // After removal subscriber: check whether both eventSubscribers.a and eventSubscribers.b are empty
            // if so, remove the member from Event._subs to cleanup memory
            if (eventSubscribers) {
                beforeUsed = eventSubscribers.b && (eventSubscribers.b.length>0);
                afterUsed = eventSubscribers.a && (eventSubscribers.a.length>0);
                if (!beforeUsed && !afterUsed) {
                    delete instance._subs[customEvent];
                }
            }
            extract = customEvent.match(REGEXP_CUSTOMEVENT);
            // in case of a defined subscription (no wildcard),
            // we need to inform any detachNotifier of the unsubscription:
            if (extract && ((extract[1]!=='*') && (extract[2]!=='*'))) {
                detachNotifier = instance._detachNotifiers[customEvent];
                if (detachNotifier) {
                    detachNotifier.cb.call(detachNotifier.o, customEvent);
                    if (detachNotifier.r) {
                        delete instance._detachNotifiers[customEvent];
                    }
                }
                // check the same for wildcard eventName:
                customEventWildcardEventName = customEvent.replace(REGEXP_EVENTNAME_WITH_SEMICOLON, ':*');
                if ((customEventWildcardEventName !== customEvent) && (detachNotifier=instance._detachNotifiers[customEventWildcardEventName])) {
                    detachNotifier.cb.call(detachNotifier.o, customEvent);
                    if (detachNotifier.r) {
                        delete instance._detachNotifiers[customEvent];
                    }
                }
            }
        },

        /**
         * Removes subscribers from the multiple customevents. The customEvent must conform the syntax:
         * `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`
         * If `emitterName` is not defined, `UI` is assumed.
         *
         * Examples of valid customevents:
         *
         * <ul>
         *     <li>'redmodel:save'</li>
         *     <li>'UI:click'</li>
         *     <li>'click' --> alias for 'UI:click'</li>
         *     <li>'`*`:click' --> careful: will listen to both UIs and non-UI- click-events</li>
         *     <li>'redmodel:`*`'</li>
         *     <li>'`*`:`*`'</li>
         * </ul>
         *
         * @static
         * @method _removeSubscriber
         * @param listener {Object} Object that creates the subscriber (and will be listening by `listener.after(...)`)
         * @param customEvent {String} conform the syntax: `emitterName:eventName`, wildcard `*` may be used for both
         *        `emitterName` as well as only `eventName`, in which case 'UI' will become the emmiterName.
         * @private
         * @since 0.0.1
        */
        _removeSubscribers: function(listener, customEvent) {
            console.log('_removeSubscribers: '+customEvent);
            var instance = this,
                emitterName, eventName,
                extract = customEvent.match(REGEXP_WILDCARD_CUSTOMEVENT);
            if (!extract) {
                console.error(NAME, '_removeSubscribers-error: customEvent '+customEvent+' does not match pattern');
                return;
            }
            emitterName = extract[1] || 'UI';
            eventName = extract[2];
            if ((emitterName!=='*') && (eventName!=='*')) {
                instance._removeSubscriber(listener, true, customEvent);
                instance._removeSubscriber(listener, false, customEvent);
            }
            else {
                // wildcard, we need to look at all the members of Event._subs
                instance._subs.each(
                    function(value, key) {
                        var localExtract = key.match(REGEXP_WILDCARD_CUSTOMEVENT),
                            emitterMatch = (emitterName==='*') || (emitterName===localExtract[1]),
                            eventMatch = (eventName==='*') || (eventName===localExtract[2]);
                        if (emitterMatch && eventMatch) {
                            instance._removeSubscriber(listener, true, key);
                            instance._removeSubscriber(listener, false, key);
                        }
                    }
                );
            }
        },

        /**
         * Adds a property to the default eventobject's prototype which passes through all eventcycles.
         * Goes through Object.defineProperty with configurable, enumerable and writable
         * all set to false.
         *
         * @method _setEventObjProperty
         * @param property {String} event-object
         * @param value {Any}
         * @chainable
         * @private
         * @since 0.0.1
         */
        _setEventObjProperty: function (property, value) {
            console.log(NAME, '_setEventObjProperty');
            DEFINE_IMMUTAL_PROPERTY(this._defaultEventObj, property, value);
            return this;
        }

    };

    /**
     * Objecthash containing all defined custom-events
     * which has a structure like this:
     *
     * _ce = {
     *     'UI:click': {
     *         preventable: true,
     *         defaultFn: function(){...},
     *         preventedFn: function(){...},
     *         renderPreventable: true
     *     },
     *     'redmodel:save': {
     *         preventable: true,
     *         defaultFn: function(){...},
     *         preventedFn: function(){...},
     *         renderPreventable: true
     *     }
     * }
     *
     * @property _ce
     * @default {}
     * @type Object
     * @private
     * @since 0.0.1
    */
    Object.defineProperty(Event, '_ce', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {} // `writable` is false means we cannot chance the value-reference, but we can change {}'s properties itself
    });

    /**
     * Objecthash containing all defined before and after subscribers
     * which has a structure like this (`b` represents `before` and `a` represents `after`)
     * Every item that gets in the array consist by itself of 3 properties:
     *                                                          subscriberitem = {
     *                                                              o: listener,
     *                                                              cb: callbackFn(e),
     *                                                              f: filter
     *                                                          };
     *
     * _subs = {
     *     'UI:click': {
     *         b: [
     *             item,
     *             item
     *         ],
     *         a: [
     *             item,
     *             item
     *         ]
     *     },
     *     '*:click': {
     *         b: [
     *             item,
     *             item
     *         ],
     *         a: [
     *             item,
     *             item
     *         ]
     *     },
     *     'redmodel:save': {
     *         b: [
     *             item,
     *             item
     *         ],
     *         a: [
     *             item,
     *             item
     *         ]
     *     }
     * }
     *
     * @property _ce
     * @default {}
     * @type Object
     * @private
     * @since 0.0.1
    */
    DEFINE_IMMUTAL_PROPERTY(Event, '_subs', {});

    /**
     * Internal list of finalize-subscribers which are invoked at the finalization-cycle, which happens after the after-subscribers.
     * Is an array of function-references.
     *
     * @property _final
     * @default []
     * @type Array
     * @private
     * @since 0.0.1
    */
    DEFINE_IMMUTAL_PROPERTY(Event, '_final', []);

    /**
     * Object that acts as the prototype of the eventobject.
     * To add more methods, you can use `_setEventObjProperty`
     *
     * @property _defaultEventObj
     * @default {
     *    halt: function()
     *    preventDefault: function()
     *    preventRender: function()
     * }
     * @type Object
     * @private
     * @since 0.0.1
    */
    DEFINE_IMMUTAL_PROPERTY(Event, '_defaultEventObj', {});

    /**
     * Objecthash containing all detach-notifiers, keyed by customEvent name.
     * This list is maintained by `notifyDetach` and `unNotifyDetach`
     *
     * _detachNotifiers = {
     *     'UI:click': {
     *         cb:function() {}
     *         o: {} // context
     *     },
     *     'redmodel:*': {
     *         cb:function() {}
     *         o: {} // context
     *     },
     *     'bluemodel:save': {
     *         cb:function() {}
     *         o: {} // context
     *     }
     * }
     *
     * @property _detachNotifiers
     * @default {}
     * @type Object
     * @private
     * @since 0.0.1
    */
    DEFINE_IMMUTAL_PROPERTY(Event, '_detachNotifiers', {});

    /**
     * Objecthash containing all notifiers, keyed by customEvent name.
     * This list is maintained by `notify` and `unNotify`
     *
     * _notifiers = {
     *     'UI:click': {
     *         cb:function() {}
     *         o: {} // context
     *     },
     *     'redmodel:*': {
     *         cb:function() {}
     *         o: {} // context
     *     },
     *     'bluemodel:save': {
     *         cb:function() {}
     *         o: {} // context
     *     }
     * }
     *
     * @property _notifiers
     * @default {}
     * @type Object
     * @private
     * @since 0.0.1
    */
    DEFINE_IMMUTAL_PROPERTY(Event, '_notifiers', {});

    Event._setEventObjProperty('halt', function(reason) {this.status.ok || this._unHaltable || (this.status.halted = (reason || true));})
         ._setEventObjProperty('preventDefault', function(reason) {this.status.ok || this._unPreventable || (this.status.defaultPrevented = (reason || true));})
         ._setEventObjProperty('preventDefaultContinue', function(reason) {this.status.ok || this._unPreventable || (this.status.defaultPreventedContinue = (reason || true));})
         ._setEventObjProperty('preventRender', function(reason) {this.status.ok || this._unRenderPreventable || (this.status.renderPrevented = (reason || true));});

    return Event;
}));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"js-ext/lib/function.js":31,"js-ext/lib/object.js":32,"polyfill/polyfill-base.js":40}],19:[function(require,module,exports){
"use strict";

/**
 * Extends the Event-instance by adding the method `Emitter` to it.
 * The `Emitter-method` returns an object that should be merged into any Class-instance or object you
 * want to extend with the emit-methods, so the appropriate methods can be invoked on the instance.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 *
 * Should be called using  the provided `extend`-method like this:
 * @example
 *     var Event = require('event');<br>
 *
 * @module event
 * @submodule event-emitter
 * @class Event.Emitter
 * @since 0.0.1
*/

var NAME = '[event-emitter]: ',
    REGEXP_EMITTER = /^(\w|-)+$/,
    Event = require('./index.js');

Event.Emitter = function(emitterName) {
    var composeCustomevent = function(eventName) {
            return emitterName+':'+eventName;
        },
        newEmitter;
    if (!REGEXP_EMITTER.test(emitterName)) {
        console.error(NAME, 'Emitter invoked with invalid argument: you must specify a valid emitterName');
        return;
    }
    newEmitter = {
        /**
         * Defines a CustomEvent. If the eventtype already exists, it will not be overridden,
         * unless you force to assign with `.forceAssign()`
         *
         * The returned object comes with 4 methods which can be invoked chainable:
         *
         * <ul>
         *     <li>defaultFn() --> the default-function of the event</li>
         *     <li>preventedFn() --> the function that should be invoked when the event is defaultPrevented</li>
         *     <li>forceAssign() --> overrides any previous definition</li>
         *     <li>unHaltable() --> makes the customEvent cannot be halted</li>
         *     <li>unPreventable() --> makes the customEvent's defaultFn cannot be prevented</li>
         *     <li>unSilencable() --> makes that emitters cannot make this event to perform silently (using e.silent)</li>
         *     <li>unRenderPreventable() --> makes that the customEvent's render cannot be prevented</li>
         *     <li>noRender() --> prevents this customEvent from render the dom. Overrules unRenderPreventable()</li>
         * </ul>
         *
         * @method defineEvent
         * @param eventName {String} name of the customEvent, without `emitterName`.
         *        The final event that will be created has the syntax: `emitterName:eventName`,
         *        where `emitterName:` is automaticly prepended.
         * @return {Object} with extra methods that can be chained:
         * <ul>
         *      <li>unPreventable() --> makes the customEvent's defaultFn cannot be prevented</li>
         *      <li>unRenderPreventable() --> makes that the customEvent's render cannot be prevented</li>
         *      <li>forceAssign() --> overrides any previous definition</li>
         *      <li>defaultFn() --> the default-function of the event</li>
         *      <li>preventedFn() --> the function that should be invoked when the event is defaultPrevented</li>
         * </ul>
         * @since 0.0.1
         */
        defineEvent: function (eventName) {
            return Event.defineEvent(composeCustomevent(eventName));
        },

        /**
         * Emits the event `eventName` on behalf of the instance holding this method.
         *
         * @method emit
         * @param eventName {String} name of the event to be sent (available as e.type)
         *        you could pass a customEvent here 'emitterName:eventName', which would
         *        overrule the `instance-emitterName`
         * @param payload {Object} extra payload to be added to the event-object
         * @return {Promise}
         * <ul>
         *     <li>on success: returnValue {Any} of the defaultFn</li>
         *     <li>on error: reason {Any} Either: description 'event was halted', 'event was defaultPrevented' or the returnvalue of the preventedFn</li>
         * </ul>
         * @since 0.0.1
         */
        emit: function(eventName, payload) {
            return Event.emit(this, eventName, payload);
        },

        /**
         * Removes all event-definitions of the instance holding this method.
         *
         * @method undefAllEvents
         * @since 0.0.1
         */
        undefAllEvents: function () {
            Event.undefEvent(emitterName);
        },

        /**
         * Removes the event-definition of the specified customEvent.
         *
         * @method undefEvent
         * @param eventName {String} name of the customEvent, without `emitterName`.
         *        The calculated customEvent which will be undefined, will have the syntax: `emitterName:eventName`.
         *        where `emitterName:` is automaticly prepended.
         * @since 0.0.1
         */
        undefEvent: function (eventName) {
            Event.undefEvent(composeCustomevent(eventName));
        }

    };
    // register the emittername:
    Event.defineEmitter(newEmitter, emitterName);
    return newEmitter;
};
},{"./index.js":21}],20:[function(require,module,exports){
"use strict";

/**
 * Extends the Event-instance by adding the object `Listener` to it.
 * The returned object should be merged into any Class-instance or object you want to
 * extend with the listener-methods, so the appropriate methods can be invoked on the instance.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 *
 * Should be called using  the provided `extend`-method like this:
 * @example
 *     var Event = require('event');<br>
 *
 * @module event
 * @submodule event-listener
 * @class Event.Listener
 * @since 0.0.1
*/

var Event = require('./index.js');

Event.Listener = {
    /**
     * Subscribes to a customEvent on behalf of the object who calls this method.
     * The callback will be executed `after` the defaultFn.
     *
     * @method after
     * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
     *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
     *        If `emitterName` is not defined, `UI` is assumed.
     * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
     *        as its only argument.
     * @param [filter] {String|Function} to filter the event.
     *        Use a String if you want to filter DOM-events by a `selector`
     *        Use a function if you want to filter by any other means. If the function returns a trully value, the
     *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
     *        the subscriber.
     * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
     * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
     * @since 0.0.1
    */
    after: function (customEvent, callback, filter, prepend) {
        return Event.after(customEvent, callback, this, filter, prepend);
    },

    /**
     * Subscribes to a customEvent on behalf of the object who calls this method.
     * The callback will be executed `before` the defaultFn.
     *
     * @method before
     * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
     *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
     *        If `emitterName` is not defined, `UI` is assumed.
     * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
     *        as its only argument.
     * @param [filter] {String|Function} to filter the event.
     *        Use a String if you want to filter DOM-events by a `selector`
     *        Use a function if you want to filter by any other means. If the function returns a trully value, the
     *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
     *        the subscriber.
     * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of before-subscribers.
     * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
     * @since 0.0.1
    */
    before: function (customEvent, callback, filter, prepend) {
        return Event.before(customEvent, callback, this, filter, prepend);
    },

    /**
     * Detaches (unsubscribes) the listener from the specified customEvent,
     * on behalf of the object who calls this method.
     *
     * @method detach
     * @param customEvent {String} conform the syntax: `emitterName:eventName`, wildcard `*` may be used for both
     *        `emitterName` as well as only `eventName`, in which case 'UI' will become the emitterName.
     * @since 0.0.1
    */
    detach: function(customEvent) {
        Event.detach(this, customEvent);
    },

    /**
     * Detaches (unsubscribes) the listener from all customevents,
     * on behalf of the object who calls this method.
     *
     * @method detachAll
     * @since 0.0.1
    */
    detachAll: function() {
        Event.detachAll(this);
    },

    /**
     * Subscribes to a customEvent on behalf of the object who calls this method.
     * The callback will be executed `after` the defaultFn.
     * The subscriber will be automaticly removed once the callback executed the first time.
     * No need to `detach()` (unless you want to undescribe before the first event)
     *
     * @method onceAfter
     * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
     *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
     *        If `emitterName` is not defined, `UI` is assumed.
     * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
     *        as its only argument.
     * @param [filter] {String|Function} to filter the event.
     *        Use a String if you want to filter DOM-events by a `selector`
     *        Use a function if you want to filter by any other means. If the function returns a trully value, the
     *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
     *        the subscriber.
     * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
     * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
     * @since 0.0.1
    */
    onceAfter: function (customEvent, callback, filter, prepend) {
        return Event.onceAfter(customEvent, callback, this, filter, prepend);
    },

    /**
     * Subscribes to a customEvent on behalf of the object who calls this method.
     * The callback will be executed `before` the defaultFn.
     * The subscriber will be automaticly removed once the callback executed the first time.
     * No need to `detach()` (unless you want to undescribe before the first event)
     *
     * @method onceBefore
     * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
     *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
     *        If `emitterName` is not defined, `UI` is assumed.
     * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
     *        as its only argument.
     * @param [filter] {String|Function} to filter the event.
     *        Use a String if you want to filter DOM-events by a `selector`
     *        Use a function if you want to filter by any other means. If the function returns a trully value, the
     *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
     *        the subscriber.
     * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of before-subscribers.
     * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
     * @since 0.0.1
    */
    onceBefore: function (customEvent, callback, filter, prepend) {
        return Event.onceBefore(customEvent, callback, this, filter, prepend);
    }
};
},{"./index.js":21}],21:[function(require,module,exports){
module.exports = require('./event-base.js');
require('./event-emitter.js');
require('./event-listener.js');
},{"./event-base.js":18,"./event-emitter.js":19,"./event-listener.js":20}],22:[function(require,module,exports){
"use strict";

require('js-ext/lib/object.js');
require('polyfill');

/**
 *
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module focusmanager
 * @class FocusManager
 * @since 0.0.1
*/

var NAME = '[focusmanager]: ',
    async = require('utils').async,
    DEFAULT_SELECTOR = 'input, button, select, textarea, .focusable',
    SPECIAL_KEYS = {
        shift: 'shiftKey',
        ctrl: 'ctrlKey',
        cmd: 'metaKey',
        alt: 'altKey'
    },
    DEFAULT_KEYUP = 'shift+9',
    DEFAULT_KEYDOWN = '9',
    FM_SELECTION = 'fm-selection',
    FM_SELECTION_START = FM_SELECTION+'start',
    FM_SELECTION_END = FM_SELECTION+'end';

module.exports = function (window) {

    var DOCUMENT = window.document,
        nodePlugin, FocusManager, Event, nextFocusNode, searchFocusNode, markAsFocussed, getFocusManagerSelector, setupEvents;

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

/*jshint boss:true */
    if (FocusManager=window._ITSAmodules.FocusManager) {
/*jshint boss:false */
        return FocusManager; // FocusManager was already created
    }

    nodePlugin = require('vdom')(window).Plugins.nodePlugin;
    Event = require('event-dom')(window);

    getFocusManagerSelector = function(focusContainerNode) {
        var selector = focusContainerNode.getAttr('fm-manage');
        (selector.toLowerCase()==='true') && (selector=DEFAULT_SELECTOR);
        return selector;
    };

    nextFocusNode = function(e, keyCode, actionkey, focusContainerNode, sourceNode, selector, downwards) {
        console.log(NAME+'nextFocusNode');
        var keys, lastIndex, i, specialKeysMatch, specialKey, len, enterPressedOnInput, primaryButtons,
            inputType, foundNode, formNode, primaryonenter;
        keys = actionkey.split('+');
        len = keys.length;
        lastIndex = len - 1;

        if ((keyCode===13) && (sourceNode.getTagName()==='INPUT')) {
            inputType = sourceNode.getAttr('type').toLowerCase();
            enterPressedOnInput = (inputType==='text') || (inputType==='password');
        }

        if (enterPressedOnInput) {
            // check if we need to press the primary button - if available
/*jshint boss:true */
            if ((primaryonenter=sourceNode.getAttr('fm-primaryonenter')) && (primaryonenter.toLowerCase()==='true')) {
/*jshint boss:false */
                primaryButtons = focusContainerNode.getAll('button.pure-button-primary');
                primaryButtons.some(function(buttonNode) {
                    buttonNode.matches(selector) && (foundNode=buttonNode);
                    return foundNode;
                });
                if (foundNode) {
                    async(function() {
                        Event.emit(foundNode, 'UI:click');
                        // _buttonPressed make event-dom to simulate a pressed button for 200ms
                        Event.emit(foundNode, 'UI:tap', {_buttonPressed: true});
                        // if the button is of type `submit`, then try to submit the form
                        formNode = foundNode.inside('form');
                        formNode && formNode.submit();
                    });
                    return foundNode;
                }
            }
        }
        // double == --> keyCode is number, keys is a string
        if (enterPressedOnInput || (keyCode==keys[lastIndex])) {
            // posible keyup --> check if special characters match:
            specialKeysMatch = true;
            SPECIAL_KEYS.some(function(value) {
                specialKeysMatch = !e[value];
                return !specialKeysMatch;
            });
            for (i=lastIndex-1; (i>=0) && !specialKeysMatch; i--) {
                specialKey = keys[i].toLowerCase();
                specialKeysMatch = e[SPECIAL_KEYS[specialKey]];
            }
        }
        if (specialKeysMatch) {
            if (downwards) {
                return sourceNode.next(selector) || sourceNode.first(selector);
            }
            else {
                return sourceNode.previous(selector) || sourceNode.last(selector);
            }
        }
        return false;
    };

    markAsFocussed = function(focusContainerNode, node) {
        console.log(NAME+'markAsFocussed');
        var selector = getFocusManagerSelector(focusContainerNode),
            index;

        focusContainerNode.getAll('[fm-lastitem]').removeAttr('fm-lastitem');
        node.setAttrs([
            {name: 'tabIndex', value: '0'},
            {name: 'fm-lastitem', value: true}
        ]);
        // also store the lastitem's index --> in case the node gets removed,
        // a refocus on the container will set the focus to the nearest item
        index = focusContainerNode.getAll(selector).indexOf(node) || 0;
        focusContainerNode.setAttr('fm-lastitem-bpk', index);
    };

    searchFocusNode = function(initialNode) {
        console.log(NAME+'searchFocusNode');
        var focusContainerNode = initialNode.hasAttr('fm-manage') ? initialNode : initialNode.inside('[fm-manage]'),
            focusNode, alwaysDefault, fmAlwaysDefault, selector, allFocusableNodes, index;

        if (focusContainerNode) {
            if (initialNode.matches(getFocusManagerSelector(focusContainerNode))) {
                markAsFocussed(focusContainerNode, initialNode);
                focusNode = initialNode;
            }
            else {
                // find the right node that should get focus
/*jshint boss:true */
                alwaysDefault = ((fmAlwaysDefault=focusContainerNode.getAttr('fm-alwaysdefault')) && (fmAlwaysDefault.toLowerCase()==='true'));
/*jshint boss:false */
                alwaysDefault && (focusNode=focusContainerNode.getElement('[fm-defaultitem="true"]'));
                if (!focusNode) {
                    // search for last item
                    focusNode = focusContainerNode.getElement('[fm-lastitem="true"]');
                    if (!focusNode) {
                        // set `selector` right now: we might use it later on even when index is undefined
                        selector = getFocusManagerSelector(focusContainerNode);
                        // look at the lastitemindex of the focuscontainer
                        index = focusContainerNode.getAttr('fm-lastitem-bpk');
                        if (index!==undefined) {
                            allFocusableNodes = focusContainerNode.getAll(selector);
                            focusNode = allFocusableNodes[index];
                        }
                    }
                }
                // still not found and alwaysDefault was falsy: try the defualt node:
                !focusNode && !alwaysDefault && (focusNode=focusContainerNode.getElement('[fm-defaultitem="true"]'));
                // still not found: try the first focussable node (which we might find inside `allFocusableNodes`:
                !focusNode && (focusNode = allFocusableNodes ? allFocusableNodes[0] : focusContainerNode.getElement(selector));
                if (focusNode) {
                    markAsFocussed(focusContainerNode, focusNode);
                }
                else {
                    focusNode = initialNode;
                }
            }
        }
        else {
            focusNode = initialNode;
        }
        return focusNode;
    };

    setupEvents = function() {

        Event.before('keydown', function(e) {
            console.log(NAME+'before keydown-event');
            var focusContainerNode,
                sourceNode = e.target,
                node = sourceNode.getParent(),
                selector, keyCode, actionkey, focusNode;

            focusContainerNode = sourceNode.inside('[fm-manage]');
            if (focusContainerNode) {
                // key was pressed inside a focusmanagable container
                selector = getFocusManagerSelector(focusContainerNode);
                keyCode = e.keyCode;

                // first check for keydown:
                actionkey = node.getAttr('fm-keydown') || DEFAULT_KEYDOWN;
                focusNode = nextFocusNode(e, keyCode, actionkey, focusContainerNode, sourceNode, selector, true);
                if (!focusNode) {
                    // check for keyup:
                    actionkey = node.getAttr('fm-keyup') || DEFAULT_KEYUP;
                    focusNode = nextFocusNode(e, keyCode, actionkey, focusContainerNode, sourceNode, selector);
                }
                if (focusNode) {
                    e.preventDefaultContinue();
                    // prevent default action --> we just want to re-focus, but we DO want afterlisteners
                    // to be handled in the after-listener: someone else might want to halt the keydown event.
                    sourceNode.matches(selector) && (e._focusNode=focusNode);
                }
            }
        });

        Event.after('keydown', function(e) {
            console.log(NAME+'after keydown-event');
            var focusNode = e._focusNode;
            focusNode && focusNode.focus && focusNode.focus();
        });

        Event.after('blur', function(e) {
            console.log(NAME+'after blur-event');
            var node = e.target,
                body = DOCUMENT.body;
            if (node && node.removeAttr) {
                node.removeAttr('tabIndex');
                do {
                    node.removeClass('focussed');
                    node = (node===body) ? null : node.getParent();
                } while (node);
            }
        });

        Event.after('focus', function(e) {
            console.log(NAME+'after focus-event');
            var node = e.target,
                body = DOCUMENT.body;
            if (node && node.setClass) {
                do {
                    node.setClass('focussed');
                    node = (node===body) ? null : node.getParent();
                } while (node);
            }
        });

        // focus-fix for keeping focus when a mouse gets down for a longer time
        Event.after(['mousedown', 'press'], function(e) {
            console.log(NAME+'after focus-event');
            var node = e.target;
            node.hasFocus() || node.focus();
        }, 'button');

        Event.after('tap', function(e) {
            console.log(NAME+'after tap-event');
            var focusNode = e.target,
                focusContainerNode;

            if (focusNode && focusNode.inside) {
                focusContainerNode = focusNode.hasAttr('fm-manage') ? focusNode : focusNode.inside('[fm-manage]');
            }
            if (focusContainerNode) {
                if ((focusNode===focusContainerNode) || !focusNode.matches(getFocusManagerSelector(focusContainerNode))) {
                    focusNode = searchFocusNode(focusNode);
                }
                if (focusNode.hasFocus()) {
                    markAsFocussed(focusContainerNode, focusNode);
                }
                else {
                    focusNode.focus();
                }
            }
        });

        Event.after(['keypress', 'mouseup', 'panup', 'mousedown', 'pandown'], function(e) {
            console.log(NAME+'after '+e.type+'-event');
            var focusContainerNode,
                sourceNode = e.target,
                selector;

            focusContainerNode = sourceNode.inside('[fm-manage]');
            if (focusContainerNode) {
                // key was pressed inside a focusmanagable container
                selector = getFocusManagerSelector(focusContainerNode);
                if (sourceNode.matches(selector)) {
                    sourceNode.setAttr(FM_SELECTION_START, sourceNode.selectionStart || '0')
                              .setAttr(FM_SELECTION_END, sourceNode.selectionEnd || '0');
                }
            }
        }, 'input[type="text"], textarea');

        Event.after('focus', function(e) {
            console.log(NAME+'after focus-event');
            var focusContainerNode,
                sourceNode = e.target,
                selector, selectionStart, selectionEnd;

            focusContainerNode = sourceNode.inside('[fm-manage]');
            if (focusContainerNode) {
                // key was pressed inside a focusmanagable container
                selector = getFocusManagerSelector(focusContainerNode);
                if (sourceNode.matches(selector)) {
                    // cautious: fm-selectionstart can be 0 --> which would lead into a falsy value
                    selectionStart = sourceNode.getAttr(FM_SELECTION_START);
                    (selectionStart===undefined) && (selectionStart=sourceNode.getValue().length);
                    selectionEnd = Math.max(sourceNode.getAttr(FM_SELECTION_END) || selectionStart, selectionStart);
                    sourceNode.selectionEnd = selectionEnd;
                    sourceNode.selectionStart = selectionStart;
                    markAsFocussed(focusContainerNode, sourceNode);
                }
            }
        }, 'input[type="text"], textarea');

    };

    setupEvents();

    window._ITSAmodules.FocusManager = FocusManager = nodePlugin.definePlugin('fm', {manage: 'true'});

    (function(HTMLElementPrototype) {

        HTMLElementPrototype._focus = HTMLElementPrototype.focus;
        HTMLElementPrototype.focus = function() {
            console.log(NAME+'focus');
            searchFocusNode(this)._focus();
        };

    }(window.HTMLElement.prototype));


    return FocusManager;
};
},{"event-dom":14,"js-ext/lib/object.js":32,"polyfill":40,"utils":42,"vdom":55}],23:[function(require,module,exports){

"use strict";

/**
 * Extends io by adding the method `readXML` to it.
 * Should be called using  the provided `mergeInto`-method like this:
 *
 * @example
 * var IO = require("io");
 * var IOcors = require("io-cors");
 * IOcors.mergeInto(IO);
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module io
 * @submodule io-cors
 * @class IO
 * @since 0.0.1
*/

var NAME = '[io-cors-ie9]: ',
    XmlDOMParser = require('xmldom').DOMParser,
    UNKNOW_ERROR = 'Unknown XDR-error', // XDR doesn't specify the error
    REGEXP_EXTRACT_URL = new RegExp("^((([a-z][a-z0-9-.]*):\/\/)?(([^\/?#:]+)(:(\\d+))?)?)?(\/?[a-z0-9-._~%!$&'()*+,;=@]+(\/[a-z0-9-._~%!$&'()*+,;=:@]+)*\/?|\/)?([#?](.*)|$)", "i"),
    currentDomain,
    BODY_METHODS = {
        POST: 1,
        PUT: 1
    },
    VALID_XDR_METHODS = {
        GET: 1,
        POST: 1
    };


module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.IO_Cors) {
        return window._ITSAmodules.IO_Cors; // IO_Cors was already created
    }

    var IO = require('../io.js')(window),

    isCrossDomain = function (url) {
        var domain;
        if (window.navigator.userAgent==='fake') {
            return false;
        }
        domain = url.match(REGEXP_EXTRACT_URL)[1]; // will be undefined for relative url's
        // in case of absoulte url: make it lowercase:
        domain && (domain.toLowerCase());
        // get the browserdomain:
        currentDomain || (currentDomain=window.location.href.match(REGEXP_EXTRACT_URL)[1].toLowerCase());
        // crossdomain will only be true with absolute url's which differ from browser domain:
        return domain && (currentDomain !== domain);
    },

    entendXHR = function(xhr, props, options /*, promise */) {
        var crossDomain;
        if (!props._isXHR2) {
            crossDomain = isCrossDomain(options.url);
            if (crossDomain && !props._isXDR) {
                if (typeof window.XDomainRequest !== 'undefined') {
                    xhr = new window.XDomainRequest();
                    props._isXDR = true;
                }
            }
            props._CORS_IE = crossDomain && props._isXDR;
        }
        props._CORS_IE && !VALID_XDR_METHODS[options.method] && (options.method=(BODY_METHODS[options.method] ? 'POST' : 'GET'));

    // TODO: check how to deal with opera-mini

        return xhr;
    },

    readyHandleXDR = function(xhr, promise, headers /*, method */) {
        if (xhr._isXDR) {
            console.log(NAME, 'readyHandleXDR');
            // for XDomainRequest, we need 'onload' instead of 'onreadystatechange'
            xhr.onload || (xhr.onload=function() {
                var responseText = xhr.responseText,
                    xmlRequest = headers && (headers.Accept==='text/xml'),
                    responseobject;
                clearTimeout(xhr._timer);
                console.log(NAME, 'xhr.onload invokes with responseText='+responseText);
                // to remain consisten with XHR, we define an object with the same structure
                responseobject = {
                    _contenttype: xhr.contentType,
                    responseText: responseText,
                    responseXML: xmlRequest ? new XmlDOMParser().parseFromString(responseText) : null,
                    readyState: 4,
                    status: 200, // XDomainRequest returns only OK or Error
                    // XDomainRequest only returns the header Content-Type:
                    getAllResponseHeaders: function () {
                        return 'Content-Type: '+this._contenttype;
                    },
                    getResponseHeader: function (name) {
                        if (name==='Content-Type') {
                            return this._contenttype;
                        }
                    }
                };
                promise.fulfill(responseobject);
            });
            xhr.onerror || (xhr.onerror=function() {
                clearTimeout(xhr._timer);
                promise.reject(UNKNOW_ERROR);
            });
        }
    };

    IO._xhrList.push(entendXHR);
    IO._xhrInitList.push(readyHandleXDR);

    window._ITSAmodules.IO_Cors = IO;

    return IO;
};

},{"../io.js":27,"xmldom":3}],24:[function(require,module,exports){
"use strict";

var NAME = '[io-stream]: ',
    UNKNOW_ERROR = 'Unknown XDR-error'; // XDR doesn't specify the error

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.IO_Stream) {
        return window._ITSAmodules.IO_Stream; // IO_Stream was already created
    }

    var IO = require('../io.js')(window),

    /*
     * Adds properties to the xhr-object: in case of streaming,
     * xhr._isStream is set and xhr._isXDR might be set in case of IE<10
     *
     * @method _progressHandle
     * @param xhr {Object} containing the xhr-instance
     * @param props {Object} the propertie-object that is added too xhr and can be expanded
     * @param options {Object} options of the request
     * @private
    */
    _entendXHR = function(xhr, props, options /*, promise */) {
        if (typeof options.streamback === 'function') {
            if (!props._isXHR2 && !props._isXDR) {
                if (typeof window.XDomainRequest !== 'undefined') {
                    xhr = new window.XDomainRequest();
                    props._isXDR = true;
                }
            }
            props._isStream = props._isXHR2 || props._isXDR;
        }
        return xhr;
    },

    /*
     * Adds extra initialisation of the xhr-object: in case of streaming,
     * an `onprogress`-handler is set up
     *
     * @method _progressHandle
     * @param xhr {Object} containing the xhr-instance
     * @param promise {Promise} reference to the Promise created by xhr
     * @private
    */
    _progressHandle = function(xhr, promise /*, headers, method */) {
        if (xhr._isStream) {
            console.log(NAME, 'progressHandle');
            xhr._progressPos = 0;
            xhr.onprogress = function() {
                console.log(NAME, 'xhr.onprogress received data #'+xhr.responseText+'#');
                var data = xhr.responseText.substr(xhr._progressPos);

                // backup the fact that streaming occured
                xhr._gotstreamed = true;

                xhr._parseStream && (data=xhr._parseStream(data));

                promise.callback(data);
                xhr._progressPos = xhr.responseText.length;
            };
        }
    },

    /**
     * Adds 2 methods on the xhr-instance which are used by xhr when events occur:
     *
     * xhr.onload()
     * xhr.onerror()  // only XMLHttpRequest2
     *
     * These events are only added in case of XDR
     *
     * @method _readyHandleXDR
     * @param xhr {Object} containing the xhr-instance
     * @param promise {Promise} reference to the Promise created by xhr
     * @private
    */
    _readyHandleXDR = function(xhr, promise /*, headers, method */) {
        if (xhr._isXDR) {
            console.log(NAME, 'readyHandleXDR');
            // for XDomainRequest, we need 'onload' instead of 'onreadystatechange'
            xhr.onload = function() {
                clearTimeout(xhr._timer);
                console.log(NAME, 'xhr.onload invokes with responseText='+xhr.responseText);
                if (xhr._isStream && !xhr._gotstreamed) {
                    xhr.onprogress(xhr.responseText);
                }
                promise.fulfill(xhr);
            };
            xhr.onerror = function() {
                clearTimeout(xhr._timer);
                promise.reject(UNKNOW_ERROR);
            };
        }
    },

    /**
     * Adds a `headers` X-Stream=true in case of a streaming request.
     *
     * @method _setHeaders
     * @param xhr {Object} containing the xhr-instance
     * @param headers {Object} containing all headers
     * @param method {String} the request-method used
     * @private
    */
    _setStreamHeader = function(xhr /*, promise, headers, method */) {
        if (xhr._isStream && !xhr._isXDR) {
            console.log(NAME, '_setStreamHeader');
            xhr.setRequestHeader('X-Stream', 'true');
        }
    };

    IO._xhrList.push(_entendXHR);
    IO._xhrInitList.push(_readyHandleXDR);
    IO._xhrInitList.push(_progressHandle);
    IO._xhrInitList.push(_setStreamHeader);

    window._ITSAmodules.IO_Stream = IO;

    return IO;
};
},{"../io.js":27}],25:[function(require,module,exports){
"use strict";

/**
 * Extends io by adding the method `readXML` to it.
 * Should be called using  the provided `mergeInto`-method like this:
 *
 * @example
 * var IO = require("io");
 * var IOtransfer = require("io-transfer");
 * IOtransfer.mergeInto(IO);
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module io
 * @submodule io-transfer
 * @class IO
 * @since 0.0.1
*/

require('js-ext/lib/string.js');
require('polyfill/polyfill-base.js');

var NAME = '[io-transfer]: ',
    REVIVER = function(key, value) {
        return ((typeof value==='string') && value.toDate()) || value;
    },
    MIME_JSON = 'application/json',
    CONTENT_TYPE = 'Content-Type',
    DELETE = 'delete',
    REGEXP_ARRAY = /^( )*\[/,
    REGEXP_OBJECT = /^( )*{/,
    REGEXP_REMOVE_LAST_COMMA = /^(.*),( )*$/;

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.IO_Transfer) {
        return window._ITSAmodules.IO_Transfer; // IO_Transfer was already created
    }

    var IO = require('../io.js')(window),

    /*
     * Adds properties to the xhr-object: in case of streaming,
     * xhr._parseStream=function is created to parse streamed data.
     *
     * @method _progressHandle
     * @param xhr {Object} containing the xhr-instance
     * @param props {Object} the propertie-object that is added too xhr and can be expanded
     * @param options {Object} options of the request
     * @private
    */
    _entendXHR = function(xhr, props, options /*, promise */) {
        var isarray, isobject, parialdata, regexpcomma, followingstream;
        if ((typeof options.streamback === 'function') && options.headers && (options.headers.Accept==='application/json')) {
            console.log(NAME, 'entendXHR');
            xhr._parseStream = function(streamData) {
                console.log(NAME, 'entendXHR --> _parseStream');
                // first step is to determine if the final response would be an array or an object
                // partial responses should be expanded to the same type
                if (!followingstream) {
                    isarray = REGEXP_ARRAY.test(streamData);
                    isarray || (isobject = REGEXP_OBJECT.test(streamData));
                }
                try {
                    if (isarray || isobject) {
                        regexpcomma = streamData.match(REGEXP_REMOVE_LAST_COMMA);
                        parialdata = regexpcomma ? streamData.match(REGEXP_REMOVE_LAST_COMMA)[1] : streamData;
                    }
                    else {
                        parialdata = streamData;
                    }
                    parialdata = (followingstream && isarray ? '[' : '') + (followingstream && isobject ? '{' : '') + parialdata + (regexpcomma && isarray ? ']' : '') + (regexpcomma && isobject ? '}' : '');
                    // note: parsing will fail for the last streamed part, because there will be a double ] or }
                    streamData = JSON.parse(parialdata, (options.parseJSONDate) ? REVIVER : null);
                }
                catch(err) {
                    console.warn(NAME, err);
                }
                followingstream = true;
                return streamData;
            };
        }
        return xhr;
    };

    IO._xhrList.push(_entendXHR);

    /**
     * Performs an AJAX GET request.  Shortcut for a call to [`xhr`](#method_xhr) with `method` set to  `'GET'`.
     * Additional parameters can be on the url (with questionmark), through `params`, or both.
     *
     * The Promise gets fulfilled if the server responses with `STATUS-CODE` in the 200-range (excluded 204).
     * It will be rejected if a timeout occurs (see `options.timeout`), or if `xhr.abort()` gets invoked.
     *
     * Note: `params` should be a plain object with only primitive types which are transformed into key/value pairs.
     *
     * @method get
     * @param url {String} URL of the resource server
     * @param [params] {Object} additional parameters.
     *        should be a plain object with only primitive types which are transformed into key/value pairs.
     * @param [options] {Object}
     *    @param [options.sync=false] {boolean} By default, all requests are sent asynchronously. To send synchronous requests, set to true.
     *    @param [options.headers] {Object} HTTP request headers.
     *    @param [options.responseType] {String} Force the response type.
     *    @param [options.timeout=3000] {Number} to timeout the request, leading into a rejected Promise.
     *    @param [options.withCredentials=false] {boolean} Whether or not to send credentials on the request.
     * @return {Promise}
     * on success:
        * xhr {XMLHttpRequest|XDomainRequest} xhr-response
     * on failure an Error object
        * reason {Error}
    */
    IO.get = function (url, options) {
        console.log(NAME, 'get --> '+url);
        var ioPromise, returnPromise;
        options || (options={});
        options.url = url;
        options.method = 'GET';
        // delete hidden property `data`: don't want accedentially to be used
        delete options.data;
        ioPromise = this.request(options);
        returnPromise = ioPromise.then(
            function(xhrResponse) {
                return xhrResponse.responseText;
            }
        );
        // set `abort` to the thennable-promise:
        returnPromise.abort = ioPromise.abort;
        return returnPromise;
    };

    /**
     * Performs an AJAX request with the GET HTTP method and expects a JSON-object.
     * The resolved Promise-callback returns an object (JSON-parsed serverresponse).
     *
     * Additional request-parameters can be on the url (with questionmark), through `params`, or both.
     *
     * The Promise gets fulfilled if the server responses with `STATUS-CODE` in the 200-range (excluded 204).
     * It will be rejected if a timeout occurs (see `options.timeout`), or if `xhr.abort()` gets invoked.
     *
     * Note1: If you expect the server to response with data that consist of Date-properties, you should set `options.parseJSONDate` true.
     *        Parsing takes a bit longer, but it will generate trully Date-objects.
     * Note2: CORS is supported, as long as the responseserver is set up to:
     *       a) has a response header which allows the clientdomain:
     *          header('Access-Control-Allow-Origin: http://www.some-site.com'); or header('Access-Control-Allow-Origin: *');
     *       b) in cae you have set a custom HEADER (through 'options'), the responseserver MUST listen and respond
     *          to requests with the OPTION-method
     *       More info:  allows to send to your domain: see http://remysharp.com/2011/04/21/getting-cors-working/
     *
     * @method read
     * @param url {String} URL of the resource server
     * @param [params] {Object} additional parameters.
     * @param [options] {Object} See also: [`I.io`](#method_xhr)
     *    can be ignored, even if streams are used --> the returned Promise will always hold all data
     *    @param [options.sync=false] {boolean} By default, all requests are sent asynchronously. To send synchronous requests, set to true.
     *    @param [options.headers] {Object} HTTP request headers.
     *    @param [options.timeout=3000] {Number} to timeout the request, leading into a rejected Promise.
     *    @param [options.withCredentials=false] {boolean} Whether or not to send credentials on the request.
     *    @param [options.parseJSONDate=false] {boolean} Whether the server returns JSON-stringified data which has Date-objects.
     * @return {Promise}
     * on success:
        * Object received data
     * on failure an Error object
        * reason {Error}
    */
    IO.read = function(url, params, options) {
        console.log(NAME, 'read  --> '+url+' params: '+JSON.stringify(params));
        var ioPromise, returnPromise;
        options || (options={});
        options.headers || (options.headers={});
        options.url = url;
        options.method = 'GET';
        options.data = params;
        options.headers.Accept = 'application/json';
        // we don't want the user to re-specify the server's responsetype:
        delete options.responseType;
        ioPromise = this.request(options);
        returnPromise = ioPromise.then(
            function(xhrResponse) {
                // not 'try' 'catch', because, if parsing fails, we actually WANT the promise to be rejected
                // we also need to re-attach the 'abort-handle'
                console.log(NAME, 'read returns with: '+JSON.stringify(xhrResponse.responseText));
                // xhrResponse.responseText should be 'application/json' --> if it is not,
                // JSON.parse throws an error, but that's what we want: the Promise would reject
                return JSON.parse(xhrResponse.responseText, (options.parseJSONDate) ? REVIVER : null);
            }
        );
        // set `abort` to the thennable-promise:
        returnPromise.abort = ioPromise.abort;
        return returnPromise;
    };


    /**
     * Sends data (object) which will be JSON-stringified before sending.
     * Performs an AJAX request with the PUT HTTP method by default.
     * When options.allfields is `false`, it will use the POST-method: see Note2.
     *
     * The 'content-type' of the header is set to 'application/json', overruling manually options.
     *
     * 'data' is send as 'body.data' and should be JSON-parsed at the server.
     *
     * The Promise gets fulfilled if the server responses with `STATUS-CODE` in the 200-range (excluded 204).
     * It will be rejected if a timeout occurs (see `options.timeout`), or if `xhr.abort()` gets invoked.
     *
     * Note1: The server needs to inspect the bodyparam: 'action', which always equals 'update'.
     *        'body.action' is the way to distinquish 'I.IO.updateObject' from 'I.IO.insertObject'.
     *        On purpose, we didn't make this distinction through a custom CONTENT-HEADER, because
     *        that would lead into a more complicated CORS-setup (see Note3)
     * Note2: By default this method uses the PUT-request: which is preferable is you send the WHOLE object.
     *        if you send part of the fields, set `options.allfields`=false.
     *        This will lead into using the POST-method.
     *        More about HTTP-methods: https://stormpath.com/blog/put-or-post/
     * Note3: CORS is supported, as long as the responseserver is set up to:
     *        a) has a response header which allows the clientdomain:
     *           header('Access-Control-Allow-Origin: http://www.some-site.com'); or header('Access-Control-Allow-Origin: *');
     *        b) in cae you have set a custom HEADER (through 'options'), the responseserver MUST listen and respond
     *           to requests with the OPTION-method
     *        More info:  allows to send to your domain: see http://remysharp.com/2011/04/21/getting-cors-working/
     * Note4: If the server response JSON-stringified data, the Promise resolves with a JS-Object. If you expect this object
     *        to consist of Date-properties, you should set `options.parseJSONDate` true. Parsing takes a bit longer, but it will
     *        generate trully Date-objects.
     *
     *
     * @method update
     * @param url {String} URL of the resource server
     * @param data {Object|Promise} Data to be sent, might be a Promise which resolves with the data-object.
     * @param [options] {Object} See also: [`I.io`](#method_xhr)
     *    @param [options.allfields=true] {boolean} to specify that all the object-fields are sent.
     *    @param [options.sync=false] {boolean} By default, all requests are sent asynchronously. To send synchronous requests, set to true.
     *    @param [options.headers] {Object} HTTP request headers.
     *    @param [options.timeout=3000] {Number} to timeout the request, leading into a rejected Promise.
     *    @param [options.withCredentials=false] {boolean} Whether or not to send credentials on the request.
     *    @param [options.parseJSONDate=false] {boolean} Whether the server returns JSON-stringified data which has Date-objects.
     * @return {Promise}
     * on success:
        * response {Object} usually, the final object-data, possibly modified
     * on failure an Error object
        * reason {Error}
    */

    /**
     * Performs an AJAX request with the POST HTTP method by default.
     * When options.allfields is `true`, it will use the PUT-method: see Note2.
     * The send data is an object which will be JSON-stringified before sending.
     *
     * The 'content-type' of the header is set to 'application/json', overruling manually options.
     *
     * 'data' is send as 'body.data' and should be JSON-parsed at the server.
     * 'body.action' has the value 'insert'
     *
     * The Promise gets fulfilled if the server responses with `STATUS-CODE` in the 200-range (excluded 204).
     * It will be rejected if a timeout occurs (see `options.timeout`), or if `xhr.abort()` gets invoked.
     *
     * Note1: The server needs to inspect the bodyparam: 'action', which always equals 'insert'.
     *        'body.action' is the way to distinquish 'I.IO.insertObject' from 'I.IO.updateObject'.
     *        On purpose, we didn't make this distinction through a custom CONTENT-HEADER, because
     *        that would lead into a more complicated CORS-setup (see Note3)
     * Note2: By default this method uses the POST-request: which is preferable if you don't know all the fields (like its unique id).
     *        if you send ALL the fields, set `options.allfields`=true.
     *        This will lead into using the PUT-method.
     *        More about HTTP-methods: https://stormpath.com/blog/put-or-post/
     * Note3: CORS is supported, as long as the responseserver is set up to:
     *        a) has a response header which allows the clientdomain:
     *           header('Access-Control-Allow-Origin: http://www.some-site.com'); or header('Access-Control-Allow-Origin: *');
     *        b) in cae you have set a custom HEADER (through 'options'), the responseserver MUST listen and respond
     *           to requests with the OPTION-method
     *        More info:  allows to send to your domain: see http://remysharp.com/2011/04/21/getting-cors-working/
     * Note4: If the server response JSON-stringified data, the Promise resolves with a JS-Object. If you expect this object
     *        to consist of Date-properties, you should set `options.parseJSONDate` true. Parsing takes a bit longer, but it will
     *        generate trully Date-objects.
     *
     * @method insert
     * @param url {String} URL of the resource server
     * @param data {Object|Promise} Data to be sent, might be a Promise which resolves with the data-object.
     * @param [options] {Object} See also: [`I.io`](#method_xhr)
     *    @param [options.allfields=false] {boolean} to specify that all the object-fields are sent.
     *    @param [options.sync=false] {boolean} By default, all requests are sent asynchronously. To send synchronous requests, set to true.
     *    @param [options.headers] {Object} HTTP request headers.
     *    @param [options.timeout=3000] {Number} to timeout the request, leading into a rejected Promise.
     *    @param [options.withCredentials=false] {boolean} Whether or not to send credentials on the request.
     *    @param [options.parseJSONDate=false] {boolean} Whether the server returns JSON-stringified data which has Date-objects.
     * @return {Promise}
     * on success:
        * response {Object} usually, the final object-data, possibly modified, holding the key
     * on failure an Error object
        * reason {Error}
    */

    /**
     * Performs an AJAX request with the PUT HTTP method by default.
     * When options.allfields is `false`, it will use the POST-method: see Note2.
     * The send data is an object which will be JSON-stringified before sending.
     *
     * The 'content-type' of the header is set to 'application/json', overruling manually options.
     *
     * 'data' is send as 'body.data' and should be JSON-parsed at the server.
     *
     * The Promise gets fulfilled if the server responses with `STATUS-CODE` in the 200-range (excluded 204).
     * It will be rejected if a timeout occurs (see `options.timeout`), or if `xhr.abort()` gets invoked.
     *
     * Note1: By default this method uses the PUT-request: which is preferable is you send the WHOLE object.
     *        if you send part of the fields, set `options.allfields`=false.
     *        This will lead into using the POST-method.
     *        More about HTTP-methods: https://stormpath.com/blog/put-or-post/
     * Note2: CORS is supported, as long as the responseserver is set up to:
     *        a) has a response header which allows the clientdomain:
     *           header('Access-Control-Allow-Origin: http://www.some-site.com'); or header('Access-Control-Allow-Origin: *');
     *        b) in cae you have set a custom HEADER (through 'options'), the responseserver MUST listen and respond
     *           to requests with the OPTION-method
     *        More info:  allows to send to your domain: see http://remysharp.com/2011/04/21/getting-cors-working/
     * Note3: If the server response JSON-stringified data, the Promise resolves with a JS-Object. If you expect this object
     *        to consist of Date-properties, you should set `options.parseJSONDate` true. Parsing takes a bit longer, but it will
     *        generate trully Date-objects.
     *
     * @method send
     * @param url {String} URL of the resource server
     * @param data {Object} Data to be sent.
     * @param [options] {Object} See also: [`I.io`](#method_xhr)
     *    @param [options.allfields=true] {boolean} to specify that all the object-fields are sent.
     *    @param [options.sync=false] {boolean} By default, all requests are sent asynchronously. To send synchronous requests, set to true.
     *    @param [options.headers] {Object} HTTP request headers.
     *    @param [options.timeout=3000] {Number} to timeout the request, leading into a rejected Promise.
     *    @param [options.withCredentials=false] {boolean} Whether or not to send credentials on the request.
     * @return {Promise}
     * on success:
        * response {Object|String} any response you want the server to return.
                   If the server send back a JSON-stringified object, it will be parsed to return as a full object
                   You could set `options.parseJSONDate` true, it you want ISO8601-dates to be parsed as trully Date-objects
     * on failure an Error object
        * reason {Error}
    */

    ['update', 'insert', 'send'].forEach(
        function (verb) {
            IO[verb] = function (url, data, options) {
                console.log(NAME, verb+' --> '+url+' data: '+JSON.stringify(data));
                var instance = this,
                    allfields, useallfields, parseJSONDate, ioPromise, returnPromise;
                options || (options={});
                allfields = options.allfields,
                useallfields = (typeof allfields==='boolean') ? allfields : (verb!=='insert');
                parseJSONDate = options.parseJSONDate;
                options.url = url;
                options.method = useallfields ? 'PUT' : 'POST';
                options.data = data;
                options.headers || (options.headers={});
                options.headers[CONTENT_TYPE] = MIME_JSON;
                parseJSONDate && (options.headers['X-JSONDate']="true");
                if (verb!=='send') {
                    options.headers.Accept = 'application/json';
                    // set options.action
                    options.headers['X-Action'] = verb;
                    // we don't want the user to re-specify the server's responsetype:
                    delete options.responseType;
                }
                ioPromise = instance.request(options);
                returnPromise = ioPromise.then(
                    function(xhrResponse) {
                        if (verb==='send') {
                            return xhrResponse.responseText;
                        }
                        // In case of `insert` or `update`
                        // xhrResponse.responseText should be 'application/json' --> if it is not,
                        // JSON.parse throws an error, but that's what we want: the Promise would reject
                        return JSON.parse(xhrResponse.responseText, parseJSONDate ? REVIVER : null);
                    }
                );
                // set `abort` to the thennable-promise:
                returnPromise.abort = ioPromise.abort;
                return returnPromise;
            };
        }
    );

    /**
     * Performs an AJAX DELETE request.  Shortcut for a call to [`xhr`](#method_xhr) with `method` set to  `'DELETE'`.
     *
     * The Promise gets fulfilled if the server responses with `STATUS-CODE` in the 200-range (excluded 204).
     * It will be rejected if a timeout occurs (see `options.timeout`), or if `xhr.abort()` gets invoked.
     *
     * Note: `data` should be a plain object with only primitive types which are transformed into key/value pairs.
     *
     * @method delete
     * @param url {String} URL of the resource server
     * @param deleteKey {Object} Indentification of the id that has to be deleted. Typically an object like: {id: 12}
     *                  This object will be passed as the request params.
     * @param [options] {Object}
     *    @param [options.url] {String} The url to which the request is sent.
     *    @param [options.sync=false] {boolean} By default, all requests are sent asynchronously. To send synchronous requests, set to true.
     *    @param [options.params] {Object} Data to be sent to the server.
     *    @param [options.body] {Object} The content for the request body for POST method.
     *    @param [options.headers] {Object} HTTP request headers.
     *    @param [options.timeout=3000] {Number} to timeout the request, leading into a rejected Promise.
     *    @param [options.withCredentials=false] {boolean} Whether or not to send credentials on the request.
     * @return {Promise}
     * on success:
        * xhr {XMLHttpRequest|XDomainRequest} xhr-response
     * on failure an Error object
        * reason {Error}
    */

    IO[DELETE] = function (url, deleteKey, options) {
        console.log(NAME, 'delete --> '+url+' deleteKey: '+JSON.stringify(deleteKey));
        var ioPromise, returnPromise;
        options || (options={});
        options.url = url;
        // method will be uppercased by IO.xhr
        options.method = DELETE;
        options.data = deleteKey;
        delete options.responseType;
        ioPromise = this.request(options);
        returnPromise = ioPromise.then(
            function(xhrResponse) {
                var response = xhrResponse.responseText;
                try {
                    response = JSON.parse(response, (options.parseJSONDate) ? REVIVER : null);
                }
                catch(err) {}
                return response;
            }
        );
        // set `abort` to the thennable-promise:
        returnPromise.abort = ioPromise.abort;
        return returnPromise;
    };

    window._ITSAmodules.IO_Transfer = IO;

    return IO;
};
},{"../io.js":27,"js-ext/lib/string.js":34,"polyfill/polyfill-base.js":40}],26:[function(require,module,exports){
"use strict";

/**
 * Extends io by adding the method `readXML` to it.
 * Should be called using  the provided `mergeInto`-method like this:
 *
 * @example
 * var IO = require("io");
 * var IOxml = require("io-xml");
 * IOxml.mergeInto(IO);
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module io
 * @submodule io-xml
 * @class IO
 * @since 0.0.1
*/

require('js-ext');

var NAME = '[io-xml]: ',
    REGEXP_XML = /(?: )*(<\?xml (?:.)*\?>)(?: )*(<(?:\w)+>)/;

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.IO_XML) {
        return window._ITSAmodules.IO_XML; // IO_XML was already created
    }

    var IO = require('../io.js')(window),

    /*
     * Adds properties to the xhr-object: in case of streaming,
     * xhr._parseStream=function is created to parse streamed data.
     *
     * @method _progressHandle
     * @param xhr {Object} containing the xhr-instance
     * @param props {Object} the propertie-object that is added too xhr and can be expanded
     * @param options {Object} options of the request
     * @private
    */
    _entendXHR = function(xhr, props, options, promise) {
        var parser, followingstream, regegexp_endcont, regexpxml, xmlstart, container, endcontainer;
        if ((typeof options.streamback === 'function') && options.headers && (options.headers.Accept==='text/xml')) {
            console.log(NAME, 'entendXHR');
            parser = new window.DOMParser();
            xhr._parseStream = function(streamData) {
                var fragment, parialdata;
                console.log(NAME, 'entendXHR --> _parseStream');
                try {
                    if (!followingstream) {
                        regexpxml = streamData.match(REGEXP_XML);
                        if (regexpxml) {
                            xmlstart = regexpxml[1];
                            container = regexpxml[2];
                            endcontainer = '</'+container.substr(1);
                            regegexp_endcont = new RegExp('(.*)'+endcontainer+'( )*$');
                        }
                    }
                    parialdata = (followingstream ? xmlstart+container : '') + streamData;
                    regegexp_endcont.test(streamData) || (parialdata+=endcontainer);
                    fragment = parser.parseFromString(parialdata, 'text/xml');
                    followingstream = true;
                    return fragment;
                }
                catch(err) {
                    promise.reject(err);
                }
            };
        }
        return xhr;
    };

    IO._xhrList.push(_entendXHR);

    /**
     * Performs an AJAX request with the GET HTTP method and expects a JSON-object.
     * The resolved Promise-callback returns an object (JSON-parsed serverresponse).
     *
     * Additional request-parameters can be on the url (with questionmark), through `params`, or both.
     *
     * The Promise gets fulfilled if the server responses with `STATUS-CODE` in the 200-range (excluded 204).
     * It will be rejected if a timeout occurs (see `options.timeout`), or if `xhr.abort()` gets invoked.
     *
     * Note1: If you expect the server to response with data that consist of Date-properties, you should set `options.parseJSONDate` true.
     *        Parsing takes a bit longer, but it will generate trully Date-objects.
     * Note2: CORS is supported, as long as the responseserver is set up to:
     *       a) has a response header which allows the clientdomain:
     *          header('Access-Control-Allow-Origin: http://www.some-site.com'); or header('Access-Control-Allow-Origin: *');
     *       b) in cae you have set a custom HEADER (through 'options'), the responseserver MUST listen and respond
     *          to requests with the OPTION-method
     *       More info:  allows to send to your domain: see http://remysharp.com/2011/04/21/getting-cors-working/
     *
     * @method readXML
     * @param url {String} URL of the resource server
     * @param [params] {Object} additional parameters.
     * @param [options] {Object} See also: [`I.io`](#method_xhr)
     *    @param [options.url] {String} The url to which the request is sent.
     *    can be ignored, even if streams are used --> the returned Promise will always hold all data
     *    @param [options.sync=false] {boolean} By default, all requests are sent asynchronously. To send synchronous requests, set to true.
     *    @param [options.params] {Object} Data to be sent to the server.
     *    @param [options.body] {Object} The content for the request body for POST method.
     *    @param [options.headers] {Object} HTTP request headers.
     *    @param [options.responseType='text'] {String} The response type.
     *    @param [options.timeout=3000] {Number} to timeout the request, leading into a rejected Promise.
     *    @param [options.withCredentials=false] {boolean} Whether or not to send credentials on the request.
     *    @param [options.parseJSONDate=false] {boolean} Whether the server returns JSON-stringified data which has Date-objects.
     * @return {Promise}
     * on success:
        * Object received data
     * on failure an Error object
        * reason {Error}
    */
    IO.readXML = function(url, params, options) {
        var XMLOptions = {
                headers: {'Accept': 'text/xml'},
                method: 'GET',
                url: url,
                data: params
            },
            ioPromise, returnPromise;
        options && XMLOptions.merge(options);
        ioPromise = this.request(XMLOptions);
        returnPromise = ioPromise.then(
            function(xhrResponse) {
                // if the responsetype is no "text/xml", then throw an error, else return xhrResponse.responseXML;
                // note that nodejs has "Content-Type" in lowercase!
                // Also: XDR DOES NOT support getResponseHeader() --> so we must just assume the data is text/xml
                var contenttype = !xhrResponse._isXDR && (xhrResponse.getResponseHeader('Content-Type') || xhrResponse.getResponseHeader('content-type'));
                if (xhrResponse._isXDR || /^text\/xml/.test(contenttype)) {
                    // cautious: when streaming, xhrResponse.responseXML will be undefined in case of using XDR
                    return xhrResponse.responseXML || (new window.DOMParser()).parseFromString(xhrResponse.responseText, 'text/xml');
                }
                // when code comes here: no valid xml response:
                throw new Error('recieved Content-Type is no XML');
            }
        );
        // set `abort` to the thennable-promise:
        returnPromise.abort = ioPromise.abort;
        return returnPromise;
    };

    window._ITSAmodules.IO_XML = IO;

    return IO;
};
},{"../io.js":27,"js-ext":29}],27:[function(require,module,exports){
(function (global){
/**
 * Provides core IO-functionality.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module io
 * @class IO
*/

"use strict";

require('polyfill/polyfill-base.js');
require('js-ext');

var NAME = '[io]: ',
    GET = 'GET',
    DEF_REQ_TIMEOUT = 300000, // don't create an ever-lasting request: always quit after 5 minutes
    BODY_METHODS = {
        POST: 1,
        PUT: 1
    },
    CONTENT_TYPE = 'Content-Type',
    MIME_JSON = 'application/json',
    DEF_CONTENT_TYPE_POST = 'application/x-www-form-urlencoded; charset=UTF-8',
    ERROR_NO_XHR = 'no valid xhr transport-mechanism available',
    REQUEST_TIMEOUT = 'Request-timeout',
    UNKNOW_ERROR = 'Unknown response-error',
    XHR_ERROR = 'XHR Error',
    ABORTED = 'Request aborted',
    NO_XHR = 'No valid xhr found on this browser';

module.exports = function (window) {

    // to prevent multiple IO instances
    // (which might happen: http://nodejs.org/docs/latest/api/modules.html#modules_module_caching_caveats)
    // we make sure IO is defined only once. Therefore we bind it to `window` and return it if created before
    // We need a singleton IO, because submodules might merge in. You can't have them merging
    // into some other IO-instance than which is used.
    var Glob = (typeof global !== 'undefined' ? global : /* istanbul ignore next */ this);
    if (!Glob._ITSAmodules) {
        Object.defineProperty(Glob, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }
    if (Glob._ITSAmodules.IO) {
        return Glob._ITSAmodules.IO;
    }

    var ENCODE_URI_COMPONENT = encodeURIComponent,
        IO;

    IO = {
        config: {},

        //===============================================================================================
        // private methods:
        //===============================================================================================

        _xhrList: [],

        /**
         * Initializes the xhr-instance, based on the config-params.
         * This method is the standard way of doing xhr-requests without processing streams.
         *
         * @method _initXHR
         * @param xhr {Object} xhr-instance
         * @param options {Object}
         *    @param [options.url] {String} The url to which the request is sent.
         *    @param [options.method='GET'] {String} The HTTP method to use.
         *    can be ignored, even if streams are used --> the returned Promise will always hold all data
         *    @param [options.sync=false] {boolean} By default, all requests are sent asynchronously. To send synchronous requests, set to true.
         *           This feature only works in the browser: nodejs will always perform asynchronous requests.
         *    @param [options.data] {Object} Data to be sent to the server, either to be used by `query-params` or `body`.
         *    @param [options.headers] {Object} HTTP request headers.
         *    @param [options.responseType] {String} Force the response type.
         *    @param [options.timeout=3000] {number} to timeout the request, leading into a rejected Promise.
         *    @param [options.withCredentials=false] {boolean} Whether or not to send credentials on the request.
         * @param fulfill {Function} reference to xhr-promise's fulfill-function
         * @param reject {Function} reference to xhr-promise's reject-function
         * @param promise {Promise} the xhr-promise which will be extended with the `abort()`-method
         * @private
        */
        _initXHR: function (xhr, options, promise) {
            console.log(NAME, '_initXHR');
            var instance = this,
                url = options.url,
                method = options.method || GET,
                headers = options.headers || {}, // all request will get some headers
                async = !options.sync,
                data = options.data,
                reject = promise.reject;
            // xhr will be null in case of a CORS-request when no CORS is possible
            if (!xhr) {
                console.error(NAME, '_initXHR fails: '+ERROR_NO_XHR);
                reject(new Error(ERROR_NO_XHR));
                return;
            }
            console.log(NAME, '_initXHR succesfully created '+(xhr._isXHR2 ? 'XMLHttpRequest2' : (xhr._isXDR ? 'XDomainRequest' : 'XMLHttpRequest1'))+'-instance');

            // method-name should be in uppercase:
            method = method.toUpperCase();

            // in case of BODY-method: eliminate any data behind querystring:
            // else: append data-object behind querystring
            if (BODY_METHODS[method]) {
                url = url.split('?'); // now url is an array
                url = url[0]; // now url is a String again
            }
            else if (data) {
                url += ((url.indexOf('?') > 0) ? '&' : '?') + instance._toQueryString(data);
            }

            xhr.open(method, url, async);
            // xhr.responseType = options.responseType || 'text';
            options.withCredentials && (xhr.withCredentials=true);


            // more initialisation might be needed by extended modules:
            instance._xhrInitList.each(
                function(fn) {
                    fn(xhr, promise, headers, method);
                }
            );

            // send the request:
            xhr.send((BODY_METHODS[method] && data) ? (((headers[CONTENT_TYPE]===MIME_JSON) || xhr._isXDR) ? JSON.stringify(data) : instance._toQueryString(data)) : null);

            console.log(NAME, 'xhr send to '+url+' with method '+method);

            // now add xhr.abort() to the promise, so we can call from within the returned promise-instance
            promise.abort = function() {
                console.log(NAME, 'xhr aborted');
                reject(new Error(ABORTED));
                xhr._aborted = true; // must be set: IE9 won't allow to read anything on xhr after being aborted
                xhr.abort();
            };

            // in case synchronous transfer: force an xhr.onreadystatechange:
            async || xhr.onreadystatechange();
        },

        /**
         * Adds the `headers`-object to `xhr`-headers.
         *
         * @method _setHeaders
         * @param xhr {Object} containing the xhr-instance
         * @param headers {Object} containing all headers
         * @param method {String} the request-method used
         * @private
        */
        _setHeaders: function(xhr, promise, headers, method) {
            // XDR cannot set requestheaders, only XHR:
            if (!xhr._isXDR) {
                console.log(NAME, '_setHeaders');
                var name;
                if ((method!=='POST') && (method!=='PUT')) {
                    // force GET-request to make a request instead of using cache (like IE does):
                    headers['If-Modified-Since'] = 'Wed, 15 Nov 1995 01:00:00 GMT';
                    // header 'Content-Type' should only be set with POST or PUT requests:
                    delete headers[CONTENT_TYPE];
                }
                // set all headers
                for (name in headers) {
                    xhr.setRequestHeader(name, headers[name]);
                }

                // in case of POST or PUT method: always make sure 'Content-Type' is specified
                ((method!=='POST') && (method!=='PUT')) || (headers && (CONTENT_TYPE in headers)) || xhr.setRequestHeader(CONTENT_TYPE, DEF_CONTENT_TYPE_POST);
            }
        },

        /**
         * Adds 2 methods on the xhr-instance which are used by xhr when events occur:
         *
         * xhr.onreadystatechange()
         * xhr.ontimeout()  // only XMLHttpRequest2
         *
         * These events are responsible for making the Promise resolve.
         * @method _setReadyHandle
         * @param xhr {Object} containing the xhr-instance
         * @param fulfill {Function} reference to the Promise fulfill-function
         * @param reject {Function} reference to the Promise reject-function
         * @private
        */
        _setReadyHandle: function(xhr, promise) {
            console.log(NAME, '_setReadyHandle');
            // for XDomainRequest, we need 'onload' instead of 'onreadystatechange'
            xhr.onreadystatechange = function() {
                // CANNOT console xhr.responseText here! IE9 will throw an error:
                // you can only acces it after (xhr.readyState===4)
                // also check xhr._aborted --> IE9 comes here after aborted and will throw an error when reading xhr's native properties
                if (!xhr._aborted && (xhr.readyState===4)) {
                    clearTimeout(xhr._timer);
                    if ((xhr.status>=200) && (xhr.status<300)) {
                        console.log(NAME, 'xhr.onreadystatechange will fulfill xhr-instance: '+xhr.responseText);
                        // In case streamback function is set, but when no intermediate stream-data was send
                        // (or in case of XDR: below 2kb it doesn't call onprogress)
                        // --> we might need to call onprogress ourselve.
                        if (xhr._isStream && !xhr._gotstreamed) {
                            xhr.onprogress(xhr.responseText);
                        }
                        promise.fulfill(xhr);
                    }
                    else {
                        console.warn(NAME, 'xhr.onreadystatechange will reject xhr-instance: '+xhr.statusText);
                        promise.reject(new Error(xhr.statusText || UNKNOW_ERROR+' '+xhr.status));
                    }
                }
            };
            xhr.onerror = function() {
                clearTimeout(xhr._timer);
                promise.reject(new Error(XHR_ERROR));
            };
        },

        /**
         * Stringifies an object into one string with every pair separated by `&`
         *
         * @method _toQueryString
         * @param data {Object} containing key-value pairs
         * @return {String} stringified presentation of the object, with every pair separated by `&`
         * @private
        */
        _toQueryString: function(data) {
            var paramArray = [],
                key, value;
        // TODO: use `object` module
            for (key in data) {
                value = data[key];
                key = ENCODE_URI_COMPONENT(key);
                paramArray.push((value === null) ? key : (key + '=' + ENCODE_URI_COMPONENT(value)));
            }
            console.log(NAME, '_toQueryString --> '+paramArray.join('&'));
            return paramArray.join('&');
        },

        /**
         * Sends a HTTP request to the server and returns a Promise with an additional .abort() method to cancel the request.
         * This method is the standard way of doing xhr-requests without processing streams.
         *
         * @method request
         * @param options {Object}
         *    @param [options.url] {String} The url to which the request is sent.
         *    @param [options.method='GET'] {String} The HTTP method to use.
         *    can be ignored, even if streams are used --> the returned Promise will always hold all data
         *    @param [options.sync=false] {boolean} By default, all requests are sent asynchronously. To send synchronous requests, set to true.
         *    @param [options.data] {Object} Data to be sent to the server, either to be used by `query-params` or `body`.
         *    @param [options.headers] {Object} HTTP request headers.
         *    @param [options.responseType] {String} Force the response type.
         *    @param [options.timeout=3000] {number} to timeout the request, leading into a rejected Promise.
         *    @param [options.withCredentials=false] {boolean} Whether or not to send credentials on the request.
         *    @param [options.streamback] {Function} callbackfunction in case you want to process streams (needs io-stream module).
         * @return {Promise} Promise holding the request. Has an additional .abort() method to cancel the request.
         * <ul>
         *     <li>on success: xhr {XMLHttpRequest1|XMLHttpRequest2} xhr-response</li>
         *     <li>on failure: reason {Error}</li>
         * </ul>
        */
        request: function(options) {
            console.log(NAME, 'request');
            var instance = this,
                props = {},
                xhr, promise;
            options || (options={});
            promise = Promise.manage(options.streamback);

            xhr = new window.XMLHttpRequest();
            props._isXHR2 = ('withCredentials' in xhr) || (window.navigator.userAgent==='fake');
            // it could be other modules like io-cors or io-stream have subscribed
            // xhr might be changed, also private properties might be extended
            instance._xhrList.each(
                function(fn) {
                    xhr = fn(xhr, props, options, promise);
                }
            );
            if (!xhr) {
                return Promise.reject(NO_XHR);
            }
            xhr.merge(props);
            console.log(NAME, 'request creating xhr of type: '+ (props._isXHR2 ? 'XMLHttpRequest2' : (props._isXDR ? 'XDomainRequest' : 'XMLHttpRequest1')));
            console.log(NAME, 'CORS-IE: '+ props._CORS_IE + ', canStream: '+props._canStream);

            // Don't use xhr.timeout --> IE<10 throws an error when set xhr.timeout
            // We use a timer that aborts the request
            Object.defineProperty(xhr, '_timer', {
                configurable: false,
                enumerable: false,
                writable: false,
                value: setTimeout(function() {
                           promise.reject(new Error(REQUEST_TIMEOUT));
                           xhr._aborted = true; // must be set: IE9 won't allow to read anything on xhr after being aborted
                           xhr.abort();
                       }, options.timeout || instance.config.timeout || DEF_REQ_TIMEOUT)
            });

            instance._initXHR(xhr, options, promise);
            return promise;
        }
    };

    IO._xhrInitList = [
        IO._setReadyHandle,
        IO._setHeaders
    ];

    Glob._ITSAmodules.IO = IO;

    return IO;
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"js-ext":29,"polyfill/polyfill-base.js":40}],28:[function(require,module,exports){
module.exports = {
    'abstract': true,
    'arguments': true,
    'assert': true,
    'await': true,
    'boolean': true,
    'break': true,
    'byte': true,
    'case': true,
    'catch': true,
    'char': true,
    'class': true,
    'const': true,
    'continue': true,
    'debugger': true,
    'default': true,
    'delete': true,
    'do': true,
    'double': true,
    'else': true,
    'enum': true,
    'eval': true,
    'export': true,
    'extends': true,
    'false': true,
    'final': true,
    'finally': true,
    'float': true,
    'for': true,
    'function': true,
    'goto': true,
    'if': true,
    'import': true,
    'implements': true,
    'in': true,
    'instanceof': true,
    'int': true,
    'interface': true,
    'let': true,
    'long': true,
    'native': true,
    'new': true,
    'null': true,
    'package': true,
    'private': true,
    'protected': true,
    'public': true,
    'return': true,
    'short': true,
    'static': true,
    'strictfp': true,
    'super': true,
    'switch': true,
    'synchronized': true,
    'this': true,
    'throw': true,
    'throws': true,
    'transient': true,
    'true': true,
    'try': true,
    'typeof': true,
    'var': true,
    'void': true,
    'volatile': true,
    'while': true,
    'with': true,
    'yield': true
};
},{}],29:[function(require,module,exports){
require('./lib/function.js');
require('./lib/object.js');
require('./lib/string.js');
require('./lib/array.js');
require('./lib/promise.js');
},{"./lib/array.js":30,"./lib/function.js":31,"./lib/object.js":32,"./lib/promise.js":33,"./lib/string.js":34}],30:[function(require,module,exports){
/**
 *
 * Pollyfils for often used functionality for Arrays
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module js-ext
 * @submodule lib/array.js
 * @class Array
 *
 */

"use strict";

require('polyfill/polyfill-base.js');

var cloneObj = function(obj) {
    var copy, i, len, value;

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        len = obj.length;
        for (i=0; i<len; i++) {
            value = obj[i];
            copy[i] = ((value===null) || (typeof value!=='object')) ? value : cloneObj(value);
        }
        return copy;
    }

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Object
    else if (obj instanceof Object) {
        copy = obj.deepClone();
    }

    return copy;
};

(function(ArrayPrototype) {

    /**
     * Checks whether an item is inside the Array.
     * Alias for (array.indexOf(item) > -1)
     *
     * @method contains
     * @param item {Any} the item to seek
     * @return {Boolean} whether the item is part of the Array
     */
    Array.contains || (ArrayPrototype.contains=function(item) {
        return (this.indexOf(item) > -1);
    });

    /**
     * Removes an item from the array
     *
     * @method remove
     * @param item {any|Array} the item (or an hash of items) to be removed
     * @param [arrayItem=false] {Boolean} whether `item` is an arrayItem that should be treated as a single item to be removed
     *        You need to set `arrayItem=true` in those cases. Otherwise, all single items from `item` are removed separately.
     * @chainable
     */
    Array.remove || (ArrayPrototype.remove=function(item, arrayItem) {
        var instance = this,
            removeItem = function(oneItem) {
                var index = instance.indexOf(oneItem);
                (index > -1) && instance.splice(index, 1);
            };
        if (!arrayItem && Array.isArray(item)) {
            item.forEach(removeItem);
        }
        else {
            removeItem(item);
        }
        return instance;
    });

    /**
     * Replaces an item in the array. If the previous item is not part of the array, the new item is appended.
     *
     * @method replace
     * @param prevItem {any} the item to be replaced
     * @param newItem {any} the item to be added
     * @chainable
     */
    Array.replace || (ArrayPrototype.replace=function(prevItem, newItem) {
        var instance = this,
            index = instance.indexOf(prevItem);
        (index!==-1) ? instance.splice(index, 1, newItem) : instance.push(newItem);
        return instance;
    });

    /**
     * Inserts an item in the array at the specified position. If index is larger than array.length, the new item(s) will be appended.
     *
     * @method insertAt
     * @param item {any|Array} the item to be replaced, may be an Array of items
     * @param index {Number} the position where to add the item(s). When larger than Array.length, the item(s) will be appended.
     * @chainable
     */
    Array.insertAt || (ArrayPrototype.insertAt=function(item, index) {
        this.splice(index, 0, item);
        return this;
    });

    /**
     * Shuffles the items in the Array randomly
     *
     * @method shuffle
     * @chainable
     */
    Array.shuffle || (ArrayPrototype.shuffle=function() {
        var instance = this,
            counter = instance.length,
            temp, index;
        // While there are elements in the instance
        while (counter>0) {
            // Pick a random index
            index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            temp = instance[counter];
            instance[counter] = instance[index];
            instance[index] = temp;
        }
        return instance;
    });

    /**
     * Returns a deep copy of the Array.
     * Only handles members of primary types, Dates, Arrays and Objects.
     *
     * @method deepClone
     * @return {Array} deep-copy of the original
     */
     ArrayPrototype.deepClone = function () {
        return cloneObj(this);
     };

}(Array.prototype));
},{"polyfill/polyfill-base.js":40}],31:[function(require,module,exports){
/**
 *
 * Pollyfils for often used functionality for Functions
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module js-ext
 * @submodule lib/function.js
 * @class Function
 *
*/

"use strict";

require('polyfill/polyfill-base.js');

// Define configurable, writable and non-enumerable props
// if they don't exist.
var defineProperty = function (object, name, method, force) {
	if (!force && (name in object)) {
		return;
	}
	Object.defineProperty(object, name, {
		configurable: true,
		enumerable: false,
		writable: true,
		value: method
	});
};
var defineProperties = function (object, map, force) {
	var names = Object.keys(map),
		l = names.length,
		i = -1,
		name;
	while (++i < l) {
		name = names[i];
		defineProperty(object, name, map[name], force);
	}
};
var NOOP = function () {};

/**
 * Pollyfils for often used functionality for Function
 * @class Function
*/

defineProperties(Function.prototype, {

	/**
	 * Merges the given map of properties into the `prototype` of the Class.
	 * **Not** to be used on instances.
	 *
	 * The members in the hash map will become members with
	 * instances of the merged class.
	 *
	 * By default, this method will not override existing prototype members,
	 * unless the second argument `force` is true.
	 *
	 * @method mergePrototypes
	 * @param map {Object} Hash map of properties to add to the prototype of this object
	 * @param force {Boolean}  If true, existing members will be overwritten
	 * @chainable
	 */
	mergePrototypes: function (map, force) {
		var proto = this.prototype;

		var names = Object.keys(map || {}),
			l = names.length,
			i = -1,
			name;
		while (++i < l) {
			name = names[i];
			if (!force && name in proto) continue;
			proto[name] = map[name];
		}
		return this;

	},

	/**
	 * Returns a newly created class inheriting from this class
	 * using the given `constructor` with the
	 * prototypes listed in `prototypes` merged in.
	 *
	 *
	 * The newly created class has the `$super` static property
	 * available to access all of is ancestor's instance methods.
	 *
	 * Further methods can be added via the [mergePrototypes](#method_mergePrototypes).
	 *
	 * @example
	 *
	 * 	var Circle = Shape.subClass(
	 * 		function (x, y, r) {
	 * 			this.r = r;
	 * 			Circle.$super.constructor.call(this, x, y);
	 * 		},
	 * 		{
	 * 			area: function () {
	 * 				return this.r * this.r * Math.PI;
	 * 			}
	 * 		}
	 * 	);
	 *
	 * @method subClass
	 * @param [constructor] {Function} The function that will serve as constructor for the new class.
	 *        If `undefined` defaults to `Object.constructor`
	 * @param [prototypes] {Object} Hash map of properties to be added to the prototype of the new class.
	 * @return the new class.
	 */
	subClass: function (constructor, prototypes) {

		if ((arguments.length === 1) && (typeof constructor !== 'function')) {
			prototypes = constructor;
			constructor = null;
		}


		constructor = constructor || function (ancestor) {
			return function () {
				ancestor.apply(this, arguments);
			};
		}(this);


		var baseProt = this.prototype,
			rp = Object.create(baseProt);
		constructor.prototype = rp;

		rp.constructor = constructor;
		constructor.$super = baseProt;
		constructor.$orig = {};

		constructor.mergePrototypes(prototypes, true);
		return constructor;
	},

	/**
	 * Overwrites the given prototype functions with the ones given in
	 * the hashmap while still providing a means of calling the original
	 * overridden method.
     *
	 * The patching function will receive a reference to the original method
	 * prepended to the arguments the original would have received.
     *
	 * @method patch
	 * @param map {Object} Hash map of method names to their new implementation.
	 * @chainable
	*/
	patch: function (map) {
		var proto = this.prototype;

		var names = Object.keys(map || {}),
			l = names.length,
			i = -1,
			name;
		while (++i < l) {
			name = names[i];
			/*jshint -W083 */
			proto[name] = (function (original) {
				return function () {
					/*jshint +W083 */
					var a = Array.prototype.slice.call(arguments, 0);
					a.unshift(original || NOOP);
					return map[name].apply(this, a);
				};
			})(proto[name]);
		}
		return this;
	},

	/**
	 * Sets the context of which the function will be execute. in the
	 * supplied object's context, optionally adding any additional
	 * supplied parameters to the end of the arguments the function
	 * is executed with.
	 *
	 * @method rbind
	 * @param [context] {Object} the execution context.
	 *        The value is ignored if the bound function is constructed using the new operator.
	 * @param [args*] {any} args* 0..n arguments to append to the end of
	 *        arguments collection supplied to the function.
	 * @return {function} the wrapped function.
	 */
	rbind: function (context /*, args* */ ) {
		var thisFunction = this,
			arrayArgs,
			slice = Array.prototype.slice;
		context || (context = this);
		if (arguments.length > 1) {
			// removing `context` (first item) by slicing it out:
			arrayArgs = slice.call(arguments, 1);
		}

		return (arrayArgs ?
			function () {
				// over here, `arguments` will be the "new" arguments when the final function is called!
				return thisFunction.apply(context, slice.call(arguments, 0).concat(arrayArgs));
			} :
			function () {
				// over here, `arguments` will be the "new" arguments when the final function is called!
				return thisFunction.apply(context, arguments);
			}
		);
	}
});

/**
 * Returns a base class with the given constructor and prototype methods
 *
 * @for Object
 * @method createClass
 * @param [constructor] {Function} constructor for the class
 * @param [prototype] {Object} Hash map of prototype members of the new class
 * @return {Function} the new class
*/
defineProperty(Object.prototype, 'createClass', function () {
	return Function.prototype.subClass.apply(this, arguments);
});
},{"polyfill/polyfill-base.js":40}],32:[function(require,module,exports){
/**
 *
 * Pollyfils for often used functionality for Objects
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module js-ext
 * @submodule lib/object.js
 * @class Object
 *
*/

"use strict";

require('polyfill/polyfill-base.js');

var TYPES = {
       'undefined' : true,
       'number' : true,
       'boolean' : true,
       'string' : true,
       '[object Function]' : true,
       '[object RegExp]' : true,
       '[object Array]' : true,
       '[object Date]' : true,
       '[object Error]' : true,
       '[object Promise]' : true
   },

// Define configurable, writable and non-enumerable props
// if they don't exist.
defineProperty = function (object, name, method, force) {
    if (!force && (name in object)) {
        return;
    }
    Object.defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: method
    });
},
defineProperties = function (object, map, force) {
    var names = Object.keys(map),
        l = names.length,
        i = -1,
        name;
    while (++i < l) {
        name = names[i];
        defineProperty(object, name, map[name], force);
    }
},

_each = function (obj, fn, context) {
    var keys = Object.keys(obj),
        l = keys.length,
        i = -1,
        key;
    while (++i < l) {
        key = keys[i];
        fn.call(context, obj[key], key, obj);
    }
    return obj;
},

cloneObj = function(obj) {
    var copy, i, len, value;

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        len = obj.length;
        for (i=0; i<len; i++) {
            value = obj[i];
            copy[i] = ((value===null) || (typeof value!=='object')) ? value : cloneObj(value);
        }
        return copy;
    }

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Object
    else if (obj instanceof Object) {
        copy = obj.deepClone();
    }

    return copy;
};

/**
 * Pollyfils for often used functionality for objects
 * @class Object
*/
defineProperties(Object.prototype, {
    /**
     * Loops through all properties in the object.  Equivalent to Array.forEach.
     * The callback is provided with the value of the property, the name of the property
     * and a reference to the whole object itself.
     * The context to run the callback in can be overriden, otherwise it is undefined.
     *
     * @method each
     * @param fn {Function} Function to be executed on each item in the object.  It will receive
     *                      value {any} value of the property
     *                      key {string} name of the property
     *                      obj {Object} the whole of the object
     * @chainable
     */
    each: function (fn, context) {
        if (context) return _each(this, fn, context);
        var keys = Object.keys(this),
            l = keys.length,
            i = -1,
            key;
        while (++i < l) {
            key = keys[i];
            fn(this[key], key, this);
        }
        return this;
    },

    /**
     * Loops through the properties in an object until the callback function returns *truish*.
     * The callback is provided with the value of the property, the name of the property
     * and a reference to the whole object itself.
     * The order in which the elements are visited is not predictable.
     * The context to run the callback in can be overriden, otherwise it is undefined.
     *
     * @method some
     * @param fn {Function} Function to be executed on each item in the object.  It will receive
     *                      value {any} value of the property
     *                      key {string} name of the property
     *                      obj {Object} the whole of the object
     * @return {Boolean} true if the loop was interrupted by the callback function returning *truish*.
     */
    some: function (fn, context) {
        var keys = Object.keys(this),
            l = keys.length,
            i = -1,
            key;
        while (++i < l) {
            key = keys[i];
            if (fn.call(context, this[key], key, this)) {
                return true;
            }
        }
        return false;
    },

    /**
     * Loops through the properties in an object until the callback assembling a new object
     * with its properties set to the values returned by the callback function.
     * If the callback function returns `undefined` the property will not be copied to the new object.
     * The resulting object will have the same keys as the original, except for those where the callback
     * returned `undefined` which will have dissapeared.
     * The callback is provided with the value of the property, the name of the property
     * and a reference to the whole object itself.
     * The context to run the callback in can be overriden, otherwise it is undefined.
     *
     * @method map
     * @param fn {Function} Function to be executed on each item in the object.  It will receive
     *                      value {any} value of the property
     *                      key {string} name of the property
     *                      obj {Object} the whole of the object
     * @return {Object} The new object with its properties set to the values returned by the callback function.
     */
    map: function (fn, context) {
        var keys = Object.keys(this),
            l = keys.length,
            i = -1,
            m = {},
            val, key;
        while (++i < l) {
            key = keys[i];
            val = fn.call(context, this[key], key, this);
            if (val !== undefined) {
                m[key] = val;
            }
        }
        return m;
    },
    /**
     * Returns the keys of the object.
     *
     * @method keys
     * @return {Array} Keys of the object
     */
    keys: function () {
        return Object.keys(this);
    },
    /**
     * Returns the number of keys of the object
     *
     * @method size
     * @return {Number} Number of items
     */
    size: function () {
        return Object.keys(this).length;
    },
    /**
     * Loops through the object collection the values of all its properties.
     * It is the counterpart of the [`keys`](#method_keys).
     *
     * @method values
     * @return {Array} values of the object
     */
    values: function () {
        var keys = Object.keys(this),
            i = -1,
            len = keys.length,
            values = [];

        while (++i < len) {
            values.push(this[keys[i]]);
        }

        return values;
    },

    /**
     * Returns true if the object has no own members
     *
     * @method isEmpty
     * @return {Boolean} true if the object is empty
     */
    isEmpty: function () {
        for (var key in this) {
            if (this.hasOwnProperty(key)) return false;
        }
        return true;
    },

    /**
     * Creates a protected property on the object.
     *
     * @method protectedProp
     * @chainable
     */
    protectedProp: function(property, value) {
        Object.defineProperty(this, property, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: value
        });
        return this;
    },

    /**
     * Returns a shallow copy of the object.
     * It does not clone objects within the object, it does a simple, shallow clone.
     * Fast, mostly useful for plain hash maps.
     *
     * @method shallowClone
     * @return {Object} shallow copy of the original
     */
    shallowClone: function () {
        var m = {},
            keys = Object.keys(this),
            l = keys.length,
            i = -1,
            key;
        while (++i < l) {
            key = keys[i];
            m[key] = this[key];
        }
        return m;
    },

    /**
     * Compares this object with the reference-object whether they have the same value.
     * Not by reference, but their content as simple types.
     *
     * Compares both JSON.stringify objects
     *
     * @method sameValue
     * @param refObj {Object} the object to compare with
     * @return {Boolean} whether both objects have the same value
     */
    sameValue: function(refObj) {
        return JSON.stringify(this)===JSON.stringify(refObj);
    },

    /**
     * Returns a deep copy of the object.
     * Only handles members of primary types, Dates, Arrays and Objects.
     *
     * @method deepClone
     * @return {Object} deep-copy of the original
     */
    deepClone: function () {
        var m = {},
            keys = Object.keys(this),
            l = keys.length,
            i = -1,
            key, attr, value;
        // loop through the members:
        while (++i < l) {
            key = keys[i];
            value = this[key];
            m[key] = ((value===null) || (typeof value!=='object')) ? value : cloneObj(value);
        }
        return m;
    },

    /**
     * Transforms the object into an array with  'key/value' objects
     *
     * @example
     * {country: 'USA', Continent: 'North America'} --> [{key: 'country', value: 'USA'}, {key: 'Continent', value: 'North America'}]
     *
     * @method toArray
     * @param [options] {Object}
     * @param [options.key] {String} to overrule the default `key`-property-name
     * @param [options.value] {String} to overrule the default `value`-property-name
     * @return {Array} the transformed Array-representation of the object
     */
    toArray: function(options) {
        var newArray = [],
            keyIdentifier = (options && options.key) || 'key',
            valueIdentifier = (options && options.value) || 'value';
        this.each(function(value, key) {
            var obj = {};
            obj[keyIdentifier] = key;
            obj[valueIdentifier] = value;
            newArray[newArray.length] = obj;
        });
        return newArray;
    },

    /**
     * Merges into this object the properties of the given object.
     * If the second argument is true, the properties on the source object will be overwritten
     * by those of the second object of the same name, otherwise, they are preserved.
     *
     * @method merge
     * @param obj {Object} Object with the properties to be added to the original object
     * @param force {Boolean} If true, the properties in `obj` will override those of the same name
     *        in the original object
     * @chainable
     */
    merge: function (obj, force) {
        var m = this;
        if (obj && obj.each) obj.each(function (value, key) {
            if (force || !(key in m)) {
                m[key] = obj[key];
            }
        });
        return m;
    }

});

/**
* Returns true if the item is an object, but no Array, Function, RegExp, Date or Error object
*
* @method isObject
* @return {Boolean} true if the object is empty
*/
Object.isObject = function (item) {
   return !!(!TYPES[typeof item] && !TYPES[({}.toString).call(item)] && item);
};

/**
 * Returns a new object resulting of merging the properties of the given objects.
 * The copying is shallow, complex properties will reference the very same object.
 * Properties in later objects do **not overwrite** properties of the same name in earlier objects.
 * If any of the objects is missing, it will be skiped.
 *
 * @example
 *
 *  var foo = function (config) {
 *       config = Object.merge(config, defaultConfig);
 *  }
 *
 * @method merge
 * @static
 * @param obj* {Object} Objects whose properties are to be merged
 * @return {Object} new object with the properties merged in.
 */
Object.merge = function () {
    var m = {};
    Array.prototype.forEach.call(arguments, function (obj) {
        if (obj) m.merge(obj);
    });
    return m;
};
},{"polyfill/polyfill-base.js":40}],33:[function(require,module,exports){
"use strict";

/**
 * Provides additional Promise-methods. These are extra methods which are not part of the PromiseA+ specification,
 * But are all Promise/A+ compatable.
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 *
 * @module js-ext
 * @submodule lib/promise.s
 * @class Promise
*/

require('polyfill');

var NAME = '[promise-ext]: ',
    FUNCTION_EXPECTED = ' expects an array of function-references', // include leading space!
    PROMISE_CHAIN = 'Promise.chain';

(function(PromisePrototype) {
    /**
     * Promise which can be put at the very end of a chain, even after .catch().
     * Will invoke the callback function regardless whether the chain resolves or rejects.
     *
     * The argument of the callback will be either its fulfilled or rejected argument, but
     * it is wisely not to handle it. The results should have been handled in an earlier step
     * of the chain: .finally() basicly means you want to execute code after the chain, regardless
     * whether it's resolved or rejected.
     *
     * **Note:** .finally() <u>does not return a Promise</u>: it should be used as the very last step of a Promisechain.
     * If you need an intermediate method, you should take .thenFulfill().
     *
     * @method finally
     * @param finallyback {Function} the callbackfunctio to be invoked.
     * @return {Promise}
     */
    PromisePrototype.finally = function (finallyback) {
        console.log(NAME, 'finally');
        return this.then(finallyback, finallyback);
    };

    /**
     * Will always return a fulfilled Promise.
     *
     * Typical usage will be by making it part of a Promisechain: it makes the chain go
     * into its fulfilled phase.
     *
     * @example
     *
     * promise1
     * .then(promise2)
     * .thenFulfill()
     * .then(handleFulfilled, handleRejected) // handleFulfilled always gets invoked
     * @method thenFulfill
     * @param [response] {Object} parameter to pass through which overrules the original Promise-response.
     * @return {Promise} Resolved Promise. `response` will be passed trough as parameter when set.
     *         When not set: in case the original Promise resolved, its parameter is passed through.
     *         in case of a rejection, no parameter will be passed through.
     */
    PromisePrototype.thenFulfill = function (callback) {
        console.log(NAME, 'thenFulfill');
        return this.then(
            function(r) {
                return r;
            },
            function(r) {
                return r;
            }
        ).then(callback);
    };
}(Promise.prototype));

/**
 * Returns a Promise that always fulfills. It is fulfilled when ALL items are resolved (either fulfilled
 * or rejected). This is useful for waiting for the resolution of multiple
 * promises, such as reading multiple files in Node.js or making multiple XHR
 * requests in the browser. Because -on the contrary of `Promise.all`- **finishAll** waits until
 * all single Promises are resolved, you can handle all promises, even if some gets rejected.
 *
 * @method finishAll
 * @param items {Any[]} an array of any kind of items, promises or not. If a value is not a promise,
 * its transformed into a resolved promise.
 * @return {Promise} A promise for an array of all the fulfillment items:
 * <ul>
 *     <li>Fulfilled: o {Object}
 *         <ul>
 *             <li>fulfilled {Array} all fulfilled responses, any item that was rejected will have a value of `undefined`</li>
 *             <li>rejected {Array} all rejected responses, any item that was fulfilled will have a value of `undefined`</li>
 *         </ul>
 *     </li>
 *     <li>Rejected: this promise **never** rejects</li>
 * </ul>
 * @static
 */
Promise.finishAll = function (items) {
    console.log(NAME, 'finishAll');
    return new Promise(function (fulfill) {
        // Array.isArray assumes ES5
        Array.isArray(items) || (items=[items]);

        var remaining        = items.length,
            length           = items.length,
            fulfilledresults = [],
            rejectedresults  = [],
            i;

        function oneDone(index, fulfilled) {
            return function (value) {
                fulfilled ? (fulfilledresults[index]=value) : (rejectedresults[index]=value);
                remaining--;
                if (!remaining) {
                    console.log(NAME, 'finishAll is fulfilled');
                    fulfill({
                        fulfilled: fulfilledresults,
                        rejected: rejectedresults
                    });
                }
            };
        }

        if (length < 1) {
            console.warn(NAME, 'finishAll fulfilles immediately: no items');
            return fulfill({
                        fulfilled: fulfilledresults,
                        rejected: rejectedresults
                    });
        }

        fulfilledresults.length = length;
        rejectedresults.length = length;
        for (i=0; i < length; i++) {
            Promise.resolve(items[i]).then(oneDone(i, true), oneDone(i, false));
        }
    });
};

/**
 * Returns a Promise which chains the function-calls. Like an automated Promise-chain.
 * Invokes the functionreferences in a chain. You MUST supply function-references, it doesn't
 * matter wheter these functions return a Promise or not. Any returnvalues are passed through to
 * the next function.
 *
 * **Cautious:** you need to pass function-references, not invoke them!
 * chainFns will invoke them when the time is ready. Regarding to this, there is a difference with
 * using Promise.all() where you should pass invoked Promises.
 *
 * If one of the functions returns a Promise, the chain
 * will wait its execution for this function to be resolved.
 *
 * If you need specific context or arguments: use Function.bind for these items.
 * If one of the items returns a rejected Promise, by default: the whole chain rejects
 * and following functions in the chain will not be invoked. When `finishAll` is set `true`
 * the chain will always continue even with rejected Promises.
 *
 * Returning functionvalues are passed through the chain adding them as an extra argument
 * to the next function in the chain (argument is added on the right)
 *
 * @example
 *     var a = [], p1, p2, p3;
 *     p1 = function(a) {
 *         return new Promise(function(resolve, reject) {
 *             I.later(function() {
 *                 console.log('resolving promise p1: '+a);
 *                 resolve(a);
 *             }, 1000);
 *         });
 *     };
 *     p2 = function(b, r) {
 *         var value = b+r;
 *         console.log('returning p2: '+value);
 *         return value;
 *     };
 *     p3 = function(c, r) {
 *         return new Promise(function(resolve, reject) {
 *             I.later(function() {
 *                 var value = b+r;
 *                 console.log('resolving promise p3: '+value);
 *                 resolve(value);
 *             }, 1000);
 *         });
 *     };
 *     a.push(p1.bind(undefined, 100));
 *     a.push(p2.bind(undefined, 200));
 *     a.push(p3.bind(undefined, 300));
 *     Promise.chainFns(a).then(
 *         function(r) {
 *             console.log('chain resolved with '+r);
 *         },
 *         function(err) {
 *             console.log('chain-error '+err);
 *         }
 *     );
 *
 * @method chainFns
 * @param funcs {function[]} an array of function-references
 * @param [finishAll=false] {boolean} to force the chain to continue, even if one of the functions
 *        returns a rejected Promise
 * @return {Promise}
 * on success:
    * o {Object} returnvalue of the laste item in the Promisechain
 * on failure an Error object
    * reason {Error}
 * @static
 */
Promise.chainFns = function (funcs, finishAll) {
    console.log(NAME, 'chainFns');
    var handleFn, length, handlePromiseChain,
        i = 0;
    // Array.isArray assumes ES5
    Array.isArray(funcs) || (funcs=[funcs]);
    length = funcs.length;
    handleFn = function() {
        var nextFn = funcs[i],
            promise;
        if (typeof nextFn !== 'function') {
            return Promise.reject(new TypeError(PROMISE_CHAIN+FUNCTION_EXPECTED));
        }
        promise = Promise.resolve(nextFn.apply(null, arguments));
        // by using "promise.catch(function(){})" we return a resolved Promise
        return finishAll ? promise.thenFulfill() : promise;
    };
    handlePromiseChain = function() {
        // will loop until rejected, which is at destruction of the class
        return handleFn.apply(null, arguments).then((++i<length) ? handlePromiseChain : undefined);
    };
    return handlePromiseChain();
};

/**
 * Returns a Promise with 4 additional methods:
 *
 * promise.fulfill
 * promise.reject
 * promise.callback
 * promise.setCallback
 *
 * With Promise.manage, you get a Promise which is managable from outside, not inside as Promise A+ work.
 * You can invoke promise.**callback**() which will invoke the original passed-in callbackFn - if any.
 * promise.**fulfill**() and promise.**reject**() are meant to resolve the promise from outside, just like deferred can do.
 *
 * @example
 *     var promise = Promise.manage(
 *         function(msg) {
 *             alert(msg);
 *         }
 *     );
 *
 *     promise.then(
 *         function() {
 *             // promise is fulfilled, no further actions can be taken
 *         }
 *     );
 *
 *     setTimeout(function() {
 *         promise.callback('hey, I\'m still busy');
 *     }, 1000);
 *
 *     setTimeout(function() {
 *         promise.fulfill();
 *     }, 2000);
 *
 * @method manage
 * @param [callbackFn] {Function} invoked everytime promiseinstance.callback() is called.
 *        You may as weel (re)set this method atny time lare by using promise.setCallback()
 * @return {Promise} with three handles: fulfill, reject and callback.
 * @static
 */
Promise.manage = function (callbackFn) {
    console.log(NAME, 'manage');
    var fulfillHandler, rejectHandler, promise, finished;

    promise = new Promise(function (fulfill, reject) {
        fulfillHandler = fulfill;
        rejectHandler = reject;
    });

    promise.fulfill = function (value) {
        console.log(NAME, 'manage.fulfill');
        finished = true;
        fulfillHandler(value);
    };

    promise.reject = function (reason) {
        console.log(NAME, 'manage.reject '+((typeof reason==='string') ? reason : reason && (reason.message || reason.description)));
        finished = true;
        rejectHandler(reason);
    };

    promise.callback = function () {
        if (!finished && callbackFn) {
            console.log(NAME, 'manage.callback is invoked');
            callbackFn.apply(undefined, arguments);
        }
    };

    promise.setCallback = function (newCallbackFn) {
        callbackFn = newCallbackFn;
    };

    return promise;
};

},{"polyfill":40}],34:[function(require,module,exports){
/**
 *
 * Pollyfils for often used functionality for Strings
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module js-ext
 * @submodule lib/string.js
 * @class String
 *
 */

"use strict";

(function(StringPrototype) {
    var SUBREGEX  = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g,
        DATEPATTERN = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/,
        WHITESPACE_CLASS = "[\\s\uFEFF\xA0]+",
        TRIM_LEFT_REGEX  = new RegExp('^' + WHITESPACE_CLASS),
        TRIM_RIGHT_REGEX = new RegExp(WHITESPACE_CLASS + '$'),
        TRIMREGEX        = new RegExp(TRIM_LEFT_REGEX.source + '|' + TRIM_RIGHT_REGEX.source, 'g'),
        PATTERN_EMAIL = new RegExp('^[\\w!#$%&\'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&\'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\\.)+[a-zA-Z]{2,}$'),
        PATTERN_URLEND = '([a-zA-Z0-9]+\\.)*(?:[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\\.)+[a-zA-Z]{2,}(/[\\w-]+)*$',
        PATTERN_URLHTTP = new RegExp('^http://'+PATTERN_URLEND),
        PATTERN_URLHTTPS = new RegExp('^https://'+PATTERN_URLEND),
        PATTERN_URL = new RegExp('^(https?://)?'+PATTERN_URLEND),
        PATTERN_INTEGER = /^(([-]?[1-9][0-9]*)|0)$/,
        PATTERN_FLOAT_START = '^([-]?(([1-9][0-9]*)|0))?(\\',
        PATTERN_FLOAT_END = '[0-9]+)?$',
        PATTERN_FLOAT_COMMA = new RegExp(PATTERN_FLOAT_START + ',' + PATTERN_FLOAT_END),
        PATTERN_FLOAT_DOT = new RegExp(PATTERN_FLOAT_START + '.' + PATTERN_FLOAT_END),
        PATTERN_HEX_COLOR_ALPHA = /^#?[0-9A-F]{4}([0-9A-F]{4})?$/,
        PATTERN_HEX_COLOR = /^#?[0-9A-F]{3}([0-9A-F]{3})?$/;

    /**
     * Checks whether the substring is part if this String.
     * Alias for (String.indexOf(substring) > -1)
     *
     * @method contains
     * @param substring {String} the substring to test for
     * @param [caseInsensitive=false] {Boolean} whether to ignore case-sensivity
     * @return {Boolean} whether the substring is found
     */
    String.contains || (StringPrototype.contains=function(substring, caseInsensitive) {
        return caseInsensitive ? (this.toLowerCase().indexOf(substring.toLowerCase()) > -1) : (this.indexOf(substring) > -1);
    });

    /**
     * Checks if the string ends with the value specified by `test`
     *
     * @method endsWith
     * @param test {String} the string to test for
     * @param [caseInsensitive=false] {Boolean} whether to ignore case-sensivity
     * @return {Boolean} whether the string ends with `test`
     */
    String.endsWith || (StringPrototype.endsWith=function(test, caseInsensitive) {
        return (new RegExp(test+'$', caseInsensitive ? 'i': '')).test(this);
    });

    /**
     * Checks if the string can be parsed into a number when using `parseInt()`
     *
     * @method parsable
     * @return {Boolean} whether the string is parsable
     */
    String.parsable || (StringPrototype.parsable=function() {
        // strange enough, NaN doen't let compare itself, so we need a strange test:
        // parseInt(value, 10)===parseInt(value, 10)
        // which returns `true` for a parsable value, otherwise false
        return (parseInt(this)===parseInt(this));
    });

    /**
     * Checks if the string starts with the value specified by `test`
     *
     * @method startsWith
     * @param test {String} the string to test for
     * @param [caseInsensitive=false] {Boolean} whether to ignore case-sensivity
     * @return {Boolean} whether the string starts with `test`
     */
    String.startsWith || (StringPrototype.startsWith=function(test, caseInsensitive) {
        return (new RegExp('^'+test, caseInsensitive ? 'i': '')).test(this);
    });

    /**
     * Performs `{placeholder}` substitution on a string. The object passed
     * provides values to replace the `{placeholder}`s.
     * `{placeholder}` token names must match property names of the object.
     *
     * `{placeholder}` tokens that are undefined on the object map will be removed.
     *
     * @example
     * var greeting = '{message} {who}!';
     * greeting.substitute({message: 'Hello'}); // results into 'Hello !'
     *
     * @method substitute
     * @param obj {Object} Object containing replacement values.
     * @return {String} the substitute result.
     */
    String.substitute || (StringPrototype.substitute=function(obj) {
        return this.replace(SUBREGEX, function (match, key) {
            return (obj[key]===undefined) ? '' : obj[key];
        });
    });

    /**
     * Returns a ISO-8601 Date-object build by the String's value.
     * If the String-value doesn't match ISO-8601, `null` will be returned.
     *
     * ISO-8601 Date's are generated by JSON.stringify(), so it's very handy to be able to reconvert them.
     *
     * @example
     * var birthday = '2010-02-10T14:45:30.000Z';
     * birthday.toDate(); // --> Wed Feb 10 2010 15:45:30 GMT+0100 (CET)
     *
     * @method toDate
     * @return {Date|null} the Date represented by the String's value or null when invalid
     */
    String.toDate || (StringPrototype.toDate=function() {
        return DATEPATTERN.test(this) ? new Date(this) : null;
    });

    /**
     * Generated the string without any white-spaces at the start or end.
     *
     * @method trim
     * @return {String} new String without leading and trailing white-spaces
     */
    String.trim || (StringPrototype.trim=function() {
        return this.replace(TRIMREGEX, '');
    });

    /**
     * Generated the string without any white-spaces at the beginning.
     *
     * @method trimLeft
     * @return {String} new String without leading white-spaces
     */
    String.trimLeft || (StringPrototype.trimLeft=function() {
        return this.replace(TRIM_LEFT_REGEX, '');
    });

    /**
     * Generated the string without any white-spaces at the end.
     *
     * @method trimRight
     * @return {String} new String without trailing white-spaces
     */
    String.trimRight || (StringPrototype.trimRight=function() {
        return this.replace(TRIM_RIGHT_REGEX, '');
    });

    /**
     * Validates if the String's value represents a valid emailaddress.
     *
     * @method validateEmail
     * @return {Boolean} whether the String's value is a valid emailaddress.
     */
    StringPrototype.validateEmail = function() {
        return PATTERN_EMAIL.test(this);
    };

    /**
     * Validates if the String's value represents a valid floated number.
     *
     * @method validateFloat
     * @param [comma] {Boolean} whether to use a comma as decimal separator instead of a dot
     * @return {Boolean} whether the String's value is a valid floated number.
     */
    StringPrototype.validateFloat = function(comma) {
        return comma ? PATTERN_FLOAT_COMMA.test(this) : PATTERN_FLOAT_DOT.test(this);
    };

    /**
     * Validates if the String's value represents a hexadecimal color.
     *
     * @method validateHexaColor
     * @param [alpha=false] {Boolean} whether to accept alpha transparancy
     * @return {Boolean} whether the String's value is a valid hexadecimal color.
     */
    StringPrototype.validateHexaColor = function(alpha) {
        return alpha ? PATTERN_HEX_COLOR_ALPHA.test(this) : PATTERN_HEX_COLOR.test(this);
    };

    /**
     * Validates if the String's value represents a valid integer number.
     *
     * @method validateNumber
     * @return {Boolean} whether the String's value is a valid integer number.
     */
    StringPrototype.validateNumber = function() {
        return PATTERN_INTEGER.test(this);
    };

    /**
     * Validates if the String's value represents a valid boolean.
     *
     * @method validateNumber
     * @return {Boolean} whether the String's value is a valid integer number.
     */
    StringPrototype.validateBoolean = function() {
        var length = this.length,
            check;
        if ((length<4) || (length>5)) {
            return false;
        }
        check = this.toUpperCase();
        return ((check==='TRUE') || (check==='FALSE'));
    };

    /**
     * Validates if the String's value represents a valid URL.
     *
     * @method validateURL
     * @param [options] {Object}
     * @param [options.http] {Boolean} to force matching starting with `http://`
     * @param [options.https] {Boolean} to force matching starting with `https://`
     * @return {Boolean} whether the String's value is a valid URL.
     */
    StringPrototype.validateURL = function(options) {
        var instance = this;
        options || (options={});
        if (options.http && options.https) {
            return false;
        }
        return options.http ? PATTERN_URLHTTP.test(instance) : (options.https ? PATTERN_URLHTTPS.test(instance) : PATTERN_URL.test(instance));
    };

}(String.prototype));

},{}],35:[function(require,module,exports){
"use strict";

/*
 * Returns the right transform-property for the current environment.
 *
 * `transform`, `-webkit-transform`, `-moz-transform`, `-ms-transform`, `-o-transform` or `undefined` when not supported
 */

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.Transition) {
        return window._ITSAmodules.Transition; // Transition was already created
    }

    var DOCUMENT_STYLE = window.document.documentElement.style,
        RANSITION = 'ransition',
        TRANSITION = 't'+RANSITION,
        VENDORS = ['-webkit-', '-moz-', '-ms-', '-o-'],
        transition;

    // Map transition properties to vendor-specific versions.
    // One-off required for cssText injection.
    if ((TRANSITION in DOCUMENT_STYLE) && (TRANSITION+'Property' in DOCUMENT_STYLE) &&
        (TRANSITION+'Duration' in DOCUMENT_STYLE) && (TRANSITION+'TimingFunction' in DOCUMENT_STYLE) && (TRANSITION+'Delay' in DOCUMENT_STYLE)) {
        transition = TRANSITION;
    }
    else {
        VENDORS.some(function(val) { // then vendor specific
            var property1 = val + TRANSITION,
                property2 = val + 'T'+RANSITION;
            ((typeof DOCUMENT_STYLE[property1] !== 'undefined') || (typeof DOCUMENT_STYLE[property2] !== 'undefined')) && (transition=property1);
            return transition;
        });
    }

    window._ITSAmodules.Transition = transition || TRANSITION;

    return transition;
};
},{}],36:[function(require,module,exports){
"use strict";

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.TransitionEnd) {
        return window._ITSAmodules.TransitionEnd; // TransitionEnd was already created
    }

    var DOCUMENT_STYLE = window.document.documentElement.style,
        transitions = {},
        ransition = 'ransition',
        transition = 't'+ransition,
        end = 'end',
        transitionEnd, t;

    transitions[transition] = transition+end;
    transitions['WebkitT'+ransition] = 'webkitT'+ransition+'End';
    transitions['MozT'+ransition] = transition+end;
    transitions['OT'+ransition] = 'o'+transition+end;

    for (t in transitions) {
        if (typeof DOCUMENT_STYLE[t] !== 'undefined') {
            transitionEnd = transitions[t];
            break;
        }
    }

    window._ITSAmodules.TransitionEnd = transitionEnd;

    return transitionEnd;
};
},{}],37:[function(require,module,exports){
(function (global){
"use strict";

/*
 * Returns the vendor-specific transform-property for the current environment.
 *
 * `transform`, `-webkit-transform`, `-moz-transform`, `-ms-transform`, `-o-transform` or `undefined` when not supported
 */

require('js-ext/lib/object.js');

var toCamelCase = function(input) {
        return input.replace(/-(.)/g, function(match, group) {
            return group.toUpperCase();
        });
    },
    UNDEFINED = 'undefined';

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.VendorCSS) {
        return window._ITSAmodules.VendorCSS; // VendorCSS was already created
    }

    var DOCUMENT_STYLE = window.document.documentElement.style,
        RUNNING_ON_NODE = (typeof global !== 'undefined') && (global.window!==window),
        VENDORS = ['-webkit-', '-moz-', '-ms-', '-o-'],
        vendorCSS;

    window._ITSAmodules.VendorCSS = vendorCSS = {
        generator: function(cssProperty) {
            var vendorProperty;
            if (cssProperty==='') {
                return '';
            }
            if (!RUNNING_ON_NODE && !vendorCSS.cssProps[cssProperty]) {
                if (typeof DOCUMENT_STYLE[cssProperty] !== UNDEFINED) {
                    vendorProperty = cssProperty;
                }
                else {
                    VENDORS.some(function(val) { // then vendor specific
                        var property = val + cssProperty,
                            propertyCamelCase = toCamelCase(property);
                        if ((typeof DOCUMENT_STYLE[property] !== UNDEFINED) || (typeof DOCUMENT_STYLE[propertyCamelCase] !== UNDEFINED)) {
                            vendorProperty = property;
                        }
                        return vendorProperty;
                    });
                }
                vendorCSS.cssProps[vendorProperty] = true;
            }
            return vendorProperty || cssProperty;
        },

        cssProps: {}
    };

    return vendorCSS;
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"js-ext/lib/object.js":32}],38:[function(require,module,exports){
(function (global){
// based upon https://gist.github.com/jonathantneal/3062955
(function (global) {
    "use strict";

    global.Element && (function(ElementPrototype) {
        ElementPrototype.matchesSelector ||
            (ElementPrototype.matchesSelector = ElementPrototype.mozMatchesSelector ||
                                                ElementPrototype.msMatchesSelector ||
                                                ElementPrototype.oMatchesSelector ||
                                                ElementPrototype.webkitMatchesSelector ||
                                                function (selector) {
                                                    var node = this,
                                                        nodes = (node.parentNode || global.document).querySelectorAll(selector),
                                                        i = -1;
                                                    while (nodes[++i] && (nodes[i] !== node));
                                                    return !!nodes[i];
                                                }
            );
    }(global.Element.prototype));

}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],39:[function(require,module,exports){
(function (global){
(function (global) {
    "use strict";

    var CONSOLE = {
            log: function() { /* NOOP */ },
            info: function() { /* NOOP */ },
            warn: function() { /* NOOP */ },
            error: function() { /* NOOP */ }
        };

    global.console || (function(GlobalPrototype) {
        GlobalPrototype.console = CONSOLE;
    }(global.prototype));

    module.exports = CONSOLE;
}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],40:[function(require,module,exports){
require('./lib/window.console.js');
require('./lib/matchesselector.js');
},{"./lib/matchesselector.js":38,"./lib/window.console.js":39}],41:[function(require,module,exports){
"use strict";

/**
 *
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module useragent
 * @class USERAGENT
 * @since 0.0.1
*/

require('polyfill');

var NAME = '[useragent]: ';

module.exports = function (window) {

    var UserAgent,
        navigator = window.navigator;

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

/*jshint boss:true */
    if (UserAgent=window._ITSAmodules.UserAgent) {
/*jshint boss:false */
        return UserAgent; // UserAgent was already created
    }

    window._ITSAmodules.UserAgent = UserAgent = {
        isMobile: ('ontouchstart' in window) || (window.navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
    };

    return UserAgent;
};
},{"polyfill":40}],42:[function(require,module,exports){
module.exports = {
	idGenerator: require('./lib/idgenerator.js').idGenerator,
	later: require('./lib/timers.js').later,
	async: require('./lib/timers.js').async
};
},{"./lib/idgenerator.js":43,"./lib/timers.js":44}],43:[function(require,module,exports){
"use strict";

require('polyfill/polyfill-base.js');

var UNDEFINED_NS = '__undefined__';
var namespaces = {};

/**
 * Collection of various utility functions.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module utils
 * @class Utils
 * @static
*/


/**
 * Generates an unique id with the signature: "namespace-follownr"
 *
 * @example
 *
 *     var generator = require('core-utils-idgenerator');
 *
 *     console.log(generator()); // --> 1
 *     console.log(generator()); // --> 2
 *     console.log(generator(1000)); // --> 1000
 *     console.log(generator()); // --> 1001
 *     console.log(generator('Parcel, 500')); // -->"Parcel-500"
 *     console.log(generator('Parcel')); // -->"Parcel-501"
 *
 *
 * @method idGenerator
 * @param [namespace] {String} namespace to prepend the generated id.
 *        When ignored, the generator just returns a number.
 * @param [start] {Number} startvalue for the next generated id. Any further generated id's will preceed this id.
 *        If `start` is lower or equal than the last generated id, it will be ignored.
 * @return {Number|String} an unique id. Either a number, or a String (digit prepended with "namespace-")
 */
module.exports.idGenerator = function(namespace, start) {
	// in case `start` is set at first argument, transform into (null, start)
	(typeof namespace==='number') && (start=namespace) && (namespace=null);
	namespace || (namespace=UNDEFINED_NS);

	if (!namespaces[namespace]) {
		namespaces[namespace] = start || 1;
	}
	else if (start && (namespaces[namespace]<start)) {
		namespaces[namespace] = start;
	}
	return (namespace===UNDEFINED_NS) ? namespaces[namespace]++ : namespace+'-'+namespaces[namespace]++;
};

},{"polyfill/polyfill-base.js":40}],44:[function(require,module,exports){
(function (process,global){
/**
 * Collection of various utility functions.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module utils
 * @class Utils
 * @static
*/


(function (global) {

	"use strict";

	require('polyfill/polyfill-base.js');

	var NAME = '[utils-timers]: ',
	    _asynchronizer, _async;

	/**
	 * Forces a function to be run asynchronously, but as fast as possible. In Node.js
	 * this is achieved using `setImmediate` or `process.nextTick`.
	 *
	 * @method _asynchronizer
	 * @param callbackFn {Function} The function to call asynchronously
	 * @static
	 * @private
	**/
	_asynchronizer = (typeof setImmediate !== 'undefined') ? function (fn) {setImmediate(fn);} :
                        ((typeof process !== 'undefined') && process.nextTick) ? process.nextTick : function (fn) {setTimeout(fn, 0);};

	/**
	 * Invokes the callbackFn once in the next turn of the JavaScript event loop. If the function
	 * requires a specific execution context or arguments, wrap it with Function.bind.
	 *
	 * I.async returns an object with a cancel method.  If the cancel method is
	 * called before the callback function, the callback function won't be called.
	 *
	 * @method async
	 * @param {Function} callbackFn
	 * @param [invokeAfterFn=true] {boolean} set to false to prevent the _afterSyncFn to be invoked
	 * @return {Object} An object with a cancel method.  If the cancel method is
	 * called before the callback function, the callback function won't be called.
	**/
	_async = function (callbackFn, invokeAfterFn) {
		console.log(NAME, 'async');
		var host = this || global,
			canceled;

		invokeAfterFn = (typeof invokeAfterFn === 'boolean') ? invokeAfterFn : true;
		(typeof callbackFn==='function') && _asynchronizer(function () {
			if (!canceled) {
	        	console.log(NAME, 'async is running its callbakcFn');
				callbackFn();
				// in case host._afterAsyncFn is defined: invoke it, to identify that later has been executed
				invokeAfterFn && host._afterAsyncFn && host._afterAsyncFn();
			}
		});

		return {
			cancel: function () {
				canceled = true;
			}
		};
	};

	/**
	 * Invokes the callbackFn once in the next turn of the JavaScript event loop. If the function
	 * requires a specific execution context or arguments, wrap it with Function.bind.
	 *
	 * I.async returns an object with a cancel method.  If the cancel method is
	 * called before the callback function, the callback function won't be called.
	 *
	 * @method async
	 * @param {Function} callbackFn
	 * @param [invokeAfterFn=true] {boolean} set to false to prevent the _afterSyncFn to be invoked
	 * @return {Object} An object with a cancel method.  If the cancel method is
	 * called before the callback function, the callback function won't be called.
	**/
	module.exports.async = _async;

	/**
	 * Invokes the callbackFn after a timeout (asynchronous). If the function
	 * requires a specific execution context or arguments, wrap it with Function.bind.
	 *
	 * To invoke the callback function periodic, set 'periodic' either 'true', or specify a second timeout.
	 * If number, then periodic is considered 'true' but with a perdiod defined by 'periodic',
	 * which means: the first timer executes after 'timeout' and next timers after 'period'.
	 *
	 * I.later returns an object with a cancel method.  If the cancel() method is
	 * called before the callback function, the callback function won't be called.
	 *
	 * @method later
	 * @param callbackFn {Function} the function to execute.
	 * @param [timeout] {Number} the number of milliseconds to wait until the callbackFn is executed.
	 * when not set, the callback function is invoked once in the next turn of the JavaScript event loop.
	 * @param [periodic] {boolean|Number} if true, executes continuously at supplied, if number, then periodic is considered 'true' but with a perdiod
	 * defined by 'periodic', which means: the first timer executes after 'timeout' and next timers after 'period'.
	 * The interval executes until canceled.
	 * @param [invokeAfterFn=true] {boolean} set to false to prevent the _afterSyncFn to be invoked
	 * @return {object} a timer object. Call the cancel() method on this object to stop the timer.
	*/
	module.exports.later = function (callbackFn, timeout, periodic, invokeAfterFn) {
		console.log(NAME, 'later --> timeout: '+timeout+'ms | periodic: '+periodic);
		var host = this || global,
			canceled = false;
		invokeAfterFn = (typeof invokeAfterFn === 'boolean') ? invokeAfterFn : true;
		if (!timeout) {
			return _async(callbackFn);
		}
		var interval = periodic,
			secondtimeout = (typeof interval==='number'),
			secondairId,
			wrapper = function() {
				// IE 8- and also nodejs may execute a callback, so in order to preserve
				// the cancel() === no more runny-run, we have to build in an extra conditional
				if (!canceled) {
	            	console.log(NAME, 'later is running its callbakcFn');
					callbackFn();
					secondtimeout && (secondairId=setInterval(wrapperInterval, interval));
					// in case host._afterAsyncFn is defined: invoke it, to identify that later has been executed
					invokeAfterFn && host._afterAsyncFn && host._afterAsyncFn();
					// break closure inside returned object:
					id = null;
				}
			},
			wrapperInterval = function() {
				// IE 8- and also nodejs may execute a setInterval callback one last time
				// after clearInterval was called, so in order to preserve
				// the cancel() === no more runny-run, we have to build in an extra conditional
				if (!canceled) {
	            	console.log(NAME, 'later is running its callbakcFn');
					callbackFn();
					// in case host._afterAsyncFn is defined: invoke it, to identify that later has been executed
					invokeAfterFn && host._afterAsyncFn && host._afterAsyncFn();
				}
			},
			id;
		(typeof callbackFn==='function') && (id=(interval && !secondtimeout) ? setInterval(wrapperInterval, timeout) : setTimeout(wrapper, timeout));

		return {
			cancel: function() {
				canceled = true;
				(interval && !secondtimeout) ? clearInterval(id) : clearTimeout(id);
				secondairId && clearInterval(secondairId);
				// break closure:
				id = null;
				secondairId = null;
			}
		};
	};

}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":58,"polyfill/polyfill-base.js":40}],45:[function(require,module,exports){
var css = ".itsa-notrans, .itsa-notrans2,\n.itsa-notrans:before, .itsa-notrans2:before,\n.itsa-notrans:after, .itsa-notrans2:after {\n    -webkit-transition: none !important;\n    -moz-transition: none !important;\n    -ms-transition: none !important;\n    -o-transition: all 0s !important; /* opera doesn't support none */\n    transition: none !important;\n}\n\n.itsa-no-overflow {\n    overflow: hidden !important;\n}\n\n.itsa-invisible {\n    position: absolute !important;\n}\n\n.itsa-invisible-relative {\n    position: relative !important;\n}\n\n.itsa-invisible,\n.itsa-invisible-relative {\n    visibility: hidden !important;\n    z-index: -1;\n}\n\n.itsa-invisible *,\n.itsa-invisible-relative * {\n    visibility: hidden !important;\n}\n\n.itsa-transparent {\n    opacity: 0;\n}\n\n.itsa-hidden {\n    visibility: hidden !important;\n    position: absolute !important;\n    left: -9999px !important;\n    top: -9999px !important;\n}\n\n.itsa-block {\n    display: block !important;\n}\n\n.itsa-borderbox {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}"; (require("/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify"))(css); module.exports = css;
},{"/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify":1}],46:[function(require,module,exports){
"use strict";

/**
 * Exports `htmlToVNodes` which transforms html-text into vnodes.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * <br>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module vdom
 * @submodule attribute-extractor
 * @since 0.0.1
*/

require('js-ext/lib/string.js');
require('js-ext/lib/object.js');

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.AttributeExtractor) {
        return window._ITSAmodules.AttributeExtractor; // AttributeExtractor was already created
    }

    var SUPPORT_INLINE_PSEUDO_STYLES = false, // current browsers don't support this. When tey do, set this value `true`
        END_OF_VALUE = {
            ';': true,
            '}': true
        },
        VENDOR_CSS = require('polyfill/extra/vendorCSS.js')(window),
        generateVendorCSSProp = VENDOR_CSS.generator,
        VENDOR_CSS_PROPERTIES = VENDOR_CSS.cssProps,
        VENDOR_TRANSITION_PROPERTY = require('polyfill/extra/transition.js')(window), // DO NOT use TRANSITION-variable here --> browserify cannot deal this
        _serializeTransition, _parseTransition, extractor;

    window.document._supportInlinePseudoStyles = SUPPORT_INLINE_PSEUDO_STYLES;

    _serializeTransition = function(transitionValue) {
        // transitionValue should an Object !!
        var serialized = '',
            timingFunction, delay;
        transitionValue.each(function(value, key) {
            timingFunction = value.timingFunction;
            delay = value.delay;
            serialized += ', ' + key;
            if (key!=='none') {
                serialized += ' ' + value.duration+'s';
                timingFunction && (serialized+=' ' + timingFunction);
                delay && (serialized+=' ' + delay+'s');
            }
        });
        return (serialized[0]===',') ? serialized.substr(2) : serialized;
    };

    _parseTransition = function(transitionValueSerialised) {
        var parsed = {},
            i, len, transitionItem, item, items, value, properties, item0, item1, item2, item3;
        if (transitionValueSerialised) {
            properties = transitionValueSerialised.split(',');
            len = properties.length;
            for (i=0; i<len; i++) {
                items = properties[i].trim();
                (items.indexOf('  ')!==-1) && items.replace(/'  '/g, ' ');
                item = items.split(' ');
                item0 = item[0];
                item1 = item[1];
                item2 = item[2];
                item3 = item[3];

                if (item0.parsable()) {
                    // no key, but starting with a duration
                    item3 = item2;
                    item2 = item1;
                    item1 = item0;
                    item0 = 'all';
                }

                transitionItem = {};
                (item0.toLowerCase()==='none') && (item0='none');
                if (item0!=='none') {
                    transitionItem.duration = parseFloat(item1) || 0;
/*jshint boss:true */
                    if (value=item2) {
/*jshint boss:false */
                        // check if it is a Function, or a delayvalue
                        if (value.parsable()) {
                            transitionItem.delay = parseFloat(value);
                        }
                        else {
                            transitionItem.timingFunction = value;
                            (value=item3) && (transitionItem.delay = parseFloat(value));
                        }
                    }
                }
                // allways transform the css-property into a vendor-safe property:
                VENDOR_CSS_PROPERTIES[item0] || (item0=generateVendorCSSProp(item0));
                parsed[item0] = transitionItem;
            }
        }
        return parsed;
    };

    extractor = window._ITSAmodules.AttributeExtractor = {
        extractClass: function(classes) {
            var attrClass = '',
                classNames = {},
                oneclass, len, i, character;
            if (classes) {
                oneclass = '';
                len = classes.length;
                for (i=0; i<len; i++) {
                    character = classes[i];
                    if (character===' ') {
                        if (oneclass!=='') {
                            classNames[oneclass] = true;
                            attrClass += ' '+oneclass;
                            oneclass = '';
                        }
                    }
                    else {
                        oneclass += character;
                    }
                }
                if (oneclass!=='') {
                    classNames[oneclass] = true;
                    attrClass += ' '+oneclass;
                }
            }
            return {
                attrClass: (attrClass==='') ? undefined : attrClass.substr(1),
                classNames: classNames
            };
        },

        extractStyle: function(styles) {
        /*  be aware you can encounter inline style like this:

            style="{color: blue; background: white}
            :visited {color: green}
            :hover {background: yellow}
            :visited:hover {color: purple}

            OR

            style="color: blue; background: white"


            Also, you might encounter inline transform, which should be separated itself:

            style="{color: blue; background: white; transform: translateX(10px) matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0) translateY(5px);}
            :visited {color: green}
            :hover {background: yellow; transform: translateX(10px) matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0) translateY(5px);}
            :visited:hover {color: purple}

            OR

            style="color: blue; background: white; transform: translateX(10px) matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0) translateY(5px);"

        */
            var newStyles = {},
                instance = this,
                i, onlyElement, len, character, groupKey, key, value, insideValue, insideKey, hasValue, group;
            if (styles) {
                i = -1;
                len = styles.length;

                // first eliminate leading spaces
    /*jshint noempty:true */
                while ((++i<len) && (character=styles[i]) && (character===' ')) {}
    /*jshint noempty:false */

                // preview next character
                character = styles[i];
                onlyElement = (character && (character!=='{') && (character!==':'));
                if (onlyElement) {
                    newStyles.element = {};
                    group = newStyles.element;
                    groupKey = 'element';
                    insideKey = true;
                }
                else {
                    groupKey = '';
                }

                // now process
                key = '';
                insideValue = false;
                i--;
                while ((++i<len) && (character=styles[i])) {
                    if (insideValue) {
                        hasValue = true;
                        if (END_OF_VALUE[character]) {
                            value = value.trim();
                            // in case `key` equals a variant of `transform`, but non-compatible with the current browser -->
                            // redefine it into a browser-compatible version:
                            VENDOR_CSS_PROPERTIES[key] || (key=generateVendorCSSProp(key));
                            // store the property:
                            if ((SUPPORT_INLINE_PSEUDO_STYLES || (groupKey==='element')) && (value.length>0)) {
                                group[key] = ((key===VENDOR_TRANSITION_PROPERTY) ? _parseTransition(value) : value);
                            }
                            key = '';
                            insideValue = false;
                            insideKey = (character===';');
                            insideKey || (groupKey='');
                        }
                        else {
                            value += character;
                        }
                    }
                    else if (insideKey) {
                        if (character===':'){
                            insideKey = false;
                            insideValue = true;
                            key = key.trim();
                            value = '';
                        }
                        else if (character==='}') {
                            insideKey = false;
                            groupKey = '';
                        }
                        else {
                            key += character;
                        }
                    }
                    else {
                        if (character==='{') {
                            groupKey = groupKey.trim();
                            (groupKey==='') && (groupKey='element');
                            group = newStyles[groupKey] = {};
                            insideKey = true;
                            key = '';
                        }
                        else {
                            groupKey += character;
                        }
                    }
                }
                if (insideValue) {
                    value = value.trim();
                    // in case `key` equals a variant of `transition`, but non-compatible with the current browser -->
                    // redefine it into a browser-compatible version:
                    VENDOR_CSS_PROPERTIES[key] || (key=generateVendorCSSProp(key));
                    // store the property:
                    if ((SUPPORT_INLINE_PSEUDO_STYLES || (groupKey==='element')) && (value.length>0)) {
                        group[key] = ((key===VENDOR_TRANSITION_PROPERTY) ? _parseTransition(value) : value);
                    }
                }
            }
            if (!SUPPORT_INLINE_PSEUDO_STYLES) {
                delete newStyles[':before'];
                delete newStyles[':after'];
            }
            return {
                attrStyle: hasValue && instance.serializeStyles(newStyles),
                styles: newStyles
            };
        },

        toTransitionObject: function(value) {
            return _parseTransition(value);
        },

        serializeTransition: function(value) {
            return _serializeTransition(value);
        },

        serializeStyles: function(styles) {
            var serialized = '',
                onlyElementStyle = ((styles.size()===1) && styles.element);
            if (onlyElementStyle || !SUPPORT_INLINE_PSEUDO_STYLES) {
                styles.element && styles.element.each(function(value, key) {
                    serialized += ' '+ key + ': ' + ((key===VENDOR_TRANSITION_PROPERTY) ? _serializeTransition(value) : value) + ';';
                });
            }
            else {
                styles.each(function(groupValue, groupKey) {
                    (groupKey==='element') || (serialized += ' '+groupKey+' ');
                    serialized += '{';
                    groupValue.each(function(value, key) {
                        serialized += key + ': ' + ((key===VENDOR_TRANSITION_PROPERTY) ? _serializeTransition(value) : value) + '; ';
                    });
                    serialized += '}';
                });
                (serialized==='{}') && (serialized='');
            }
            return (serialized[0]===' ') ? serialized.substr(1) : serialized;
        }
    };

    return extractor;

};
},{"js-ext/lib/object.js":32,"js-ext/lib/string.js":34,"polyfill/extra/transition.js":35,"polyfill/extra/vendorCSS.js":37}],47:[function(require,module,exports){
"use strict";

/**
 * Extends Array into an array with special utility-methods that can be applied upon its members.
 * The membres should be vElement's
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * <br>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module vdom
 * @submodule element-array
 * @class ElementArray
 * @since 0.0.1
*/

require('polyfill/polyfill-base.js');
require('js-ext/lib/object.js');

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.ElementArray) {
        return window._ITSAmodules.ElementArray; // ElementArray was already created
    }

    var forEach = function(list, method, args) {
            var len = list.length,
                i, element;
            for (i=0; i<len; i++) {
                element = list[i];
                element[method].apply(element, args);
            }
            return list;
        },
        NodeListPrototype = window.NodeList.prototype,
        HTMLCollectionPrototype = window.HTMLCollection.prototype,
        arrayMethods = Object.getOwnPropertyNames(Array.prototype),
        ElementArray,
        ElementArrayMethods = {
           /**
            * For all vElements of the ElementArray:
            * Appends a HtmlElement or text at the end of HtmlElement's innerHTML.
            *
            * @method append
            * @param content {HtmlElement|HtmlElementList|String} content to append
            * @param escape {Boolean} whether to insert `escaped` content, leading it into only text inserted
            * @chainable
            * @since 0.0.1
            */
            append: function(/* content, escape */) {
                return forEach(this, 'append', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Sets the inline-style of the HtmlElement exactly to the specified `value`, overruling previous values.
            * Making the HtmlElement's inline-style look like: style="value".
            *
            * This is meant for a quick one-time setup. For individually inline style-properties to be set, you can use `setInlineStyle()`.
            *
            * @method defineInlineStyle
            * @param value {String} the style string to be set
            * @chainable
            * @since 0.0.1
            */
            defineInlineStyle: function(/* value */) {
                return forEach(this, 'defineInlineStyle', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Checks whether the plugin is plugged in at ALL the HtmlElements of the NodeList/HTMLCollection.
            * Checks whether all its attributes are set.
            *
            * @method isPlugged
            * @param pluginClass {NodePlugin} The plugin that should be plugged. Needs to be the Class, not an instance!
            * @return {Boolean} whether the plugin is plugged in
            * @since 0.0.1
            */
            isPlugged: function(NodePluginClass) {
                return this.every(function(element) {
                    return element.isPlugged(NodePluginClass);
                });
            },

           /**
            * For all vElements of the ElementArray:
            * Plugs in the plugin on the HtmlElement, and gives is special behaviour by setting the appropriate attributes.
            *
            * @method plug
            * @param pluginClass {NodePlugin} The plugin that should be plugged. Needs to be the Class, not an instance!
            * @param options {Object} any options that should be passed through when the class is instantiated.
            * @chainable
            * @since 0.0.1
            */
            plug: function(/* NodePluginClass, options */) {
                return forEach(this, 'plug', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Prepends a HtmlElement or text at the start of HtmlElement's innerHTML.
            *
            * @method prepend
            * @param content {HtmlElement|HtmlElementList|String} content to prepend
            * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
            * @chainable
            * @since 0.0.1
            */
            prepend: function(/* content, escape */) {
                return forEach(this, 'prepend', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Removes the attribute from the HtmlElement.
            *
            * Alias for removeAttribute().
            *
            * @method removeAttr
            * @param attributeName {String}
            * @return {Boolean} Whether the HtmlElement has the attribute set.
            * @since 0.0.1
            */
            removeAttr: function(/* attributeName */) {
                return forEach(this, 'removeAttr', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Removes a className from the HtmlElement.
            *
            * @method removeClass
            * @param className {String} the className that should be removed.
            * @chainable
            * @since 0.0.1
            */
            removeClass: function(/* className */) {
                return forEach(this, 'removeClass', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Removes data specified by `key`. When no arguments are passed, all node-data (key-value pairs) will be removed.
            *
            * @method removeData
            * @param key {string} name of the key
            * @chainable
            * @since 0.0.1
            */
            removeData: function(/* key */) {
                return forEach(this, 'removeData', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Removes a css-property (inline) out of the HtmlElement. Use camelCase.
            *
            * @method removeInlineStyle
            * @param cssAttribute {String} the css-property to be removed
            * @chainable
            * @since 0.0.1
            */
            removeInlineStyle: function(/* cssAttribute */) {
                return forEach(this, 'removeInlineStyle', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Removes the HtmlElement from the DOM.
            *
            * @method removeNode
            * @since 0.0.1
            */
            removeNode: function() {
                var instance = this;
                forEach(this, 'remove');
                instance.length = 0;
                return instance;
            },

           /**
            * For all vElements of the ElementArray:
            * Replaces the className of the HtmlElement with a new className.
            * If the previous className is not available, the new className is set nevertheless.
            *
            * @method replaceClass
            * @param prevClassName {String} the className to be replaced
            * @param newClassName {String} the className to be set
            * @param [force ] {Boolean} whether the new className should be set, even is the previous className isn't there
            * @chainable
            * @since 0.0.1
            */
            replaceClass: function(/* prevClassName, newClassName, force */) {
                return forEach(this, 'replaceClass', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Replaces the HtmlElement with a new HtmlElement.
            *
            * @method replaceNode
            * @param newHtmlElement {HtmlElement|String} the new HtmlElement
            * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
            * @since 0.0.1
            */
            replaceNode: function(newHtmlElement, escape) {
                var instance = this,
                    len = instance.length,
                    i;
                for (i=len-1; i>=0; i--) {
                    instance[i] = instance[i].replace(newHtmlElement, escape);
                    // instance[i].replace(newHtmlElement, escape);
                }
                return instance;
            },

           /**
            * For all vElements of the ElementArray:
            * Sets the attribute on the HtmlElement with the specified value.
            *
            * Alias for setAttribute().
            *
            * @method setAttr
            * @param attributeName {String}
            * @param value {Any} the value that belongs to `key`
            * @chainable
            * @since 0.0.1
           */
            setAttr: function(/* attributeName, value */) {
                return forEach(this, 'setAttr', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Adds a class to the HtmlElement. If the class already exists it won't be duplicated.
            *
            * @method setClass
            * @param className {String} className to be added
            * @chainable
            * @since 0.0.1
            */
            setClass: function(/* className */) {
                return forEach(this, 'setClass', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Stores arbitary `data` at the HtmlElement. This has nothing to do with node-attributes whatsoever,
            * it is just a way to bind any data to the specific Element so it can be retrieved later on with `getData()`.
            *
            * @method setData
            * @param key {string} name of the key
            * @param value {Any} the value that belongs to `key`
            * @chainable
            * @since 0.0.1
           */
            setData: function(/* key, value */) {
                return forEach(this, 'setData', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Sets the content of the HtmlElement (innerHTML). Careful: only set content like this if you controll the data and
            * are sure what is going inside. Otherwise XSS might occur. If you let the user insert, or insert right from a db,
            * you might be better of using setContent().
            *
            * @method setHTML
            * @param content {HtmlElement|HtmlElementList|String} content to append
            * @chainable
            * @since 0.0.1
            */
            setHTML: function(/* content */) {
                return forEach(this, 'setHTML', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Sets a css-property (inline) out of the HtmlElement. Use camelCase.
            *
            * Note: no need to camelCase cssProperty: both `margin-left` as well as `marginLeft` are fine
            *
            * @method setStyle
            * @param cssAttribute {String} the css-property to be set
            * @param value {String} the css-value
            * @chainable
            * @since 0.0.1
            */
            setInlineStyle: function(/* cssAttribute, value */) {
                return forEach(this, 'setInlineStyle', arguments);
            },

            /**
            * For all vElements of the ElementArray:
             * Gets or sets the outerHTML of both the Element as well as the representing dom-node.
             * Goes through the vdom, so it's superfast.
             *
             * Use this property instead of `outerHTML`
             *
             * Syncs with the DOM.
             *
             * @method setOuterHTML
             * @param val {String} the new value to be set
             * @chainable
             * @since 0.0.1
             */
            setOuterHTML: function(/* content */) {
                return forEach(this, 'setOuterHTML', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Sets the content of the HtmlElement. This is a safe way to set the content, because HTML is not parsed.
            * If you do need to set HTML inside the node, use setHTML().
            *
            * @method setText
            * @param content {HtmlElement|HtmlElementList|String} content to append. In case of HTML, it will be escaped.
            * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
            * @chainable
            * @since 0.0.1
            */
            setText: function(/* content */) {
                return forEach(this, 'setText', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Toggles the className of the Element.
            *
            * @method toggleClass
            * @param className {String} the className that should be toggled
            * @chainable
            * @since 0.0.1
            */
            toggleClass: function(/* className */) {
                return forEach(this, 'toggleClass', arguments);
            },

           /**
            * For all vElements of the ElementArray:
            * Unplugs a NodePlugin from the HtmlElement.
            *
            * @method unplug
            * @param pluginClass {NodePlugin} The plugin that should be unplugged. Needs to be the Class, not an instance!
            * @chainable
            * @since 0.0.1
            */
            unplug: function(/* NodePluginClass */) {
                return forEach(this, 'unplug', arguments);
            }
        };


    // adding Array.prototype methods to NodeList.prototype
    // Note: this might be buggy in IE8 and below: https://developer.mozilla.org/en-US/docs/Web/API/NodeList#Workarounds
    arrayMethods.forEach(function(methodName) {
        try {
            NodeListPrototype[methodName] || (NodeListPrototype[methodName]=Array.prototype[methodName]);
            HTMLCollectionPrototype[methodName] || (HTMLCollectionPrototype[methodName]=Array.prototype[methodName]);
        }
        catch(err) {
            // some properties have only getters and cannot (and don't need) to be set
        }
    });

    NodeListPrototype.merge(ElementArrayMethods);
    HTMLCollectionPrototype.merge(ElementArrayMethods);

    ElementArray = window._ITSAmodules.ElementArray = {
        // unfortunatly, Object.create(Array.prototype) or Object.create([]) don't work as expected -->
        // the bracket-notation isn't fucntional anymore:
        // see http://www.bennadel.com/blog/2292-extending-javascript-arrays-while-keeping-native-bracket-notation-functionality.htm
        createArray: function() {
            var newArray = [];
            newArray.merge(ElementArrayMethods);
            return newArray;
        }
    };

    return ElementArray;
};
},{"js-ext/lib/object.js":32,"polyfill/polyfill-base.js":40}],48:[function(require,module,exports){
"use strict";

/**
 * Integrates DOM-events to event. more about DOM-events:
 * http://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 *
 * @module vdom
 * @submodule element-plugin
 * @class Plugins
 * @since 0.0.1
*/

require('js-ext/lib/object.js');
require('js-ext/lib/string.js');

var fromCamelCase = function(input) {
        return input.replace(/[a-z]([A-Z])/g, function(match, group) {
            return match[0]+'-'+group.toLowerCase();
        });
    };

module.exports = function (window) {

    window._ITSAmodules || window.protectedProp('_ITSAmodules', {});

    if (window._ITSAmodules.ElementPlugin) {
        return window._ITSAmodules.ElementPlugin; // ElementPlugin was already created
    }

    var nodePlugin, nodeConstrain, ElementPlugin;

    // also extend window.Element:
    window.Element && (function(ElementPrototype) {
       /**
        * Checks whether the plugin is plugged in at the HtmlElement. Checks whether all its attributes are set.
        *
        * @method isPlugged
        * @param pluginClass {NodePlugin} The plugin that should be plugged. Needs to be the Class, not an instance!
        * @return {Boolean} whether the plugin is plugged in
        * @since 0.0.1
        */
        ElementPrototype.isPlugged = function(nodePlugin) {
            return nodePlugin.validate(this);
        };

       /**
        * Plugs in the plugin on the HtmlElement, and gives is special behaviour by setting the appropriate attributes.
        *
        * @method plug
        * @param pluginClass {NodePlugin} The plugin that should be plugged. Needs to be the Class, not an instance!
        * @param config {Object} any config that should be passed through when the class is instantiated.
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.plug = function(nodePlugin, config) {
            nodePlugin.setup(this, config);
            return this;
        };

       /**
        * Unplugs a NodePlugin from the HtmlElement.
        *
        * @method unplug
        * @param pluginClass {NodePlugin} The plugin that should be unplugged. Needs to be the Class, not an instance!
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.unplug = function(nodePlugin) {
            nodePlugin.teardown(this);
            return this;
        };
    }(window.Element.prototype));

    nodePlugin = {
        setup: function (hostElement, config) {
            var instance = this,
                attrs = instance.defaults.shallowClone();
            attrs.merge(config, true);
            attrs.each(
                function(value, key) {
                    key = fromCamelCase(key);
                    value && hostElement.setAttr(instance.ns+'-'+key, value);
                }
            );
        } ,
        teardown: function (hostElement) {
            var instance = this,
                attrs = hostElement.vnode.attrs,
                ns = instance.ns+'-';
            attrs.each(
                function(value, key) {
                     key.startsWith(ns) && hostElement.removeAttr(key);
                }
            );
        },
        validate: function (hostElement) {
            var instance = this,
                attrs = hostElement.vnode.attrs,
                ns = instance.ns+'-';
            return attrs.some(
                function(value, key) {
                    return key.startsWith(ns);
                }
            );
        },
        definePlugin: function (ns, defaults) {
            var newPlugin = Object.create(nodePlugin);
            Object.isObject(defaults) || (defaults = {});
            (typeof ns==='string') || (ns = 'invalid_ns');
            ns = ns.replace(/ /g, '').replace(/-/g, '');
            newPlugin.protectedProp('ns', ns);
            newPlugin.defaults = defaults;
            return newPlugin;
        }
    };

    nodeConstrain = nodePlugin.definePlugin('constrain', {selector: 'window'});

    ElementPlugin = window._ITSAmodules.ElementPlugin = {
        nodePlugin: nodePlugin,
        nodeConstrain: nodeConstrain
    };

    return ElementPlugin;
};
},{"js-ext/lib/object.js":32,"js-ext/lib/string.js":34}],49:[function(require,module,exports){
"use strict";

/**
 * Provides several methods that override native document-methods to work with the vdom.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * <br>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module vdom
 * @submodule extend-document
 * @class document
 * @since 0.0.1
*/

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.ExtendDocument) {
        return; // ExtendDocument was already created
    }

    // prevent double definition:
    window._ITSAmodules.ExtendDocument = true;

    var NS = require('./vdom-ns.js')(window),
        nodeids = NS.nodeids,
        DOCUMENT = window.document;

    // Note: window.document has no prototype

    /**
     * Returns a newly created TreeWalker object.
     *
     * The TreeWalker is life presentation of the dom. It gets updated when the dom changes.
     *
     * @method createTreeWalker
     * @param root {Element} The root node at which to begin the NodeIterator's traversal.
     * @param [whatToShow] {Number} Filter specification constants from the NodeFilter DOM interface, indicating which nodes to iterate over.
     * You can use or sum one of the next properties:
     * <ul>
     *   <li>window.NodeFilter.SHOW_ELEMENT</li>
     *   <li>window.NodeFilter.SHOW_COMMENT</li>
     *   <li>window.NodeFilter.SHOW_TEXT</li>
     * </ul>
     * @param [filter] {NodeFilter|function} An object implementing the NodeFilter interface or a function. See https://developer.mozilla.org/en-US/docs/Web/API/NodeFilter
     * @return {TreeWalker}
     */
    DOCUMENT.createTreeWalker = function(root, whatToShow, filter) {
        return root.createTreeWalker(whatToShow, filter);
    };

    /**
     * Indicating whether an Element is inside the DOM.
     *
     * @method contains
     * @param otherElement {Element}
     * @return {Boolean} whether the Element is inside the dom.
     * @since 0.0.1
     */
    DOCUMENT.contains = function(otherElement) {
        return DOCUMENT.documentElement.contains(otherElement);
    };

    /**
     * Gets an ElementArray of Elements, specified by the css-selector.
     *
     * @method getAll
     * @param cssSelector {String} css-selector to match
     * @return {ElementArray} ElementArray of Elements that match the css-selector
     * @since 0.0.1
     */
    DOCUMENT.getAll = function(cssSelector) {
        return this.querySelectorAll(cssSelector);
    };

    /**
     * Gets one Element, specified by the css-selector. To retrieve a single element by id,
     * you need to prepend the id-name with a `#`. When multiple Element's match, the first is returned.
     *
     * @method getElement
     * @param cssSelector {String} css-selector to match
     * @return {Element|null} the Element that was search for
     * @since 0.0.1
     */
    DOCUMENT.getElement = function(cssSelector) {
        return ((cssSelector[0]==='#') && (cssSelector.indexOf(' ')===-1)) ? this.getElementById(cssSelector.substr(1)) : this.querySelector(cssSelector);
    };

    /**
     * Returns the Element matching the specified id.
     *
     * @method getElementById
     * @param id {String} id of the Element
     * @return {Element|null}
     *
     */
    DOCUMENT.getElementById = function(id) {
        return nodeids[id] || null; // force `null` instead of `undefined` to be compatible with native getElementById.
    };

    /**
     * Returns the first Element that matches the CSS-selectors. You can pass one, or multiple CSS-selectors. When passed multiple,
     * they need to be separated by a `comma`.
     *
     * @method querySelector
     * @param selectors {String} CSS-selector(s) that should match
     * @return {Element}
     */
    DOCUMENT.querySelector = function(selectors) {
        var docElement = DOCUMENT.documentElement;
        if (docElement.matchesSelector(selectors)) {
            return docElement;
        }
        return docElement.querySelector(selectors);
    };

    /**
     * Returns an ElementArray of all Elements that match the CSS-selectors. You can pass one, or multiple CSS-selectors. When passed multiple,
     * they need to be separated by a `comma`.
     *
     * querySelectorAll is a snapshot of the dom at the time this method was called. It is not updated when changes of the dom are made afterwards.
     *
     * @method querySelectorAll
     * @param selectors {String} CSS-selector(s) that should match
     * @return {ElementArray} non-life Array (snapshot) with Elements
     */
    DOCUMENT.querySelectorAll = function(selectors) {
        var docElement = DOCUMENT.documentElement,
            elements = docElement.querySelectorAll(selectors);
        docElement.matchesSelector(selectors) && elements.shift(docElement);
        return elements;
    };

    /**
     * Replaces the Element with a new Element.
     *
     * @method replace
     * @param newHtmlElement {Element|String} the new element
     * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only the element having a TextNode as a child.
     * @chainable
     * @since 0.0.1
     */
    DOCUMENT.replace = function(oldHtmlElement, newHtmlElement, escape) {
        return oldHtmlElement.replace(newHtmlElement, escape);
    };

   /**
    * Tests if an Element would be selected by the specified cssSelector.
    * Alias for `matchesSelector()`
    *
    * @method test
    * @param element {Element} The Element to test
    * @param cssSelector {String} the css-selector to test against
    * @return {Boolean} whether or not the node matches the selector
    * @since 0.0.1
    */
    DOCUMENT.test = function(element, cssSelector) {
        return element.matches(cssSelector);
    };

};

//--- declaration of properties ---------------------------

/**
 * Returns the currently focused element, that is, the element that will get keystroke events if the user types any.
 *
 * @property activeElement
 * @type Element
 * @readOnly
 */

/**
 * Returns an HTMLCollection with Elements of all of the `anchors` in the document that have a `name` specified (a[name]).
 * For reasons of backwards compatibility, the returned set of anchors only contains those anchors created with the `name` attribute.
 *
 * `anchors` is a life presentation of the dom. The returned HTMLCollection gets updated when the dom changes.
 *
 * @property anchors
 * @type HTMLCollection
 * @readOnly
 */

/**
 * Returns an HTMLCollection with Elements of all of the `applets` in the document.
 *
 * `applets` is a life presentation of the dom. The returned HTMLCollection gets updated when the dom changes.
 *
 * @property applets
 * @type HTMLCollection
 * @readOnly
 */

/**
 * Returns the `body` or `frameset` Element of the current document, or null if no such element exists.
 *
 * @property body
 * @type Element
 * @readOnly
 */

/**
 * Returns the `script`-Element whose script is currently being processed.
 *
 *
 * @property currentScript
 * @type Element
 * @readOnly
 */

/**
 * Returns the root-element (===`html`-Element) of the current document
 *
 * @property documentElement
 * @type Element
 * @readOnly
 */

/**
 * Returns an HTMLCollection with Elements of all of the `embed`-elements in the document.
 *
 * `embeds` is a life presentation of the dom. The returned HTMLCollection gets updated when the dom changes.
 *
 * @property embeds
 * @type HTMLCollection
 * @readOnly
 */

/**
 * Returns the firstChild element (===`html`-Element) of the current document
 *
 * @property firstChild
 * @type Element
 * @readOnly
 */

/**
 * Returns an HTMLCollection with Elements of all of the `form`-elements in the document.
 *
 * `forms` is a life presentation of the dom. The returned HTMLCollection gets updated when the dom changes.
 *
 * @property forms
 * @type HTMLCollection
 * @readOnly
 */

/**
 * Returns an HTMLCollection with Elements of all of the images in the document.
 *
 * `images` is a life presentation of the dom. The returned HTMLCollection gets updated when the dom changes.
 *
 * @property images
 * @type HTMLCollection
 * @readOnly
 */

/**
 * Returns the lastChild element (===`html`-Element) of the current document
 *
 * @property lastChild
 * @type Element
 * @readOnly
 */

/**
 * Returns an HTMLCollection with Elements of all of the  of all `area`-Elements and `a`-Elements in a document with a value for the href attribute.
 *
 * `links` is a life presentation of the dom. The returned HTMLCollection gets updated when the dom changes.
 *
 * @property links
 * @type HTMLCollection
 * @readOnly
 */

/**
 * Returns an HTMLCollection with Elements of all of the plugins (`object`- or `embed`-elements) in the document.
 *
 * `plugins` is a life presentation of the dom. The returned HTMLCollection gets updated when the dom changes.
 *
 * @property plugins
 * @type HTMLCollection
 * @readOnly
 */

/**
 * Returns an HTMLCollection with Elements of all of the script-elements in the document.
 *
 * `scripts` is a life presentation of the dom. The returned HTMLCollection gets updated when the dom changes.
 *
 * @property scripts
 * @type HTMLCollection
 * @readOnly
 */

/**
 * Returns an HTMLCollection with Elements of all of the style-elements in the document.
 *
 * `styleSheets` is a life presentation of the dom. The returned HTMLCollection gets updated when the dom changes.
 *
 * @property styleSheets
 * @type HTMLCollection
 * @readOnly
 */

/**
 * Gets or sets the `title` of the document. That is, the `title`-Element within the `head`-Element
 *
 * @property title
 * @type String
 */


//--- definition API of unmodified `document`-events ------

/**
* "online" event is fired on the <body> of each page when the browser switches between online and offline mode.
* The event is non-cancellable (you can't prevent the user from coming online, or going offline).
*
* @event online
*/

/**
* "offline" event is fired on the <body> of each page when the browser switches between online and offline mode.
* The event is non-cancellable (you can't prevent the user from coming online, or going offline).
*
* @event offline
*/

//--- definition API of unmodified `document`-methods ------

/**
 * Adopts a node from an external document. The node and its subtree is removed from the document it's in (if any),
 * and its ownerDocument is changed to the current document. The node can then be inserted into the current document.
 *
 * @method adoptNode
 * @param externalNode {Node} The node from another document to be adopted.
 * @return {Node} is the adopted node that can be used in the current document.
 * The new node's parentNode is null, since it has not yet been inserted into the document tree.
 */

/**
 * Adds a HtmlElement or DocumentFragment to the end of the `html`-element
 *
 * @method appendChild
 * @param element {Element|DocumentFragment} the item to be appended
 * @return {Element} the appended child.
 */

/**
 * Creates a new attribute-node, and returns it.
 *
 * @method createAttribute
 * @param name {String} The name of the attribute
 * @return {AttributeNode}
 */

/**
 * Creates a new Comment-node, and returns it.
 *
 * @method createComment
 * @param data {String} The data to be added to the Comment.
 * @return {CommentNode}
 */

/**
 * Creates a new HtmlElement, and returns it.
 *
 * Don't use qualified names (like "html:a") with this method.
 *
 * @method createElement
 * @param tagName {String}  is a string that specifies the type of element to be created.
 *        The nodeName of the created element is initialized with the value of tagName.
 * @return {HtmlElement}
 */

/**
 * Returns a new NodeIterator object.
 *
 * The NodeIterator is a snapshot of the dom at the time this method was called. It is not updated when changes of the dom are made afterwards.
 *
 * @method createNodeIterator
 * @param root {Element} The root node at which to begin the NodeIterator's traversal.
 * @param [whatToShow] {Number} Filter specification constants from the NodeFilter DOM interface, indicating which nodes to iterate over.
 * You can use or sum one of the next properties:
 * <ul>
 *   <li>window.NodeFilter.SHOW_ELEMENT</li>
 *   <li>window.NodeFilter.SHOW_COMMENT</li>
 *   <li>window.NodeFilter.SHOW_TEXT</li>
 * </ul>
 * @param [filter] {NodeFilter|function} An object implementing the NodeFilter interface or a function. See https://developer.mozilla.org/en-US/docs/Web/API/NodeFilter
 * @return {NodeIterator}
 */

/**
 * Returns a new Range object. See https://developer.mozilla.org/en-US/docs/Web/API/Range
 *
 * @method createRange
 * @return {Range}
 */

/**
 * Creates a new Text-node, and returns it.
 *
 * @method createTextNode
 * @param data {String} The data to be added to the Text-node.
 * @return {TextNode}
 */

/**
 * Returns the Element from the document whose `elementFromPoint`-method is being called which is the topmost
 * dom-Element which lies under the given point. To get a Element, specify the point via coordinates, in CSS pixels,
 * relative to the upper-left-most point in the window or frame containing the document.
 *
 * @method elementFromPoint
 * @param x {Number} x-coordinate to check, in CSS pixels relative to the upper-left corner of the document
 * @param y {Number} y-coordinate to check, in CSS pixels relative to the upper-left corner of the document
 * @return {Element} the matching Element
 */

/**
 * Enables the style sheets matching the specified name in the current style sheet set,
 * and disables all other style sheets (except those without a title, which are always enabled).
 *
 * @method enableStyleSheetsForSet
 * @param name {String} The name of the style sheets to enable. All style sheets with a title that match this name will be enabled,
 *        while all others that have a title will be disabled. Specify an empty string for the name parameter
 *        to disable all alternate and preferred style sheets (but not the persistent style sheets; that is, those with no title attribute).
 */

/**
 * Returns an ElementArray of all Elements that match their classes with the supplied `classNames` argument.
 * To match multiple different classes, separate them with a `comma`.
 *
 * getElementsByClassName is life presentation of the dom. The returned ElementArray gets updated when the dom changes.
 *
 * NOTE: it is highly recomended to use `document.getAll` because that method takes advantage of the vdom.
 *
 *
 * @method getElementsByClassName
 * @param classNames {String} the classes to search for
 * @return {ElementArray} life Array with Elements
 */

/**
 * Returns an ElementArray of all Elements that match their `name`-attribute with the supplied `name` argument.
 *
 * getElementsByName is life presentation of the dom. The returned ElementArray gets updated when the dom changes.
 *
 * NOTE: it is highly recomended to use `document.getAll` because that method takes advantage of the vdom.
 *
 * @method getElementsByName
 * @param name {String} the property of name-attribute to search for
 * @return {ElementArray} life Array with Elements
 */

/**
 * Returns an ElementArray of all Elements that match their `name`-attribute with the supplied `name` argument.
 *
 * getElementsByTagName is life presentation of the dom. The returned ElementArray gets updated when the dom changes.
 *
 * NOTE: it is highly recomended to use `document.getAll` because that method takes advantage of the vdom.
 *
 * @method getElementsByTagName
 * @param tagNames {String} the tags to search for
 * @return {ElementArray} life Array with Elements
 */

/**
 * Returns a selection object representing the range of text selected by the user.
 *
 * Is also available on the `window`-object.
 *
 * @method getSelection
 * @return {Selection} A Selection object. When cast to string, either by adding empty quotes "" or using .toString, this object is the text selected.
 */

/**
 * Returns a Boolean value indicating whether the document or any element inside the document has focus.
 *
 * @method hasFocus
 * @return {Boolean} whether the document or any element inside the document has focus.
 */

/**
 * Creates a copy of a node from an external document that can be inserted into the current document.
 *
 * @method importNode
 * @param externalNode {Node} The node from another document to be adopted.
 * @param deep {Boolean} Whether the descendants of the imported node need to be imported.
 * @return {Node} The new node that is imported into the document.
 * The new node's parentNode is null, since it has not yet been inserted into the document tree.
 */

/**
 * Inserts `newElement` before `referenceElement`.
 *
 * @method insertBefore
 * @param newElement {Element} The newElement to insert
 * @param referenceElement {Element} The Element before which newElement is inserted.
 * @return {Element} the Element being inserted (equals newElement)
 */

/**
 * Removes a child node from the DOM.
 *
 * @method removeChild
 * @param child {Element} the Element to be removed from the DOM
 * @return {Element} a reference to the removed child node
 */

/**
 * Replaces one child-element of its parent element with a new child-element.
 *
 * @method replaceChild
 * @param newChild {Element} the new element to replace oldChild. If it already exists in the DOM, it is first removed.
 * @param oldChild {Element} The existing child to be replaced.
 * @return {Element} is the replaced node. This is the same Element as oldChild.
 */

//--- definition API of unmodified `document`-properties ------

/**
 * Returns the character encoding of the current document.
 *
 * @property characterSet
 * @readOnly
 */

/**
 * Indicates whether the document is rendered in Quirks mode or Standards mode. Its value is either:
 * <ul>
 *     <li>`BackCompat` if the document is in quirks mode</li>
 *     <li>`CSS1Compat` if the document is in no-quirks (also known as `standards`) mode or limited-quirks (also known as `almost standards`) mode.</li>
 * </ul>
 *
 * @property compatMode
 * @readOnly
 */

/**
 * Returns the MIME type that the document is being rendered as.  This may come from HTTP headers or other sources of MIME information,
 * and might be affected by automatic type conversions performed by either the browser or extensions.
 *
 * @property contentType
 * @readOnly
 */

/**
 * Returns the Document Type Declaration (DTD) associated with current document. The returned object implements the DocumentType interface.
 * Use DOMImplementation.createDocumentType() to create a DocumentType.
 *
 * @property doctype
 * @readOnly
 */

/**
 * Returns string URI of the HTML document. Same as `document.URL`.
 *
 * Note: HTML documents have a document.URL property which returns the same value. Unlike URL, documentURI is available on all types of documents.
 *
 * @property documentURI
 * @type String
 * @readOnly
 */

/**
 * Controls whether the entire document is editable. Its value should be either "off" or "on".
 *
 * @property designMode
 * @type String
 * @default "off"
 */

/**
 * Gets the domain portion of the origin of the current document.
 *
 * Setter will fail, because the same origin policy needs to persist.
 *
 * @property domain
 * @type String
 * @readOnly
 */

/**
 * Returns a DOMImplementation object associated with the current document.
 *
 * @property implementation
 * @type DOMImplementation
 * @readOnly
 */

/**
 * Returns a string containing the date and time on which the current document was last modified.
 * If you want a Date-object, you need to transform lastModified into a Date object: `modifyDate = new Date(document.lastModified);`
 *
 * @property lastModified
 * @type String
 * @readOnly
 */

/**
 * Returns the last enabled style sheet set; this property's value changes whenever the document.selectedStyleSheetSet property is changed.
 *
 * @property lastStyleSheetSet
 * @type String
 * @readOnly
 */

/**
 * returns a Location object, which contains information about the URL of the document and provides methods for changing that URL and loading another URL.
 *
 * Though Document.location is a read-only Location object, you can also assign a DOMString to it. This means that you can work with document.location
 * as if it were a string in most cases: document.location = 'http://www.example.com' is a synonym of document.location.href = 'http://www.example.com'.
 *
 * To retrieve just the URL as a string, the read-only document.URL property can also be used.
 *
 * See more about the `Location` object: https://developer.mozilla.org/en-US/docs/Web/API/Location
 *
 * @property location
 * @type Location
 * @readOnly
 */

/**
 * Returns the preferred style sheet set as set by the page author. This is determined from the order of style sheet declarations and the Default-Style HTTP header.
 *
 * @property preferredStyleSheetSet
 * @type String
 */

/**
 * Returns "loading" while the document is loading, "interactive" once it is finished parsing but still loading sub-resources,
 * and "complete" once it has loaded.
 *
 * @property readyState
 * @type String
 * @readOnly
 */

/**
 * Returns the URI of the page that linked to this page.
 *
 * @property referrer
 * @type String
 * @readOnly
 */

/**
 * Indicates the name of the style sheet set that's currently in use. See more about Stylesheets: https://developer.mozilla.org/en-US/docs/Web/API/Stylesheet
 * Setting the value of this property is equivalent to calling document.enableStyleSheetsForSet() with the value of currentStyleSheetSet,
 * then setting the value of lastStyleSheetSet to that value as well.
 *
 * @property selectedStyleSheetSet
 * @type String
 */

/**
 * Returns string URL of the HTML document. Same as `document.documentURI`
 *
 * Note: HTML documents have a document.URL property which returns the same value. Unlike URL, documentURI is available on all types of documents.
 *
 * @property URL
 * @type String
 * @readOnly
 */



},{"./vdom-ns.js":53}],50:[function(require,module,exports){
(function (global){
"use strict";

/**
 * Provides several methods that override native Element-methods to work with the vdom.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * <br>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module vdom
 * @submodule extend-element
 * @class Element
 * @since 0.0.1
*/


require('../css/element.css');
require('js-ext/lib/object.js');
require('js-ext/lib/string.js');
require('js-ext/lib/promise.js');
require('polyfill');

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.ExtendElement) {
        return; // ExtendElement was already created
    }

    // prevent double definition:
    window._ITSAmodules.ExtendElement = true;

    var NAME = '[extend-element]: ',
        ElementArray = require('./element-array.js')(window),
        domNodeToVNode = require('./node-parser.js')(window),
        htmlToVNodes = require('./html-parser.js')(window),
        vNodeProto = require('./vnode.js')(window),
        NS = require('./vdom-ns.js')(window),
        RUNNING_ON_NODE = (typeof global !== 'undefined') && (global.window!==window),
        TRANSITION = 'transition',
        TRANSFORM = 'transform',
        BROWSERS_SUPPORT_PSEUDO_TRANS = false, // set true as soon as they do
        SUPPORTS_PSEUDO_TRANS = null, // is a life check --> is irrelevant as long BROWSERS_SUPPORT_PSEUDO_TRANS === false
        VENDOR_CSS = require('polyfill/extra/vendorCSS.js')(window),
        generateVendorCSSProp = VENDOR_CSS.generator,
        VENDOR_CSS_PROPERTIES = VENDOR_CSS.cssProps,
        VENDOR_TRANSFORM_PROPERTY = generateVendorCSSProp(TRANSFORM),
        VENDOR_TRANSITION_PROPERTY = require('polyfill/extra/transition.js')(window), // DO NOT use TRANSITION-variable here --> browserify cannot deal this
        EV_TRANSITION_END = require('polyfill/extra/transitionend.js')(window),
        _BEFORE = ':before',
        _AFTER = ':before',
        extractor = require('./attribute-extractor.js')(window),
        UTILS = require('utils'),
        later = UTILS.later,
        async = UTILS.async,
        idGenerator = UTILS.idGenerator,
        DOCUMENT = window.document,
        nodeids = NS.nodeids,
        arrayIndexOf = Array.prototype.indexOf,
        POSITION = 'position',
        ITSA_ = 'itsa-',
        BLOCK = ITSA_+'block',
        BORDERBOX = ITSA_+'borderbox',
        NO_TRANS = ITSA_+'notrans',
        NO_TRANS2 = NO_TRANS+'2', // needed to prevent removal of NO_TRANS when still needed `notrans`
        INVISIBLE = ITSA_+'invisible',
        INVISIBLE_RELATIVE = INVISIBLE+'-relative',
        HIDDEN = ITSA_+'hidden',
        REGEXP_NODE_ID = /^#\S+$/,
        LEFT = 'left',
        TOP = 'top',
        BORDER = 'border',
        WIDTH = 'width',
        HEIGHT = 'height',
        STRING = 'string',
        CLASS = 'class',
        STYLE = 'style',
        OVERFLOW = 'overflow',
        SCROLL = 'scroll',
        BORDER_LEFT_WIDTH = BORDER+'-left-'+WIDTH,
        BORDER_RIGHT_WIDTH = BORDER+'-right-'+WIDTH,
        BORDER_TOP_WIDTH = BORDER+'-top-'+WIDTH,
        BORDER_BOTTOM_WIDTH = BORDER+'-bottom-'+WIDTH,
        NUMBER = 'number',
        PX = 'px',
        SET = 'set',
        TOGGLE = 'toggle',
        REPLACE = 'replace',
        REMOVE = 'remove',
        _STARTSTYLE = '_startStyle',
        setupObserver,
        SIBLING_MATCH_CHARACTER = {
            '+': true,
            '~': true
        },
        NON_CLONABLE_STYLES = {
            absolute: true,
            hidden: true,
            block: true
        },
        CSS_PROPS_TO_CALCULATE = { // http://www.w3.org/TR/css3-transitions/#animatable-css
            backgroundColor: true,
            backgroundPositionX: true,
            backgroundPositionY: true,
            borderBottomColor: true,
            borderBottomWidth: true,
            borderLeftColor: true,
            borderLeftWidth: true,
            borderRightColor: true,
            borderRightWidth: true,
            borderTopColor: true,
            borderTopWidth: true,
            borderSpacing: true,
            bottom: true,
            clip: true,
            color: true,
            fontSize: true,
            fontWeight: true,
            height: true,
            left: true,
            letterSpacing: true,
            lineHeight: true,
            marginBottom: true,
            marginTop: true,
            marginLeft: true,
            marginRight: true,
            maxHeight: true,
            maxWidth: true,
            minHeight: true,
            minWidth: true,
            opacity: true,
            outlineColor: true,
            outlineWidth: true,
            paddingBottom: true,
            paddingTop: true,
            paddingLeft: true,
            paddingRight: true,
            right: true,
            textIndent: true,
            textShadow: true,
            verticalAlign: true,
            // visibility: true,  DO NOT use visibility!
            width: true,
            wordSpacing: true,
            zIndex: true
        },
        // CSS_PROPS_TO_CALCULATE.transform is set later on by the vendor specific transform-property
        htmlToVFragments = function(html) {
            var vnodes = htmlToVNodes(html, vNodeProto),
                len = vnodes.length,
                vnode, i, bkpAttrs, bkpVChildNodes;
            for (i=0; i<len; i++) {
                vnode = vnodes[i];
                if (vnode.nodeType===1) {
                    // same tag --> only update what is needed
                    bkpAttrs = vnode.attrs;
                    bkpVChildNodes = vnode.vChildNodes;

                    // reset, to force creation of inner domNodes:
                    vnode.attrs = {};
                    vnode.vChildNodes = [];

                    // next: sync the vnodes:
                    vnode._setAttrs(bkpAttrs);
                    vnode._setChildNodes(bkpVChildNodes);
                }
                else {
                    vnode.domNode.nodeValue = vnode.text;
                }
            }
            return {
                isFragment: true,
                vnodes: vnodes
            };
        },
        toCamelCase = function(input) {
            input || (input='');
            return input.replace(/-(.)/g, function(match, group) {
                return group.toUpperCase();
            });
        },
        fromCamelCase = function(input) {
            input || (input='');
            return input.replace(/[a-z]([A-Z])/g, function(match, group) {
                return match[0]+'-'+group.toLowerCase();
            });
        },
        getVendorCSS = function(cssProperties) {
            var uniqueProps = {},
                i, len, prop, safeProperty, uniqueSafeProperty;
            len = cssProperties.length;
            for (i=len-1; i>=0; i--) {
                // set the right property, but also dedupe when there are multiple same vendor-properties
                prop = cssProperties[i];
                safeProperty = prop.property;
                if (safeProperty) {
                    safeProperty = fromCamelCase(safeProperty);
                    uniqueSafeProperty = safeProperty+'#'+prop.pseudo;
                    VENDOR_CSS_PROPERTIES[safeProperty] || (safeProperty=generateVendorCSSProp(safeProperty));
                    if (uniqueProps[uniqueSafeProperty]) {
                        cssProperties.splice(i, 1);
                    }
                    else {
                        uniqueProps[uniqueSafeProperty] = true;
                        prop.property = safeProperty;
                    }
                }
            }
            return cssProperties;
        },
        vendorSupportsPseudoTrans = function() {
            // DO NOT CHANGE THIS FUNCTION!
            // it does exactly what it should do:
            // Sarari seems to support speudo transmisions, however it calculates css-properties wrong when they are 'undefined'
            // within a specific node, while the 'non-pseudo' is defined.
            // This would lead into a wrong calculation (too many) of the number of expected transitionend-events
            // Thus, this feature is disabled in some specific browsers
            if (SUPPORTS_PSEUDO_TRANS) {
                return SUPPORTS_PSEUDO_TRANS;
            }
            var cssnode, node, nodeParent;
            DOCUMENT.body.prepend('<style id="vendorSupportsPseudoTrans_css" type="text/css">#vendorSupportsPseudoTransParent {background-color:#F00;} #vendorSupportsPseudoTrans {background-color:#00F;}</style>');
            DOCUMENT.body.prepend('<div id="vendorSupportsPseudoTransParent"><div id="vendorSupportsPseudoTrans"></div></div>');
            node = DOCUMENT.getElement('#vendorSupportsPseudoTrans');
            nodeParent = DOCUMENT.getElement('#vendorSupportsPseudoTransParent');
            cssnode = DOCUMENT.getElement('#vendorSupportsPseudoTrans_css');
            SUPPORTS_PSEUDO_TRANS = node.getStyle('background-color')!==node.getStyle('background-color', ':before');
            cssnode.remove();
            nodeParent.remove();
            return SUPPORTS_PSEUDO_TRANS;
        },
        getTransPromise = function(node, hasTransitionedStyle, removalPromise, afterTransEventsNeeded, transitionProperties, maxtranstime) {
            var promise, fallback;
            afterTransEventsNeeded || (afterTransEventsNeeded=1);
            if (hasTransitionedStyle) {
                promise = new window.Promise(function(fulfill) {
                    var afterTrans = function(e) {
                        var finishedProperty = e.propertyName,
                            index;
                        if (finishedProperty) {
                            // some browsers support this feature: now we can exactly determine what promise to fulfill
                            delete transitionProperties[finishedProperty];
                            // in case of shorthand properties (such as padding) allmost all browsers
                            // fire multiple detailed events (http://www.smashingmagazine.com/2013/04/26/css3-transitions-thank-god-specification/).
                            // therefore, we also must delete the shortcut property when a detailed property gets fired:
                            index = finishedProperty.indexOf('-');
                            if (index!==-1) {
                                finishedProperty = finishedProperty.substr(0, index);
                                delete transitionProperties[finishedProperty];
                            }
                            // now fulfill when empty:
                            if (transitionProperties.isEmpty()) {
                                fallback.cancel();
                                console.log('Transition fulfilled');
                                node.removeEventListener(EV_TRANSITION_END, afterTrans, true);
                                fulfill();
                            }
                        }
                        else {
                            // in cae the browser doesn't support e.propertyName, we need to countdown:
                            if (--afterTransEventsNeeded<=0) {
                                fallback.cancel();
                                node.removeEventListener(EV_TRANSITION_END, afterTrans, true);
                                console.log('Transition fulfilled by counting nr. of endTransition events');
                                fulfill();
                            }
                        }
                    };
                    if (EV_TRANSITION_END===undefined) {
                        // no transition supported
                        console.log('No endTransition events supported: transition fulfilled');
                        fulfill();
                    }
                    else {
                        node.addEventListener(EV_TRANSITION_END, afterTrans, true);
                        fallback = later(function(){
                            console.log('Transition fulfilled by timer');
                            fulfill();
                        }, maxtranstime*1000+50); // extra 50 ms, after all, it is a fallback, we don't want it to take over the original end-transition-events
                    }
                });
                removalPromise && (promise=window.Promise.finishAll([promise, removalPromise]));
            }
            else {
                promise = removalPromise || window.Promise.resolve();
            }
            return promise;
        },
        getClassTransPromise = function(node, method, className, extraData1, extraData2) {
            // first. check if the final node has a transitioned property.
            // If not, then return as fulfilled. If so, then check for all the transitioned properties,
            // if there is any who changes its calculated value. If not, then return as fulfilled. If so, then setup
            // the evenlistener
            var resolvedPromise = window.Promise.resolve(),
                currentInlineCSS = [],
                finalInlineCSS = [],
                finalNode, getsTransitioned, originalCSS, finalCSS, transPropertiesElement, transPropertiesBefore, transPropertiesAfter, bkpFreezedData1, endIntermediate,
                promise, finalCSS_before, finalCSS_after, transpromise, manipulated, getCurrentProperties, currentProperties, bkpNodeData, bkpFreezed, cleanup,
                originalCSS_before, originalCSS_after, searchTrans, generateInlineCSS, finalStyle, unFreeze, freezedExtraData1, startStyle, unfreezePromise,
                transprops, transpropsBefore, transpropsAfter, time1, time2;

            time1 = Date.now();
            bkpNodeData = idGenerator('bkpNode');
            bkpFreezed = idGenerator('bkpFreezed');
            bkpFreezedData1 = idGenerator('bkpFreezedData1');
            if ((method===TOGGLE) && !extraData1) {
                // because -when toggling- the future current node-class might have been changed:
                freezedExtraData1 = !node.hasClass(className);
            }
            unFreeze = function(options) {
                var bkpFreezedStyle = node.getData(bkpFreezed),
                    bkpFreezedData1 = node.getData(bkpFreezedData1),
                    finish = options && options.finish,
                    cancel = options && options.cancel,
                    transitioned = !finish;
                if (bkpFreezedStyle!==undefined) {
                    if (finish || cancel) {
                        node.setClass(NO_TRANS2);
                    }
                    else {
                        node.setData(_STARTSTYLE, bkpFreezedStyle);
                    }
                    if (!cancel) {
                        switch(method) {
                            case SET:
                                unfreezePromise = node.setClass(className, transitioned);
                            break;
                            case REPLACE:
                                unfreezePromise = node.replaceClass(extraData1, className, extraData2, transitioned);
                            break;
                            case REMOVE:
                                unfreezePromise = node.removeClass(className, transitioned);
                            break;
                            case TOGGLE:
                                unfreezePromise = node.toggleClass(className, (bkpFreezedData1===undefined) ? extraData1 : bkpFreezedData1, transitioned);
                            break;
                        }
                    }
                    else {
                        unfreezePromise = resolvedPromise;
                    }
                    async(function() {
                        node.removeData(bkpFreezed);
                        node.removeData(bkpFreezedData1);
                    });
                    if (finish || cancel) {
                        finalStyle = finalNode.getAttr(STYLE);
                        node.setAttr(STYLE, finalStyle);
                        later(function() { // not just async --> it seems we need more time
                            node.removeClass(NO_TRANS2);
                        }, 50);
                        unfreezePromise = resolvedPromise;
                    }
                    return unfreezePromise;
                }
                return promise;
            };

            resolvedPromise.cancel = function() { /* NOOP for compatibility */ };
            resolvedPromise.freeze = function() { return window.Promise.resolve(0); /* compatibility */ };
            resolvedPromise.unfreeze = unFreeze;
            resolvedPromise.finish = function() { /* NOOP for compatibility */ };
            if (EV_TRANSITION_END===undefined) {
                return resolvedPromise;
            }
            cleanup = function() {
                // we manipulate the classes as they should be, before returning the original inline style:
                // all without Promise-return!
                if (!promise.cancelled && !promise.frozen) {
                    switch(method) {
                        case SET:
                            node.setClass(className);
                        break;
                        case REPLACE:
                            node.replaceClass(extraData1, className, extraData2);
                        break;
                        case REMOVE:
                            node.removeClass(className);
                        break;
                        case TOGGLE:
                            node.toggleClass(className, extraData1);
                        break;
                    }
                }
                // last transitionrun: reset the inline css:
                finalStyle = finalNode.getAttr(STYLE);
                if (!promise.frozen) {
                    node.removeData(bkpFreezed);
                    node.removeData(bkpFreezedData1);
                    node.setClass(NO_TRANS2);
                    node.setAttr(STYLE, finalStyle);
                }
                else {
                    node.setData(bkpFreezed, finalStyle);
                }
                node.removeData(bkpNodeData);
                finalNode.remove();
                async(function() {
                    node.removeClass(NO_TRANS2);
                    promise.fulfill();
                });
            };
            endIntermediate = function(type) {
                if (!promise.isFulfilled) {
                    manipulated = true;
                    node.setData(bkpFreezedData1, freezedExtraData1);
                    currentProperties = getCurrentProperties(node, transprops);
                    node.setClass(NO_TRANS2);
                    node.setInlineStyles(currentProperties, false, true);
                    if (BROWSERS_SUPPORT_PSEUDO_TRANS) {
                        node.setInlineStyles(getCurrentProperties(node, transpropsBefore, ':before'), false, true);
                        node.setInlineStyles(getCurrentProperties(node, transpropsAfter, ':after'), false, true);
                    }
                    // also force to set the style on the node outside the vdom --> by forcing this
                    // we won't run into the situation where the vdom doesn't change the dom because the style didn';'t change:
                    node._setAttribute(STYLE, node.getAttr(STYLE));
                    Object.defineProperty(promise, 'isFulfilled', {
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: true
                    });
                    Object.defineProperty(promise, type, {
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: true
                    });
                    if (transpromise) {
                        transpromise.reject(); // prevent transitionpromise to set its own final values after finishing
                    }
                    else {
                        // in case `transpromise` wasn't setup yet:
                        async(function() {
                            transpromise.reject(); // prevent transitionpromise to set its own final values after finishing
                        });
                    }
                }
                time2 || (time2=Date.now());
                return new window.Promise(function(resolve) {
                    async(function() {
                        resolve(time2-time1);
                    });
                });
            };
            searchTrans = function(CSS1, CSS2, transProperties) {
                var allTrans = !!transProperties.all,
                    searchObject = allTrans ? CSS_PROPS_TO_CALCULATE : transProperties,
                    transprops = {};

                searchObject.each(function(transProp, key) {
                    // transProp will always be a vendor-specific property already
                    key = toCamelCase(key);
                    if (CSS1[key]!==CSS2[key]) {
                        transprops[key] = true;
                    }
                });
                return (transprops.size()>0) ? transprops : null;
            };
            generateInlineCSS = function(group, transProperties, CSS1, CSS2) {
                transProperties.each(function(value, key) {
                    var prop1 = {property: key, value: CSS1[key]},
                        prop2 = {property: key, value: CSS2[key]};
                    if (group) {
                        prop1.pseudo = group;
                        prop2.pseudo = group;
                    }
                    currentInlineCSS[currentInlineCSS.length] = prop1;
                    finalInlineCSS[finalInlineCSS.length] = prop2;
                });
            };

            getCurrentProperties = function(node, transProperties, group) {
                var props = [],
                    styles = window.getComputedStyle(node, group);
                transProperties.each(function(value, property) {
                    // if property is vendor-specific transition, or transform, than we reset it to the current vendor
                    props.push({
                        property: property,
                        value: styles[toCamelCase(property)],
                        pseudo: group
                    });
                });
                return props;
            };

            finalNode = node.cloneNode(true);
            finalNode.setClass(NO_TRANS2);
            finalNode.setClass(INVISIBLE);
            node.setData(bkpNodeData, finalNode);

            startStyle = node.getData(_STARTSTYLE);
            if (startStyle!==undefined) {
                finalNode.setAttr(STYLE, startStyle);
                node.removeData(_STARTSTYLE);
            }

            switch(method) {
                case SET:
                    finalNode.setClass(className);
                break;
                case REPLACE:
                    finalNode.replaceClass(extraData1, className, extraData2);
                break;
                case REMOVE:
                    finalNode.removeClass(className);
                break;
                case TOGGLE:
                    finalNode.toggleClass(className, extraData1);
                break;
            }
            // insert in the dom, to make its style calculatable:
            DOCUMENT.body.append(finalNode);

            // check the css-property `transition`
            finalNode.removeClass(NO_TRANS2);
            transPropertiesElement = finalNode.getStyle(TRANSITION);
            transPropertiesBefore = finalNode.getStyle(TRANSITION, _BEFORE);
            transPropertiesAfter = finalNode.getStyle(TRANSITION, _AFTER);
            finalNode.setClass(NO_TRANS2);
            getsTransitioned = false;
            if (!RUNNING_ON_NODE && ((transPropertiesElement.size()>0) || (transPropertiesBefore.size()>0) || (transPropertiesAfter.size()>0))) {
                // when code comes here, there are one or more properties that can be transitioned
                // check if their values differ from the original node
                originalCSS = window.getComputedStyle(node);
                originalCSS_before = window.getComputedStyle(node, _BEFORE);
                originalCSS_after = window.getComputedStyle(node, _AFTER);
                finalCSS = window.getComputedStyle(finalNode);
                finalCSS_before = window.getComputedStyle(finalNode, _BEFORE);
                finalCSS_after = window.getComputedStyle(finalNode, _AFTER);
/*jshint boss:true */
                if (transprops=searchTrans(originalCSS, finalCSS, transPropertiesElement)) {
/*jshint boss:false */
                    getsTransitioned = true;
                    generateInlineCSS(null, transprops, originalCSS, finalCSS);
                }
                if (BROWSERS_SUPPORT_PSEUDO_TRANS && vendorSupportsPseudoTrans()) {
/*jshint boss:true */
                    if (transpropsBefore=searchTrans(originalCSS_before, finalCSS_before, transPropertiesBefore)) {
/*jshint boss:false */
                        getsTransitioned = true;
                        generateInlineCSS(_BEFORE, transpropsBefore, originalCSS_before, finalCSS_before);
                    }
/*jshint boss:true */
                    if (transpropsAfter=searchTrans(originalCSS_after, finalCSS_after, transPropertiesAfter)) {
/*jshint boss:false */
                        getsTransitioned = true;
                        generateInlineCSS(_AFTER, transpropsAfter, originalCSS_after, finalCSS_after);
                    }
                }
            }
            if (getsTransitioned) {
                // to force the transitioned items to work, we will set their calculated inline values for both at the start as well
                // as on the end of the transition.
                // set the original css inline:
                promise = window.Promise.manage();
                promise.finally(function() {
                    time2 || (time2=Date.now());
                });
                node.setClass(NO_TRANS2);
                node.setInlineStyles(currentInlineCSS, false, true);
                async(function() {
                    if (!manipulated) {
                        node.removeClass(NO_TRANS2);
                        transpromise = node.setInlineStyles(finalInlineCSS, true, true);
                        transpromise.finally(function() {
                            // async `setAttr` --> only fulfill when the DOM has been updated
                            async(function() {
                                cleanup();
                            });
                        });
                    }
                });

                promise.cancel = function() {
                    return endIntermediate('cancelled');
                };

                promise.freeze = function() {
                    return endIntermediate('frozen');
                };

                promise.finish = function() {
                    return endIntermediate('finished');
                };

                promise.unfreeze = unFreeze;

                return promise;
            }
            else {
                switch(method) {
                    case SET:
                        node.setClass(className);
                    break;
                    case REPLACE:
                        node.replaceClass(extraData1, className, extraData2);
                    break;
                    case REMOVE:
                        node.removeClass(className);
                    break;
                    case TOGGLE:
                        node.toggleClass(className, extraData1);
                    break;
                }
                node.removeData(bkpNodeData);
                finalNode.remove();
            }

            return resolvedPromise;
        },
        classListProto = {
            add: function(className) {
                // we do not use the property className, but setAttribute, because setAttribute can be hacked by other modules like `vdom`
                // note: `this` is the returned object which is NOT the Elementinstance
                var thisobject = this,
                    element = thisobject.element,
                    doSet = function(cl) {
                        var clName = element.vnode.attrs[CLASS] || '';
                        // we do not use the property className, but setAttribute, because setAttribute can be hacked by other modules like `vdom`
                        thisobject.contains(cl) || (element.setAttribute(CLASS, clName+((clName.length>0) ? ' ' : '') + cl));
                    };
                if (typeof className === STRING) {
                    doSet(className);
                }
                else if (Array.isArray(className)) {
                    className.forEach(doSet);
                }
            },
            remove: function(className) {
                var element = this.element,
                    doRemove = function(cl) {
                        var clName = element.vnode.attrs[CLASS] || '',
                            regexp = new RegExp('(?:^|\\s+)' + cl + '(?:\\s+|$)', 'g');
                        // we do not use the property className, but setAttribute, because setAttribute can be hacked by other modules like `vdom`
                        // note: `this` is the returned object which is NOT the Elementinstance
                        element.setAttribute(CLASS, clName.replace(regexp, ' ').trim());
                    };
                if (typeof className === STRING) {
                    doRemove(className);
                }
                else if (Array.isArray(className)) {
                    className.forEach(doRemove);
                }
                (element.vnode.attrs[CLASS]==='') && element.removeAttr(CLASS);
            },
            toggle: function(className, forceState) {
                // we do not use the property className, but setAttribute, because setAttribute can be hacked by other modules like `vdom`
                // note: `this` is the returned object which is NOT the Elementinstance
                var thisobject = this,
                    doToggle = function(cl) {
                        if (typeof forceState === 'boolean') {
                            forceState ? thisobject.add(cl) : thisobject.remove(cl);
                        }
                        else {
                            thisobject.contains(cl) ? thisobject.remove(cl) : thisobject.add(cl);
                        }
                    };
                if (typeof className === STRING) {
                    doToggle(className);
                }
                else if (Array.isArray(className)) {
                    className.forEach(doToggle);
                }
            },
            contains: function(className) {
                // we do not use the property className, but setAttribute, because setAttribute can be hacked by other modules like `vdom`
                // note: `this` is the returned object which is NOT the Elementinstance.
                // May be an Array of classNames, which all needs to be present.
                return this.element.vnode.hasClass(className);
            },
            item: function(index) {
                var items = this.element.vnode.attrs['class'].split(' ');
                return items[index];
            },
            _init: function(element) {
                this.element = element;
            }
        },
        treeWalkerProto = {
            _init: function(element, whatToShow, filter) {
                var instance = this;
                if (typeof filter !== 'function') {
                    // check if it is a NodeFilter-object
                    filter && filter.acceptNode && (filter=filter.acceptNode);
                }
                (typeof filter==='function') || (filter=null);
                instance.vNodePointer = element.vnode;
                instance._root = element;
                whatToShow || (whatToShow=-1); // -1 equals NodeFilter.SHOW_ALL
                (whatToShow===-1) && (whatToShow=133);
                instance._whatToShow = whatToShow; // making it accessable for the getter `whatToShow`
                instance._filter = filter; // making it accessable for the getter `filter`
            },
            _match: function(vnode, forcedVisible) {
                var whatToShow = this._whatToShow,
                    filter = this._filter,
                    showElement = ((whatToShow & 1)!==0),
                    showComment = ((whatToShow & 128)!==0),
                    showText = ((whatToShow & 4)!==0),
                    typeMatch = (showElement && (vnode.nodeType===1)) || (showComment && (vnode.nodeType===8)) || (showText && (vnode.nodeType===3)),
                    visibleMatch = !forcedVisible || (window.getComputedStyle(vnode.domNode).display!=='none'),
                    funcMatch = filter ? filter(vnode.domNode) : true;
                return typeMatch && visibleMatch && funcMatch;
            },
            firstChild: function() {
                var instance = this,
                    foundVNode = instance.vNodePointer.vFirstChild;
                while (foundVNode && !instance._match(foundVNode)) {
                    foundVNode = foundVNode.vNext;
                }
                foundVNode && (instance.vNodePointer=foundVNode);
                return foundVNode && foundVNode.domNode;
            },
            lastChild: function() {
                var instance = this,
                    foundVNode = instance.vNodePointer.vLastChild;
                while (foundVNode && !instance._match(foundVNode)) {
                    foundVNode = foundVNode.vPrevious;
                }
                foundVNode && (instance.vNodePointer=foundVNode);
                return foundVNode && foundVNode.domNode;
            },
            nextNode: function() {
                var instance = this,
                    foundVNode = instance.vNodePointer.vNext;
                while (foundVNode && !instance._match(foundVNode, true)) {
                    foundVNode = foundVNode.vNext;
                }
                foundVNode && (instance.vNodePointer=foundVNode);
                return foundVNode && foundVNode.domNode;
            },
            nextSibling: function() {
                var instance = this,
                    foundVNode = instance.vNodePointer.vNext;
                while (foundVNode && !instance._match(foundVNode)) {
                    foundVNode = foundVNode.vNext;
                }
                foundVNode && (instance.vNodePointer=foundVNode);
                return foundVNode && foundVNode.domNode;
            },
            parentNode: function() {
                var instance = this,
                    foundVNode = instance.vNodePointer.vParent;
                (foundVNode!==instance._root) && (instance.vNodePointer=foundVNode);
                return foundVNode && foundVNode.domNode;
            },
            previousNode: function() {
                var instance = this,
                    foundVNode = instance.vNodePointer.vPrevious;
                while (foundVNode && !instance._match(foundVNode, true)) {
                    foundVNode = foundVNode.vPrevious;
                }
                foundVNode && (instance.vNodePointer=foundVNode);
                return foundVNode && foundVNode.domNode;
            },
            previousSibling: function() {
                var instance = this,
                    foundVNode = instance.vNodePointer.vPrevious;
                while (foundVNode && !instance._match(foundVNode)) {
                    foundVNode = foundVNode.vPrevious;
                }
                foundVNode && (instance.vNodePointer=foundVNode);
                return foundVNode && foundVNode.domNode;
            }
        };

    require('window-ext')(window);

    Object.defineProperties(treeWalkerProto, {
        'currentNode': {
            get: function() {
                return this.vNodePointer.domNode;
            }
        },
        'filter': {
            get: function() {
                return this._filter;
            }
        },
        'root': {
            get: function() {
                return this._root;
            }
        },
        'whatToShow': {
            get: function() {
                return this._whatToShow;
            }
        }
    });

    // NOTE: `vnode` should be a property of Node, NOT Element
    /**
     * Reference to the vnode-object that represents the Node
     *
     * (will autogenerate a vnode, should it not exists)
     *
     * @for Node
     * @property vnode
     * @type vnode
     * @since 0.0.1
     */
    Object.defineProperty(window.Node.prototype, 'vnode', {
       get: function() {
            var instance = this,
                vnode = instance._vnode,
                parentNode, parentVNode, index;
            if (!vnode) {
                vnode = instance._vnode = domNodeToVNode(instance);
                parentNode = instance.parentNode;
                 // parentNode.vnode will be an existing vnode, because it runs through the same getter
                // it will only be `null` if `html` is not virtualised
                parentVNode = parentNode && parentNode.vnode;
                if (parentVNode) {
                    // set the vnode at the right position of its children:
                    index = arrayIndexOf.call(parentNode.childNodes, instance);
                    vnode._moveToParent(parentVNode, index);
                }
            }
            return vnode;
        },
        set: function() {} // NOOP but needs to be there, otherwise we could clone any domNodes
    });

    CSS_PROPS_TO_CALCULATE[VENDOR_TRANSFORM_PROPERTY] = true;
    CSS_PROPS_TO_CALCULATE[generateVendorCSSProp(TRANSFORM+'-origin')] = true;
    CSS_PROPS_TO_CALCULATE[generateVendorCSSProp('perspective')] = true;

    (function(ElementPrototype) {

        /**
        * Determines the number of transitionend-events there will occur
        * @method _getEvtTransEndCount
        * @private
        * @since 0.0.1
        */
        ElementPrototype._getEvtTransEndCount = function(cssProperties) {
            var transitions = this.getStyle(TRANSITION),
                timing = {},
                duration, delay, time;
            transitions.each(function(transition) {
                if (!cssProperties || (cssProperties[transition.property])) {
                    duration = transition.duration || 0;
                    delay = transition.delay || 0;
                    time = (duration+delay);
                    timing[time] = true;
                }
            });
            return timing.size();
        };

        /**
        * Returns cascaded "transition" style of all transition-properties. `Cascaded` means: the actual present style,
        * the way it is visible (calculated through the DOM-tree).
        *
        * Note1: When "transition" is set inline, ONLY inline transtition is active!
        * Thus, if parentNode has "transition: width 2s" and inline has "transition: height 3s", then the transition
        * will be "transition: height 3s" --> returning "undefined" for transitionProperty=width.
        * Note2: in case of "transition: all" --> these values will be returned for every "transitionProperty" (even when querying "width")
        *
        * @method _getTransitionAll
        * @param transitionProperty {String} transform property that is queried, f.e. "width", or "all"
        * @param [pseudo] {String} to query pseudo-element, fe: `:before` or `:first-line`
        * @return {Object} the transition-object, with the properties:
        * <ul>
        *     <li>duration {Number}</li>
        *     <li>timingFunction {String}</li>
        *     <li>delay {Number}</li>
        * </ul>
        * @private
        * @since 0.0.1
        */
        ElementPrototype._getTransitionAll = function(pseudo) {
            var instance = this,
                transProperty, transDuration, transTimingFunction, transDelay, transPropertySplitted, property,
                transitions, transDurationSplitted, transTimingFunctionSplitted, transDelaySplitted, i, len, duration;
            // first look at inline transition:
            transitions = instance.getInlineTransition(null, pseudo);
            if (transitions) {
                return transitions;
            }
            // no inline transitions over here --> calculate using getStyle
            transitions = {};
            transProperty = instance.getStyle(VENDOR_TRANSITION_PROPERTY+'Property', pseudo);
            transDuration = instance.getStyle(VENDOR_TRANSITION_PROPERTY+'Duration', pseudo);
            transTimingFunction = instance.getStyle(VENDOR_TRANSITION_PROPERTY+'TimingFunction', pseudo);
            transDelay = instance.getStyle(VENDOR_TRANSITION_PROPERTY+'Delay', pseudo);
            if (transProperty) {
                transPropertySplitted = transProperty && transProperty.split(',');
                transDurationSplitted = transDuration.split(',');
                transTimingFunctionSplitted = transTimingFunction.split(',');
                transDelaySplitted = transDelay.split(',');
                len = transPropertySplitted.length;
                for (i=0; i<len; i++) {
                    property = transPropertySplitted[i];
                    duration = transTimingFunctionSplitted[i];
                    if ((property!=='none') && (duration!=='0s')) {
                        if (property!=='all') {
                            property = VENDOR_CSS_PROPERTIES[property] || generateVendorCSSProp(property);
                        }
                        transitions[property] = {
                            duration: parseFloat(transDurationSplitted[i]),
                            timingFunction: duration,
                            delay: parseFloat(transDelaySplitted[i])
                        };
                    }
                }
            }
            return transitions;
        };

       /**
        * Appends an Element or an Element's string-representation at the end of Element's innerHTML, or before the `refElement`.
        *
        * @for Element
        * @method append
        * @param content {Element|ElementArray|String} content to append
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @param [refElement] {Element} reference Element where the content should be appended
        * @return {Element} the created Element (or the last when multiple)
        * @since 0.0.1
        */
        ElementPrototype.append = function(content, escape, refElement) {
            var instance = this,
                vnode = instance.vnode,
                i, len, item, createdElement, vnodes, vRefElement,
            doAppend = function(oneItem) {
                escape && (oneItem.nodeType===1) && (oneItem=DOCUMENT.createTextNode(oneItem.getOuterHTML()));
                createdElement = refElement ? vnode._insertBefore(oneItem.vnode, refElement.vnode) : vnode._appendChild(oneItem.vnode);
            };
            vnode._noSync()._normalizable(false);
            if (refElement && (vnode.vChildNodes.indexOf(refElement.vnode)!==-1)) {
                vRefElement = refElement.vnode.vNext;
                refElement = vRefElement && vRefElement.domNode;
            }
            (typeof content===STRING) && (content=htmlToVFragments(content));
            if (content.isFragment) {
                vnodes = content.vnodes;
                len = vnodes.length;
                for (i=0; i<len; i++) {
                    doAppend(vnodes[i].domNode);
                }
            }
            else if (Array.isArray(content)) {
                len = content.length;
                for (i=0; i<len; i++) {
                    item = content[i];
                    doAppend(item);
                }
            }
            else {
                doAppend(content);
            }
            vnode._normalizable(true)._normalize();
            return createdElement;
        };

        /**
         * Adds a node to the end of the list of childNodes of a specified parent node.
         *
         * @method appendChild
         * @param content {Element|ElementArray|String} content to append
         * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
         * @return {Element} the Element that was appended
         */
        ElementPrototype._appendChild = ElementPrototype.appendChild;
        ElementPrototype.appendChild = function(domNode, escape) {
            return this.append(domNode, escape);
        };

       /**
        * Returns a duplicate of the node. Use cloneNode(true) for a `deep` clone.
        *
        * @method cloneNode
        * @param [deep] {Boolean} whether to perform a `deep` clone: with all descendants
        * @return {Element} a clone of this Element
        * @since 0.0.1
        */
        ElementPrototype._cloneNode = ElementPrototype.cloneNode;
        ElementPrototype.cloneNode = function(deep) {
            var instance = this,
                vnode = instance.vnode,
                cloned = instance._cloneNode(deep),
                cloneData = function(srcVNode, targetVNode) {
                    if (srcVNode._data) {
                        Object.defineProperty(targetVNode, '_data', {
                            configurable: false,
                            enumerable: false,
                            writable: false,
                            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {}'s properties itself
                        });
                        targetVNode._data.merge(srcVNode._data);
                    }
                },
                cloneDeepData = function(srcVNode, targetVNode) {
                    var srcVChildren = srcVNode.vChildren,
                        targetVChildren = targetVNode.vChildren,
                        len = srcVChildren.length,
                        i, childSrcVNode, childTargetVNode;
                    for (i=0; i<len; i++) {
                        childSrcVNode = srcVChildren[i];
                        childTargetVNode = targetVChildren[i];
                        cloneData(childSrcVNode, childTargetVNode);
                        childSrcVNode.hasVChildren() && cloneDeepData(childSrcVNode, childTargetVNode);
                    }
                };
            cloned.vnode = domNodeToVNode(cloned);
            cloneData(vnode, cloned.vnode);
            // if deep, then we need to merge _data of all deeper nodes
            deep && vnode.hasVChildren() && cloneDeepData(vnode, cloned.vnode);
            return cloned;
        };

        /**
         * Compares the position of the current node against another node in any other document.
         *
         * Returnvalues are a composition of the following bitwise values:
         * <ul>
         *     <li>Node.DOCUMENT_POSITION_DISCONNECTED === 1 (one of the Elements is not part of the dom)</li>
         *     <li>Node.DOCUMENT_POSITION_PRECEDING === 2 (this Element comes before otherElement)</li>
         *     <li>Node.DOCUMENT_POSITION_FOLLOWING === 4 (this Element comes after otherElement)</li>
         *     <li>Node.DOCUMENT_POSITION_CONTAINS === 8 (otherElement trully contains -not equals- this Element)</li>
         *     <li>Node.DOCUMENT_POSITION_CONTAINED_BY === 16 (Element trully contains -not equals- otherElement)</li>
         * </ul>
         *
         * @method compareDocumentPosition
         * @param otherElement {Element}
         * @return {Number} A bitmask, use it this way: if (thisNode.compareDocumentPosition(otherNode) & Node.DOCUMENT_POSITION_FOLLOWING) {// otherNode is following thisNode}
         */
        ElementPrototype.compareDocumentPosition = function(otherElement) {
            // see http://ejohn.org/blog/comparing-document-position/
            var instance = this,
                parent, index1, index2, vChildNodes;
            if (instance===otherElement) {
                return 0;
            }
            if (!DOCUMENT.contains(instance) || !DOCUMENT.contains(otherElement)) {
                return 1;
            }
            else if (instance.contains(otherElement)) {
                return 20;
            }
            else if (otherElement.contains(instance)) {
                return 10;
            }
            parent = instance.getParent();
            vChildNodes = parent.vnode.vChildNodes;
            index1 = vChildNodes.indexOf(instance.vnode);
            index2 = vChildNodes.indexOf(otherElement.vnode);
            if (index1<index2) {
                return 2;
            }
            else {
                return 4;
            }
        };

        /**
         * Indicating whether this Element contains OR equals otherElement.
         *
         * @method contains
         * @param otherElement {Element}
         * @return {Boolean} whether this Element contains OR equals otherElement.
         */
        ElementPrototype.contains = function(otherElement) {
            if (otherElement===this) {
                return true;
            }
            return this.vnode.contains(otherElement.vnode);
        };

        /**
         * Returns a newly created TreeWalker object with this Element as root.
         *
         * The TreeWalker is life presentation of the dom. It gets updated when the dom changes.
         *
         * @method createTreeWalker
         * @param root {Element} The root node at which to begin the NodeIterator's traversal.
         * @param [whatToShow] {Number} Filter specification constants from the NodeFilter DOM interface, indicating which nodes to iterate over.
         * You can use or sum one of the next properties:
         * <ul>
         *   <li>window.NodeFilter.SHOW_ALL === -1</li>
         *   <li>window.NodeFilter.SHOW_ELEMENT === 1</li>
         *   <li>window.NodeFilter.SHOW_COMMENT === 128</li>
         *   <li>window.NodeFilter.SHOW_TEXT === 4</li>
         * </ul>
         *
         * A treewalker has the next methods:
         * <ul>
         *   <li>treewalker.firstChild()</li>
         *   <li>treewalker.lastChild()</li>
         *   <li>treewalker.nextNode()</li>
         *   <li>treewalker.nextSibling()</li>
         *   <li>treewalker.parentNode()</li>
         *   <li>treewalker.previousNode()</li>
         *   <li>treewalker.previousSibling()</li>
         * </ul>
         *
         * A treewalker has the next properties:
         * <ul>
         *   <li>treewalker.currentNode</li>
         *   <li>treewalker.filter</li>
         *   <li>treewalker.root</li>
         *   <li>treewalker.whatToShow</li>
         * </ul>
         *
         * @param [filter] {NodeFilter|function} An object implementing the NodeFilter interface or a function. See https://developer.mozilla.org/en-US/docs/Web/API/NodeFilter
         * @return {TreeWalker}
         * @since 0.0.1
         */
        ElementPrototype.createTreeWalker = function(whatToShow, filter) {
            var treeWalker = Object.create(treeWalkerProto);
            treeWalker._init(this, whatToShow, filter);
            return treeWalker;
        };

       /**
        * Sets the inline-style of the Element exactly to the specified `value`, overruling previous values.
        * Making the Element's inline-style look like: style="value".
        *
        * This is meant for a quick one-time setup. For individually inline style-properties to be set, you can use `setInlineStyle()`.
        *
        * @method defineInlineStyle
        * @param value {String} the style string to be set
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.defineInlineStyle = function(value) {
            return this.setAttr(STYLE, value);
        };

       /**
        * Empties the content of the Element.
        * Alias for thisNode.vTextContent = '';
        *
        * @method empty
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.empty = function() {
            this.setText('');
        };

        /**
         * Reference to the first of sibbling vNode's, where the related dom-node is an Element(nodeType===1).
         *
         * @method first
         * @param [cssSelector] {String} to return the first Element that matches the css-selector
         * @return {Element}
         * @since 0.0.1
         */
        ElementPrototype.first = function(cssSelector) {
            return this.vnode.vParent.firstOfVChildren(cssSelector).domNode;
        };

        /**
         * Reference to the first child-Element, where the related dom-node an Element (nodeType===1).
         *
         * @method firstOfChildren
         * @param [cssSelector] {String} to return the first Element that matches the css-selector
         * @return {Element}
         * @since 0.0.1
         */
        ElementPrototype.firstOfChildren = function(cssSelector) {
            var foundVNode = this.vnode.firstOfVChildren(cssSelector);
            return foundVNode && foundVNode.domNode;
        };

       /**
        * Forces the Element to be inside an ancestor-Element that has the `overfow="scroll" set.
        *
        * @method forceIntoNodeView
        * @param [ancestor] {Element} the Element where it should be forced into its view.
        *        Only use this when you know the ancestor and this ancestor has an `overflow="scroll"` property
        *        when not set, this method will seek through the doc-tree upwards for the first Element that does match this criteria.
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.forceIntoNodeView = function(ancestor) {
            // TODO: transitioned: http://wibblystuff.blogspot.nl/2014/04/in-page-smooth-scroll-using-css3.html
            console.log(NAME, 'forceIntoNodeView');
            var instance = this,
                parentOverflowNode = this.getParent(),
                match, left, width, right, height, top, bottom, scrollLeft, scrollTop, parentOverflowNodeX, parentOverflowNodeY,
                parentOverflowNodeStartTop, parentOverflowNodeStartLeft, parentOverflowNodeStopRight, parentOverflowNodeStopBottom, newX, newY;
            if (parentOverflowNode) {
                if (ancestor) {
                    parentOverflowNode = ancestor;
                }
                else {
                    while (parentOverflowNode && (parentOverflowNode!==DOCUMENT) && !(match=((parentOverflowNode.getStyle(OVERFLOW)===SCROLL) || (parentOverflowNode.getStyle(OVERFLOW+'-y')===SCROLL)))) {
                        parentOverflowNode = parentOverflowNode.getParent();
                    }
                }
                if (parentOverflowNode && (parentOverflowNode!==DOCUMENT)) {
                    left = instance.left;
                    width = instance.offsetWidth;
                    right = left + width;
                    height = instance.offsetHeight;
                    top = instance.top;
                    bottom = top + height;
                    scrollLeft = parentOverflowNode.scrollLeft;
                    scrollTop = parentOverflowNode.scrollTop;
                    parentOverflowNodeX = parentOverflowNode.left;
                    parentOverflowNodeY = parentOverflowNode.top;
                    parentOverflowNodeStartTop = parentOverflowNodeY+parseInt(parentOverflowNode.getStyle(BORDER_TOP_WIDTH), 10);
                    parentOverflowNodeStartLeft = parentOverflowNodeX+parseInt(parentOverflowNode.getStyle(BORDER_LEFT_WIDTH), 10);
                    parentOverflowNodeStopRight = parentOverflowNodeX+parentOverflowNode.offsetWidth-parseInt(parentOverflowNode.getStyle(BORDER_RIGHT_WIDTH), 10);
                    parentOverflowNodeStopBottom = parentOverflowNodeY+parentOverflowNode.offsetHeight-parseInt(parentOverflowNode.getStyle(BORDER_BOTTOM_WIDTH), 10);

                    if (left<parentOverflowNodeStartLeft) {
                        newX = Math.max(0, scrollLeft+left-parentOverflowNodeStartLeft);
                    }
                    else if (right>parentOverflowNodeStopRight) {
                        newX = scrollLeft + right - parentOverflowNodeStopRight;
                    }

                    if (top<parentOverflowNodeStartTop) {
                        newY = Math.max(0, scrollTop+top-parentOverflowNodeStartTop);
                    }
                    else if (bottom>parentOverflowNodeStopBottom) {
                        newY = scrollTop + bottom - parentOverflowNodeStopBottom;
                    }

                    if ((newX!==undefined) || (newY!==undefined)) {
                        parentOverflowNode.scrollTo((newX!==undefined) ? newX : scrollLeft,(newY!==undefined) ? newY : scrollTop);
                    }
                }
            }
            return instance;
        };

       /**
        * Forces the Element to be inside the window-view. Differs from `scrollIntoView()` in a way
        * that `forceIntoView()` doesn't change the position when it's inside the view, whereas
        * `scrollIntoView()` sets it on top of the view.
        *
        * @method forceIntoView
        * @param [notransition=false] {Boolean} set true if you are sure positioning is without transition.
        *        this isn't required, but it speeds up positioning. Only use when no transition is used:
        *        when there is a transition, setting this argument `true` would miscalculate the position.
        * @param [rectangle] {Object} Set this if you have already calculated the window-rectangle (used for preformance within drag-drop)
        * @param [rectangle.x] {Number} scrollLeft of window
        * @param [rectangle.y] {Number} scrollTop of window
        * @param [rectangle.w] {Number} width of window
        * @param [rectangle.h] {Number} height of window
        * @chainable
        * @since 0.0.2
        */
        ElementPrototype.forceIntoView = function(notransition, rectangle) {
            // TODO: 'notransition' can be calculated with this.getTransition(left) this.getTransition(left) and this.getTransform(translateX) and this.getTransform(translateY)
            // TODO: transitioned: http://wibblystuff.blogspot.nl/2014/04/in-page-smooth-scroll-using-css3.html
            console.log(NAME, 'forceIntoView');
            var instance = this,
                left = instance.left,
                width = instance.offsetWidth,
                right = left + width,
                height = instance.offsetHeight,
                top = instance.top,
                bottom = top + height,
                windowLeft, windowTop, windowRight, windowBottom, newX, newY;
            if (rectangle) {
                windowLeft = rectangle.x;
                windowTop = rectangle.y;
                windowRight = rectangle.w;
                windowBottom = rectangle.h;
            }
            else {
                windowLeft = window.getScrollLeft();
                windowTop = window.getScrollTop();
                windowRight = windowLeft + window.getWidth();
                windowBottom = windowTop + window.getHeight();
            }

            if (left<windowLeft) {
                newX = Math.max(0, left);
            }
            else if (right>windowRight) {
                newX = windowLeft + right - windowRight;
            }
            if (top<windowTop) {
                newY = Math.max(0, top);
            }
            else if (bottom>windowBottom) {
                newY = windowTop + bottom - windowBottom;
            }

            if ((newX!==undefined) || (newY!==undefined)) {
                window.scrollTo((newX!==undefined) ? newX : windowLeft, (newY!==undefined) ? newY : windowTop);
            }
            return instance;
        };

        /**
         * Gets an ElementArray of Elements that lie within this Element and match the css-selector.
         *
         * @method getAll
         * @param cssSelector {String} css-selector to match
         * @return {ElementArray} ElementArray of Elements that match the css-selector
         * @since 0.0.1
         */
        ElementPrototype.getAll = function(cssSelector) {
            return this.querySelectorAll(cssSelector);
        };

       /**
        * Gets an attribute of the Element.
        *
        * Alias for getAttribute().
        *
        * @method getAttr
        * @param attributeName {String}
        * @return {String|null} value of the attribute
        * @since 0.0.1
        */
        ElementPrototype.getAttr = function(attributeName) {
            return this.vnode.attrs[attributeName] || null;
        };

        /**
         * Returns all attributes as defined as an key/value object.
         *
         * @method getAttrs
         * @param attributeName {String}
         * @return {Object} all attributes as on Object
         * @since 0.0.1
         */
        ElementPrototype.getAttrs = function() {
            return this.vnode.attrs;
        };

       /**
        * Gets an attribute of the Element.
        *
        * Same as getAttr().
        *
        * @method getAttribute
        * @param attributeName {String}
        * @return {String|null} value of the attribute
        * @since 0.0.1
        */
        ElementPrototype._getAttribute = ElementPrototype.getAttribute;
        ElementPrototype.getAttribute = function(attributeName) {
            return this.vnode.attrs[attributeName] || null;
        };

        /**
         * Returns a live collection of the Element-childNodes.
         *
         * @method getChildren
         * @return {ElementArray}
         * @since 0.0.1
         */
        ElementPrototype.getChildren = function() {
            var vChildren = this.vnode.vChildren,
                len = vChildren.length,
                children = ElementArray.createArray(),
                i;
            for (i=0; i<len; i++) {
                children[children.length] = vChildren[i].domNode;
            }
            return children;
        };

        /**
         * Returns a token list of the class attribute of the element.
         * See: https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList
         *
         * @method getClassList
         * @return DOMTokenList
         * @since 0.0.1
         */
        ElementPrototype.getClassList = function() {
            var instance = this,
                vnode = instance.vnode;
            if (!vnode._classList) {
                vnode._classList = Object.create(classListProto);
                vnode._classList._init(instance);
            }
            return vnode._classList;
        };

       /**
        * Returns data set specified by `key`. If not set, `undefined` will be returned.
        * The data is efficiently stored on the vnode.
        *
        * @method getData
        * @param key {string} name of the key
        * @return {Any|undefined} data set specified by `key`
        * @since 0.0.1
        */
        ElementPrototype.getData = function(key) {
            var vnode = this.vnode;
            return vnode._data && vnode._data[key];
        };

       /**
        * Gets one Element, specified by the css-selector. To retrieve a single element by id,
        * you need to prepend the id-name with a `#`. When multiple Element's match, the first is returned.
        *
        * @method getElement
        * @param cssSelector {String} css-selector to match
        * @return {Element|null} the Element that was search for
        * @since 0.0.1
        */
        ElementPrototype.getElement = function(cssSelector) {
            return ((cssSelector[0]==='#') && (cssSelector.indexOf(' ')===-1)) ? this.getElementById(cssSelector.substr(1)) : this.querySelector(cssSelector);
        };

        /**
         * Returns the Element matching the specified id, which should should be a descendant of this Element.
         *
         * @method getElementById
         * @param id {String} id of the Element
         * @return {Element|null}
         *
         */
        ElementPrototype.getElementById = function(id) {
            var element = nodeids[id];
            if (element && !this.contains(element)) {
                // outside itself
                return null;
            }
            return element || null;
        };

        /**
         * Gets innerHTML of the dom-node.
         * Goes through the vdom, so it's superfast.
         *
         * Use this method instead of `innerHTML`
         *
         * @method getHTML
         * @return {String}
         * @since 0.0.1
         */
        ElementPrototype.getHTML = function() {
            return this.vnode.innerHTML;
        };

       /**
        * Returns the Elments `id`
        *
        * @method getId
        * @return {String|undefined} Elements `id`
        * @since 0.0.1
        */
        ElementPrototype.getId = function() {
            return this.vnode.id;
        };

       /**
        * Returns inline style of the specified property. `Inline` means: what is set directly on the Element,
        * this doesn't mean necesairy how it is looked like: when no css is set inline, the Element might still have
        * an appearance because of other CSS-rules.
        *
        * In most cases, you would be interesting in using `getStyle()` instead.
        *
        * Note: no need to camelCase cssProperty: both `margin-left` as well as `marginLeft` are fine
        *
        * @method getInlineStyle
        * @param cssProperty {String} the css-property to look for
        * @param [pseudo] {String} to look inside a pseudo-style
        * @return {String|undefined} css-style
        * @since 0.0.1
        */
        ElementPrototype.getInlineStyle = function(cssProperty, pseudo) {
            var styles = this.vnode.styles,
                groupStyle = styles && styles[pseudo || 'element'],
                value;
            if (groupStyle) {
                value = groupStyle[fromCamelCase(cssProperty)];
                value && (cssProperty===VENDOR_TRANSITION_PROPERTY) && (value=extractor.serializeTransition(value));
            }
            return value;
        };

       /**
        * Returns inline transition-css-property. `Inline` means: what is set directly on the Element,
        * When `transition` is set inline, no `parent` transition-rules apply.
        *
        *
        * @method getInlineTransition
        * @param [transitionProperty] {String} the css-property to look for
        * @param [pseudo] {String} to look inside a pseudo-style
        * @return {Object} the transition-object, with the properties:
        * <ul>
        *     <li>duration {Number}</li>
        *     <li>timingFunction {String}</li>
        *     <li>delay {Number}</li>
        * </ul>
        * @since 0.0.1
        */
        ElementPrototype.getInlineTransition = function(transitionProperty, pseudo) {
            var styles = this.vnode.styles,
                groupStyle = styles && styles[pseudo || 'element'],
                transitionStyles = groupStyle && groupStyle[VENDOR_TRANSITION_PROPERTY];
            if (transitionStyles) {
                return transitionProperty ? transitionStyles[fromCamelCase(transitionProperty)] : transitionStyles;
            }
        };

        /**
         * Gets the outerHTML of the dom-node.
         * Goes through the vdom, so it's superfast.
         *
         * Use this method instead of `outerHTML`
         *
         * @method getOuterHTML
         * @return {String}
         * @since 0.0.1
         */
        ElementPrototype.getOuterHTML = function() {
            return this.vnode.outerHTML;
        };

        /**
         * Returns the Element's parent Element.
         *
         * @method getParent
         * @return {Element}
         */
        ElementPrototype.getParent = function() {
            var vParent = this.vnode.vParent;
            return vParent && vParent.domNode;
        };

       /**
        * Returns cascaded style of the specified property. `Cascaded` means: the actual present style,
        * the way it is visible (calculated through the DOM-tree).
        *
        * <ul>
        *     <li>Note1: values are absolute: percentages and points are converted to absolute values, sizes are in pixels, colors in rgb/rgba-format.</li>
        *     <li>Note2: you cannot query shotcut-properties: use `margin-left` instead of `margin`.</li>
        *     <li>Note3: no need to camelCase cssProperty: both `margin-left` as well as `marginLeft` are fine.</li>
        *     <li>Note4: you can query `transition`, `transform`, `perspective` and `transform-origin` instead of their vendor-specific properties.</li>
        *     <li>Note5: `transition` or `transform` return an Object instead of a String.</li>
        * </ul>
        *
        * @method getCascadeStyle
        * @param cssProperty {String} property that is queried
        * @param [pseudo] {String} to query pseudo-element, fe: `:before` or `:first-line`
        * @return {String|Object} value for the css-property: this is an Object for the properties `transition` or `transform`
        * @since 0.0.1
        */
        ElementPrototype.getStyle = function(cssProperty, pseudo) {
            // Cautious: when reading the property `transform`, getComputedStyle should
            // read the calculated value, but some browsers (webkit) only calculate the style on the current element
            // In those cases, we need a patch and look up the tree ourselves
            //  Also: we will return separate value, NOT matrices
            var instance = this;
            if (cssProperty===VENDOR_TRANSITION_PROPERTY) {
                return instance._getTransitionAll(pseudo);
            }
            VENDOR_CSS_PROPERTIES[cssProperty] || (cssProperty=generateVendorCSSProp(cssProperty));
            return window.getComputedStyle(instance, pseudo)[toCamelCase(cssProperty)];
        };

        /**
        * Returns cascaded "transition" style of the specified trandform-property. `Cascaded` means: the actual present style,
        * the way it is visible (calculated through the DOM-tree).
        *
        * Note1: When "transition" is set inline, ONLY inline transtition is active!
        * Thus, if parentNode has "transition: width 2s" and inline has "transition: height 3s", then the transition
        * will be "transition: height 3s" --> returning "undefined" for transitionProperty=width.
        * Note2: in case of "transition: all" --> these values will be returned for every "transitionProperty" (even when querying "width")
        *
        * @method getTransition
        * @param transitionProperty {String} transform property that is queried, f.e. "width", or "all"
        * @param [pseudo] {String} to query pseudo-element, fe: `:before` or `:first-line`
        * @return {Object} the transition-object, with the properties:
        * <ul>
        *     <li>duration {Number}</li>
        *     <li>timingFunction {String}</li>
        *     <li>delay {Number}</li>
        * </ul>
        * @since 0.0.1
        */
        ElementPrototype.getTransition = function(transitionProperty, pseudo) {
            var instance = this,
                transProperty, transDuration, transTimingFunction, transDelay, transPropertySplitted,
                transition, transDurationSplitted, transTimingFunctionSplitted, transDelaySplitted, index;
            if (instance.hasInlineStyle(VENDOR_TRANSITION_PROPERTY, pseudo)) {
                transition = instance.getInlineTransition(transitionProperty, pseudo);
                // if not found, then search for "all":
                transition || (transition=instance.getInlineTransition('all', pseudo));
                if (transition) {
                    // getTransition always returns all the properties:
                    transition.timingFunction || (transition.timingFunction='ease');
                    transition.delay || (transition.delay=0);
                }
                return transition;
            }
            transProperty = instance.getStyle(VENDOR_TRANSITION_PROPERTY+'Property', pseudo);
            transDuration = instance.getStyle(VENDOR_TRANSITION_PROPERTY+'Duration', pseudo);
            transTimingFunction = instance.getStyle(VENDOR_TRANSITION_PROPERTY+'TimingFunction', pseudo);
            transDelay = instance.getStyle(VENDOR_TRANSITION_PROPERTY+'Delay', pseudo);
            transPropertySplitted = transProperty && transProperty.split(',');
            if (transProperty) {
                if (transPropertySplitted.length>1) {
                    // multiple definitions
                    index = transPropertySplitted.indexOf(transitionProperty);
                    // the array is in a form like this: 'width, height, opacity' --> therefore, we might need to look at a whitespace
                    if (index===-1) {
                        index = transPropertySplitted.indexOf(' '+transitionProperty);
                        // if not found, then search for "all":
                        if (index===-1) {
                            index = transPropertySplitted.indexOf('all');
                            (index===-1) && (index=transPropertySplitted.indexOf(' '+'all'));
                        }
                    }
                    if (index!==-1) {
                        transDurationSplitted = transDuration.split(',');
                        transTimingFunctionSplitted = transTimingFunction.split(',');
                        transDelaySplitted = transDelay.split(',');
                        transition = {
                            duration: parseFloat(transDurationSplitted[index]),
                            timingFunction: transTimingFunctionSplitted[index].trimLeft(),
                            delay: parseFloat(transDelaySplitted)
                        };
                    }
                }
                else {
                    // one definition
                    if ((transProperty===transitionProperty) || (transProperty==='all')) {
                        transition = {
                            duration: parseFloat(transDuration),
                            timingFunction: transTimingFunction,
                            delay: parseFloat(transDelay)
                        };
                    }
                }
                transition && (transition.duration===0) && (transition=undefined);
                return transition;
            }
        };

       /**
        * Elements tag-name in uppercase (same as nodeName).
        *
        * @method getTagName
        * @return {String}
        * @since 0.0.1
        */
        ElementPrototype.getTagName = function() {
            return this.vnode.tag;
        };

        /**
         * Gets the innerContent of the Element as plain text.
         * Goes through the vdom, so it's superfast.
         *
         * Use this method instead of `textContent`
         *
         * @method getText
         * @return String
         * @since 0.0.1
         */
        ElementPrototype.getText = function() {
            return this.vnode.textContent;
        };

       /**
        * Gets the value of the following Elements:
        *
        * <ul>
        *     <li>input</li>
        *     <li>textarea</li>
        *     <li>select</li>
        *     <li>any container that is `contenteditable`</li>
        * </ul>
        *
        * @method getValue
        * @return {String}
        * @since 0.0.1
        */
        ElementPrototype.getValue = function() {
            // cautious: input and textarea must be accessed by their propertyname:
            // input.getAttribute('value') would return the default-value instead of actual
            // and textarea.getAttribute('value') doesn't exist
            var instance = this,
                contenteditable = instance.vnode.attrs.contenteditable,
                editable = contenteditable && (contenteditable!=='false');
            return editable ? instance.getHTML() : instance.value;
        };

       /**
        * Whether the Element has the attribute set.
        *
        * Alias for hasAttribute().
        *
        * @method hasAttr
        * @param attributeName {String}
        * @return {Boolean} Whether the Element has the attribute set.
        * @since 0.0.1
        */
        ElementPrototype.hasAttr = function(attributeName) {
            return !!this.vnode.attrs[attributeName];
        };

       /**
        * Whether the Element has the attribute set.
        *
        * Same as hasAttr().
        *
        * @method hasAttribute
        * @param attributeName {String}
        * @return {Boolean} Whether the Element has the attribute set.
        * @since 0.0.1
        */
        ElementPrototype.hasAttribute = function(attributeName) {
            return !!this.vnode.attrs[attributeName];
        };

        /**
         * Indicating if the current element has any attributes or not.
         *
         * @method hasAttributes
         * @return {Boolean} Whether the current element has any attributes or not.
         */
        ElementPrototype.hasAttributes = function() {
            var attrs = this.vnode.attrs;
            return attrs ? (attrs.size() > 0) : false;
        };

       /**
        * Indicating if the Element has any children (childNodes with nodeType of 1).
        *
        * @method hasChildren
        * @return {Boolean} whether the Element has children
        * @since 0.0.1
        */
        ElementPrototype.hasChildren = function() {
            return this.vnode.hasVChildren();
        };

       /**
        * Checks whether the className is present on the Element.
        *
        * @method hasClass
        * @param className {String|Array} the className to check for. May be an Array of classNames, which all needs to be present.
        * @return {Boolean} whether the className (or classNames) is present on the Element
        * @since 0.0.1
        */
        ElementPrototype.hasClass = function(className) {
            return this.getClassList().contains(className);
        };

       /**
        * If the Element has data set specified by `key`. The data could be set with `setData()`.
        *
        * @method hasData
        * @param key {string} name of the key
        * @return {Boolean}
        * @since 0.0.1
        */
        ElementPrototype.hasData = function(key) {
            var vnode = this.vnode;
            return !!(vnode._data && (vnode._data[key]!==undefined));
        };

       /**
        * Indicates whether Element currently has the focus.
        *
        * @method hasFocus
        * @return {Boolean}
        * @since 0.0.1
        */
        ElementPrototype.hasFocus = function() {
            return (DOCUMENT.activeElement===this);
        };

       /**
        * Indicates whether the current focussed Element lies inside this Element (on a descendant Element).
        *
        * @method hasFocusInside
        * @return {Boolean}
        * @since 0.0.1
        */
        ElementPrototype.hasFocusInside = function() {
            var activeElement = DOCUMENT.activeElement;
            return ((DOCUMENT.activeElement!==this) && this.contains(activeElement));
        };

       /**
        * Returns whether the inline style of the specified property is present. `Inline` means: what is set directly on the Element.
        *
        * Note: no need to camelCase cssProperty: both `margin-left` as well as `marginLeft` are fine
        *
        * @method hasInlineStyle
        * @param cssProperty {String} the css-property to look for
        * @param [pseudo] {String} to look inside a pseudo-style
        * @return {Boolean} whether the inlinestyle was present
        * @since 0.0.1
        */
        ElementPrototype.hasInlineStyle = function(cssProperty, pseudo) {
            return !!this.getInlineStyle(cssProperty, pseudo);
        };

       /**
        * Returns whether the specified inline transform-css-property is present. `Inline` means: what is set directly on the Element.
        *
        * See more about tranform-properties: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
        *
        * @method hasInlineTransition
        * @param transitionProperty {String} the css-property to look for
        * @param [pseudo] {String} to look inside a pseudo-style
        * @return {Boolean} whether the inline transform-css-property was present
        * @since 0.0.1
        */
        ElementPrototype.hasInlineTransition = function(transitionProperty, pseudo) {
            return !!this.getInlineTransition(transitionProperty, pseudo);
        };

        /**
        * Returns whether the specified transform-property is active.
        *
        * Note1: When "transition" is set inline, ONLY inline transtition is active!
        * Thus, if parentNode has "transition: width 2s" and inline has "transition: height 3s",
        * then hasTransition('width') will return false.
        * Note2: in case of "transition: all" --> hasTransition() will always `true` for every transitionProperty.
        *
        * @method hasTransition
        * @param transitionProperty {String} the css-property to look for
        * @param [pseudo] {String} to look inside a pseudo-style
        * @return {Boolean} whether the inlinestyle was present
        * @since 0.0.1
        */
        ElementPrototype.hasTransition = function(transitionProperty, pseudo) {
            return !!this.getTransition(transitionProperty, pseudo);
        };

       /**
        * Hides a node by making it floated and removing it out of the visible screen.
        * Hides immediately without `fade`, or will fade when fade is specified.
        *
        * @method hide
        * @param [fade] {Number} sec to fade (you may use `0.1`)
        * @return {this|Promise} fulfilled when the element is ready hiding, or rejected when showed up again (using node.show) before fully hided.
        * @since 0.0.1
        */
        ElementPrototype.hide = function(duration) {
            // when it doesn't have, it doesn;t harm to leave the transitionclass on: it would work anyway
            // nevertheless we will remove it with a timeout
            var instance = this,
                showPromise = instance.getData('_showNodeBusy'),
                hidePromise = instance.getData('_hideNodeBusy'),
                originalOpacity, hasOriginalOpacity, promise, freezedOpacity, fromOpacity;

            originalOpacity = instance.getData('_showNodeOpacity');
            if (!originalOpacity && !showPromise && !hidePromise) {
                originalOpacity = instance.getInlineStyle('opacity');
                instance.setData('_showNodeOpacity', originalOpacity);
            }
            hasOriginalOpacity = !!originalOpacity;

            showPromise && showPromise.freeze();
            hidePromise && hidePromise.freeze();

            if (duration) {
                if (showPromise || hidePromise) {
                    freezedOpacity = instance.getInlineStyle('opacity');
                    fromOpacity = originalOpacity || 1;
                    duration = (fromOpacity>0) ? Math.min(1, (freezedOpacity/fromOpacity))*duration : 0;
                }
                promise = instance.transition({property: 'opacity', value: 0, duration: duration});
                instance.setData('_hideNodeBusy', promise);
                promise.finally(
                    function() {
                        if (!promise.cancelled && !promise.frozen) {
                            instance.setClass(HIDDEN);
                            originalOpacity ? instance.setInlineStyle('opacity', originalOpacity) : instance.removeInlineStyle('opacity');
                        }
                        instance.removeData('_hideNodeBusy');
                    }
                );
                return promise;
            }
            else {
                async(function() {
                    instance.setClass(HIDDEN);
                    hasOriginalOpacity ? instance.setInlineStyle('opacity', originalOpacity) : instance.removeInlineStyle('opacity');
                });
                return instance;
            }
        };

       /**
        * Indicates whether the Element currently is part if the DOM.
        *
        * @method inDOM
        * @return {Boolean} whether the Element currently is part if the DOM.
        * @since 0.0.1
        */
        ElementPrototype.inDOM = function() {
            return DOCUMENT.contains(this);
        };

       /**
         * Checks whether the Element lies within the specified selector (which can be a CSS-selector or a Element)
         *
         * @example
         * var divnode = childnode.inside('div.red');
         *
         * @example
         * var divnode = childnode.inside(containerNode);
         *
         * @method inside
         * @param selector {Element|String} the selector, specified by a Element or a css-selector
         * @return {Element|false} the nearest Element that matches the selector, or `false` when not found
         * @since 0.0.1
         */
        ElementPrototype.inside = function(selector) {
            var instance = this,
                vParent;
            if (typeof selector===STRING) {
                vParent = instance.vnode.vParent;
                while (vParent && !vParent.matchesSelector(selector)) {
                    vParent = vParent.vParent;
                }
                return vParent ? vParent.domNode : false;
            }
            else {
                // selector should be an Element
                return ((selector!==instance) && selector.contains(instance)) ? selector : false;
            }
        };

       /**
         * Checks whether a point specified with x,y is within the Element's region.
         *
         * @method insidePos
         * @param x {Number} x-value for new position (coordinates are page-based)
         * @param y {Number} y-value for new position (coordinates are page-based)
         * @return {Boolean} whether there is a match
         * @since 0.0.1
         */
        ElementPrototype.insidePos = function(x, y) {
            var instance = this,
                left = instance.left,
                top = instance.top,
                right = left + instance.offsetWidth,
                bottom = top + instance.offsetHeight;
            return (x>=left) && (x<=right) && (y>=top) && (y<=bottom);
        };

        /**
         * Inserts `domNode` before `refDomNode`.
         *
         * @method insertBefore
         * @param domNode {Node|Element|ElementArray|String} content to insert
         * @param refDomNode {Element} The Element before which newElement is inserted.
         * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
         * @return {Node} the Element being inserted (equals domNode)
         */
        ElementPrototype._insertBefore = ElementPrototype.insertBefore;
        ElementPrototype.insertBefore = function(domNode, refDomNode, escape) {
            return this.prepend(domNode, escape, refDomNode);
        };

        /**
         * Reference to the last of sibbling vNode's, where the related dom-node is an Element(nodeType===1).
         *
         * @method last
         * @param [cssSelector] {String} to return the last Element that matches the css-selector
         * @return {Element}
         * @since 0.0.1
         */
        ElementPrototype.last = function(cssSelector) {
            var vParent = this.vnode.vParent;
            return vParent && vParent.lastOfVChildren(cssSelector).domNode;
        };

        /**
         * Reference to the last child-Element, where the related dom-node an Element (nodeType===1).
         *
         * @method lastOfChildren
         * @param [cssSelector] {String} to return the last Element that matches the css-selector
         * @return {Element}
         * @since 0.0.1
         */
        ElementPrototype.lastOfChildren = function(cssSelector) {
            var foundVNode = this.vnode.lastOfVChildren(cssSelector);
            return foundVNode && foundVNode.domNode;
        };

        /**
         * Indicates if the element would be selected by the specified selector string.
         * Alias for matchesSelector()
         *
         * @method matches
         * @param [cssSelector] {String} the css-selector to check for
         * @return {Boolean}
         * @since 0.0.1
         */
        ElementPrototype.matches = function(selectors) {
            return this.vnode.matchesSelector(selectors);
        };

        /**
         * Indicates if the element would be selected by the specified selector string.
         * Alias for matches()
         *
         * @method matchesSelector
         * @param [cssSelector] {String} the css-selector to check for
         * @return {Boolean}
         * @since 0.0.1
         */
        ElementPrototype.matchesSelector = function(selectors) {
            return this.vnode.matchesSelector(selectors);
        };

        /**
         * Reference to the next of sibbling Element, where the related dom-node is an Element(nodeType===1).
         *
         * @method next
         * @param [cssSelector] {String} css-selector to be used as a filter
         * @return {Element|null}
         * @type Element
         * @since 0.0.1
         */
        ElementPrototype.next = function(cssSelector) {
            var vnode = this.vnode,
                found, vNextElement, firstCharacter, i, len;
            if (!cssSelector) {
                vNextElement = vnode.vNextElement;
                return vNextElement && vNextElement.domNode;
            }
            else {
                i = -1;
                len = cssSelector.length;
                while (!firstCharacter && (++i<len)) {
                    firstCharacter = cssSelector[i];
                    (firstCharacter===' ') && (firstCharacter=null);
                }
                if (firstCharacter==='>') {
                    return null;
                }
            }
            vNextElement = vnode;
            do {
                vNextElement = vNextElement.vNextElement;
                found = vNextElement && vNextElement.matchesSelector(cssSelector);
            } while(vNextElement && !found);
            return found ? vNextElement.domNode : null;
        };

       /**
        * Prepends a Element or text at the start of Element's innerHTML, or before the `refElement`.
        *
        * @method prepend
        * @param content {Element|Element|ElementArray|String} content to prepend
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @param [refElement] {Element} reference Element where the content should be prepended
        * @return {Element} the created Element (or the last when multiple)
        * @since 0.0.1
        */
        ElementPrototype.prepend = function(content, escape, refElement) {
            var instance = this,
                vnode = instance.vnode,
                i, len, item, createdElement, vnodes, vChildNodes, vRefElement,
            doPrepend = function(oneItem) {
                escape && (oneItem.nodeType===1) && (oneItem=DOCUMENT.createTextNode(oneItem.getOuterHTML()));
                createdElement = refElement ? vnode._insertBefore(oneItem.vnode, refElement.vnode) : vnode._appendChild(oneItem.vnode);
                // CAUTIOUS: when using TextNodes, they might get merged (vnode._normalize does this), which leads into disappearance of refElement:
                refElement = createdElement;
            };
            vnode._noSync()._normalizable(false);
            if (!refElement) {
                vChildNodes = vnode.vChildNodes;
                vRefElement = vChildNodes && vChildNodes[0];
                refElement = vRefElement && vRefElement.domNode;
            }
            (typeof content===STRING) && (content=htmlToVFragments(content));
            if (content.isFragment) {
                vnodes = content.vnodes;
                len = vnodes.length;
                // to manage TextNodes which might get merged, we loop downwards:
                for (i=len-1; i>=0; i--) {
                    doPrepend(vnodes[i].domNode);
                }
            }
            else if (Array.isArray(content)) {
                len = content.length;
                // to manage TextNodes which might get merged, we loop downwards:
                for (i=len-1; i>=0; i--) {
                    item = content[i];
                    doPrepend(item);
                }
            }
            else {
                doPrepend(content);
            }
            vnode._normalizable(true)._normalize();
            return createdElement;
        };

        /**
         * Reference to the previous of sibbling Element, where the related dom-node is an Element(nodeType===1).
         *
         * @method previous
         * @param [cssSelector] {String} css-selector to be used as a filter
         * @return {Element|null}
         * @type Element
         * @since 0.0.1
         */
        ElementPrototype.previous = function(cssSelector) {
            var vnode = this.vnode,
                found, vPreviousElement, firstCharacter, i, len;
            if (!cssSelector) {
                vPreviousElement = vnode.vPreviousElement;
                return vPreviousElement && vPreviousElement.domNode;
            }
            else {
                i = -1;
                len = cssSelector.length;
                while (!firstCharacter && (++i<len)) {
                    firstCharacter = cssSelector[i];
                    (firstCharacter===' ') && (firstCharacter=null);
                }
                if (firstCharacter==='>') {
                    return null;
                }
            }
            vPreviousElement = vnode;
            do {
                vPreviousElement = vPreviousElement.vPreviousElement;
                found = vPreviousElement && vPreviousElement.matchesSelector(cssSelector);
            } while(vPreviousElement && !found);
            return found ? vPreviousElement.domNode : null;
        };

        /**
         * Returns the first Element within the Element, that matches the CSS-selectors. You can pass one, or multiple CSS-selectors. When passed multiple,
         * they need to be separated by a `comma`.
         *
         * @method querySelector
         * @param selectors {String} CSS-selector(s) that should match
         * @return {Element}
         */
        ElementPrototype.querySelector = function(selectors) {
            var found,
                i = -1,
                len = selectors.length,
                firstCharacter, startvnode,
                thisvnode = this.vnode,
                inspectChildren = function(vnode) {
                    var vChildren = vnode.vChildren,
                        len2 = vChildren ? vChildren.length : 0,
                        j, vChildNode;
                    for (j=0; (j<len2) && !found; j++) {
                        vChildNode = vChildren[j];
                        vChildNode.matchesSelector(selectors, thisvnode) && (found=vChildNode.domNode);
                        found || inspectChildren(vChildNode);
                    }
                };
            while (!firstCharacter && (++i<len)) {
                firstCharacter = selectors[i];
                (firstCharacter===' ') && (firstCharacter=null);
            }
            startvnode = SIBLING_MATCH_CHARACTER[firstCharacter] ? thisvnode.vParent : thisvnode;
            startvnode && inspectChildren(startvnode);
            return found;
        };

        /**
         * Returns an ElementArray of all Elements within the Element, that match the CSS-selectors. You can pass one, or multiple CSS-selectors. When passed multiple,
         * they need to be separated by a `comma`.
         *
         * querySelectorAll is a snapshot of the dom at the time this method was called. It is not updated when changes of the dom are made afterwards.
         *
         * @method querySelectorAll
         * @param selectors {String} CSS-selector(s) that should match
         * @return {ElementArray} non-life Array (snapshot) with Elements
         */
        ElementPrototype.querySelectorAll = function(selectors) {
            var found = ElementArray.createArray(),
                i = -1,
                len = selectors.length,
                firstCharacter, startvnode,
                thisvnode = this.vnode,
                inspectChildren = function(vnode) {
                    var vChildren = vnode.vChildren,
                        len2 = vChildren ? vChildren.length : 0,
                        j, vChildNode;
                    for (j=0; j<len2; j++) {
                        vChildNode = vChildren[j];
                        vChildNode.matchesSelector(selectors, thisvnode) && (found[found.length]=vChildNode.domNode);
                        inspectChildren(vChildNode);
                    }
                };
            while (!firstCharacter && (++i<len)) {
                firstCharacter = selectors[i];
                (firstCharacter===' ') && (firstCharacter=null);
            }
            startvnode = SIBLING_MATCH_CHARACTER[firstCharacter] ? thisvnode.vParent : thisvnode;
            startvnode && inspectChildren(startvnode);
            return found;
        };

       /**
         * Checks whether the Element has its rectangle inside the outbound-Element.
         * This is no check of the DOM-tree, but purely based upon coordinates.
         *
         * @method rectangleInside
         * @param outboundElement {Element} the Element where this element should lie inside
         * @return {Boolean} whether the Element lies inside the outboundElement
         * @since 0.0.1
         */
        ElementPrototype.rectangleInside = function(outboundElement) {
            var instance = this,
                outerRect = outboundElement.getBoundingClientRect(),
                innerRect = instance.getBoundingClientRect();
            return (outerRect.left<=innerRect.left) &&
                   (outerRect.top<=innerRect.top) &&
                   ((outerRect.left+outboundElement.offsetWidth)>=(innerRect.left+instance.offsetWidth)) &&
                   ((outerRect.top+outboundElement.offsetHeight)>=(innerRect.top+instance.offsetHeight));
        };

       /**
        * Removes the Element from the DOM.
        * Alias for thisNode.parentNode.removeChild(thisNode);
        *
        * @method remove
        * @return {Node} the DOM-node that was removed. You could re-insert it at a later time.
        * @since 0.0.1
        */
        ElementPrototype.remove = function() {
            var instance = this,
                vnode = instance.vnode,
                vParent = vnode.vParent;
            vParent && vParent._removeChild(vnode);
            return instance;
        };

       /**
        * Removes the attribute from the Element.
        *
        * Alias for removeAttribute() BUT is chainable instead (removeAttribute is not).
        *
        * @method removeAttr
        * @param attributeName {String}
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeAttr = function(/* attributeName */) {
            this.removeAttribute.apply(this, arguments);
            return this;
        };

       /**
        * Removes the attribute from the Element.
        *
        * Use removeAttr() to be able to chain.
        *
        * @method removeAttr
        * @param attributeName {String}
        * @since 0.0.1
        */
        ElementPrototype._removeAttribute = ElementPrototype.removeAttribute;
        ElementPrototype.removeAttribute = function(attributeName) {
            this.vnode._removeAttr(attributeName);
        };

        /**
        * Removes the Element's child-Node from the DOM.
        *
        * @method removeChild
        * @param domNode {Node} the child-Node to remove
        * @return {Node} the DOM-node that was removed. You could re-insert it at a later time.
        */
        ElementPrototype._removeChild = ElementPrototype.removeChild;
        ElementPrototype.removeChild = function(domNode) {
            var instance = this;
            instance.vnode._removeChild(domNode.vnode);
            return instance;
        };

       /**
        * Removes a className from the Element.
        *
        * @method removeClass
        * @param className {String|Array} the className that should be removed. May be an Array of classNames.
        * @param [returnPromise] {Boolean} whether to return a Promise instead of `this`, which might be useful in case of
        *        transition-properties. The promise will fullfil when the transition is ready, or immediately when no transitioned.
        * @param [transitionFix] set this to `true` if you experience transition-problems due to wrong calculated css (mostly because of the `auto` value)
        *        Setting this parameter, will calculate the true css of the transitioned properties and set this temporarely inline, to fix the issue.
        *        Don't use it when not needed, it has a slightly performancehit.
        *        No need to set when `returnPromise` is set --> returnPromise always handles the transitionFix.
        * @return {Promise|this} In case `returnPromise` is set, a Promise returns with the next handles:
        *        <ul>
        *            <li>cancel() {Promise}</li>
        *            <li>freeze() {Promise}</li>
        *            <li>unfreeze()</li>
        *            <li>finish() {Promise}</li>
        *        </ul>
        *        These handles resolve with the `elapsed-time` as first argument of the callbackFn
        * @since 0.0.1
        */
        ElementPrototype.removeClass = function(className, returnPromise, transitionFix) {
            var instance = this,
                transPromise = (returnPromise || transitionFix) && getClassTransPromise(instance, REMOVE, className),
                returnValue = returnPromise ? transPromise : instance;
            transPromise || instance.getClassList().remove(className);
            return returnValue;
        };

       /**
        * Removes data specified by `key` that was set by using `setData()`.
        * When no arguments are passed, all node-data (key-value pairs) will be removed.
        *
        * @method removeData
        * @param key {string} name of the key
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeData = function(key) {
            var vnode = this.vnode;
            if (vnode._data) {
                if (key) {
                    delete vnode._data[key];
                }
                else {
                    // we cannot just redefine _data, for it is set as readonly
                    vnode._data.each(
                        function(value, key) {
                            delete vnode._data[key];
                        }
                    );
                }
            }
            return this;
        };

       /**
        * Removes the Elment's `id`.
        *
        * @method removeId
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeId = function() {
            return this.removeAttr('id');
        };

       /**
        * Removes a css-property (inline) out of the Element.
        * No need to use camelCase.
        *
        * @method removeInlineStyle
        * @param cssProperty {String} the css-property to remove
        * @param [pseudo] {String} to look inside a pseudo-style
        * @param [returnPromise] {Boolean} whether to return a Promise instead of `this`, which might be useful in case of
        *        transition-properties. The promise will fullfil when the transition is ready, or immediately when no transitioned.
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeInlineStyle = function(cssProperty, pseudo, returnPromise) {
            return this.removeInlineStyles({property: cssProperty, pseudo: pseudo}, returnPromise);
        };

       /**
        * Removes multiple css-properties (inline) out of the Element. You need to supply an Array of Objects, with the properties:
        *        <ul>
        *            <li>property  {String}</li>
        *            <li>pseudo  {String}</li>
        *        <ul>
        * No need to use camelCase.
        *
        * @method removeInlineStyles
        * @param cssProperties {Array|Object} Array of objects, Strings (or 1 Object/String).
        *       When String, then speduo is considered as undefined. When `Objects`, they need the properties:
        *        <ul>
        *            <li>property  {String}</li>
        *            <li>pseudo  {String}</li>
        *        <ul>
        * @param [returnPromise] {Boolean} whether to return a Promise instead of `this`, which might be useful in case of
        *        transition-properties. The promise will fullfil when the transition is ready, or immediately when no transitioned.
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeInlineStyles = function(cssProperties, returnPromise) {
            // There will be 3 sets of styles:
            // `fromStyles` --> the current styles, only exactly calculated -without `auto`- (that is, for the transitioned properties)
            // `toStylesExact` --> the new styles, exactly calculated -without `auto`- (that is, for the transitioned properties)
            // `vnodeStyles` --> the new styles as how they should be in the end (f.i. with `auto`)
            var instance = this,
                vnode = instance.vnode,
                removed = [],
                transCount = 0,
                transitionProperties = {},
                maxtranstime = 0,
                needSync, prop, styles, i, len, item, hasTransitionedStyle, promise, vnodeStyles,
                pseudo, group, clonedElement, fromStyles, toStylesExact, value, transproperty, transtime;

            Array.isArray(cssProperties) || (cssProperties=[cssProperties]);
            cssProperties = getVendorCSS(cssProperties);
            len = cssProperties.length;
            vnodeStyles = vnode.styles;
            for (i=0; i<len; i++) {
                item = cssProperties[i];
                if (typeof item==='string') {
                    item = cssProperties[i] = {
                        property: item
                    };
                }
                pseudo = item.pseudo;
                group = pseudo || 'element';
                styles = vnodeStyles[group];
                if (styles) {
                    prop = item.property;
                    // if property is vendor-specific transition, or transform, than we reset it to the current vendor
                    if (styles[prop]) {
                        fromStyles || (fromStyles=vnodeStyles.deepClone());
                        needSync = true;
                        if ((prop!==VENDOR_TRANSITION_PROPERTY) && instance.hasTransition(prop, pseudo)) {
                            // store the calculated value:
                            fromStyles[group] || (fromStyles[group]={});
                            (prop===VENDOR_TRANSFORM_PROPERTY) || (fromStyles[group][prop]=instance.getStyle(prop, group));
                            hasTransitionedStyle = true;
                            removed[removed.length] = {
                                group: group,
                                property: prop,
                                pseudo: pseudo
                            };
                        }
                        delete styles[prop];
                        (styles.size()===0) && (delete vnode.styles[pseudo || 'element']);
                    }
                }
            }

            RUNNING_ON_NODE && (hasTransitionedStyle=false);
            if (hasTransitionedStyle) {
                // fix the current style with what is actual calculated:
                vnode.styles = fromStyles; // exactly styles, so we can transition well
                instance.setClass(NO_TRANS);
                instance.setAttr(STYLE, vnode.serializeStyles());
                async(function() {
                    // needs to be done in the next eventcyle, otherwise webkit-browsers miscalculate the syle (with transition on)
                    instance.removeClass(NO_TRANS);
                });

                // now calculate the final value
                clonedElement = instance.cloneNode(true);
                toStylesExact = vnodeStyles.deepClone();
                clonedElement.vnode.styles = toStylesExact;
                clonedElement.setAttr(STYLE, clonedElement.vnode.serializeStyles());
                clonedElement.setClass(INVISIBLE);
                DOCUMENT.body.append(clonedElement);
                // clonedElement has `vnodeStyles`, but we change them into `toStylesExact`

                len = removed.length;
                for (i=0; i<len; i++) {
                    item = removed[i];
                    prop = item.property;
                    group = item.pseudo || 'element';
                    if (!NON_CLONABLE_STYLES[prop]) {
                        value = (prop===VENDOR_TRANSFORM_PROPERTY) ? clonedElement.getInlineStyle(prop, item.pseudo) : clonedElement.getStyle(prop, item.pseudo);
                        if (value) {
                            toStylesExact[group] || (toStylesExact[group]={});
                            toStylesExact[group][prop] = value;
                        }
                    }
                    // look if we really have a change in the value:

                    if (toStylesExact[group] && (toStylesExact[group][prop]!==fromStyles[group][prop])) {
                        transproperty = instance.getTransition(prop, (group==='element') ? null : group);
                        transtime = transproperty.delay+transproperty.duration;
                        maxtranstime = Math.max(maxtranstime, transtime);
                        if (transtime>0) {
                            transCount++;
                            // TODO: transitionProperties supposes that we DO NOT have pseudo transitions!
                            // as soon we do, we need to split this object for each 'group'
                            transitionProperties[prop] = true;
                        }
                    }
                }
                hasTransitionedStyle = (transCount>0);
                clonedElement.remove();
            }
            if (needSync) {
                if (returnPromise || hasTransitionedStyle) {
                    promise = window.Promise.manage();
                    // need to call `setAttr` in a next event-cycle, otherwise the eventlistener made
                    // by `getTransPromise gets blocked.
                    async(function() {
                        if (hasTransitionedStyle) {
                            // reset
                            vnode.styles = toStylesExact;
                            promise.then(function() {
                                vnode.styles = vnodeStyles; // finally values, not exactly calculated, but as is passed through
                                instance.setClass(NO_TRANS);
                                instance.setAttr(STYLE, vnode.serializeStyles());
                            }).finally(function() {
                                async(function() {
                                    instance.removeClass(NO_TRANS);
                                    // webkit browsers seems to need to recalculate their set width:
                                    instance.getBoundingClientRect();
                                });
                            });
                        }
                        else {
                            vnode.styles = vnodeStyles; // finally values, not exactly calculated, but as is passed through
                        }
                        getTransPromise(instance, hasTransitionedStyle, null, transCount, transitionProperties, maxtranstime).then(
                            promise.fulfill
                        ).catch(promise.reject);
                        instance.setAttr(STYLE, vnode.serializeStyles());
                    });
                }
                else {
                    vnode.styles = vnodeStyles; // finally values, not exactly calculated, but as is passed through
                    instance.setAttr(STYLE, vnode.serializeStyles());
                    // webkit browsers seems to need to recalculate their set width:
                    instance.getBoundingClientRect();
                }
            }
            // else
            return returnPromise ? (promise || window.Promise.resolve()) : instance;
        };

       /**
        * Removes a subtype `transform`-css-property of (inline) out of the Element.
        * This way you can sefely remove partial `transform`-properties while remaining the
        * other inline `transform` css=properties.
        *
        * See more about tranform-properties: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
        *
        * @method removeInlineTransition
        * @param transitionProperty {String} the css-transform property to remove
        * @param [pseudo] {String} to look inside a pseudo-style
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeInlineTransition = function(transitionProperty, pseudo) {
            return this.removeInlineTransitions({property: transitionProperty, pseudo: pseudo});
        };

       /**
        * Removes multiple subtype `transform`-css-property of (inline) out of the Element.
        * This way you can sefely remove partial `transform`-properties while remaining the
        * other inline `transform` css=properties.
        * You need to supply an Array of Objects, with the properties:
        *        <ul>
        *            <li>property  {String}</li>
        *            <li>pseudo  {String}</li>
        *        <ul>
        *
        * See more about tranform-properties: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
        *
        * @method removeInlineTransitions
        * @param transitionProperties {Array|Object} the css-transform properties to remove
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeInlineTransitions = function(transitionProperties) {
            var instance = this,
                vnode = instance.vnode,
                styles = vnode.styles,
                groupStyle, transitionStyles, i, len, item, needSync, transitionProperty, pseudo;

            if (styles) {
                Array.isArray(transitionProperties) || (transitionProperties=[transitionProperties]);
                transitionProperties = getVendorCSS(transitionProperties);
                len = transitionProperties.length;
                for (i=0; i<len; i++) {
                    item = transitionProperties[i];
                    pseudo = item.pseudo;
                    groupStyle = styles && styles[pseudo || 'element'];
                    transitionStyles = groupStyle && groupStyle[VENDOR_TRANSITION_PROPERTY];
                    if (transitionStyles) {
                        transitionProperty = item.property;
                        if (transitionStyles[transitionProperty]) {
                            delete transitionStyles[transitionProperty];
                            (transitionStyles.size()===0) && (delete groupStyle[VENDOR_TRANSITION_PROPERTY]);
                            (styles.size()===0) && (delete vnode.styles[pseudo || 'element']);
                            needSync = true;
                        }
                    }
                }
            }
            needSync && instance.setAttr(STYLE, vnode.serializeStyles());
            return instance;
        };

       /**
        * Replaces the Element with a new Element.
        *
        * @method replace
        * @param content {Element|Element|ElementArray|String} content to replace
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @return {Element} the created Element (or the last when multiple)
        * @since 0.0.1
        */
        ElementPrototype.replace = function(newElement, escape) {
            var instance = this,
                vnode = instance.vnode,
                previousVNode = vnode.vPrevious,
                vParent = vnode.vParent,
                createdElement;
            createdElement = previousVNode ? vParent.domNode.append(newElement, escape, previousVNode.domNode) : vParent.domNode.prepend(newElement, escape);
            instance.setClass(HIDDEN);
            instance.remove();
            return createdElement;
        };

        /**
        * Replaces the Element's child-Element with a new Element.
        *
        * @method replaceChild
        * @param newElement {Element} the new Element
        * @param oldVChild {Element} the Element to be replaced
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @return {Element} the Element that was removed (equals oldVChild)
        * @since 0.0.1
        */
        ElementPrototype._replaceChild = ElementPrototype.replaceChild;
        ElementPrototype.replaceChild = function(newDomNode, oldDomNode, escape) {
            return oldDomNode.replace(newDomNode, escape);
        };

       /**
        * Replaces the className of the Element with a new className.
        * If the previous className is not available, the new className is set nevertheless.
        *
        * @method replaceClass
        * @param prevClassName {String} the className to be replaced
        * @param newClassName {String} the className to be set
        * @param [force ] {Boolean} whether the new className should be set, even is the previous className isn't there
        * @param [returnPromise] {Boolean} whether to return a Promise instead of `this`, which might be useful in case of
        *        transition-properties. The promise will fullfil when the transition is ready, or immediately when no transitioned.
        * @param [transitionFix] set this to `true` if you experience transition-problems due to wrong calculated css (mostly because of the `auto` value)
        *        Setting this parameter, will calculate the true css of the transitioned properties and set this temporarely inline, to fix the issue.
        *        Don't use it when not needed, it has a slightly performancehit.
        *        No need to set when `returnPromise` is set --> returnPromise always handles the transitionFix.
        * @return {Promise|this} In case `returnPromise` is set, a Promise returns with the next handles:
        *        <ul>
        *            <li>cancel() {Promise}</li>
        *            <li>freeze() {Promise}</li>
        *            <li>unfreeze()</li>
        *            <li>finish() {Promise}</li>
        *        </ul>
        *        These handles resolve with the `elapsed-time` as first argument of the callbackFn
        * @since 0.0.1
        */
        ElementPrototype.replaceClass = function(prevClassName, newClassName, force, returnPromise, transitionFix) {
            var instance = this,
                transPromise = (returnPromise || transitionFix) && getClassTransPromise(instance, REPLACE, newClassName, prevClassName, force),
                returnValue;
            if (force || instance.hasClass(prevClassName)) {
                returnValue = returnPromise ? transPromise : instance;
                transPromise || instance.removeClass(prevClassName).setClass(newClassName);
                return returnValue;
            }
            return returnPromise ? window.Promise.resolve() : instance;
        };

        /**
         * Scrolls the content of the Element into the specified scrollposition.
         * Only available when the Element has overflow.
         *
         * @method scrollTo
         * @param x {Number} left-offset in pixels
         * @param y {Number} top-offset in pixels
         * @chainable
         * @since 0.0.1
        */
        ElementPrototype.scrollTo = function(x, y) {
            var instance = this;
            instance.scrollLeft = x;
            instance.scrollTop = y;
            return instance;
        };

       /**
         * Sets the attribute on the Element with the specified value.
         *
         * Alias for setAttribute(), BUT differs in a way that setAttr is chainable, setAttribute is not.
         *
         * @method setAttr
         * @param attributeName {String}
         * @param value {Any} the value that belongs to `key`
         * @chainable
         * @since 0.0.1
        */
        ElementPrototype.setAttr = function(/* attributeName, value */) {
            var instance = this;
            instance.setAttribute.apply(instance, arguments);
            return instance;
        };

       /**
         * Sets the attribute on the Element with the specified value.
         *
         * Alias for setAttr(), BUT differs in a way that setAttr is chainable, setAttribute is not.
         *
         * @method setAttribute
         * @param attributeName {String}
         * @param value {String} the value for the attributeName
        */
        ElementPrototype._setAttribute = ElementPrototype.setAttribute;
        ElementPrototype.setAttribute = function(attributeName, value) {
            var instance = this,
                vnode = instance.vnode;
            (value==='') && (value=null);
            ((value!==null) && (value!==undefined)) ? vnode._setAttr(attributeName, value) : vnode._removeAttr(attributeName);
        };

       /**
         * Sets multiple attributes on the Element with the specified value.
         * The argument should be one ore more Objects with the properties: `name` and `value`
         *
         * @example
         * instance.setAttrs([
         *                      {name: 'tabIndex', value: '0'},
         *                      {name: 'style', value: 'color: #000;'}
         *                  ]);
         *
         * @method setAttrs
         * @param attributeData {Array|Object}
         * @chainable
         * @since 0.0.1
        */
        ElementPrototype.setAttrs = function(attributeData) {
            var instance = this;
            Array.isArray(attributeData) || (attributeData=[attributeData]);
            attributeData.forEach(function(item) {
                instance.setAttribute(item.name, item.value);
            });
            return instance;
        };

       /**
        * Adds a class to the Element. If the class already exists it won't be duplicated.
        *
        * @method setClass
        * @param className {String|Array} className to be added, may be an array of classNames
        * @param [returnPromise] {Boolean} whether to return a Promise instead of `this`, which might be useful in case of
        *        transition-properties. The promise will fullfil when the transition is ready, or immediately when no transitioned.
        * @param [transitionFix] set this to `true` if you experience transition-problems due to wrong calculated css (mostly because of the `auto` value)
        *        Setting this parameter, will calculate the true css of the transitioned properties and set this temporarely inline, to fix the issue.
        *        Don't use it when not needed, it has a slightly performancehit.
        *        No need to set when `returnPromise` is set --> returnPromise always handles the transitionFix.
        * @return {Promise|this} In case `returnPromise` is set, a Promise returns with the next handles:
        *        <ul>
        *            <li>cancel() {Promise}</li>
        *            <li>freeze() {Promise}</li>
        *            <li>unfreeze()</li>
        *            <li>finish() {Promise}</li>
        *        </ul>
        *        These handles resolve with the `elapsed-time` as first argument of the callbackFn
        * @since 0.0.1
        */
        ElementPrototype.setClass = function(className, returnPromise, transitionFix) {
            var instance = this,
                transPromise = (returnPromise || transitionFix) && getClassTransPromise(instance, SET, className),
                returnValue = returnPromise ? transPromise : instance;
            transPromise || instance.getClassList().add(className);
            return returnValue;
        };

        /**
         * Stores arbitary `data` at the Element (actually at vnode). This has nothing to do with node-attributes whatsoever,
         * it is just a way to bind any data to the specific Element so it can be retrieved later on with `getData()`.
         *
         * @method setData
         * @param key {string} name of the key
         * @param value {Any} the value that belongs to `key`
         * @chainable
         * @since 0.0.1
        */
        ElementPrototype.setData = function(key, value) {
            var vnode = this.vnode;
            if (value!==undefined) {
                vnode._data ||  Object.defineProperty(vnode, '_data', {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: {} // `writable` is false means we cannot chance the value-reference, but we can change {}'s properties itself
                });
                vnode._data[key] = value;
            }
            return this;
        };

        /**
         * Sets the innerHTML of both the vnode as well as the representing dom-node.
         * Goes through the vdom, so it's superfast.
         *
         * Use this method instead of `innerHTML`
         *
         * Syncs with the DOM.
         *
         * @method setHTML
         * @param val {String} the new value to be set
         * @chainable
         * @since 0.0.1
         */
        ElementPrototype.setHTML = function(val) {
            this.vnode.innerHTML = val;
            return this;
        };

       /**
        * Sets the Elments `id`
        *
        * @method setId
        * @param val {String} Elements new `id`
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setId = function(val) {
            return this.setAttr('id', val);
        };

       /**
        * Sets a css-property (inline) for the Element.
        *
        * Note1: Do not use vendor-specific properties, but general (like `transform` instead of `-webkit-transform`)
        *        This method will use the appropriate css-property.
        * Note2: no need to camelCase cssProperty: both `margin-left` as well as `marginLeft` are fine
        *
        * @method setInlineStyle
        * @param cssProperty {String} the css-property to be set
        * @param value {String} the css-value
        * @param [pseudo] {String} to look inside a pseudo-style
        * @param [returnPromise] {Boolean} whether to return a Promise instead of `this`, which might be useful in case of
        *        transition-properties. The promise will fullfil when the transition is ready, or immediately when no transitioned.
        * @return {Promise|this}
        * @since 0.0.1
        */
        ElementPrototype.setInlineStyle = function(cssProperty, value, pseudo, returnPromise) {
            if (typeof pseudo==='boolean') {
                returnPromise = pseudo;
                pseudo = null;
            }
            return this.setInlineStyles([{property: cssProperty, value: value, pseudo: pseudo}], returnPromise);
        };

       /**
        * Sets multiple css-properties (inline) for the Element at once.
        *
        * Note1: Do not use vendor-specific properties, but general (like `transform` instead of `-webkit-transform`)
        *        This method will use the appropriate css-property.
        * Note2: no need to camelCase cssProperty: both `margin-left` as well as `marginLeft` are fine
        *
        * @method setInlineStyles
        * @param cssProperties {Array|Object} the css-properties to be set, specified as an Array of Objects, or 1 Object.
        *        The objects should have the next properties:
        *        <ul>
        *            <li>property  {String}</li>
        *            <li>value  {String}</li>
        *            <li>pseudo  {String} (optional) --> not: not supported yet in browsers</li>
        *        </ul>
        * @param [returnPromise] {Boolean} whether to return a Promise instead of `this`, which might be useful in case of
        *        transition-properties. The promise will fullfil when the transition is ready, or immediately when no transitioned.
        * @return {Promise|this}
        * @since 0.0.1
        */
        ElementPrototype.setInlineStyles = function(cssProperties, returnPromise) {
            // There will be 3 sets of styles:
            // `fromStyles` --> the current styles, only exactly calculated -without `auto`- (that is, for the transitioned properties)
            // `toStylesExact` --> the new styles, exactly calculated -without `auto`- (that is, for the transitioned properties)
            // `vnodeStyles` --> the new styles as how they should be in the end (f.i. with `auto`)
            var instance = this,
                vnode = instance.vnode,
                transitionedProps = [],
                transCount = 0,
                maxtranstime = 0,
                transitionProperties = {},
                // third argument is a hidden feature --> used by getClassTransPromise()
                avoidBackup = arguments[2],
                styles, group, i, len, item, promise, hasTransitionedStyle, property, hasChanged, transtime,
                pseudo, fromStyles, value, vnodeStyles, toStylesExact, clonedElement, transproperty;

            // if there is a class-transition going on (initiated by getClassTransPromise),
            // the we might need to update the internal bkpNode:
            if (!avoidBackup && vnode._data) {
                // there might be more bkpNodes, so we need to loop through the data:
                vnode._data.each(function(bkpNode, key) {
                    if (key.startsWith('bkpNode')) {
                        bkpNode.setInlineStyles(cssProperties, null, true);
                    }
                });
            }

            Array.isArray(cssProperties) || (cssProperties=[cssProperties]);
            cssProperties = getVendorCSS(cssProperties);
            len = cssProperties.length;
            vnode.styles || (vnode.styles={});
            vnodeStyles = vnode.styles;
            // Both `from` and `to` ALWAYS need to be set to their calculated value --> this makes transition
            // work with `auto`, or when the page isn't completely loaded
            // First: backup the actual style:
            fromStyles = vnodeStyles.deepClone();
            for (i=0; i<len; i++) {
                item = cssProperties[i];
                pseudo = item.pseudo;
                group = pseudo || 'element';
                vnodeStyles[group] || (vnodeStyles[group]={});
                styles = vnodeStyles[group];
                property = fromCamelCase(item.property);
                value = item.value;

                (property===VENDOR_TRANSITION_PROPERTY) && (value=extractor.toTransitionObject(value));
                if (value===undefined) {
                    delete styles[property];
                }
                else {
                    styles[property] = value;
                }
                if ((property!==VENDOR_TRANSITION_PROPERTY) && instance.hasTransition(property, pseudo)) {
                    fromStyles[group] || (fromStyles[group]={});
                    (property===VENDOR_TRANSFORM_PROPERTY) || (fromStyles[group][property]=instance.getStyle(property, pseudo));
                    if (fromStyles[group][property]!==value) {
                        transproperty = instance.getTransition(property, (group==='element') ? null : group);
                        transtime = transproperty.delay+transproperty.duration;
                        maxtranstime = Math.max(maxtranstime, transtime);
                        if (transtime>0) {
                            hasTransitionedStyle = true;
                            transCount++;
                            // TODO: transitionProperties supposes that we DO NOT have pseudo transitions!
                            // as soon we do, we need to split this object for each 'group'
                            transitionProperties[property] = true;
                            transitionedProps[transitionedProps.length] = {
                                group: group,
                                property: property,
                                value: value,
                                pseudo: pseudo
                            };
                        }
                    }
                }
            }
            RUNNING_ON_NODE && (hasTransitionedStyle=false);
            if (hasTransitionedStyle) {
                // we forced set the exact initial css inline --> this is the only way to make a right transition
                // under all circumstances
                toStylesExact = vnodeStyles.deepClone();
                clonedElement = instance.cloneNode(true); // cloned with `vnodeStyles`
                clonedElement.vnode.styles = toStylesExact;
                // fix the current style with what is actual calculated:
                vnode.styles = fromStyles; // exactly styles, so we can transition well
                instance.setClass(NO_TRANS);
                instance.setAttr(STYLE, vnode.serializeStyles());
                async(function() {
                    // needs to be done in the next eventcyle, otherwise webkit-browsers miscalculate the syle (with transition on)
                    instance.removeClass(NO_TRANS);
                });

                // clonedElement has `vnodeStyles`, but we change them into `toStylesExact`
                clonedElement.setClass(INVISIBLE);
                clonedElement.setAttr(STYLE, clonedElement.vnode.serializeStyles());
                DOCUMENT.body.append(clonedElement);

                // now calculate the `transition` styles and store them in the css-property of `toStylesExact`:
                len = transitionedProps.length;
                hasChanged = false;
                for (i=0; i<len; i++) {
                    item = transitionedProps[i];
                    property = item.property;
                    group = item.pseudo || 'element';
                    if (!NON_CLONABLE_STYLES[property]) {
                        value = (property===VENDOR_TRANSFORM_PROPERTY) ? clonedElement.getInlineStyle(property, item.pseudo) : clonedElement.getStyle(property, item.pseudo);
                        if (value) {
                            toStylesExact[group] || (toStylesExact[group]={});
                            toStylesExact[group][property] = value;
                        }
                    }
                    // look if we really have a change in the value:
                    if (!hasChanged && toStylesExact[group]) {
                        hasChanged = (toStylesExact[group][property]!==fromStyles[group][property]);
                    }
                }
                clonedElement.remove();
                hasTransitionedStyle = hasChanged;
            }
            RUNNING_ON_NODE && (hasTransitionedStyle=false);
            if (returnPromise || hasTransitionedStyle) {
                promise = window.Promise.manage();
                // need to call `setAttr` in a next event-cycle, otherwise the eventlistener made
                // by `getTransPromise gets blocked.
                async(function() {
                    if (hasTransitionedStyle) {
                        // reset
                        vnode.styles = toStylesExact;
                        promise.then(function() {

                            vnode.styles = vnodeStyles; // finally values, not exactly calculated, but as is passed through
                            instance.setClass(NO_TRANS);
                            instance.setAttr(STYLE, vnode.serializeStyles());
                        }).finally(function() {
                            async(function() {
                                // needs to be done in the next eventcyle, otherwise webkit-browsers miscalculate the syle (with transition on)
                                instance.removeClass(NO_TRANS);
                                // webkit browsers seems to need to recalculate their set width:
                                instance.getBoundingClientRect();
                            });
                        });
                    }
                    else {
                        vnode.styles = vnodeStyles; // finally values, not exactly calculated, but as is passed through
                    }
                    getTransPromise(instance, hasTransitionedStyle, null, transCount, transitionProperties, maxtranstime).then(
                        function() {
                            promise.fulfill();
                        }
                    ).catch(promise.reject);
                    instance.setAttr(STYLE, vnode.serializeStyles());
                });
                return returnPromise ? promise : instance;
            }
            // else
            vnode.styles = vnodeStyles; // finally values, not exactly calculated, but as is passed through
            instance.setAttr(STYLE, vnode.serializeStyles());
            // webkit browsers seems to need to recalculate their set width:
            instance.getBoundingClientRect();
            return instance;
        };

       /**
        * Sets a transform-css-property (inline) for the Element.
        *
        * See more about transitions: https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transitions
        *
        * @method setStyle
        * @param setInlineTransition {String} the css-property to be set, f.e. `translateX`
        * @param duration {Number} the duration in seconds (may be a broken number, like `0.5`)
        * @param [timingFunction] {String} See https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function
        * @param delay {Number} the delay in seconds (may be a broken number, like `0.5`)
        * @param [pseudo] {String} to look inside a pseudo-style
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setInlineTransition = function(transitionProperty, duration, timingFunction, delay, pseudo) {
            // transition-example: transition: width 2s, height 2s, transform 2s;
            return this.setInlineTransitions({property: transitionProperty, duration: duration, timingFunction: timingFunction, delay: delay, pseudo: pseudo});
        };

       /**
        * Sets a transform-css-property (inline) for the Element.
        *
        * See more about transitions: https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transitions
        *
        * @method setStyle
        * @param transitionProperties {Array} the css-transition-properties to be set, specified as an Array of Objects.
        *        The objects should have the next properties:
        *        <ul>
        *            <li>property  {String}</li>
        *            <li>duration  {Number}</li>
        *            <li>timingFunction  {String} (optional)</li>
        *            <li>delay  {Number} (optional)</li>
        *            <li>pseudo  {String} (optional)</li>
        *        </ul>
        * @param [pseudo] {String} to look inside a pseudo-style
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setInlineTransitions = function(transitionProperties) {
            // transition-example: transition: width 2s, height 2s, transform 2s;
            var instance = this,
                vnode = instance.vnode,
                transitionStyles, transitionProperty, group, trans, i, len, item;
            Array.isArray(transitionProperties) || (transitionProperties=[transitionProperties]);
            transitionProperties = getVendorCSS(transitionProperties);
            len = transitionProperties.length;
            vnode.styles || (vnode.styles={});
            for (i=0; i<len; i++) {
                item = transitionProperties[i];
                if (item.property) {
                    group = item.pseudo || 'element';
                    vnode.styles[group] || (vnode.styles[group]={});
                    vnode.styles[group][VENDOR_TRANSITION_PROPERTY] || (vnode.styles[group][VENDOR_TRANSITION_PROPERTY]={});
                    transitionStyles = vnode.styles[group][VENDOR_TRANSITION_PROPERTY];
                    transitionProperty = fromCamelCase(item.property);
                    trans = transitionStyles[transitionProperty] = {
                        duration: item.duration
                    };
                    item.timingFunction && (trans.timingFunction=item.timingFunction);
                    item.delay && (trans.delay=item.delay);
                }
            }
            instance.setAttr(STYLE, vnode.serializeStyles());
            return instance;
        };

        /**
         * Gets or sets the outerHTML of both the Element as well as the representing dom-node.
         * Goes through the vdom, so it's superfast.
         *
         * Use this property instead of `outerHTML`
         *
         * Syncs with the DOM.
         *
         * @method setOuterHTML
         * @param val {String} the new value to be set
         * @chainable
         * @since 0.0.1
         */
        ElementPrototype.setOuterHTML = function(val) {
            this.vnode.outerHTML = val;
            return this;
        };

        /**
         * Sets the innerContent of the Element as plain text.
         * Goes through the vdom, so it's superfast.
         *
         * Use this method instead of `textContent`
         *
         * Syncs with the DOM.
         *
         * @method setText
         * @param val {String} the textContent to be set
         * @chainable
         * @since 0.0.1
         */
        ElementPrototype.setText = function(val) {
            this.vnode.textContent = val;
            return this;
        };

       /**
        * Sets the value of the following Elements:
        *
        * <ul>
        *     <li>input</li>
        *     <li>textarea</li>
        *     <li>select</li>
        *     <li>any container that is `contenteditable`</li>
        * </ul>
        *
        * Will emit a `valuechange`-event when a new value is set and ITSA's `event`-module is active.
        *
        * @method setValue
        * @param val {String} thenew value to be set
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setValue = function(val) {
            var instance = this,
                prevVal = instance.value,
                contenteditable = instance.vnode.attrs.contenteditable,
            // cautious: input and textarea must be accessed by their propertyname:
            // input.getAttribute('value') would return the defualt-value instead of actusl
            // and textarea.getAttribute('value') doesn't exist
                editable = contenteditable && (contenteditable!=='false'),
                tag, i, option, len, vChildren;
            if (editable) {
                instance.setHTML(val);
            }
            else {
                tag = instance.getTagName();
                if ((tag==='INPUT') || (tag==='TEXTAREA')) {
                    instance.value = val;
                }
                else if (tag==='SELECT') {
                    vChildren = instance.vnode.vChildren;
                    len = vChildren.length;
                    for (i=0; i<len; i++) {
                        option = vChildren[i];
                        if (option.attrs.value === val) {
                            instance.selectedIndex = i;
                            break;
                        }
                    }
                }
            }
            // if `document._emitVC` is available, then invoke it to emit the `valuechange`-event
            /**
            * @event valuechange
            * @param e.value {String} new value
            * @param e.sourceTarget {Element} Element whare the valuechange occured
            */
            DOCUMENT._emitVC && (prevVal!==val) && DOCUMENT._emitVC(instance, val);
            return instance;
        };

       /**
         * Set the position of an html element in page coordinates.
         * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         *
         * If the Element has the attribute `xy-constrian` set, then its position cannot exceed any matching container it lies within.
         *
         * @method setXY
         * @param x {Number} x-value for new position (coordinates are page-based)
         * @param y {Number} y-value for new position (coordinates are page-based)
         * @param [constrain] {'window', Element, Object, String}
         * <ul>
         *     <li><b>'window'</b> to constrain to the visible window</li>
         *     <li><b>Element</b> to constrain to a specified Element</li>
         *     <li><b>Object</b> to constrain to an object with the properties: {x, y, w, h} where x and y are absolute pixels of the document
         *            (like calculated with getX() and getY()).</li>
         *     <li><b>String</b> to constrain to a specified css-selector, which should be an ancestor</li>
         * </ul>
         * @param [notransition=false] {Boolean} set true if you are sure positioning is without transition.
         *        this isn't required, but it speeds up positioning. Only use when no transition is used:
         *        when there is a transition, setting this argument `true` would miscalculate the position.
         *        The return-value will be `this` in case `notransition`===true, making setXY to be chainable.
         * @return {Promise|this}
         * @since 0.0.1
         */
        ElementPrototype.setXY = function(x, y, constrain, notransition) {
            console.log(NAME, 'setXY '+x+','+y);
            var instance = this,
                dif, match, constrainNode, byExactId, parent, clone, promise,
                containerTop, containerRight, containerLeft, containerBottom, requestedX, requestedY,
                transObject, xtrans, ytrans, inlinePosition, globalPosition, invisibleClass;

            // default position to relative: check first inlinestyle because this goes quicker
            inlinePosition = instance.getInlineStyle(POSITION);
            inlinePosition || (globalPosition=instance.getStyle(POSITION));
            if ((inlinePosition==='static') || (inlinePosition==='fixed') || (globalPosition==='static') || (globalPosition==='fixed')) {
                inlinePosition = 'relative';
                instance.setInlineStyle(POSITION, inlinePosition);
            }
            invisibleClass = (inlinePosition==='absolute') ? INVISIBLE : INVISIBLE_RELATIVE;
            // make sure it has sizes and can be positioned
            instance.setClass([invisibleClass, BORDERBOX]);
            (instance.getInlineStyle('display')==='none') && instance.setClass(BLOCK);
            constrain || (constrain=instance.getAttr('constrain-selector'));
            if (constrain) {
                if (constrain==='window') {
                    containerLeft = window.getScrollLeft();
                    containerTop = window.getScrollTop();
                    containerRight = containerLeft + window.getWidth();
                    containerBottom = containerTop + window.getHeight();
                }
                else {
                    if (typeof constrain === STRING) {
                        match = false;
                        constrainNode = instance.getParent();
                        byExactId = REGEXP_NODE_ID.test(constrain);
                        while (constrainNode.matchesSelector && !match) {
                            match = byExactId ? (constrainNode.id===constrain.substr(1)) : constrainNode.matchesSelector(constrain);
                            // if there is a match, then make sure x and y fall within the region
                            match || (constrainNode=constrainNode.getParent());
                        }
                        // if Element found, then bound it to `constrain` as if the argument `constrain` was an Element
                        match && (constrain=constrainNode);
                    }
                    if (constrain.matchesSelector) {
                        // Element --> we need to search the rectangle
                        containerLeft = constrain.left + parseInt(constrain.getStyle(BORDER_LEFT_WIDTH), 10);
                        containerTop = constrain.top + parseInt(constrain.getStyle(BORDER_TOP_WIDTH), 10);
                        containerRight = containerLeft + constrain.scrollWidth;
                        containerBottom = containerTop + constrain.scrollHeight;
                    }
                    else {
                        containerLeft = constrain.x;
                        containerTop = constrain.y;
                        containerRight = constrain.x + constrain.w;
                        containerBottom = constrain.y + constrain.h;
                    }
                }
                if (typeof containerLeft === NUMBER) {
                    // found constrain, always redefine x and y
                    x = requestedX = (typeof x===NUMBER) ? x : instance.left;
                    if (requestedX<containerLeft) {
                        x = containerLeft;
                    }
                    else {
                        if ((requestedX+instance.offsetWidth)>containerRight) {
                            x = requestedX = containerRight - instance.offsetWidth;
                        }
                        // now we might need to reset to the left again:
                        (requestedX<containerLeft) && (x=containerLeft);
                    }
                    y = requestedY = (typeof y===NUMBER) ? y : instance.top;
                    if (requestedY<containerTop) {
                        y = containerTop;
                    }
                    else {
                        if ((requestedY+instance.offsetHeight)>containerBottom) {
                            y = requestedY = containerBottom - instance.offsetHeight;
                        }
                        // now we might need to reset to the top again:
                        (requestedY<containerTop) && (y=containerTop);
                    }
                }
            }
            xtrans = (typeof x === NUMBER);
            ytrans = (typeof y === NUMBER);
            if (xtrans || ytrans) {
                // check if there is a transition:
                if (notransition) {
                    instance.setClass([NO_TRANS2, invisibleClass]);
                    transObject = [];
                    xtrans && (transObject[0]={property: LEFT, value: x + PX});
                    ytrans && (transObject[xtrans ? 1 : 0]={property: TOP, value: y + PX});
                    instance.setInlineStyles(transObject);
                    // reset transObject and maybe it will be filled when there is a difference
                    // between the set value and the true value (which could appear due to different `position` properties)
                    transObject = [];
                    if (xtrans) {
                        dif = (instance.left-x);
                        (dif!==0) && (transObject[0]={property: LEFT, value: (x - dif) + PX});
                    }
                    if (ytrans) {
                        dif = (instance.top-y);
                        (dif!==0) && (transObject[transObject.length]={property: TOP, value: (y - dif) + PX});
                    }
                    (transObject.length>0) && instance.setInlineStyles(transObject);
                    instance.removeClass([NO_TRANS2, invisibleClass]);
                }
                else {
                    // we will clone the node, make it invisible and without transitions and look what its correction should be
                    clone = instance.cloneNode();
                    clone.setClass([NO_TRANS2, invisibleClass]);
                    parent = instance.getParent() || DOCUMENT.body;
                    parent.prepend(clone, null, instance);

                    transObject = [];
                    xtrans && (transObject[0]={property: LEFT, value: x + PX});
                    ytrans && (transObject[xtrans ? 1 : 0]={property: TOP, value: y + PX});

                    clone.setInlineStyles(transObject);

                    // reset transObject and fill it with the final true values
                    transObject = [];
                    xtrans && (transObject[0]={property: LEFT, value: (2*x-clone.left) + PX});
                    ytrans && (transObject[xtrans ? 1 : 0]={property: TOP, value: (2*y-clone.top) + PX});
                    clone.remove();
                    promise = instance.setInlineStyles(transObject, true);
                }
            }
            else if (!notransition) {
                promise = window.Promise.resolve();
            }
            instance.removeClass([BLOCK, BORDERBOX, invisibleClass]);
            return promise || instance;
        };

       /**
        * Shows a previously hidden node.
        * Shows immediately without `fade`, or will fade-in when fade is specified.
        *
        * @method show
        * @param [fade] {Number} sec to fade-in (you may use `0.1`)
        * @return {this|Promise} fulfilled when the element is ready showing up, or rejected when hidden again (using node.hide) before fully showed.
        * @since 0.0.1
        */
        ElementPrototype.show = function(duration, forceFull) {
            var instance = this,
                showPromise = instance.getData('_showNodeBusy'),
                hidePromise = instance.getData('_hideNodeBusy'),
                originalOpacity, hasOriginalOpacity, promise, freezedOpacity, finalValue;

            originalOpacity = instance.getData('_showNodeOpacity');
            if (!originalOpacity && !showPromise && !hidePromise) {
                originalOpacity = instance.getInlineStyle('opacity');
                instance.setData('_showNodeOpacity', originalOpacity);
            }
            hasOriginalOpacity = !!originalOpacity;

            showPromise && showPromise.freeze();
            hidePromise && hidePromise.freeze();

            if (duration) {

                instance.setInlineStyle('opacity', (instance.hasClass(HIDDEN) ? 0 : instance.getStyle('opacity')));
                instance.removeClass(HIDDEN);

                finalValue = (forceFull || !hasOriginalOpacity) ? 1 : originalOpacity;
                if (showPromise || hidePromise) {
                    freezedOpacity = instance.getInlineStyle('opacity');
                    duration = (finalValue>0) ? Math.min(1, (freezedOpacity/finalValue))*duration : 0;
                }

                promise = instance.transition({property: 'opacity', value: finalValue, duration: duration});
                instance.setData('_showNodeBusy', promise);

                promise.finally(function() {
                    if (!promise.cancelled && !promise.frozen) {
                        hasOriginalOpacity || instance.removeInlineStyle('opacity');
                        if (!forceFull || !hasOriginalOpacity) {
                            instance.removeData('_showNodeOpacity');
                        }
                    }
                    instance.removeData('_showNodeBusy');
                });
                return promise;
            }
            else {
                async(function() {
                    (hasOriginalOpacity && !forceFull) ? instance.setInlineStyle('opacity', originalOpacity) : instance.removeInlineStyle('opacity');
                    instance.removeClass(HIDDEN);
                });
                return instance;
            }
        };

       /**
        * Transitions one ore more properties of the Element.
        *
        * @method toggleClass
        * @param to {Array} the css-properties to be set, specified as an Array of Objects.
        *        The objects should have the next properties:
        *        <ul>
        *            <li>property  {String}</li>
        *            <li>value  {String}</li>
        *            <li>duration  {Number} (optional)</li>
        *            <li>timingFunction  {String} (optional)</li>
        *            <li>delay  {String} (optional)</li>
        *            <li>pseudo  {String} (optional) --> not: not supported yet in browsers</li>
        *        </ul>
        * @param [from] {Array} starting the css-properties to be set, specified as an Array of Objects.
        *        If disguarded, then the current style is used as startingpoint. You may specify a subset of the `to`-properties.
        *        The objects should have the next properties:
        *        <ul>
        *            <li>property  {String}</li>
        *            <li>value  {String}</li>
        *            <li>duration  {Number} (optional)</li>
        *            <li>timingFunction  {String} (optional)</li>
        *            <li>delay  {String} (optional)</li>
        *            <li>pseudo  {String} (optional) --> not: not supported yet in browsers</li>
        *        </ul>
        * @return {Promise} The promise has the handles:
        *        <ul>
        *            <li>cancel() {Promise}</li>
        *            <li>freeze() {Promise}</li>
        *            <li>unfreeze()</li>
        *            <li>finish() {Promise}</li>
        *        </ul>
        *        These handles resolve with the `elapsed-time` as first argument of the callbackFn
        * @since 0.0.1
        */
        ElementPrototype.transition = function(to, from) {
            var instance = this,
                currentInlineTransition, transitions, transitionRun, transitionError, promise, resolveHandle, initialStyle, time1,
                initialProperties, cleanup, getCurrentProperties, manipulated, getNoTransProp, transpromise, endIntermediate, time2;

            to || (to={});
            Array.isArray(to) || (to=[to]);
            to = getVendorCSS(to);
            time1 = Date.now();
            cleanup = function() {
                currentInlineTransition = instance.getData('_bkpTransition');
                currentInlineTransition ? instance.setInlineStyle(TRANSITION, currentInlineTransition) : instance.removeInlineStyle(TRANSITION);
                instance.removeData('_bkpTransition');
                instance.removeData('_readyOnRun');
                Object.defineProperty(promise, 'isFulfilled', {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: true
                });
            };
            getCurrentProperties = function() {
                var props = [],
                    currentStyle = window.getComputedStyle(instance),
                    currentStyleBefore = window.getComputedStyle(instance, ':before'),
                    currentStyleAfter = window.getComputedStyle(instance, ':after');
                to.each(function(value) {
                    var styles = (value.pseudo===':before') ? currentStyleBefore : ((value.pseudo===':after') ? currentStyleAfter : currentStyle),
                        property = value.property;
                    // if property is vendor-specific transition, or transform, than we reset it to the current vendor
                    props.push({
                        property: property,
                        value: styles[toCamelCase(property)]
                    });
                });
                return props;
            };
            getNoTransProp = function() {
                var props = [];
                transitions.forEach(function(item) {
                    props.push({
                        property: item.property,
                        duration: 0,
                        delay: 0
                    });
                });
                return props;
            };

            endIntermediate = function(type) {
                if (!promise.isFulfilled) {
                    manipulated = true;
                    instance.setInlineTransitions(getNoTransProp());
                    instance.setInlineStyles((type==='cancelled') ? initialProperties : getCurrentProperties());
                    // also force to set the style on the node outside the vdom --> by forcing this
                    // we won't run into the situation where the vdom doesn't change the dom because the style didn';'t change:
                    instance._setAttribute(STYLE, instance.getAttr(STYLE));
                    switch (type) {
                        case 'cancelled':
                            // now cleanup inline style that wasn't there initially,
                            async(function() {
                                instance.setClass(NO_TRANS2);
                                instance.setAttr(STYLE, initialStyle);
                                instance.removeClass(NO_TRANS2);
                            });
                            cleanup();
                        break;
                        case 'frozen':
                            async(function() {
                                cleanup();
                            });
                        break;
                        case 'finished':
                            instance.setInlineStyles(to);
                            async(function() {
                                cleanup();
                            });
                        break;
                    }
                    Object.defineProperty(promise, type, {
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: true
                    });
                    transpromise.reject(); // prevent transitionpromise to set its own final values after finishing
                    resolveHandle();
                }
                time2 || (time2=Date.now());
                return new window.Promise(function(resolve) {
                    async(function() {
                        resolve(time2-time1);
                    });
                });
            };
            promise = new window.Promise(function(resolve, reject) {
                async(function() {
                    resolveHandle = resolve;
                    transitionRun = idGenerator('nodeTransition');
                    // only make ready on the last run
                    instance.setData('_readyOnRun', transitionRun);

                    if (from) {
                        instance.setClass(NO_TRANS2);
                        instance.setInlineStyles(from);
                        instance.removeClass(NO_TRANS2);
                    }
                    initialProperties = getCurrentProperties();
                    initialStyle = instance.getAttr(STYLE);

                    currentInlineTransition = instance.getData('_bkpTransition');
                    if (currentInlineTransition===undefined) {
                        currentInlineTransition = instance.getInlineStyle(TRANSITION) || null;
                        // `null` can be set as node-data, `undefined` connot
                        instance.setData('_bkpTransition', currentInlineTransition);
                    }

                    // we could use the `to` object and pass into `setInlineTransitions` directly,
                    // however, in case `duration` is not specified, we will define them to 1 sec.
                    transitions = Array.isArray(to) ? to.deepClone() : [to.shallowClone()];

                    // CAUTIOUS: the sum of `duration`+`delay` determines when the transition will be ready.
                    // This leads into separate transitions, we must prevent the promise to fulfill on the
                    // first tranition to be ready.
                    // Thus: we need to split every (`duration`+`delay`) group and give them each a separate setInlineStyle()-promise!
                    transitions.forEach(function(item) {
                        item.duration || (item.duration=1);
                        item.delay || (item.delay=0);
                    });

                    instance.setInlineTransitions(transitions);
                    transpromise = instance.setInlineStyles(to, true);
                    transpromise.catch(
                        function(err) {
                            transitionError = err;
                            return true; // fulfill the chain
                        }
                    ).finally(
                        function() {
                            // to prevent `transitionend` events biting each other when chaining `transition`,
                            // and reset the inline transition in time,
                            // we need to resolve the Promise after the eventstack:
                            async(function() {
                                if (!manipulated && (instance.getData('_readyOnRun')===transitionRun)) {
                                    cleanup();
                                    // because cleanup does an async action (setInlineStyles), we will append the eventstack:
                                    async(function() {
                                        if (transitionError) {
                                            reject(transitionError);
                                        }
                                        else {
                                            time2 || (time2=Date.now());
                                            resolve(time2-time1);
                                        }
                                    });
                                }
                            });
                        }
                    );
                });
            });

            promise.cancel = function() {
                return endIntermediate('cancelled');
            };

            promise.freeze = function() {
                return endIntermediate('frozen');
            };

            promise.finish = function() {
                return endIntermediate('finished');
            };

            return promise;
        };

       /**
        * Toggles the className of the Element.
        *
        * @method toggleClass
        * @param className {String|Array} className that should be toggled, may be an array of classNames
        * @param forceState {Boolean} to force toggling into this specific state
        * @param [returnPromise] {Boolean} whether to return a Promise instead of `this`, which might be useful in case of
        *        transition-properties. The promise will fullfil when the transition is ready, or immediately when no transitioned.
        * @param [transitionFix] set this to `true` if you experience transition-problems due to wrong calculated css (mostly because of the `auto` value)
        *        Setting this parameter, will calculate the true css of the transitioned properties and set this temporarely inline, to fix the issue.
        *        Don't use it when not needed, it has a slightly performancehit.
        *        No need to set when `returnPromise` is set --> returnPromise always handles the transitionFix.
        * @return {Promise|this} In case `returnPromise` is set, a Promise returns with the next handles:
        *        <ul>
        *            <li>cancel() {Promise}</li>
        *            <li>freeze() {Promise}</li>
        *            <li>unfreeze()</li>
        *            <li>finish() {Promise}</li>
        *        </ul>
        *        These handles resolve with the `elapsed-time` as first argument of the callbackFn
        * @since 0.0.1
        */
        ElementPrototype.toggleClass = function(className, forceState, returnPromise, transitionFix) {
            var instance = this,
                transPromise = (returnPromise || transitionFix) && getClassTransPromise(instance, TOGGLE, className, forceState),
                returnValue = returnPromise ? transPromise : instance;
            transPromise || instance.getClassList().toggle(className, forceState);
            return returnValue;
        };

        Object.defineProperties(ElementPrototype, {

           /**
            * Gets or set the height of the element in pixels. Included are padding and border, not any margins.
            * By setting the argument `overflow` you get the total height, included the invisible overflow.
            *
            * The getter is calculating through `offsetHeight`, the setter will set inline css-style for the height.
            *
            * Values are numbers without unity.
            *
            * @property height
            * @type {Number}
            * @since 0.0.1
            */
            height: {
                get: function() {
                    return this.offsetHeight;
                },
                set: function(val) {
                    var instance = this,
                        dif;
                    instance.setClass(INVISIBLE);
                    instance.setInlineStyle(HEIGHT, val + PX);
                    dif = (instance.offsetHeight-val);
                    (dif!==0) && (instance.setInlineStyle(HEIGHT, (val - dif) + PX));
                    instance.removeClass(INVISIBLE);
                }
            },

           /**
            * Gets the x-position (in the DOCUMENT) of the element in pixels.
            * DOCUMENT-related: regardless of the window's scroll-position.
            *
            * @property left
            * @since 0.0.1
            */
            left: {
                get: function() {
                    return Math.round(this.getBoundingClientRect().left + window.getScrollLeft());
                },
                set: function(pixelsLeft) {
                    return this.setXY(pixelsLeft, null, null, true);
                }
            },

           /**
            * Gets the y-position (in the DOCUMENT) of the element in pixels.
            * DOCUMENT-related: regardless of the window's scroll-position.
            *
            * @property top
            * @since 0.0.1
            */
            top: {
                get: function() {
                    return Math.round(this.getBoundingClientRect().top + window.getScrollTop());
                },
                set: function(pixelsTop) {
                    return this.setXY(null, pixelsTop, null, true);
                }
            },

           /**
            * Gets or set the width of the element in pixels. Included are padding and border, not any margins.
            * By setting the argument `overflow` you get the total width, included the invisible overflow.
            *
            * The getter is calculating through `offsetHeight`, the setter will set inline css-style for the width.
            *
            * Values are numbers without unity.
            *
            * @property width
            * @type {Number}
            * @since 0.0.1
            */
            width: {
                get: function() {
                    return this.offsetWidth;
                },
                set: function(val) {
                    var instance = this,
                        dif;
                    instance.setClass(INVISIBLE);
                    instance.setInlineStyle(WIDTH, val + PX);
                    dif = (instance.offsetWidth-val);
                    (dif!==0) && (instance.setInlineStyle(WIDTH, (val - dif) + PX));
                    instance.removeClass(INVISIBLE);
                }
            }

        });

    }(window.Element.prototype));

    setupObserver = function() {
        // configuration of the observer:
        var observerConfig = {
                attributes: true,
                subtree: true,
                characterData: true,
                childList : true
            };
        (new window.MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {

                var node = mutation.target,
                    vnode = node.vnode,
                    type = mutation.type,
                    attribute = mutation.attributeName,
                    addedChildNodes = mutation.addedNodes,
                    removedChildNodes = mutation.removedNodes,
                    i, len, childDomNode, childVNode, index, vchildnode;
                if (vnode && !vnode._nosync) {
                    if (type==='attributes') {
                        vnode.reloadAttr(attribute);
                    }
                    else if (type==='characterData') {
                        vnode.text = node.nodeValue;
                    }
                    else {
                        // remove the childNodes that are no longer there:
                        len = removedChildNodes.length;
                        for (i=len-1; i>=0; i--) {
                            childVNode = removedChildNodes[i].vnode;
                            childVNode && childVNode._destroy();
                        }
                       // add the new childNodes:
                        len = addedChildNodes.length;
                        for (i=0; i<len; i++) {
                            childDomNode = addedChildNodes[i];
                            // find its index in the true DOM:
                            index = node.childNodes.indexOf(childDomNode);
                            // create the vnode:
                            vchildnode = domNodeToVNode(childDomNode);
//======================================================================================================
// TODO: remove this block of code: we shouldn;t be needing it
// that is: when the alert never rises (which I expect it doesn't)


// prevent double definitions (for whatever reason):
// check if there is a vChild with the same domNode and remove it:
var vChildNodes = vnode.vChildNodes;
var len2 = vChildNodes ? vChildNodes.length : 0;
var j;
for (j=0; j<len2; j++) {
    var checkChildVNode = vChildNodes[j];
    if (checkChildVNode.domNode===node) {
        checkChildVNode._destroy();
        alert('double deleted');
        break;
    }
}
// END OF removable block
//======================================================================================================
                            // add the vnode:
                            vchildnode._moveToParent(vnode, index);
                        }
                    }
                }
            });
        })).observe(DOCUMENT, observerConfig);
    };

    setupObserver();

};

//--- definition API of unmodified `Element`-methods ------

/**
 * Returns the specified attribute of the specified element, as an Attr node.
 *
 * @method getAttributeNode
 * @return {attributeNode}
 */

/**
 * Returns a text rectangle object that encloses a group of text rectangles. The returned value is
 * a TextRectangle object which is the union of the rectangles returned by getClientRects() for the element,
 * i.e., the CSS border-boxes associated with the element.
 *
 * The returned value is a TextRectangle object, which contains read-only left, top, right and bottom properties
 * describing the border-box in pixels. top and left are relative to the top-left of the viewport.
 *
 * @method getBoundingClientRect
 * @return {attributeNode} Therectangle object that encloses a group of text rectangles.
 */

/**
 * Returns a collection of rectangles that indicate the bounding rectangles for each box in a client.
 *
 * The returned value is a collection of ClientRect objects, one for each CSS border box associated with the element.
 * Each ClientRect object contains read-only left, top, right and bottom properties describing the border box, in pixels,
 * with the top-left relative to the top-left of the viewport. For tables with captions,
 * the caption is included even though it's outside the border box of the table.
 *
 * @method getClientRects
 * @return {Collection}
 */

/**
 * Returns a new NodeIterator object with this Element as root.
 *
 * The NodeIterator is a snapshot of the dom at the time this method was called. It is not updated when changes of the dom are made afterwards.
 *
 * @method createNodeIterator
 * @param [whatToShow] {Number} Filter specification constants from the NodeFilter DOM interface, indicating which nodes to iterate over.
 * You can use or sum one of the next properties:
 * <ul>
 *   <li>window.NodeFilter.SHOW_ELEMENT</li>
 *   <li>window.NodeFilter.SHOW_COMMENT</li>
 *   <li>window.NodeFilter.SHOW_TEXT</li>
 * </ul>
 * @param [filter] {NodeFilter|function} An object implementing the NodeFilter interface or a function. See https://developer.mozilla.org/en-US/docs/Web/API/NodeFilter
 * @return {NodeIterator}
 * @since 0.0.1
*/

/**
 * Returns an HTMLCollection of all Elements within this Element, that match their classes with the supplied `classNames` argument.
 * To match multiple different classes, separate them with a `comma`.
 *
 * getElementsByClassName is life presentation of the dom. The returned HTMLCollection gets updated when the dom changes.
 *
 * NOTE: it is highly recomended to use `document.getAll` because that method takes advantage of the vdom.
 *
 * @method getElementsByClassName
 * @param classNames {String} the classes to search for
 * @return {HTMLCollection} life Array with Elements
 */

/**
 * Returns an HTMLCollection of all Elements within this Element, that match their `name`-attribute with the supplied `name` argument.
 *
 * getElementsByName is life presentation of the dom. The returned HTMLCollection gets updated when the dom changes.
 *
 * NOTE: it is highly recomended to use `document.getAll` because that method takes advantage of the vdom.
 *
 * @method getElementsByName
 * @param name {String} the property of name-attribute to search for
 * @return {HTMLCollection} life Array with Elements
 */


/**
 * Returns an HTMLCollection of all Elements within this Element, that match their `name`-attribute with the supplied `name` argument.
 *
 * getElementsByTagName is life presentation of the dom. The returned HTMLCollection gets updated when the dom changes.
 *
 * NOTE: it is highly recomended to use `document.getAll` because that method takes advantage of the vdom.
 *
 * @method getElementsByTagName
 * @param tagNames {String} the tags to search for
 * @return {HTMLCollection} life Array with Elements
 */

/**
* Inserts the Element into the DOM tree at a specified position.
*
* @method insertAdjacentElement
* @param position {String}
* <ul>
*     <li>'beforebegin' Before the element itself</li>
*     <li>'afterbegin' Just inside the element, before its first child</li>
*     <li>'beforeend' Just inside the element, after its last child</li>
*     <li>'afterend' After the element itself</li>
* <ul>
* @param element {Element}
*/

/**
* Parses the specified text as HTML and inserts the resulting nodes into the DOM tree at a specified position.
*
* @method insertAdjacentHTML
* @param position {String}
* <ul>
*     <li>'beforebegin' Before the element itself</li>
*     <li>'afterbegin' Just inside the element, before its first child</li>
*     <li>'beforeend' Just inside the element, after its last child</li>
*     <li>'afterend' After the element itself</li>
* <ul>
* @param element {Element}
*/

/**
* Inserts the text into the DOM tree as a TextNode at a specified position.
*
* @method insertAdjacentText
* @param position {String}
* <ul>
*     <li>'beforebegin' Before the element itself</li>
*     <li>'afterbegin' Just inside the element, before its first child</li>
*     <li>'beforeend' Just inside the element, after its last child</li>
*     <li>'afterend' After the element itself</li>
* <ul>
* @param element {Element}
*/

/**
* Removes the attribute specified by an attributeNode from the Element.
*
* @method removeAttributeNode
* @param attributeNode {attributeNode}
* @since 0.0.1
*/

/**
 * Scrolls the element into view.
 *
 * @method scrollIntoView
 */

/**
 * Sets the attribute on the Element specified by `attributeNode`
 *
 * @method setAttributeNode
 * @param attributeNode {attributeNode}
*/

//------ events --------

/**
 * Fired when a static `script` element  finishes executing its script. Does not fire if the element is added dynamically, eg with appendChild().
 *
 * @event afterscriptexecute
 */


/**
 * Fired when the code in a `script` element declared in an HTML document is about to start executing. Does not fire if the element is added dynamically, eg with appendChild().
 *
 * @event beforescriptexecute
 */

//------- properties --------

/**
 * sets or returns an accesskey for an element. An accesskey specifies a shortcut key to activate/focus an element.
 * Note: The way of accessing the shortcut key is varying in different browsers: http://www.w3schools.com/jsref/prop_html_accesskey.asp
 *
 * @property accessKey
 * @type String
 */


/**
 * Returns a live collection of all attribute nodes registered to the specified node.
 * It is a NamedNodeMap, not an Array, so it has no Array methods and the Attr nodes' indexes may differ among browsers.
 * To be more specific, attributes is a key/value pair of strings that represents any information regarding that attribute.
 *
 * Prefer to use `getAttrs()` which is much quicker, but doesn't return a life-list.
 *
 * @property attributes
 * @type NamedNodeMap
 */

/**
 * The absolute base URL of a node.
 *
 * @property baseURI
 * @type String
 * @readOnly
 */

/**
 * Returns the number of children (child Elements)
 *
 * @property childElementCount
 * @type Number
 * @readOnly
 */

/**
 * Returns a live collection of childNodes of the given element, either Element, TextNode or CommentNode
 *
 * @property childNodes
 * @type NodeList
 * @readOnly
 */

/**
 * Returns a live collection of child Element's of the given element.
 *
 * @property children
 * @type NodeList
 * @readOnly
 */

/**
 * Gets and sets the value of the class attribute of the specified element.
 *
 * @property className
 * @type String
 */

/**
 * Returns the inner height of an element in pixels, including padding but not the horizontal scrollbar height, border, or margin.
 *
 * @property clientHeight
 * @type Number
 * @readOnly
 */

/**
 * The width of the left border of an element in pixels. It includes the width of the vertical scrollbar if the text direction of the element is right–to–left
 * and if there is an overflow causing a left vertical scrollbar to be rendered. clientLeft does not include the left margin or the left padding.
 *
 * @property clientLeft
 * @type Number
 * @readOnly
 */

/**
 * The width of the top border of an element in pixels. It does not include the top margin or padding.
 *
 * @property clientTop
 * @type Number
 * @readOnly
 */

/**
 * Returns the inner width of an element in pixels, including padding but not the vertical scrollbar height, border, or margin.
 *
 * @property clientWidth
 * @type Number
 * @readOnly
 */

/**
 * Reference to the first childNode, where the related dom-node is either an Element, TextNode or CommentNode (nodeType===1, 3 or 8).
 *
 * Better work with Elements only:  use `firstElementChild` instead, which returns the first Element-child.
 *
 * @property firstChild
 * @type Node
 * @readOnly
 * @deprecated
 */

/**
 * Reference to the first Element-child, which is an Element (nodeType===1).
 *
 * @property firstElementChild
 * @type Element
 * @readOnly
 */

/**
 * Gets or sets the element's attribute `href`. Only applies for the `a`-element.
 *
 * @property href
 * @type String
 */

/**
 * Gets or sets the element's identifier (attribute id).
 *
 * @property id
 * @type String
 */

/**
 * Reference to the last childNode, where the related dom-node is either an Element, TextNode or CommentNode (nodeType===1, 3 or 8).
 *
 * Better use `lastElementChild` instead, which returns the last Element-child.
 *
 * @property lastChild
 * @type Node
 * @readOnly
 * @deprecated
 */

/**
 * Reference to the last Element-child, where the related dom-node is an Element (nodeType===1).
 *
 * @property lastElementChild
 * @type Element
 * @readOnly
 */

/**
 * Gets or sets the `name` property of a Element; it only applies to the following elements:
 * `a`, `applet`, `button`, `form`, `frame`, `iframe`, `img`, `input`, `map`, `meta`, `object`, `param`, `select`, and `textarea`.
 *
 * @property name
 * @type String
 */

/**
 * Returns the Element immediately following the specified one in its parent's childNodes list, or null if the specified node is the last node in that list.
 * Is an Element (nodeType===1).
 *
 * @property nextElementSibling
 * @type Element
 * @readOnly
 */

/**
 * Returns the Element immediately following the specified one in its parent's childNodes list, or null if the specified node is the last node in that list.
 * Is either an Element, TextNode or CommentNode (nodeType===1, 3 or 8).
 *
 * Do not use this, but use `lastElementChild` instead, which returns the next Element-child.
 *
 * @property nextElementSibling
 * @type Node
 * @deprecated
 * @readOnly
 */

/**
 * Elements tag-name
 *
 * @property nodeName
 * @type String
 * @readOnly
 */

/**
 * Elements nodetype: 1==Element, 3==TextNode, 8===CommentNode
 *
 * @property nodeType
 * @type String
 * @readOnly
 */

/**
 * Value/text for non-Element Nodes
 *
 * @property nodeValue
 * @type String
 * @since 0.0.1
 */

/**
 * The exact width of the Element on the screen.
 * Included borders and padding (no margin).
 *
 * Returns a number without unity.
 *
 * Better use `width` --> it's an alias, but has a setter as well
 *
 * @property offsetWidth
 * @type Number
 * @readOnly
 * @since 0.0.1
 */

/**
 * The exact height of the Element on the screen.
 * Included borders and padding (no margin).
 *
 * Returns a number without unity.
 *
 * Better use `height` --> it's an alias, but has a setter as well
 *
 * @property offsetHeight
 * @type Number
 * @since 0.0.1
 */

/**
 * Returns the Element's parent Element.
 *
 * Same as `parentNode`
 *
 * @property parentElement
 * @type Element
 */

/**
 * Returns the Element's parent Element.
 *
 * Same as `parentElement`
 *
 * @property parentNode
 * @type Element
 */

/**
 * Returns the Element immediately preceding the specified one in its parent's childNodes list, or null if the specified node is the last node in that list.
 * Is an Element (nodeType===1).
 *
 * @property previousElementSibling
 * @type Element
 * @readOnly
 */

/**
 * Returns the Element immediately preceding the specified one in its parent's childNodes list, or null if the specified node is the last node in that list.
 * Is either an Element, TextNode or CommentNode (nodeType===1, 3 or 8).
 *
 * Do not use this, but use `previousElementSibling` instead, which returns the previous Element-child.
 *
 * @property previousSibling
 * @deprecated
 * @type Node
 * @readOnly
 */


/**
 * A measurement of the height of an element's content, including content not visible on the screen due to overflow.
 * The scrollHeight value is equal to the minimum clientHeight the element would require in order to fit all the content in the viewpoint
 * without using a vertical scrollbar. It includes the element padding but not its margin.
 *
 * Returns a number without unity.
 *
 * @property scrollHeight
 * @type Number
 * @readOnly
 */

/**
 * Gets or sets the number of pixels that an element's content is scrolled to the left.
 *
 * @property scrollLeft
 * @type Number
 */

/**
 * Gets or sets the number of pixels that the content of an element is scrolled upward. An element's scrollTop is a measurement
 * of the distance of an element's top to its topmost visible content. When an element content does not generate a vertical scrollbar,
 * then its scrollTop value defaults to 0.
 *
 * @property scrollTop
 * @type Number
 */

/**
 * Returns either the width in pixels of the content of an element or the width of the element itself, whichever is greater.
 * If the element is wider than its content area (for example, if there are scroll bars for scrolling through the content),
 * the scrollWidth is larger than the clientWidth.
 *
 * Returns a number without unity.
 *
 * @property scrollWidth
 * @type Number
 * @readOnly
 */

/**
 * Gets or sets the element's attribute `type`. Only applies for the `script`, `img` and `style`-elements.
 *
 * @property src
 * @type String
 */

/**
 * Gets or sets the element's attribute `style`.
 *
 * @property style
 * @type String
 */

/**
 * Gets or sets the element's attribute `type`. Only applies for the `input`-element.
 *
 * @property type
 * @type String
 */

/**
* Gets or sets the value of an input or select Element.
*
* Note it is highly preferable to use getValue() and setValue().
*
* @property value
* @type String
* @since 0.0.1
*/
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../css/element.css":45,"./attribute-extractor.js":46,"./element-array.js":47,"./html-parser.js":51,"./node-parser.js":52,"./vdom-ns.js":53,"./vnode.js":54,"js-ext/lib/object.js":32,"js-ext/lib/promise.js":33,"js-ext/lib/string.js":34,"polyfill":40,"polyfill/extra/transition.js":35,"polyfill/extra/transitionend.js":36,"polyfill/extra/vendorCSS.js":37,"utils":42,"window-ext":56}],51:[function(require,module,exports){
"use strict";

/**
 * Exports `htmlToVNodes` which transforms html-text into vnodes.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * <br>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module vdom
 * @submodule html-parser
 * @since 0.0.1
*/

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.HtmlParser) {
        return window._ITSAmodules.HtmlParser; // HtmlParser was already created
    }

    var NS = require('./vdom-ns.js')(window),
        extractor = require('./attribute-extractor.js')(window),
        DOCUMENT = window.document,
        voidElements = NS.voidElements,
        nonVoidElements = NS.nonVoidElements,

        TAG_OR_ATTR_START_CHARACTERS = {
            a: true,
            b: true,
            c: true,
            d: true,
            e: true,
            f: true,
            g: true,
            h: true,
            i: true,
            j: true,
            k: true,
            l: true,
            m: true,
            n: true,
            o: true,
            p: true,
            q: true,
            r: true,
            s: true,
            t: true,
            u: true,
            v: true,
            w: true,
            x: true,
            y: true,
            z: true,
            A: true,
            B: true,
            C: true,
            D: true,
            E: true,
            F: true,
            G: true,
            H: true,
            I: true,
            J: true,
            K: true,
            L: true,
            M: true,
            N: true,
            O: true,
            P: true,
            Q: true,
            R: true,
            S: true,
            T: true,
            U: true,
            V: true,
            W: true,
            X: true,
            Y: true,
            Z: true
        },
        STARTTAG_OR_ATTR_VALUE_ENDS_CHARACTERS = {
            ' ': true,
            '>': true
        },
        ATTRUBUTE_NAME_ENDS_CHARACTER = {
            ' ': true,
            '=': true,
            '>': true
        },

        /**
         * Transforms html-text into a vnodes-Array.
         *
         * @method htmlToVNodes
         * @param htmlString {String} plain html as string
         * @return {Array} array with `vnodes`
         * @since 0.0.1
         */
        htmlToVNodes = window._ITSAmodules.HtmlParser = function(htmlString, vNodeProto) {
            var i = 0,
                len = htmlString.length,
                vnodes = [],
                parentVNode = arguments[2], // private pass through-argument, only available when internal looped
                insideTagDefinition, insideComment, innerText, endTagCount, stringMarker, attributeisString, attribute, attributeValue,
                j, character, character2, vnode, isBoolean, checkBoolean, tag, isBeginTag, isEndTag, scriptVNode, extractClass, extractStyle;
            while (i<len) {
                character = htmlString[i];
                character2 = htmlString[i+1];
                if (insideTagDefinition) {

                    vnode.attrs = {};
                    if (character!=='>') {
                        // fill attributes until tagdefinition is over:
                        // NOTE: we need to DOUBLE check for "(character!=='>')" because the loop might set the position to '>' where an i++ would miss it!
                        while ((character!=='>') && (++i<len) && (character=htmlString[i]) && (character!=='>')) {
                            // when starting to read an attribute, finish reading until it is completely ready.
                            // this is, because attributes can have a '>' which shouldn't be noticed as an end-of-tag definition
                            if (TAG_OR_ATTR_START_CHARACTERS[character]) {
                                attribute = character;
                                while ((++i<len) && (character=htmlString[i]) && !ATTRUBUTE_NAME_ENDS_CHARACTER[character]) {
                                    attribute += character;
                                }
                                if (character==='=') {
                                    stringMarker = htmlString[i+1];
                                    attributeisString = (stringMarker==='"') || (stringMarker==="'");

                                    attributeValue = '';
                                    if (attributeisString) {
                                        i++;
                                        while ((character!=='\\') && (++i<len) && (character=htmlString[i]) && (character!==stringMarker)) {
                                            attributeValue += character;
                                        }
                                    }
                                    else {
                                        while ((++i<len) && (character=htmlString[i]) && !STARTTAG_OR_ATTR_VALUE_ENDS_CHARACTERS[character]) {
                                            attributeValue += character;
                                        }
                                        // need to set the position one step behind --> the attributeloop will increase it and would otherwise miss a character
                                        i--;
                                        isBoolean = ((attributeValue.length>3) && (attributeValue.length<6) && (checkBoolean=attributeValue.toUpperCase()) && ((checkBoolean==='FALSE') || (checkBoolean==='TRUE')));
                                        // typecast the value to either Boolean or Number:
                                        attributeValue = isBoolean ? (checkBoolean==='TRUE') : parseFloat(attributeValue);
                                    }
                                }
                                else {
                                    attributeValue = "";
                                }
                                vnode.attrs[attribute] = attributeValue;
                            }
                        }
                        vnode.id = vnode.attrs.id;

                        extractClass = extractor.extractClass(vnode.attrs['class']);
                        extractClass.attrClass && (vnode.attrs['class']=extractClass.attrClass);
                        vnode.classNames = extractClass.classNames;

                        extractStyle = extractor.extractStyle(vnode.attrs.style);
                        extractStyle.attrStyle && (vnode.attrs.style=extractStyle.attrStyle);
                        vnode.styles = extractClass.styles;

                    }

                    if (!vnode.isVoid) {
                        innerText = '';
                        endTagCount = 1;
                        // fill innerText until end-tagdefinition:
                        while ((endTagCount>0) && (++i<len) && (character=htmlString[i])) {
                            if (character==='<') {
                                if ((character2=htmlString[i+1]) && (character2==='/')) {
                                    // possible end-tag
                                    j = i+1;
                                    isEndTag = true;
                                    while (isEndTag && (++j<len) && (htmlString[j]!=='>')) {
                                        if (htmlString[j].toUpperCase()!==tag[j-i-2]) {
                                            isEndTag = false;
                                        }
                                    }
                                    isEndTag && (endTagCount--);
                                }
                                else {
                                    // possible begin-tag of the same tag (an innertag with the same tagname)
                                    j = i;
                                    isBeginTag = true;
                                    while (isBeginTag && (++j<len) && (character2=htmlString[j]) && (character2!=='>') && (character2!==' ')) {
                                        if (htmlString[j].toUpperCase()!==tag[j-i-1]) {
                                            isBeginTag = false;
                                        }
                                    }
                                    isBeginTag && (endTagCount++);
                                }
                            }
                            if (endTagCount>0) {
                                innerText += character;
                            }
                        }
                        (endTagCount===0) && (i=i+tag.length+3);
                        // in case of 'SCRIPT' or 'STYLE' tags --> just use the innertext, all other tags need to be extracted

                        if (NS.SCRIPT_OR_STYLE_TAG[vnode.tag]) {
                            // CREATE INNER TEXTNODE
                            scriptVNode = Object.create(vNodeProto);
                            scriptVNode.nodeType = 3;
                            scriptVNode.domNode = DOCUMENT.createTextNode(innerText);
                            // create circular reference:
                            scriptVNode.domNode._vnode = scriptVNode;
                            scriptVNode.text = innerText;
                            scriptVNode.vParent = vnode;
                            vnode.vChildNodes = [scriptVNode];
                        }
                        else {
                            vnode.vChildNodes = (innerText!=='') ? htmlToVNodes(innerText, vNodeProto, vnode) : [];
                        }
                    }
                    else {
                        i++; // compensate for the '>'
                    }
                    vnodes[vnodes.length] = vnode;
                    // reset vnode to force create a new one
                    vnode = null;
                    insideTagDefinition = false;
                }

                else if (insideComment) {
                    if (character+character2+htmlString[i+2]==='-->') {
                        // close vnode
                        // move index to last character of comment
                        i = i+2;
                        vnode.domNode = DOCUMENT.createComment('');
                        // create circular reference:
                        vnode.domNode._vnode = vnode;
                        vnodes[vnodes.length] = vnode;
                        // reset vnode to force create a new one
                        vnode = null;
                        insideComment = false;
                    }
                    else {
                        vnode.text += character;
                    }
                    i++;
                }

                else {
                    // inside TextNode which could go over into an Element or CommentNode
                    if ((character==='<') && TAG_OR_ATTR_START_CHARACTERS[character2] && (htmlString.lastIndexOf('>')>i)) {
                        // begin of opening Element
                        // first: store current vnode:
                        if (vnode) {
                            vnode.domNode = DOCUMENT.createTextNode('');
                            // create circular reference:
                            vnode.domNode._vnode = vnode;
                            vnodes[vnodes.length] = vnode;
                        }
                        vnode = Object.create(vNodeProto);
                        vnode.nodeType = 1;
                        vnode.vParent = parentVNode;
                        vnode.tag = '';
                        vnode.classNames ={};

                        // find tagname:
                        while ((++i<len) && (character=htmlString[i]) && (!STARTTAG_OR_ATTR_VALUE_ENDS_CHARACTERS[character])) {
                            vnode.tag += character.toUpperCase();
                        }

                        tag = vnode.tag;
                        vnode.domNode = DOCUMENT.createElement(tag);
                        // create circular reference:
                        vnode.domNode._vnode = vnode;
                        // check if it is a void-tag, but only need to do the regexp once per tag-element:
                        if (voidElements[tag]) {
                            vnode.isVoid = true;
                        }
                        else if (nonVoidElements[tag]) {
                            vnode.isVoid = false;
                        }
                        else {
                            (vnode.isVoid=!(new RegExp('</'+tag+'>$', 'i')).test(htmlString)) ? (voidElements[tag]=true) : (nonVoidElements[tag]=true);
                        }
                        insideTagDefinition = true;
                    }
                    else if (character+character2+htmlString[i+2]+htmlString[i+3]==='<!--') {
                        // begin of CommentNode
                        if (vnode) {
                            vnode.domNode = DOCUMENT.createTextNode('');
                            // create circular reference:
                            vnode.domNode._vnode = vnode;
                            vnodes[vnodes.length] = vnode;
                        }
                        vnode = Object.create(vNodeProto);
                        vnode.nodeType = 8;
                        vnode.text = '';
                        vnode.vParent = parentVNode;
                        // move index to first character of comment
                        i = i+4;
                        insideComment = true;
                    }
                    else {
                        if (!vnode) {
                            // no current vnode --> create a TextNode:
                            vnode = Object.create(vNodeProto);
                            vnode.nodeType = 3;
                            vnode.text = '';
                            vnode.vParent = parentVNode;
                        }
                        vnode.text += character;
                        i++;
                    }
                }
            }

            if (vnode) {
                vnode.domNode = DOCUMENT.createTextNode('');
                // create circular reference:
                vnode.domNode._vnode = vnode;
                vnodes[vnodes.length] = vnode;
            }
            return vnodes;
        };

    return htmlToVNodes;

};
},{"./attribute-extractor.js":46,"./vdom-ns.js":53}],52:[function(require,module,exports){
"use strict";

/**
 * Exports `domNodeToVNode` which transforms dom-nodes into vnodes.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i><br>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module vdom
 * @submodule node-parser
 * @since 0.0.1
*/

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.NodeParser) {
        return window._ITSAmodules.NodeParser; // NodeParser was already created
    }

    var NS = require('./vdom-ns.js')(window),
        extractor = require('./attribute-extractor.js')(window),
        voidElements = NS.voidElements,
        nonVoidElements = NS.nonVoidElements,
        vNodeProto = require('./vnode.js')(window),
        /**
         * Transforms a dom-node into a vnode.
         *
         * @method domNodeToVNode
         * @param domNode {Node} The dom-node to be transformed
         * @param [parentVNode] {vnode} the parent-vnode that belongs to the dom-node
         * @return {vnode} the vnode-representation of the dom-node
         * @since 0.0.1
         */
        domNodeToVNode = window._ITSAmodules.NodeParser = function(domNode, parentVNode) {
            var nodeType = domNode.nodeType,
                vnode, attributes, attr, i, len, childNodes, domChildNode, vChildNodes, tag, childVNode, extractClass, extractStyle;
            if (!NS.VALID_NODE_TYPES[nodeType]) {
                // only process ElementNodes, TextNodes and CommentNodes
                return;
            }
            vnode = Object.create(vNodeProto);

            // set properties:
            vnode.domNode = domNode;
            // create circular reference:
            vnode.domNode._vnode = vnode;

            vnode.nodeType = nodeType;
            vnode.vParent = parentVNode;

            if (nodeType===1) {
                // ElementNode
                tag = vnode.tag = domNode.nodeName; // is always uppercase

                vnode.attrs = {};

                attributes = domNode.attributes;
                len = attributes.length;
                for (i=0; i<len; i++) {
                    attr = attributes[i];
                    vnode.attrs[attr.name] = attr.value;
                }

                vnode.id = vnode.attrs.id;

                extractClass = extractor.extractClass(vnode.attrs['class']);
                extractClass.attrClass && (vnode.attrs['class']=extractClass.attrClass);
                vnode.classNames = extractClass.classNames;

                extractStyle = extractor.extractStyle(vnode.attrs.style);
                extractStyle.attrStyle && (vnode.attrs.style=extractStyle.attrStyle);
                vnode.styles = extractStyle.styles;

                if (voidElements[tag]) {
                    vnode.isVoid = true;
                }
                else if (nonVoidElements[tag]) {
                    vnode.isVoid = false;
                }
                else {
                    (vnode.isVoid=!(new RegExp('</'+tag+'>$', 'i')).test(domNode.outerHTML)) ? (voidElements[tag]=true) : (nonVoidElements[tag]=true);
                }

                if (!vnode.isVoid) {
                    // in case of 'SCRIPT' or 'STYLE' tags --> just use the innertext, all other tags need to be extracted
                    if (NS.SCRIPT_OR_STYLE_TAG[tag]) {
                        vnode.text = domNode.textContent;
                    }
                    else {
                        vChildNodes = vnode.vChildNodes = [];
                        childNodes = domNode.childNodes;
                        len = childNodes.length;
                        for (i=0; i<len; i++) {
                            domChildNode = childNodes[i];
                            childVNode = domNodeToVNode(domChildNode, vnode);
                            vChildNodes[vChildNodes.length] = childVNode;
                        }
                    }
                }
            }
            else {
                // TextNode or CommentNode
                vnode.text = domNode.nodeValue;
            }
            // store vnode's id:
            vnode.storeId();
            return vnode;
        };

    return domNodeToVNode;

};
},{"./attribute-extractor.js":46,"./vdom-ns.js":53,"./vnode.js":54}],53:[function(require,module,exports){
/**
 * Creates a Namespace that can be used accros multiple vdom-modules to share information.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * <br>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 *
 * @module vdom
 * @submodule vdom-ns
 * @class NS-vdom
 * @since 0.0.1
*/

"use strict";

require('js-ext/lib/object.js');

module.exports = function (window) {
    var NS;

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.VDOM_NS) {
        return window._ITSAmodules.VDOM_NS; // VDOM_NS was already created
    }

    NS = window._ITSAmodules.VDOM_NS = {};

    /**
     * Reference to the VElement of document.body (gets its value as soon as it gets refered to)
     *
     * @property body
     * @default null
     * @type VElement
     * @since 0.0.1
     */
     NS.body = null;


    /**
     * A hash with all node'ids (of all the domnodes that have an id). The value is a reference to an VElement.
     *
     * @property nodeids
     * @default {}
     * @type Object
     * @since 0.0.1
     */
    NS.nodeids || (NS.nodeids={});

    /**
     * A hash with all encountered non-void Elements
     *
     * @property nonVoidElements
     * @default {}
     * @type Object
     * @since 0.0.1
     */
    NS.nonVoidElements || (NS.nonVoidElements={});

    /**
     * A hash to identify what tagNames are equal to `SCRIPT` or `STYLE`.
     *
     * @property SCRIPT_OR_STYLE_TAG
     * @default {SCRIPT: true, STYLE: true}
     * @type Object
     * @since 0.0.1
     */
    NS.SCRIPT_OR_STYLE_TAG = {
        SCRIPT: true,
        STYLE: true
    };

    /**
     * A hash with all nodeTypes that should be captured by the vDOM.
     *
     * @property VALID_NODE_TYPES
     * @default {1: true, 3: true, 8: true}
     * @type Object
     * @since 0.0.1
     */
    NS.VALID_NODE_TYPES = {
        1: true,
        3: true,
        8: true
    };

    /**
     * A hash with all encountered void Elements
     *
     * @property voidElements
     * @default {}
     * @type Object
     * @since 0.0.1
     */
    NS.voidElements || (NS.voidElements={});

    return NS;
};
},{"js-ext/lib/object.js":32}],54:[function(require,module,exports){
"use strict";

/**
 * Delivers the `vnode` prototype object, which is a virtualisation of an `Element` inside the Dom.
 * These Elements work smoothless with the vdom (see ...).
 *
 * vnodes are much quicker to access and walk through than native dom-nodes. However, this is a module you don't need
 * by itself: `Element`-types use these features under the hood.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * <br>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 *
 * @module vdom
 * @submodule vnode
 * @class vnode
 * @since 0.0.1
*/

require('js-ext/lib/array.js');
require('js-ext/lib/object.js');
require('js-ext/lib/string.js');

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.VNode) {
        return window._ITSAmodules.VNode; // VNODE was already created
    }

    var NS = require('./vdom-ns.js')(window),
        extractor = require('./attribute-extractor.js')(window),
        DOCUMENT = window.document,
        nodeids = NS.nodeids,
        htmlToVNodes = require('./html-parser.js')(window),
        async = require('utils/lib/timers.js').async,
        NTH_CHILD_REGEXP = /^(?:(\d*)[n|N])([\+|\-](\d+))?$/, // an+b
        STRING = 'string',
        CLASS = 'class',
        STYLE = 'style',
        ID = 'id',
        SPLIT_CHARACTER = {
            ' ': true,
            '>': true,
            '+': true, // only select the element when it is immediately preceded by the former element
            '~': true  // only the element when it has the former element as a sibling. (just like `+`, but less strict)
        },
        STORABLE_SPLIT_CHARACTER = {
            '>': true,
            '+': true,
            '~': true
        },
        SIBLING_MATCH_CHARACTER = {
            '+': true,
            '~': true
        },
        ATTR_DETAIL_SPECIFIERS = {
            '^': true, // “begins with” selector
            '$': true, // “ends with” selector
            '*': true, // “contains” selector (might be a substring)
            '~': true, // “contains” selector as a separate word, separated by spaces
            '|': true // “contains” selector as a separate word, separated by `|`
        },
        /**
         * Object to gain quick access to attribute-name end-tokens.
         *
         * @property END_ATTRIBUTENAME
         * @default {
         *      '=': true,
         *      ']': true
         *  }
         * @type Object
         * @protected
         * @since 0.0.1
         */
        END_ATTRIBUTENAME = {
            '=': true,
            ']': true,
            '^': true, // “begins with” selector
            '$': true, // “ends with” selector
            '*': true, // “contains” selector (might be a substring)
            '~': true, // “contains” selector as a separate word, separated by spaces
            '|': true // “contains” selector as a separate word, separated by `|`
        },
        /**
         * Object to gain quick access to different changes of Element nodeType changes.
         *
         * @property NODESWITCH
         * @default {
         *      1: {
         *          1: 1,
         *          3: 2,
         *          8: 3
         *      },
         *      3: {
         *          1: 4,
         *          3: 5,
         *          8: 6
         *      },
         *      8: {
         *          1: 7,
         *          3: 8,
         *          8: 9
         *      }
         *  }
         * @type Object
         * @protected
         * @since 0.0.1
         */
        NODESWITCH = {
            1: {
                1: 1, // oldNodeType==Element, newNodeType==Element
                3: 2, // oldNodeType==Element, newNodeType==TextNode
                8: 3  // oldNodeType==Element, newNodeType==Comment
            },
            3: {
                1: 4, // oldNodeType==TextNode, newNodeType==Element
                3: 5, // oldNodeType==TextNode, newNodeType==TextNode
                8: 6  // oldNodeType==TextNode, newNodeType==Comment
            },
            8: {
                1: 7, // oldNodeType==Comment, newNodeType==Element
                3: 8, // oldNodeType==Comment, newNodeType==TextNode
                8: 9  // oldNodeType==Comment, newNodeType==Comment
            }
        },
        /**
         * Object to gain quick access to selector start-tokens.
         *
         * @property SELECTOR_IDENTIFIERS
         * @default {
         *      '#': 1,
         *      '.': 2,
         *      '[': 3
         *  }
         * @type Object
         * @protected
         * @since 0.0.1
         */
        SELECTOR_IDENTIFIERS = {
            '#': 1,
            '.': 2,
            '[': 3,
            ':': 4
        },
        PSEUDO_FIRST_CHILD = ':first-child',
        PSEUDO_FIRST_OF_TYPE = ':first-of-type',
        PSEUDO_LAST_CHILD = ':last-child',
        PSEUDO_LAST_OF_TYPE = ':last-of-type',
        PSEUDO_NTH_CHILD = ':nth-child',
        PSEUDO_NTH_LAST_CHILD = ':nth-last-child',
        PSEUDO_NTH_LAST_OF_TYPE = ':nth-last-of-type',
        PSEUDO_NTH_OF_TYPE = ':nth-of-type',
        PSEUDO_ONLY_OF_TYPE = ':only-of-type',
        PSEUDO_ONLY_CHILD = ':only-child',
        /**
         * Object to gain quick access to the selectors that required children
         *
         * @property PSEUDO_REQUIRED_CHILDREN
         * @default {
         *     ':first-child': true,
         *     ':first-of-type': true,
         *     ':last-child': true,
         *     ':last-of-type': true,
         *     ':nth-child': true,
         *     ':nth-last-child': true,
         *     ':nth-last-of-type': true,
         *     ':nth-of-type': true,
         *     ':only-of-type': true,
         *     ':only-child': true
         *  }
         * @type Object
         * @protected
         * @since 0.0.1
         */
        PSEUDO_REQUIRED_CHILDREN = {},
        _matchesSelectorItem, _matchesOneSelector, _findElementSibling, vNodeProto,
        _splitSelector, _findNodeSibling, _matchNthChild;

        PSEUDO_REQUIRED_CHILDREN[PSEUDO_FIRST_CHILD] = true;
        PSEUDO_REQUIRED_CHILDREN[PSEUDO_FIRST_OF_TYPE] = true;
        PSEUDO_REQUIRED_CHILDREN[PSEUDO_LAST_CHILD] = true;
        PSEUDO_REQUIRED_CHILDREN[PSEUDO_LAST_OF_TYPE] = true;
        PSEUDO_REQUIRED_CHILDREN[PSEUDO_NTH_CHILD] = true;
        PSEUDO_REQUIRED_CHILDREN[PSEUDO_NTH_LAST_CHILD] = true;
        PSEUDO_REQUIRED_CHILDREN[PSEUDO_NTH_LAST_OF_TYPE] = true;
        PSEUDO_REQUIRED_CHILDREN[PSEUDO_NTH_OF_TYPE] = true;
        PSEUDO_REQUIRED_CHILDREN[PSEUDO_ONLY_OF_TYPE] = true;
        PSEUDO_REQUIRED_CHILDREN[PSEUDO_ONLY_CHILD] = true;

   /**
    * Searches for the next -or previous- node-sibling (nodeType of 1, 3 or 8).
    *
    * @method _findNodeSibling
    * @param vnode {Object} the vnode to inspect
    * @param [next] {Boolean} whether to search for the next, or previous match.
    * @return {Object|undefined} the vnode that matches the search
    * @protected
    * @private
    * @since 0.0.1
    */
    _findNodeSibling = function(vnode, next) {
        var vParent = vnode.vParent,
            index;
        if (!vParent || !vParent.vChildNodes) {
            return;
        }
        index = vParent.vChildNodes.indexOf(vnode) + (next ? 1 : -1);
        return vParent.vChildNodes[index];
    };

   /**
    * Searches for the next -or previous- Element-sibling (nodeType of 1).
    *
    * @method _findElementSibling
    * @param vnode {Object} the vnode to inspect
    * @param [next] {Boolean} whether to search for the next, or previous match.
    * @return {Object|undefined} the vnode that matches the search
    * @protected
    * @private
    * @since 0.0.1
    */
    _findElementSibling = function(vnode, next) {
        var vParent = vnode.vParent,
            index;
        if (!vParent || !vParent.vChildNodes) {
            return;
        }
        if (vnode.nodeType===1) {
            index = vParent.vChildren.indexOf(vnode) + (next ? 1 : -1);
            return vParent.vChildren[index];
        }
        else {
/*jshint noempty:true */
            while ((vnode=_findNodeSibling(vnode, next)) && (vnode.nodeType!==1)) {}
/*jshint noempty:false */
            return vnode;
        }
    };

   /**
    * Check whether the vnode matches a "nth-child" test, which is used for css pseudoselectors like `nth-child`, `nth-of-type` etc.
    *
    * @method _matchNthChild
    * @param pseudoArg {String} the argument for nth-child
    * @param index {Number} the index of the inspected vnode
    * @return {Boolean} whether the vnode matches the nthChild test
    * @protected
    * @private
    * @since 0.0.1
    */
    _matchNthChild = function(pseudoArg, index) {
        var match, k, a, b, nodeOk, nthIndex, sign;
        (pseudoArg==='even') && (pseudoArg='2n');
        (pseudoArg==='odd') && (pseudoArg='2n+1');

        match = pseudoArg.match(NTH_CHILD_REGEXP);
        if (!match) {
            return false;
        }
        // pseudoArg follows the pattern: `an+b`
        a = match[1];
        sign = match[2];
        b = match[3];
        (b==='') && (b=0);
        if (!a) {
            // only fixed index to match
            return (sign==='-') ? false : (parseInt(b, 10)===index);
        }
        else {
            // we need to iterate
            nodeOk = false;
            b = window.Number(b);
            for (k=0; !nodeOk; k++) {
                nthIndex = (sign==='-') ? (a*k) - b : (a*k) + b;
                if (nthIndex===index) {
                    nodeOk = true;
                }
                else if (nthIndex>index) {
                    // beyond index --> will never become a fix anymore
                    return false;
                }
            }
            return nodeOk;
        }
    };

   /**
    * Check whether the vnode matches the css-selector. the css-selector should be a single selector,
    * not multiple, so it shouldn't contain a `comma`.
    *
    * @method _matchesOneSelector
    * @param vnode {vnode} the vnode to inspect
    * @param selector {String} the selector-item to check the match for
    * @param [relatedVNode] {vnode} a related vnode where to selectors starting with `>`, `~` or `+` should be compared.
    *        If not specified, any of these three starting selector-characters will be ignored (leading to matching this first character).
    * @return {Boolean} whether the vnode matches the css-selector
    * @protected
    * @private
    * @since 0.0.1
    */
    _matchesOneSelector = function(vnode, selector, relatedVNode) {
        var selList = _splitSelector(selector),
            size = selList.length,
            originalVNode = vnode,
            firstSelectorChar = selector[0],
            i, selectorItem, selMatch, directMatch, vParentvChildren, indexRelated;

        if (size===0) {
            return false;
        }

        selectorItem = selList[size-1];
        selMatch = _matchesSelectorItem(vnode, selectorItem);
        for (i=size-2; (selMatch && (i>=0)); i--) {
            selectorItem = selList[i];
            if (SIBLING_MATCH_CHARACTER[selectorItem]) {
                // need to search through the same level
                if (--i>=0) {
                    directMatch = (selectorItem==='+');
                    selectorItem = selList[i];
                    // need to search the previous siblings
                    vnode = vnode.vPreviousElement;
                    if (!vnode) {
                        return false;
                    }
                    if (directMatch) {
                        // should be immediate match
                        selMatch = _matchesSelectorItem(vnode, selectorItem);
                    }
                    else {
                        while (vnode && !(selMatch=_matchesSelectorItem(vnode, selectorItem))) {
                            vnode = vnode.vPreviousElement;
                        }
                    }
                }
            }
            else {
                // need to search up the tree
                vnode = vnode.vParent;
                if (!vnode || ((vnode===relatedVNode) && (selectorItem!=='>'))) {
                    return false;
                }
                if (selectorItem==='>') {
                    if (--i>=0) {
                        selectorItem = selList[i];
                       // should be immediate match
                        selMatch = _matchesSelectorItem(vnode, selectorItem);
                    }
                }
                else {
                    while (!(selMatch=_matchesSelectorItem(vnode, selectorItem))) {
                        vnode = vnode.vParent;
                        if (!vnode || (vnode===relatedVNode)) {
                            return false;
                        }
                    }
                }
            }
        }
        if (selMatch && relatedVNode && STORABLE_SPLIT_CHARACTER[firstSelectorChar]) {
            // when `selector` starts with `>`, `~` or `+`, then
            // there should also be a match comparing a related node!
            switch (firstSelectorChar) {
                case '>':
                    selMatch = (relatedVNode.vChildren.indexOf(originalVNode)!==-1);
                break;
                case '~':
                    vParentvChildren = originalVNode.vParent.vChildren;
                    indexRelated = vParentvChildren.indexOf(relatedVNode);
                    selMatch = (indexRelated!==-1) && (indexRelated<vParentvChildren.indexOf(originalVNode));
                break;
                case '+':
                    selMatch = (originalVNode.vPreviousElement === relatedVNode);
            }
        }
        return selMatch;
    };

   /**
    * Check whether the vnode matches one specific selector-item. Suppose the css-selector: "#mynode li.red .blue"
    * then there are 3 selector-items: "#mynode",  "li.red" and ".blue"
    *
    * This method also can handle the new selectors:
    * <ul>
    *     <li>[att^=val] –-> the “begins with” selector</li>
    *     <li>[att$=val] –-> the “ends with” selector</li>
    *     <li>[att*=val] –-> the “contains” selector (might be a substring)</li>
    *     <li>[att~=val] –-> the “contains” selector as a separate word, separated by spaces</li>
    *     <li>[att|=val] –-> the “contains” selector as a separate word, separated by `|`</li>
    *     <li>+ --> (same level)</li>
    *     <li>~ --> (same level)</li>
    * </ul>
    *
    * @method _matchesSelectorItem
    * @param vnode {Object} the vnode to inspect
    * @param selectorItem {String} the selector-item to check the match for
    * @return {Boolean} whether the vnode matches the selector-item
    * @protected
    * @private
    * @since 0.0.1
    */
    _matchesSelectorItem = function (vnode, selectorItem) {
        var i = 0,
            len = selectorItem.length,
            character = selectorItem[0],
            tagName, id, className, attributeName, attributeValue, stringMarker, attributeisString, isBoolean, insideAttributeValue, insideAttribute,
            vParent, checkBoolean, treatment, k, min, max, value, len2, index, found, pseudo, pseudoArg, arglevel, count, vParentVChildren;
        if (selectorItem==='*') {
            return true;
        }
        if (!SELECTOR_IDENTIFIERS[character]) {
            // starts with tagName
            tagName = '';
            // reposition i to continue in the right way:
            i--;
            while ((++i<len) && (character=selectorItem[i]) && !SELECTOR_IDENTIFIERS[character]) {
                tagName += character;
            }
            if (tagName.toUpperCase()!==vnode.tag) {
                return false;
            }
        }
        while (i<len) {
            switch (character) {
                case '#':
                    id = '';
                    while ((++i<len) && (character=selectorItem[i]) && !SELECTOR_IDENTIFIERS[character]) {
                        id += character;
                    }
                    if (id!==vnode.id) {
                        return false;
                    }
                    break;
                case '.':
                    className = '';
                    while ((++i<len) && (character=selectorItem[i]) && !SELECTOR_IDENTIFIERS[character]) {
                        className += character;
                    }

                    if (!vnode.hasClass(className)) {
                        return false;
                    }
                    break;
                case '[':
                    attributeName = '';
                    while ((++i<len) && (character=selectorItem[i]) && !END_ATTRIBUTENAME[character]) {
                        attributeName += character;
                    }
                    // if character===']' then we have an attribute without a value-definition
                    if (!vnode.attrs[attributeName] || ((character===']') && (vnode.attrs[attributeName]!==''))) {
                        return !!vnode.attrs[attributeName];
                    }
                    // now we read the value of the attribute
                    // however, it could be that the selector has a special `detailed` identifier set (defined by: ATTR_DETAIL_SPECIFIERS)
                    if (ATTR_DETAIL_SPECIFIERS[character]) {
                        treatment = character; // store the character to know how the attributedata should be treaded
                        i++; // character should be a "=" by now
                    }
                    else {
                        treatment = null;
                    }
                    attributeValue = '';
                    stringMarker = selectorItem[i+1];
                    attributeisString = (stringMarker==='"') || (stringMarker==="'");
                    attributeisString && (i++);

                    // end of attributaValue = (character===']') && (!attributeisString || (selectorItem[i-1]===stringMarker))
                    while ((++i<len) && (character=selectorItem[i]) && !((character===']') && (!attributeisString || (selectorItem[i-1]===stringMarker)))) {
                        attributeValue += character;
                    }

                    if (attributeisString) {
                        // if attribute is string, then we need to _remove to last stringmarker
                        attributeValue = attributeValue.substr(0, attributeValue.length-1);
                    }
                    else {
                        // if attribute is no string, then we need to typecast its value
                        isBoolean = ((attributeValue.length>3) && (attributeValue.length<6) &&
                                     (checkBoolean=attributeValue.toUpperCase()) &&
                                     ((checkBoolean==='FALSE') || (checkBoolean==='TRUE')));
                        // typecast the value to either Boolean or Number:
                        attributeValue = isBoolean ? (checkBoolean==='TRUE') : parseFloat(attributeValue);
                    }

                    // depending upon how the attributedata should be treated:
                    if (treatment) {
                        switch (treatment) {
                            case '^': // “begins with” selector
                                if (!vnode.attrs[attributeName].startsWith(attributeValue)) {
                                    return false;
                                }
                                break;
                            case '$': // “ends with” selector
                                if (!vnode.attrs[attributeName].endsWith(attributeValue)) {
                                    return false;
                                }
                                break;
                            case '*': // “contains” selector (might be a substring)
                                if (!vnode.attrs[attributeName].contains(attributeValue)) {
                                    return false;
                                }
                                break;
                            case '~': // “contains” selector as a separate word, separated by spaces
                                if (!(' '+vnode.attrs[attributeName]+' ').contains(' '+attributeValue+' ')) {
                                    return false;
                                }
                                break;
                            case '|': // “contains” selector as a separate word, separated by `|`
                                if (!('|'+vnode.attrs[attributeName]+'|').contains('|'+attributeValue+'|')) {
                                    return false;
                                }
                                break;
                        }
                    }
                    else if (vnode.attrs[attributeName]!==attributeValue) {
                        return false;
                    }

                    // we still need to increase one position:
                    (++i<len) && (character=selectorItem[i]);
                    break;
                case ':':
                    // we have a pseudo-selector
                    // first, find out which one
                    // because '::' is a valid start (though without any selection), we start to back the next character as well:
                    pseudo = ':'+selectorItem[++i];
                    pseudoArg = '';
                    vParent = vnode.vParent;
                    vParentVChildren = vParent && vParent.vChildren;
                    // pseudo-selectors might have an argument passed in, like `:nth-child(2n+1)` or `:not([type="checkbox"])` --> we
                    // store this argument inside `pseudoArg`
                    // also note that combinations are possible with `:not` --> `:not(:nth-child(2n+1))`
                    // also note that we cannot "just" look for a closing character when running into the usage of attributes:
                    // for example --> `:not([data-x="some data :)"])`
                    // that's why -once we are inside attribute-data- we need to continue until the attribute-data ends
                    while ((++i<len) && (character=selectorItem[i]) && !SELECTOR_IDENTIFIERS[character]) {
                        if (character==='(') {
                            // starting arguments
                            arglevel = 1;
                            insideAttribute = false;
                            insideAttributeValue = false;
                            while ((++i<len) && (character=selectorItem[i]) && (arglevel>0)) {
                                if (!insideAttribute) {
                                    if (character==='(') {
                                        arglevel++;
                                    }
                                    else if (character===')') {
                                        arglevel--;
                                    }
                                    else if (character==='[') {
                                        insideAttribute = true;
                                    }
                                }
                                else {
                                    // inside attribute
                                    if (!insideAttributeValue) {
                                        if ((character==='"') || (character==="'")) {
                                            insideAttributeValue = true;
                                            stringMarker = character;
                                        }
                                        else if (character===']') {
                                            insideAttribute = false;
                                        }
                                    }
                                    else if ((character===stringMarker) && (selectorItem[i+1]===']')) {
                                        insideAttributeValue = false;
                                    }
                                }
                                (arglevel>0) && (pseudoArg+=character);
                            }
                        }
                        else {
                            pseudo += character;
                        }
                    }
                    // now, `pseudo` is known as well as its possible pseudoArg
                    if (!vParentVChildren && PSEUDO_REQUIRED_CHILDREN[pseudo]) {
                        return false;
                    }
                    switch (pseudo) {
                        case ':checked': // input:checked   Selects every checked <input> element
                            if (!vnode.attrs.checked) {
                                return false;
                            }
                            break;
                        case ':disabled': // input:disabled  Selects every disabled <input> element
                            if (!vnode.attrs.disabled) {
                                return false;
                            }
                            break;
                        case ':empty': // p:empty Selects every <p> element that has no children (including text nodes)
                            if (vnode.vChildNodes && (vnode.vChildNodes.length>0)) {
                                return false;
                            }
                            break;
                        case ':enabled': // input:enabled   Selects every enabled <input> element
                            if (vnode.attrs.disabled) {
                                return false;
                            }
                            break;
                        case PSEUDO_FIRST_CHILD: // p:first-child   Selects every <p> element that is the first child of its parent
                            if (vParentVChildren[0]!==vnode) {
                                return false;
                            }
                            break;
                        case PSEUDO_FIRST_OF_TYPE: // p:first-of-type Selects every <p> element that is the first <p> element of its parent
                            for (k=vParentVChildren.indexOf(vnode)-1; k>=0; k--) {
                                if (vParentVChildren[k].tag===vnode.tag) {
                                    return false;
                                }
                            }
                            break;
                        case ':focus': // input:focus Selects the input element which has focus
                            if (vnode.domNode!==DOCUMENT.activeElement) {
                                return false;
                            }
                            break;
                        case ':in-range': // input:in-range  Selects input elements with a value within a specified range
                            if ((vnode.tag!=='INPUT') || ((vnode.attrs.type || '').toLowerCase()!=='number')) {
                                return false;
                            }
                            min = parseInt(vnode.attrs.min, 10);
                            max = parseInt(vnode.attrs.max, 10);
                            value = parseInt(vnode.domNode.value, 10);
                            if (!value || !min || !max || (value<min) || (value>max)) {
                                return false;
                            }
                            break;
                        case ':lang': // p:lang(it)  Selects every <p> element with a lang attribute equal to "it" (Italian)
                            if (vnode.attrs.lang!==pseudoArg) {
                                return false;
                            }
                            break;
                        case PSEUDO_LAST_CHILD: // p:last-child    Selects every <p> element that is the last child of its parent
                            if (vParentVChildren[vParentVChildren.length-1]!==vnode) {
                                return false;
                            }
                            break;
                        case PSEUDO_LAST_OF_TYPE: // p:last-of-type  Selects every <p> element that is the last <p> element of its parent
                            len2 = vParentVChildren.length;
                            for (k=vParentVChildren.indexOf(vnode)+1; k<len2; k++) {
                                if (vParentVChildren[k].tag===vnode.tag) {
                                    return false;
                                }
                            }
                            break;
                        case ':not': // :not(p) Selects every element that is not a <p> element
                            if (vnode.matchesSelector(pseudoArg)) {
                                return false;
                            }
                            break;
                        case PSEUDO_NTH_CHILD: // p:nth-child(2)  Selects every <p> element that is the second child of its parent
                            // NOTE: css `nth` starts with 1 instead of 0 !!!
                            index = vParentVChildren.indexOf(vnode)+1;
                            if (!_matchNthChild(pseudoArg, index)) {
                                return false;
                            }
                            break;
                        case PSEUDO_NTH_LAST_CHILD: // p:nth-last-child(2) Selects every <p> element that is the second child of its parent, counting from the last child
                            // NOTE: css `nth` starts with 1 instead of 0 !!!
                            // Also, nth-last-child counts from bottom up
                            index = vParentVChildren.length - vParentVChildren.indexOf(vnode);
                            if (!_matchNthChild(pseudoArg, index)) {
                                return false;
                            }
                            break;
                        case PSEUDO_NTH_LAST_OF_TYPE: // p:nth-last-of-type(2)   Selects every <p> element that is the second <p> element of its parent, counting from the last child
                            // NOTE: css `nth` starts with 1 instead of 0 !!!
                            // Also, nth-last-child counts from bottom up
                            index = vParentVChildren.length - vParentVChildren.indexOf(vnode);
                            // NOTE: css `nth` starts with 1 instead of 0 !!!
                            found = false;
                            index = 0;
                            for (k=vParentVChildren.length-1; (k>=0) && !found; k--) {
                                (vParentVChildren[k].tag===vnode.tag) && index++;
                                (vParentVChildren[k]===vnode) && (found=true);
                            }
                            if (!found || !_matchNthChild(pseudoArg, index)) {
                                return false;
                            }
                            break;
                        case PSEUDO_NTH_OF_TYPE: // p:nth-of-type(2)    Selects every <p> element that is the second <p> element of its parent
                            // NOTE: css `nth` starts with 1 instead of 0 !!!
                            found = false;
                            len2 = vParentVChildren.length;
                            index = 0;
                            for (k=0; (k<len2) && !found; k++) {
                                (vParentVChildren[k].tag===vnode.tag) && index++;
                                (vParentVChildren[k]===vnode) && (found=true);
                            }
                            if (!found || !_matchNthChild(pseudoArg, index)) {
                                return false;
                            }
                            break;
                        case PSEUDO_ONLY_OF_TYPE: // p:only-of-type  Selects every <p> element that is the only <p> element of its parent
                            len2 = vParentVChildren.length;
                            count = 0;
                            for (k=0; (k<len2) && (count<=1); k++) {
                                (vParentVChildren[k].tag===vnode.tag) && count++;
                            }
                            if (count!==1) {
                                return false;
                            }
                            break;
                        case PSEUDO_ONLY_CHILD: // p:only-child    Selects every <p> element that is the only child of its parent
                            if (vParentVChildren.length!==1) {
                                return false;
                            }
                            break;
                        case ':optional': // input:optional  Selects input elements with no "required" attribute
                            if (vnode.attrs.required) {
                                return false;
                            }
                            break;
                        case ':out-of-range': // input:out-of-range  Selects input elements with a value outside a specified range
                            if ((vnode.tag!=='INPUT') || ((vnode.attrs.type || '').toLowerCase()!=='number')) {
                                return false;
                            }
                            min = parseInt(vnode.attrs.min, 10);
                            max = parseInt(vnode.attrs.max, 10);
                            value = parseInt(vnode.domNode.value, 10);
                            if (!value || !min || !max || ((value>=min) && (value<=max))) {
                                return false;
                            }
                            break;
                        case ':read-only': // input:read-only Selects input elements with the "readonly" attribute specified
                            if (!vnode.attrs.readonly) {
                                return false;
                            }
                            break;
                        case ':read-write': // input:read-write    Selects input elements with the "readonly" attribute NOT specified
                            if (vnode.attrs.readonly) {
                                return false;
                            }
                            break;
                        case ':required': // input:required  Selects input elements with the "required" attribute specified
                            if (!vnode.attrs.required) {
                                return false;
                            }
                            break;
                        case ':root': // Selects the document's root element
                            if (vnode.domNode!==DOCUMENT.documentElement) {
                                return false;
                            }
                            break;
                    }
            }
        }
        return true;
    };

    /**
     * Splits the selector into separate subselector-items that should match different elements through the tree.
     * Special characters '>' and '+' are added as separate items in the hash.
     *
     * @method _splitSelector
     * @param selector {String} the selector-item to check the match for
     * @return {Array} splitted selectors
     * @protected
     * @private
     * @since 0.0.1
     */
    _splitSelector = function(selector) {
        var list = [],
            len = selector.length,
            sel = '',
            i, character, insideDataAttr;

        for (i=0; i<len; i++) {
            character = selector[i];
            if (character==='[') {
                sel += character;
                insideDataAttr = true;
            }
            else if (character===']') {
                sel += character;
                insideDataAttr = false;
            }
            else if (insideDataAttr || !SPLIT_CHARACTER[character]) {
                sel += character;
            }
            else {
                // unique selectoritem is found, add it to the list
                if (sel.length>0) {
                    list[list.length] = sel;
                    sel = '';
                }
                // in case the last character was '>', '+' or '~', we need to add it as a separate item
                STORABLE_SPLIT_CHARACTER[character] && (list[list.length]=character);
            }
        }
        // add the last item
        if (sel.length>0) {
            list[list.length] = sel;
            sel = '';
        }
        return list;
    };

    vNodeProto = window._ITSAmodules.VNode = {
       /**
        * Check whether the vnode's domNode is equal, or contains the specified Element.
        *
        * @method contains
        * @return {Boolean} whether the vnode's domNode is equal, or contains the specified Element.
        * @since 0.0.1
        */
        contains: function(otherVNode) {
            while (otherVNode && (otherVNode!==this)) {
                otherVNode = otherVNode.vParent;
            }
            return (otherVNode===this);
        },

       /**
        * Returns the first child-vnode (if any). The child represents an Element (nodeType===1).
        *
        * @method firstOfVChildren
        * @param cssSelector {String} one or more css-selectors
        * @return {Object|null} the first child-vnode or null when not present
        * @since 0.0.1
        */
        firstOfVChildren: function(cssSelector) {
            var instance = this,
                found, i, len, vChildren, element;
            if (!cssSelector) {
                return instance.vFirstElementChild;
            }
            vChildren = instance.vChildren;
            len = vChildren.length;
            for (i=0; !found && (i<len); i++) {
                element = vChildren[i];
                element.matchesSelector(cssSelector) && (found=element);
            }
            return found;
        },

       /**
        * Checks whether the vnode has any vChildNodes (nodeType of 1, 3 or 8).
        *
        * @method hasVChildNodes
        * @return {Boolean} whether the vnode has any vChildNodes.
        * @since 0.0.1
        */
        hasVChildNodes: function() {
            return this.vChildNodes ? (this.vChildNodes.length>0) : false;
        },

       /**
        * Checks whether the vnode has any vChildren (vChildNodes with nodeType of 1).
        *
        * @method hasVChildren
        * @return {Boolean} whether the vnode has any vChildren.
        * @since 0.0.1
        */
        hasVChildren: function() {
            return this.vChildNodes ? (this.vChildren.length>0) : false;
        },

       /**
        * Checks whether the className is present on the vnode.
        *
        * @method hasClass
        * @param className {String|Array} the className to check for. May be an Array of classNames, which all needs to be present.
        * @return {Boolean} whether the className (or classNames) is present on the vnode
        * @since 0.0.1
        */
        hasClass: function(className) {
            var instance = this,
                check = function(cl) {
                    return !!instance.classNames[cl];
                };
            if (!instance.classNames) {
                return false;
            }
            if (typeof className === STRING) {
                return check(className);
            }
            else if (Array.isArray(className)) {
                return className.every(check);
            }
            return false;
        },

       /**
        * Returns the last child-vnode (if any). The child represents an Element (nodeType===1).
        *
        * @method lastOfVChildren
        * @param cssSelector {String} one or more css-selectors
        * @return {Object|null} the last child-vnode or null when not present
        * @since 0.0.1
        */
        lastOfVChildren: function(cssSelector) {
            var vChildren = this.vChildren,
                found, i, element;
            if (vChildren) {
                if (!cssSelector) {
                    return this.vLastElementChild;
                }
                for (i=vChildren.length-1; !found && (i>=0); i--) {
                    element = vChildren[i];
                    element.matchesSelector(cssSelector) && (found=element);
                }
            }
            return found;
        },

       /**
        * Checks whether the vnode matches one of the specified selectors. `selectors` can be one, or multiple css-selectors,
        * separated by a `comma`. For example: "#myid li.red blue" is one selector, "div.red, div.blue, div.green" are three selectors.
        *
        * @method matchesSelector
        * @param selectors {String} one or more css-selectors
        * @param [relatedVNode] {vnode} a related vnode where to selectors starting with `>`, `~` or `+` should be compared.
        *        If not specified, any of these three starting selector-characters will be ignored (leading to matching this first character).
        * @return {Boolean} whether the vnode matches one of the selectors
        * @since 0.0.1
        */
        matchesSelector: function(selectors, relatedVNode) {
            var instance = this;
            if (instance.nodeType!==1) {
                return false;
            }
            selectors = selectors.split(',');
            // we can use Array.some, because there won't be many separated selectoritems,
            // so the final invocation won't be delayed much compared to looping
            return selectors.some(function(selector) {
                return _matchesOneSelector(instance, selector, relatedVNode);
            });
        },

       /**
        * Reloads the DOM-attribute into the vnode.
        *
        * @method matchesSelector
        * @param attributeName {String} the name of the attribute to be reloaded.
        * @return {Node} the domNode that was reloaded.
        * @since 0.0.1
        */
        reloadAttr: function(attributeName) {
            var instance = this,
                domNode = instance.domNode,
                attributeValue = domNode._getAttribute(attributeName),
                attrs = instance.attrs,
                extractStyle, extractClass;
            if (instance.nodeType==1) {
                attributeValue || (attributeValue='');
                if (attributeValue==='') {
                    delete attrs[attributeName];
                    // in case of STYLE attributeName --> special treatment
                    (attributeName===STYLE) && (instance.styles={});
                    // in case of CLASS attributeName --> special treatment
                    (attributeName===CLASS) && (instance.classNames={});
                    // in case of ID attributeName --> special treatment
                    if ((attributeName===ID) && (instance.id)) {
                        delete nodeids[instance.id];
                        delete instance.id;
                    }
                }
                else {
                    attrs[attributeName] = attributeValue;
                    // in case of STYLE attributeName --> special treatment
                    if (attributeName===STYLE) {
                        extractStyle = extractor.extractStyle(attributeValue);
                        attributeValue = extractStyle.attrStyle;
                        if (attributeValue) {
                            attrs.style = attributeValue;
                        }
                        else {
                            delete attrs.style;
                        }
                        instance.styles = extractStyle.styles;
                    }
                    else if (attributeName===CLASS) {
                        // in case of CLASS attributeName --> special treatment
                        extractClass = extractor.extractClass(attributeValue);
                        attributeValue = extractClass.attrClass;
                        if (attributeValue) {
                            attrs[CLASS] = attributeValue;
                        }
                        else {
                            delete attrs[CLASS];
                        }
                        instance.classNames = extractClass.classNames;
                    }
                    else if (attributeName===ID) {
                        instance.id && (instance.id!==attributeValue) && (delete nodeids[instance.id]);
                        instance.id = attributeValue;
                        nodeids[attributeValue] = domNode;
                    }
                }
            }
            return domNode;
        },

        serializeStyles: function() {
            return extractor.serializeStyles(this.styles);
        },

       /**
        * Syncs the vnode's nodeid (if available) inside `NS-vdom.nodeids`.
        *
        * Does NOT sync with the dom. Can be invoked multiple times without issues.
        *
        * @method storeId
        * @chainable
        * @since 0.0.1
        */
        storeId: function() {
            // store node/vnode inside WeakMap:
            var instance = this;
            instance.id ? (nodeids[instance.id]=instance.domNode) : (delete nodeids[instance.id]);
            return instance;
        },

        //---- private ------------------------------------------------------------------

        /**
         * Adds a vnode to the end of the list of vChildNodes.
         *
         * Syncs with the DOM.
         *
         * @method _appendChild
         * @param VNode {vnode} vnode to append
         * @private
         * @return {Node} the Node that was appended
         * @since 0.0.1
         */
        _appendChild: function(VNode) {
            var instance = this,
                domNode = VNode.domNode,
                size;
            VNode._moveToParent(instance);
            instance.domNode._appendChild(domNode);
            if (VNode.nodeType===3) {
                size = instance.vChildNodes.length;
                instance._normalize();
                // if the size changed, then the domNode was merged
                (size===instance.vChildNodes.length) || (domNode=instance.vChildNodes[instance.vChildNodes.length-1].domNode);
            }
            return domNode;
        },

       /**
        * Removes the vnode from its parent vChildNodes- and vChildren-list.
        *
        * Does NOT sync with the dom.
        *
        * @method _deleteFromParent
        * @private
        * @chainable
        * @since 0.0.1
        */
        _deleteFromParent: function() {
            var instance = this,
                vParent = instance.vParent;
            if (vParent && vParent.vChildNodes) {
                vParent.vChildNodes.remove(instance);
                // force to recalculate the vChildren on a next call:
                (instance.nodeType===1) && (vParent._vChildren=null);
            }
            return instance;
        },

       /**
        * Destroys the vnode and all its vnode-vChildNodes.
        * Removes it from its vParent.vChildNodes list,
        * also removes its definitions inside `NS-vdom.nodeids`.
        *
        * Does NOT sync with the dom.
        *
        * @method _destroy
        * @private
        * @chainable
        * @since 0.0.1
        */
        _destroy: function() {
            var instance = this,
                vChildNodes = instance.vChildNodes,
                len, i, vChildNode;
            if (!instance.destroyed) {
                Object.defineProperty(instance, 'destroyed', {
                    value: true,
                    writable: false,
                    configurable: false,
                    enumerable: true
                });
                // first: _remove all its vChildNodes
                if ((instance.nodeType===1) && vChildNodes) {
                    len = vChildNodes.length;
                    for (i=0; i < len; i++) {
                        vChildNode = vChildNodes[i];
                        vChildNode && vChildNode._destroy();
                    }
                }
                instance._vChildren = null;
                // explicitely set instance.domNode._vnode and instance.domNode to null in order to prevent problems with the GC (we break the circular reference)
                delete instance.domNode._vnode;
                // if valid id, then _remove the DOMnodeRef from internal hash
                instance.id && delete nodeids[instance.id];
                instance._deleteFromParent();
                async(function() {
                    instance.domNode = null;
                });
            }
            return instance;
        },

        /**
         * Inserts `newVNode` before `refVNode`.
         *
         * Syncs with the DOM.
         *
         * @method _insertBefore
         * @param newVNode {vnode} vnode to insert
         * @param refVNode {vnode} The vnode before which newVNode should be inserted.
         * @private
         * @return {Node} the Node being inserted (equals domNode)
         * @since 0.0.1
         */
        _insertBefore: function(newVNode, refVNode) {
            var instance = this,
                domNode = newVNode.domNode,
                index = instance.vChildNodes.indexOf(refVNode);
            if (index!==-1) {
                newVNode._moveToParent(instance, index);
                instance.domNode._insertBefore(domNode, refVNode.domNode);
                (newVNode.nodeType===3) && instance._normalize();
            }
            return domNode;
        },

       /**
        * Moves the vnode from its current parent.vChildNodes list towards a new parent vnode at the specified position.
        *
        * Does NOT sync with the dom.
        *
        * @method _moveToParent
        * @param parentVNode {vnode} the parent-vnode
        * @param [index] {Number} the position of the child. When not specified, it will be appended.
        * @private
        * @chainable
        * @since 0.0.1
        */
        _moveToParent: function(parentVNode, index) {
            var instance = this,
                vParent = instance.vParent;
            instance._deleteFromParent();
            instance.vParent = parentVNode;
            parentVNode.vChildNodes || (parentVNode.vChildNodes=[]);
            (typeof index==='number') ? parentVNode.vChildNodes.insertAt(instance, index) : (parentVNode.vChildNodes[parentVNode.vChildNodes.length]=instance);
            // force to recalculate the vChildren on a next call:
            vParent && (instance.nodeType===1) && (vParent._vChildren = null);
            // force to recalculate the vChildren on a next call:
            parentVNode && (instance.nodeType===1) && (parentVNode._vChildren=null);
            return instance;
        },

       /**
        * Removes empty TextNodes and merges following TextNodes inside the vnode.
        *
        * Syncs with the dom.
        *
        * @method _normalize
        * @private
        * @chainable
        * @since 0.0.1
        */
        _normalize: function() {
            var instance = this,
                domNode = instance.domNode,
                vChildNodes = instance.vChildNodes,
                i, preChildNode, vChildNode;
            if (!instance._unNormalizable && vChildNodes) {
                for (i=vChildNodes.length-1; i>=0; i--) {
                    vChildNode = vChildNodes[i];
                    preChildNode = vChildNodes[i-1]; // i will get the value `-1` eventually, which leads into undefined preChildNode
                    if (vChildNode.nodeType===3) {
                        if (vChildNode.text==='') {
                            domNode._removeChild(vChildNode.domNode);
                            vChildNode._destroy();
                        }
                        else if (preChildNode && preChildNode.nodeType===3) {
                            preChildNode.text += vChildNode.text;
                            preChildNode.domNode.nodeValue = preChildNode.text;
                            domNode._removeChild(vChildNode.domNode);
                            vChildNode._destroy();
                        }
                    }
                }
            }
            return instance;
        },

       /**
        * Makes the vnode `normalizable`. Could be set to `false` when batch-inserting nodes, while `normalizaing` manually at the end.
        * Afterwards, you should always reset `normalizable` to true.
        *
        * @method _normalizable
        * @param value {Boolean} whether the vnode should be normalisable.
        * @private
        * @chainable
        * @since 0.0.1
        */
        _normalizable: function(value) {
            var instance = this;
            value ? (delete instance._unNormalizable) : (instance._unNormalizable=true);
            return instance;
        },

       /**
        * Prevents MutationObserver from making the dom sync with the vnode.
        * Should be used when manipulating the dom from within the vnode itself (to preventing looping)
        *
        * @method _noSync
        * @chainable
        * @private
        * @since 0.0.1
        */
        _noSync: function() {
            var instance = this;
            if (!instance._nosync) {
                instance._nosync = true;
                async(function() {
                    instance._nosync = false;
                });
            }
            return instance;
        },

       /**
        * Removes the attribute of both the vnode as well as its related dom-node.
        *
        * Syncs with the dom.
        *
        * @method _removeAttr
        * @param attributeName {String}
        * @private
        * @chainable
        * @since 0.0.1
        */
        _removeAttr: function(attributeName) {
            var instance = this;
            delete instance.attrs[attributeName];
            // in case of STYLE attribute --> special treatment
            (attributeName===STYLE) && (instance.styles={});
            // in case of CLASS attribute --> special treatment
            (attributeName===CLASS) && (instance.classNames={});
            if (attributeName===ID) {
                delete nodeids[instance.id];
                delete instance.id;
            }
            instance.domNode._removeAttribute(attributeName);
            return instance;
        },

        /**
        * Removes the vnode's child-vnode from its vChildren and the DOM.
        *
         * Syncs with the DOM.
         *
        * @method removeChild
        * @param VNode {vnode} the child-vnode to remove
        * @private
        * @since 0.0.1
        */
        _removeChild: function(VNode) {
            var instance = this,
                domNode = VNode.domNode,
                hadFocus = domNode.hasFocus() && (VNode.attrs['fm-lastitem']==='true'),
                parentVNode = VNode.vParent;
            VNode._destroy();
            instance.domNode._removeChild(VNode.domNode);
            instance._normalize();
            // now, reset the focus on focusmanager when needed:
            if (hadFocus) {
                while (parentVNode && !parentVNode.attrs['fm-manage']) {
                    parentVNode = parentVNode.vParent;
                }
                parentVNode && parentVNode.domNode.focus();
            }
        },

       /**
        * Replaces the current vnode at the parent.vChildNode list by `newVNode`
        *
        * Does NOT sync with the dom.
        *
        * @method _replaceAtParent
        * @param newVNode {Object} the new vnode which should take over the place of the current vnode
        * @private
        * @chainable
        * @since 0.0.1
        */
        _replaceAtParent: function(newVNode) {
            var instance = this,
                vParent = instance.vParent,
                vChildNodes, index;
            if (vParent && (vChildNodes=vParent.vChildNodes)) {
                index = vChildNodes.indexOf(instance);
                // force to recalculate the vChildren on a next call:
                ((instance.nodeType===1) || (newVNode.nodeType===1)) && (instance.vParent._vChildren=null);
                vChildNodes[index] = newVNode;
            }
            return instance._destroy();
        },

       /**
        * Sets the attribute of both the vnode as well as its related dom-node.
        *
        * Syncs with the dom.
        *
        * @method _setAttr
        * @param attributeName {String}
        * @param value {String} the value for the attributeName
        * @private
        * @chainable
        * @since 0.0.1
        */
        _setAttr: function(attributeName, value) {
            var instance = this,
                extractStyle, extractClass,
                attrs = instance.attrs;
            if (attrs[attributeName]!==value) {
                if ((value===undefined) || (value===undefined)) {
                    instance._removeAttr(attributeName);
                    return instance;
                }
                attrs[attributeName] = value;
                // in case of STYLE attribute --> special treatment
                if (attributeName===STYLE) {
                    extractStyle = extractor.extractStyle(value);
                    value = extractStyle.attrStyle;
                    if (value) {
                        attrs.style = value;
                    }
                    else {
                        delete attrs.style;
                    }
                    instance.styles = extractStyle.styles;
                }
                else if (attributeName===CLASS) {
                    // in case of CLASS attribute --> special treatment
                    extractClass = extractor.extractClass(value);
                    value = extractClass.attrClass;
                    if (value) {
                        attrs[CLASS] = value;
                    }
                    else {
                        delete attrs[CLASS];
                    }
                    instance.classNames = extractClass.classNames;
                }
                else if (attributeName===ID) {
                    instance.id && (delete nodeids[instance.id]);
                    instance.id = value;
                    nodeids[value] = instance.domNode;
                }
                instance.domNode._setAttribute(attributeName, value);
            }
            return instance;
        },

       /**
        * Redefines the attributes of both the vnode as well as its related dom-node. The new
        * definition replaces any previous attributes (without touching unmodified attributes).
        *
        * Syncs the new vnode's attributes with the dom.
        *
        * @method _setAttrs
        * @param newAttrs {Object|Array} the new attributes to be set
        * @private
        * @chainable
        * @since 0.0.1
        */
        _setAttrs: function(newAttrs) {
            // does sync the DOM
            var instance = this,
                attrsObj, attr, attrs, i, key, keys, len, value;
            if (instance.nodeType!==1) {
                return;
            }
            instance._noSync();
            attrs = instance.attrs;
            attrs.id && (delete nodeids[attrs.id]);

            if (Object.isObject(newAttrs)) {
                attrsObj = newAttrs;
            }
            else {
                attrsObj = {};
                len = newAttrs.length;
                for (i=0; i<len; i++) {
                    attr = newAttrs[i];
                    attrsObj[attr.name] = attr.value;
                }
            }

            // first _remove the attributes that are no longer needed.
            // quickest way for object iteration: http://jsperf.com/object-keys-iteration/20
            keys = Object.keys(attrs);
            len = keys.length;
            for (i = 0; i < len; i++) {
                key = keys[i];
                attrsObj[key] || instance._removeAttr(key);
            }

            // next: every attribute that differs: redefine
            keys = Object.keys(attrsObj);
            len = keys.length;
            for (i = 0; i < len; i++) {
                key = keys[i];
                value = attrsObj[key];
                (attrs[key]===value) || instance._setAttr(key, value);
            }

            return instance;
        },

       /**
        * Redefines the childNodes of both the vnode as well as its related dom-node. The new
        * definition replaces any previous nodes. (without touching unmodified nodes).
        *
        * Syncs the new vnode's childNodes with the dom.
        *
        * @method _setChildNodes
        * @param newVChildNodes {Array} array with vnodes which represent the new childNodes
        * @private
        * @chainable
        * @since 0.0.1
        */
        _setChildNodes: function(newVChildNodes) {
            // does sync the DOM
            var instance = this,
                vChildNodes = instance.vChildNodes || [],
                domNode = instance.domNode,
                forRemoval = [],
                i, oldChild, newChild, newLength, len, len2, childDomNode, nodeswitch, bkpAttrs, bkpChildNodes, needNormalize;

            instance._noSync();
            // first: reset ._vChildren --> by making it empty, its getter will refresh its list on a next call
            instance._vChildren = null;
            // if newVChildNodes is undefined, then we assume it to be empty --> an empty array
            newVChildNodes || (newVChildNodes=[]);
            // quickest way to loop through array is by using for loops: http://jsperf.com/array-foreach-vs-for-loop/5
            len = vChildNodes.length;
            newLength = newVChildNodes.length;
            for (i=0; i<len; i++) {
                oldChild = vChildNodes[i];
                childDomNode = oldChild.domNode;
                if (i < newLength) {
                    newChild = newVChildNodes[i];
/*jshint boss:true */
                    switch (nodeswitch=NODESWITCH[oldChild.nodeType][newChild.nodeType]) {
/*jshint boss:false */
                        case 1: // oldNodeType==Element, newNodeType==Element
                            if ((oldChild.tag!==newChild.tag) || ((oldChild.tag==='SCRIPT') && (oldChild.text!==newChild.text))) {
                                // new tag --> completely replace
                                bkpAttrs = newChild.attrs;
                                bkpChildNodes = newChild.vChildNodes;
                                oldChild.attrs.id && (delete nodeids[oldChild.attrs.id]);
                                newChild.attrs = {}; // reset to force defined by `_setAttrs`
                                newChild.vChildNodes = []; // reset , to force defined by `_setAttrs`
                                domNode._replaceChild(newChild.domNode, childDomNode);
                                newChild.vParent = instance;
                                newChild._setAttrs(bkpAttrs);
                                newChild._setChildNodes(bkpChildNodes);
                                newChild.id && (nodeids[newChild.id]=newChild.domNode);
                                oldChild._replaceAtParent(newChild);
                            }
                            else {
                                // same tag --> only update what is needed
                                oldChild.attrs = newChild.attrs;
                                oldChild._setAttrs(newChild.attrs);
                                // next: sync the vChildNodes:
                                oldChild._setChildNodes(newChild.vChildNodes);
                            }
                            break;
                        case 2: // oldNodeType==Element, newNodeType==TextNode
                                // case2 and case3 should be treated the same
                        case 3: // oldNodeType==Element, newNodeType==Comment
                            oldChild.attrs.id && (delete nodeids[oldChild.attrs.id]);
                            newChild.domNode.nodeValue = newChild.text;
                            domNode._replaceChild(newChild.domNode, childDomNode);
                            newChild.vParent = instance;
                            oldChild._replaceAtParent(newChild);
                            break;
                        case 4: // oldNodeType==TextNode, newNodeType==Element
                                // case4 and case7 should be treated the same
                        case 7: // oldNodeType==Comment, newNodeType==Element
                                newChild._setAttrs(newChild.attrs);

                                domNode._replaceChild(newChild.domNode, childDomNode);
                                newChild._setChildNodes(newChild.vChildNodes);

                                newChild.id && (nodeids[newChild.id]=newChild.domNode);

                                oldChild.isVoid = newChild.isVoid;
                                delete oldChild.text;
                            break;

                        case 5: // oldNodeType==TextNode, newNodeType==TextNode
                                // case5 and case9 should be treated the same
                        case 9: // oldNodeType==Comment, newNodeType==Comment
                            (oldChild.text===newChild.text) || (oldChild.domNode.nodeValue = oldChild.text = newChild.text);
                            newVChildNodes[i] = oldChild;
                            break;
                        case 6: // oldNodeType==TextNode, newNodeType==Comment
                                // case6 and case8 should be treated the same
                        case 8: // oldNodeType==Comment, newNodeType==TextNode
                            newChild.domNode.nodeValue = newChild.text;
                            domNode._replaceChild(newChild.domNode, childDomNode);
                            newChild.vParent = oldChild.vParent;
                    }
                    if ((nodeswitch===2) || (nodeswitch===5) || (nodeswitch===8)) {
                        needNormalize = true;
                    }
                }
                else {
                    // _remove previous definition
                    domNode._removeChild(oldChild.domNode);
                    // the oldChild needs to be removed, however, this canoot be done right now, for it would effect the loop
                    // so we store it inside a hash to remove it later
                    forRemoval[forRemoval.length] = oldChild;
                }
            }
            // now definitely remove marked childNodes:
            len2 = forRemoval.length;
            for (i=0; i<len2; i++) {
                forRemoval[i]._destroy();
            }
            // now we add all new vChildNodes that go beyond `len`:
            for (i = len; i < newLength; i++) {
                newChild = newVChildNodes[i];
                newChild.vParent = instance;
                switch (newChild.nodeType) {
                    case 1: // Element
                        bkpAttrs = newChild.attrs;
                        bkpChildNodes = newChild.vChildNodes;
                        newChild.attrs = {}; // reset, to force defined by `_setAttrs`
                        newChild.vChildNodes = []; // reset to current state, to force defined by `_setAttrs`
                        domNode._appendChild(newChild.domNode);
                        newChild._setAttrs(bkpAttrs);
                        newChild._setChildNodes(bkpChildNodes);
                        break;
                    case 3: // Element
                        needNormalize = true;
                        // we need to break through --> no `break`
                        /* falls through */
                    default: // TextNode or CommentNode
                        newChild.domNode.nodeValue = newChild.text;
                        domNode._appendChild(newChild.domNode);
                }
                newChild.storeId();
            }
            instance.vChildNodes = newVChildNodes;
            needNormalize && instance._normalize();
            return instance;
        }

    };


    //---- properties ------------------------------------------------------------------

    /**
     * A hash of all the `attributes` of the vnode's representing dom-node.
     *
     * @property attrs
     * @type Object
     * @since 0.0.1
     */

    /**
     * Hash with all the classes of the vnode. Every class represents a key, all values are set `true`.
     *
     * @property classNames
     * @type Object
     * @since 0.0.1
     */

    /**
     * The `id` of the vnode's representing dom-node (if any).
     *
     * @property id
     * @type String
     * @since 0.0.1
     */

    /**
     * Tells whether tag is a void Element. Examples are: `br`, `img` and `input`. Non-void Elements are f.e. `div` and `table`.
     * For TextNodes and CommentNodes, this property is `undefined`.
     *
     * @property isVoid
     * @type Boolean
     * @since 0.0.1
     */

    /**
     * The `nodeType` of the vnode's representing dom-node (1===ElementNode, 3===TextNode, 8===CommentNode).
     *
     * @property nodeType
     * @type Number
     * @since 0.0.1
     */

    /**
     * The `tag` of the vnode's representing dom-node (allways uppercase).
     *
     * @property tag
     * @type String
     * @since 0.0.1
     */

    /**
     * The `content` of the vnode's representing dom-node, in case it is a TextNode or CommentNode.
     * Equals dom-node.nodeValue.
     *
     * Is `undefined` for ElementNodes.
     *
     * @property text
     * @type String
     * @since 0.0.1
     */

    /**
     * Hash with all the childNodes (vnodes). vChildNodes are any kind of vnodes (nodeType===1, 3 or 8)
     *
     * @property vChildNodes
     * @type Array
     * @since 0.0.1
     */

    /**
     * The underlying `dom-node` that the vnode represents.
     *
     * @property domNode
     * @type domNode
     * @since 0.0.1
     */

    /**
     * vnode's parentNode (defined as a vnode itself).
     *
     * @property vParent
     * @type vnode
     * @since 0.0.1
     */

    Object.defineProperties(vNodeProto, {
        /**
         * Gets or sets the innerHTML of both the vnode as well as the representing dom-node.
         *
         * The setter syncs with the DOM.
         *
         * @property innerHTML
         * @type String
         * @since 0.0.1
         */
        innerHTML: {
            get: function() {
                var instance = this,
                    html, vChildNodes, len, i, vChildNode;
                if (instance.nodeType===1) {
                    html = '';
                    vChildNodes = instance.vChildNodes;
                    len = vChildNodes ? vChildNodes.length : 0;
                    for (i=0; i<len; i++) {
                        vChildNode = vChildNodes[i];
                        switch (vChildNode.nodeType) {
                            case 1:
                                html += vChildNode.outerHTML;
                                break;
                            case 3:
                                html += vChildNode.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                                break;
                            case 8:
                                html += '<!--' + vChildNode.text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '-->';
                        }
                    }
                }
                return html;
            },
            set: function(v) {
                this._setChildNodes(htmlToVNodes(v, vNodeProto));
            }
        },

        /**
         * Gets or sets the innerHTML of both the vnode as well as the representing dom-node.
         *
         * The setter syncs with the DOM.
         *
         * @property nodeValue
         * @type String
         * @since 0.0.1
         */
        nodeValue: {
            get: function() {
                var instance = this;
                return ((instance.nodeType===3) || (instance.nodeType===8)) ? instance.text : null;
            },
            set: function(v) {
                var instance = this;
                if ((instance.nodeType===3) || (instance.nodeType===8)) {
                    instance.domNode.textContent = v;
                    // set .text AFTER the dom-node is updated --> the content might be escaped!
                    instance.text = instance.domNode.textContent;
                }
            }
        },

        /**
         * Gets or sets the outerHTML of both the vnode as well as the representing dom-node.
         *
         * The setter syncs with the DOM.
         *
         * @property outerHTML
         * @type String
         * @since 0.0.1
         */
        outerHTML: {
            get: function() {
                var instance = this,
                    html,
                    attrs = instance.attrs;
                if (instance.nodeType===1) {
                    if (instance.nodeType!==1) {
                        return instance.textContent;
                    }
                    html = '<' + instance.tag.toLowerCase();
                    attrs.each(function(value, key) {
                        html += ' '+key+'="'+value+'"';
                    });
                    html += '>';
                    if (!instance.isVoid) {
                        html += instance.innerHTML + '</' + instance.tag.toLowerCase() + '>';
                    }
                }
                return html;
            },
            set: function(v) {
                var instance = this,
                    vParent = instance.vParent,
                    id = instance.attrs.id,
                    vnode, vnodes, bkpAttrs, bkpChildNodes, i, len, vChildNodes, isLastChildNode, index, refDomNode;
                if ((instance.nodeType!==1) || !vParent) {
                    return;
                }
                instance._noSync();
                vChildNodes = vParent.vChildNodes;
                index = vChildNodes.indexOf(instance);
                isLastChildNode = (index===(vChildNodes.length-1));
                isLastChildNode || (refDomNode=vChildNodes[index+1].domNode);
                vnodes = htmlToVNodes(v, vNodeProto, vParent);
                len = vnodes.length;
                if (len>0) {
                    // the first vnode will replace the current instance:
                    vnode = vnodes[0];
                    if (vnode.nodeType===1) {
                        if (vnode.tag!==instance.tag) {
                            // new tag --> completely replace
                            bkpAttrs = vnode.attrs;
                            bkpChildNodes = vnode.vChildNodes;
                            id && (delete nodeids[id]);
                            vnode.attrs = {}; // reset to force defined by `_setAttrs`
                            vnode.vChildNodes = []; // reset , to force defined by `_setAttrs`
                            vParent.domNode._replaceChild(vnode.domNode, instance.domNode);
                            vnode._setAttrs(bkpAttrs);
                            vnode._setChildNodes(bkpChildNodes);
                            // vnode.attrs = bkpAttrs;
                            // vnode.vChildNodes = bkpChildNodes;
                            vnode.id && (nodeids[vnode.id]=vnode.domNode);
                            instance._replaceAtParent(vnode);
                        }
                        else {
                            instance._setAttrs(vnode.attrs);
                            instance._setChildNodes(vnode.vChildNodes);
                        }
                    }
                    else {
                        id && (delete nodeids[id]);
                        vnode.domNode.nodeValue = vnode.text;
                        vParent.domNode._replaceChild(vnode.domNode, instance.domNode);
                        instance._replaceAtParent(vnode);
                    }
                }
                for (i=1; i<len; i++) {
                    vnode = vnodes[i];
                    switch (vnode.nodeType) {
                        case 1: // Element
                            bkpAttrs = vnode.attrs;
                            bkpChildNodes = vnode.vChildNodes;
                            vnode.attrs = {}; // reset, to force defined by `_setAttrs`
                            vnode.vChildNodes = []; // reset to current state, to force defined by `_setAttrs`
                            isLastChildNode ? vParent.domNode._appendChild(vnode.domNode) : vParent.domNode._insertBefore(vnode.domNode, refDomNode);
                            vnode._setAttrs(bkpAttrs);
                            vnode._setChildNodes(bkpChildNodes);
                            break;
                        default: // TextNode or CommentNode
                            vnode.domNode.nodeValue = vnode.text;
                            isLastChildNode ? vParent.domNode._appendChild(vnode.domNode) : vParent.domNode._appendChild(vnode.domNode, refDomNode);
                    }
                    vnode.storeId();
                    vnode._moveToParent(vParent, index+i);
                }
            }
        },

        /**
         * Gets or sets the innerContent of the Node as plain text.
         *
         * The setter syncs with the DOM.
         *
         * @property textContent
         * @type String
         * @since 0.0.1
         */
        textContent: {
            get: function() {
                var instance = this,
                    text = '',
                    vChildNodes = instance.vChildNodes,
                    len, i, vChildNode;
                if (instance.nodeType===1) {
                    vChildNodes = instance.vChildNodes;
                    len = vChildNodes ? vChildNodes.length : 0;
                    for (i=0; i<len; i++) {
                        vChildNode = vChildNodes[i];
                        text += (vChildNode.nodeType===3) ? vChildNode.text : ((vChildNode.nodeType===1) ? vChildNode.textContent : '');
                    }
                }
                else {
                    text = instance.text;
                }
                return text;
            },
            set: function(v) {
                var vnode = Object.create(vNodeProto);
                vnode.domNode = DOCUMENT.createTextNode(v);
                // create circular reference:
                vnode.domNode._vnode = vnode;
                vnode.nodeType = 3;
                vnode.text = vnode.domNode.textContent;
                this._setChildNodes([vnode]);
            }
        },

        /**
         * Hash with all the children (vnodes). vChildren are vnodes that have a representing dom-node that is an HtmlElement (nodeType===1)
         *
         * @property vChildren
         * @type Array
         * @since 0.0.1
         */
        vChildren: {
            get: function() {
                var instance = this,
                    children = instance._vChildren,
                    vChildNode, vChildNodes, i, len;
                vChildNodes = instance.vChildNodes;
                if (vChildNodes && !children) {
                    children = instance._vChildren = [];
                    len = vChildNodes.length;
                    for (i=0; i<len; i++) {
                        vChildNode = vChildNodes[i];
                        (vChildNode.nodeType===1) && (children[children.length]=vChildNode);
                    }
                }
                return children;
            }
        },

        /**
         * Reference to the first of sibbling vNode's, where the related dom-node is either an Element, TextNode or CommentNode (nodeType===1, 3 or 8).
         *
         * @property vFirst
         * @type vnode
         * @since 0.0.1
         */
        vFirst: {
            get: function() {
                var vParent = this.vParent;
                if (!vParent) {
                    return null;
                }
                return vParent.vFirstChild;
            }
        },

        /**
         * Reference to the first vChildNode, where the related dom-node is either an Element, TextNode or CommentNode (nodeType===1, 3 or 8).
         *
         * @property vFirstChild
         * @type vnode
         * @since 0.0.1
         */
        vFirstChild: {
            get: function() {
                return (this.vChildNodes && this.vChildNodes[0]) || null;
            }
        },

        /**
         * Reference to the first of sibbling vNode's, where the related dom-node is an Element(nodeType===1).
         *
         * @property vFirstElement
         * @type vnode
         * @since 0.0.1
         */
        vFirstElement: {
            get: function() {
                var vParent = this.vParent;
                if (!vParent) {
                    return null;
                }
                return vParent.vFirstElementChild;
            }
        },

        /**
         * Reference to the first vChild, where the related dom-node an Element (nodeType===1).
         *
         * @property vFirstElementChild
         * @type vnode
         * @since 0.0.1
         */
        vFirstElementChild: {
            get: function() {
                return this.vChildren[0] || null;
            }
        },

        /**
         * Reference to the last of sibbling vNode's, where the related dom-node is either an Element, TextNode or CommentNode (nodeType===1, 3 or 8).
         *
         * @property vLast
         * @type vnode
         * @since 0.0.1
         */
        vLast: {
            get: function() {
                var vParent = this.vParent;
                if (!vParent) {
                    return null;
                }
                return vParent.vLastChild;
            }
        },

        /**
         * Reference to the last vChildNode, where the related dom-node is either an Element, TextNode or CommentNode (nodeType===1, 3 or 8).
         *
         * @property vLastChild
         * @type vnode
         * @since 0.0.1
         */
        vLastChild: {
            get: function() {
                var vChildNodes = this.vChildNodes;
                return (vChildNodes && vChildNodes[vChildNodes.length-1]) || null;
            }
        },

        /**
         * Reference to the last of sibbling vNode's, where the related dom-node is an Element(nodeType===1).
         *
         * @property vLastElement
         * @type vnode
         * @since 0.0.1
         */
        vLastElement: {
            get: function() {
                var vParent = this.vParent;
                if (!vParent) {
                    return null;
                }
                return vParent.vLastElementChild;
            }
        },

        /**
         * Reference to the last vChild, where the related dom-node an Element (nodeType===1).
         *
         * @property vLastElementChild
         * @type vnode
         * @since 0.0.1
         */
        vLastElementChild: {
            get: function() {
                var vChildren = this.vChildren;
                return vChildren[vChildren.length-1] || null;
            }
        },

        /**
         * the Parent vnode
         *
         * @property vParent
         * @type vnode
         * @since 0.0.1
         */

        /**
         * Reference to the next of sibbling vNode's, where the related dom-node is either an Element, TextNode or CommentNode (nodeType===1, 3 or 8).
         *
         * @property vNext
         * @type vnode
         * @since 0.0.1
         */
        vNext: {
            get: function() {
                return _findNodeSibling(this, true);
            }
        },

        /**
         * Reference to the next of sibbling vNode's, where the related dom-node is an Element(nodeType===1).
         *
         * @property vNextElement
         * @type vnode
         * @since 0.0.1
         */
        vNextElement: {
            get: function() {
                return _findElementSibling(this, true);
            }
        },

        /**
         * Reference to the previous of sibbling vNode's, where the related dom-node is either an Element, TextNode or CommentNode (nodeType===1, 3 or 8).
         *
         * @property vPrevious
         * @type vnode
         * @since 0.0.1
         */
        vPrevious: {
            get: function() {
                return _findNodeSibling(this);
            }
        },

        /**
         * Reference to the previous of sibbling vNode's, where the related dom-node is an Element(nodeType===1).
         *
         * @property vPreviousElement
         * @type vnode
         * @since 0.0.1
         */
        vPreviousElement: {
            get: function() {
                return _findElementSibling(this);
            }
        }
    });

    return vNodeProto;

};
},{"./attribute-extractor.js":46,"./html-parser.js":51,"./vdom-ns.js":53,"js-ext/lib/array.js":30,"js-ext/lib/object.js":32,"js-ext/lib/string.js":34,"utils/lib/timers.js":44}],55:[function(require,module,exports){
"use strict";

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.VDOM) {
        return window._ITSAmodules.VDOM; // VDOM was already created
    }

    var DOCUMENT = window.document, vdom;

    if (DOCUMENT.doctype.name==='html') {
        require('./partials/extend-element.js')(window);
        require('./partials/extend-document.js')(window);
        // now parsing and virtualize the complete DOM:
        require('./partials/node-parser.js')(window)(DOCUMENT.documentElement);
        vdom = {
            Plugins: require('./partials/element-plugin.js')(window)
        };
        // if there is any Element with inline `transform` that is not compatible with the current browser:
        // we can revert it into the right `transform`, because the vdom knows the right transform-name:
        DOCUMENT.getAll('[style*="transform:"]').forEach(function(node) {
            var vnode = node.vnode,
                rightStyle = vnode.attrs.style;
            // delete current definition, so that reset will do an update:
            delete vnode.attrs.style;
            // now reset:
            vnode._setAttr('style', rightStyle);
        });
    }
    else {
        // if no HTML, then return an empty Plugin-object
        vdom = {Plugins: {}};
    }

    window._ITSAmodules.VDOM = vdom;

    return vdom;
};
},{"./partials/element-plugin.js":48,"./partials/extend-document.js":49,"./partials/extend-element.js":50,"./partials/node-parser.js":52}],56:[function(require,module,exports){
"use strict";

module.exports = function (window) {
    require('./lib/sizes.js')(window);
};
},{"./lib/sizes.js":57}],57:[function(require,module,exports){
"use strict";

module.exports = function (window) {

    if (!window._ITSAmodules) {
        Object.defineProperty(window, '_ITSAmodules', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} its members
        });
    }

    if (window._ITSAmodules.WindowSizes) {
        return; // WindowSizes was already created
    }

    window._ITSAmodules.WindowSizes = true;

    var getScrollOffsets = function() {
        var doc = window.document;
        // this works for all browsers in non quircks-mode and only for IE9+:
        if (window.pageXOffset!==undefined) { // do not "just" check for `window.pageXOffset` --> it could be `0`
            return {
                x: window.pageXOffset,
                y: window.pageYOffset
            };
        }
        // for IE (or any other browser) in standards mode
        if (doc.compatMode === 'CSS1Compat') {
            return {
                x: doc.documentElement.scrollLeft,
                y: doc.documentElement.scrollTop
            };
        }
        // for browsers in quircks mode:
        return {
            x: doc.body.scrollLeft,
            y: doc.body.scrollTop
        };
    },

    getViewportSize = function() {
        var doc = window.document;
        // this works for all browsers in non quircks-mode and only for IE9+:
        if (window.innerWidth!==undefined) { // do not "just" check for `window.innerWidth` --> it could be `0`
            return {
                w: window.innerWidth,
                h: window.innerHeight
            };
        }
        // for IE (or any other browser) in standards mode
        if (doc.compatMode === 'CSS1Compat') {
            return {
                w: doc.documentElement.clientWidth,
                h: doc.documentElement.clientHeight
            };
        }
        // for browsers in quircks mode:
        return {
            w: doc.body.clientWidth,
            h: doc.body.clientHeight
        };
    };

    /**
     * Gets the left-scroll offset of the window.
     *
     * @method getScrollLeft
     * @return {Number} left-offset in pixels
     * @since 0.0.1
    */
    window.getScrollLeft = function() {
        return getScrollOffsets().x;
    };
    /**
     * Gets the top-scroll offset of the window.
     *
     * @method getScrollTop
     * @return {Number} top-offset in pixels
     * @since 0.0.1
    */
    window.getScrollTop = function() {
        return getScrollOffsets().y;
    };
   /**
    * Gets the width of the window.
    *
    * @method getWidth
    * @return {Number} width in pixels
    * @since 0.0.1
    */
    window.getWidth = function() {
        return getViewportSize().w;
    };
   /**
    * Gets the height of the window.
    *
    * @method getHeight
    * @return {Number} width in pixels
    * @since 0.0.1
    */
    window.getHeight = function() {
        return getViewportSize().h;
    };

};
},{}],58:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],"itsa":[function(require,module,exports){
(function (global){
/**
 * The ITSA module is an aggregator for all the individual modules that the library uses.
 * The developer is free to use it as it is or tailor it to contain whatever modules
 * he/she might need in the global namespace.
 *
 * The modules themselves work quite well independent of this module and can be used
 * separately without the need of them being integrated under one globa namespace.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module itsa.build
 *
*/
(function (window) {

    "use strict";

    /**
     * The ITSA class provides the core functionality for the ITSA library
     * and is the root namespace for all the additional modules.
     *
     * The ITSA class cannot be instantiated.
     * Instead, the ITSA function takes a configuration object to allow for tailoring of the library.
     * The ITSA function returns itself to allow for further chaining.
     *
     * Calling the ITSA function is optional. If the default configuration is acceptable,
     * the ITSA class can be used directly.
     *
     * The ITSA name is usually used only once in an application, when configuring it
     * and when calling the [`ready`](#method_ready) or [`require`](#method_require) methods.
     * The callback to these two methods provide a reference to ITSA itself as their argument.
     * These methods allow the developer to rename ITSA to a shorter name, usually `P`,
     * for use within the local scope.
     *
     *  ITSA( config )
     *      .require('dialog', 'event', ...)
     *      .then(function (P) {
     *          // P is an alias of ITSA
     *      });
     *
     *  // If the default configuration is acceptable, you can simply do:
     *  ITSA.require('dialog', 'event', ...)
     *      .then(function (P) {
     *          // P is an alias of ITSA
     *      });
     *
     *  // If extra modules are to be loaded later, you can simply do:
     *  ITSA( config ).ready
     *      .then(function (P) {
     *          // P is an alias of ITSA
     *      });
     *
     *  // And if no configuration is needed:
     *  ITSA.ready
     *      .then(function (P) {
     *          // P is an alias of ITSA
     *      });
     *
     *
     *
     * @class ITSA
     * @static
     * @param config {Object} Configuration options for the ITSA Library
     * @return self {Object}
    */
    var ITSA = function (config) {
        ITSA._config.merge(config, true);
        return ITSA;
    };
    /**
     * Global configuration properties for the ITSA object.
     * It can only be set on initialization via the [`ITSA`](#docs-main) function.
     *
     * The config is set at a default-configutation
     *
     * @property _config
     * @type Object
     * @private
    */
    ITSA._config = {
        debug: true,
        base: '/components'
    };

    ITSA.Plugins = {

    };


    require('css');
    require('polyfill');
    require('js-ext');
    require('window-ext')(window);

    var fakedom = window.navigator.userAgent==='fake',
        Event = fakedom ? require('event') : require('event-mobile')(window),
        io_config = {
            // timeout: 3000,
            debug: true,
            base: '/build'
        },
        EVENT_NAME_TIMERS_EXECUTION = 'timers:asyncfunc',
        dragdrop;

    /**
     * Reference to the `idGenerator` function in [utils](../modules/utils.html)
     *
     * @property idGenerator
     * @type function
     * @static
    */

    ITSA.Plugins.merge(require('vdom')(window).Plugins);

    ITSA.merge(require('utils'));
    ITSA.RESERVED_WORDS = require('js-ext/extra/reserved-words.js');

    if (!fakedom) {
        require('event-dom/extra/hover.js')(window);
        require('event-dom/extra/valuechange.js')(window);
        // setup dragdrop:
        dragdrop = require('drag-drop')(window);
        ITSA.DD = dragdrop.DD;
        ITSA.Plugins.merge(dragdrop.Plugins);
        ITSA.Plugins.focusManager = require('focusmanager')(window);
    }

    /**
     * Reference to the [IO](io.html) object
     * @property IO
     * @type Object
     * @static
    */
    ITSA.IO = require('io/extra/io-transfer.js')(window);
    ITSA.IO.config.merge(io_config);
    require('io/extra/io-cors-ie9.js')(window);
    require('io/extra/io-stream.js')(window);
    require('io/extra/io-xml.js')(window);

    /**
     * Reference to the [UserAgent](useragent.html) object
     * @property UA
     * @type Object
     * @static
    */
    ITSA.UA = require('useragent')(window);

    /**
     * [Event](Event.html)-instance
     * @property Event
     * @type Event
     * @static
    */
    ITSA.Event = Event;

    // Now we setup `_afterAsyncFn` --> the `timers` module uses this:
    // whenever `async() or `later() is called, it will invoke `_afterAsyncFn` if it is defined
    // By define it in a way that an event is emitted, we make sure the vDOM will be re-rendered.
    // this event cannot be prevented, halted or preventRendered --> if the user wants to prevent
    // vDOM-rendering, the last argument of `async9)` or `later()` should be used.
    ITSA.Event.defineEvent(EVENT_NAME_TIMERS_EXECUTION)
              .unHaltable()
              .unPreventable()
              .unRenderPreventable()
              .unSilencable();
    ITSA._afterAsyncFn = function() {
        console.log('[ITSA]: ', ' emitting '+EVENT_NAME_TIMERS_EXECUTION+' through ITSA._afterAsyncFn()');
        // emittng a `dummy`-event which will re-render the dDOM:
        ITSA.Event.emit(EVENT_NAME_TIMERS_EXECUTION);
    };

    module.exports = ITSA;

})(global.window || require('node-win'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"css":9,"drag-drop":11,"event":21,"event-dom/extra/hover.js":15,"event-dom/extra/valuechange.js":16,"event-mobile":17,"focusmanager":22,"io/extra/io-cors-ie9.js":23,"io/extra/io-stream.js":24,"io/extra/io-transfer.js":25,"io/extra/io-xml.js":26,"js-ext":29,"js-ext/extra/reserved-words.js":28,"node-win":undefined,"polyfill":40,"useragent":41,"utils":42,"vdom":55,"window-ext":56}]},{},[]);
