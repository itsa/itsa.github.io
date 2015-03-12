---
module: constrain
version: 0.0.1
modulesize: 1.99
modulesizecombined: 15.32
dependencies: "polyfill/polyfill-base.js, js-ext/lib/function.js, js-ext/lib/object.js, utils, event"
maintainer: Marco Asbreuk
title: Making an Element to constrain within boundaries
intro: "This module makes an Element to be constrained when dragged or repositioned."
firstpar: get-started-onlywindow
extracodefirstpar:
---


#The Basics#

The `constrian`-plugin makes an Element to constrain to another `Element` or `window`, specified by `selector`. This constrain-effect will be active whenever the Element is dragged or repositioned.



#Setting up with HTML#

The preferred way is to set the focusmanager through HTML, because you don't need client-side rendering:

####Example simple constrian:####
```html
<div plugin-constrain="true"></div>
```

####Example constrian with different selector:####
```html
<div plugin-constrain="true" constrain-selector=".container"></div>
```



#Setting up with Plugin#

A node can also be constrained by using the plugin which gets returned by the module (when required):

####Example simple focusmanager by Plugin:####
```html
<div id=mynode></div>
```

```js
<script>
    var ITSA = require('itsa'),
        mynode = document.getAll('#mynode');

    mynode.plug('constrain');
</script>
```