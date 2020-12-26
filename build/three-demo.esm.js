/**
 * three-demo v4.0.6 build Sat Dec 26 2020
 * https://github.com/vanruesc/three-demo
 * Copyright 2020 Raoul van Rüschen
 * @license Zlib
 */
// src/Demo.ts
import {LoadingManager, Scene} from "three";
var Demo = class {
  constructor(id = "demo") {
    this.scene = new Scene();
    this.id = id;
    this.renderer = null;
    this.loadingManager = new LoadingManager();
    this.assets = new Map();
    this.scene = new Scene();
    this.camera = null;
    this.ready = false;
  }
  setRenderer(renderer) {
    this.renderer = renderer;
    return this;
  }
  getCamera() {
    return this.camera;
  }
  load() {
    return Promise.resolve();
  }
  initialize() {
  }
  render(deltaTime) {
    this.renderer.render(this.scene, this.camera);
  }
  registerOptions(menu) {
  }
  reset() {
    this.scene = new Scene();
    this.camera = null;
    this.ready = false;
    return this;
  }
};

// src/DemoManager.ts
import {GUI} from "dat.gui";
import {
  EventDispatcher,
  OrthographicCamera,
  PerspectiveCamera,
  WebGLRenderer as WebGLRenderer2
} from "three";

// src/DemoManagerEvent.ts
var DemoManagerEvent = class {
  constructor(type) {
    this.type = type;
    this.previousDemo = null;
    this.demo = null;
  }
};

// src/demo-manager-events.ts
var change = new DemoManagerEvent("change");
var load = new DemoManagerEvent("load");

// src/DemoManager.ts
var MILLISECONDS_TO_SECONDS = 1 / 1e3;
var DemoManager = class extends EventDispatcher {
  constructor(viewport, {aside = viewport, renderer}) {
    super();
    this.renderer = renderer;
    if (this.renderer === void 0) {
      const renderer2 = new WebGLRenderer2();
      renderer2.setSize(viewport.clientWidth, viewport.clientHeight);
      renderer2.setPixelRatio(window.devicePixelRatio);
      this.renderer = renderer2;
    }
    this.timestamp = 0;
    this.menu = new GUI({autoPlace: false});
    this.demos = new Map();
    this.demo = null;
    this.currentDemo = null;
    viewport.appendChild(this.renderer.domElement);
    aside.appendChild(this.menu.domElement);
  }
  resetMenu() {
    const node = this.menu.domElement.parentNode;
    const menu = new GUI({autoPlace: false});
    if (this.demos.size > 1) {
      const selection = menu.add(this, "demo", Array.from(this.demos.keys()));
      selection.onChange(() => this.loadDemo());
    }
    node.removeChild(this.menu.domElement);
    node.appendChild(menu.domElement);
    this.menu.destroy();
    this.menu = menu;
    return menu;
  }
  startDemo(demo) {
    if (demo.id === this.demo) {
      demo.initialize();
      demo.registerOptions(this.resetMenu());
      demo.ready = true;
      load.demo = demo;
      this.dispatchEvent(load);
    }
  }
  loadDemo() {
    const nextDemo = this.demos.get(this.demo);
    const currentDemo = this.currentDemo;
    const renderer = this.renderer;
    window.location.hash = nextDemo.id;
    if (currentDemo !== null) {
      currentDemo.reset();
    }
    this.menu.domElement.style.display = "none";
    change.previousDemo = currentDemo;
    change.demo = nextDemo;
    this.currentDemo = nextDemo;
    this.dispatchEvent(change);
    renderer.clear();
    nextDemo.load().then(() => this.startDemo(nextDemo)).catch(console.error);
  }
  addDemo(demo) {
    const hash = window.location.hash.slice(1);
    const currentDemo = this.currentDemo;
    this.demos.set(demo.id, demo.setRenderer(this.renderer));
    if (this.demo === null && hash.length === 0 || demo.id === hash) {
      this.demo = demo.id;
      this.loadDemo();
    }
    this.resetMenu();
    if (currentDemo !== null && currentDemo.ready) {
      currentDemo.registerOptions(this.menu);
    }
    return this;
  }
  removeDemo(id) {
    const demos = this.demos;
    if (demos.has(id)) {
      demos.delete(id);
      if (this.demo === id && demos.size > 0) {
        const entries = Array.from(demos.entries());
        const firstEntry = entries[0];
        this.demo = firstEntry[0];
        this.currentDemo = firstEntry[1];
        this.loadDemo();
      } else {
        this.demo = null;
        this.currentDemo = null;
        this.renderer.clear();
      }
    }
    return this;
  }
  setSize(width, height, updateStyle = true) {
    const demo = this.currentDemo;
    const camera = demo.getCamera();
    this.renderer.setSize(width, height, updateStyle);
    if (demo !== null && camera !== null) {
      if (camera instanceof OrthographicCamera) {
        camera.left = width / -2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = height / -2;
        camera.updateProjectionMatrix();
      } else if (camera instanceof PerspectiveCamera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    }
  }
  render(timestamp) {
    const elapsed = (timestamp - this.timestamp) * MILLISECONDS_TO_SECONDS;
    this.timestamp = timestamp;
    const demo = this.currentDemo;
    if (demo !== null && demo.ready) {
      demo.render(elapsed);
    }
  }
};
export {
  Demo,
  DemoManager,
  DemoManagerEvent
};
