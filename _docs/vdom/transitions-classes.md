---
module: vdom
maintainer: Marco Asbreuk
title: Transitions by classes
intro: "This example shows how you can show and hide a node. To hide a node on startup, you must add the 'itsa-hidden' as well as hide the element initially through node.hide(). The latter is needed to be able to call node.show(true) on the initial hidden Node. Without initially hided by JS, there won't be a fade-effect for the first time the node gets visible."
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
        padding-top: 1.5em;
        border: solid 1px #000;
        position: absolute;
        top: 32em;
        left: 23em;
        z-index: 1;
        color: #FFF;
        -webkit-transition: all 3s;
        -moz-transition: all 3s;
        -ms-transition: all 3s;
        -o-transition: all 3s;
        transition: all 3s;
    }
    .container.blue {
        color: #0FF;
    }
    .container.big {
        height: 200px;
        width: 400px;
    }
    .rotate {
        -webkit-transform: rotateZ(20deg);
        -moz-transform: rotateZ(20deg);
        -ms-transform: rotateZ(20deg);
        -o-transform: rotateZ(20deg);
        transform: rotateZ(20deg);
    }
    .container:before {
        content: 'OK';
    }
    .rotate:before {
        background-color: #0F0;
        -webkit-transition: all 1s;
        -moz-transition: all 1s;
        -ms-transition: all 1s;
        -o-transition: all 1s;
        transition: all 1s;
    }
    .body-content.module p.spaced {
        margin-top: 4em;
    }
</style>

Clik on the button to toggle the className:

<div id="btncontainer">
    <button id="buttonclass" class="pure-button pure-button-primary pure-button-bordered">Switch Class</button>
    <button id="buttoninline" class="pure-button pure-button-primary pure-button-bordered">Switch Inline style</button>
    <button id="buttontransform" class="pure-button pure-button-primary pure-button-bordered">Switch using transform</button>
</div>

<div class="container">Hi how are you doing?</div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div id="btncontainer">
        <button id="button-show" class="pure-button pure-button-primary pure-button-bordered">Show Node</button>
        <button id="button-show-faded" class="pure-button pure-button-primary pure-button-bordered">Show Node faded</button>
        <button id="button-hide" class="pure-button pure-button-primary pure-button-bordered">Hide Node</button>
        <button id="button-hide-faded" class="pure-button pure-button-primary pure-button-bordered">Hide Node faded</button>
    </div>

    <div class="container itsa-hidden itsa-transparent"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    var container = document.getElement('.container');

    var action = function(e) {
        switch (e.target.getId()) {
            case 'button-show': container.show();
                break;
            case 'button-show-faded': container.show(true);
                break;
            case 'button-hide': container.hide();
                break;
            case 'button-hide-faded': container.hide(true);
        }
    };

    ITSA.Event.after('click', action, 'button');

</script>
```

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('.container'),
        actionClass, actionInline, actionTransform;

    actionClass = function(e) {
        container.toggleClass('rotate', null, true).then(
        // container.toggleClass(['blue', 'big'], null, true).then(
        // container.toggleClass(['blue', 'big', 'rotate'], null, true).then(
            function() {
                console.info('fulfilled');
            }
        ).catch(
            function(err) {
                console.info('rejected: '+err);
            }
        );
    };

    actionInline = function(e) {
        var promise = container.hasInlineStyle('width') ?
                      container.removeInlineStyles(['width', 'height', 'background-color'], true) :
                      container.setInlineStyles([
                          {property: 'width', value: '400px'},
                          {property: 'height', value: '200px'},
                          {property: 'background-color', value: '#00F'}
                          // {property: 'transform', value: 'rotateZ(20deg)'}
                      ], true);
        promise.then(
            function() {
                console.info('fulfilled');
            }
        ).catch(
            function(err) {
                console.info('rejected: '+err);
            }
        );
    };

    actionTransform = function(e) {
        var promise = container.hasInlineStyle('width') ?
                      container.transition([
                          {property: 'width', value: ''},
                          {property: 'height', value: ''},
                          {property: 'background-color', value: '', duration: 10}
                          // {property: 'transform', value: ''}
                      ]) :
                      container.transition([
                          {property: 'width', value: '400px'},
                          {property: 'height', value: '200px'},
                          {property: 'background-color', value: '#00F', duration: 10}
                          // {property: 'transform', value: 'rotateZ(20deg)', duration: 10}
                      ]);
        promise.then(
            function() {
                console.info('fulfilled');
            }
        ).catch(
            function(err) {
                console.info('rejected: '+err);
            }
        );
    };

    ITSA.Event.after('click', actionClass, '#buttonclass');
    ITSA.Event.after('click', actionInline, '#buttoninline');
    ITSA.Event.after('click', actionTransform, '#buttontransform');

</script>
