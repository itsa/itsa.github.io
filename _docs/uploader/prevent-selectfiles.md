---
module: uploader
maintainer: Marco Asbreuk
title: Prevent selecting files
intro: "Prevent selecting files."
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
    #target-container {
        margin: 2em 0;
        padding: 1em;
        min-height: 3.6em;
        background-color: #ddd;
    }
</style>

Click on the button to try to select and automaticly send the selected files. You will notice: nothing happens.

**Note:** this example does not use SPDY. Max uploadsize = 10Mb.

<div id="container">
    <button id="button-send" class="pure-button pure-button-primary pure-button-bordered">Click me to select some files</button>
</div>
<div id="target-container"></div>

Code-example:

```html
<body>
    <div id="container">
        <button id="button-send" class="pure-button pure-button-primary pure-button-bordered">Click me to select some files</button>
    </div>
    <div id="target-container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var url = 'http://somedomain.com.upload',
        container = document.getElement('#target-container'),
        uploader;

    uploader = new ITSA.Uploader({url: url});

    ITSA.Event.after(
        'tap',
        function() {
            uploader.selectFiles({autoSend: true});
        },
        '#button-send'
    );

    ITSA.Event.before('uploader:selectfiles', function(e) {
        e.preventDefault();
    });

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var url = 'http://somedomain.com.upload',
        container = document.getElement('#target-container'),
        uploader;

    uploader = new ITSA.Uploader({url: url});

    ITSA.Event.after(
        'tap',
        function() {
            uploader.selectFiles({autoSend: true});
        },
        '#button-send'
    );

    ITSA.Event.before('uploader:selectfiles', function(e) {
        e.preventDefault();
    });

</script>