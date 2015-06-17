---
module: vdom
itsaclassname:
version: 0.0.1
modulesize: 1.69
dependencies: "polyfill"
maintainer: Marco Asbreuk
title: Virtual DOM
intro: "The vdom creates <b>vnodes</b> for every dom-Node which makes working with the DOM ultrafast. Additionally, both document and Element have many sugar methods making working with the dom fun again."
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



#Node mutation events#

When both the `vdom` and the `event-dom` module are loaded, the vdom fires `Node mutation events`. That is, only when there is a subscriber.

##Available events##

###nodeinsert###
Emitted for every Element that gets inserted.

###noderemove###
Emitted for every Element that gets removed.

###nodecontentchange###
Emitted for every Element that gets its content changed (innerHTML/innerText).

###attributeinsert###
Emitted for every Element that gets an attribute inserted.
The eventobject has an extra property: `changed` which is an Array of Objects:

```js
e.changed = [
    {attribute: attrName, newValue: new_value},
    {attribute: attrName, newValue: new_value}
]
```

###attributeremove###
Emitted for every Element that gets an attribute removed.
The eventobject has an extra property: `changed` which is an Array of Strings:

```js
e.changed = [attributeName, attributeName]
```

###attributechange###
Emitted for every Element that gets an attribute changed.
The eventobject has an extra property: `changed` which is an Array of Objects:

```js
e.changed = [
    {attribute: attrName, newValue: new_value, prevValue: previous_value},
    {attribute: attrName, newValue: new_value, prevValue: previous_value}
]
```


#Elements in different NS#

Some elements live in their own namespace, for example `svg` (http://www.w3.org/2000/svg). When working with this vdom, <u>you don't need to bother</u>. In other words: it s completely legal to use the next code:

####Example inserting svg###
```js
var body = ITSA.getElement('body');
body.setHTML('<svg width="100" height="100">'+
                 '<circle fill="red" stroke-width="3" stroke="black" r="40" cy="50" cx="50"/>'+
             '</svg>');
```

In this example, the element `svg` is created inside the namespace 'http://www.w3.org/2000/svg'. Internally, the `vdom` has the next translation-table to get the right namespace for some elements:

* svg --> http://www.w3.org/2000/svg
* xbl --> http://www.mozilla.org/xbl
* xul --> http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul
* math --> http://www.w3.org/1998/Math/MathML
* xlink --> http://www.w3.org/1999/xlink



##Using href for svg##
In XML and therefore SVG, <u>there is no magic `href`-attribute that can create links</u>. Instead you have to use a technology called `XLink` to provide this functionality. In practice, the xlink prefix is defined, followed by a colon (:) and the attribute-name. The attribute-value is then set to the standard `xlink` namespace. This accounts for all attributes, not only `href`.

It is even easier not to define the full namespace, but make usage of the vdom's namespace translation-table:

####Example inserting svg with xlink:href and xlink:title###
```js
var body = ITSA.getElement('body');
body.setHTML('<svg width="100" height="100">'+
                '<a xlink:href="http://itsa.io" xlink:title="ITSA modules">'+
                     '<circle fill="red" stroke-width="3" stroke="black" r="40" cy="50" cx="50"/>'+
                '</a>'+
             '</svg>');
```

####Example set attrbute xlink:href and xlink:title with javascript###
```js
var body = ITSA.getElement('body'),
    svgAnchor;
body.setHTML('<svg width="100" height="100">'+
                '<a>'+
                     '<circle fill="red" stroke-width="3" stroke="black" r="40" cy="50" cx="50"/>'+
                '</a>'+
             '</svg>');

svgAnchor = body.getElement('svg a');
svgAnchor.setAttr('xlink:href', 'href="http://itsa.io'); // is correct
svgAnchor.setAttributeNS('xlink', 'title', 'ITSA modules'); // is correct
```

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
###addSystemElement###
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
###setAttrs###
###setInlineStyle###
###defineInlineStyle###
###setInlineTransition###
###setId###
###setClass###
###toggleClass###
###replaceClass###
###removeAttr###
###removeAttrs###
###removeInlineStyle###
###removeInlineTransition###
###removeClass###
###removeId###

####methods for information:####
###getAttr###
###getInlineStyle###
###getInlineTransition###

###getTransition###
###getId###
###getStyle###
###getClass###
###getTagName###
###hasAttr###
###hasClass###
###hasChildren###
###hasInlineStyle###
###hasInlineTransition###

###hasTransition###
###contains###
###matches###
###inside###
###inDOM###
###hasFocus###
###hasFocusInside###
###hasFocusInside###
###isItag###


##SVGElement's data##

###svgHeight###
###svgWidth###


##Storing private data##

####methods:####
###getData###
###setData###
###removeData###


##Positioning and size##

####properties:####
###left###
###top###
###height###
###width###
###innerHeight###
###innerWidth###

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



CAUTIOUS:
You can use native propertysetter (like node.className), and they will update the vdom. But because this happens asynchr. (node.mutationobserver), the vdom isn't updated within its own eventcycle. Better use the added Element-methods which update the vdom right away