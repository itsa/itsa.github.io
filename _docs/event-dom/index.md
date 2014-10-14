---
module: event-dom
itsaclassname: Event
version: 0.0.1
modulesize: 5.78
dependencies: "polyfill/polyfill-base.js, js-ext/lib/function.js, js-ext/lib/object.js, utils, event"
maintainer: Marco Asbreuk
title: DOM Events
intro: "The event-dom module integrates DOM-events into the event-module. Using this module, you have all the power of the event-module applied to DOM-events.<br><br><u>event-dom touches no single dom-node</u>. Listening to events always happens by listening at the capturephase of <i>document</i>. Subscribers can be set without the need of node's being part of the dom.<br><br>The loaderfiles combine <b>event</b>, <b>event-dom</b> and <b>event-mobile</b> all into ITSA.Event."
firstpar: get-started-onlywindow
---

#Features#

This module brings DOM-events to a higher level:

* subscribers work regardless of the domnode being part of the dom
* by using delegation, you can save many Event-subscribers
* only a small number of dom-listeners are created. Just one for every possible dom-event
* e.target always matches the selector
* no memoryleaks on the dom, no need to detach on the dom-node
* delegation support for `focus`, `blur`, `scroll`, `resize`, `error` and `load` event
* both `before` and `after` listeners can be set
* `mouseover`- and `mouseout`-events only occurs on the selector (not noisy)
* all events have an `eventoutside` counterpart


#The Basics#

After including this module, you can listen for DOM-events, just like listening to other events. The difference with other events is that DOM-events don't need an emitterName when listening:

####Example: listening to DOM-events####
```js
var showMsg = function(e) {
    // e.target is the node that was clicked
    alert(e.target.innerHTML);
};

Event.after('click', showMsg, '#buttongo');
```

When listening to DOM-events, you always need to pass the `filter-argument`, this is a css-selector by which you tell what nodes you want to listen at. It doesn't matter if those nodes are in the dom yet, or at any later time.


#DOM-events#

This module handles both custom-made events as well as DOM-events. Both get the convention **customEvents** and they are treated as the same. In reality, DOM-events are caught at their [capture-phase](http://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/) and transported into this Eventsystem. It also looks at the response of this Eventsystem: if the customEvent is halted or defaultPrevented, then the original DOM-event will be defaultPrevented. This way we keep DOM-events and our Eventsystem completely separated.

There are some differences between DOM-events v.s. Custom created Events that you should be aware of:

##Behaviour DOM-events##

* DOM-events can subscribed to by listening to **UI:eventName** or **eventName**, both are the same. Subscribing to event without the emitterName **always** means: subscribing to DOM-events.
* DOM-events are always subscribed by delegation: you need to specify a css-selector at the filter-argument.
* DOM-events can be subscribed regardless of the existance of the node inside the dom. If the node isn't there: no event; if the node gets inserted at a later time: the events occur.
* All DOM-events work through delegation, even focus, blur, error, load, focus and scroll.
* IE8- <u>does not support</u> **error**, **load**, **resize** and **scroll** (it does support focus and scroll by delegation).
* DOM-events propagate through the dom-tree. This propagation can be stopped either by [e.stopPropagation() or e.stopImmediatePropagation()](#stoppropagation-and-stopimmediatepropagation).


**Note1:** Because DOM-events should be listened through delegation, never directly on a DOM-node, you <u>cannot use code like _DOMnode.on('event', callback)_</u>. Not being able to do so, leads into a better usage, for you'll never run into issues with creating listener on objects that don't exist.

**Note2:** Mobile-events are part of the system as well, by integrating [Hammer.js](http://hammerjs.github.io).

##Listening to DOM-events##
Because the listener-helpers are not part of node's, you should listen to DOM-events through `Event` or any instance that has the listener-helpers. Which one you choose is up to you, the difference is that the object which listens for the event will become the context inside any subscriber.

####listening to all click-events####
```js
Event.after('click', function(e) {
    var buttonnode = e.target;
    ...
}, 'button');
```

####listening all click-events of buttons inside container####
```js
Event.after('click', function(e) {
    // this code only gets invoked when a button inside #container was clicked
    var buttonnode = e.target;
    ...
}, '#container button');
```

##halt and preventDefault##

e.halt() and e.preventDefault() are methods that can be invoked inside before-subscribers. These methods change the event-lifecycle:

* e.**halt**(reason) stops further processing the eventchain: no more subscribers get invoked (nor before- neither after) and no defaultFn or preventedFn gets invoked
* e.**preventDefault**(reason) all beforesubscribers keep getting invoked, but the defaultFn will not be invoked, neither any aftersubscribers.

####halt the event inside the before-subscriber####
```js
var beforeClick = function(e) {
    e.halt();
    // stop the event --> no defaultFn and
    // no after-listeners get invoked
};
var afterClick = function(e) {
    var node = e.target;
    // the code will never come here
};
myMembers.before('click', beforeClick, '#buttongo');
myMembers.after('click', afterClick, '#buttongo');
```

e.preventDefault() will prevent any default-action that comes with the DOM-event. It depends on the DOM-event itself what that default-action would be. For example: anchor-elements will navigate to their href by the default-action. Also form-submission has its submission done by the default-action.

##stopPropagation and stopImmediatePropagation##

e.stopPropagation() and e.stopImmediatePropagation() are methods that only apply to dom-events. When an event on a DOM-node occurs, it bubbles up the dom tree, to its parentNode (which receives the event), to its parentNode etc, right up to `document`. There might be situations where you want to halt this bubble-behaviour. In that case you should call e.stopPropagation() at a beforesubscriber on one of the nodes inside the bubblechain. Any subscribers higher up the dom-tree will not get invoked. Any other subscribers at the same node do get invoked. Here lies the difference with e.stopImmediatePropagation, which also prevents any other subscribers at the same node.

Both e.stopPropagation() and e.stopImmediatePropagation() <u>do not prevent</u>u> the default-action of the event. See **[DOM stopPropagation](dom-stoppropagation.html)** for an example of stopPropagation and stopImmediatePropagation.

##Filtering##

The default way to sepcify the target you are listening to, is by defining a `selector`, which is done at all the examples above. The benefits here is that e.target wil be the DOM-node that matches this selector. Another way is by specifying your own selectorfunction. This function should return true on the node that gives a match.

**Note 1:** When you use your own selectorfunction, e.target will equal the deepest DOM-node that initiated the event, <u>not</u> the node that matches the filterfunction. In this way, using a css-selector instead of your own filterfunction is highly preferable.

**Note 2:** Do not reset e.target inside your own filterfunction. There might be more listeners to the same UI-event: resetting e.target will mess things up.

####example using a filterfunction####
```js
Event.after('click', function(e) {
    // button "#buttongo" is clicked,
    // e.target could be an innernode of button, like a <i>-tag
}, function(e) {
    return e.target.id==='buttongo';
});
```


#Available events#

All DOM-events that the browser emits will come through to the Eventsystem. See the list of available dom-events [here](http://en.wikipedia.org/wiki/DOM_events).

You should be carefull when it comes down to gesture-events (touch- or pointer-events). These are uses on mobile devices. If you want to subscribe to those events, you should use the module **[event-hammer](../event-hammer/index.html)**

Beside native DOM-events, this module enriches some events and adds some custome events for a richer experience:

##mouseover and mouseout##

###Native DOM way###
By nature, these event are noisy. That is, suppose you have this structure:

```html
<div id="hover-me">
    <div class="header">
        <button class="close">Close</button>
    </div>
    <div class="body">
        ... more markup
    </div>
</div>
```
Then a mouseover subscription on `#hover-me` would be called three times when a user moved the mouse over the close button because

* The user moused over #hover-me
* The user moused over the <div> in #hover-me, and that mouseover event bubbled to #hover-me
* The user moused over the close button, and that mouseover event bubbled to #hover-me

###Using event-dom module###
This module doesn't work that way. By nature it will only call the subscriber when there is a match by the selector. IE introduced `mouseenter` and `mouseleave` that do the same. This module <u>has no mouseenter not mouseleave</u> support: you can just use `mouseover` and `mouseout` they just work.


##outside events##

All DOM-events can be appended with `outside`. This means that the original event will be listened to, but the subscriber gets invoked when the css-selector is **not matched**.

####Example: listening to outside-events####
```js
var showMsg = function(e) {
    // e.target is the node that was clicked
    alert(e.target.innerHTML);
};

Event.after('clickoutside', showMsg, '#somediv');
```

**Note1:** you can only use outside-events when you are using a css-selector as filter. Because the eventName internally will be translated into its 'non'-outside- variant, you will expect wrong rsults when passing a function into the filter.

**Note2:** with outside-events, e.target matches the most innernode where the event occured. It does not match any element of the css-selector for it didn't match those elements.

##Additional events##

This module comes with some handy additional events non-native DOM-events that might be handy to use:

###hover###
`mouseover` and `mouseout` subscriptions are very common used to create an effect that only lasts as long as the mouse is over an element. To make that easier, there is the `hover`-event. The subscriber gets invoked on <u>mouseover</u> and receives the eventobject which has the property `e.hover` which is a `Promise`. You can use this Promise to get notification of when <u>mouseout</u> happened. The Promise e.hover gets resolved with `relatedTarget` as argument: the node where the mouse went into when leaving a.target.

You best subscribe to the after hover-event: its subscriber gets invoked once hover started.

####Example: listening to DOM-events####
```js
var showMsg = function(e) {
    var node = e.target;
    node.innerHTML = 'Mouse entered';
    e.hover.then(function(relatedTarget) {
        node.innerHTML = relatedTarget.id ? 'Went to '+relatedTarget.id : '';
    });
};

ITSA.Event.after('hover', showMsg, '#container');
```

###valuechange###
`valuechange` emits when the value property of an `<input>`, `<textarea>`, `<select>`, or `[contenteditable="true"]` element changes as the result of a keystroke, or mouse operation.

Programmaticly changes should be done through HtmlElement.setValue() which is provided by `dom-ext`. This method ensures the `valuechange` event will be fired (as long as the module `event-dom/extra/valuechange.js` is loaded).

This adresses changes inside these elements like:

* typing a simple character
* typing a multi-stroke character
* setting values programmaticly by using `setValue()`
* cutting from or pasting into the value with Ctrl+X or Cmd+V
* cutting or pasting with a keyboard-summoned context menu
* cutting or pasting from the right-click context menu.

The valuechange-event provides more reliable input notifications and should be used when you want to be notified about changes to these tpe of HtmlElements.


#Properties of eventobject#
All DOM-events receive an event object that extends the eventobject created by Event (bold properties are generated by our Event-system):

<table class="pure-table pure-table-striped"><thead>
<tr>
<th>Name</th>
<th>Value</th>
</tr>
</thead><tbody>
<tr>
<td><b>target</b></td>
<td>DOMnode that received the event.</td>
</tr>
<tr>
<td><b>type</b></td>
<td>eventName. Like `click`.</td>
</tr>
<tr>
<td><b>emitter</b></td>
<td>emitterName of the emitter. Will always be 'UI' because it is a DOM-event</td>
</tr>
<tr>
<td><b>returnValue</b></td>
<td>Returnvalue of the default-function</td>
</tr>
<tr>
<td><b>status</b></td>
<td>Object holding the status about what happened to the event. Has the following properties:
    <ul>
        <li>e.status.<b>ok</b> --> `true | false` whether the event got executed (not halted or defaultPrevented)</li>
        <li>e.status.<b>defaultFn</b> _(optional)_ --> `true` if any defaultFn got invoked</li>
        <li>e.status.<b>preventedFn</b> _(optional)_ --> `true` if any preventedFn got invoked</li>
        <li>e.status.<b>halted</b> _(optional)_ --> `reason | true` if the event got halted and optional the why</li>
        <li>e.status.<b>defaultPrevented</b> _(optional)_ -->  `reason | true` if the event got defaultPrevented and optional the why</li>
        <li>e.status.<b>propagationStopped</b> _(optional)_ --> `DOMnode` the DOMnode on which propagation was stopped</li>
        <li>e.status.<b>immediatePropagationStopped</b> _(optional)_ -->  `DOMnode` the DOMnode on which immediatePropagation was stopped</li>
        <li>e.status.<b>unSilencable</b> _(optional)_ -->  `true` if the event cannot be made silent</li>
    </ul>
</td>
</tr>
<tr>
<td>any other</td>
<td>specific dom event-properties</td>
</tr>
</tbody></table>


#Compatability#

* All modern browsers and IE9+ are fully supported.
* IE8- are supported with the exception of the events **error**, **load**, **resize** and **scroll**
