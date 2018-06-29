# Three Demo

[![Build status](https://travis-ci.org/vanruesc/three-demo.svg?branch=master)](https://travis-ci.org/vanruesc/three-demo) 
[![npm version](https://badge.fury.io/js/three-demo.svg)](http://badge.fury.io/js/three-demo) 
[![Peer dependencies](https://img.shields.io/david/peer/vanruesc/three-demo.svg)](https://david-dm.org/vanruesc/three-demo?type=peer)

A compact demo framework for [three.js](https://threejs.org/).

*[Demo](https://vanruesc.github.io/three-demo/public/demo) &there4;
[API Reference](https://vanruesc.github.io/three-demo/public/docs)*


## Installation

This library requires the peer dependency [three](https://github.com/mrdoob/three.js/).

```sh
npm install three three-demo
```


## Usage

```javascript
import { DemoManager } from "three-demo";
import { MyDemo } from "./MyDemo.js";

// Initialise the demo manager.
const manager = new DemoManager(document.getElementById("viewport"), {
	aside: document.getElementById("aside"),
	renderer: myWebGLRenderer
});

// Define your event listeners before adding any demos.
manager.addEventListener("change", onDemoChange);
manager.addEventListener("load", onDemoLoad);

// Register your custom demos.
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
