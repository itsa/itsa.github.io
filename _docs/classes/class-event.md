---
module: js-ext
functionality: Classes
maintainer: Marco Asbreuk
title: Events listener on classes
intro: "This example shows how Classes have event-listeners (at their prototype). By default, Classes don't have event-emitter method: they need to be set up per Class, or you could emit using ITSA.Event.emit(). If we would have used the after-listener, then both instances would react on the <b>president.*</b>-events. Because we listen through the <b>selfAfter</b>-events (only for Class-instances), we make sure the instance reacts only when e.target equals itself."
---

<style type="text/css">
    #btn1, #btn2 {
        display: block;
        min-width: 10em;
    }
    #cont {
        border: solid 1px #000;
        padding: 1em;
        min-width: 10em;
        min-height: 3em;
        display: block;
        margin-top: 1em;
    }
</style>

Click on the buttons to make the users speak or be silent.

<button id="btn1" class="pure-button pure-button-bordered">Bill Clinton</button>
<button id="btn2" class="pure-button pure-button-bordered">Barack Obama</button>

<div id="cont"></div>


<p class="spaced">Code-example:</p>

```html
<body>
    <button id="btn1" class="pure-button pure-button-bordered">User 1</button>
    <button id="btn2" class="pure-button pure-button-bordered">User 2</button>
    <div id="cont"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#cont'),
        User, user1, user2;

    User = ITSA.Classes.createClass(
        function(name) {
            this.name = name;
            this.selfAfter('user:speak', this.sayHello);
            this.selfAfter('user:besilent', this.sayGoodBye);
            this.isSpeaking = false;
        },
        {
            sayHello: function() {
                container.setHTML(this.name+' says Hello');
            },
            sayGoodBye: function() {
                container.setHTML('Bye bye, '+this.name+' is leaving');
            }
        }
    );

    user1 = new User('Bill Clinton');
    user2 = new User('Barack Obama');


    ITSA.Event.after('click', function(e) {
        var user = (e.target.getId()==='btn1') ? user1 : user2;
        if (user.isSpeaking) {
            ITSA.Event.emit(user, 'user:besilent');
        }
        else {
            ITSA.Event.emit(user, 'user:speak');
        }
        user.isSpeaking = !user.isSpeaking;
    }, '#btn1, #btn2');

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#cont'),
        User, user1, user2;

    User = ITSA.Classes.createClass(
        function(name) {
            this.name = name;
            this.selfAfter('president:speak', this.sayHello);
            this.selfAfter('president:besilent', this.sayGoodBye);
            this.isSpeaking = false;
        },
        {
            sayHello: function() {
                container.setHTML(this.name+' says Hello');
            },
            sayGoodBye: function() {
                container.setHTML('Bye bye, '+this.name+' is leaving');
            }
        }
    );

    User.mergePrototypes(ITSA.Event.Emitter('president'));

    user1 = new User('Bill Clinton');
    user2 = new User('Barack Obama');

    ITSA.Event.after('click', function(e) {
        var user = (e.target.getId()==='btn1') ? user1 : user2;
        if (user.isSpeaking) {
            user.emit('besilent');
        }
        else {
            user.emit('speak');
        }
        user.isSpeaking = !user.isSpeaking;
    }, '#btn1, #btn2');

</script>
