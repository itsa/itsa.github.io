---
module: js-ext
functionality: Classes
maintainer: Marco Asbreuk
title: Redefine constructor
intro: "This example shows how to flip a card. Most is done by setting the right css-classes. The transition gets activated by setting a transform-style on the card-div. <br><br>By clicking on the card it gets flipped. There also is some logic that can reverse flipping, even during a transition."
---

<style type="text/css">

</style>

Flip the card by clicking on it. <span class="status"></span>

<div class="container3D">
</div>


<p class="spaced">Code-example:</p>

```css
<style type="text/css">

</style>
```

```html
<body>

</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');


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
