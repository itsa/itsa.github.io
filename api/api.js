YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Array",
        "BaseClass",
        "Classes",
        "Constrain",
        "DB",
        "DD",
        "Dialog",
        "Element",
        "ElementArray",
        "Event",
        "Event.Emitter",
        "Event.Listener",
        "FocusManager",
        "Function",
        "HTMLElement",
        "IO",
        "ITSA",
        "Icons",
        "IndexedDB",
        "JSON",
        "LocalStorage",
        "Math",
        "Messages",
        "NS-vdom",
        "Node",
        "NodePlugin",
        "Object",
        "Panel",
        "Promise",
        "SVGElement",
        "Scrollable",
        "Storage",
        "String",
        "USERAGENT",
        "Utils",
        "document",
        "vnode",
        "window"
    ],
    "modules": [
        "attribute-extractor",
        "client-db",
        "client-storage",
        "constrain",
        "dialog",
        "drag",
        "drag-drop",
        "element-array",
        "event",
        "event-blurnode",
        "event-dom",
        "event-emitter",
        "event-focusnode",
        "event-hover",
        "event-listener",
        "event-mobile",
        "extend-document",
        "extend-element",
        "extra/classes.js",
        "focusmanager",
        "html-parser",
        "icons",
        "indexeddb",
        "io",
        "io-assets",
        "io-cors",
        "io-jsonp",
        "io-transfer",
        "io-xml",
        "itsa.build",
        "js-ext",
        "lib/array.js",
        "lib/function.js",
        "lib/json.js",
        "lib/math.js",
        "lib/object.js",
        "lib/promise.s",
        "lib/string.js",
        "localstorage",
        "messages",
        "node-parser",
        "node-plugin",
        "node-win",
        "panel",
        "scrollable",
        "useragent",
        "utils",
        "vdom",
        "vdom-ns",
        "vnode",
        "window-ext"
    ],
    "allModules": [
        {
            "displayName": "attribute-extractor",
            "name": "attribute-extractor",
            "description": "Exports `htmlToVNodes` which transforms html-text into vnodes.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n<br>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "client-db",
            "name": "client-db",
            "description": "Creating floating Panel-nodes which can be shown and hidden.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "client-storage",
            "name": "client-storage",
            "description": "Creating floating Panel-nodes which can be shown and hidden.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "constrain",
            "name": "constrain",
            "description": "Plugin making moveable elements to constrain within\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "dialog",
            "name": "dialog",
            "description": "Defines a dialog-panel to display messages.\nEvery message that fulfills will get the dialog-content as well as the pressed button as return.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "drag",
            "name": "drag",
            "description": "Provides `drag and drop` functionality, without dropzones.\nFor `dropzone`-support, you should use the module: `drag-drop`.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "drag-drop",
            "name": "drag-drop",
            "description": "Provides `drag and drop` functionality with dropzones\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "element-array",
            "name": "element-array",
            "description": "Extends Array into an array with special utility-methods that can be applied upon its members.\nThe membres should be vElement's\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n<br>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "event",
            "name": "event",
            "description": "Defines the Event-Class, which should be instantiated to get its functionality\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "event-blurnode",
            "name": "event-blurnode",
            "description": "Adds the `blurnode` event as a DOM-event to event-dom. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
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
            "displayName": "event-focusnode",
            "name": "event-focusnode",
            "description": "Adds the `focusnode` event as a DOM-event to event-dom. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
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
            "displayName": "extend-document",
            "name": "extend-document",
            "description": "Provides several methods that override native document-methods to work with the vdom.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n<br>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "extend-element",
            "name": "extend-element",
            "description": "Provides several methods that override native Element-methods to work with the vdom.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n<br>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "extra/classes.js",
            "name": "extra_classes.js",
            "description": "Pollyfils for often used functionality for Functions\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n New BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "focusmanager",
            "name": "focusmanager",
            "description": "<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n New BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "html-parser",
            "name": "html-parser",
            "description": "Exports `htmlToVNodes` which transforms html-text into vnodes.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n<br>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "icons",
            "name": "icons",
            "description": "Creating floating Panel-nodes which can be shown and hidden.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "indexeddb",
            "name": "indexeddb",
            "description": "Creating floating Panel-nodes which can be shown and hidden.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
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
            "displayName": "lib/function.js",
            "name": "lib_function.js",
            "description": "Pollyfils for often used functionality for Functions\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n New BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "lib/json.js",
            "name": "lib_json.js",
            "description": "Pollyfils for often used functionality for Arrays\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n New BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "lib/math.js",
            "name": "lib_math.js",
            "description": "Extension of Math\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n New BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
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
            "displayName": "localstorage",
            "name": "localstorage",
            "description": "Creating floating Panel-nodes which can be shown and hidden.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "messages",
            "name": "messages",
            "description": "Creating floating Panel-nodes which can be shown and hidden.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "node-parser",
            "name": "node-parser",
            "description": "Exports `domNodeToVNode` which transforms dom-nodes into vnodes.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i><br>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "node-plugin",
            "name": "node-plugin",
            "description": "Basic NodePlugin Class for plugin's on HTMLElements.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "node-win",
            "name": "node-win",
            "description": "Emulation of browser `window` and `dom`. Just enough to make ITSA work.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "panel",
            "name": "panel",
            "description": "Creating floating Panel-nodes which can be shown and hidden.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "scrollable",
            "name": "scrollable",
            "description": "Plugin to create scrollable divs\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "useragent",
            "name": "useragent",
            "description": "<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n New BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "utils",
            "name": "utils",
            "description": "Collection of various utility functions.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "vdom",
            "name": "vdom"
        },
        {
            "displayName": "vdom-ns",
            "name": "vdom-ns",
            "description": "Creates a Namespace that can be used accros multiple vdom-modules to share information.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n<br>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "vnode",
            "name": "vnode",
            "description": "Delivers the `vnode` prototype object, which is a virtualisation of an `Element` inside the Dom.\nThese Elements work smoothless with the vdom (see ...).\n\nvnodes are much quicker to access and walk through than native dom-nodes. However, this is a module you don't need\nby itself: `Element`-types use these features under the hood.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\n<br>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        },
        {
            "displayName": "window-ext",
            "name": "window-ext",
            "description": "Creating floating Panel-nodes which can be shown and hidden.\n\n\n<i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>\nNew BSD License - http://choosealicense.com/licenses/bsd-3-clause/"
        }
    ]
} };
});