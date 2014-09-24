---
module: event
version: 0.0.1
maintainer: Marco Asbreuk
title: Events
intro: "The event-module provides APIs for working with events through the static Class Event. Emitting and listening to events can be done at the highest level: Event. This is place where all events emit to. Also, any object or instance can emit or listen to an event by merging the propriate methods. Both user-defined events as well as the browser's DOM event system are handled by Event."
firstpar: get-started
---

<b>Step 1:</b> create package.json

```json
{
    "name": "my-project",
    "version": "0.0.1",
    "dependencies": {
        "event": "Parcela/event"
    }
}
```

<b>Step 2:</b> create your webapplication like this:

```js
<script>
    var Event = require('event'),
        myProfile = new Profile({name: Marco});

    Event.after('PersonalProfile:save', function(e) {
        // handle the event
    }, myProfile)
</script>
```

#The Basics#

##Event lifecycle##

Events could be used with a:

* 1-step eventsystem (only after-phase like within Nodejs)
* 2-step eventsystem (before-phase and after-phase)
* 3-step lifecycle (before-, action- and after-phase)

When events are emitted, they go through 3 phases: `before`-, `action`- and an `after`-phase. However, if the specific event was not defined as a [customEvent](#defining-customevents), the action-phase is skipped. Without any before-subscribers, the before-phase is skipped.

###Before phase###

Whenever an event is emitted, all the `before`-subscribers will be called first in the order in which they subscribed, unless the subscription took place with _prepend=true_ (see API). The `before`-listeners can call any of the methods listed [above](#e.preventdefault(),-e.halt()-and-e.preventrender()) to alter the execution of the event lifecycle. They also have access to the payload so they can make decisions based on the information in it and can also add or modify information contained in it for later subscribers.


Since any `before`-subscriber can interrupt the chain of execution of an event, in this stage, the eventobject should not be used to learn about an event that has happened (because at that point it might not) but to vote on its happening or adding information about it.


###Default action###

If none of the `before`-listeners interrupted the chain of processing, the default action (`defaultFn`) gets invoked, if present. For custom events, the default action can be defined with the `defaultFn()-method` of the `defineEvent()`-object (see [Defining Custom Events](#defining-customevents)). The `defaultFn` method will be called with the payload as modified by any of the previous `before` listeners.

Any value the defaultFn returns, will be made available at the event object through the `returnValue`-property. Promises may be returned, but <u>the eventcycle does not wait for Promises to resolve</u>. However, they can be inspected in the after-listeners, who can wait for _e.returnValue_ to resolve.


###Prevented action###

If any `before`-listener has interrupted the processing by calling e.preventDefault() on the eventobject, the method passed via the `preventedFn()`-method will be called instead of the `defaultFn`. See [Defining Custom Events](#defining-customevents) how to setup the preventedFn.


###After phase###

Once the event has been executed, the `after`-event listeners will be called. The extra methods of the eventobject are no longer be available. Any `after`-listener may change the eventobject but that is not recommended as all `after`-listeners should see the same eventobject.

##emitterName:eventName##

Events are identified by their `customEvent-name`, which has the syntax: **emitterName:eventName**. One emitterName is reserved: **"UI"** which identifies DOM events. Except for `UI` as emitterName, any name can be choosen for emitterName as well as eventName, as long as it consist of ASCII word characters (regular expression: `\w+`).

###emitterName###
The `emitterName` is usually the _entity_ that emits the event. You can setup an instance that can emit events, and that instance is labeled by its emittername. For example: an instance with the emittername: _PersonalProfile_, might emit events like _PersonalProfile:read_, _PersonalProfile:create_ and _PersonalProfile:update_. The emitterName is eventobject's property: e.**emitter**.

###eventName###
The `eventName` is something that has happened to the emitter. It is the second part of the customEvent, after the colon. The eventName tells what action occured, f.e. `PersonalProfile:save` tells that _save_ happened. The eventName is eventobject's property: e.**type**.

###usage###

Using this technique, Event subscribers can tell apart savings of _PersonalProfile_ record from _Picture_ records, for they are coming from different emitters and have a different emitterName. You can subscribe to 'Picture:save' or 'PersonalProfile:save' to make the distinguish. Usually, the _emitterName_ is the name of the class-instance or object who produced the event, but the developer is free to choose any naming convention (see [below](#emitter-doesn't-need-to-be-the-owner-of-emmitername)).

When subscribing to events, you need to subscribe using the naming convention **`emitterName:eventName`**. However, there are some rules that make subscription easier and very flexible:

* **Using wildcards for the customEvent-name**
    When subscribing to an event, a star `*` can replace any or both of the parts as a wildcard. Thus, _myMembers.after('*:save')_ subscribes to save-events of any emitter. Or subscription to all events of the "PersonalProfile"-emitter, can be done by _myMembers.after('PersonalProfile:*')_.

##Event-subscription##

Event is meant to be used as a delegated eventsystem: all events bubble up to Event. This means: whatever instance subscribes to any events, subscription just works.

####eventsubscription using Classes####
```js
var Members = Object.createClass(null, Event.Listener),
    myMembers = new Members();
myMembers.after('PersonalProfile:save', function(e) {
    alert('personal profile is saved');
});
```

####eventsubscription using Objects####
```js
var membersproto = Event.Listener,
    myMembers = Object.create(membersproto);
myMembers.after('PersonalProfile:save', function(e) {
    // this === myMembers
    // e.target === the instance of the member who emitted the event
    // e.type === 'save'
    // e.emitter === 'PersonalProfile'
});
```

###Callback###

In the [example above](#eventsubscription-using-objects), the `callback`-function is also names the `event-subscriber`. This could be an anonymous function, or by reference:

####subscribe by reference####
```js
var afterClick = function(e) {
    // this === myMembers
    // e.target === the instance of the member who emitted the event
    // e.type === 'save'
    // e.emitter === 'PersonalProfile'
};
myMembers.after('click', afterClick, '#buttongo');
```

**Note:** this example assumes `event-dom` is included, for that module makes dom-events emit `click` to this event-module.

###Event-object###

The subscriber always gets invoked with one argument: the `eventobject`. This object holds valuable information:

* **e.target** --> instance or node who emitted the event
* **e.type** --> the eventName, for example 'click'
* **e.emitter** --> the emitterName, for example 'UI' for all DOM-events
* **e.returnValue** --> the returnValue of the defaultFn
* **e.status** --> any information about what happened to the event

**e.status** itself is an object with the following properties:

* e.status.**ok** --> `true | false` whether the event got executed (not halted or defaultPrevented)
* e.status.**defaultFn** _(optional)_ --> `true` if any defaultFn got invoked
* e.status.**preventedFn** _(optional)_ --> `true` if any preventedFn got invoked
* e.status.**halted** _(optional)_ --> `reason | true` if the event got halted and optional the why
* e.status.**defaultPrevented** _(optional)_ -->  `reason | true` if the event got defaultPrevented and optional the why
* e.status.**unSilencable** _(optional)_ -->  `true` if the event cannot be made silent


####examine the eventobject inside an after-subscriber####
```js
var afterClick = function(e) {
    var node = e.target;
    // you can do anything with the node now
};
Event.after('click', afterClick, '#buttongo');
```

####examine the emit-method####
```js
Profile.mergePrototypes(Event.Emitter('PersonalProfile'));
var eventobject = myProfile.emit('save');
if (eventobject.status.ok) {
    // eventobject.status.halted --> tells if the event got halted and why
}
```

###Context###
As the examples above show: the `context` within the subscribers equals the object that did the subscription. This becomes very handy when you create Class-instances. The subscribers still get executed within the object-instance's context:

```js
var MyMembers = Object.createClass(
    // Constructor:
    function (config) {
         this.after('click', this.onClick, '#buttonGo');
    },
    // Prototype members:
    {
        onClick: function (e) {
            alert('personal profile is saved');
            // note: context is the object-instance
        }
    }
).mergePrototypes(I.Event.Listener);
```

###Combined subscriptions##
You can easily create one subscription to multiple events. To do so, pass in an array of customEvents instead of one:

####create combined subscriptions####
```js
var afterClick = function(e) {
    var node = e.target;
    // you can do anything with the node now
};
myMembers.after(['click', 'dblclick'], afterClick, '#buttongo');
```

If you create a [once-subscriber](#one-time-subscriptions-oncebefore()-and-onceafter()), the subscriber only gets invoked once at a total. Thus, if the click-event happened, the subscriber gets invoked, but it won't be invoked again on a dblclick-event.


##defaultFn and preventedFn##

Some events (not all) have a `defaultFn` or even a `preventedFn`. Typically, some DOM-events come with a defaultFn. For instance: clicking on an anchor-element will navigate to its href-location. HTML-forms will load the page defined by the action-attribute. Both cases are executed by their defaultFn.

DefaultFn's can be prevented by calling `e.preventDefault()` in any before-subscriber. In such a case, not the _defaultFn_ gets invoked, but the _preventedFn_ (if defined).

DOM-events have no preventedFn. Custom Events created by [#Event.defineEvent()](#defining-customevents) on the other hand can.


##Special features##

###The filter-argument###
The optional `filter`-argument is meant to filter before the subscriber gets invoked. This [example above](#eventsubscription-using-objects) makes the subscriber only to be invoked on clicks on an html-element with the id: _#buttongo_. It doesn't invoke on clicks of other elements.

The filter-argument can be a String-type of Function. In case of a String, a `css-selector` is assumed. In case of a function, you are free to set it up any way you like. The function recieves the eventobject as its only argument, which can be inspected to descide how the function returns. Return **true** to make pass the filter.

###Before-subscribers and after-subscribers###

Mostly you would subscribe through the `after`-subscriber. This subscriber only gets invoked when the event <u>did happen</u>. Indeed, events may be interupted: this is exactly where the `before`-subscribers come in the game.


Before-subscribers also get invoked when the event happens, but they get invoked <u>before</u> the event's `defaultFn` takes place. Here, you can manipulate the eventobject, or change the event-lifecycle ([see below](#halt-the-event-inside-the-before-subscriber)). The following example shows how to manipulate the eventobject:


####manipulating the eventobject inside before-subscriber####
```js
var beforeClick = function(e) {
    e.clientAge = 23;
};
var afterClick = function(e) {
    // e.clientAge --> 23
};
myMembers.before('click', beforeClick, '#buttongo');
myMembers.after('click', afterClick, '#buttongo');
```

After-subscribers always get invoked <u>after</u> the before-subscribers and after the defaultFn (if any).


###e.preventDefault(), e.halt() and e.preventRender()###

The eventobject has several methods which can change the event-lifecycle, for instance:

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

The `eventobject` holds these methods that can be invoked (only inside the before-subscribers):

* e.**halt**(reason) stops further processing the eventchain: no more subscribers get invoked (nor before- neither after) and no defaultFn or preventedFn gets invoked
* e.**preventDefault**(reason) all beforesubscribers keep getting invoked, and the events preventedFn gets invoked. The defaultFn will not be invoked, neither any aftersubscribers.
* e.**preventRender**(reason) maked the virtualDOM not to re-render the true DOM

By passing `reason` to the method, the eventobject is extended with extra information into its _e.status_-property. This won't be useful inside any after-subscribers (for they are not invoked), but it could be inside the preventedFn, or when you use the returned object that emit() creates. See the [example above](#examine-the-emit-method).

###One time subscriptions onceBefore() and onceAfter()###

Sometimes, you only need a subscription the first time the event occurs. You can use `onceBefore()` or `onceAfter()` instead of before()/after() and <u>the subscriber gets detached automaticly when the event occurs</u>.

You can also detach these subscriptions yourself if you need, which is only effective before the event occured.


##Keep the memory healthy: detach()##

Whenever you subscribe to an event, the instance and subscriber are stored inside a private array, so the subscriber can be invoked. When you don't longer need the subscriber, or the instance who subscribred, you <u>must remove the subscription</u>. Otherwise the Garbage Collector cannot cleanup the instance and you'll end up with a memory-leak.

Unsubscribing can be done using `detach()` in these 3 different ways:

* **By using the eventhandler**
        Whenever you subscribe using .before() or .after(), you get an object in return (the `eventhandler`). This object has the method .detach(). [This example](#detach-subscriber-using-the-evenhandler) shows how to use the eventhandler.

* **Event.detach(instance, customEvent)** or **Event.detachAll(instance)**
        Using `Event.detach(instance, customEvent)` unsubscribes the supscription to the specified customEvent this instance made. `Event.detach(instance)` unsubscribes all subscriptions of this instance.

* **instance.detach(customEvent)** or **instance.detachAll()**
        If you merged Event.Listener to the instance (see [Listening for events](#listening-for-events)), then you can use the detach-methods on the instance.


####detach subscriber using the evenhandler####
```js
var afterClick = function(e) {
    var node = e.target;
};
var clickHandler = myMembers.after('click', afterClick, '#buttongo');

// when no longer needed:
// unsubscribe by calling detach() on the eventhandler:
clickHandler.detach();
```


#Emitting events#

Events can be emitted through a Class-instance/object (by merging `helper-functions`), or by using `Event.emit()`. Both ways have their advantages.

##Using .emit() on the Class-instance/object##

By emitting (or triggering or fireing) an event through the Class-instance or object, you don't need to specify the emitterName and emitterInstance (e.target) all the time. By default, `emitterName` is defined by the instance. In order to so so, you should merge **Event.Emitter('emitterName')** to the Class-instance or object. By doing this, the instances will have the following methods added:

* **emit()** --> to emit an event
* **defineEvent()** --> to add special behavior to an event to be emitted, see [Defining Custom Events](#defining-customevents)
* **undefEvent()** --> undefines an event that was defined with defineEvent
* **undefAllEvents()** --> undefines all events who were defined with defineEvent by this instance


**Important note:** Merging can be done at the <u>prototype</u> or at the <u>instance</u> itself. If you only have one instance, it doesn't really matter which one to choose. When you have a dozen of them, it is strongly recomended to merge the prototype. This way you keep on working with small instances. The examples below show how merging should be done at the prototype.

####emitting event through a Class-instance####
```js
Profile.mergePrototypes(Event.Emitter('PersonalProfile'));
var myProfile = new Profile({name: Marco});
myProfile.emit('save');
```

####emitting event through plain object####
```js
var profileproto = Event.Emitter('PersonalProfile'),
    myProfile = Object.create(profileproto);
myProfile.name = 'Marco';
myProfile.emit('save');
```
Emitting through the instance is very handy, because you have quick access to the emit-method and you don't need to specify the emitterName on every emission.

##Using Event.emit()##

Emitting an event can also be done using the **emit()**-method of Event. This is the suggested way when you have a huge number of objects, which you would like to keep lightweighted, yet they need to be able to emit events. Just keep them as plain objects. As an alternative, you could create these objects having the emitter-helper as prototype (see [example above](#emitting-event-through-plain-object)), but sometimes the objects are already created and you can't redefine the prototype:

####emitting event on behalf of plain object####
```js
IO.readObject('http://somedomain.com?groupId=1').then(
    function(groupitems) {
        // groupitems is an array with objects.
        // this already got JSON-parsed
        var item = groupitems[25];
        item.src = 'newimage.jpg';
        // item has a different src --> now we emit the changes:
        Event.emit(item, 'image:change');
    }
);
```

Subscribers of the event _"PersonalProfile:save"_ will get the event-object with these properties:

* **e.target** --> myProfile
* **e.type** --> "save"
* **e.emitter** --> "PersonalProfile"
* **e.returnValue** --> undefined (no defaultFn)


**Important note:** You could skip passing an object as first argument. By doing so, the event does get fired, but e.target becomes Event itself. This might or might not be what you want.

##emit() returns eventobject##
If you call emit() either thrhough Event.emit() or the instance, you get the eventobject in return if the veent trully happened (not halted or preventDefaulted).

###Take one-time action###
Because of this behaviour, you can emit an event and take action upon this specific emission:

####emitting event and take action####
```js
var e = Event.emit('MyProfile:save');
if (e) {
    // even did occur
}
```

##Silent events##
Silent events are events that only invoke the defaultFn. No event-subscribers or finalization-subscribers are called. You can make an event silent, by passing the appropriate payload when emitting:

####emitting event silently####
```js
Event.emit('MyProfile:save', {silent: true});
```

##DOM-events##

**Note:** DOM-events can only be subscribed to when the module **`event-dom`** is included.

DOM-events are autmaticly emitted by the UI-interface. But they can also be emitted manually using the **.emit()**-method.
This is a sort of simulating DOM-events, but not exactly:

* Be aware that emitting through Event.emit('UI:click') makes e.target the Event-instance.
* Emitting this way is not true simulating. Any subscriber does get invoked, but <u>the original default-function does not get invoked</u>.

####simulate DOM-events####
```js
var myButton = Parcela.one('#someButton');
if (myButton) {
    Event.emit(myButton, 'click');
}
```

Emitting DOM-events should be avoided. You should create a webapp where userinteraction leads to UI-events.

#Listening for events#

Listening for events can be done using the methods:

* **before()**
* **after()** or **on()**
* **onceBefore()**
* **onceAfter()** or **once()**

For clearness, it is suggested _not to use `on` and `once`_. These are aliases to the `after`- and `onceAfter`-method, and exist to keep consistency with Nodejs. Using _after()_ is more expressive in a way it tells you in what pahse you really are in. These methods are available through Event, or they can be merged into Classes or instances.

##Using .before() and .after() on the Class-instance/object##

The prefered way to listen for events is through the Class-instance or object. This also gives you objectmethods to detach subscribers made by this instance at once.

In order to so so, you should merge **Event.Listener** to the Class-instance or object. By doing this, the instances will have the following methods added:

* **before()** --> subscribe to an event, before the defaultFn occurs
* **after()** --> subscribe to an event, after the defaultFn has occured
* **onceBefore()** --> subscribe to an event, before the defaultFn occurs, unsusbcribes automaticly at the first succesfully emission
* **onceAfter()** --> subscribe to an event, after the defaultFn has occured, unsusbcribes automaticly at the first succesfully emission
* **detach()** --> unsusbcribes the specified subscriber
* **detachAll()** --> unsusbcribes all subscribers that were sunscribed by this instance


**Important note:** Merging can be done at the <u>prototype</u> or at the <u>instance</u> itself. If you only have one instance, it doesn't really matter which one to choose. When you have a dozen of them, it is strongly recomended to merge the prototype. This way you keep on working with small instances. The examples below show how merging should be done at the prototype.

####subscribe to an event through a Class-instance####
```js
Members.mergePrototypes(Event.Listener);
var myMembers = new Members();
myMembers.after('PersonalProfile:save', function(e) {
    // this === myMembers
    // e.target === the instance of the member who emitted the event
    // e.type === 'save'
    // e.emitter === 'PersonalProfile'
});
```

####subscribe to an event through plain object####
```js
var membersproto = Event.Listener,
    myMembers = Object.create(membersproto);
myMembers.after('PersonalProfile:save', function(e) {
    // this === myMembers
    // e.target === the instance of the member who emitted the event
    // e.type === 'save'
    // e.emitter === 'PersonalProfile'
});
```

##Using Event.before() and Event.after()##

Listening for events could be done through the `Event` as well. Using the **before()**- and **after()**-methods, where you need to specify the context at the third argument:

####listening for events using Event.after()####
```js
var myProfile = new Profile({name: Marco});
Event.after('PersonalProfile:save', function(e) {
    // handle the event
}, myProfile);
```

###Listener context###

All event listeners and the default action (`defaultFn`) are executed in the context of the listener, so they can have easier access to its own properties and methods. The context can be passed through as the 1st argument (see the API). If you ommit the listener -and give the _customEvent_ as first parameter- then the context will be Event itself. This is what happened in all examples before Example 10.

##Filtering the subscriber##
You probably don't want the subscriber to get invoked on _all eventName-events_. Therefore subscriber can be filtered by 2 different ways, which can be combined:

###Filter by emitter###
This is the most convenient and quickest way. You just listen to the correct **customEvent**, which is defined as `emitterName:eventName`
####Listening to specific emitter####
```js
myMembers.after('PersonalProfile:save', function(e) {
    ...
});

myMembers.after('PersonalActions:save', function(e) {
    ...
});
```

###Filter by filter-argument###
The filter-argument can also be used to filter before invocation of the subscriber. Mostly this will be used with DOM-events.

The filter-argument can be a String-type of Function. In case of a String, a `css-selector` is assumed. In case of a function, you are free to set it up any way you like. The function recieves the eventobject as its only argument, which can be inspected to descide how the function returns. Return _true_ to make pass the filter.

####Listening to specific emitter####
```js
var MyClass = Object.createClass(
    // Constructor:
    function (config) {
         this.after('Person:save', this.onPersonSave, this.onPersonSaveFilter);
         this.after('click', this.onButtonClick, '#buttongo');
         // whatever else
    },
    // Prototype members:
    {
        someProperty: 1,
        someMethod: function () {
        },
        onButonClick: function (e) {
             var buttonnode = e.target;
             // do whatever
        },
        onPersonSave: function (e) {
             var personModel = e.target;
             // do whatever
        },
        onPersonSaveFilter: function (e) {
             var personModel = e.target;
             if ( /*some condition  involving personModel*/ ) return true;
        }
    }
).mergeProperties(Event.Listener);
```

##Careful when listening without the emitterName##

**Important note:** While emitters may omit the _emitterName-part_ when calling the emit()-method if they have previously defined the event through _.defineEmitter()_, if an event listener omits the _emitterName-part_, **`UI` will be assumed**.

####listening to an event that never occurs####
```js
myMembers.after('save', function(e) {
    // the `callback` will never be invoked as the DOM will never emit a `save`-event
});
```

Though the next example shows two subscribers which both work well and are basicly the same:

####successfully listening to DOM-events####
```js
myMembers.after('click', function(e) {
    // this === myMembers
    // e.target === the DOM-node
    // e.type === 'click'
    // e.emitter === 'UI'
});
myMembers.after('UI:click', function(e) {
    // this === myMembers
    // e.target === the DOM-node
    // e.type === 'click'
    // e.emitter === 'UI'
});
```


#DOM-events#

The eventsystem can handle both Custom-events as well as DOM-events. They are handled in the same way. To enable DOM-events, the `event-dom`-module should be included.


#Defining customEvents#

Events can be emitted right out of the box. However, is you want them more powerful, or more specific, you can define them first. By defining a customEvent, you can add make use these fascilities:

* Define a defaultFn
* Define a preventedFn
* PreventDefault inside before-subscribers
* PreventRender of the DOM (by the vDOM- inside before-subscribers


Customevents can be defined by using the `defineEvent()`-method, which is available on Event or any object that got merged with Event.Emitter. Every customEvent **needs to conform the syntax "emitterName:eventName"**. If you use _defineEvent_ on an instance -which got extended with Event.Emitter-, you don't need to pass the emitterName. When invoking this method, you need to pass the applyable `emitterName` as its only parameter. After invocation of _defineEvent()_, you can invoke more options in a chained way:

* **defaultFn()** --> the default-function of the event
* **preventedFn()** --> the function that should be invoked when the event is defaultPrevented
* **unPreventable()** --> makes the customEvent's defaultFn cannot be prevented
* **unRenderPreventable()** --> makes that the customEvent's render cannot be prevented
* **forceAssign()** --> overrides any previous definition


####define a customEvent through Event####
```js
Profile = Object.createClass(null, ITSA.Event.Emitter('PersonalProfile'));
myProfile = new Profile({name: 'Marco'});

myProfile.defineEvent('save') // defines "PersonalProfile:save"
         .defaultFn(function(e) {
             // do something and optionally return
             return true; // now available at e.returnValue
         })
         .preventedFn(function(e) {
             // do something
             console.warn('prevented');
         });

Event.emit(myProfile, 'PersonalProfile:save'); // emits "PersonalProfile:save"
```

####define a customEvent through an instance####
```js
Profile.mergePrototypes(Event.Emitter('PersonalProfile'));
var myProfile = new Profile({name: Marco});

myProfile.defineEvent('save') // defines "PersonalProfile:save"
         .defaultFn(function(e) {
             // do something and optionally return
             return true; // now available at e.returnValue
         })
         .preventedFn(function(e) {
             // do something
             console.warn('prevented');
         });

myProfile.emit('save'); // emits "PersonalProfile:save"
```

##Undefine customEvent definitions##

If you don't need the customEvent-definition anymore, you can _undefine_i> it by using `undefEvent()`, which is available on Event or any object that got merged with Event.Emitter. To undefine all customEvents an instance made, use `undefAllEvents()`.


##Delayed defineEvent() using "subscriber notification"##

Modules may want to delay customEvent-definitions until it is actually needed. To do that, they can ask the event system to tell them when any other instance has subscribed this particular customEvent. DOM-events also define themselves this way.

####delayed eventDefine()####
```js
var myProfile = new Profile({name: Marco});

Event.notify('PersonalProfile', function(eventinstance, customEvent) {
    // customEvent === "PersonalProfile:"+eventName
    eventinstance.defineEvent(customEvent)
             .defaultFn(function(e) {
                 // do something and optionally return
                 return true; // now available at e.returnValue
             })
             .preventedFn(function(e) {
                 // do something
                 console.warn('prevented');
             });
});

myMembers.after('PersonalProfile:save', function() {...}); // makes 'PersonalProfile:save' to register its customEvent
```


#Handling asynchronicity#

To stay high-performant, this eventsystem does not wait for any Promises to return, neither in the subscribers, nor in the defaultFn's. However, you can make the defaultFn to return a Promise and inspect its value in any after-subscriber:

####take action after Promise-result####
```js
Members.mergePrototypes(Event.Listener);
var myMembers = new Members(),
    profileproto = Event.Emitter('PersonalProfile'),
    myProfile = Object.create(profileproto),
    uri = '/loaddata';

profileproto.defineEvent('load')
            .defaultFn(function(e) {
                var model = e.target;
                return Parcela.io.getObject(uri+'?id='+model.id).then(
                    function(response) {
                        model.merge(response);
                        return response; // pass it through to any subscriber
                    }
                );
            });

myProfile.id = 1;
myProfile.emit('load');

myMembers.after('PersonalProfile:load', function(e) {
    var loadpromise = e.returnValue;
    loadpromise.then(
        function(response) {
            // we know myProfile has loaded all its data
            // the same data is available inside "response"
        }
    );
});
```

#Emitter doesn't need to be the owner of emmiterName#

Most of the time, the emitter is the object that is labeled by its emitterName. However, in some circumstance, you might want to emit a specific customEvent ("emitterName:eventName") by another instance. Like emitting on behalf of another emitterName. You can do this by fully describe the customEvent, even if the emitter has its own -different- emitterName:


####emitting event with different emitterName####
```js
RedProfile.mergePrototypes(Event.Emitter('RedProfile'));
ProfileContainer.mergePrototypes(Event.Emitter('ProfileContainer'));

var myProfile = new RedProfile({name: Marco});
var myProfileContainer = new ProfileContainer();

Event.after('RedProfile:save', function(e) {
    // e.target === myProfileContainer
    // e.type == 'save'
    // e.emitter = 'RedProfile'
});

// force emit with emitterName 'RedProfile' instead of its default 'ProfileContainer'
myProfileContainer.emit('RedProfile:save');
```


#Creating Synthetic Events#

Synthetic Events are very easily created. Just listen for any event under specific circumstances, and fire you new synthetic event:

####creating "pureenabledclick"-event####
```js
Event.after(
    'click',
    function(e) {
        // once here, the button was enabled
        Event.emit(e.target, 'pureenabledclick', e);
    },
    window,
    function(e) {
        // we are only interested in buttons who don't have
        // the .pure-button-disabled className
        var node = e.target;
        return !node.hasClass('pure-button-disabled');
    }
);
```


#Naming conventions#

It is sometimes confusing to separate different terms. Below is a short list of naming-conventions to help here:

* **payload**
    Extra object that is passed when an event is emitted. The payload gets merged into the eventobject.

* **eventobject**
    The object that passes through the event lifecycle. The eventobject always has some default-properties which are generated at the start of any event. Thse properties can be extended by a emit-payload, or manipulated inside subscribers.

* **customEvent**
    Eventdescription defined with the syntax 'emitterName:eventName'. Any defined event is a customEvent: both DOM-events as well as "Custom Made Events".

* **Custom made event**
    An customEvent that was created through Event.defineEvent().

* **eventName**
    Second part of the customEvent. The eventName is like the action of the event and available at e.type.

* **emitterName**
    First part of the customEvent. The emitterName is the identification of the owner of the action (eventName) and available at e.emitter.

* **e.target**
    The object that emitted the event. Most of the time e.target will be the instance with the emittename sent. You may also see it as the source. We would have prefered to call it e.src, but the DOM uses e.target so we kept using it.

* **e.type**
    Equals the eventName. We would have prefered to call it e.Eventname, but the DOM uses e.type so we kept using it.

* **subscribe v.s. listen to events**
    Formally spoken, you can listen to events by create a subscription to them (adding a subscriber).

* **Event-listener v.s. Event-subscriber**
    These are the same.

* **Eventhandle**
    Handle that you get back when you subscribe to an event. This hande can be used to unsubscribe.
