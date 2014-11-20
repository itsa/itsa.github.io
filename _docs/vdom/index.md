---
module: vdom
itsaclassname:
version: 0.0.1
modulesize: 1.69
dependencies: "polyfill"
maintainer: Marco Asbreuk
title: Virtual DOM
intro: "Proxy for <b>window.document</b> and <b>window.Element</b> which makes working with the DOM ultrafast."
firstpar: get-started
---



#The Basics#

The Virtual DOM gives you an API to manipulate the DOM. Manipulation happens through `document` and `Element`, but everything that happens afterward is handled by the `vnodes`. The whole DOM is virtualised into `vnodes`, where every domNode has a representative `vnode`.

Using the API, you have all native DOM features, but they work ultra-fast. Also, the API is extended with extreme useful methods, making work with the DOM fun again. This Virtual DOM is <u>not a fake-dom</u>, it is just an ultrafast proxylayer.

On the browser, there is no initialisation needed. Just load this module, use any `document` and `Element` method or properties as you were used to (or better, the new ones).

To speed up `DOM-rendering`, the principle of `diffing` is being used, like introduced by Reactjs. However, this Virtual DOM does not need a MVC-system to be operational, though the iView's benefit a lot of the Virtual DOM.



#Virtualising the DOM#

On startup, the complete DOM is virtualised into `vnodes`. These are plain objects with a reference to their domNode. Also the domNode gets a property vnode, which points to the related vnode. Manipulation of the DOM will be handled by these vnodes, which is tremendously faster than the native DOM. Traversing and searching through the vnodes goes ultrafast. Also, manipulating the DOM through vnodes goes by `diffing`.



#About Dom Nodes#

Technically spoken, the DOM consists of three different type of Nodes: Elements, TextNodes and CommentNodes (all virtualised into vnodes). However, you should work with the DOM by thinking of `Elements`. Whenever you query the DOM for a `Node`, you get an Element in return. These Elements are the objects the API returns and by which you can manipulate the DOM.



#Node Plugins#

DOM-nodes accept plugins by using the next 3 Element-methods:

* plug
* unplug
* hasPlugin

Whenever a Nodeplugin is active, it adds extra attributes to the Element, identifying the plugin is active - and optionally extra attributes for additional parameters. All Node-plugin's work in a way that these attributes controll the state of the plugin. Thus, you could change the attributes instead of using the plugin-methods mentioned above. The plugin will just do its work, asuming its module is loaded.


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


#Useful API#

The API is extended with very useful methods (and some properties). Read the full API-documentation for further details. Below is a summary of the API-methods you should use when working with the DOM.

<u>**NOTE:** `Do not use the next setters properties or methods`:</u>

* innerHTML setter
* outerHTML setter
* insertAdjacentElement
* insertAdjacentText
* insertAdjacentHTML

These <u>do work</u>, but they update their vnode's asynchronously. So, if you query the dom withing the same eventcycle, you are likely to get a wrong result. By using the adviced methods (explained below) you don't run into this situation. Moreover, these methods above don't update by using vdom's diffing. Which leads into slower update and problems with Node's disappearing and blurring.


##Element's inner-content##

####methods for manipulation:####
###append###
###prepend###
###setOuterHTML###
###setHTML###
###setText###
###setValue###
###replace###
###remove###
###empty###

####methods for information:####
###getHTML###
###getText###
###getValue###
###getOuterHTML###


##Element's data##

####methods for manipulation:####
###setAttr###
###setInlineStyle###
###defineInlineStyle###
###setId###
###setClass###
###toggleClass###
###replaceClass###
###removeAttr###
###removeInlineStyle###
###removeClass###
###removeId###

####methods for information:####
###getAttr###
###getInlineStyle###
###getId###
###getStyle###
###getClass###
###getTagName###
###hasAttr###
###hasClass###
###hasChildren###
###hasInlineStyle###
###contains###
###matches###
###inside###
###inDOM###
###hasFocus###
###hasFocusInside###


##Storing private data##

####methods:####
###getData###
###setData###
###removeData###


##Positioning and size##

####properties:####
###left###
###top###
###width###
###height###

####methods:####
###setXY###
###forceIntoNodeView###
###forceIntoView###
###scrollTo###
###insidePos###
###rectangleInside###


##Traversing##

####methods:####
###getParent###
###next###
###previous###
###first###
###last###
###firstOfChildren###
###lastOfChildren###


##Querying the DOM##

####methods:####
###getElement###
###getAll###
###getChildren###



#Usage#

You can use your code just the way you did before. Nothing changed! Though you get some sugar methods on the vElement-objects for free. Any time you reference a DOM-Element, you get a vElement, so from there all goes faster than before.

####example####
```html
<div id="container">What a lovely day <b>it is today</b> don't you think?</div>
```

```js
var mynode = documentGetElementById('container'); // returns a vElement
mynode.innerHTML = 'What a lovely day <b>it was yesterday</b> don\'t you think?';
```

The previous example just updated the bolded-Node with the content "it was yesterday". The text "What a lovely day " and " don\'t you think?" are untouched.

This simple example isn't that impressive. But a huge table would benefit a lot from the diffing-rendering, as well as an input-element that remains untouched.


CAUTIOUS:
You can use native propertysetter (like node.className), and they will update the vdom. But because this happens asynchr. (node.mutationobserver), the vdom isn't updated within its own eventcycle. Better use the added Element-methods which update the vdom right away