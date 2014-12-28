---
module: vdom
functionality: node-plugins
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

The `vdom`-module adds support for `node-plugins`, which can be plugged in into every Element. These plugins enchance the behaviour of the Element. DOM-nodes (only Elements) accept plugins by using the next 3 Element-methods:

* plug
* unplug
* hasPlugin

Whenever a `node-plugin` is active, it adds extra `attributes` to the Element, identifying the plugin is active - and optionally extra attributes for additional parameters. All node-plugin's work in a way that these attributes controll the state of the plugin. Thus, you could change the attributes instead of using the plugin-methods mentioned above. The plugin will just do its work, asuming its module is loaded.


##Using plugins##

A plugin can be set on a Node (only Element), by using `Element.plugin`:

####Example plugin without options####
```js
var myNode = document.getElement('#mynode');
myNode.plug(ITSA.Plugins.NodeConstrain);
// will constrain repositioning to the window
```

This leads into a HTML like this:

```html
<div xy-constrain="window"></div>
```

####Example plugin with options####
```js
var myNode = document.getElement('#mynode');
myNode.plug(ITSA.Plugins.NodeConstrain, {selector: '#container'});
// will constrain repositioning to the node with id=`container`
```

This leads into a HTML like this:

```html
<div xy-constrain="#container"></div>
```

Or in relation with the rest of the page:

```html
<div id="container">
    <div xy-constrain="#container"></div>
</div>
```


##Creating a plugin-Class##

A plugin-Class is created by extending ITSA.Plugins.NodePlugin, where the initiliser is important: here you define all the properties of the plugin --> these will be rendered as Node-attributes. See the code of the constrained plugin:

####Samplecode of the NodeConstrain plugin####
```js
ITSA.Plugins.NodeConstrain = ITSA.Plugins.NodePlugin.subClass(
    function (config) {
        this['xy-constrain'] = (config && config.selector) || 'window';
    }
);
```


##Available plugins##

The vdom comes with one Node-plugin:

###ITSA.Plugins.NodeConstrain###