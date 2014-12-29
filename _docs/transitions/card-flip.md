---
module: vdom
functionality: transition
maintainer: Marco Asbreuk
title: Flip a card
intro: "This example shows how to flip a card. Most is done by setting the right css-classes. The transition gets activated by setting a transform-style on the card-div. <br><br>By clicking on the card it gets flipped. There also is some logic that can reverse flipping, even during a transition."
---

<style type="text/css">
    .container3D {
        -webkit-perspective: 600px;
        -moz-perspective: 600px;
        -ms-perspective: 600px;
        -o-perspective: 600px;
        perspective: 600px;
        width: 200px;
        height: 300px;
        position: relative;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    #card {
        width: 100%;
        height: 100%;
        position: absolute;
        -webkit-transform-style: preserve-3d;
        -moz-transform-style: preserve-3d;
        -ms-transform-style: preserve-3d;
        -o-transform-style: preserve-3d;
        transform-style: preserve-3d;
    }
    #card >div {
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
        -o-backface-visibility: hidden;
        backface-visibility: hidden;
        color: #FFF;
        font-size: 8em;
        font-weight: bold;
        text-align: center;
        line-height: 300px;
        cursor: default;
    }
    #card .front {
        background-color: #F00;
    }
    #card .back {
        background-color: #00F;
        -webkit-transform: rotateY(180deg);
        -moz-transform: rotateY(180deg);
        -ms-transform: rotateY(180deg);
        -o-transform: rotateY(180deg);
        transform: rotateY(180deg);
    }
    span.status {
        margin-left: 2em;
        font-weight: bold;
    }
    .body-content.module p.spaced {
        margin-top: 4em;
    }
</style>

Flip the card by clicking on it. <span class="status"></span>

<div class="container3D">
    <div id="card">
        <div class="front">1</div>
        <div class="back">2</div>
    </div>
</div>


<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    .container3D {
        -webkit-perspective: 600px;
        -moz-perspective: 600px;
        -ms-perspective: 600px;
        -o-perspective: 600px;
        perspective: 600px;
        width: 200px;
        height: 300px;
        position: relative;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    #card {
        width: 100%;
        height: 100%;
        position: absolute;
        -webkit-transform-style: preserve-3d;
        -moz-transform-style: preserve-3d;
        -ms-transform-style: preserve-3d;
        -o-transform-style: preserve-3d;
        transform-style: preserve-3d;
    }
    #card >div {
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
        -o-backface-visibility: hidden;
        backface-visibility: hidden;
        color: #FFF;
        font-size: 8em;
        font-weight: bold;
        text-align: center;
        line-height: 300px;
        cursor: default;
    }
    #card .front {
        background-color: #F00;
    }
    #card .back {
        background-color: #00F;
        -webkit-transform: rotateY(180deg);
        -moz-transform: rotateY(180deg);
        -ms-transform: rotateY(180deg);
        -o-transform: rotateY(180deg);
        transform: rotateY(180deg);
    }
</style>
```

```html
<body>
    Flip the card by clicking on it. <span class="status"></span>

    <div class="container3D">
        <div id="card">
            <div class="front">1</div>
            <div class="back">2</div>
        </div>
    </div>
</body>
```

```js
<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa'),
        card = document.getElement('#card'),
        statusNode = document.getElement('span.status'),
        DURATION = 2, // sec
        front = true,
        promise, doFlip;

    doFlip = function(e) {
        var deg, runningPromise;
        statusNode.setText('started flipping...');
        front = !front;
        deg = front ? 0.1 : -179.9;
        runningPromise = (promise && !promise.isFulfilled) ? promise.freeze() : Promise.resolve();
        runningPromise.then(
            function(elapsed) {
                var duration = elapsed ? (elapsed/1000) : DURATION;
                promise = card.transition({property: 'transform', value: 'rotateY('+deg+'deg)', duration: duration}, true);
                promise.then(function() {
                    if (!promise.frozen) {
                        statusNode.setText('ready!');
                        if (front) {
                            card.removeInlineStyle('transform');
                        }
                        else {
                            card.setInlineStyle('transform', 'rotateY(-180deg)');
                        }
                    }
                });
            }
        );
    };

    ITSA.Event.after('tap', doFlip, '.container3D');

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        card = document.getElement('#card'),
        statusNode = document.getElement('span.status'),
        DURATION = 2, // sec
        front = true,
        promise, doFlip;

    doFlip = function(e) {
        var deg, runningPromise;
        statusNode.setText('started flipping...');
        front = !front;
        deg = front ? 0.1 : -179.9;
        runningPromise = (promise && !promise.isFulfilled) ? promise.freeze() : Promise.resolve();
        runningPromise.then(
            function(elapsed) {
                var duration = elapsed ? (elapsed/1000) : DURATION;
                promise = card.transition({property: 'transform', value: 'rotateY('+deg+'deg)', duration: duration}, true);
                promise.then(function() {
                    if (!promise.frozen) {
                        statusNode.setText('ready!');
                        if (front) {
                            card.removeInlineStyle('transform');
                        }
                        else {
                            card.setInlineStyle('transform', 'rotateY(-180deg)');
                        }
                    }
                });
            }
        );
    };

    ITSA.Event.after('tap', doFlip, '.container3D');

</script>
