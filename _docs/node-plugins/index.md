---
module: node-plugin
itsaclassname:
version: 0.0.1
modulesize: 1.69
dependencies: "polyfill"
maintainer: Marco Asbreuk
title: Node Plugins
intro: "Enhancing Elements with node-plugins, which are basicly just extra attributes working together with modulecode."
firstpar: get-started
---



#The Basics#

`node-plugins` can be plugged in into every Element. These plugins enchance the behaviour of the Element. A plugin can be plugged in or unplugged: it makes no sense to plug the same plugin multiple times on the same Element. DOM-nodes (only Elements) get 5 extra plugin-methods available:

* `plug` - plugs in a node-plugin
* `unplug` - unplugs a node plugin
* `isPlugged` {Boolean} - whether a plugin is plugged in
* pluginReady {Promise} - fulfills when a plugin is ready
* getPlugin {Promise} - returns a plugin as soon as it is ready to use

Every `plugin` has an unique `pluginName`. This name is used in conjunction with the methods above.

Whenever a `node-plugin` is active, its `plugin` is an instance that is available and plugin.model can be used to control its state (see later). Whenever a plugin is initialized, the attribute `pluginName-ready="true"` is set.

Plugin-instances all have a `model`-property: this property controlls the plugin.

Plugin-instances have a property `host` that equals the host-node (Element) where the plugin was plugged in.

When initialized, the plugin gets configured by these objects: `config`, `attributes`, `default`, in these order.



#Usage#

##Activate plugins##

A plugin can be set on a Node (only Element), by 2 ways: using Element.plug(pluginName) or by setting its html plugin-attribute.

###using plug()###
By using Element.`plug()`, a plugin gets plugged. You need to pass the pluginName as an argument (every plugin has its unique pluginName). When plugged in, optionally you can pass options, or an object that should serve as the plugin's `model`.

When using `plugin`, the plugins `model` gets returned and is ready to be used right away (the plugin is initialized).

####Example plugin without options####
```js
var myNode = document.getElement('#mynode'),
    plugin;

plugin = myNode.plug('constrain`);
// will constrain repositioning to the window
```

This leads into a HTML like this:

```html
<div id="#mynode" plugin-constrain="true" constrain-ready="true" constrain-selector="window"></div>
```

####Example plugin with options####
```js
var myNode = document.getElement('#mynode'),
    plugin;

plugin = myNode.plug('constrain', {selector: '#container'});
// will constrain repositioning to the node with id=`container`
```

This leads into a HTML like this:

```html
<div id="mynode" plugin-constrain="true" constrain-ready="true" constrain-selector="#container"></div>
```

Or in relation with the rest of the page:

```html
<div id="container">
    <div id="mynode" plugin-constrain="true" constrain-ready="true" constrain-selector="#container"></div>
</div>
```

####Example plugin with model-object####
```js
var myNode = document.getElement('#mynode'),
    plugin,
    model = {selector: '#container'};

plugin = myNode.plug('constrain', null, model);
// plugin.model === model
```

###using html###

By setting the right html-attribute, a plugin can be plugged as well. This way, it can be set up serverside (which also can be done by serverside plug-in rendering).

Note that the `vdom` will notify plugins this way and initialize them, yet you must be aware that retrieving its model can only be done when initialization has finished. Thus, to retrieve the plugin's model, you need to use `getPlugin()`.

####Example plugin by html####
```html
<div id="mynode" plugin-constrain="true"></div>
```

This will render HTML like this:

```html
<div id="mynode" plugin-constrain="true" constrain-ready="true" constrain-selector="window"></div>
```

Using javascript to control access the plugin:

```js
var myNode = document.getElement('#mynode');

myNode.getPlugin('constrain').then(function(plugin) {
    // plugin is available
});
// will constrain repositioning to the node with id=`container`
```

Which leads into a changing the HTML into this:

```html
<div id="mynode" plugin-constrain="true" constrain-ready="true" constrain-selector="#container"></div>
```


##Plugin state and attributes##

The state of the plugin is defined my its `model`-property. Changing members of this property will lead into updte its state and its bound attributes. Ever plugin has specific attributes: like said: they are controlled by `model`. Yet, these attributes are also used to **setup the plugins initial state**.

####Example initial state by html####
```html
<div id="mynode" plugin-constrain="true" constrain-selector="#container"></div>
```

This will render HTML like this:

```html
<div id="mynode" plugin-constrain="true" constrain-ready="true" constrain-selector="window"></div>
```

And will set the plugin's model.selector property:

```js
var myNode = document.getElement('#mynode');

myNode.getPlugin('constrain').then(function(plugin) {
    // plugin.model.selector === '#container'
});
```

####Example changing state####
```html
<div id="mynode" plugin-constrain="true" constrain-selector="#container"></div>
```

This will render HTML like this:

```html
<div id="mynode" plugin-constrain="true" constrain-ready="true" constrain-selector="window"></div>
```

Using javascript to control its model:

```js
var myNode = document.getElement('#mynode');

myNode.getPlugin('constrain').then(function(plugin) {
    // changing the selector:
    plugin.model.selector = '#container';
});
// will constrain repositioning to the node with id=`container`
```

Which leads into a changing the HTML into this:

```html
<div id="mynode" plugin-constrain="true" constrain-ready="true" constrain-selector="#container"></div>
```


#Developing plugins#

Plugins are Classes which gets initiated when plugged in. A new plugin is created by using the method `document.definePlugin()`, which accepts 3 argments:

* pluginName {String} unique plugin-name
* constructor {Function} constructor-function which gets invoked on every initialization
* prototypes {Object} set of Class-members


####Samplecode of the constrain plugin####
```js
document.definePlugin('constrain', null, {
        attrs: {
            selector: 'string'
        },
        defaults: {
            selector: 'window'
        }
    }
);
```

An existing plugin can be extended using `Plugin.subClass()` which accepts the same 3 arguments. You can retrieve the original Class by using `document.getPluginClass()`, which needs the pluginName of the original Class as argument.

####Example extending Plugin-Class####
```js
var ConstrainPlugin = document.getPluginClass('constrain');

ConstrainPlugin.subClass('myconstrain', null, {
        attrs: {
            anotherselector: 'string'
        }
    }
);
```

##Plugin-constructor##
Use the constructor to setup any initial stuff needed by the plugin-instance.

##Prototype members of Plugins##

When define a Plugin-Class, you can set any prototype-members you want. But, **every Plugin-Class** has some important members by default with specific features:

###attrs###
This is an object where the keys are the attribute-names and the values specify the `type` in which the property will occur on `plugin.model`. The properties defined here, appear in the html as: **pluginName-property**.

These are special, because during initialisation, any attributes that are pre-set on the nodes will be read into pluing.model.


###defaults###
You can specify the default-values of some (or all) properties that are defined with `attrs`.

###render###
Used to render anything inside the host-node. It is highly advisable to create nodes by using `host.addSystemElement()` instead of host.append(), because system-nodes retain even when the host is filled with new content.

Not all plugins need to render anything inside the hostnode. F.e. `drag` does not, but `scroll` does.

###sync###
Use this method to define how the plugin will sync whenever `plugin.model` changes. The `sync`-method gets invoked on every change of `plugin.model`. You do not need to syc any attribute defined by attrs --> they get synced automaticly.

###destoy###
Use this method to cleanup anything needed, fe removal of the nodes that were created using `render()`, or anything to prevent memoryleaks.

The `destroy()`-method gets invoked whenever a plugin gets unplugged or when its host-node gets removed from the dom.