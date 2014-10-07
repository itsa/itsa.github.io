YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Array",
        "Element",
        "Event",
        "Event.Emitter",
        "Event.Listener",
        "Function",
        "IO",
        "ITSA",
        "NodeList",
        "Object",
        "Promise",
        "String",
        "Utils",
        "document",
        "window"
    ],
    "modules": [
        "dom-ext",
        "event",
        "event-dom",
        "event-emitter",
        "event-hover",
        "event-listener",
        "event-mobile",
        "io",
        "io-assets",
        "io-cors",
        "io-jsonp",
        "io-transfer",
        "io-xml",
        "itsa.build",
        "js-ext",
        "lib/array.js",
        "lib/document.js",
        "lib/element.js",
        "lib/function.js",
        "lib/nodelist.js",
        "lib/object.js",
        "lib/promise.s",
        "lib/string.js",
        "node-win",
        "utils"
    ],
    "allModules": [
        {
            "displayName": "dom-ext",
            "name": "dom-ext"
        },
        {
            "displayName": "event",
            "name": "event",
            "description": "Defines the Event-Class, which should be instantiated to get its functionality\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "event-dom",
            "name": "event-dom",
            "description": "Integrates DOM-events to event. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "event-emitter",
            "name": "event-emitter",
            "description": "Extends the Event-instance by adding the method `Emitter` to it.\nThe `Emitter-method` returns an object that should be merged into any Class-instance or object you\nwant to extend with the emit-methods, so the appropriate methods can be invoked on the instance.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/\n\n\nShould be called using  the provided `extend`-method like this:"
        },
        {
            "displayName": "event-hover",
            "name": "event-hover",
            "description": "Adds the `hover` event as a DOM-event to event-dom. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\nShould be called using  the provided `mergeInto`-method like this:\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "event-listener",
            "name": "event-listener",
            "description": "Extends the Event-instance by adding the object `Listener` to it.\nThe returned object should be merged into any Class-instance or object you want to\nextend with the listener-methods, so the appropriate methods can be invoked on the instance.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/\n\n\nShould be called using  the provided `extend`-method like this:"
        },
        {
            "displayName": "event-mobile",
            "name": "event-mobile",
            "description": "Integrates mobile-events to event-dom. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "io",
            "name": "io",
            "description": "Provides core IO-functionality.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "io-assets",
            "name": "io-assets",
            "description": "Extends io by adding the method `readXML` to it.\nShould be called using  the provided `mergeInto`-method like this:"
        },
        {
            "displayName": "io-cors",
            "name": "io-cors",
            "description": "Extends io by adding the method `readXML` to it.\nShould be called using  the provided `mergeInto`-method like this:"
        },
        {
            "displayName": "io-jsonp",
            "name": "io-jsonp",
            "description": "Extends io by adding the method `readXML` to it.\nShould be called using  the provided `mergeInto`-method like this:"
        },
        {
            "displayName": "io-transfer",
            "name": "io-transfer",
            "description": "Extends io by adding the method `readXML` to it.\nShould be called using  the provided `mergeInto`-method like this:"
        },
        {
            "displayName": "io-xml",
            "name": "io-xml",
            "description": "Extends io by adding the method `readXML` to it.\nShould be called using  the provided `mergeInto`-method like this:"
        },
        {
            "displayName": "itsa.build",
            "name": "itsa.build",
            "description": "The ITSA module is an aggregator for all the individual modules that the library uses.\nThe developer is free to use it as it is or tailor it to contain whatever modules\nhe/she might need in the global namespace.\n\nThe modules themselves work quite well independent of this module and can be used\nseparately without the need of them being integrated under one globa namespace.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "js-ext",
            "name": "js-ext"
        },
        {
            "displayName": "lib/array.js",
            "name": "lib_array.js",
            "description": "Pollyfils for often used functionality for Arrays\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n New BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "lib/document.js",
            "name": "lib_document.js",
            "description": "Integrates DOM-events to event. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "lib/element.js",
            "name": "lib_element.js",
            "description": "Integrates DOM-events to event. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "lib/function.js",
            "name": "lib_function.js",
            "description": "Pollyfils for often used functionality for Functions\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n New BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "lib/nodelist.js",
            "name": "lib_nodelist.js",
            "description": "Integrates DOM-events to event. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "lib/object.js",
            "name": "lib_object.js",
            "description": "Pollyfils for often used functionality for Objects\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n New BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "lib/promise.s",
            "name": "lib_promise.s",
            "description": "Provides additional Promise-methods. These are extra methods which are not part of the PromiseA+ specification,\nBut are all Promise/A+ compatable.\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "lib/string.js",
            "name": "lib_string.js",
            "description": "Pollyfils for often used functionality for Strings\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n New BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "node-win",
            "name": "node-win",
            "description": "Emulation of browser `window` and `dom`. Just enough to make ITSA work.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "utils",
            "name": "utils",
            "description": "Collection of various utility functions.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        }
    ]
} };
});