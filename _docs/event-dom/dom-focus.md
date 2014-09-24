---
module: event-dom
maintainer: Marco Asbreuk
title: Focussing DOM-nodes
intro: "All DOM-events are trully delegated. This means we can set up only <b>one subscriber</b> for all focus-events. Also notice how we prevent-default the submitbutton and focussed in instead, so we still get a focus-message on that button."
---

<style type="text/css">
    #form-container {
        margin-top: 2em;
        min-height: 2.1em;
        border: solid 1px #333;
        padding: 1em;
    }
    #msg-container {
        margin: 2em 0;
        padding: 1em;
        background-color: #ddd;
    }
    #msg-blur, #msg-focus {
        min-height: 2em;
    }
</style>

Focus the formelements and see what element got the focus.

<div id="msg-container">
    <div id="msg-blur"></div>
    <div id="msg-focus"></div>
</div>

<form id="form-container" class="pure-form pure-form-aligned">
    <fieldset>
        <div class="pure-control-group">
            <label for="name">Username</label>
            <input id="name" type="text" placeholder="Username">
        </div>

        <div class="pure-control-group">
            <label for="password">Password</label>
            <input id="password" type="password" placeholder="Password">
        </div>

        <div class="pure-control-group">
            <label for="email">Email Address</label>
            <input id="email" type="email" placeholder="Email Address">
        </div>

        <div class="pure-controls">
            <label for="checkbox" class="pure-checkbox">
                <input id="checkbox" type="checkbox"> I've read the terms and conditions
            </label>

            <button id="submit-button" type="submit" class="pure-button pure-button-primary">Submit</button>
        </div>
    </fieldset>
</form>

Code-example:

```html
<body>
    <div id="msg-container"></div>

    <form id="form-container" class="pure-form pure-form-aligned">
        <fieldset>
            <div class="pure-control-group">
                <label for="name">Username</label>
                <input id="name" type="text" placeholder="Username">
            </div>

            <div class="pure-control-group">
                <label for="password">Password</label>
                <input id="password" type="password" placeholder="Password">
            </div>

            <div class="pure-control-group">
                <label for="email">Email Address</label>
                <input id="email" type="email" placeholder="Email Address">
            </div>

            <div class="pure-controls">
                <label for="checkbox" class="pure-checkbox">
                    <input id="checkbox" type="checkbox"> I've read the terms and conditions
                </label>

                <button id="submit-button" type="submit" class="pure-button pure-button-primary">Submit</button>
            </div>
        </fieldset>
    </form>
</body>
```

```js
<script src="parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var blurContainer, focusContainer, showMsgBlur, showMsgFocus;

    blurContainer = document.getElementById('msg-blur');
    focusContainer = document.getElementById('msg-focus');

    showMsgBlur = function(e) {
        blurContainer.innerHTML = 'The element <b>'+ e.target.id + '</b> got blurred';
    };
    showMsgFocus = function(e) {
        focusContainer.innerHTML = 'The element <b>'+ e.target.id + '</b> got focussed';
    };

    Parcela.Event.after('blur', showMsgBlur, '#form-container input, #form-container button');
    Parcela.Event.after('focus', showMsgFocus, '#form-container input, #form-container button');

    Parcela.Event.before('click', function(e) {
        e.preventDefault();
        e.target.focus();
    }, '#submit-button');
</script>
```

<script src="../../dist/parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var blurContainer, focusContainer, showMsgBlur, showMsgFocus;

    blurContainer = document.getElementById('msg-blur');
    focusContainer = document.getElementById('msg-focus');

    showMsgBlur = function(e) {
        blurContainer.innerHTML = 'The element <b>'+ e.target.id + '</b> got blurred';
    };
    showMsgFocus = function(e) {
        focusContainer.innerHTML = 'The element <b>'+ e.target.id + '</b> got focussed';
    };

    Parcela.Event.after('blur', showMsgBlur, '#form-container input, #form-container button');
    Parcela.Event.after('focus', showMsgFocus, '#form-container input, #form-container button');

    Parcela.Event.before('click', function(e) {
        e.preventDefault();
        e.target.focus();
    }, '#submit-button');
</script>
