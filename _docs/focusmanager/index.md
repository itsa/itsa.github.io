---
module: focusmanager
itsaclassname:
version: 0.0.1
modulesize: 0.35
modulesizecombined: 26.72
dependencies: "vdom, event-dom, polyfill, utils, js-ext"
maintainer: Marco Asbreuk
title: Focusmanager
intro: "Easy focusmanagement, to be set up by plain HTML or Plugin."
firstpar: get-started-onlywindow
---



#The Basics#

The `focusmanager` can be set on any containernode. This can be done by plain HTML (setting the propper attributes), or by using the `Plugin`, which is nothing more than a routine to fill the right attributes through javascript.

By default, any element inside the container that matches this selector: `"input, button, select, textarea, .focusable"` can retrieve focus. Note the any item with the class `.focusable` gets selected as well, even if it is a non-focusable element by default (like `li` or `div`-elements). Whenever the focusmanagable-container gets focussed on a *non-focussable* element, the focus will be set on the last focussed element of the container.

Also, this module takes care of marking all elements up the tree of the focussed element with the class: `focussed`. This way, those elements can be styled, when a descendent element has focus (and not the ancestor itself).

<b>Focussing is done real-time</b> using delegation: it always works, <u>regardless</u> of focusable nodes getting added or removed inside the container.



#Setting up with HTML#

The preferred way is to set the focusmanager through HTML, because you don't need client-side rendering. Making a container a focusmanager is done with the attribute `fm-manager`, which can be set `"true"`, or a selector-specification:

####Example simple focusmanager:####
```html
<div class="pure-form" fm-manage="true">
    <input type="text" />
    <input type="text" />
    <button class="pure-button">Cancel</button>
    <button class="pure-button">OK</button>
</div>
```

####Example focusmanager with different selector:####
```html
<ul fm-manage="li">
    <li>first item</li>
    <li>second item</li>
    <li>third item</li>
</ul>
```



#Setting up with Plugin#

A node can also be made a focusmanager by using the plugin which gets returned by the module (when required). Additional config can be set through the second argument:

####Example simple focusmanager by Plugin:####
```html
<div class="pure-form">
    <input type="text" />
    <input type="text" />
    <button class="pure-button">Cancel</button>
    <button class="pure-button">OK</button>
</div>
```

```js
<script>
    var ITSA = require('itsa'),
        containers = document.getAll('.pure-form');

    containers.plug('fm');
</script>
```

####Example focusmanager by Plugin with different selector:####
```html
<ul class="managable-list">
    <li>first item</li>
    <li>second item</li>
    <li>third item</li>
</ul>
```

```js
<script>
    var ITSA = require('itsa'),
        containers = document.getAll('.managable-list');

    containers.plug('fm', {manage: 'li'});
</script>
```

The method `plug()` is available on both NodeLists as well as Elements.



#Nested focusmanagers#

Focusmanagers can be nested. There is no `bleed-in` or `bleed-out` of the manage-keys. In some cases, a nested focusmanager is a focusable item on the parent as well. In those cases, focussing through the parent-manager will set focus on the nested manager, but doesn't refocus into this nested manager. This way, you can focus through all the items of the parent manager where the nested manager is just another item.

However -in those cases- you need a way to get inside and outside the nested manager. This can be done with the attibutes `fm-keyenter` and `fm-keyleave`.

####Example nested focusmanager####
```html
<form fm-manage="true">
    <input id="name" type="text" value="first"/>
    <input id="pw" type="password" value="second"/>
    <div fm-manage="true">
        <input id="nameinner" type="text" value="first"/>
        <input id="pwinner" type="password" value="second"/>
    </div>
    <inputtype="checkbox" /> I've read the conditions</label>
    <button >OK</button>
</form>
```



#Focusmanager-options#

Additional options can be set directly by HTML, or by using the second argument of the Plugin (see the examples above).

##options##
All options are described without the namespace: these are the properties you can use with the Plugin. When defining the attributes directly, you need to prepend the namespace `fm-`.

###manage###
Can be set `"true"` or any `selector`.

###alwaysdefault###
Can be set `"true"`. If set, then whenever the focusmanager-container gets focussed on a non-focussable element, the focus will not be set on the `last focussed element`, but on the first element that has the attribute `fm-defaultitem="true"` set.

###keyup###
Can be set to a proper `keyCode`, optional prepended by one or more `special-keys`: <b>ctrl</b>, <b>cmd</b>, <b>alt</b>, <b>shift</b>. Whenever `special-keys` are used, they need to be appended with `+`. Valid examples are: `"38"`, `"shift+38"`, `"ctrl+shift+38"`.

The `keyup` property manages the key that makes the focus going upward.

###keydown###
Can be set to a proper `keyCode`, optional prepended by one or more `special-keys`: <b>ctrl</b>, <b>cmd</b>, <b>alt</b>, <b>shift</b>. Whenever `special-keys` are used, they need to be appended with `+`. Valid examples are: `"38"`, `"shift+38"`, `"ctrl+shift+38"`.

The `keydown` property manages the key that makes the focus going downward.

###keyenter###
When working with nested focusmanagers, the `keyenter` property holds the key that will set the focus into the nested manager.

###keyleave###
When working with nested focusmanagers, the `keyleave` property holds the key that will set the focus into parent manager.

###noloop###
To prevent looping through the focussable items. By default the focusmanager will loop: set this attribute to prevent this.



#Element-options#

The focussable elements can be given options so that the focusmanager treats them specially.

##options##
All options are described with the namespace: you need to set them with plain `HTML`, or by using node.`setAttr()`, the plugin won't do this, for it is designed to alter the container-node, not the separate focussable descendants.

###fm-defaultitem###
Can be set "true". If set, then whenever the focusmanager-container gets focussed on a non-focussable element, the focus will be set on this element.

###fm-primaryonenter###
Can be set `"true"`. Only applyable for `input`-elements of the type `text` or `password`. If set, then whenever the `Enter-key` gets pressed, the first `button.pure-button-primary` will be focussed and pressed.

####Example element-options####
```html
<form class="pure-form" fm-manage="true">
    <input type="text" placeholder="username" fm-defaultitem="true" />
    <input type="password"  placeholder="password" fm-primaryonenter="true"/>
    <button class="pure-button pure-button-primary" type="submit">OK</button>
</form>
```

This example creates a form where you can do:

* type username
* press Enter
* type password
* press Enter

And then the form gets submitted automaticly.