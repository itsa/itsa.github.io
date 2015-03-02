---
module: vdom
maintainer: Marco Asbreuk
title: Toggle className on multiple elements at once
intro: "This example toggles the classname of multiple div's at once. The elements are selected by document.getAll()."
---

<style type="text/css">
    #btncontainer {
        margin: 2em 0;
        min-height: 2em;
    }
    #btncontainer button {
        margin-top: 0.5em;
        min-width: 16em;
    }
    .base-container {
        position: absolute;
        top: 14em;
    }
    .container {
        background-color: #DDD;
        text-align: center;
        margin: 2em 0;
        padding-top: 1.5em;
        height: 100px;
        width: 100px;
        border: solid 1px #000;
        position: absolute;
        z-index: 1;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: default;
    }
    .container.red {
        background-color: #F00;
    }
    #cont-1 {
        left: 0;
        top: 300px;
    }
    #cont-2 {
        left: 130px;
        top: 300px;
    }
    #cont-3 {
        left: 0;
        top: 440px;
    }
    #cont-4 {
        left: 130px;
        top: 440px;
    }
    .body-content.module p.spaced {
        margin-top: 20em;
    }
</style>

Clik on the button to toggle the className:

<div id="btncontainer">
    <button id="button-toggle" class="pure-button pure-button-primary pure-button-bordered">Toggle the class</button>
</div>

<div class="base-container">
    <div id="cont-1" class="container red"></div>
    <div id="cont-2" class="container red"></div>
    <div id="cont-3" class="container red"></div>
    <div id="cont-4" class="container red"></div>
</div>

<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    .container {
        background-color: #DDD;
    }
    .container.red {
        background-color: #F00;
    }
</style>
```

```html
<body>
    <div id="btncontainer">
        <button id="button-toggle">Click me toggle the class</button>
    </div>

    <div class="base-container">
        <div id="cont-1" class="container red"></div>
        <div id="cont-2" class="container red"></div>
        <div id="cont-3" class="container red"></div>
        <div id="cont-4" class="container red"></div>
    </div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    var containers = document.getAll('.container');

    var toggle = function(e) {
        containers.toggleClass('red');
    };

    ITSA.Event.after('tap', toggle, '#button-toggle');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    var containers = document.getAll('.container');

    var toggle = function(e) {
        containers.toggleClass('red');
    };

    ITSA.Event.after('tap', toggle, '#button-toggle');
</script>
