---
module: vdom
functionality: transition
maintainer: Marco Asbreuk
title: Chaining transition
intro: "This example shows how to chain transitions by using node.transition()."
---

<style type="text/css">
    #btncontainer {
        margin: 2em 0;
        min-height: 2em;
    }
    #btncontainer button {
        margin-top: 0.5em;
    }
    .container {
        background-color: #F00;
        text-align: center;
        margin: 2em 0;
        padding: 1em;
        border: solid 1px #000;
        position: absolute;
        top: 28em;
        left: 16em;
        z-index: 1;
        color: #FFF;
    }
    .container.blue {
        background-color: #00F;
    }
    .container.big {
        height: 200px;
        width: 400px;
    }
    .body-content.module p.spaced {
        margin-top: 4em;
    }
</style>

Click on the button to intitiate transition:

<div id="btncontainer">
    <button id="btntransform" class="pure-button pure-button-primary pure-button-bordered">Start transitioning</button>
</div>

<div class="container">transitionable div</div>

<p class="spaced">Code-example:</p>

```css
.container {
    background-color: #F00;
    text-align: center;
    margin: 2em 0;
    padding: 1em;
    border: solid 1px #000;
    position: absolute;
    top: 28em;
    left: 16em;
    z-index: 1;
    color: #FFF;
}
```

```html
<body>
    <div id="btncontainer">
        <button id="btntransform">Start transitioning</button>
    </div>
    <div class="container">transitionable div</div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('.container'),
        button = document.getElement('#btntransform'),
        setClasses, removeClasses, transform;

    setClasses = function() {
        return container.transition([
            {property: 'width', value: '400px', duration: 2},
            {property: 'height', value: '200px', duration: 2}
        ]).then(
            container.transition.bind(
                container,
                {
                    property: 'background-color',
                    value: '#00F',
                    duration: 0.5,
                    delay: 1.5
                }
            )
        );
    };

    removeClasses = function() {
        return container.transition({
                   property: 'background-color',
                   value: '',
                   duration: 0.5
               }
        ).then(
            container.transition.bind(
                container,
                [{property: 'width', value: '', duration: 2, delay: 1.5},
                 {property: 'height', value: '', duration: 2, delay: 1.5}]
            )
        );
    };

    transform = function() {
        var transferPromise = container.hasInlineStyle('width') ? removeClasses() : setClasses();
        button.setClass('pure-button-disabled');
        transferPromise.finally(
            function() {
                button.removeClass('pure-button-disabled');
            }
        );
    };

    ITSA.Event.after('tap', transform, '#btntransform');

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('.container'),
        button = document.getElement('#btntransform'),
        setClasses, removeClasses, transform;

    setClasses = function() {
        return container.transition([
            {property: 'width', value: '400px', duration: 2},
            {property: 'height', value: '200px', duration: 2}
        ]).then(
            container.transition.bind(
                container,
                {
                    property: 'background-color',
                    value: '#00F',
                    duration: 0.5,
                    delay: 1.5
                }
            )
        );
    };

    removeClasses = function() {
        return container.transition({
                   property: 'background-color',
                   value: '',
                   duration: 0.5
               }
        ).then(
            container.transition.bind(
                container,
                [{property: 'width', value: '', duration: 2, delay: 1.5},
                 {property: 'height', value: '', duration: 2, delay: 1.5}]
            )
        );
    };

    transform = function() {
        var transferPromise = container.hasInlineStyle('width') ? removeClasses() : setClasses();
        button.setClass('pure-button-disabled');
        transferPromise.finally(
            function() {
                button.removeClass('pure-button-disabled');
            }
        );
    };

    ITSA.Event.after('tap', transform, '#btntransform');

</script>
