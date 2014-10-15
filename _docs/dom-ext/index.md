---
module: dom-ext
itsaclassname:
version: 0.0.1
modulesize: 2.75
dependencies: "polyfill, js-ext/extra/reserved-words.js"
maintainer: Marco Asbreuk
title: DOM extended
intro: "Provides several sugar-methods to manipulate and query the DOM."
firstpar: get-started
---

#The Basics#

Working with the `DOM` is extremely complicated. Not everything works the same browserwide, and many methods are hard to use. Also, the DOM works with different type of **nodes**: `document`, `HtmlElements` and `text-nodes`. This makes usage of many methods confusing and difficult.

This module is meant for the user to focus on `document` and `HtmlElement`'s only. Both are extended with sugarmethods, but they all disregard text-nodes. So you can work with the `DOM-tree` as a tree of `Elements`. Also, `NodeList` and `HTMLCollection` are extended. Not only they have sugar-methods, but they act as true `Arrays`.

When you work with the DOM and use only the methods and properties described below, DOM-manipulations becomes both easy and safe.

**Note:** Even if `dom-ext` makes working with the DOM easy, it doesn't mean manipulating the DOM is quick. It isn't: DOM-manipulation is known to be slow. Therefore we suggest you to use the module `vdom` which virtualizes the DOM and does a much quicker DOM-manipulation. `vdom` retains this API, so you can keep on using all methods described below: `vdom` will just boast up performance under the hood.


#document#

##Native properties##

###head###
Reference to the `header` of the document.

###body###
Reference to the `body` of the document.


##Native methods##

###createElement###
Creates a new HtmlElement, which is not in the DOM until you insert it.

```js
var el = document.createElement('div');

el.setHTML('some <b>content</b>');
document.body.append(el);
// both setHTML() and append() are extentions to HtmlElement
```

##Extended methods##

###createElementFull###
Creates a full HtmlElement at once. Differs from document.createElement in a way that the latter only accepts the tag-name, where `createElementFull` accepts a full definition. Note that as long as the new Element is not in the DOM, it has not all HtmlElement extended features.

###first###
Returns the first of the HtmlElement's siblings, or the first that matches `cssSelector`.

###getAll###
Gets a NodeList of HtmlElements, specified by the css-selector.

###getElement###
Gets one HtmlElement, specified by the css-selector. To retrieve a single element by id, you need to prepend the id-name with a `#`. When multiple HtmlElement's match, the first is returned.

###getFocussed###
Gets the HtmlElement that currently has the focus.

###last###
Returns the last of the HtmlElement's siblings, or the last that matches `cssSelector`.

###replace###
Replaces the HtmlElement with a new HtmlElement.

###test###
Tests if the HtmlElement would be selected by the specified cssSelector. Alias for `matchesSelector()`



#DOM Elements#

##Native properties##

###children###
A NodeList with only HtmlElements. Contains all child-nodes (one level deep).

###parentNode###
Current Element's parent HtmlElement in the DOM-tree. The tree itselfs goes up to `document`, which doesn't have a parentNode.

##Native Methods##

###focus###
Set the focus to the node

###scrollIntoView###
Scrolls the HtmlElement into the current view.


##Extended methods##

###append###
Appends a HtmlElement or text at the end of HtmlElement's innerHTML.

###clone###
Returns a duplicate of the node. Use cloneNode(true) for a `deep` clone.
Almost the same as native cloneNode(), but you should use clone(), because it also clones any data set with setData().

###defineInlineStyle###
Sets the inline-style of the HtmlElement exactly to the specified `value`, overruling previous values.

###empty###
Empties the content of the HtmlElement. Alias for setText('');

###first###
Returns the first of the HtmlElement's siblings, or the first that matches `cssSelector`.

###forceIntoView###
Forces the HtmlElement to be inside the window-view. Differs from `scrollIntoView()` in a way that `forceIntoView()` doesn't change the position when it's inside the view, whereas `scrollIntoView()` sets it on top of the view.

###getAttr###
Gets an attribute of the HtmlElement. Alias for getAttribute().

###getAll###
Gets a NodeList of HtmlElements, specified by the css-selector.

###getClass###
Gets the HtmlElement's class as a whole String.

###getData###
Returns data set specified by `key`. If not set, `undefined` will be returned.

###getElement###
Gets one HtmlElement, specified by the css-selector. To retrieve a single element by id, you need to prepend the id-name with a `#`. When multiple HtmlElement's match, the first is returned.

###getHeight###
Gets the height of the element in pixels. Included are padding and border, not any margins. By setting the argument `overflow` you get the total height, included the invisible overflow.

###getHtml###
Returns the innerContent of the HtmlElement as a string with HTML entities.

###getId###
Gets the HtmlElement's id.

###getInlineStyle###
Returns inline style of the specified property. `Inline` means: what is set directly on the HtmlElement, this doesn't mean necesairy how it is looked like: when no css is set inline, the HtmlElement might still have an appearance because of other CSS-rules.

###getScrollLeft###
Gets the left-scroll offset of the content of the HtmlElement. Only apropriate when the HtmlElement has overflow.

###getScrollTop###
Gets the top-scroll offset of the content of the HtmlElement. Only apropriate when the HtmlElement has overflow.

###getStyle###
Returns cascaded style of the specified property. `Cascaded` means: the actual present style, the way it is visible (calculated through the DOM-tree).

###getTag###
Gets the HtmlElement's tagname. Always uppercased.

###getText###
Gets the text content of the HtmlElement and its descendants. If you need full HTML, you should use getHTML().

###getValue###
Gets the value of the following HtmlElements: **input**, **textarea**, **select** or any container that is `contenteditable`

###getWidth###
Gets the width of the element in pixels. Included are padding and border, not any margins. By setting the argument `overflow` you get the total width, included the invisible overflow.

###getX###
Gets the x-position (in the document) of the element in pixels. Document-related: regardless of the window's scroll-position.

###getY###
Gets the y-position (in the document) of the element in pixels. Document-related: regardless of the window's scroll-position.

###hasAttr###
Whether the HtmlElement has the attribute set. Alias for hasAttribute().

###hasClass###
Checks whether the className is present on the Element.

###hasData###
If the Element has data set specified by `key`.

###hasFocus###
Checks whether HtmlElement currently has the focus.

###inside###
Checks whether the HtmlElement lies within the specified selector (which can be a CSS-selector or a HtmlElement).

###insidePos###
Checks whether a point specified with x,y is within the HtmlElement's region.

###last###
Returns the last of the HtmlElement's siblings, or the last that matches `cssSelector`.

###next###
Returns the next of the HtmlElement's siblings, or the next that matches `cssSelector`.

###prepend###
Prepends a HtmlElement or text at the start of HtmlElement's innerHTML.

###prev###
Returns the previous of the HtmlElement's siblings, or the previous that matches `cssSelector`.

###remove###
Removes the HtmlElement from the DOM.

###removeAttr###
Removes the attribute from the HtmlElement. Alias for removeAttribute().

###removeClass###
Removes a className from the HtmlElement.

###removeInlineStyle###
Removes a css-property (inline) out of the HtmlElement. Use camelCase.

###replace###
Replaces the HtmlElement with a new HtmlElement.

###replaceClass###
Replaces the className of the HtmlElement with a new className. If the previous className is not available, the new className is set nevertheless.

###scrollTo###
Scrolls the content of the HtmlElement into the specified scrollposition. Only available when the HtmlElement has overflow.

###setAttr###
Sets the attribute on the HtmlElement with the specified value. Alias for setAttribute().

###setClass###
Adds a class to the HtmlElement. If the class already exists it won't be duplicated.

###setClassName###
Sets the HtmlElement's class as a whole String. Cleaning up any previous classes.

###setData###
Stores arbitary `data` at the HtmlElement. This has nothing to do with node-attributes whatsoever, it is just a way to bind any data to the specific Element so it can be retrieved later on with `getData()`.

###setHTML###
Sets the content of the HtmlElement (innerHTML). Careful: only set content like this if you controll the data and are sure what is going inside. Otherwise XSS might occur. If you let the user insert, or insert right from a db, you might be better of using setContent().

###serialize###
Gets the serialized HTML fragment describing the element including its descendants. alias for outerHTML().

###setStyle###
Sets a css-property (inline) out of the HtmlElement. Use camelCase.
**Note:** no need to camelCase cssProperty: both `margin-left` as well as `marginLeft` are fine

###setText###
Sets the content of the HtmlElement. This is a safe way to set the content, because HTML is not parsed. If you do need to set HTML inside the node, use setHTML().

###setValue###
Sets the value of the following HtmlElements: **input**, **textarea**, **select** or any container that is `contenteditable`
        };
###setXY###
Set the position of an html element in page coordinates. The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).

###setX###
Set the X position of an html element in page coordinates, regardless of how the element is positioned. The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).

###setY###
Set the Y position of an html element in page coordinates, regardless of how the element is positioned. The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).

###test###
Tests if the HtmlElement would be selected by the specified cssSelector. Alias for `matchesSelector()`.

###toggleClass###
Toggles the className of the Element.



#NodeList/HTMLCollection#

NodeList and HTMLCollection are extended to have all `Array`-prototype methods. So you can use `forEach()` fe. Also, they have some of the same methods as HtmlElement has, so you can quickly perform some action an a whole list.

##Native properties##

###length###
Number of items in the NodeList/HTMLCollection


##Extended methods##
For all HtmlElements of the NodeList/HTMLCollection:

###append###
Appends a HtmlElement or text at the end of HtmlElement's innerHTML.

###defineInlineStyle###
Sets the inline-style of the HtmlElement exactly to the specified `value`, overruling previous values.

###prepend###
Prepends a HtmlElement or text at the start of HtmlElement's innerHTML.

###remove###
Removes the HtmlElement from the DOM.

###removeAttr###
Removes the attribute from the HtmlElement.

###removeClass###
Removes a className from the HtmlElement.

###removeData###
Removes data specified by `key`. When no arguments are passed, all node-data (key-value pairs) will be removed.

###removeInlineStyle###
Removes a css-property (inline) out of the HtmlElement. Use camelCase.

###replace###
Replaces the HtmlElement with a new HtmlElement.

###replaceClass###
Replaces the className of the HtmlElement with a new className.
If the previous className is not available, the new className is set nevertheless.

###setAttr###
Sets the attribute on the HtmlElement with the specified value.

###setClass###
Adds a class to the HtmlElement. If the class already exists it won't be duplicated.

###setClassName###
Sets the class to the HtmlElement. Cleaning up any previous classes.

###setData###
Stores arbitary `data` at the HtmlElement. This has nothing to do with node-attributes whatsoever, it is just a way to bind any data to the specific Element so it can be retrieved later on with `getData()`.

###setHTML###
Sets the content of the HtmlElement (innerHTML). Careful: only set content like this if you controll the data and are sure what is going inside. Otherwise XSS might occur. If you let the user insert, or insert right from a db, you might be better of using setContent().

###setStyle###
Sets a css-property (inline) out of the HtmlElement. Use camelCase.

###setText###
Sets the content of the HtmlElement. This is a safe way to set the content, because HTML is not parsed. If you do need to set HTML inside the node, use setHTML().

###toggleClass###
Toggles the className of the Element.


#Node Plugins#

##HtmlElement##

###plug###
Plugs in the plugin on the HtmlElement, and gives is special behaviour by setting the appropriate attributes.

###unplug###
Unplugs a NodePlugin from the HtmlElement.


##NodeList##
For all HtmlElements of the NodeList/HTMLCollection:

###plug###
Plugs in the plugin on the HtmlElement, and gives is special behaviour by setting the appropriate attributes.

###unplug###
Unplugs a NodePlugin from the HtmlElement.