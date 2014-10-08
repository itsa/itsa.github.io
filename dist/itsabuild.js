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
(function (process,global){
/*
Copyright 2013 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

/*jslint expr: true */
/*global define */

(function (global, factory) {
    var built = factory();
    /* istanbul ignore else */
    if (typeof module === 'object' && module) {
        module.exports = built;
    }
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(factory);
    }
    global.PromisePolyfill = built;
    global.Promise || (global.Promise = built);
}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this, function () {

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function assign(obj, props) {
        for (var prop in props) {
            /* istanbul ignore else */
            if (props.hasOwnProperty(prop)) {
                obj[prop] = props[prop];
            }
        }
    }

    /**
    A promise represents a value that may not yet be available. Promises allow
    you to chain asynchronous operations, write synchronous looking code and
    handle errors throughout the process.

    This constructor takes a function as a parameter where you can insert the logic
    that fulfills or rejects this promise. The fulfillment value and the rejection
    reason can be any JavaScript value. It's encouraged that rejection reasons be
    error objects

    <pre><code>
    var fulfilled = new Promise(function (resolve) {
        resolve('I am a fulfilled promise');
    });

    var rejected = new Promise(function (resolve, reject) {
        reject(new Error('I am a rejected promise'));
    });
    </code></pre>

    @class Promise
    @constructor
    @param {Function} fn A function where to insert the logic that resolves this
            promise. Receives `resolve` and `reject` functions as parameters.
            This function is called synchronously.
    **/
    function Promise(fn) {
        if (!(this instanceof Promise)) {
            Promise._log('Promises should always be created with new Promise(). This will throw an error in the future', 'error');
            return new Promise(fn);
        }

        var resolver = new Promise.Resolver(this);

        /**
        A reference to the resolver object that handles this promise

        @property _resolver
        @type Object
        @private
        */
        this._resolver = resolver;

        try {
            fn(function (value) {
                resolver.resolve(value);
            }, function (reason) {
                resolver.reject(reason);
            });
        } catch (e) {
            resolver.reject(e);
        }
    }

    assign(Promise.prototype, {
        /**
        Schedule execution of a callback to either or both of "fulfill" and
        "reject" resolutions for this promise. The callbacks are wrapped in a new
        promise and that promise is returned.  This allows operation chaining ala
        `functionA().then(functionB).then(functionC)` where `functionA` returns
        a promise, and `functionB` and `functionC` _may_ return promises.

        Asynchronicity of the callbacks is guaranteed.

        @method then
        @param {Function} [callback] function to execute if the promise
                    resolves successfully
        @param {Function} [errback] function to execute if the promise
                    resolves unsuccessfully
        @return {Promise} A promise wrapping the resolution of either "resolve" or
                    "reject" callback
        **/
        then: function (callback, errback) {
            // using this.constructor allows for customized promises to be
            // returned instead of plain ones
            var resolve, reject,
                promise = new this.constructor(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });

            this._resolver._addCallbacks(
                typeof callback === 'function' ?
                    Promise._makeCallback(promise, resolve, reject, callback) : resolve,
                typeof errback === 'function' ?
                    Promise._makeCallback(promise, resolve, reject, errback) : reject
            );

            return promise;
        },

        /*
        A shorthand for `promise.then(undefined, callback)`.

        Returns a new promise and the error callback gets the same treatment as in
        `then`: errors get caught and turned into rejections, and the return value
        of the callback becomes the fulfilled value of the returned promise.

        @method catch
        @param [Function] errback Callback to be called in case this promise is
                            rejected
        @return {Promise} A new promise modified by the behavior of the error
                            callback
        */
        'catch': function (errback) {
            return this.then(undefined, errback);
        }
    });

    /**
    Wraps the callback in another function to catch exceptions and turn them
    into rejections.

    @method _makeCallback
    @param {Promise} promise Promise that will be affected by this callback
    @param {Function} fn Callback to wrap
    @return {Function}
    @static
    @private
    **/
    Promise._makeCallback = function (promise, resolve, reject, fn) {
        // callbacks and errbacks only get one argument
        return function (valueOrReason) {
            var result;

            // Promises model exception handling through callbacks
            // making both synchronous and asynchronous errors behave
            // the same way
            try {
                // Use the argument coming in to the callback/errback from the
                // resolution of the parent promise.
                // The function must be called as a normal function, with no
                // special value for |this|, as per Promises A+
                result = fn(valueOrReason);
            } catch (e) {
                // calling return only to stop here
                reject(e);
                return;
            }

            if (result === promise) {
                reject(new TypeError('Cannot resolve a promise with itself'));
                return;
            }

            resolve(result);
        };
    };

    /**
    Logs a message. This method is designed to be overwritten with  YUI's `log`
    function.

    @method _log
    @param {String} msg Message to log
    @param {String} type Log level. One of 'error', 'warn', 'info'.
    @static
    @private
    **/
    Promise._log = function (msg, type) { /* istanbul ignore else */ if (typeof console !== 'undefined') { console[type](msg); } };

    /*
    Ensures that a certain value is a promise. If it is not a promise, it wraps it
    in one.

    This method can be copied or inherited in subclasses. In that case it will
    check that the value passed to it is an instance of the correct class.
    This means that `PromiseSubclass.resolve()` will always return instances of
    `PromiseSubclass`.

    @method resolve
    @param {Any} Any object that may or may not be a promise
    @return {Promise}
    @static
    */
    Promise.resolve = function (value) {
        if (value && value.constructor === this) {
            return value;
        }
        /*jshint newcap: false */
        return new this(function (resolve) {
        /*jshint newcap: true */
            resolve(value);
        });
    };

    /*
    A shorthand for creating a rejected promise.

    @method reject
    @param {Any} reason Reason for the rejection of this promise. Usually an Error
        Object
    @return {Promise} A rejected promise
    @static
    */
    Promise.reject = function (reason) {
        /*jshint newcap: false */
        var promise = new this(function () {});
       /*jshint newcap: true */

       // Do not go through resolver.reject() because an immediately rejected promise
       // always has no callbacks which would trigger an unnecessary warnihg
       promise._resolver._result = reason;
       promise._resolver._status = 'rejected';

       return promise;
    };

    /*
    Returns a promise that is resolved or rejected when all values are resolved or
    any is rejected. This is useful for waiting for the resolution of multiple
    promises, such as reading multiple files in Node.js or making multiple XHR
    requests in the browser.

    @method all
    @param {Any[]} values An array of any kind of values, promises or not. If a value is not
    @return [Promise] A promise for an array of all the fulfillment values
    @static
    */
    Promise.all = function (values) {
        var Promise = this;
        return new Promise(function (resolve, reject) {
            if (!isArray(values)) {
                reject(new TypeError('Promise.all expects an array of values or promises'));
                return;
            }

            var remaining = values.length,
                i         = 0,
                length    = values.length,
                results   = [];

            function oneDone(index) {
                return function (value) {
                    results[index] = value;

                    remaining--;

                    if (!remaining) {
                        resolve(results);
                    }
                };
            }

            if (length < 1) {
                return resolve(results);
            }

            for (; i < length; i++) {
                Promise.resolve(values[i]).then(oneDone(i), reject);
            }
        });
    };

    /*
    Returns a promise that is resolved or rejected when any of values is either
    resolved or rejected. Can be used for providing early feedback in the UI
    while other operations are still pending.

    @method race
    @param {Any[]} values An array of values or promises
    @return {Promise}
    @static
    */
    Promise.race = function (values) {
        var Promise = this;
        return new Promise(function (resolve, reject) {
            if (!isArray(values)) {
                reject(new TypeError('Promise.race expects an array of values or promises'));
                return;
            }
            
            // just go through the list and resolve and reject at the first change
            // This abuses the fact that calling resolve/reject multiple times
            // doesn't change the state of the returned promise
            for (var i = 0, count = values.length; i < count; i++) {
                Promise.resolve(values[i]).then(resolve, reject);
            }
        });
    };

    /**
    Forces a function to be run asynchronously, but as fast as possible. In Node.js
    this is achieved using `setImmediate` or `process.nextTick`. In YUI this is
    replaced with `Y.soon`.

    @method async
    @param {Function} callback The function to call asynchronously
    @static
    **/
    /* istanbul ignore next */
    Promise.async = typeof setImmediate !== 'undefined' ?
                        function (fn) {setImmediate(fn);} :
                    typeof process !== 'undefined' && process.nextTick ?
                        process.nextTick :
                    function (fn) {setTimeout(fn, 0);};

    /**
    Represents an asynchronous operation. Provides a
    standard API for subscribing to the moment that the operation completes either
    successfully (`fulfill()`) or unsuccessfully (`reject()`).

    @class Promise.Resolver
    @constructor
    @param {Promise} promise The promise instance this resolver will be handling
    **/
    function Resolver(promise) {
        /**
        List of success callbacks

        @property _callbacks
        @type Array
        @private
        **/
        this._callbacks = [];

        /**
        List of failure callbacks

        @property _errbacks
        @type Array
        @private
        **/
        this._errbacks = [];

        /**
        The promise for this Resolver.

        @property promise
        @type Promise
        @deprecated
        **/
        this.promise = promise;

        /**
        The status of the operation. This property may take only one of the following
        values: 'pending', 'fulfilled' or 'rejected'.

        @property _status
        @type String
        @default 'pending'
        @private
        **/
        this._status = 'pending';

        /**
        This value that this promise represents.

        @property _result
        @type Any
        @private
        **/
        this._result = null;
    }

    assign(Resolver.prototype, {
        /**
        Resolves the promise, signaling successful completion of the
        represented operation. All "onFulfilled" subscriptions are executed and passed
        the value provided to this method. After calling `fulfill()`, `reject()` and
        `notify()` are disabled.

        @method fulfill
        @param {Any} value Value to pass along to the "onFulfilled" subscribers
        **/
        fulfill: function (value) {
            var status = this._status;

            if (status === 'pending' || status === 'accepted') {
                this._result = value;
                this._status = 'fulfilled';
            }

            if (this._status === 'fulfilled') {
                this._notify(this._callbacks, this._result);

                // Reset the callback list so that future calls to fulfill()
                // won't call the same callbacks again. Promises keep a list
                // of callbacks, they're not the same as events. In practice,
                // calls to fulfill() after the first one should not be made by
                // the user but by then()
                this._callbacks = [];

                // Once a promise gets fulfilled it can't be rejected, so
                // there is no point in keeping the list. Remove it to help
                // garbage collection
                this._errbacks = null;
            }
        },

        /**
        Resolves the promise, signaling *un*successful completion of the
        represented operation. All "onRejected" subscriptions are executed with
        the value provided to this method. After calling `reject()`, `resolve()`
        and `notify()` are disabled.

        @method reject
        @param {Any} value Value to pass along to the "reject" subscribers
        **/
        reject: function (reason) {
            var status = this._status;

            if (status === 'pending' || status === 'accepted') {
                this._result = reason;
                this._status = 'rejected';
                if (!this._errbacks.length) {Promise._log('Promise rejected but no error handlers were registered to it', 'info');}
            }

            if (this._status === 'rejected') {
                this._notify(this._errbacks, this._result);

                // See fulfill()
                this._callbacks = null;
                this._errbacks = [];
            }
        },

        /*
        Given a certain value A passed as a parameter, this method resolves the
        promise to the value A.

        If A is a promise, `resolve` will cause the resolver to adopt the state of A
        and once A is resolved, it will resolve the resolver's promise as well.
        This behavior "flattens" A by calling `then` recursively and essentially
        disallows promises-for-promises.

        This is the default algorithm used when using the function passed as the
        first argument to the promise initialization function. This means that
        the following code returns a promise for the value 'hello world':

            var promise1 = new Promise(function (resolve) {
                resolve('hello world');
            });
            var promise2 = new Promise(function (resolve) {
                resolve(promise1);
            });
            promise2.then(function (value) {
                assert(value === 'hello world'); // true
            });

        @method resolve
        @param [Any] value A regular JS value or a promise
        */
        resolve: function (value) {
            if (this._status === 'pending') {
                this._status = 'accepted';
                this._value = value;

                if ((this._callbacks && this._callbacks.length) ||
                    (this._errbacks && this._errbacks.length)) {
                    this._unwrap(this._value);
                }
            }
        },

        /**
        If `value` is a promise or a thenable, it will be unwrapped by
        recursively calling its `then` method. If not, the resolver will be
        fulfilled with `value`.

        This method is called when the promise's `then` method is called and
        not in `resolve` to allow for lazy promises to be accepted and not
        resolved immediately.

        @method _unwrap
        @param {Any} value A promise, thenable or regular value
        @private
        **/
        _unwrap: function (value) {
            var self = this, unwrapped = false, then;

            if (!value || (typeof value !== 'object' &&
                typeof value !== 'function')) {
                self.fulfill(value);
                return;
            }

            try {
                then = value.then;

                if (typeof then === 'function') {
                    then.call(value, function (value) {
                        if (!unwrapped) {
                            unwrapped = true;
                            self._unwrap(value);
                        }
                    }, function (reason) {
                        if (!unwrapped) {
                            unwrapped = true;
                            self.reject(reason);
                        }
                    });
                } else {
                    self.fulfill(value);
                }
            } catch (e) {
                if (!unwrapped) {
                    self.reject(e);
                }
            }
        },

        /**
        Schedule execution of a callback to either or both of "resolve" and
        "reject" resolutions of this resolver. If the resolver is not pending,
        the correct callback gets called automatically.

        @method _addCallbacks
        @param {Function} [callback] function to execute if the Resolver
                    resolves successfully
        @param {Function} [errback] function to execute if the Resolver
                    resolves unsuccessfully
        **/
        _addCallbacks: function (callback, errback) {
            var callbackList = this._callbacks,
                errbackList  = this._errbacks;

            // Because the callback and errback are represented by a Resolver, it
            // must be fulfilled or rejected to propagate through the then() chain.
            // The same logic applies to resolve() and reject() for fulfillment.
            if (callbackList) {
                callbackList.push(callback);
            }
            if (errbackList) {
                errbackList.push(errback);
            }

            switch (this._status) {
                case 'accepted':
                    this._unwrap(this._value);
                    break;
                case 'fulfilled':
                    this.fulfill(this._result);
                    break;
                case 'rejected':
                    this.reject(this._result);
                    break;
            }
        },

        /**
        Executes an array of callbacks from a specified context, passing a set of
        arguments.

        @method _notify
        @param {Function[]} subs The array of subscriber callbacks
        @param {Any} result Value to pass the callbacks
        @protected
        **/
        _notify: function (subs, result) {
            // Since callback lists are reset synchronously, the subs list never
            // changes after _notify() receives it. Avoid calling Y.soon() for
            // an empty list
            if (subs.length) {
                // Calling all callbacks after Promise.async to guarantee
                // asynchronicity. Because setTimeout can cause unnecessary
                // delays that *can* become noticeable in some situations
                // (especially in Node.js)
                Promise.async(function () {
                    var i, len;

                    for (i = 0, len = subs.length; i < len; ++i) {
                        subs[i](result);
                    }
                });
            }
        }

    });

    Promise.Resolver = Resolver;

    return Promise;

}));


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":57}],7:[function(require,module,exports){
var css = "a:focus {\n    outline: 0;\n}\n\na[target=\"_blank\"]:focus {\n    outline: 1px solid #129fea;\n}\n\n/* because we think the padding and margin should always be part of the size,\n   we define \"box-sizing: border-box\" for all elements */\n\n* {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}"; (require("/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify"))(css); module.exports = css;
},{"/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify":1}],8:[function(require,module,exports){
var css = "/*!\nPure v0.5.0\nCopyright 2014 Yahoo! Inc. All rights reserved.\nLicensed under the BSD License.\nhttps://github.com/yahoo/pure/blob/master/LICENSE.md\n*/\n/*!\nnormalize.css v^3.0 | MIT License | git.io/normalize\nCopyright (c) Nicolas Gallagher and Jonathan Neal\n*/\n/*! normalize.css v3.0.2 | MIT License | git.io/normalize */\n\n/**\n * 1. Set default font family to sans-serif.\n * 2. Prevent iOS text size adjust after orientation change, without disabling\n *    user zoom.\n */\n\nhtml {\n  font-family: sans-serif; /* 1 */\n  -ms-text-size-adjust: 100%; /* 2 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/**\n * Remove default margin.\n */\n\nbody {\n  margin: 0;\n}\n\n/* HTML5 display definitions\n   ========================================================================== */\n\n/**\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\n * and Firefox.\n * Correct `block` display not defined for `main` in IE 11.\n */\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block;\n}\n\n/**\n * 1. Correct `inline-block` display not defined in IE 8/9.\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\n */\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block; /* 1 */\n  vertical-align: baseline; /* 2 */\n}\n\n/**\n * Prevent modern browsers from displaying `audio` without controls.\n * Remove excess height in iOS 5 devices.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Address `[hidden]` styling not present in IE 8/9/10.\n * Hide the `template` element in IE 8/9/11, Safari, and Firefox < 22.\n */\n\n[hidden],\ntemplate {\n  display: none;\n}\n\n/* Links\n   ========================================================================== */\n\n/**\n * Remove the gray background color from active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * Improve readability when focused and also mouse hovered in all browsers.\n */\n\na:active,\na:hover {\n  outline: 0;\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\n */\n\nabbr[title] {\n  border-bottom: 1px dotted;\n}\n\n/**\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\n */\n\nb,\nstrong {\n  font-weight: bold;\n}\n\n/**\n * Address styling not present in Safari and Chrome.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Address variable `h1` font-size and margin within `section` and `article`\n * contexts in Firefox 4+, Safari, and Chrome.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/**\n * Address styling not present in IE 8/9.\n */\n\nmark {\n  background: #ff0;\n  color: #000;\n}\n\n/**\n * Address inconsistent and variable font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsup {\n  top: -0.5em;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove border when inside `a` element in IE 8/9/10.\n */\n\nimg {\n  border: 0;\n}\n\n/**\n * Correct overflow not hidden in IE 9/10/11.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * Address margin not present in IE 8/9 and Safari.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * Address differences between Firefox and other browsers.\n */\n\nhr {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n  height: 0;\n}\n\n/**\n * Contain overflow in all browsers.\n */\n\npre {\n  overflow: auto;\n}\n\n/**\n * Address odd `em`-unit font size rendering in all browsers.\n */\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\n * styling of `select`, unless a `border` property is set.\n */\n\n/**\n * 1. Correct color not being inherited.\n *    Known issue: affects color of disabled elements.\n * 2. Correct font properties not being inherited.\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit; /* 1 */\n  font: inherit; /* 2 */\n  margin: 0; /* 3 */\n}\n\n/**\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\n */\n\nbutton {\n  overflow: visible;\n}\n\n/**\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\n * All other form control elements do not inherit `text-transform` values.\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\n * Correct `select` style inheritance in Firefox.\n */\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/**\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\n *    and `video` controls.\n * 2. Correct inability to style clickable `input` types in iOS.\n * 3. Improve usability and consistency of cursor style between image-type\n *    `input` and others.\n */\n\nbutton,\nhtml input[type=\"button\"], /* 1 */\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n  cursor: pointer; /* 3 */\n}\n\n/**\n * Re-set default cursor for disabled elements.\n */\n\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\n\n/**\n * Remove inner padding and border in Firefox 4+.\n */\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0;\n}\n\n/**\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\n * the UA stylesheet.\n */\n\ninput {\n  line-height: normal;\n}\n\n/**\n * It's recommended that you don't attempt to style these elements.\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\n *\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\n * 2. Remove excess padding in IE 8/9/10.\n */\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\n * `font-size` values of the `input`, it causes the cursor style of the\n * decrement button to change from `default` to `text`.\n */\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome\n *    (include `-moz` to future-proof).\n */\n\ninput[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  -moz-box-sizing: content-box;\n  -webkit-box-sizing: content-box; /* 2 */\n  box-sizing: content-box;\n}\n\n/**\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\n * Safari (but not Chrome) clips the cancel button when the search input has\n * padding (and `textfield` appearance).\n */\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * Define consistent border, margin, and padding.\n */\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\n\n/**\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\n */\n\nlegend {\n  border: 0; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Remove default vertical scrollbar in IE 8/9/10/11.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * Don't inherit the `font-weight` (applied by a rule above).\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\n */\n\noptgroup {\n  font-weight: bold;\n}\n\n/* Tables\n   ========================================================================== */\n\n/**\n * Remove most spacing between table cells.\n */\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\ntd,\nth {\n  padding: 0;\n}\n\n/*csslint important:false*/\n\n/* ==========================================================================\n   Pure Base Extras\n   ========================================================================== */\n\n/**\n * Extra rules that Pure adds on top of Normalize.css\n */\n\n/**\n * Always hide an element when it has the `hidden` HTML attribute.\n */\n\n[hidden] {\n    display: none !important;\n}\n\n/**\n * Add this class to an image to make it fit within it's fluid parent wrapper while maintaining\n * aspect ratio.\n */\n.pure-img {\n    max-width: 100%;\n    height: auto;\n    display: block;\n}\n\n/*csslint regex-selectors:false, known-properties:false, duplicate-properties:false*/\n\n.pure-g {\n    letter-spacing: -0.31em; /* Webkit: collapse white-space between units */\n    *letter-spacing: normal; /* reset IE < 8 */\n    *word-spacing: -0.43em; /* IE < 8: collapse white-space between units */\n    text-rendering: optimizespeed; /* Webkit: fixes text-rendering: optimizeLegibility */\n\n    /*\n    Sets the font stack to fonts known to work properly with the above letter\n    and word spacings. See: https://github.com/yahoo/pure/issues/41/\n\n    The following font stack makes Pure Grids work on all known environments.\n\n    * FreeSans: Ships with many Linux distros, including Ubuntu\n\n    * Arimo: Ships with Chrome OS. Arimo has to be defined before Helvetica and\n      Arial to get picked up by the browser, even though neither is available\n      in Chrome OS.\n\n    * Droid Sans: Ships with all versions of Android.\n\n    * Helvetica, Arial, sans-serif: Common font stack on OS X and Windows.\n    */\n    font-family: FreeSans, Arimo, \"Droid Sans\", Helvetica, Arial, sans-serif;\n\n    /*\n    Use flexbox when possible to avoid `letter-spacing` side-effects.\n\n    NOTE: Firefox (as of 25) does not currently support flex-wrap, so the\n    `-moz-` prefix version is omitted.\n    */\n\n    display: -webkit-flex;\n    -webkit-flex-flow: row wrap;\n\n    /* IE10 uses display: flexbox */\n    display: -ms-flexbox;\n    -ms-flex-flow: row wrap;\n}\n\n/* Opera as of 12 on Windows needs word-spacing.\n   The \".opera-only\" selector is used to prevent actual prefocus styling\n   and is not required in markup.\n*/\n.opera-only :-o-prefocus,\n.pure-g {\n    word-spacing: -0.43em;\n}\n\n.pure-u {\n    display: inline-block;\n    *display: inline; /* IE < 8: fake inline-block */\n    zoom: 1;\n    letter-spacing: normal;\n    word-spacing: normal;\n    vertical-align: top;\n    text-rendering: auto;\n}\n\n/*\nResets the font family back to the OS/browser's default sans-serif font,\nthis the same font stack that Normalize.css sets for the `body`.\n*/\n.pure-g [class *= \"pure-u\"] {\n    font-family: sans-serif;\n}\n\n.pure-u-1,\n.pure-u-1-1,\n.pure-u-1-2,\n.pure-u-1-3,\n.pure-u-2-3,\n.pure-u-1-4,\n.pure-u-3-4,\n.pure-u-1-5,\n.pure-u-2-5,\n.pure-u-3-5,\n.pure-u-4-5,\n.pure-u-5-5,\n.pure-u-1-6,\n.pure-u-5-6,\n.pure-u-1-8,\n.pure-u-3-8,\n.pure-u-5-8,\n.pure-u-7-8,\n.pure-u-1-12,\n.pure-u-5-12,\n.pure-u-7-12,\n.pure-u-11-12,\n.pure-u-1-24,\n.pure-u-2-24,\n.pure-u-3-24,\n.pure-u-4-24,\n.pure-u-5-24,\n.pure-u-6-24,\n.pure-u-7-24,\n.pure-u-8-24,\n.pure-u-9-24,\n.pure-u-10-24,\n.pure-u-11-24,\n.pure-u-12-24,\n.pure-u-13-24,\n.pure-u-14-24,\n.pure-u-15-24,\n.pure-u-16-24,\n.pure-u-17-24,\n.pure-u-18-24,\n.pure-u-19-24,\n.pure-u-20-24,\n.pure-u-21-24,\n.pure-u-22-24,\n.pure-u-23-24,\n.pure-u-24-24 {\n    display: inline-block;\n    *display: inline;\n    zoom: 1;\n    letter-spacing: normal;\n    word-spacing: normal;\n    vertical-align: top;\n    text-rendering: auto;\n}\n\n.pure-u-1-24 {\n    width: 4.1667%;\n    *width: 4.1357%;\n}\n\n.pure-u-1-12,\n.pure-u-2-24 {\n    width: 8.3333%;\n    *width: 8.3023%;\n}\n\n.pure-u-1-8,\n.pure-u-3-24 {\n    width: 12.5000%;\n    *width: 12.4690%;\n}\n\n.pure-u-1-6,\n.pure-u-4-24 {\n    width: 16.6667%;\n    *width: 16.6357%;\n}\n\n.pure-u-1-5 {\n    width: 20%;\n    *width: 19.9690%;\n}\n\n.pure-u-5-24 {\n    width: 20.8333%;\n    *width: 20.8023%;\n}\n\n.pure-u-1-4,\n.pure-u-6-24 {\n    width: 25%;\n    *width: 24.9690%;\n}\n\n.pure-u-7-24 {\n    width: 29.1667%;\n    *width: 29.1357%;\n}\n\n.pure-u-1-3,\n.pure-u-8-24 {\n    width: 33.3333%;\n    *width: 33.3023%;\n}\n\n.pure-u-3-8,\n.pure-u-9-24 {\n    width: 37.5000%;\n    *width: 37.4690%;\n}\n\n.pure-u-2-5 {\n    width: 40%;\n    *width: 39.9690%;\n}\n\n.pure-u-5-12,\n.pure-u-10-24 {\n    width: 41.6667%;\n    *width: 41.6357%;\n}\n\n.pure-u-11-24 {\n    width: 45.8333%;\n    *width: 45.8023%;\n}\n\n.pure-u-1-2,\n.pure-u-12-24 {\n    width: 50%;\n    *width: 49.9690%;\n}\n\n.pure-u-13-24 {\n    width: 54.1667%;\n    *width: 54.1357%;\n}\n\n.pure-u-7-12,\n.pure-u-14-24 {\n    width: 58.3333%;\n    *width: 58.3023%;\n}\n\n.pure-u-3-5 {\n    width: 60%;\n    *width: 59.9690%;\n}\n\n.pure-u-5-8,\n.pure-u-15-24 {\n    width: 62.5000%;\n    *width: 62.4690%;\n}\n\n.pure-u-2-3,\n.pure-u-16-24 {\n    width: 66.6667%;\n    *width: 66.6357%;\n}\n\n.pure-u-17-24 {\n    width: 70.8333%;\n    *width: 70.8023%;\n}\n\n.pure-u-3-4,\n.pure-u-18-24 {\n    width: 75%;\n    *width: 74.9690%;\n}\n\n.pure-u-19-24 {\n    width: 79.1667%;\n    *width: 79.1357%;\n}\n\n.pure-u-4-5 {\n    width: 80%;\n    *width: 79.9690%;\n}\n\n.pure-u-5-6,\n.pure-u-20-24 {\n    width: 83.3333%;\n    *width: 83.3023%;\n}\n\n.pure-u-7-8,\n.pure-u-21-24 {\n    width: 87.5000%;\n    *width: 87.4690%;\n}\n\n.pure-u-11-12,\n.pure-u-22-24 {\n    width: 91.6667%;\n    *width: 91.6357%;\n}\n\n.pure-u-23-24 {\n    width: 95.8333%;\n    *width: 95.8023%;\n}\n\n.pure-u-1,\n.pure-u-1-1,\n.pure-u-5-5,\n.pure-u-24-24 {\n    width: 100%;\n}\n.pure-button {\n    /* Structure */\n    display: inline-block;\n    *display: inline; /*IE 6/7*/\n    zoom: 1;\n    line-height: normal;\n    white-space: nowrap;\n    vertical-align: baseline;\n    text-align: center;\n    cursor: pointer;\n    -webkit-user-drag: none;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n\n/* Firefox: Get rid of the inner focus border */\n.pure-button::-moz-focus-inner {\n    padding: 0;\n    border: 0;\n}\n\n/*csslint outline-none:false*/\n\n.pure-button {\n    font-family: inherit;\n    font-size: 100%;\n    *font-size: 90%; /*IE 6/7 - To reduce IE's oversized button text*/\n    *overflow: visible; /*IE 6/7 - Because of IE's overly large left/right padding on buttons */\n    padding: 0.5em 1em;\n    color: #444; /* rgba not supported (IE 8) */\n    color: rgba(0, 0, 0, 0.80); /* rgba supported */\n    *color: #444; /* IE 6 & 7 */\n    border: 1px solid #999;  /*IE 6/7/8*/\n    border: none rgba(0, 0, 0, 0);  /*IE9 + everything else*/\n    background-color: #E6E6E6;\n    text-decoration: none;\n    border-radius: 2px;\n}\n\n.pure-button-hover,\n.pure-button:hover,\n.pure-button:focus {\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#1a000000',GradientType=0);\n    background-image: -webkit-gradient(linear, 0 0, 0 100%, from(transparent), color-stop(40%, rgba(0,0,0, 0.05)), to(rgba(0,0,0, 0.10)));\n    background-image: -webkit-linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10));\n    background-image: -moz-linear-gradient(top, rgba(0,0,0, 0.05) 0%, rgba(0,0,0, 0.10));\n    background-image: -o-linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10));\n    background-image: linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10));\n}\n.pure-button:focus {\n    outline: 0;\n}\n.pure-button-active,\n.pure-button:active {\n    box-shadow: 0 0 0 1px rgba(0,0,0, 0.15) inset, 0 0 6px rgba(0,0,0, 0.20) inset;\n}\n\n.pure-button[disabled],\n.pure-button-disabled,\n.pure-button-disabled:hover,\n.pure-button-disabled:focus,\n.pure-button-disabled:active {\n    border: none;\n    background-image: none;\n    filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\n    filter: alpha(opacity=40);\n    -khtml-opacity: 0.40;\n    -moz-opacity: 0.40;\n    opacity: 0.40;\n    cursor: not-allowed;\n    box-shadow: none;\n}\n\n.pure-button-hidden {\n    display: none;\n}\n\n/* Firefox: Get rid of the inner focus border */\n.pure-button::-moz-focus-inner{\n    padding: 0;\n    border: 0;\n}\n\n.pure-button-primary,\n.pure-button-selected,\na.pure-button-primary,\na.pure-button-selected {\n    background-color: rgb(0, 120, 231);\n    color: #fff;\n}\n\n.pure-form input[type=\"text\"],\n.pure-form input[type=\"password\"],\n.pure-form input[type=\"email\"],\n.pure-form input[type=\"url\"],\n.pure-form input[type=\"date\"],\n.pure-form input[type=\"month\"],\n.pure-form input[type=\"time\"],\n.pure-form input[type=\"datetime\"],\n.pure-form input[type=\"datetime-local\"],\n.pure-form input[type=\"week\"],\n.pure-form input[type=\"number\"],\n.pure-form input[type=\"search\"],\n.pure-form input[type=\"tel\"],\n.pure-form input[type=\"color\"],\n.pure-form select,\n.pure-form textarea {\n    padding: 0.5em 0.6em;\n    display: inline-block;\n    border: 1px solid #ccc;\n    box-shadow: inset 0 1px 3px #ddd;\n    border-radius: 4px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}\n\n/*\nNeed to separate out the :not() selector from the rest of the CSS 2.1 selectors\nsince IE8 won't execute CSS that contains a CSS3 selector.\n*/\n.pure-form input:not([type]) {\n    padding: 0.5em 0.6em;\n    display: inline-block;\n    border: 1px solid #ccc;\n    box-shadow: inset 0 1px 3px #ddd;\n    border-radius: 4px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}\n\n\n/* Chrome (as of v.32/34 on OS X) needs additional room for color to display. */\n/* May be able to remove this tweak as color inputs become more standardized across browsers. */\n.pure-form input[type=\"color\"] {\n    padding: 0.2em 0.5em;\n}\n\n\n.pure-form input[type=\"text\"]:focus,\n.pure-form input[type=\"password\"]:focus,\n.pure-form input[type=\"email\"]:focus,\n.pure-form input[type=\"url\"]:focus,\n.pure-form input[type=\"date\"]:focus,\n.pure-form input[type=\"month\"]:focus,\n.pure-form input[type=\"time\"]:focus,\n.pure-form input[type=\"datetime\"]:focus,\n.pure-form input[type=\"datetime-local\"]:focus,\n.pure-form input[type=\"week\"]:focus,\n.pure-form input[type=\"number\"]:focus,\n.pure-form input[type=\"search\"]:focus,\n.pure-form input[type=\"tel\"]:focus,\n.pure-form input[type=\"color\"]:focus,\n.pure-form select:focus,\n.pure-form textarea:focus {\n    outline: 0;\n    outline: thin dotted \\9; /* IE6-9 */\n    border-color: #129FEA;\n}\n\n/*\nNeed to separate out the :not() selector from the rest of the CSS 2.1 selectors\nsince IE8 won't execute CSS that contains a CSS3 selector.\n*/\n.pure-form input:not([type]):focus {\n    outline: 0;\n    outline: thin dotted \\9; /* IE6-9 */\n    border-color: #129FEA;\n}\n\n.pure-form input[type=\"file\"]:focus,\n.pure-form input[type=\"radio\"]:focus,\n.pure-form input[type=\"checkbox\"]:focus {\n    outline: thin dotted #333;\n    outline: 1px auto #129FEA;\n}\n.pure-form .pure-checkbox,\n.pure-form .pure-radio {\n    margin: 0.5em 0;\n    display: block;\n}\n\n.pure-form input[type=\"text\"][disabled],\n.pure-form input[type=\"password\"][disabled],\n.pure-form input[type=\"email\"][disabled],\n.pure-form input[type=\"url\"][disabled],\n.pure-form input[type=\"date\"][disabled],\n.pure-form input[type=\"month\"][disabled],\n.pure-form input[type=\"time\"][disabled],\n.pure-form input[type=\"datetime\"][disabled],\n.pure-form input[type=\"datetime-local\"][disabled],\n.pure-form input[type=\"week\"][disabled],\n.pure-form input[type=\"number\"][disabled],\n.pure-form input[type=\"search\"][disabled],\n.pure-form input[type=\"tel\"][disabled],\n.pure-form input[type=\"color\"][disabled],\n.pure-form select[disabled],\n.pure-form textarea[disabled] {\n    cursor: not-allowed;\n    background-color: #eaeded;\n    color: #cad2d3;\n}\n\n/*\nNeed to separate out the :not() selector from the rest of the CSS 2.1 selectors\nsince IE8 won't execute CSS that contains a CSS3 selector.\n*/\n.pure-form input:not([type])[disabled] {\n    cursor: not-allowed;\n    background-color: #eaeded;\n    color: #cad2d3;\n}\n.pure-form input[readonly],\n.pure-form select[readonly],\n.pure-form textarea[readonly] {\n    background: #eee; /* menu hover bg color */\n    color: #777; /* menu text color */\n    border-color: #ccc;\n}\n\n.pure-form input:focus:invalid,\n.pure-form textarea:focus:invalid,\n.pure-form select:focus:invalid {\n    color: #b94a48;\n    border-color: #ee5f5b;\n}\n.pure-form input:focus:invalid:focus,\n.pure-form textarea:focus:invalid:focus,\n.pure-form select:focus:invalid:focus {\n    border-color: #e9322d;\n}\n.pure-form input[type=\"file\"]:focus:invalid:focus,\n.pure-form input[type=\"radio\"]:focus:invalid:focus,\n.pure-form input[type=\"checkbox\"]:focus:invalid:focus {\n    outline-color: #e9322d;\n}\n.pure-form select {\n    border: 1px solid #ccc;\n    background-color: white;\n}\n.pure-form select[multiple] {\n    height: auto;\n}\n.pure-form label {\n    margin: 0.5em 0 0.2em;\n}\n.pure-form fieldset {\n    margin: 0;\n    padding: 0.35em 0 0.75em;\n    border: 0;\n}\n.pure-form legend {\n    display: block;\n    width: 100%;\n    padding: 0.3em 0;\n    margin-bottom: 0.3em;\n    color: #333;\n    border-bottom: 1px solid #e5e5e5;\n}\n\n.pure-form-stacked input[type=\"text\"],\n.pure-form-stacked input[type=\"password\"],\n.pure-form-stacked input[type=\"email\"],\n.pure-form-stacked input[type=\"url\"],\n.pure-form-stacked input[type=\"date\"],\n.pure-form-stacked input[type=\"month\"],\n.pure-form-stacked input[type=\"time\"],\n.pure-form-stacked input[type=\"datetime\"],\n.pure-form-stacked input[type=\"datetime-local\"],\n.pure-form-stacked input[type=\"week\"],\n.pure-form-stacked input[type=\"number\"],\n.pure-form-stacked input[type=\"search\"],\n.pure-form-stacked input[type=\"tel\"],\n.pure-form-stacked input[type=\"color\"],\n.pure-form-stacked select,\n.pure-form-stacked label,\n.pure-form-stacked textarea {\n    display: block;\n    margin: 0.25em 0;\n}\n\n/*\nNeed to separate out the :not() selector from the rest of the CSS 2.1 selectors\nsince IE8 won't execute CSS that contains a CSS3 selector.\n*/\n.pure-form-stacked input:not([type]) {\n    display: block;\n    margin: 0.25em 0;\n}\n.pure-form-aligned input,\n.pure-form-aligned textarea,\n.pure-form-aligned select,\n/* NOTE: pure-help-inline is deprecated. Use .pure-form-message-inline instead. */\n.pure-form-aligned .pure-help-inline,\n.pure-form-message-inline {\n    display: inline-block;\n    *display: inline;\n    *zoom: 1;\n    vertical-align: middle;\n}\n.pure-form-aligned textarea {\n    vertical-align: top;\n}\n\n/* Aligned Forms */\n.pure-form-aligned .pure-control-group {\n    margin-bottom: 0.5em;\n}\n.pure-form-aligned .pure-control-group label {\n    text-align: right;\n    display: inline-block;\n    vertical-align: middle;\n    width: 10em;\n    margin: 0 1em 0 0;\n}\n.pure-form-aligned .pure-controls {\n    margin: 1.5em 0 0 10em;\n}\n\n/* Rounded Inputs */\n.pure-form input.pure-input-rounded,\n.pure-form .pure-input-rounded {\n    border-radius: 2em;\n    padding: 0.5em 1em;\n}\n\n/* Grouped Inputs */\n.pure-form .pure-group fieldset {\n    margin-bottom: 10px;\n}\n.pure-form .pure-group input {\n    display: block;\n    padding: 10px;\n    margin: 0;\n    border-radius: 0;\n    position: relative;\n    top: -1px;\n}\n.pure-form .pure-group input:focus {\n    z-index: 2;\n}\n.pure-form .pure-group input:first-child {\n    top: 1px;\n    border-radius: 4px 4px 0 0;\n}\n.pure-form .pure-group input:last-child {\n    top: -2px;\n    border-radius: 0 0 4px 4px;\n}\n.pure-form .pure-group button {\n    margin: 0.35em 0;\n}\n\n.pure-form .pure-input-1 {\n    width: 100%;\n}\n.pure-form .pure-input-2-3 {\n    width: 66%;\n}\n.pure-form .pure-input-1-2 {\n    width: 50%;\n}\n.pure-form .pure-input-1-3 {\n    width: 33%;\n}\n.pure-form .pure-input-1-4 {\n    width: 25%;\n}\n\n/* Inline help for forms */\n/* NOTE: pure-help-inline is deprecated. Use .pure-form-message-inline instead. */\n.pure-form .pure-help-inline,\n.pure-form-message-inline {\n    display: inline-block;\n    padding-left: 0.3em;\n    color: #666;\n    vertical-align: middle;\n    font-size: 0.875em;\n}\n\n/* Block help for forms */\n.pure-form-message {\n    display: block;\n    color: #666;\n    font-size: 0.875em;\n}\n\n@media only screen and (max-width : 480px) {\n    .pure-form button[type=\"submit\"] {\n        margin: 0.7em 0 0;\n    }\n\n    .pure-form input:not([type]),\n    .pure-form input[type=\"text\"],\n    .pure-form input[type=\"password\"],\n    .pure-form input[type=\"email\"],\n    .pure-form input[type=\"url\"],\n    .pure-form input[type=\"date\"],\n    .pure-form input[type=\"month\"],\n    .pure-form input[type=\"time\"],\n    .pure-form input[type=\"datetime\"],\n    .pure-form input[type=\"datetime-local\"],\n    .pure-form input[type=\"week\"],\n    .pure-form input[type=\"number\"],\n    .pure-form input[type=\"search\"],\n    .pure-form input[type=\"tel\"],\n    .pure-form input[type=\"color\"],\n    .pure-form label {\n        margin-bottom: 0.3em;\n        display: block;\n    }\n\n    .pure-group input:not([type]),\n    .pure-group input[type=\"text\"],\n    .pure-group input[type=\"password\"],\n    .pure-group input[type=\"email\"],\n    .pure-group input[type=\"url\"],\n    .pure-group input[type=\"date\"],\n    .pure-group input[type=\"month\"],\n    .pure-group input[type=\"time\"],\n    .pure-group input[type=\"datetime\"],\n    .pure-group input[type=\"datetime-local\"],\n    .pure-group input[type=\"week\"],\n    .pure-group input[type=\"number\"],\n    .pure-group input[type=\"search\"],\n    .pure-group input[type=\"tel\"],\n    .pure-group input[type=\"color\"] {\n        margin-bottom: 0;\n    }\n\n    .pure-form-aligned .pure-control-group label {\n        margin-bottom: 0.3em;\n        text-align: left;\n        display: block;\n        width: 100%;\n    }\n\n    .pure-form-aligned .pure-controls {\n        margin: 1.5em 0 0 0;\n    }\n\n    /* NOTE: pure-help-inline is deprecated. Use .pure-form-message-inline instead. */\n    .pure-form .pure-help-inline,\n    .pure-form-message-inline,\n    .pure-form-message {\n        display: block;\n        font-size: 0.75em;\n        /* Increased bottom padding to make it group with its related input element. */\n        padding: 0.2em 0 0.8em;\n    }\n}\n\n/*csslint adjoining-classes:false, outline-none:false*/\n/*TODO: Remove this lint rule override after a refactor of this code.*/\n\n.pure-menu ul {\n    position: absolute;\n    visibility: hidden;\n}\n\n.pure-menu.pure-menu-open {\n    visibility: visible;\n    z-index: 2;\n    width: 100%;\n}\n\n.pure-menu ul {\n    left: -10000px;\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    top: -10000px;\n    z-index: 1;\n}\n\n.pure-menu > ul { position: relative; }\n\n.pure-menu-open > ul {\n    left: 0;\n    top: 0;\n    visibility: visible;\n}\n\n.pure-menu-open > ul:focus {\n    outline: 0;\n}\n\n.pure-menu li { position: relative; }\n\n.pure-menu a,\n.pure-menu .pure-menu-heading {\n    display: block;\n    color: inherit;\n    line-height: 1.5em;\n    padding: 5px 20px;\n    text-decoration: none;\n    white-space: nowrap;\n}\n\n.pure-menu.pure-menu-horizontal > .pure-menu-heading {\n    display: inline-block;\n    *display: inline;\n    zoom: 1;\n    margin: 0;\n    vertical-align: middle;\n}\n.pure-menu.pure-menu-horizontal > ul {\n    display: inline-block;\n    *display: inline;\n    zoom: 1;\n    vertical-align: middle;\n}\n\n.pure-menu li a { padding: 5px 20px; }\n\n.pure-menu-can-have-children > .pure-menu-label:after {\n    content: '\\25B8';\n    float: right;\n    /* These specific fonts have the Unicode char we need. */\n    font-family: 'Lucida Grande', 'Lucida Sans Unicode', 'DejaVu Sans', sans-serif;\n    margin-right: -20px;\n    margin-top: -1px;\n}\n\n.pure-menu-can-have-children > .pure-menu-label {\n    padding-right: 30px;\n}\n\n.pure-menu-separator {\n    background-color: #dfdfdf;\n    display: block;\n    height: 1px;\n    font-size: 0;\n    margin: 7px 2px;\n    overflow: hidden;\n}\n\n.pure-menu-hidden {\n    display: none;\n}\n\n/* FIXED MENU */\n.pure-menu-fixed {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n}\n\n\n/* HORIZONTAL MENU CODE */\n\n/* Initial menus should be inline-block so that they are horizontal */\n.pure-menu-horizontal li {\n    display: inline-block;\n    *display: inline;\n    zoom: 1;\n    vertical-align: middle;\n}\n\n/* Submenus should still be display: block; */\n.pure-menu-horizontal li li {\n    display: block;\n}\n\n/* Content after should be down arrow */\n.pure-menu-horizontal > .pure-menu-children > .pure-menu-can-have-children > .pure-menu-label:after {\n    content: \"\\25BE\";\n}\n/*Add extra padding to elements that have the arrow so that the hover looks nice */\n.pure-menu-horizontal > .pure-menu-children > .pure-menu-can-have-children > .pure-menu-label {\n    padding-right: 30px;\n}\n\n/* Adjusting separator for vertical menus */\n.pure-menu-horizontal li.pure-menu-separator {\n    height: 50%;\n    width: 1px;\n    margin: 0 7px;\n}\n\n/* Submenus should be horizontal separator again */\n.pure-menu-horizontal li li.pure-menu-separator {\n    height: 1px;\n    width: auto;\n    margin: 7px 2px;\n}\n\n\n/*csslint adjoining-classes:false*/\n/*TODO: Remove this lint rule override after a refactor of this code.*/\n\n/* MAIN MENU STYLING */\n\n.pure-menu.pure-menu-open,\n.pure-menu.pure-menu-horizontal li .pure-menu-children {\n    background: #fff; /* Old browsers */\n    border: 1px solid #b7b7b7;\n}\n\n/* remove borders for horizontal menus */\n.pure-menu.pure-menu-horizontal,\n.pure-menu.pure-menu-horizontal .pure-menu-heading {\n    border: none;\n}\n\n\n/* LINK STYLES */\n\n.pure-menu a {\n    border: 1px solid transparent;\n    border-left: none;\n    border-right: none;\n\n}\n\n.pure-menu a,\n.pure-menu .pure-menu-can-have-children > li:after {\n    color: #777;\n}\n\n.pure-menu .pure-menu-can-have-children > li:hover:after {\n    color: #fff;\n}\n\n/* Focus style for a dropdown menu-item when the parent has been opened */\n.pure-menu .pure-menu-open {\n    background: #dedede;\n}\n\n\n.pure-menu li a:hover,\n.pure-menu li a:focus {\n    background: #eee;\n}\n\n/* DISABLED STATES */\n.pure-menu li.pure-menu-disabled a:hover,\n.pure-menu li.pure-menu-disabled a:focus {\n    background: #fff;\n    color: #bfbfbf;\n}\n\n.pure-menu .pure-menu-disabled > a {\n    background-image: none;\n    border-color: transparent;\n    cursor: default;\n}\n\n.pure-menu .pure-menu-disabled > a,\n.pure-menu .pure-menu-can-have-children.pure-menu-disabled > a:after {\n    color: #bfbfbf;\n}\n\n/* HEADINGS */\n.pure-menu .pure-menu-heading {\n    color: #565d64;\n    text-transform: uppercase;\n    font-size: 90%;\n    margin-top: 0.5em;\n    border-bottom-width: 1px;\n    border-bottom-style: solid;\n    border-bottom-color: #dfdfdf;\n}\n\n/* ACTIVE MENU ITEM */\n.pure-menu .pure-menu-selected a {\n    color: #000;\n}\n\n/* FIXED MENU */\n.pure-menu.pure-menu-open.pure-menu-fixed {\n    border: none;\n    border-bottom: 1px solid #b7b7b7;\n}\n\n/*csslint box-model:false*/\n/*TODO: Remove this lint rule override after a refactor of this code.*/\n\n\n.pure-paginator {\n\n    /* `pure-g` Grid styles */\n    letter-spacing: -0.31em; /* Webkit: collapse white-space between units */\n    *letter-spacing: normal; /* reset IE < 8 */\n    *word-spacing: -0.43em; /* IE < 8: collapse white-space between units */\n    text-rendering: optimizespeed; /* Webkit: fixes text-rendering: optimizeLegibility */\n\n    /* `pure-paginator` Specific styles */\n    list-style: none;\n    margin: 0;\n    padding: 0;\n}\n.opera-only :-o-prefocus,\n.pure-paginator {\n    word-spacing: -0.43em;\n}\n\n/* `pure-u` Grid styles */\n.pure-paginator li {\n    display: inline-block;\n    *display: inline; /* IE < 8: fake inline-block */\n    zoom: 1;\n    letter-spacing: normal;\n    word-spacing: normal;\n    vertical-align: top;\n    text-rendering: auto;\n}\n\n\n.pure-paginator .pure-button {\n    border-radius: 0;\n    padding: 0.8em 1.4em;\n    vertical-align: top;\n    height: 1.1em;\n}\n.pure-paginator .pure-button:focus,\n.pure-paginator .pure-button:active {\n    outline-style: none;\n}\n.pure-paginator .prev,\n.pure-paginator .next {\n    color: #C0C1C3;\n    text-shadow: 0 -1px 0 rgba(0,0,0, 0.45);\n}\n.pure-paginator .prev {\n    border-radius: 2px 0 0 2px;\n}\n.pure-paginator .next {\n    border-radius: 0 2px 2px 0;\n}\n\n@media (max-width: 480px) {\n    .pure-menu-horizontal {\n        width: 100%;\n    }\n\n    .pure-menu-children li {\n        display: block;\n        border-bottom: 1px solid black;\n    }\n}\n\n.pure-table {\n    /* Remove spacing between table cells (from Normalize.css) */\n    border-collapse: collapse;\n    border-spacing: 0;\n    empty-cells: show;\n    border: 1px solid #cbcbcb;\n}\n\n.pure-table caption {\n    color: #000;\n    font: italic 85%/1 arial, sans-serif;\n    padding: 1em 0;\n    text-align: center;\n}\n\n.pure-table td,\n.pure-table th {\n    border-left: 1px solid #cbcbcb;/*  inner column border */\n    border-width: 0 0 0 1px;\n    font-size: inherit;\n    margin: 0;\n    overflow: visible; /*to make ths where the title is really long work*/\n    padding: 0.5em 1em; /* cell padding */\n}\n.pure-table td:first-child,\n.pure-table th:first-child {\n    border-left-width: 0;\n}\n\n.pure-table thead {\n    background: #e0e0e0;\n    color: #000;\n    text-align: left;\n    vertical-align: bottom;\n}\n\n/*\nstriping:\n   even - #fff (white)\n   odd  - #f2f2f2 (light gray)\n*/\n.pure-table td {\n    background-color: transparent;\n}\n.pure-table-odd td {\n    background-color: #f2f2f2;\n}\n\n/* nth-child selector for modern browsers */\n.pure-table-striped tr:nth-child(2n-1) td {\n    background-color: #f2f2f2;\n}\n\n/* BORDERED TABLES */\n.pure-table-bordered td {\n    border-bottom: 1px solid #cbcbcb;\n}\n.pure-table-bordered tbody > tr:last-child > td {\n    border-bottom-width: 0;\n}\n\n\n/* HORIZONTAL BORDERED TABLES */\n\n.pure-table-horizontal td,\n.pure-table-horizontal th {\n    border-width: 0 0 1px 0;\n    border-bottom: 1px solid #cbcbcb;\n}\n.pure-table-horizontal tbody > tr:last-child > td {\n    border-bottom-width: 0;\n}\n"; (require("/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify"))(css); module.exports = css;
},{"/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify":1}],9:[function(require,module,exports){
require('./css/default.css');
require('./css/purecss-0.5.0.css');
},{"./css/default.css":7,"./css/purecss-0.5.0.css":8}],10:[function(require,module,exports){
var css = ".el-notrans {\n    -webkit-transition: none !important;\n    -moz-transition: none !important;\n    -ms-transition: none !important;\n    -o-transition: top 0s ease-out, left 0s ease-out !important; /* opera doesn't support none */\n    transition: none !important;\n}\n\n.el-invisible {\n    visibility: hidden !important;\n}\n\n.el-block {\n    display: block !important;\n}\n\n.el-borderbox {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}"; (require("/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify"))(css); module.exports = css;
},{"/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify":1}],11:[function(require,module,exports){
"use strict";

module.exports = function (window) {
    require('./lib/nodelist.js')(window);
    require('./lib/document.js')(window);
    require('./lib/element.js')(window);
};
},{"./lib/document.js":12,"./lib/element.js":13,"./lib/nodelist.js":14}],12:[function(require,module,exports){
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
 * require('dom-ext/lib/document.js')(window);
 *
 * @module dom-ext
 * @submodule lib/document.js
 * @class document
 * @since 0.0.1
*/

module.exports = function (window) {
    require('polyfill/lib/array.some.js');
    require('polyfill/lib/array.isarray.js');
    require('./nodelist.js')(window);
    require('polyfill/lib/element.matchesselector.js')(window);

    var HTML_CHARS = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;'
    },
    DOCUMENT = window.document,
    SINGLE_NODE_ID_REGEXP = /^#\S+$/,

    /**
    @method html
    @param {String} string String to escape.
    @return {String} Escaped string.
    @static
    **/
    escapeHTML = function (content) {
        (content.serialize) && (content=content.serialize());
        return content.replace(/[&<>"'\/`]/g, function (match) {return HTML_CHARS[match];});
    },

    toCamelCase = function(input) {
        return input.toLowerCase().replace(/-(.)/g, function(match, group) {
            return group.toUpperCase();
        });
    },

   /*
    * Creates a fragment out of a String, so that it can be inserted as a NodeList.
    *
    * @method _createFragment
    * @param content {String} content to be fragmented
    * @return {DocumentFragment}
    * @since 0.0.1
    */
    _createFragment = function(content) {
        var fragment = DOCUMENT.createDocumentFragment(),
            cont = DOCUMENT.createElement('div'),
            first;
        cont.innerHTML = content;
/*jshint boss:true */
        while (first=cont.firstChild) {
            fragment.appendChild(first);
        }
/*jshint boss:false */
        return fragment;
    },

   /**
    * Inserts a HtmlElement or text at the specified position.
    *
    * @method _insert
    * @param htmlElement {HtmlElement} the HtmlElement where the action should be applied to
    * @param method {String} method to be used (either `insertBefore` or `appendChild`)
    * @param content {HtmlElement|HtmlElementList|String} content to append
    * @param refElement {HtmlElement} reference-element in case of `insertBefore`
    * @param escape {Boolean} whether to insert `escaped` content, leading it into only text inserted
    * @return {HtmlElement} the original HtmlElement so it can be chained
    * @since 0.0.1
    */
    _insert = function(htmlElement, method, content, refElement, escape) {
        var first;
        // cannot check if isArray: NodeList and HTMLCollection are extended with `forEach()` but they are no arrays
        if (content.forEach) {
            // carefull: in case of NodeList or HTMLCollection we cannot use "forEach" because the Elements will be
            // removes from the previous hash, making `forEach` to creates gaps
            if (escape || Array.isArray(content)) {
                content.forEach(
                    function(element) {
                        escape && (element=escapeHTML(element));
                        (typeof element === 'string') && (element=_createFragment(element));
                        htmlElement[method](element, refElement);
                    }
                );
            }
            else {
/*jshint boss:true */
                while (first=content[0]) {
                    htmlElement[method](escape ? escapeHTML(first) : first, refElement);
                }
/*jshint boss:false */
            }
        }
        else {
            escape && (content=escapeHTML(content));
            (typeof content === 'string') && (content=_createFragment(content));
            htmlElement[method](content, refElement);

        }
        return htmlElement;
    };

    DOCUMENT._insert = function() {
        return _insert.apply(null, arguments);
    };

   /**
    * Returns the first of the HtmlElement's siblings, or the first that matches `cssSelector`.
    *
    * @method first
    * @param [cssSelector] {String} css-selector to be used as a filter
    * @return {HtmlElement|null}
    * @since 0.0.1
    */
    DOCUMENT.first = function(cssSelector) {
        var parent = this.parentHtmlElement || window.document, // not `this` because the context might change
            found;
        if (!cssSelector) {
            return parent.firstElementChild;
        }
        Array.prototype.some.call(parent.children, function(element) {
            element.matchesSelector(cssSelector) && (found=element);
            return found;
        });
        return found;
    };

   /**
    * Gets a NodeList of HtmlElements, specified by the css-selector.
    *
    * @method getAll
    * @param cssSelector {String} css-selector to match
    * @return {NodeList} NodeList of HtmlElements that match the css-selector
    * @since 0.0.1
    */
    DOCUMENT.getAll = function(cssSelector) {
        try {
            return this.querySelectorAll(cssSelector); // throws an error or falsy selector
        }
        catch (err) {
            return [];
        }
    };

   /**
    * Gets one HtmlElement, specified by the css-selector. To retrieve a single element by id,
    * you need to prepend the id-name with a `#`. When multiple HtmlElement's match, the first is returned.
    *
    * @method getElement
    * @param cssSelector {String} css-selector to match
    * @return {HtmlElement|null} the HtmlElement that was search for
    * @since 0.0.1
    */
    DOCUMENT.getElement = function(cssSelector) {
        return SINGLE_NODE_ID_REGEXP.test(cssSelector) ? this.getElementById(cssSelector.substr(1)) : this.getAll(cssSelector)[0];
    };

   /**
    * Gets the HtmlElement that currently has the focus.
    * alias for `activeElement`
    *
    * @method getFocussed
    * @return {HtmlElement|null} the HtmlElement that has focus
    * @since 0.0.1
    */
    DOCUMENT.getFocussed = function() {
        return this.activeElement;
    };

   /**
    * Returns the last of the HtmlElement's siblings, or the last that matches `cssSelector`.
    *
    * @method last
    * @param [cssSelector] {String} css-selector to be used as a filter
    * @return {HtmlElement|null}
    * @since 0.0.1
    */
    DOCUMENT.last = function(cssSelector) {
        var parent = this.parentHtmlElement || window.document, // not `this` because the context might change
            found, i;
        if (!cssSelector) {
            return parent.lastElementChild;
        }
        for (i=parent.children-1; !found && (i>0); i--) {
            parent.children[i].matchesSelector(cssSelector) && (found=parent.children[i]);
        }
        return found;
    };

   /**
    * Replaces the HtmlElement with a new HtmlElement.
    *
    * @method replace
    * @param newHtmlElement {HtmlElement|String} the new HtmlElement
    * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
    * @chainable
    * @since 0.0.1
    */
    DOCUMENT.replace = function(oldHtmlElement, newHtmlElement, escape) {
        var instance = this,
            parentNode = instance.parentNode;
        (typeof newHtmlElement === 'string') && (newHtmlElement=_createFragment(newHtmlElement));
        parentNode.replaceChild(escape ? escapeHTML(newHtmlElement) : newHtmlElement, instance);
        return escape ? parentNode : newHtmlElement;
    };

   /**
    * Tests if the HtmlElement would be selected by the specified cssSelector.
    * Alias for `matchesSelector()`
    *
    * @method test
    * @param cssSelector {String} the css-selector to test against
    * @return {Boolean} whether or not the node matches the selector
    * @since 0.0.1
    */
    DOCUMENT.test = function(cssSelector) {
        return this.matchesSelector(cssSelector);
    };

};
},{"./nodelist.js":14,"polyfill/lib/array.isarray.js":40,"polyfill/lib/array.some.js":41,"polyfill/lib/element.matchesselector.js":43}],13:[function(require,module,exports){
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
 * require('dom-ext/lib/element.js')(window);
 *
 * @module dom-ext
 * @submodule lib/element.js
 * @class Element
 * @since 0.0.1
*/

module.exports = function (window) {

    var POSITION = 'position',
        BLOCK = 'el-block',
        BORDERBOX = 'el-borderbox',
        NO_TRANS = 'el-notrans',
        INVISIBLE = 'el-invisible',
        CONSTRAIN_ATTR = 'xy-constrain',
        RESERVED_WORDS = require('js-ext/extra/reserved-words.js'),
        REGEXP_NODE_ID = /^#\S+$/,

        toCamelCase = function(input) {
            return input.toLowerCase().replace(/-(.)/g, function(match, group) {
                return group.toUpperCase();
            });
        };

    window.Element && (function(ElementPrototype) {

        require('../css/element.css');
        require('js-ext/lib/string.js');
        require('js-ext/lib/object.js');
        require('./document.js')(window);
        require('polyfill/lib/element.matchesselector.js')(window);
        require('window-ext')(window);

        var documentElement = window.document.documentElement;

       /**
        * Appends a HtmlElement or text at the end of HtmlElement's innerHTML, or before the `refElement`.
        *
        * @method append
        * @param content {HtmlElement|HtmlElementList|String} content to append
        * @param [refElement] {HtmlElement|HtmlElementList|String} reference Element where the content should be appended
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.append = function(content, refElement, escape) {
            refElement && (this.children.indexOf(refElement)!==-1) && (refElement=refElement.next());
            return window.document._insert(this, refElement ? 'insertBefore' : 'appendChild', content, refElement, escape);
        };

       /**
        * Returns a duplicate of the node. Use cloneNode(true) for a `deep` clone.
        * Almost the same as native cloneNode(), but you should use clone(), because it also clones any data set with setData().
        *
        * @method clone
        * @param content {HtmlElement|HtmlElementList|String} content to append. In case of HTML, it will be escaped.
        * @param [deep] {Boolean} whether to perform a `deep` clone: with all descendants
        * @return {HtmlElement} a clone of this HtmlElement
        * @since 0.0.1
        */
        ElementPrototype.clone = function(deep) {
            var instance = this,
                cloned = instance.cloneNode(deep);
            if (instance._data.size()>0) {
                Object.defineProperty(cloned, '_data', {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: {} // `writable` is false means we cannot chance the value-reference, but we can change {}'s properties itself
                });
                cloned._data.merge(instance._data);
            }
            return cloned;
        };

       /**
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
        ElementPrototype.defineInlineStyle = function(value) {
            this.style.cssText = value;
            return this;
        };

       /**
        * Returns the first of the HtmlElement's siblings, or the first that matches `cssSelector`.
        *
        * @method first
        * @param [cssSelector] {String} css-selector to be used as a filter
        * @return {HtmlElement|null}
        * @since 0.0.1
        */
        ElementPrototype.first = function(cssSelector) {
            return window.document.first.apply(this, arguments);
        };

       /**
        * Gets a NodeList of HtmlElements, specified by the css-selector.
        *
        * @method getAll
        * @param cssSelector {String} css-selector to match
        * @return {NodeList} NodeList of HtmlElements that match the css-selector
        * @since 0.0.1
        */
        ElementPrototype.getAll = function(cssSelector) {
            return window.document.getAll.apply(this, arguments);
        };

       /**
        * Gets an attribute of the HtmlElement.
        * Cautious: do not use `value` to retrieve the value. Use `getValue()` instead.
        *
        * Alias for getAttribute().
        *
        * @method getAttr
        * @param attributeName {String}
        * @return {String|null} value of the attribute
        * @since 0.0.1
        */
        ElementPrototype.getAttr = function(attributeName) {
            return this.getAttribute.apply(this, arguments);
        };

       /**
        * Gets the HtmlElement's class as a whole String.
        *
        * Alias for this.className
        *
        * @method getClass
        * @return {String} The complete class of the HtmlElement as a String
        * @since 0.0.1
        */
        ElementPrototype.getClass = function() {
            return this.className;
        };

       /**
        * Returns data set specified by `key`. If not set, `undefined` will be returned.
        *
        * @method getData
        * @param key {string} name of the key
        * @return {Any|undefined} data set specified by `key`
        * @since 0.0.1
        */
        ElementPrototype.getData = function(key) {
            return this._data && this._data[key];
        };

       /**
        * Gets one HtmlElement, specified by the css-selector. To retrieve a single element by id,
        * you need to prepend the id-name with a `#`. When multiple HtmlElement's match, the first is returned.
        *
        * @method getElement
        * @param cssSelector {String} css-selector to match
        * @return {HtmlElement|null} the HtmlElement that was search for
        * @since 0.0.1
        */
        ElementPrototype.getElement = function(cssSelector) {
            return window.document.getElement.apply(this, arguments);
        };

       /**
        * Gets the height of the element in pixels. Included are padding and border, not any margins.
        *
        * @method getHeight
        * @param [overflow=false] {Boolean} in case of elements that overflow: return total height, included the invisible overflow
        * @return {Number} width in pixels
        * @since 0.0.1
        */
        ElementPrototype.getHeight = function(overflow) {
            return overflow ? this.scrollHeight : this.offsetHeight;
        };

       /**
        * Returns the innerContent of the HtmlElement as a string with HTML entities.
        *
        * Alias for innerHTML
        *
        * @method getHtml
        * @return {String} content as a string with HTML entities
        * @since 0.0.1
        */
        ElementPrototype.getHtml = function() {
            return this.innerHTML;
        };

       /**
        * Gets the HtmlElement's id.
        *
        * Alias for this.id
        *
        * @method getId
        * @return {String} The id of the HtmlElement (=== '') when undefined
        * @since 0.0.1
        */
        ElementPrototype.getId = function() {
            return this.id;
        };

       /**
        * Returns inline style of the specified property. `Inline` means: what is set directly on the HtmlElement,
        * this doesn't mean necesairy how it is looked like: when no css is set inline, the HtmlElement might still have
        * an appearance because of other CSS-rules.
        *
        * In most cases, you would be interesting in using `getStyle()` instead.
        *
        * Note: no need to camelCase cssProperty: both `margin-left` as well as `marginLeft` are fine
        *
        * @method getInlineStyle
        * @return {String} content as a string with HTML entities
        * @since 0.0.1
        */
        ElementPrototype.getInlineStyle = function(cssProperty) {
            return this.style[toCamelCase(cssProperty)];
        };

        /**
         * Gets the left-scroll offset of the content of the HtmlElement.
         * Only apropriate when the HtmlElement has overflow.
         *
         * @method getScrollLeft
         * @return {Number} left-offset in pixels
         * @since 0.0.1
        */
        ElementPrototype.getScrollLeft = function() {
            return this.scrollLeft;
        };

        /**
         * Gets the top-scroll offset of the content of the HtmlElement.
         * Only apropriate when the HtmlElement has overflow.
         *
         * @method getScrollTop
         * @return {Number} top-offset in pixels
         * @since 0.0.1
        */
        ElementPrototype.getScrollTop = function() {
            return this.scrollTop;
        };

       /**
        * Returns cascaded style of the specified property. `Cascaded` means: the actual present style,
        * the way it is visible (calculated through the DOM-tree).
        *
        * Note1: values are absolute: percentages and points are converted to absolute values, sizes are in pixels, colors in rgb/rgba-format.
        * Note2: you cannot query shotcut-properties: use `margin-left` instead of `margin`.
        * Note3: no need to camelCase cssProperty: both `margin-left` as well as `marginLeft` are fine.
        *
        * @method getCascadeStyle
        * @param cssProperty {String} property that is queried
        * @param [pseudo] {String} to query pseudo-element, fe: `:before` or `:first-line`
        * @return {String} value for the css-property
        * @since 0.0.1
        */
        ElementPrototype.getStyle = function(cssProperty, pseudo) {
            return window.getComputedStyle(this, pseudo)[toCamelCase(cssProperty)];
        };

       /**
        * Gets the HtmlElement's tagname. Always uppercased.
        *
        * Alias for this.nodeName
        *
        * @method getTag
        * @return {String} The tag-name of the HtmlElement in uppercase
        * @since 0.0.1
        */
        ElementPrototype.getTag = function() {
            return this.nodeName;
        };

       /**
        * Gets the text content of the HtmlElement and its descendants.
        * If you need full HTML, you should use getHTML().
        *
        * Alias for textContent
        *
        * @method getText
        * @return {String} content of the HtmlElement as text
        * @since 0.0.1
        */
        ElementPrototype.getText = function() {
            var instance = this;
            if (window.documentElement.textContent) {
                return instance.textContent;
            }
            // now we are in IE8-, but it might not return the same as textContent
            // (see https://developer.mozilla.org/en-US/docs/Web/API/Node.textContent)
            // We accept this for it will be an edgecase we might never run into
            // and we prefer to keep the code lightweight
            return instance.innerText;
        };

       /**
        * Gets the width of the element in pixels. Included are padding and border, not any margins.
        *
        * @method getWidth
        * @param [overflow=false] {Boolean} in case of elements that overflow: return total width, included the invisible overflow
        * @return {Number} width in pixels
        * @since 0.0.1
        */
        ElementPrototype.getWidth = function(overflow) {
            return overflow ? this.scrollWidth : this.offsetWidth;
        };

       /**
        * Gets the value of the following HtmlElements:
        *
        * <ul>
        *     <li>input</li>
        *     <li>textarea</li>
        *     <li>select</li>
        *     <li>any container that is `contenteditable`</li>
        *
        * @method getValue
        * @return {String|null} value of the attribute
        * @since 0.0.1
        */
        ElementPrototype.getValue = function() {
            // cautious: input and textarea must be accessed by their propertyname:
            // input.getAttribute('value') would return the defualt-value instead of actusl
            // and textarea.getAttribute('value') doesn't exist
            var editable = ((editable=this.getAttr('contenteditable')) && (editable!=='false'));
            return editable ? this.innerHTML : this.value;
        };

       /**
        * Gets the x-position (in the window.document) of the element in pixels.
        * window.document-related: regardless of the window's scroll-position.
        *
        * @method getX
        * @return {Number} x-position in pixels
        * @since 0.0.1
        */
        ElementPrototype.getX = function() {
            return this.getBoundingClientRect().left + window.getScrollLeft();
        };

       /**
        * Gets the y-position (in the window.document) of the element in pixels.
        * window.document-related: regardless of the window's scroll-position.
        *
        * @method getY
        * @return {Number} y-position in pixels
        * @since 0.0.1
        */
        ElementPrototype.getY = function() {
            return this.getBoundingClientRect().top + window.getScrollTop();
        };

       /**
        * Whether the HtmlElement has the attribute set.
        *
        * Alias for hasAttribute().
        *
        * @method hasAttr
        * @param attributeName {String}
        * @return {Boolean} Whether the HtmlElement has the attribute set.
        * @since 0.0.1
        */
        ElementPrototype.hasAttr = function(attributeName) {
            return this.hasAttribute.apply(this, arguments);
        };

       /**
        * Checks whether the className is present on the Element.
        *
        * @method hasClass
        * @param newHtmlElement {HtmlElement} the new HtmlElement
        * @return {Boolean} whether the className is present on the Element
        * @since 0.0.1
        */
        ElementPrototype.hasClass = function(className) {
            var regexp = new RegExp('\\b' + className + '\\b');
            return regexp.test(this.className);
        };

       /**
        * If the Element has data set specified by `key`.
        *
        * @method hasData
        * @param key {string} name of the key
        * @return {Boolean}
        * @since 0.0.1
        */
        ElementPrototype.hasData = function(key) {
            return !!this._data && !!this._data[key];
        };

       /**
        * Checks whether HtmlElement currently has the focus.
        *
        * @method hasFocus
        * @param newHtmlElement {HtmlElement} the new HtmlElement
        * @return {Boolean} whether the className is present on the Element
        * @since 0.0.1
        */
        ElementPrototype.hasFocus = function() {
            return (window.document.activeElement===this);
        };

       /**
        * Returns the last of the HtmlElement's siblings, or the last that matches `cssSelector`.
        *
        * @method last
        * @param [cssSelector] {String} css-selector to be used as a filter
        * @return {HtmlElement|null}
        * @since 0.0.1
        */
        ElementPrototype.last = function(cssSelector) {
            return window.document.last.apply(this, arguments);
        };

       /**
        * Returns the next of the HtmlElement's siblings, or the next that matches `cssSelector`.
        *
        * @method next
        * @param [cssSelector] {String} css-selector to be used as a filter
        * @return {HtmlElement|null}
        * @since 0.0.1
        */
        ElementPrototype.next = function(cssSelector) {
            var found, nextElement;
            if (!cssSelector) {
                return this.nextElementSibling;
            }
/*jshint noempty:true */
            while ((nextElement=this.nextElementSibling) && (found=nextElement.matchesSelector(cssSelector))) {}
/*jshint noempty:false */
            return found && nextElement;
        };

       /**
        * Prepends a HtmlElement or text at the start of HtmlElement's innerHTML, or before the `refElement`.
        *
        * @method prepend
        * @param content {HtmlElement|HtmlElementList|String} content to prepend
        * @param [refElement] {HtmlElement|HtmlElementList|String} reference Element where the content should be prepended
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.prepend = function(content, refElement, escape) {
            var instance = this,
                children = instance.children;
            if (children.length===0) {
                return instance.window.document._insert(instance, 'appendChild', content, null, escape);
            }
            return instance.window.document._insert(instance, 'insertBefore', content, (refElement && (children.indexOf(refElement)!==-1)) ? refElement : children[0], escape);
        };

       /**
        * Returns the previous of the HtmlElement's siblings, or the previous that matches `cssSelector`.
        *
        * @method prev
        * @param [cssSelector] {String} css-selector to be used as a filter
        * @return {HtmlElement|null}
        * @since 0.0.1
        */
        ElementPrototype.prev = function(cssSelector) {
            var found, previousElement;
            if (!cssSelector) {
                return this.previousElementSibling;
            }
/*jshint noempty:true */
            while ((previousElement=this.previousElementSibling) && (found=previousElement.matchesSelector(cssSelector))) {}
/*jshint noempty:false */
            return found && previousElement;
        };

       /**
        * Removes the HtmlElement from the DOM.
        *
        * @method remove
        * @since 0.0.1
        */
        ElementPrototype.remove = function() {
            var parent = this.parentNode;
            parent && parent.removeChild(this);
        };

       /**
        * Removes the attribute from the HtmlElement.
        *
        * Alias for removeAttribute().
        *
        * @method removeAttr
        * @param attributeName {String}
        * @return {Boolean} Whether the HtmlElement has the attribute set.
        * @since 0.0.1
        */
        ElementPrototype.removeAttr = function(attributeName) {
            return this.hasAttribute.apply(this, arguments);
        };

       /**
        * Removes a className from the HtmlElement.
        *
        * @method removeClass
        * @param className {String} the className that should be removed.
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeClass = function(className) {
            var instance = this,
                regexp = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', 'g');
            instance.className = instance.className.replace(regexp, ' ').trim();
            return instance;
        };

       /**
        * Removes data specified by `key`. When no arguments are passed, all node-data (key-value pairs) will be removed.
        *
        * @method removeData
        * @param key {string} name of the key
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeData = function(key) {
            var instance = this;
            if (instance._data) {
                if (key) {
                    delete instance._data[key];
                }
                else {
                    // we cannot just redefine _data, for it is set as readonly
                    instance._data.each(
                        function(value, key) {
                            delete instance._data[key];
                        }
                    );
                }
            }
            return instance;
        };

       /**
        * Removes a css-property (inline) out of the HtmlElement. Use camelCase.
        *
        * @method removeInlineStyle
        * @param cssAttribute {String} the css-property to be removed
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeInlineStyle = function(cssAttribute) {
            this.setInlineStyle(cssAttribute, '');
            return this;
        };

       /**
        * Replaces the HtmlElement with a new HtmlElement.
        *
        * @method replace
        * @param newHtmlElement {HtmlElement|String} the new HtmlElement
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @since 0.0.1
        */
        ElementPrototype.replace = function(newHtmlElement, escape) {
            window.document.replace(this, newHtmlElement, escape);
        };

       /**
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
        ElementPrototype.replaceClass = function(prevClassName, newClassName, force) {
            var instance = this;
            if (force || instance.hasClass(prevClassName)) {
                instance.removeClass(prevClassName).setClass(newClassName);
            }
            return instance;
        };

        /**
         * Scrolls the content of the HtmlElement into the specified scrollposition.
         * Only available when the HtmlElement has overflow.
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
        ElementPrototype.setAttr = function(attributeName, value) {
            this.setAttribute.apply(this, arguments);
            return this;
        };

       /**
        * Adds a class to the HtmlElement. If the class already exists it won't be duplicated.
        *
        * @method setClass
        * @param className {String} className to be added
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setClass = function(className) {
            var instance = this;
            instance.hasClass(className) || (instance.className += ((instance.className.length>0) ? ' ' : '') + className);
            return instance;
        };

       /**
        * Sets the HtmlElement's class as a whole String. Cleaning up any previous classes.
        *
        * Alias for this.className = value
        *
        * @method setClassName
        * @param value {Any} the value that belongs to `key`
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setClassName = function(value) {
            this.className = value;
            return this;
        };

        /**
         * Stores arbitary `data` at the HtmlElement. This has nothing to do with node-attributes whatsoever,
         * it is just a way to bind any data to the specific Element so it can be retrieved later on with `getData()`.
         *
         * @method setData
         * @param key {string} name of the key
         * @param value {Any} the value that belongs to `key`
         * @chainable
         * @since 0.0.1
        */
        ElementPrototype.setData = function(key, value) {
            var instance = this;
            instance._data ||  Object.defineProperty(instance, '_data', {
                configurable: false,
                enumerable: false,
                writable: false,
                value: {} // `writable` is false means we cannot chance the value-reference, but we can change {}'s properties itself
            });
            instance._data[key] = value;
            return instance;
        };

       /**
        * Sets the content of the HtmlElement (innerHTML). Careful: only set content like this if you controll the data and
        * are sure what is going inside. Otherwise XSS might occur. If you let the user insert, or insert right from a db,
        * you might be better of using setContent().
        *
        * @method setHTML
        * @param content {HtmlElement|HtmlElementList|String} content to append
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setHTML = function(content) {
            this.innerHTML = content;
            return this;
        };

       /**
        * Gets the serialized HTML fragment describing the element including its descendants.
        *
        * alias for outerHTML()
        *
        * @method serialize
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.serialize = function() {
            return this.outerHTML;
        };

       /**
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
        ElementPrototype.setInlineStyle = function(cssAttribute, value) {
            // cautious: in case of preserved words (fe `float`), we need to modify the attributename
            // in order to get it processed. It should be translated into `cssFloat` or alike.
            RESERVED_WORDS[cssAttribute] && (cssAttribute='css-'+cssAttribute); // will be camelCased in the next step
            this.style[toCamelCase(cssAttribute)] = String(value).replace(/;$/, '');
            return this;
        };

       /**
        * Sets the content of the HtmlElement. This is a safe way to set the content, because HTML is not parsed.
        * If you do need to set HTML inside the node, use setHTML().
        *
        * @method setText
        * @param content {HtmlElement|HtmlElementList|String} content to append. In case of HTML, it will be escaped.
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setText = function(content) {
            var instance = this;
            // IE8- do not have `textContent`, but they do have `innerText`
            if (documentElement.textContent) {
                instance.textContent = content;
            }
            else {
                instance.innerText = content;
            }
            return instance;
        };

       /**
        * Sets the value of the following HtmlElements:
        *
        * <ul>
        *     <li>input</li>
        *     <li>textarea</li>
        *     <li>select</li>
        *     <li>any container that is `contenteditable`</li>
        *
        * Will fire an `valuechange` event, in case both the `itsa/event` as well as
        * `itsa/event-dom/extra/event-valuechange.js` are used.
        *
        * Therefore it is highly suggested to use `setValue()` instead of setting the value manually.
        *
        * @method setValue
        * @param value {Any} the value to be set
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setValue = function(value) {
            var instance = this;
            // cautious: input and textarea must be accessed by their propertyname:
            // input.getAttribute('value') would return the defualt-value instead of actusl
            // and textarea.getAttribute('value') doesn't exist
            var editable = ((editable=instance.getAttr('contenteditable')) && (editable!=='false'));
            if (editable) {
                instance.innerHTML = value;
            }
            else {
                instance.value = value;
            }
            // if `document._emitVC` is available, then invoke it to emit the `valuechange`-event
            window.document._emitVC && window.document._emitVC(instance, value);
            return instance;
        };

       /**
         * Checks whether a point specified with x,y is within the HtmlElement's region.
         *
         * @method insidePos
         * @param x {Number} x-value for new position (coordinates are page-based)
         * @param y {Number} y-value for new position (coordinates are page-based)
         */
        ElementPrototype.insidePos = function(x, y) {
            var instance = this,
                left = instance.getX(),
                top = instance.getY(),
                right = left + instance.offsetWidth,
                bottom = top + instance.offsetHeight;
            return (x>=left) && (x<=right) && (y>=top) && (y<=bottom);
        };

       /**
         * Set the position of an html element in page coordinates.
         * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         *
         * If the HtmlElement has the attribute `xy-constrian` set, then its position cannot exceed any matching container it lies within.
         *
         * @method setXY
         * @param x {Number} x-value for new position (coordinates are page-based)
         * @param y {Number} y-value for new position (coordinates are page-based)
         * @param [notransition=false] {Boolean} set true if you are sure positioning is without transition.
         *        this isn't required, but it speeds up positioning. Only use when no transition is used:
         *        when there is a transition, setting this argument `true` would miscalculate the position.
         */
        ElementPrototype.setXY = function(x, y, notransition) {
            var instance = this,
                position = instance.getStyle(POSITION),
                dif, start, finalValue, constrainedSelector, match, constrainNode, byExactId,
                containerTop, containerRight, containerLeft, containerBottom, requestedX, requestedY;

            // default position to relative
            if (position==='static') {
                instance.setInlineStyle(POSITION, 'relative');
            }
            // make sure it has sizes and can be positioned
            instance.setClass(BLOCK).setClass(INVISIBLE).setClass(BORDERBOX);
/*jshint boss:true */
            if (constrainedSelector=instance.getAttr(CONSTRAIN_ATTR)) {
/*jshint boss:false */
                match = false;
                constrainNode = instance;
                byExactId = REGEXP_NODE_ID.test(constrainedSelector);
                while (constrainNode.matchesSelector && !match) {
                    match = byExactId ? (constrainNode.id===constrainedSelector.substr(1)) : constrainNode.matchesSelector(constrainedSelector);
                    // if there is a match, then make sure x and y fall within the region
                    if (match) {
                        containerLeft = constrainNode.getX();
                        containerTop = constrainNode.getY();
                        containerRight = containerLeft + constrainNode.offsetWidth;
                        containerBottom = containerTop + constrainNode.offsetHeight;

                        requestedX = x || instance.getX();
                        if ((requestedX+instance.offsetWidth)>containerRight) {
                            x = requestedX = containerRight - instance.offsetWidth;
                        }
                        (requestedX<containerLeft) && (x=containerLeft);

                        requestedY = y || instance.getY();
                        if ((requestedY+instance.offsetHeight)>containerBottom) {
                            y = requestedY = containerBottom - instance.offsetHeight;
                        }
                        (requestedY<containerTop) && (y=containerTop);
                    }
                    constrainNode = constrainNode.parentNode;
                }
            }
            if (x) {
                // check if there is a transition:
                if (notransition) {
                    instance.setInlineStyle('left', x + 'px');
                    dif = (instance.getX()-x);
                    (dif!==0) && (instance.setInlineStyle('left', (x - dif) + 'px'));
                }
                else {
                    start = instance.getInlineStyle('left');
                    instance.setClass(NO_TRANS);
                    instance.setInlineStyle('left', x + 'px');
                    dif = (instance.getX()-x);
                    finalValue = (x - dif);
                    // now reset and go to finalX with transition
                    instance.setInlineStyle('left', start);
                    instance.removeClass(NO_TRANS);
                    instance.setInlineStyle('left', finalValue + 'px');
                }
            }
            if (y) {
                if (notransition) {
                    instance.setInlineStyle('top', y + 'px');
                    dif = (instance.getY()-y);
                    (dif!==0) && (instance.setInlineStyle('top', (y - dif) + 'px'));
                }
                else {
                    start = instance.getInlineStyle('top');
                    instance.setClass(NO_TRANS);
                    instance.setInlineStyle('top', y + 'px');
                    dif = (instance.getY()-y);
                    finalValue = (y - dif);
                    // now reset and go to finalX with transition
                    instance.setInlineStyle('top', start);
                    instance.removeClass(NO_TRANS);
                    instance.setInlineStyle('top', finalValue + 'px');
                }
            }
            instance.removeClass(BLOCK).removeClass(BORDERBOX).removeClass(INVISIBLE);
        };

        /**
         * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
         * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setX
         * @param element The target element
         * @param {Number} x The X values for new position (coordinates are page-based)
         */
        ElementPrototype.setX = function(node, x) {
            return this.setXY(x);
        };

        /**
         * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
         * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setY
         * @param element The target element
         * @param {Number} y The Y values for new position (coordinates are page-based)
         */
        ElementPrototype.setY = function(node, y) {
            return this.setXY(null, y);
        };

       /**
        * Tests if the HtmlElement would be selected by the specified cssSelector.
        * Alias for `matchesSelector()`
        *
        * @method test
        * @param cssSelector {String} the css-selector to test against
        * @return {Boolean} whether or not the node matches the selector
        * @since 0.0.1
        */
        ElementPrototype.test = function(cssSelector) {
            return window.document.test.apply(this, arguments);
        };

       /**
        * Toggles the className of the Element.
        *
        * @method toggleClass
        * @param className {String} the className that should be toggled
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.toggleClass = function(className) {
            var instance = this;
            instance.hasClass(className) ? instance.removeClass(className) : instance.setClass(className);
            return instance;
        };

    }(window.Element.prototype));
};
},{"../css/element.css":10,"./document.js":12,"js-ext/extra/reserved-words.js":30,"js-ext/lib/object.js":34,"js-ext/lib/string.js":36,"polyfill/lib/element.matchesselector.js":43,"window-ext":55}],14:[function(require,module,exports){
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
 * require('dom-ext/lib/nodelist.js')(window);
 *
 * @module dom-ext
 * @submodule lib/nodelist.js
 * @class NodeList
 * @since 0.0.1
*/

require('polyfill/polyfill-base.js');

module.exports = function (window) {
    (function(NodeListPrototype, HTMLCollectionPrototype) {
        var arrayMethods = Object.getOwnPropertyNames(Array.prototype),
            forEach = function(instance, method, args) {
                instance.forEach(function(element) {
                    element[method].apply(element, args);
                });
                return instance;
            };

        // adding Array.prototype methods to NodeList.prototype
        // Note: this might be buggy in IE8 and below: https://developer.mozilla.org/en-US/docs/Web/API/NodeList#Workarounds
        arrayMethods.forEach(function(methodName) {
            try {
                NodeListPrototype && (NodeListPrototype[methodName] || (NodeListPrototype[methodName]=Array.prototype[methodName]));
                HTMLCollectionPrototype && (HTMLCollectionPrototype[methodName] || (HTMLCollectionPrototype[methodName]=Array.prototype[methodName]));
            }
            catch(err) {
                // some properties have only getters and cannot (and don't need) to be set
            }
        });

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Appends a HtmlElement or text at the end of HtmlElement's innerHTML.
        *
        * @method append
        * @param content {HtmlElement|HtmlElementList|String} content to append
        * @param escape {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @chainable
        * @since 0.0.1
        */
        NodeListPrototype.append = HTMLCollectionPrototype.append = function(content, escape) {
            return forEach(this, 'append', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
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
        NodeListPrototype.defineInlineStyle = HTMLCollectionPrototype.defineInlineStyle = function(value) {
            return forEach(this, 'defineInlineStyle', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Prepends a HtmlElement or text at the start of HtmlElement's innerHTML.
        *
        * @method prepend
        * @param content {HtmlElement|HtmlElementList|String} content to prepend
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @chainable
        * @since 0.0.1
        */
        NodeListPrototype.prepend = HTMLCollectionPrototype.prepend = function(content, escape) {
            return forEach(this, 'prepend', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Removes the HtmlElement from the DOM.
        *
        * @method remove
        * @since 0.0.1
        */
        NodeListPrototype.remove = HTMLCollectionPrototype.remove = function(HtmlElement) {
            return forEach(this, 'remove', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Removes the attribute from the HtmlElement.
        *
        * Alias for removeAttribute().
        *
        * @method removeAttr
        * @param attributeName {String}
        * @return {Boolean} Whether the HtmlElement has the attribute set.
        * @since 0.0.1
        */
        NodeListPrototype.removeAttr = HTMLCollectionPrototype.removeAttr = function(attributeName) {
            return forEach(this, 'removeAttr', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Removes a className from the HtmlElement.
        *
        * @method removeClass
        * @param className {String} the className that should be removed.
        * @chainable
        * @since 0.0.1
        */
        NodeListPrototype.removeClass = HTMLCollectionPrototype.removeClass = function(className) {
            return forEach(this, 'removeClass', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Removes data specified by `key`. When no arguments are passed, all node-data (key-value pairs) will be removed.
        *
        * @method removeData
        * @param key {string} name of the key
        * @chainable
        * @since 0.0.1
        */
        NodeListPrototype.removeData = HTMLCollectionPrototype.removeData = function(key) {
            return forEach(this, 'removeData', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Removes a css-property (inline) out of the HtmlElement. Use camelCase.
        *
        * @method removeInlineStyle
        * @param cssAttribute {String} the css-property to be removed
        * @chainable
        * @since 0.0.1
        */
        NodeListPrototype.removeInlineStyle = HTMLCollectionPrototype.removeInlineStyle = function(cssAttribute) {
            return forEach(this, 'removeInlineStyle', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Replaces the HtmlElement with a new HtmlElement.
        *
        * @method replace
        * @param newHtmlElement {HtmlElement|String} the new HtmlElement
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @since 0.0.1
        */
        NodeListPrototype.replace = HTMLCollectionPrototype.replace = function(newHtmlElement, escape) {
            return forEach(this, 'replace', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
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
        NodeListPrototype.replaceClass = HTMLCollectionPrototype.replaceClass = function(prevClassName, newClassName, force) {
            return forEach(this, 'replaceClass', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
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
        NodeListPrototype.setAttr = HTMLCollectionPrototype.setAttr = function(attributeName, value) {
            return forEach(this, 'setAttr', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Adds a class to the HtmlElement. If the class already exists it won't be duplicated.
        *
        * @method setClass
        * @param className {String} className to be added
        * @chainable
        * @since 0.0.1
        */
        NodeListPrototype.setClass = HTMLCollectionPrototype.setClass = function(className) {
            return forEach(this, 'setClass', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Sets the class to the HtmlElement. Cleaning up any previous classes.
        *
        * @method setClassName
        * @param value {Any} the value that belongs to `key`
        * @chainable
        * @since 0.0.1
        */
        NodeListPrototype.setClassName = HTMLCollectionPrototype.setClassName = function(className) {
            return forEach(this, 'setClassName', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Stores arbitary `data` at the HtmlElement. This has nothing to do with node-attributes whatsoever,
        * it is just a way to bind any data to the specific Element so it can be retrieved later on with `getData()`.
        *
        * @method setData
        * @param key {string} name of the key
        * @param value {Any} the value that belongs to `key`
        * @chainable
        * @since 0.0.1
       */
        NodeListPrototype.setData = HTMLCollectionPrototype.setData = function(key, value) {
            return forEach(this, 'setData', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Sets the content of the HtmlElement (innerHTML). Careful: only set content like this if you controll the data and
        * are sure what is going inside. Otherwise XSS might occur. If you let the user insert, or insert right from a db,
        * you might be better of using setContent().
        *
        * @method setHTML
        * @param content {HtmlElement|HtmlElementList|String} content to append
        * @chainable
        * @since 0.0.1
        */
        NodeListPrototype.setHTML = HTMLCollectionPrototype.setHTML = function(content) {
            return forEach(this, 'setHTML', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
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
        NodeListPrototype.setInlineStyle = HTMLCollectionPrototype.setInlineStyle = function(cssAttribute, value) {
            return forEach(this, 'setInlineStyle', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Sets the content of the HtmlElement. This is a safe way to set the content, because HTML is not parsed.
        * If you do need to set HTML inside the node, use setHTML().
        *
        * @method setText
        * @param content {HtmlElement|HtmlElementList|String} content to append. In case of HTML, it will be escaped.
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @chainable
        * @since 0.0.1
        */
        NodeListPrototype.setText = HTMLCollectionPrototype.setText = function(content) {
            return forEach(this, 'setText', arguments);
        };

       /**
        * For all HtmlElements of the NodeList/HTMLCollection:
        * Toggles the className of the Element.
        *
        * @method toggleClass
        * @param className {String} the className that should be toggled
        * @chainable
        * @since 0.0.1
        */
        NodeListPrototype.toggleClass = HTMLCollectionPrototype.toggleClass = function(className) {
            return forEach(this, 'toggleClass', arguments);
        };

    }(window.NodeList && window.NodeList.prototype, window.HTMLCollection && window.HTMLCollection.prototype));
};
},{"polyfill/polyfill-base.js":50}],15:[function(require,module,exports){
var css = "[draggable] {\n    -moz-user-select: none;\n    -khtml-user-select: none;\n    -webkit-user-select: none;\n    user-select: none;\n    /* Required to make elements draggable in old WebKit */\n    -khtml-user-drag: element;\n    -webkit-user-drag: element;\n}\n.dd-transition[draggable] {\n    -webkit-transition: top 0.25s ease-out, left 0.25s ease-out;\n    -moz-transition: top 0.25s ease-out, left 0.25s ease-out;\n    -ms-transition: top 0.25s ease-out, left 0.25s ease-out;\n    -o-transition: top 0.25s ease-out, left 0.25s ease-out;\n    transition: top 0.25s ease-out, left 0.25s ease-out;\n}\n.dd-high-z {\n    z-index: 999 !important;\n}\n.dd-opacity {\n    opacity: 0.6;\n    filter: alpha(opacity=60); /* For IE8 and earlier */\n}"; (require("/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify"))(css); module.exports = css;
},{"/Volumes/Data/Marco/Documenten Marco/GitHub/itsa.contributor/node_modules/cssify":1}],16:[function(require,module,exports){
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
    REGEXP_UI = /^UI:/,
    REGEXP_NODE_ID = /^#\S+$/,
    REGEXP_EXTRACT_NODE_ID = /#(\S+)/,
    REGEXP_UI_OUTSIDE = /^.+outside$/,

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

module.exports = function (window) {
    var DOCUMENT = window.document,
        NEW_EVENTSYSTEM = DOCUMENT.addEventListener,
        OLD_EVENTSYSTEM = !NEW_EVENTSYSTEM && DOCUMENT.attachEvent,
        DOM_Events, _bubbleIE8, _domSelToFunc, _evCallback, _findCurrentTargets, _preProcessor,
        _setupDomListener, SORT, _sortFunc, _sortFuncReversed, _getSubscribers, _selToFunc;

    require('polyfill/lib/element.matchesselector.js')(window);
    require('polyfill/lib/node.contains.js')(window);

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
     * Polyfill for bubbling the `focus` and `blur` events in IE8.
     *
     * IE>8 we can use delegating on ALL events, because we use the capture-phase.
     * Unfortunatly this cannot be done with IE<9. But we can simulate focus and blur
     * delegation bu monitoring the focussed node.
     *
     * This means the IE<9 will miss the events: 'error', 'load', 'resize' and 'scroll'
     * However, if you need one of these to work in IE8, then you can `activate` this event on the
     * single node that you want to minotor. You activate it and then you use the eventsystem
     * like like you are used to. (delegated). Only activated nodes will bubble their non-bubbling events up
     * Activation is not done manually, but automaticly: whenever there is a subscriber on a node (or an id-selector)
     * and IE<9 is the environment, then a listener for that node is set up.
     * Side-effect is that we cannot controll when the listener isn't needed anymore. This might lead to memory-leak - but its IE<9...
     *
     * @method _bubbleIE8
     * @private
     * @since 0.0.1
     */
    _bubbleIE8 = function() {
        console.log(NAME, '_bubbleIE8');
        // we wil emulate focus and blur by subscribing to the keyup and mouseup events:
        // when they happen, we'll ask for the current focussed Node --> if there is a
        // change compared to the previous, then we fire both a blur and a focus-event
        Event._focussedNode = DOCUMENT.activeElement;
        Event.after(['keyup', 'mouseup'], function(e) {
            var newFocussed = DOCUMENT.activeElement,
                prevFocussed = Event._focussedNode;
            if (prevFocussed !== newFocussed) {
                Event._focussedNode = newFocussed;
                Event.emit(prevFocussed, 'UI:blur', e);
                Event.emit(newFocussed, 'UI:focus', e);
            }
        });
    };

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
                match = false;
            // e.target is the most deeply node in the dom-tree that caught the event
            // our listener uses `selector` which might be a node higher up the tree.
            // we will reset e.target to this node (if there is a match)
            // note that e.currentTarget will always be `document` --> we're not interested in that
            // also, we don't check for `node`, but for node.matchesSelector: the highest level `document`
            // is not null, yet it doesn;t have .matchesSelector so it would fail
            while (node.matchesSelector && !match) {
                console.log(NAME, '_domSelToFunc inside filter check match');
                match = byExactId ? (node.id===selector.substr(1)) : node.matchesSelector(selector);
                // if there is a match, then set
                // e.target to the target that matches the selector
                if (match && !outsideEvent) {
                    subscriber.t = node;
                }
                node = node.parentNode;
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
        if ((eventobject.status.halted || eventobject.status.defaultPrevented) && e.preventDefault) {
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
            subscribers = subscribers.filter(function(subscriber) {
                console.log(NAME, 'filtercheck for subscriber');
                return (!subscriber.f || subscriber.f.call(subscriber.o, e));
            });
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

        if (NEW_EVENTSYSTEM) {
            // one exeption: windowresize should listen to the window-object
            if (eventName==='resize') {
                window.addEventListener(eventName, _evCallback);
            }
            else {
                // important: set the third argument `true` so we listen to the capture-phase.
                DOCUMENT.addEventListener(eventName, _evCallback, true);
            }
        }
        else if (OLD_EVENTSYSTEM) {
            // one exeption: windowresize should listen to the window-object
            if (eventName==='resize') {
                window.attachEvent('on'+eventName, _evCallback);
            }
            else {
                DOCUMENT.attachEvent('on'+eventName, _evCallback);
            }
        }
        DOMEvents[eventName] = true;
        outsideEvent && (DOMEvents[eventName+OUTSIDE]=true);
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

    // Now a very tricky one:
    // Some browsers do an array.sort down-top instead of top-down.
    // In those cases we need another sortFn, for the position on an equal match should fall
    // behind instead of before (which is the case on top-down sort)
    [1,2].sort(function(a, b) {
        SORT || (SORT=(a===2) ? _sortFuncReversed : _sortFunc);
    });

    // Now we do some initialization in order to make DOM-events work:

    // Notify when someone subscriber to an UI:* event
    // if so: then we might need to define a customEvent for it:
    // alse define the specific DOM-methods that can be called on the eventobject: `stopPropagation` and `stopImmediatePropagation`
    Event.notify('UI:*', _setupDomListener, Event)
         ._setEventObjProperty('stopPropagation', function() {this.status.ok || (this.status.propagationStopped = this.target);})
         ._setEventObjProperty('stopImmediatePropagation', function() {this.status.ok || (this.status.immediatePropagationStopped = this.target);});


    Event._sellist = [_domSelToFunc];

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

    // next: bubble-polyfill for IE8:
    OLD_EVENTSYSTEM && _bubbleIE8();

    // store module:
    window._ITSAmodules.EventDom = Event;
    return Event;
};

},{"event":24,"polyfill/lib/element.matchesselector.js":43,"polyfill/lib/node.contains.js":45,"utils":52}],17:[function(require,module,exports){
"use strict";

/**
 * Adds the `hover` event as a DOM-event to event-dom. more about DOM-events:
 * http://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/
 *
 * More about drag and drop: https://dev.opera.com/articles/drag-and-drop/
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @example
 * Event = require('event-dom/dragdrop.js')(window);
 *
 * or
 *
 * @example
 * Event = require('event-dom')(window);
 * require('event-dom/event-dragdrop.js')(window);
 *
 * @module event
 * @submodule event-dragdrop
 * @class Event
 * @since 0.0.2
*/


var NAME = '[event-dragdrop]: ',
    ZINDEX_DURING_DRAG = 999,
    CTRL_PRESSED = false,
    Z_INDEX = 'z-index',
    PREV_Z = '_prevZ',
    DRAGGABLE = 'draggable',
    DD_DRAGGING_CLASS = 'dd-dragging',
    CONSTRAIN_ATTR = 'xy-constrain',
    PROXY = 'proxy',
    MOUSE = 'mouse',
    DATA_KEY = 'dragDrop',
    DATA_KEY_DROPZONE = 'dropZone',
    DD_EFFECT_ALLOWED = 'dd-effect-allowed',
    DD_DROPZONE = 'dd-dropzone',
    NO_TRANS_CLASS = 'el-notrans', // delivered by `dom-ext`
    INVISIBLE_CLASS = 'el-invisible', // delivered by `dom-ext`
    DD_TRANSITION_CLASS = 'dd-transition',
    DD_OPACITY_CLASS = 'dd-opacity',
    HIGH_Z_CLASS = 'dd-high-z',
    DD_DROPACTIVE_CLASS = 'dropactive',
    REGEXP_MOVE = /\bmove\b/i,
    REGEXP_COPY = /\bcopy\b/i,
    LATER = require('utils').later;

require('polyfill/polyfill-base.js');
require('js-ext');
require('../css/dragdrop.css');
require('./hover.js');

module.exports = function (window) {
    var Event = require('../event-dom.js')(window),
        UA = window.navigator.userAgent,
        iOS = !!UA.match('iPhone OS') || !!UA.match('iPad'),
        dragOverPromiseList = [],
        featureDetect_DD, supportsDD, setupDD, teardownDD, handleMove, handleDrop, teardownDragOverEvent, allowSwitch, _getAllowedEffects,
        handleDragStart, currentNode, allowCopy, movableNode, setupDragOverEvent, dragOverEvent, lastMouseOverNode, onlyCopy, dropEffect,
        lastMouseX, lastMouseY, setBack;

    require('window-ext')(window);
    require('dom-ext')(window);

    featureDetect_DD = function() {
        var div = window.document.createElement('div');
        return (DRAGGABLE in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    supportsDD = featureDetect_DD();

    // if supportsDD && !iOS, then we can use native HTML5 drag and drop
    // no polyfill needed

    // iOS claims that draggable is in the element but doesn't allow drag and drop:
    // https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html

    if (iOS || !supportsDD) {
        // we need a custom drag and drop solution
    }

    _getAllowedEffects = function(node) {
        var allowedEffects = node.getAttr(DD_EFFECT_ALLOWED);
        allowedEffects && (allowedEffects=allowedEffects.toLowerCase());
        return allowedEffects || 'move';
    };

    allowCopy = function(node) {
        var allowedEffects = _getAllowedEffects(node);
        return (allowedEffects==='all') || (allowedEffects==='copy');
    };

    onlyCopy = function(node) {
        var allowedEffects = _getAllowedEffects(node);
        return (allowedEffects==='copy');
    };

    allowSwitch = function(node) {
        var allowedEffects = _getAllowedEffects(node);
        return (allowedEffects==='all');
    };

    setupDragOverEvent = function() {
        var dropzones = window.document.getAll('[dropzone]');
        if (dropzones.length>0) {
            dragOverEvent = Event.after(['mousemove', 'dd-fake-mousemove'], function(e) {
                if (currentNode) {
                    lastMouseOverNode = e.target;
                    dropzones.forEach(
                        function(dropzone) {
                            if (dropzone.hasData(DATA_KEY_DROPZONE)) {
                                return;
                            }
                            var dropzoneAccept = dropzone.getAttr('dropzone') || '',
                                dropzoneMove = REGEXP_MOVE.test(dropzoneAccept),
                                dropzoneCopy = REGEXP_COPY.test(dropzoneAccept),
                                dragOverPromise, dragOutEvent, eventobject, allowed;

                            if (e.clientX) {
                                lastMouseX = e.clientX+window.getScrollLeft();
                                lastMouseY = e.clientY+window.getScrollTop();
                            }

                            // check if the mouse is inside the dropzone
                            // also check if the mouse is inside the dragged node: the dragged node might have been constrained
                            // and check if the dragged node is allowed to go into the dropzone
                            allowed = (!dropzoneMove && !dropzoneCopy) || (dropzoneCopy && (dropEffect==='copy')) || (dropzoneMove && (dropEffect==='move'));
                            if (dropEffect && allowed && dropzone.insidePos(lastMouseX, lastMouseY) && movableNode.insidePos(lastMouseX, lastMouseY)) {
                                dropzone.setData(DATA_KEY_DROPZONE, true);
                                // mouse is in area of dropzone
                                dragOverPromise = Promise.manage();
                                eventobject = {
                                    target: dropzone,
                                    dragover: dragOverPromise
                                };
                                dragOutEvent = Event.after(
                                    ['mousemove', 'dd-fake-mousemove'],
                                    function(ev) {
                                        dragOverPromise.fulfill(ev.target);
                                    },
                                    function(ev) {
                                        var allowed, dropzoneAccept, dropzoneMove, dropzoneCopy;
                                        if (ev.type==='dd-fake-mousemove') {
                                            dropzoneAccept = dropzone.getAttr('dropzone') || '';
                                            dropzoneMove = REGEXP_MOVE.test(dropzoneAccept);
                                            dropzoneCopy = REGEXP_COPY.test(dropzoneAccept);
                                            allowed = (!dropzoneMove && !dropzoneCopy) || (dropzoneCopy && (dropEffect==='copy')) || (dropzoneMove && (dropEffect==='move'));
                                            return !allowed;
                                        }
                                        return !dropzone.insidePos(ev.clientX+window.getScrollLeft(), ev.clientY+window.getScrollTop());
                                    }
                                );
                                dragOverPromise.finally(
                                    function() {
                                        dragOutEvent.detach();
                                        dropzone.removeData(DATA_KEY_DROPZONE);
                                    }
                                );
                                dragOverPromiseList.push(dragOverPromise);
                                Event.emit(dropzone, 'UI:dd-dragover', eventobject);
                            }
                        }
                    );
                }
            });
        }
    };

    teardownDragOverEvent = function() {
        if (dragOverEvent) {
            dragOverEvent.detach();
            dragOverPromiseList.forEach(function(promise) {
                promise.fulfill(lastMouseOverNode);
            });
            dragOverPromiseList.length = 0;
        }
        dragOverEvent = null;
    };

    /*
     * Creates the `hover` event. The eventobject has the property `e.hover` which is a `Promise`.
     * You can use this Promise to get notification of the end of hover. The Promise e.hover gets resolved with
     * `relatedTarget` as argument: the node where the mouse went into when leaving a.target.
     *
     * @method setupHover
     * @private
     * @since 0.0.2
     */
    setupDD = function() {

        Event.after(['keydown', 'keyup'], function(e) {
            CTRL_PRESSED = e.ctrlKey || e.metaKey;
            if (currentNode && allowSwitch(currentNode)) {
                dropEffect = CTRL_PRESSED ? 'copy' : 'move';
                if (CTRL_PRESSED) {
                    currentNode.removeClass(INVISIBLE_CLASS);
                    movableNode.setClass(DD_OPACITY_CLASS);
                }
                else {
                    currentNode.setClass(INVISIBLE_CLASS);
                    movableNode.removeClass(DD_OPACITY_CLASS);
                }
                // now, it could be that any droptarget should change its appearance (DD_DROPACTIVE_CLASS).
                // we need to recalculate it for all targets
                // we do this by emitting a 'dd-fake-mousemove' event
                lastMouseOverNode && Event.emit(lastMouseOverNode, 'UI:dd-fake-mousemove');
            }
        });

        // prevent contextmenu on draggable elements that have the ability to copy themselves:
        window.oncontextmenu = function () {
            return currentNode ? !allowCopy(currentNode) : true;
        };

        Event.after('dd-dragover', function(e) {
            console.log(NAME, 'dragged over');
            e.target.setClass(DD_DROPACTIVE_CLASS);
            e.dragover.then(
                function() {
                    e.target.removeClass(DD_DROPACTIVE_CLASS);
                }
            );
        });

        Event.before([MOUSE+'down', 'panstart'], function(e) {
            console.log(NAME, 'setupHover: setting up mouseover event');
            var node = e.target,
                moveEv, evtType, x, y;

            // because we listen to 2 eventypes, but we don't want to setup twice, we need to store
            // data on the node that tells whether dragging already started
            if (currentNode) {
                return;
            }

            currentNode = node;

            // we set data to the node: key='dragDrop' value=xy-position, which we may need
            // to return a proxy on drop-fail
            x = node.getX();
            y = node.getY();
            // now we can read their current inline values
            node.setData(DATA_KEY, {
                x: x,
                y: y,
                xStart: node.getInlineStyle('left'),
                yStart: node.getInlineStyle('top'),
                mousex: e.clientX+window.getScrollLeft(),
                mousey: e.clientY+window.getScrollTop()
            });

            evtType = (e.type===MOUSE+'down') ? MOUSE : 'pan';

            e.drag = Promise.manage();

            e.setOnDrag = function(callbackFn) {
                e.drag.setCallback(callbackFn);
            };

            moveEv = Event.after(evtType+'move', function(ev) {
                // move the object
                handleMove(e, ev);
                e.drag.callback(e);
            });

            Event.onceAfter((evtType===MOUSE) ? MOUSE+'up' : 'panend', function(ev) {
                moveEv.detach();
                // handle drop
                movableNode.hasAttr(DD_DROPZONE) && handleDrop(e, ev);
                currentNode = null;
                e.dragFinished = true;
                node.removeData(DATA_KEY);
                teardownDragOverEvent();
                e.drag.fulfill(e);
            });

            setupDragOverEvent();
            handleDragStart(e, x, y);

            Event.emit(node, 'UI:dd-drop', e);
        }, '[draggable="true"]');
    };

    handleDragStart = function(e, x, y) {
        var proxy = currentNode.hasAttr(DD_DROPZONE);

        movableNode = proxy ? currentNode.clone(true) : currentNode;


        movableNode.setClass(NO_TRANS_CLASS).setClass(HIGH_Z_CLASS);

        if (proxy) {
            dropEffect = (onlyCopy(currentNode) || (CTRL_PRESSED && allowCopy(currentNode))) ? 'copy' : 'move';
            (dropEffect==='copy') ? movableNode.setClass(DD_OPACITY_CLASS) : currentNode.setClass(INVISIBLE_CLASS);
            movableNode.setClass(INVISIBLE_CLASS);
            currentNode.parentNode.append(movableNode);
            movableNode.setXY(x, y, true);
            movableNode.removeClass(INVISIBLE_CLASS);
        }
        else {
            dropEffect = null;
            movableNode.setXY(x, y, true);
        }
    };

    handleMove = function(e, ev) {
console.info('DragMove '+movableNode.id);
        if (e.dragFinished) {
            return;
        }
        var data = movableNode.getData(DATA_KEY);
        movableNode.setClass(DD_DRAGGING_CLASS);
        movableNode.setXY(data.x+ev.clientX+window.getScrollLeft()-data.mousex, data.y+ev.clientY+window.getScrollTop()-data.mousey, true);
    };

    handleDrop = function(e, ev) {
console.info('DragDrop '+movableNode.id);
        var targetNode, originalConstrain;

        window.document.getAll('[dropzone]').some(function(dropzone) {
            if (dropzone.hasData(DATA_KEY_DROPZONE)) {
                targetNode = dropzone;
            }
            return targetNode;
        });
        if (targetNode) {
            targetNode.append(currentNode);
            originalConstrain = currentNode.getAttr(CONSTRAIN_ATTR);
            currentNode.setAttr(CONSTRAIN_ATTR, '[dropzone]');
            currentNode.setXY(movableNode.getX(), movableNode.getY());
            currentNode.setAttr(CONSTRAIN_ATTR, originalConstrain);
            currentNode.removeClass(INVISIBLE_CLASS);
            movableNode.remove();
        }
        else {
            setBack(e, ev);
        }
    };

    setBack = function(e, ev) {
console.info('setBack '+movableNode.id);
        var proxy = movableNode.hasAttr(DD_DROPZONE),
            data = movableNode.getData(DATA_KEY),
            tearDown;
        tearDown = function(notransRemoval) {
            notransRemoval || (movableNode.removeEventListener && movableNode.removeEventListener('transitionend', tearDown, true));
            if (proxy) {
                // we must take e.target instead of currentNode --> because asynchronisity, currentNode is already null
                e.target.removeClass(INVISIBLE_CLASS);
                movableNode.remove();
            }
            else {
                movableNode.removeClass(DD_TRANSITION_CLASS).removeClass(HIGH_Z_CLASS);
            }
        };

        movableNode.removeClass(NO_TRANS_CLASS);

        if (movableNode.hasClass(DD_DRAGGING_CLASS)) {
            movableNode.removeClass(DD_DRAGGING_CLASS);
            movableNode.setClass(DD_TRANSITION_CLASS);
            // transitions only work with IE10+, and that browser has addEventListener
            // when it doesn't have, it doesn;t harm to leave the transitionclass on: it would work anyway
            // nevertheless we will remove it with a timeout
            if (movableNode.addEventListener) {
                movableNode.addEventListener('transitionend', tearDown, true);
            }
            else {
                LATER(tearDown, 250);
            }
        }
        else {
            tearDown(true);
        }
        movableNode.setInlineStyle('left', data.xStart);
        movableNode.setInlineStyle('top', data.yStart);

    };

    setupDD();

    // also extend window.Element:
    window.Element && (function(ElementPrototype) {
       /**
        * Makes the HtmlElement draggable
        *
        * @method setDraggable
        * @param [proxy] {Boolean} whether the HtmlElement is a proxy-node during drag
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setDraggable = function(proxy) {
            this.setAttr(DRAGGABLE, proxy ? PROXY : "true");
            return this;
        };
       /**
        * Removes draggability of the HtmlElement
        *
        * @method removeDraggable
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeDraggable = function() {
            this.removeAttr(DRAGGABLE);
            return this;
        };
    }(window.Element.prototype));

    return Event;
};
},{"../css/dragdrop.css":15,"../event-dom.js":16,"./hover.js":18,"dom-ext":11,"js-ext":31,"polyfill/polyfill-base.js":50,"utils":52,"window-ext":55}],18:[function(require,module,exports){
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
            e.hover = new Promise(function(fulfill, reject) {
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

    return Event;
};

},{"../event-dom.js":16}],19:[function(require,module,exports){
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
require('dom-ext');

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

    var Event = require('../event-dom.js')(window),
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
        if (node===window.document) {
            return false;
        }
        console.log(NAME, 'editableNodes '+node.test('input, textarea, select') || ((editable=node.getAttr('contenteditable')) && (editable!=='false')));
        return node.test('input, textarea, select') || ((editable=node.getAttr('contenteditable')) && (editable!=='false'));
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
            editable, valueChangeData, previousValue;

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
        startFocus({target: window.document.activeElement});
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
        if (window.document.activeElement!==node) {
            return;
        }
        var prevData = node.getData(DATA_KEY),
            editable = ((editable=node.getAttr('contenteditable')) && (editable!=='false')),
            currentData = editable ? node.innerHTML : node[VALUE];
        if (currentData!==prevData.prevVal) {
            console.log(NAME, 'checkChanged --> value has been changed');
            window.document._emitVC(node, currentData);
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
            endFocus({target: window.document.activeElement});
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
    window.document._emitVC = function(node, value) {
        console.log(NAME, 'document._emitVC');
        var e = {
            value: value,
            target: node,
            currentTarget: window.document,
            sourceTarget: node
        };
        Event.emit(node, 'UI:valuechange', e);
    };

    return Event;
};

},{"../event-dom.js":16,"dom-ext":11,"utils":52}],20:[function(require,module,exports){
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

},{"event-dom":16,"hammerjs":2}],21:[function(require,module,exports){
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
        MSG_HALTED = 'event was halted',
        MSG_PREVENTED = 'event was defaultPrevented',
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
         *                 Recieves 3 arguments: the `subscriber-object`, `customEvent` and the complete subscriptionobject.
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
         *                 Recieves 2 arguments: the `subscriber-object` and `customEvent`.
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
                    function(value, key, object) {
                        key.match(pattern) && (delete instance._ce[key]);
                    }
                );
            }
            else {
                instance._ce.each(
                    function(value, key, object) {
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
                e.target = (payload && payload.target) || emitter; // make it possible to force a specific e.target
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
            // then we reset e.target to its original:
            e.sourceTarget && (e.target=e.sourceTarget);
            if (customEventDefinition && !e.status.halted) {
                // now invoke defFn
                e.returnValue = e.status.defaultPrevented ?
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
         ._setEventObjProperty('preventRender', function(reason) {this.status.ok || this._unRenderPreventable || (this.status.renderPrevented = (reason || true));});

    return Event;
}));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"js-ext/lib/function.js":33,"js-ext/lib/object.js":34,"polyfill/polyfill-base.js":50}],22:[function(require,module,exports){
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
},{"./index.js":24}],23:[function(require,module,exports){
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

var NAME = '[event-listener]: ',
    Event = require('./index.js');

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
},{"./index.js":24}],24:[function(require,module,exports){
module.exports = require('./event-base.js');
require('./event-emitter.js');
require('./event-listener.js');
},{"./event-base.js":21,"./event-emitter.js":22,"./event-listener.js":23}],25:[function(require,module,exports){

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
    REQUEST_TIMEOUT = 'Request-timeout',
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

    var IO = require('./io.js')(window),

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

    readyHandleXDR = function(xhr, promise, headers, method) {
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

    return IO;
};

},{"./io.js":29,"xmldom":3}],26:[function(require,module,exports){
"use strict";

var NAME = '[io-stream]: ',
    UNKNOW_ERROR = 'Unknown XDR-error', // XDR doesn't specify the error
    INVALID_DATA = 'invalid data',
    REQUEST_TIMEOUT = 'Request-timeout';

module.exports = function (window) {

    var IO = require('./io.js')(window),

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
    _setStreamHeader = function(xhr, promise, headers, method) {
        if (xhr._isStream && !xhr._isXDR) {
            console.log(NAME, '_setStreamHeader');
            xhr.setRequestHeader('X-Stream', 'true');
        }
    };

    IO._xhrList.push(_entendXHR);
    IO._xhrInitList.push(_readyHandleXDR);
    IO._xhrInitList.push(_progressHandle);
    IO._xhrInitList.push(_setStreamHeader);

    return IO;
};
},{"./io.js":29}],27:[function(require,module,exports){
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

require('polyfill/lib/json.js');
require('js-ext/lib/string.js');

var NAME = '[io-transfer]: ',
    REVIVER = function(key, value) {
        return ((typeof value==='string') && value.toDate()) || value;
    },
    MIME_JSON = 'application/json',
    CONTENT_TYPE = 'Content-Type',
    DELETE = 'delete',
    REGEXP_ARRAY = /^( )*\[/,
    REGEXP_OBJECT = /^( )*{/,
    REGEXP_REMOVE_LAST_COMMA = /^(.*),( )*$/,
    entendXHR;

module.exports = function (window) {

    var IO = require('./io.js')(window),

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
        var isarray, isobject, isstring, parialdata, regexpcomma, followingstream;
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

    return IO;
};
},{"./io.js":29,"js-ext/lib/string.js":36,"polyfill/lib/json.js":44}],28:[function(require,module,exports){
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

    var IO = require('./io.js')(window),

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

    return IO;
};
},{"./io.js":29,"js-ext":31}],29:[function(require,module,exports){
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
},{"js-ext":31,"polyfill/polyfill-base.js":50}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
require('./lib/function.js');
require('./lib/object.js');
require('./lib/string.js');
require('./lib/array.js');
require('./lib/promise.js');
},{"./lib/array.js":32,"./lib/function.js":33,"./lib/object.js":34,"./lib/promise.js":35,"./lib/string.js":36}],32:[function(require,module,exports){
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

(function(ArrayPrototype) {
    /**
     * Shuffles the items in the Array randomly
     *
     * @method shuffle
     * @chainable
     */
    Array.shuffle || (ArrayPrototype.shuffle=function () {
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
}(Array.prototype));
},{}],33:[function(require,module,exports){
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
defineProperty(Object.prototype, 'createClass', function (constructor, prototype) {
	return Function.prototype.subClass.apply(this, arguments);
});
},{"polyfill/polyfill-base.js":50}],34:[function(require,module,exports){
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
   };

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

var _each = function (obj, fn, context) {
    var keys = Object.keys(obj),
        l = keys.length,
        i = -1,
        key;
    while (++i < l) {
        key = keys[i];
        fn.call(context, obj[key], key, obj);
    }
    return obj;
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
},{"polyfill/polyfill-base.js":50}],35:[function(require,module,exports){
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

require('polyfill/polyfill-base.js');
require('polyfill/lib/promise.js');
require('ypromise');

var NAME = '[promise-ext]: ',
    ARRAY_EXPECTED = ' expects an array of values or promises', // include leading space!
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
     */
    PromisePrototype.finally = function (finallyback) {
        console.log(NAME, 'finally');
        this.then(finallyback, finallyback);
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
    return new Promise(function (fulfill, reject) {
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
        if (!finished) {
            console.log('NAME, manage.callback is invoked');
            callbackFn && callbackFn.apply(undefined, arguments);
        }
    };

    promise.setCallback = function (newCallbackFn) {
        callbackFn = newCallbackFn;
    };

    return promise;
};

},{"polyfill/lib/promise.js":49,"polyfill/polyfill-base.js":50,"ypromise":6}],36:[function(require,module,exports){
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
        PATTERN_EMAIL = new RegExp('^[\\w!#$%&\'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&\'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$'),
        PATTERN_URLEND = '[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+(/[\\w-]+)*',
        PATTERN_URLHTTP = new RegExp('^(http://)?'+PATTERN_URLEND),
        PATTERN_URLHTTPS = new RegExp('^https://'+PATTERN_URLEND),
        PATTERN_URL = new RegExp('^(https?://)?'+PATTERN_URLEND),
        PATTERN_INTEGER = /^(([-]?[1-9][0-9]*)|0)$/,
        PATTERN_FLOAT_START = '^[-]?(([1-9][0-9]*)|0)(\\',
        PATTERN_FLOAT_END = '[0-9]+)?$',
        PATTERN_FLOAT_COMMA = new RegExp(PATTERN_FLOAT_START + ',' + PATTERN_FLOAT_END),
        PATTERN_FLOAT_DOT = new RegExp(PATTERN_FLOAT_START + '.' + PATTERN_FLOAT_END),
        PATTERN_HEX_COLOR_HASHALPHA = /^#[0-9A-F]{4}([0-9A-F]{4})?$/,
        PATTERN_HEX_COLOR_HASH = /^#[0-9A-F]{3}([0-9A-F]{3})?$/,
        PATTERN_HEX_COLOR_ALPHA = /^[0-9A-F]{4}([0-9A-F]{4})?$/,
        PATTERN_HEX_COLOR = /^[0-9A-F]{3}([0-9A-F]{3})?$/;

    /**
     * Checks if the string ends with the value specified by `test`
     *
     * @method endsWith
     * @param test {String} the string to test for
     * @param [caseInsensitive=false] {Boolean} whether to ignore case-sensivity
     * @return {Boolean} whether the string ends with `test`
     */
    String.endsWith || (StringPrototype.endsWith=function(test, caseInsensitive) {
        return this.test(test+'$', caseInsensitive ? 'i': '');
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
        return this.test('^'+test, caseInsensitive ? 'i': '');
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
     * @param [options] {Object}
     * @param [options.hashtag=false] {Boolean} whether the hashtag should be part of the String
     * @param [options.alpha=false] {Boolean} whether to accept alpha transparancy
     * @return {Boolean} whether the String's value is a valid hexadecimal color.
     */
    StringPrototype.validateHexaColor = function(options) {
        var instance = this;
        options || (options={});
        if (options.hashtag) {
            return options.alpha ? PATTERN_HEX_COLOR_HASHALPHA.test(instance) : PATTERN_HEX_COLOR_HASH.test(instance);
        }
        else {
            return options.alpha ? PATTERN_HEX_COLOR_ALPHA.test(instance) : PATTERN_HEX_COLOR.test(instance);
        }
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

},{}],37:[function(require,module,exports){
(function (global){
if (!Array.filter) {
    (function (global) {
        "use strict";
        Array.prototype.filter = function filter(callback, scope) {
            var array = this,
                arrayB = [],
                length = array.length,
                element, index;

            for (index = 0; index<length; ++index) {
                element = array[index];
                if (callback.call(scope || global, element, index, array)) {
                    arrayB.push(element);
                }
            }

            return arrayB;
        };
    }(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this));
}



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],38:[function(require,module,exports){
(function (global){
if (!Array.forEach) {
    (function (global) {
        "use strict";
        Array.prototype.forEach = function forEach(callback, scope) {
            var array = this,
                length = array.length,
                index = 0;
            for (index = 0; index<length; ++index) {
                callback.call(scope || global, array[index], index, array);
            }
        };
    }(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this));
}



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],39:[function(require,module,exports){
"use strict";

Array.prototype.indexOf || (Array.prototype.indexOf=function indexOf(searchElement) {
    var array = this,
        length = array.length,
        index = 0;
    for (index = 0; index < length; ++index) {
        if (array[index] === searchElement) {
            return index;
        }
    }
    return -1;
});
},{}],40:[function(require,module,exports){
"use strict";

Array.isArray || (Array.isArray = function isArray(array) {
    return array && Object.prototype.toString.call(array) === '[object Array]';
});

},{}],41:[function(require,module,exports){
(function (global){
if (!Array.some) {
    (function (global) {
        "use strict";
        Array.prototype.some = function some(callback, scope) {
            var array = this,
                length = array.length,
                index = 0;
            for (index = 0; index<length; ++index) {
                if (callback.call(scope || global, array[index], index, array)) {
                    break;
                }
            }
            return (index === length);
        };
    }(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this));
}



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],42:[function(require,module,exports){
"use strict";

// based upon https://gist.github.com/amannm/4965459
module.exports = function (window) {
    window.CSSStyleDeclaration && (function(CSSStyleDeclarationPrototype) {
        CSSStyleDeclarationPrototype.opacity || Object.defineProperty(CSSStyleDeclarationPrototype, 'opacity', {
            get: function() {
                return '' + (parseFloat(((this.filter).substring(48)).replace(')', '')) / 100);
            },
            set: function(value) {
                this.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + Math.round(100 * value) + ')';
            }
        });
    }(window.CSSStyleDeclaration.prototype));
};
},{}],43:[function(require,module,exports){
"use strict";

// based upon https://gist.github.com/jonathantneal/3062955
module.exports = function (window) {
    window.Element && (function(ElementPrototype) {
        ElementPrototype.matchesSelector = ElementPrototype.matchesSelector ||
        ElementPrototype.mozMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        ElementPrototype.oMatchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        function (selector) {
            var node = this,
                nodes = (node.parentNode || window.document).querySelectorAll(selector),
                i = -1;
            while (nodes[++i] && (nodes[i] !== node));
            return !!nodes[i];
        };
    }(window.Element.prototype));
};
},{}],44:[function(require,module,exports){
(function (global){
(function (global) {
    "use strict";

    if (!global.JSON) {
        (function() {
            var toString = Object.prototype.toString,
                hasOwnProperty = Object.prototype.hasOwnProperty,
                LEFT_CURLY = '{',
                RIGHT_CURLY = '}',
                COLON = ':',
                LEFT_BRACE = '[',
                RIGHT_BRACE = ']',
                COMMA = ',',
                tokenType = {
                    PUNCTUATOR: 1,
                    STRING: 2,
                    NUMBER: 3,
                    BOOLEAN: 4,
                    NULL: 5
                },
                tokenMap = {
                    '{': 1, '}': 1, '[': 1, ']': 1, ',': 1, ':': 1,
                    '"': 2,
                    't': 4, 'f': 4,
                    'n': 5
                },
                escChars = {
                    'b': '\b',
                    'f': '\f',
                    'n': '\n',
                    'r': '\r',
                    't': '\t',
                    '"': '"',
                    '\\': '\\',
                    '/': '/'
                },
                tokenizer = /^(?:[{}:,\[\]]|true|false|null|"(?:[^"\\\u0000-\u001F]|\\["\\\/bfnrt]|\\u[0-9A-F]{4})*"|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/,
                whiteSpace = /^[\t ]+/,
                lineTerminator = /^\r?\n/;

            function JSONLexer(JSONStr) {
                this.line = 1;
                this.col = 1;
                this._tokLen = 0;
                this._str = JSONStr;
            }

            JSONLexer.prototype = {
                getNextToken: function () {
                    var
                    str = this._str,
                    token, type;

                    this.col += this._tokLen;

                    if (!str.length) {
                        return 'END';
                    }

                    token = tokenizer.exec(str);

                    if (token) {
                        type = tokenMap[token[0].charAt(0)] || tokenType.NUMBER;
                    } else if ((token = whiteSpace.exec(str))) {
                        this._tokLen = token[0].length;
                        this._str = str.slice(this._tokLen);
                        return this.getNextToken();
                    } else if ((token = lineTerminator.exec(str))) {
                        this._tokLen = 0;
                        this._str = str.slice(token[0].length);
                        this.line++;
                        this.col = 1;
                        return this.getNextToken();
                    } else {
                        this.error('Invalid token');
                    }

                    this._tokLen = token[0].length;
                    this._str = str.slice(this._tokLen);

                    return {
                        type: type,
                        value: token[0]
                    };
                },

                error: function (message, line, col) {
                    var err = new SyntaxError(message);

                    err.line = line || this.line;
                    err.col = col || this.col;

                    throw err;
                }
            };

            function JSONParser(lexer) {
                this.lex = lexer;
            }

            JSONParser.prototype = {
                parse: function () {
                    var lex = this.lex, jsValue = this.getValue();

                    if (lex.getNextToken() !== 'END') {
                        lex.error('Illegal token');
                    }

                    return jsValue;
                },
                getObject: function () {
                    var
                    jsObj = {},
                    lex = this.lex,
                    token, tval, prop,
                    line, col,
                    pairs = false;

                    while (true) {
                        token = lex.getNextToken();
                        tval = token.value;

                        if (tval === RIGHT_CURLY) {
                            return jsObj;
                        }

                        if (pairs) {
                            if (tval === COMMA) {
                                line = lex.line;
                                col = lex.col - 1;
                                token = lex.getNextToken();
                                tval = token.value;
                                if (tval === RIGHT_CURLY) {
                                    lex.error('Invalid trailing comma', line, col);
                                }
                            }
                            else {
                                lex.error('Illegal token where expect comma or right curly bracket');
                            }
                        }
                        else if (tval === COMMA) {
                            lex.error('Invalid leading comma');
                        }

                        if (token.type != tokenType.STRING) {
                            lex.error('Illegal token where expect string property name');
                        }

                        prop = this.getString(tval);

                        token = lex.getNextToken();
                        tval = token.value;

                        if (tval != COLON) {
                            lex.error('Illegal token where expect colon');
                        }

                        jsObj[prop] = this.getValue();
                        pairs = true;
                    }
                },
                getArray: function () {
                    var
                    jsArr = [],
                    lex = this.lex,
                    token, tval,
                    line, col,
                    values = false;

                    while (true) {
                        token = lex.getNextToken();
                        tval = token.value;

                        if (tval === RIGHT_BRACE) {
                            return jsArr;
                        }

                        if (values) {
                            if (tval === COMMA) {
                                line = lex.line;
                                col = lex.col - 1;
                                token = lex.getNextToken();
                                tval = token.value;

                                if (tval === RIGHT_BRACE) {
                                    lex.error('Invalid trailing comma', line, col);
                                }
                            } else {
                                lex.error('Illegal token where expect comma or right square bracket');
                            }
                        } else if (tval === COMMA) {
                            lex.error('Invalid leading comma');
                        }

                        jsArr.push(this.getValue(token));
                        values = true;
                    }
                },
                getString: function (strVal) {
                    return strVal.slice(1, -1).replace(/\\u?([0-9A-F]{4}|["\\\/bfnrt])/g, function (match, escVal) {
                        return escChars[escVal] || String.fromCharCode(parseInt(escVal, 16));
                    });
                },
                getValue: function(fromToken) {
                    var lex = this.lex,
                        token = fromToken || lex.getNextToken(),
                        tval = token.value;
                    switch (token.type) {
                        case tokenType.PUNCTUATOR:
                            if (tval === LEFT_CURLY) {
                                return this.getObject();
                            } else if (tval === LEFT_BRACE) {
                                return this.getArray();
                            }

                            lex.error('Illegal punctoator');

                            break;
                        case tokenType.STRING:
                            return this.getString(tval);
                        case tokenType.NUMBER:
                            return Number(tval);
                        case tokenType.BOOLEAN:
                            return tval === 'true';
                        case tokenType.NULL:
                            return null;
                        default:
                            lex.error('Invalid value');
                    }
                }
            };

            function filter(base, prop, value) {
                if (typeof value === 'undefined') {
                    delete base[prop];
                    return;
                }
                base[prop] = value;
            }

            function walk(holder, name, rev) {
                var val = holder[name], i, len;

                if (toString.call(val).slice(8, -1) === 'Array') {
                    for (i = 0, len = val.length; i < len; i++) {
                        filter(val, i, walk(val, i, rev));
                    }
                } else if (typeof val === 'object') {
                    for (i in val) {
                        if (hasOwnProperty.call(val, i)) {
                            filter(val, i, walk(val, i, rev));
                        }
                    }
                }

                return rev.call(holder, name, val);
            }

            function pad(value, length) {
                value = String(value);

                return value.length >= length ? value : new Array(length - value.length + 1).join('0') + value;
            }

            global.prototype.JSON = {
                parse: function (JSONStr, reviver) {
                    var jsVal = new JSONParser(new JSONLexer(JSONStr)).parse();

                    if (typeof reviver === 'function') {
                        return walk({
                            '': jsVal
                        }, '', reviver);
                    }

                    return jsVal;
                },
                stringify: function () {
                    var
                    value = arguments[0],
                    replacer = typeof arguments[1] === 'function' ? arguments[1] : null,
                    space = arguments[2] || '',
                    spaceSpace = space ? ' ' : '',
                    spaceReturn = space ? '\n' : '',
                    className = toString.call(value).slice(8, -1),
                    array, key, hasKey, index, length, eachValue;

                    if (value === null || className === 'Boolean' || className === 'Number') {
                        return value;
                    }

                    if (className === 'Array') {
                        array = [];

                        for (length = value.length, index = 0, eachValue; index < length; ++index) {
                            eachValue = replacer ? replacer(index, value[index]) : value[index];
                            eachValue = this.stringify(eachValue, replacer, space);

                            if (eachValue === undefined || eachValue === null) {
                                eachValue = 'null';
                            }

                            array.push(eachValue);
                        }

                        return '[' + spaceReturn + array.join(',' + spaceReturn).replace(/^/mg, space) + spaceReturn + ']';
                    }

                    if (className === 'Date') {
                        return '"' + value.getUTCFullYear() + '-' +
                        pad(value.getUTCMonth() + 1, 2)     + '-' +
                        pad(value.getUTCDate(), 2)          + 'T' +
                        pad(value.getUTCHours(), 2)         + ':' +
                        pad(value.getUTCMinutes(), 2)       + ':' +
                        pad(value.getUTCSeconds(), 2)       + '.' +
                        pad(value.getUTCMilliseconds(), 3)  + 'Z' + '"';
                    }

                    if (className === 'String') {
                        return '"' + value.replace(/"/g, '\\"') + '"';
                    }

                    if (typeof value === 'object') {
                        array = [];
                        hasKey = false;

                        for (key in value) {
                            if (hasOwnProperty.call(value, key)) {
                                eachValue = replacer ? replacer(key, value[key]) : value[key];
                                eachValue = this.stringify(eachValue, replacer, space);

                                if (eachValue !== undefined) {
                                    hasKey = true;

                                    array.push('"' + key + '":' + spaceSpace + eachValue);
                                }
                            }
                        }

                        if (!hasKey) {
                            return '{}';
                        } else {
                            return '{' + spaceReturn + array.join(',' + spaceReturn).replace(/^/mg, space) + spaceReturn + '}';
                        }
                    }
                }
            };
        }());
    }
})(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],45:[function(require,module,exports){
"use strict";
var DOCUMENT_POSITION_CONTAINED_BY = 16;
module.exports = function (window) {
    window.Node && !window.Node.prototype.contains && (function(NodePrototype) {
        NodePrototype.contains = function(child) {
            var comparison = this.compareDocumentPosition(child);
            return !!((comparison===0) || (comparison & DOCUMENT_POSITION_CONTAINED_BY));
        };
    }(window.Node.prototype));
};
},{}],46:[function(require,module,exports){
"use strict";

Object.create || (Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
});
},{}],47:[function(require,module,exports){
"use strict";

// In Internet Explorer 8 Object.defineProperty only accepts DOM objects
// otherwise it throws an error

try {
    Object.defineProperty({}, 'a', {value: 0});
}
catch(err) {
    // failed: so we're in IE8
    (function() {
        var defineProperty = Object.defineProperty;
        Object.defineProperty = function (object, property, descriptor) {
            delete descriptor.configurable;
            delete descriptor.enumerable;
            delete descriptor.writable;
            try {
                return defineProperty(object, property, descriptor);
            }
            catch(err) {
                object[property] = descriptor.value;
            }
        };
    }());
}

Object.defineProperties || (Object.defineProperties=function defineProperties(object, descriptors) {
    var property;
    for (property in descriptors) {
        Object.defineProperty(object, property, descriptors[property]);
    }
    return object;
});
},{}],48:[function(require,module,exports){
"use strict";

if (!Object.keys) {
    var hasOwnProp = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    Object.keys = function(obj) {
        var result = [], prop, i;

        for (prop in obj) {
            if (hasOwnProp.call(obj, prop)) {
                result.push(prop);
            }
        }

        if (hasDontEnumBug) {
            for (i = 0; i < dontEnumsLength; i++) {
                if (hasOwnProp.call(obj, dontEnums[i])) {
                    result.push(dontEnums[i]);
                }
            }
        }
        return result;
    };
}
},{}],49:[function(require,module,exports){
require('ypromise');
},{"ypromise":6}],50:[function(require,module,exports){
require('./lib/array.filter.js');
require('./lib/array.foreach.js');
require('./lib/array.indexof.js');
require('./lib/array.isarray.js');
require('./lib/array.some.js');
require('./lib/object.create.js');
require('./lib/object.keys.js');
require('./lib/object.defineproperty.js');
require('./lib/css.opacity.js');
},{"./lib/array.filter.js":37,"./lib/array.foreach.js":38,"./lib/array.indexof.js":39,"./lib/array.isarray.js":40,"./lib/array.some.js":41,"./lib/css.opacity.js":42,"./lib/object.create.js":46,"./lib/object.defineproperty.js":47,"./lib/object.keys.js":48}],51:[function(require,module,exports){
require('./polyfill-base.js');
require('./lib/json.js');
require('./lib/promise.js');
},{"./lib/json.js":44,"./lib/promise.js":49,"./polyfill-base.js":50}],52:[function(require,module,exports){
module.exports = {
	idGenerator: require('./lib/idgenerator.js').idGenerator,
	later: require('./lib/timers.js').later,
	async: require('./lib/timers.js').async
};
},{"./lib/idgenerator.js":53,"./lib/timers.js":54}],53:[function(require,module,exports){
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

},{"polyfill/polyfill-base.js":50}],54:[function(require,module,exports){
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
},{"_process":57,"polyfill/polyfill-base.js":50}],55:[function(require,module,exports){
"use strict";

module.exports = function (window) {
    require('./lib/sizes.js')(window);
};
},{"./lib/sizes.js":56}],56:[function(require,module,exports){
"use strict";

module.exports = function (window) {
    var getScrollOffsets = function() {
        var doc = window.document;
        // this works for all browsers in non quircks-mode and only for IE9+:
        if (window.pageXOffset) {
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
        if (window.innerWidth) {
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
},{}],57:[function(require,module,exports){
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

    require('css');
    require('polyfill');
    require('js-ext');
    require('window-ext')(window);
    require('dom-ext')(window);

    var fakedom = window.navigator.userAgent==='fake',
        Event = fakedom ? require('event') : require('event-mobile')(window),
        io_config = {
            // timeout: 3000,
            debug: true,
            base: '/build'
        },
        EVENT_NAME_TIMERS_EXECUTION = 'timers:asyncfunc';

    if (!fakedom) {
        require('event-dom/extra/hover.js')(window);
        require('event-dom/extra/valuechange.js')(window);
        require('event-dom/extra/dragdrop.js')(window);
    }
    /**
     * Reference to the `idGenerator` function in [utils](../modules/utils.html)
     *
     * @property idGenerator
     * @type function
     * @static
    */

    ITSA.merge(require('utils'));
    ITSA.RESERVED_WORDS = require('js-ext/extra/reserved-words.js');

    /**
     * Reference to the [IO](io.html) object
     * @property IO
     * @type Object
     * @static
    */
    ITSA.IO = require('io/io-transfer.js')(window);
    ITSA.IO.config.merge(io_config);
    require('io/io-cors-ie9.js')(window);
    require('io/io-stream.js')(window);
    require('io/io-xml.js')(window);

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
},{"css":9,"dom-ext":11,"event":24,"event-dom/extra/dragdrop.js":17,"event-dom/extra/hover.js":18,"event-dom/extra/valuechange.js":19,"event-mobile":20,"io/io-cors-ie9.js":25,"io/io-stream.js":26,"io/io-transfer.js":27,"io/io-xml.js":28,"js-ext":31,"js-ext/extra/reserved-words.js":30,"node-win":undefined,"polyfill":51,"utils":52,"window-ext":55}]},{},[]);
