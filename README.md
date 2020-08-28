# Three Demo

[![CI](https://badgen.net/github/checks/vanruesc/three-demo)](https://github.com/vanruesc/three-demo/actions)
[![Version](https://badgen.net/npm/v/three-demo?color=green)](https://www.npmjs.com/package/three-demo)
[![Peer dependencies](https://badgen.net/david/peer/vanruesc/three-demo)](https://david-dm.org/vanruesc/three-demo?type=peer)

A compact demo framework for [three.js](https://threejs.org/).

*[Demo](https://vanruesc.github.io/three-demo/public/demo)&ensp;&middot;&ensp;[Documentation](https://vanruesc.github.io/three-demo/public/docs)*


## Installation

This library requires the peer dependencies [three](https://github.com/mrdoob/three.js/) and [dat.gui](https://github.com/dataarts/dat.gui).

```sh
npm install dat.gui three three-demo
```


## Usage

```javascript
import { DemoManager } from "three-demo";
import { MyDemo } from "./MyDemo.js";

// Initialize the demo manager.
const manager = new DemoManager(document.getElementById("viewport"), {
	aside: document.getElementById("aside"),
	renderer
});

// React to events.
manager.addEventListener("change", console.log);
manager.addEventListener("load", console.log);

// Register demos.
manager.addDemo(new MyDemo());

// Start rendering.
(function render(timestamp) {

	requestAnimationFrame(render);
	manager.render(timestamp);

}());
```


## Custom Demos

You can create custom demos by extending the `Demo` class. For details, take a look at the
[ExampleDemo](https://github.com/vanruesc/three-demo/blob/master/demo/src/demos/ExampleDemo.js).


## Contributing

Please refer to the [contribution guidelines](https://github.com/vanruesc/three-demo/blob/master/.github/CONTRIBUTING.md) for details.
