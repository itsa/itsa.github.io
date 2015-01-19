---
module: js-ext
functionality: Classes
maintainer: Marco Asbreuk
title: New classes
intro: "New Classes always need to be set up through <b>ITSA.Classes.createClass()</b>. You can choose to pass an <b>constructor-function</b> as the first argument --> this function gets invoked for every instance that is created - <b>this</b> references the instance-context. The second argument (or the first when there is no constructor defined) will define the properties at the prototype."
---

<style type="text/css">
    #cont {
        border: solid 1px #000;
        padding: 1em;
        min-width: 10em;
        min-height: 3em;
        display: block;
        margin-top: 1em;
    }
</style>

<div id="cont"></div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div id="cont"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#cont'),
        FirstClass, SecondClass, ThirdClass, FourthClass,
        one, two, twoCopy, three, four;

    FirstClass = ITSA.Classes.createClass();

    SecondClass = ITSA.Classes.createClass(
        function(x) {
            this.x = x;
        }
    );

    ThirdClass = ITSA.Classes.createClass(
        {
            multiply: function(value, multiplier) {
                return value*multiplier;
            }
        }
    );

    FourthClass = ITSA.Classes.createClass(
        function(x) {
            this.x = x;
        },
        {
            getMultiplied: function(multiplier) {
                return this.x*multiplier;
            }
        }
    );

    one = new FirstClass();
    one.x = 15;

    two = new SecondClass(5);
    twoCopy = new SecondClass(10);

    three = new ThirdClass();
    four = new FourthClass(15);

    container.append('value one: '+one.x);
    container.append('<br>value two: '+two.x);
    container.append('<br>value twoCopy: '+twoCopy.x);
    container.append('<br>value three.multiply(2,4): '+three.multiply(2,4));
    container.append('<br>value four.getMultiplier(3): '+four.getMultiplied(3));

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#cont'),
        FirstClass, SecondClass, ThirdClass, FourthClass,
        one, two, twoCopy, three, four;

    FirstClass = ITSA.Classes.createClass();

    SecondClass = ITSA.Classes.createClass(
        function(x) {
            this.x = x;
        }
    );

    ThirdClass = ITSA.Classes.createClass(
        {
            multiply: function(value, multiplier) {
                return value*multiplier;
            }
        }
    );

    FourthClass = ITSA.Classes.createClass(
        function(x) {
            this.x = x;
        },
        {
            getMultiplied: function(multiplier) {
                return this.x*multiplier;
            }
        }
    );

    one = new FirstClass();
    one.x = 15;

    two = new SecondClass(5);
    twoCopy = new SecondClass(10);

    three = new ThirdClass();
    four = new FourthClass(15);

    container.append('value one: '+one.x);
    container.append('<br>value two: '+two.x);
    container.append('<br>value twoCopy: '+twoCopy.x);
    container.append('<br>value three.multiply(2,4): '+three.multiply(2,4));
    container.append('<br>value four.getMultiplier(3): '+four.getMultiplied(3));

</script>