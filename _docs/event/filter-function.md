---
module: event
maintainer: Marco Asbreuk
title: Filtering subscription
intro: "Using the optional filter-argument, you can define a very specific filter for the subscriber. Note that it is more common not to use a specific filter, but do filtering by specifying an emitterName. This example filters by a filterfunction. Note that we need to pass the filterfunction as 4th parameter, not the 3rd."
---

<style type="text/css">
    #container {
        margin: 2em 0;
        min-height: 2em;
    }
    #container button {
        margin-top: 0.5em;
        min-width: 16em;
    }
</style>

Click on the buttons. Only the buttons with age>50 will show a pop-up.

<div id="container">
    <button id="button1" class="pure-button pure-button-primary pure-button-bordered">Click me to save without age</button><br>
    <button id="button2" class="pure-button pure-button-primary pure-button-bordered">Click me to save with age=65</button>
</div>

Code-example:

```html
<body>
    <button id="button1" class="pure-button pure-button-primary pure-button-bordered">Click me to save without age</button><br>
    <button id="button2" class="pure-button pure-button-primary pure-button-bordered">Click me to save with age=65</button>
</body>
```

```js
<script src="parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    Parcela.Event.after(
        '*:save',
        function(e) {
            alert('saved with age '+e.age+' years');
        },
        null,
        function(e) {
            return (e.age>50);
        }
    );

    Parcela.Event.after(
        'click',
        function() {
            Parcela.Event.emit('object1:save');
        },
        '#button1'
    );

    Parcela.Event.after(
        'click',
        function() {
            Parcela.Event.emit('object2:save', {age: 65});
        },
        '#button2'
    );
</script>
```

<script src="../../dist/parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    Parcela.Event.after(
        '*:save',
        function(e) {
            alert('saved with age '+e.age+' years');
        },
        null,
        function(e) {
            return (e.age>50);
        }
    );

    Parcela.Event.after(
        'click',
        function() {
            Parcela.Event.emit('object1:save');
        },
        '#button1'
    );

    Parcela.Event.after(
        'click',
        function() {
            Parcela.Event.emit('object2:save', {age: 65});
        },
        '#button2'
    );
</script>




