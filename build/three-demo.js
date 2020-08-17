/**
 * three-demo v4.0.1 build Mon Aug 17 2020
 * https://github.com/vanruesc/three-demo
 * Copyright 2020 Raoul van Rüschen
 * @license Zlib
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('dat.gui')) :
    typeof define === 'function' && define.amd ? define(['exports', 'three', 'dat.gui'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.THREEDEMO = {}, global.THREE, global.DAT.GUI));
}(this, (function (exports, three, dat_gui) { 'use strict';

    var Demo = function Demo(id) {
        if ( id === void 0 ) id = "demo";

        this.scene = new three.Scene();
        this.id = id;
        this.renderer = null;
        this.loadingManager = new three.LoadingManager();
        this.assets = new Map();
        this.scene = new three.Scene();
        this.camera = null;
        this.ready = false;
    };
    Demo.prototype.setRenderer = function setRenderer (renderer) {
        this.renderer = renderer;
        return this;
    };
    Demo.prototype.getCamera = function getCamera () {
        return this.camera;
    };
    Demo.prototype.load = function load () {
        return Promise.resolve();
    };
    Demo.prototype.initialize = function initialize () { };
    Demo.prototype.render = function render (deltaTime) {
        this.renderer.render(this.scene, this.camera);
    };
    Demo.prototype.registerOptions = function registerOptions (menu) { };
    Demo.prototype.reset = function reset () {
        this.scene = new three.Scene();
        this.camera = null;
        this.ready = false;
        return this;
    };

    var DemoManagerEvent = function DemoManagerEvent(type) {
        this.type = type;
        this.previousDemo = null;
        this.demo = null;
    };

    var change = new DemoManagerEvent("change");
    var load = new DemoManagerEvent("load");

    var MILLISECONDS_TO_SECONDS = 1.0 / 1e3;
    var DemoManager = /*@__PURE__*/(function (EventDispatcher) {
        function DemoManager(viewport, ref) {
            var aside = ref.aside; if ( aside === void 0 ) aside = viewport;
            var renderer = ref.renderer;

            EventDispatcher.call(this);
            this.renderer = renderer;
            if (this.renderer === undefined) {
                var renderer$1 = new three.WebGLRenderer();
                renderer$1.setSize(viewport.clientWidth, viewport.clientHeight);
                renderer$1.setPixelRatio(window.devicePixelRatio);
                this.renderer = renderer$1;
            }
            this.timestamp = 0.0;
            this.menu = new dat_gui.GUI({ autoPlace: false });
            this.demos = new Map();
            this.demo = null;
            this.currentDemo = null;
            viewport.appendChild(this.renderer.domElement);
            aside.appendChild(this.menu.domElement);
        }

        if ( EventDispatcher ) DemoManager.__proto__ = EventDispatcher;
        DemoManager.prototype = Object.create( EventDispatcher && EventDispatcher.prototype );
        DemoManager.prototype.constructor = DemoManager;
        DemoManager.prototype.resetMenu = function resetMenu () {
            var this$1 = this;

            var node = this.menu.domElement.parentNode;
            var menu = new dat_gui.GUI({ autoPlace: false });
            if (this.demos.size > 1) {
                var selection = menu.add(this, "demo", Array.from(this.demos.keys()));
                selection.onChange(function () { return this$1.loadDemo(); });
            }
            node.removeChild(this.menu.domElement);
            node.appendChild(menu.domElement);
            this.menu.destroy();
            this.menu = menu;
            return menu;
        };
        DemoManager.prototype.startDemo = function startDemo (demo) {
            if (demo.id === this.demo) {
                demo.initialize();
                demo.registerOptions(this.resetMenu());
                demo.ready = true;
                load.demo = demo;
                this.dispatchEvent(load);
            }
        };
        DemoManager.prototype.loadDemo = function loadDemo () {
            var this$1 = this;

            var nextDemo = this.demos.get(this.demo);
            var currentDemo = this.currentDemo;
            var renderer = this.renderer;
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
            nextDemo.load()
                .then(function () { return this$1.startDemo(nextDemo); })
                .catch(console.error);
        };
        DemoManager.prototype.addDemo = function addDemo (demo) {
            var hash = window.location.hash.slice(1);
            var currentDemo = this.currentDemo;
            this.demos.set(demo.id, demo.setRenderer(this.renderer));
            if ((this.demo === null && hash.length === 0) || demo.id === hash) {
                this.demo = demo.id;
                this.loadDemo();
            }
            this.resetMenu();
            if (currentDemo !== null && currentDemo.ready) {
                currentDemo.registerOptions(this.menu);
            }
            return this;
        };
        DemoManager.prototype.removeDemo = function removeDemo (id) {
            var demos = this.demos;
            if (demos.has(id)) {
                demos.delete(id);
                if (this.demo === id && demos.size > 0) {
                    var entries = Array.from(demos.entries());
                    var firstEntry = entries[0];
                    this.demo = firstEntry[0];
                    this.currentDemo = firstEntry[1];
                    this.loadDemo();
                }
                else {
                    this.demo = null;
                    this.currentDemo = null;
                    this.renderer.clear();
                }
            }
            return this;
        };
        DemoManager.prototype.setSize = function setSize (width, height, updateStyle) {
            if ( updateStyle === void 0 ) updateStyle = true;

            var demo = this.currentDemo;
            var camera = demo.getCamera();
            this.renderer.setSize(width, height, updateStyle);
            if (demo !== null && camera !== null) {
                if (camera instanceof three.OrthographicCamera) {
                    camera.left = width / -2.0;
                    camera.right = width / 2.0;
                    camera.top = height / 2.0;
                    camera.bottom = height / -2.0;
                    camera.updateProjectionMatrix();
                }
                else if (camera instanceof three.PerspectiveCamera) {
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                }
            }
        };
        DemoManager.prototype.render = function render (timestamp) {
            var elapsed = (timestamp - this.timestamp) * MILLISECONDS_TO_SECONDS;
            this.timestamp = timestamp;
            var demo = this.currentDemo;
            if (demo !== null && demo.ready) {
                demo.render(elapsed);
            }
        };

        return DemoManager;
    }(three.EventDispatcher));

    exports.Demo = Demo;
    exports.DemoManager = DemoManager;
    exports.DemoManagerEvent = DemoManagerEvent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
