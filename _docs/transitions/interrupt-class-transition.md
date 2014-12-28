---
module: vdom
functionality: transition
maintainer: Marco Asbreuk
title: Interrupt class-transition
intro: "This example shows how to interrupt a class-transition. Interruption can be done when using the interruption-methods that return a Promise, like node\'s class-methods or transition. These methods return Promise with extra methods: cancel, freeze and finish, which all interrupt the transition and force to the initial, current or final state immediately.<br><br>Start switching the class, while during transition experiment with canceling, freezing or finishing."
---

<style type="text/css">
    #btncontainer {
        margin: 2em 0;
        min-height: 2em;
    }
    #btncontainer button {
        margin-top: 0.5em;
        min-width: 16em;
        display: block;
    }
    .container {
        background-color: #F00;
        text-align: center;
        margin: 2em 0;
        padding: 1em;
        border: solid 1px #000;
        position: absolute;
        top: 35em;
        left: 23em;
        z-index: 1;
        color: #FFF;
        width: 300px;
        -webkit-transition: all 3s;
        -moz-transition: all 3s;
        -ms-transition: all 3s;
        -o-transition: all 3s;
        transition: all 3s;
    }
    .container.blue {
        background-color: #00F;
    }
    .container.big {
        height: 300px;
        width: 600px;
    }
    .body-content.module p.spaced {
        margin-top: 4em;
    }
</style>

Click on the button to toggle the className:

<div id="btncontainer">
    <button id="buttonswitch" class="pure-button pure-button-primary pure-button-bordered">Switch Class</button>
    <button id="buttoncancel" data-manipulate="transition" class="pure-button pure-button-primary pure-button-bordered">Cancel</button>
    <button id="buttonfreeze" data-manipulate="transition" class="pure-button pure-button-primary pure-button-bordered">Freeze</button>
    <button id="buttonfinish" data-manipulate="transition" class="pure-button pure-button-primary pure-button-bordered">Finish</button>
    <button id="buttonunfreeze" data-manipulate="frozen" class="pure-button pure-button-primary pure-button-bordered">Unfreeze</button>
    <button id="buttonunfreezefinish" data-manipulate="frozen" class="pure-button pure-button-primary pure-button-bordered">Unfreeze + finish</button>
    <button id="buttonunfreezecancel" data-manipulate="frozen" class="pure-button pure-button-primary pure-button-bordered">Unfreeze + cancel</button>
</div>

<div class="container">Lets go!</div>

<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    .container {
        background-color: #F00;
        text-align: center;
        margin: 2em 0;
        padding: 1em;
        border: solid 1px #000;
        position: absolute;
        top: 35em;
        left: 23em;
        z-index: 1;
        color: #FFF;
        width: 300px;
        -webkit-transition: all 3s;
        -moz-transition: all 3s;
        -ms-transition: all 3s;
        -o-transition: all 3s;
        transition: all 3s;
    }
    .container.blue {
        background-color: #00F;
    }
    .container.big {
        height: 300px;
        width: 600px;
    }
</style>
```

```html
<body>
    <div id="btncontainer">
        <button id="buttonswitch">Switch Class</button>
        <button id="buttoncancel" data-manipulate="transition">Cancel</button>
        <button id="buttonfreeze" data-manipulate="transition">Freeze</button>
        <button id="buttonfinish" data-manipulate="transition">Finish</button>
        <button id="buttonunfreeze" data-manipulate="frozen">Unfreeze</button>
        <button id="buttonunfreezefinish" data-manipulate="frozen">Unfreeze + finish</button>
        <button id="buttonunfreezecancel" data-manipulate="frozen">Unfreeze + cancel</button>
    </div>

    <div class="container">Lets go!</div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('.container'),
        promise, doSwitch, actionCancel, actionFreeze,
        actionUnfreeze, resetClasses, frozenButtons,
        transitionButtons, actionFinish, actionUnfreezeFinish,
        actionUnfreezeCancel, actionUnfreezeRevert, switchClassButton;

    doSwitch = function(e) {
        switchClassButton.setClass('pure-button-disabled');
        container.setText('Busy transtitioning');
        promise = container.toggleClass(['blue', 'big'], null, true);
        promise.then(function() {
            container.setText('End of transtition');
            if (!promise.frozen) {
                resetClasses(null, true);
            }
        })
        .catch(
            function(err) {
                container.setText(err);
            }
        );
        resetClasses(false);
    };

    actionCancel = function(e) {
        if (promise) {
            promise.cancel();
            resetClasses(null, true);
        }
    };

    actionFreeze = function(e) {
        if (promise) {
            promise.freeze();
            container.setText('Freezed transtitioning');
            resetClasses(true);
        }
    };

    actionUnfreeze = function(e) {
        if (promise) {
            container.setText('Restarted transtitioning');
            promise = promise.unfreeze();
            promise.then(function() {
                container.setText('End of transtition');
                if (!promise.frozen) {
                    resetClasses(null, true);
                }
            })
            .catch(
                function(err) {
                    container.setText(err);
                }
            );
            resetClasses(false);
        }
    };

    actionUnfreezeFinish = function(e) {
        if (promise) {
            promise = promise.unfreeze({finish: true});
            resetClasses(null, true);
        }
    };

    actionUnfreezeCancel = function(e) {
        if (promise) {
            promise = promise.unfreeze({cancel: true});
            resetClasses(null, true);
        }
    };

    actionFinish = function(e) {
        if (promise) {
            promise.finish();
            resetClasses(null, true);
        }
    };

    resetClasses = function(frozen, ready) {
        if (ready) {
            switchClassButton.removeClass('pure-button-disabled');
            frozenButtons.setClass('pure-button-disabled');
            transitionButtons.setClass('pure-button-disabled');
        }
        else {
            frozenButtons.toggleClass('pure-button-disabled', !frozen);
            transitionButtons.toggleClass('pure-button-disabled', frozen);
        }
    };

    switchClassButton = document.getElement('#buttonswitch');
    frozenButtons = document.getAll('[data-manipulate="frozen"]');
    transitionButtons = document.getAll('[data-manipulate="transition"]');
    resetClasses(null, true);

    ITSA.Event.after('click', doSwitch, '#buttonswitch');
    ITSA.Event.after('click', actionCancel, '#buttoncancel');
    ITSA.Event.after('click', actionFreeze, '#buttonfreeze');
    ITSA.Event.after('click', actionUnfreeze, '#buttonunfreeze');
    ITSA.Event.after('click', actionUnfreezeFinish, '#buttonunfreezefinish');
    ITSA.Event.after('click', actionUnfreezeCancel, '#buttonunfreezecancel');
    ITSA.Event.after('click', actionFinish, '#buttonfinish');

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('.container'),
        promise, doSwitch, actionCancel, actionFreeze,
        actionUnfreeze, resetClasses, frozenButtons,
        transitionButtons, actionFinish, actionUnfreezeFinish,
        actionUnfreezeCancel, actionUnfreezeRevert, switchClassButton;

    doSwitch = function(e) {
        switchClassButton.setClass('pure-button-disabled');
        container.setText('Busy transtitioning');
        promise = container.toggleClass(['blue', 'big'], null, true);
        promise.then(function() {
            container.setText('End of transtition');
            if (!promise.frozen) {
                resetClasses(null, true);
            }
        })
        .catch(
            function(err) {
                container.setText(err);
            }
        );
        resetClasses(false);
    };

    actionCancel = function(e) {
        if (promise) {
            promise.cancel();
            resetClasses(null, true);
        }
    };

    actionFreeze = function(e) {
        if (promise) {
            promise.freeze();
            container.setText('Freezed transtitioning');
            resetClasses(true);
        }
    };

    actionUnfreeze = function(e) {
        if (promise) {
            container.setText('Restarted transtitioning');
            promise = promise.unfreeze();
            promise.then(function() {
                container.setText('End of transtition');
                if (!promise.frozen) {
                    resetClasses(null, true);
                }
            })
            .catch(
                function(err) {
                    container.setText(err);
                }
            );
            resetClasses(false);
        }
    };

    actionUnfreezeFinish = function(e) {
        if (promise) {
            promise = promise.unfreeze({finish: true});
            resetClasses(null, true);
        }
    };

    actionUnfreezeCancel = function(e) {
        if (promise) {
            promise = promise.unfreeze({cancel: true});
            resetClasses(null, true);
        }
    };

    actionFinish = function(e) {
        if (promise) {
            promise.finish();
            resetClasses(null, true);
        }
    };

    resetClasses = function(frozen, ready) {
        if (ready) {
            switchClassButton.removeClass('pure-button-disabled');
            frozenButtons.setClass('pure-button-disabled');
            transitionButtons.setClass('pure-button-disabled');
        }
        else {
            frozenButtons.toggleClass('pure-button-disabled', !frozen);
            transitionButtons.toggleClass('pure-button-disabled', frozen);
        }
    };

    switchClassButton = document.getElement('#buttonswitch');
    frozenButtons = document.getAll('[data-manipulate="frozen"]');
    transitionButtons = document.getAll('[data-manipulate="transition"]');
    resetClasses(null, true);

    ITSA.Event.after('click', doSwitch, '#buttonswitch');
    ITSA.Event.after('click', actionCancel, '#buttoncancel');
    ITSA.Event.after('click', actionFreeze, '#buttonfreeze');
    ITSA.Event.after('click', actionUnfreeze, '#buttonunfreeze');
    ITSA.Event.after('click', actionUnfreezeFinish, '#buttonunfreezefinish');
    ITSA.Event.after('click', actionUnfreezeCancel, '#buttonunfreezecancel');
    ITSA.Event.after('click', actionFinish, '#buttonfinish');

</script>
