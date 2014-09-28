YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Event",
        "Event.Emitter",
        "Event.Listener",
        "Function",
        "IO",
        "ITSA",
        "Object",
        "Promise",
        "Utils",
        "window"
    ],
    "modules": [
        "event",
        "event-dom",
        "event-emitter",
        "event-listener",
        "event-mobile",
        "extend-function",
        "extend-object",
        "extend-promise",
        "io",
        "io-assets",
        "io-cors",
        "io-jsonp",
        "io-transfer",
        "io-xml",
        "itsa.build",
        "js-ext",
        "node-win",
        "utils"
    ],
    "allModules": [
        {
            "displayName": "event",
            "name": "event",
            "description": "Defines the Event-Class, which should be instantiated to get its functionality\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "event-dom",
            "name": "event-dom",
            "description": "Integrates DOM-events to core-event-base. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\nShould be called using  the provided `mergeInto`-method like this:\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "event-emitter",
            "name": "event-emitter",
            "description": "Extends the Event-instance by adding the method `Emitter` to it.\nThe `Emitter-method` returns an object that should be merged into any Class-instance or object you\nwant to extend with the emit-methods, so the appropriate methods can be invoked on the instance.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/\n\n\nShould be called using  the provided `extend`-method like this:"
        },
        {
            "displayName": "event-listener",
            "name": "event-listener",
            "description": "Extends the Event-instance by adding the object `Listener` to it.\nThe returned object should be merged into any Class-instance or object you want to\nextend with the listener-methods, so the appropriate methods can be invoked on the instance.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/\n\n\nShould be called using  the provided `extend`-method like this:"
        },
        {
            "displayName": "event-mobile",
            "name": "event-mobile",
            "description": "Integrates DOM-events to core-event-base. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\nShould be called using  the provided `init`-method like this:\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "extend-function",
            "name": "extend-function",
            "description": "Pollyfils for often used functionality for Functions\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n New BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "extend-object",
            "name": "extend-object",
            "description": "Pollyfils for often used functionality for Objects\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n New BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "extend-promise",
            "name": "extend-promise",
            "description": "Provides additional Promise-methods. These are extra methods which are not part of the PromiseA+ specification,\nBut are all Promise/A+ compatable.\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
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