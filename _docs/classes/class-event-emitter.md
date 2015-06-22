---
module: js-ext
functionality: Classes
maintainer: Marco Asbreuk
title: Events emitter on classes
intro: "This example shows how Classes can have an event-emitter (at their prototype)."
---

<style type="text/css">
    #btn {
        display: block;
        min-width: 10em;
    }
    #circlecont {
        display: block;
        margin-top: 1em;
    }
    #cont {
        border: solid 1px #000;
        padding: 1em;
        min-width: 10em;
        min-height: 3em;
        display: block;
        margin-top: 1em;
    }
</style>

Click on the buttons to make the users speak or be silent.

<button id="btn" class="pure-button pure-button-bordered">Draw circle</button>

<div id="circlecont"></div>
<div id="cont"></div>


<p class="spaced">Code-example:</p>

```html
<body>
    <button id="btn1" class="pure-button pure-button-bordered">User 1</button>
    <button id="btn2" class="pure-button pure-button-bordered">User 2</button>
    <div id="cont"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var container = document.getElement('#cont'),
        User, user1, user2;

    User = ITSA.Classes.createClass(
        function(name) {
            this.name = name;
            this.selfAfter('user:speak', this.sayHello);
            this.selfAfter('user:besilent', this.sayGoodBye);
            this.isSpeaking = false;
        },
        {
            sayHello: function() {
                container.setHTML(this.name+' says Hello');
            },
            sayGoodBye: function() {
                container.setHTML('Bye bye, '+this.name+' is leaving');
            }
        }
    );

    user1 = new User('Bill Clinton');
    user2 = new User('Barack Obama');


    ITSA.Event.after('tap', function(e) {
        var user = (e.target.getId()==='btn1') ? user1 : user2;
        if (user.isSpeaking) {
            ITSA.Event.emit(user, 'user:besilent');
        }
        else {
            ITSA.Event.emit(user, 'user:speak');
        }
        user.isSpeaking = !user.isSpeaking;
    }, '#btn1, #btn2');

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var circleContainer = document.getElement('#circlecont'),
        container = document.getElement('#cont'),
        Circle, circle;

    Circle = ITSA.Classes.createClass(
        function (x, y, r) {
            this.x = x || 0;
            this.y = y || 0;
            this.r = r || 1;
        },{
            draw: function () {
                circleContainer.setHTML('<svg width="100" height="100">'+
                    '<a xlink:href="http://itsasbreuk.nl">'+
                '<circle fill="red" stroke-width="3" stroke="black" r="40" cy="50" cx="50"/>'+
                '</a>'+
                '</svg>');
                this.emit('drawn');
            }
        }
    ).mergePrototypes(ITSA.Event.Emitter('circle'));

    circle = new Circle(50, 50, 40);

    ITSA.Event.after('tap', function(e) {
        circle.draw();
    }, '#btn');

    ITSA.Event.after('circle:drawn', function(e) {
        container.setHTML('The circle is drawn!');
    });

</script>
