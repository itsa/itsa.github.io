---
module: vdom
functionality: transition
maintainer: Marco Asbreuk
title: Chaining with classes
intro: "This example shows how to chain transitions by using transitional classes and Promises."
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
        -webkit-transition: all 1.5s;
        -moz-transition: all 1.5s;
        -ms-transition: all 1.5s;
        -o-transition: all 1.5s;
        transition: all 1.5s;
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
    -webkit-transition: all 1.5s;
    -moz-transition: all 1.5s;
    -ms-transition: all 1.5s;
    -o-transition: all 1.5s;
    transition: all 1.5s;
}
.container.blue {
    background-color: #00F;
}
.container.big {
    height: 200px;
    width: 400px;
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
    var container = document.getElement('.container'),
        button = document.getElement('#btntransform'),
        setClasses, removeClasses, transform;

    setClasses = function() {
        return container.setClass('big', true).then(
           container.setClass.bind(container, 'blue', true)
        );
    };

    removeClasses = function() {
        return container.removeClass('blue', true).then(
           container.removeClass.bind(container, 'big', true)
        );
    };

    transform = function() {
        var transferPromise = container.hasClass('big') ? removeClasses() : setClasses();
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
    var container = document.getElement('.container'),
        button = document.getElement('#btntransform'),
        setClasses, removeClasses, transform;

    setClasses = function() {
        return container.setClass('big', true).then(
           container.setClass.bind(container, 'blue', true)
        );
    };

    removeClasses = function() {
        return container.removeClass('blue', true).then(
           container.removeClass.bind(container, 'big', true)
        );
    };

    transform = function() {
        var transferPromise = container.hasClass('big') ? removeClasses() : setClasses();
        button.setClass('pure-button-disabled');
        transferPromise.finally(
            function() {
                button.removeClass('pure-button-disabled');
            }
        );
    };

    ITSA.Event.after('tap', transform, '#btntransform');

</script>
