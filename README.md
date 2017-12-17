# Three Demo

[![Build status](https://travis-ci.org/vanruesc/three-demo.svg?branch=master)](https://travis-ci.org/vanruesc/three-demo) 
[![npm version](https://badge.fury.io/js/three-demo.svg)](http://badge.fury.io/js/three-demo) 
[![Dependencies](https://david-dm.org/vanruesc/three-demo.svg?branch=master)](https://david-dm.org/vanruesc/three-demo)

A compact demo framework for [three.js](https://threejs.org/). Supports [postprocessing](https://github.com/vanruesc/postprocessing).

*[Demo](https://vanruesc.github.io/three-demo/public/demo) &there4;
[API Reference](https://vanruesc.github.io/three-demo/public/docs)*


## Installation

```sh
npm install three-demo
``` 


## Usage

```javascript
import { DemoManager } from "three-demo";
import { MyDemo } from "./MyDemo.js";

// Initialise the demo manager.
manager = new DemoManager(document.getElementById("viewport"), {
	aside: document.getElementById("aside"),
	composer: myCustomComposer
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

Please refer to the [contribution guidelines](https://github.com/vanruesc/three-demo/blob/master/CONTRIBUTING.md) for details.
