---
module: vdom
functionality: transition
itsaclassname:
version: 0.0.1
modulesize: 1.69
dependencies: "polyfill"
maintainer: Marco Asbreuk
title: Transitions
intro: "Proxy for <b>window.document</b> and <b>window.Element</b> which makes working with the DOM ultrafast."
firstpar: get-started-onlywindow
---



#The Basics#

Transitions are happening through CSS-transitions. This is available in every modern browser and IE10+. The transitions are delivers by the `vdom`-module. There are serveral sugar methods and setting classes that have a transition can be managed. All transition-methods return a `Promise`.

Transitions have a lot of pitfalls. This module uses a `transition-fix` to handle these. For example: `auto` width and height will transition properly. Also, the Promise will be resolved as soon as the transition has finished, even if several properties have different duration, or when the `transitionend`-events get messy (which happen in webkit with shorthand properties).



#How to start a transition#

The cleanest way to start a transition is by using classes. The methods `setClass` and `toggleClass` can (optionally) return a Promise by which class-transitions can be managed.

However, when the highest level of management is needed, you should use the method node.`transition`. This has a slightly better way of management, because it can revert transitions halfway (which cannot be done with class-transitions). Also, `transition` should be used with *non-vendor* css-properties: the properties are automaticly set into the proper vendor-specific properties. Using classes, you will need to define vendor specific properties in the styles.


##Transitioning with classes##

There are four node-methods which can return a `Promise`:

* setClass()
* removeClass()
* toggleClass()
* replaceClass()

By setting the second argument `true`, the method will return a Promise and the transition is guaranteed to process well.

####Example Promised setClass:

```css
.big {
    height: 300px;
    width: 600px;
    -webkit-transition: all 3s;
    -moz-transition: all 3s;
    -ms-transition: all 3s;
    -o-transition: all 3s;
    transition: all 3s;
}
```

```js
transPromise = someNode.setClass('big', true);

transPromise.then(
    function() {
        // the transition has finished here
    }
);
```


In case you don't need a `Promise`, but need the `transition-fix` for a proper transition, you can use the firth argument:

```js
someNode.setClass('big', false, true);
```


To achieve a proper transition, a `transition-fix` is used. Temporarely, the right css-properties are set `inline` during the transition. Once the transition is finished, they will be removed, leaving only the classname (and former inline css) behind.


##Transitioning with node.transition()##

Node.`transition()` is a specialized method for fine grained transitions. The css-properties will be set inline, even after transition. You can see it as node.`setInlineStyles()` but also specifying the transition.


####Example node.transition():

```js
myTrans = [
    {property: 'width', value: '600px', duration: 5},
    {property: 'height', value: '250px', duration: 10, delay: 2},
    {property: 'background-color', value: '#00F', duration: 15}
];

transPromise = someNode.transition(myTrans);

transPromise.then(
    function() {
        // the transition has finished here
    }
);
```


##Chaining transitions##

Because both class-transition as well as node-transitions return `Promise`, they can be easily chained:

####Example chaining class-transition:####

```js
transPromise = someNode.setClass('big', true).then(
   someNode.setClass.bind(someNode, 'blue', true)
);

transPromise.then(
    function() {
        // the transition has finished here
    }
);
```



#About IE9#

IE9 <u>does not support transitions</u>u>. Using the transitions of the `vdom`-module with IE9 will make the transision to finish immediately.