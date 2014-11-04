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

The Virtual DOM acts like a `proxy` on `window.document` and `window.Element`. It uses all its native features, but extends the critical ones, making working with the DOM ultra-fast. This Virtual DOM is <u>not a fake-dom</u>. It is just an extention: an ultrafast proxylayer.

On the browser, there is no initialisation needed. Just load this module, use any `document` and `Element` method or properties as you were used to. They just get boosted.

To speed up `DOM-rendering`, the principle of `diffing` is being used, like introduced by Reactjs. However, this Virtual DOM does not need a MVC-system to be operational, though the iView's benefit a lot of the Virtual DOM.


#Virtualising the DOM#

On startup, the complete DOM is virtualised into `vnodes`. These are plain objects with a reference to their vElement (see below). Manipulation of the DOM will be handled by these vnodes, which is tremendously faster than the native DOM. Traversing and searching through the vnodes goes ultrafast. Also, manipulating the DOM through vnodes goes by `diffing`.

#VElement's#

Both `window.document` and `window.Element` are being upgraded so taht they return `VElement`- instead of `Element`-instances. A VElement is an extention of Element, but it makes sure that any method ro property used, will be handled by its related `vnode`.

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