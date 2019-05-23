# Really Sketch

Simple online graph paper with basic drafting tools. Mobile friendly.

## Local Development

`npm install`

`npm run serve` to watch for changes in app/js/ and build app/js/bundle.js

`<script src="js/index.js" type="module"></script>` works locally in Firefox too

### Known Warning

`(!) Circular dependency: app\js\drawing.js -> app\js\canvas.js -> app\js\mouse.js -> app\js\drawing.js`
