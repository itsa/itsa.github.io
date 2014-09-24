---
module: event
maintainer: Marco Asbreuk
title: Object emission on Event
intro: "Preferable, you emit events on an Class-instance or object, using the helpers on its prototype. However, sometimes objects are already created and you can't change the prototype. Instead of merging the listener-helpers to every single object, you should use Event.emit to emit events."
---
Click on the button to make "Marco 10" save.

<button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Save</button>

Code-example:

```html
<body>
    <button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Save</button>
</body>
```

```js
<script src="parcela-min.js"></script>
<script>
    var Parcela = require('parcela');

    // instead of loading the data (as explained in the example-source)
    // we simulate this by just creating the array.
    // so we don't need to maintain a server running for this example
    var profiles = [],
        i;

    // create 100 profiles which all can emit through their prototype:
    for (i=0; i<100; i++) {
        profiles.push({name: 'Marco '+i});
    }

    Parcela.Event.after(
        'PersonalProfile:save',
        function(e) {
            alert(e.target.name+' got saved');
        }
    );

    Parcela.Event.after(
        'click',
        function() {
            // we make the 11'th element to emit the save-event:
            Parcela.Event.emit(profiles[10], 'PersonalProfile:save');
        },
        '#buttongo'
    );
</script>
```

<script src="../../dist/parcela-min.js"></script>
<script>
    var Parcela = require('parcela');

    // instead of loading the data (as explained in the example-source)
    // we simulate this by just creating the array.
    // so we don't need to maintain a server running for this example
    var profiles = [],
        i;

    // create 100 profiles which all can emit through their prototype:
    for (i=0; i<100; i++) {
        profiles.push({name: 'Marco '+i});
    }

    Parcela.Event.after(
        'PersonalProfile:save',
        function(e) {
            alert(e.target.name+' got saved');
        }
    );

    Parcela.Event.after(
        'click',
        function() {
            // we make the 11'th element to emit the save-event:
            Parcela.Event.emit(profiles[10], 'PersonalProfile:save');
        },
        '#buttongo'
    );
</script>