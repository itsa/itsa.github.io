---
module: vdom
itsaclassname:
version: 0.0.1
modulesize: 1.69
dependencies: "polyfill"
maintainer: Marco Asbreuk
title: Vitrual DOM
intro: "Proxy for <b>window.document</b> which makes working with the DOM ultrafast."
firstpar: get-started
---



#The Basics#

The Virtual DOM acts like a `proxy` on `window.document`. It uses all its native features, but extends the critical ones, making working with the DOM ultra-fast. This Virtual DOM is not a fake-dom by itself: it needs many native document-features. However, you can merge it into any fake-dom yourself and benefit from the features it offers.

On the browser, there is no initialisation needed. Just load this module, use any `document` and `HtmlElement` method or properties as you were used to. They just get boosted.

To speed up `DOM-rendering`, the principle of `diffing` is begin used, like introduced by Reactjs. However, this Virtual DOM does not need a MVC-system to be operational. Though the iView's benefit a lot of the Virtual DOM.


#window.document#

The next properties and methods of `window.document` are being upgraded:


##properties##

###documentElement###

###head###

###body###

###activeElement###


##methods##

###createElement###



#HtmlElement#

The next properties and methods of `HtmlElement` are being upgraded:


##properties##

###parentNode###


##methods##

###contains###

###matchesSelector###
