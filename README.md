# Three Demo

[![Build status](https://travis-ci.org/vanruesc/three-demo.svg?branch=master)](https://travis-ci.org/vanruesc/three-demo)
[![npm version](https://badgen.net/npm/v/three-demo?color=green)](https://www.npmjs.com/package/three-demo)
[![Peer dependencies](https://david-dm.org/vanruesc/three-demo/peer-status.svg)](https://david-dm.org/vanruesc/three-demo?type=peer)

A compact demo framework for [three.js](https://threejs.org/).

*[Demo](https://vanruesc.github.io/three-demo/public/demo)&ensp;&middot;&ensp;[API Reference](https://vanruesc.github.io/three-demo/public/docs)*


## Installation

This library requires the peer dependencies [dat.gui](https://github.com/dataarts/dat.gui), [synthetic-event](https://github.com/vanruesc/synthetic-event) and [three](https://github.com/mrdoob/three.js/).

```sh
npm install dat.gui synthetic-event three
```

```sh
npm install three-demo
```


## Usage

```javascript
import { DemoManager } from "three-demo";
import { MyDemo } from "./MyDemo.js";

// Initialize the demo manager.
const manager = new DemoManager(document.getElementById("viewport"), {
	aside: document.getElementById("aside"),
	renderer: myWebGLRenderer
});

// React to events.
manager.addEventListener("change", console.log);
manager.addEventListener("load", console.log);

// Register demos.
manager.addDemo(new MyDemo());

// Start rendering.
(function render(now) {

	requestAnimationFrame(render);
	manager.render(now);

}());
```


## Custom Demos

You can create custom demos by extending the `Demo` class. For details, take a look at the
[ExampleDemo](https://github.com/vanruesc/three-demo/blob/master/demo/src/demos/ExampleDemo.js).


## Contributing

Please refer to the [contribution guidelines](https://github.com/vanruesc/three-demo/blob/master/.github/CONTRIBUTING.md) for details.
