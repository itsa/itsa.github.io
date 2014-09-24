---
module: event-mobile
version: 0.0.1
maintainer: Marco Asbreuk
title: Mobile Events using HammerJS
intro: "This module adds mobile events to the `event-dom` module. It integrates all of HammerJS into the eventsystem. You need `event-dom` to make this module operational."
firstpar: get-started-browser
---

<b>Step 1:</b> create package.json

```json
{
    "name": "my-project",
    "version": "0.0.1",
    "dependencies": {
        "event": "Parcela/event",
        "event-dom": "Parcela/event-dom",
        "event-hammerjs": "Parcela/event-hammerjs"
    }
}
```

<b>Step 2:</b> create your webapplication like this:

```js
<script>
    Event = require("event"),
    EventDom = require('event-dom'),
    HammerJS = require('event-hammerjs');

    EventDom.mergeInto(Event);
    HammerJS.mergeInto(Event);

    Event.after('doubletap', callbackFn, 'button');
</script>
```

#The Basics#

Gesture events are very complex to manage. That's why we choose the library **[HammerJS](http://hammerjs.github.io)** and integrated it into our eventsystem. Once the module is merged into the eventsystem, you can subscribe to all the events that come with HammerJS:

####Example: listening to gesture-events####
```js
var showMsg = function(e) {
    // e.target is the node that was swiped
    alert(e.target.id + 'got swiped');
};

Event.after('swipe', showMsg, '#go');
```


#Available events#

Many gesture-events are available right out of the box. You can even create customized gesture-events: see [Extending gesture-events](#extending-gesture-events). For updated information, you best look at [HammerJS](http://hammerjs.github.io/getting-started/) itself. The events are grouped by **recognizers**:

##pan events##
see: [HammerJS - pan recognizers](http://hammerjs.github.io/recognizer-pan)
Recognized when the pointer is down and moved in the allowed direction.

<table class="pure-table pure-table-striped"><thead>
<tr>
<th>Option</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead><tbody>
<tr>
<td>event</td>
<td>pan</td>
<td>Name of the event.</td>
</tr>
<tr>
<td>pointers</td>
<td>1</td>
<td>Required pointers. 0 for all pointers.</td>
</tr>
<tr>
<td>threshold</td>
<td>10</td>
<td>Minimal pan distance required before recognizing.</td>
</tr>
<tr>
<td>direction</td>
<td>DIRECTION_ALL</td>
<td>Direction of the panning.</td>
</tr>
</tbody></table>

**Events:**

* pan, together with all of below
* panstart
* panmove
* panend
* pancancel
* panleft
* panright
* panup
* pandown

##pinch events##
see: [HammerJS - pinch recognizers](http://hammerjs.github.io/recognizer-pinch)
Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).

<table class="pure-table pure-table-striped"><thead>
<tr>
<th>Option</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead><tbody>
<tr>
<td>event</td>
<td>pinch</td>
<td>Name of the event.</td>
</tr>
<tr>
<td>pointers</td>
<td>2</td>
<td>Required pointers, with a minimal of 2.</td>
</tr>
<tr>
<td>threshold</td>
<td>0</td>
<td>Minimal scale before recognizing.</td>
</tr>
</tbody></table>

**Events:**

* pinch, together with all of below
* pinchstart
* pinchmove
* pinchend
* pinchcancel
* pinchin
* pinchout

##press events##
see: [HammerJS - press recognizers](http://hammerjs.github.io/recognizer-press)
Recognized when the pointer is down for x ms without any movement.

<table class="pure-table pure-table-striped"><thead>
<tr>
<th>Option</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead><tbody>
<tr>
<td>event</td>
<td>press</td>
<td>Name of the event.</td>
</tr>
<tr>
<td>pointers</td>
<td>1</td>
<td>Required pointers.</td>
</tr>
<tr>
<td>threshold</td>
<td>5</td>
<td>Minimal movement that is allowed while pressing.</td>
</tr>
<tr>
<td>time</td>
<td>500</td>
<td>Minimal press time in ms.</td>
</tr>
</tbody></table>

**Events:**

* press

##rotate events##
see: [HammerJS - rotate recognizers](http://hammerjs.github.io/recognizer-totate)
Recognized when two or more pointer are moving in a circular motion.

<table class="pure-table pure-table-striped"><thead>
<tr>
<th>Option</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead><tbody>
<tr>
<td>event</td>
<td>rotate</td>
<td>Name of the event.</td>
</tr>
<tr>
<td>pointers</td>
<td>2</td>
<td>Required pointers, with a minimal of 2.</td>
</tr>
<tr>
<td>threshold</td>
<td>0</td>
<td>Minimal rotation before recognizing.</td>
</tr>
</tbody></table>

**Events:**

* rotate, together with all of below
* rotatestart
* rotatemove
* rotateend
* rotatecancel

##swipe events##
see: [HammerJS - swipe recognizers](http://hammerjs.github.io/recognizer-swipe)
Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.

<table class="pure-table pure-table-striped"><thead>
<tr>
<th>Option</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead><tbody>
<tr>
<td>event</td>
<td>swipe</td>
<td>Name of the event.</td>
</tr>
<tr>
<td>pointers</td>
<td>1</td>
<td>Required pointers.</td>
</tr>
<tr>
<td>threshold</td>
<td>10</td>
<td>Minimal distance required before recognizing.</td>
</tr>
<tr>
<td>direction</td>
<td>DIRECTION_ALL</td>
<td>Direction of the panning.</td>
</tr>
<tr>
<td>velocity</td>
<td>0.65</td>
<td>Minimal velocity required before recognizing, unit is in px per ms.</td>
</tr>
</tbody></table>

**Events:**

* swipe, together with all of below
* swipeleft
* swiperight
* swipeup
* swipedown

##tap events##
see: [HammerJS - tap recognizers](http://hammerjs.github.io/recognizer-tap)
Recognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur between the given interval and position. The eventData from the emitted event contains the property tapCount, which contains the amount of multi-taps being recognized.

If an Tap recognizer has a failing requirement, it waits the interval time before emitting the event. This is because if you want to only trigger a doubletap, hammer needs to see if any other taps are comming in. Read more about [requireFailure](http://hammerjs.github.io/require-failure/).

<table class="pure-table pure-table-striped"><thead>
<tr>
<th>Option</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead><tbody>
<tr>
<td>event</td>
<td>swipe</td>
<td>Name of the event.</td>
</tr>
<tr>
<td>pointers</td>
<td>1</td>
<td>Required pointers.</td>
</tr>
<tr>
<td>threshold</td>
<td>10</td>
<td>Minimal distance required before recognizing.</td>
</tr>
<tr>
<td>direction</td>
<td>DIRECTION_ALL</td>
<td>Direction of the panning.</td>
</tr>
<tr>
<td>velocity</td>
<td>0.65</td>
<td>Minimal velocity required before recognizing, unit is in px per ms.</td>
</tr>
</tbody></table>

**Events:**

* tap
* doubletap
* trippletap


#Properties of eventobject#

All events that Hammer triggers all receive an event object containing the following properties (bold properties are generated by our Event-system):

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
<td>deltaX</td>
<td>Movement of the X axis.</td>
</tr>
<tr>
<td>deltaY</td>
<td>Movement of the Y axis.</td>
</tr>
<tr>
<td>deltaTime</td>
<td>Total time in ms since the first input.</td>
</tr>
<tr>
<td>distance</td>
<td>Distance moved.</td>
</tr>
<tr>
<td>angle</td>
<td>Angle moved.</td>
</tr>
<tr>
<td>velocityX</td>
<td>Velocity on the X axis, in px/ms.</td>
</tr>
<tr>
<td>velocityY</td>
<td>Velocity on the Y axis, in px/ms</td>
</tr>
<tr>
<td>velocity</td>
<td>Highest velocityX/Y value.</td>
</tr>
<tr>
<td>direction</td>
<td>Direction moved. Matches the <code>DIRECTION</code> constants.</td>
</tr>
<tr>
<td>offsetDirection</td>
<td>Direction moved from it's starting point. Matches the <code>DIRECTION</code> constants.</td>
</tr>
<tr>
<td>scale</td>
<td>Scaling that has been done when multi-touch. 1 on a single touch.</td>
</tr>
<tr>
<td>rotation</td>
<td>Rotation that has been done when multi-touch. 0 on a single touch.</td>
</tr>
<tr>
<td>center</td>
<td>Center position for multi-touch, or just the single pointer.</td>
</tr>
<tr>
<td>srcEvent</td>
<td>Source event object, type <code>TouchEvent</code>, <code>MouseEvent</code> or <code>PointerEvent</code>.</td>
</tr>
<tr>
<td>pointerType</td>
<td>Primary pointer type, could be <code>touch</code>, <code>mouse</code>, <code>pen</code> or <code>kinect</code>.</td>
</tr>
<tr>
<td>eventType</td>
<td>Event type, matches the <code>INPUT</code> constants.</td>
</tr>
<tr>
<td>isFirst</td>
<td><code>true</code> when the first input.</td>
</tr>
<tr>
<td>isFinal</td>
<td><code>true</code> when the final (last) input.</td>
</tr>
<tr>
<td>pointers</td>
<td>Array with all pointers, including the ended pointers (<code>touchend</code>, <code>mouseup</code>).</td>
</tr>
<tr>
<td>changedPointers</td>
<td>Array with all new/moved/lost pointers.</td>
</tr>
<tr>
<td>preventDefault</td>
<td>Reference to the <code>srcEvent.preventDefault()</code> method. Only for experts!</td>
</tr>
</tbody></table>


#Extending gesture-events#

Once this module is integrated, `Event` has two members that can be used to control gesture-events:

* **Event.Hammer**: reference to the Hammer-Class
* **Event.hammertime** the Hammer-instance which is responsible for handling all gesture-events

These are automaticly created. You can use these to finetune gesture-events or to define new gesture-events.

##Add gesture-event##
You can add custome gesture-events. Event.hammertime comes with the default set of events with extra `doubletap` and `tripletap` events. You can extend the set of events by adding custom gesture-events.

####Example adding quadrotap event####
```js
quadrotap = new Event.Hammer.Tap({ event: 'quadrotap', taps: 4 });
Event.hammertime.add(quadrotap);

singletap = Event.hammertime.get('tap');
doubletap = Event.hammertime.get('doubletap');
tripletap = Event.hammertime.get('tripletap');

quadrotap.recognizeWith([tripletap, doubletap, singletap]);
```

##Finetuning events##
You can finetune your events. Just get them from **Event.hammertime** and change its properties.

For example, doubletapping will emit a doubletap event and two singletap events. To prevent this, use Event.Hammer.[requireFailure](http://hammerjs.github.io/require-failure/) on both doubletap and tripletap. Not however, that a tap-event (single) will always wait until it is sure there was no double or tripletap. Therefore the userexperience will be slowered down.

####Example doubletap without singletap####
```js
singletap = Event.hammertime.get('tap');
doubletap = Event.hammertime.get('doubletap');
tripletap = Event.hammertime.get('tripletap');

singletap.requireFailure([tripletap, doubletap]);

Event.after('tap', showMsgSingle, '#buttongo');
Event.after('doubletap', showMsgDouble, '#buttongo');
```


#HammerJS Documentation#

Read more about how to get more out of HammerJS in its [API](http://hammerjs.github.io/getting-started/). Remember that you can use all stuff, <u>but should not create your own Hammer-instance</u>. Use the Hammer-instance available at Event.hammertime**.