---
module: scrollable
maintainer: Marco Asbreuk
title: Simple scrollable
intro: "This example shows how to interrupt a transition. Interruption can be done when using the interruption-methods that return a Promise, like node\'s class-methods or transition. These methods return Promise with extra methods: cancel, freeze and finish, which all interrupt the transition and force to the initial, current or final state immediately.<br><br>Start switching the class, while during transition experiment with canceling, freezing or finishing."
---

<style type="text/css">
    .container {
        background-color: #F00;
        margin: 2em 0;
        padding: 1em;
        border: solid 1px #000;
        z-index: 1;
        color: #FFF;
        height: 300px;
        width: 300px;
        color: #000;
    }
    .body-content.module p.spaced {
        margin-top: 4em;
    }
</style>

Click on the button to toggle the className:

<div class="container" plugin-scroll="true" scroll-light="true">
    <p>Thisexampleshowshowtointerruptatransition.Interruptioncanbedonewhenusingtheinterruption-methodsthatreturnaPromise, likenode\'sclass-methodsortransition.ThesemethodsreturnPromise with extra methods: cancel, freeze and finish, which all interrupt the transition and force to the initial, current or final state immediately.<br><br>Start switching the class, while during transition experiment with canceling, freezing or finishing.</p>
    <p>This example shows how to interrupt a transition. Interruption can be done when using the interruption-methods that return a Promise, like node\'s class-methods or transition. These methods return Promise with extra methods: cancel, freeze and finish, which all interrupt the transition and force to the initial, current or final state immediately.<br><br>Start switching the class, while during transition experiment with canceling, freezing or finishing.</p>
    <p>This example shows how to interrupt a transition. Interruption can be done when using the interruption-methods that return a Promise, like node\'s class-methods or transition. These methods return Promise with extra methods: cancel, freeze and finish, which all interrupt the transition and force to the initial, current or final state immediately.<br><br>Start switching the class, while during transition experiment with canceling, freezing or finishing.</p>
</div>

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
    }
</style>
```

```html
<body>
    <div id="btncontainer">
        <button id="buttonswitch" >Start transition</button>
        <button id="buttoncancel" data-transition="true">Cancel</button>
        <button id="buttonfreeze" data-transition="true">Freeze</button>
        <button id="buttonfinish" data-transition="true">Finish</button>
    </div>

    <div class="container">Lets go!</div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var container = document.getElement('.container'),
        promise, doSwitch, actionCancel, actionFreeze, actionFinish,
        switchButton, transitionButtons, resetClasses;

    doSwitch = function(e) {
        container.setText('Busy transtitioning');
        resetClasses(false);
        promise = container.transition([
            {property: 'width', value: '600px', duration: 5},
            {property: 'height', value: '250px', duration: 5},
            {property: 'background-color', value: '#00F', duration: 5}
        ]);
        promise.then(function() {
            container.setText('End of transtition');
            resetClasses(true, true);
        })
        .catch(
            function(err) {
                console.warn(err);
                container.setText(err);
            }
        );
    };

    actionCancel = function(e) {
        promise.cancel();
        resetClasses(true);
    };

    actionFreeze = function(e) {
        promise.freeze();
        resetClasses(true);
    };

    actionFinish = function(e) {
        promise.finish();
        resetClasses(true, true);
    };

    resetClasses = function(ready, finished) {
        if (!finished) {
            switchButton.toggleClass('pure-button-disabled', !ready);
        }
        transitionButtons.toggleClass('pure-button-disabled', ready);
    };

    switchButton = document.getElement('#buttonswitch');
    transitionButtons = document.getAll('[data-transition="true"]');
    resetClasses(true);

    ITSA.Event.after('click', doSwitch, '#buttonswitch');
    ITSA.Event.after('click', actionCancel, '#buttoncancel');
    ITSA.Event.after('click', actionFreeze, '#buttonfreeze');
    ITSA.Event.after('click', actionFinish, '#buttonfinish');

</script>
```

<script src="../../dist/itsabuild-min.js"></script>