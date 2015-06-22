---
module: event
maintainer: Marco Asbreuk
title: After save-event
intro: "After-events will not wait for any asynchronous default-function to finish, to keep performant. However, you can inspect e.returnValue: whenever that is a Promise, this Promise can be used to get informed when the default-function is ready."
---

<style type="text/css">
    #container {
        margin: 2em 0;
        min-height: 2em;
    }
    #container button {
        margin-top: 0.5em;
        min-width: 16em;
    }
    #target-container {
        margin: 2em 0;
        padding: 1em;
        min-height: 3.6em;
        background-color: #ddd;
    }
</style>

Click on the button to send profile.

<div id="container">
    <button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Send profile</button>
</div>
<div id="target-container"></div>

Code-example:

```js
<script src="itsabuild-min.js"></script>
<script>
    var Member = ITSA.Classes.createClass(),
        url = 'http://servercors.itsa.io/example/delay',
        member;


var memberproto = {}.merge(ITSA.Event.Listener).merge(ITSA.Event.Emitter('PersonalProfile')),
    container = document.getElementById('target-container'),
    member = Object.create(memberproto);
    member.name = 'Marco';

    member.defineEvent('send') // defines "PersonalProfile:save"
         .defaultFn(function(e) {
             // do something and optionally return
             return ITSA.IO.send(url, this); // now available at e.returnValue
         });

    member.after('this:send', function(e) {
        container.innerHTML = 'starting sending...';
        e.returnValue.then(
            function(response) {
                container.innerHTML = response;
            },
            function(err) {
                container.innerHTML = err.message;
            }
        );
    });

    ITSA.Event.after(
        'tap',
        function() {
            member.emit('send');
        },
        '#buttongo'
    );
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var Member = ITSA.Classes.createClass(),
        url = 'http://servercors.itsa.io/example/delay',
        member;


var memberproto = {}.merge(ITSA.Event.Listener).merge(ITSA.Event.Emitter('PersonalProfile')),
    container = document.getElementById('target-container'),
    member = Object.create(memberproto);
    member.name = 'Marco';

    member.defineEvent('send') // defines "PersonalProfile:save"
         .defaultFn(function(e) {
             // do something and optionally return
             return ITSA.IO.send(url, this); // now available at e.returnValue
         });

    member.after('this:send', function(e) {
        container.innerHTML = 'starting sending...';
        e.returnValue.then(
            function(response) {
                container.innerHTML = response;
            },
            function(err) {
                container.innerHTML = err.message;
            }
        );
    });

    ITSA.Event.after(
        'tap',
        function() {
            member.emit('send');
        },
        '#buttongo'
    );
</script>