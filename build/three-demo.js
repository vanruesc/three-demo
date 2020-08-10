/**
 * three-demo v4.0.0 build Tue Aug 11 2020
 * https://github.com/vanruesc/three-demo
 * Copyright 2020 Raoul van Rüschen
 * @license Zlib
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('dat.gui')) :
    typeof define === 'function' && define.amd ? define(['exports', 'three', 'dat.gui'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.THREEDEMO = {}, global.THREE, global.DAT.GUI));
}(this, (function (exports, three, dat_gui) { 'use strict';

    var Demo = (function () {
        function Demo(id) {
            if (id === void 0) { id = "demo"; }
            this.scene = new three.Scene();
            this.id = id;
            this.renderer = null;
            this.loadingManager = new three.LoadingManager();
            this.assets = new Map();
            this.scene = new three.Scene();
            this.camera = null;
            this.ready = false;
        }
        Demo.prototype.setRenderer = function (renderer) {
            this.renderer = renderer;
            return this;
        };
        Demo.prototype.getCamera = function () {
            return this.camera;
        };
        Demo.prototype.load = function () {
            return Promise.resolve();
        };
        Demo.prototype.initialize = function () { };
        Demo.prototype.render = function (deltaTime) {
            this.renderer.render(this.scene, this.camera);
        };
        Demo.prototype.registerOptions = function (menu) { };
        Demo.prototype.reset = function () {
            this.scene = new three.Scene();
            this.camera = null;
            this.ready = false;
            return this;
        };
        return Demo;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var DemoManagerEvent = (function () {
        function DemoManagerEvent(type) {
            this.type = type;
            this.previousDemo = null;
            this.demo = null;
        }
        return DemoManagerEvent;
    }());

    var change = new DemoManagerEvent("change");
    var load = new DemoManagerEvent("load");

    var MILLISECONDS_TO_SECONDS = 1.0 / 1e3;
    var DemoManager = (function (_super) {
        __extends(DemoManager, _super);
        function DemoManager(viewport, _a) {
            var _b = _a.aside, aside = _b === void 0 ? viewport : _b, renderer = _a.renderer;
            var _this = _super.call(this) || this;
            _this.renderer = renderer;
            if (_this.renderer === undefined) {
                var renderer_1 = new three.WebGLRenderer();
                renderer_1.setSize(viewport.clientWidth, viewport.clientHeight);
                renderer_1.setPixelRatio(window.devicePixelRatio);
                _this.renderer = renderer_1;
            }
            _this.timestamp = 0.0;
            _this.menu = new dat_gui.GUI({ autoPlace: false });
            _this.demos = new Map();
            _this.demo = null;
            _this.currentDemo = null;
            viewport.appendChild(_this.renderer.domElement);
            aside.appendChild(_this.menu.domElement);
            return _this;
        }
        DemoManager.prototype.resetMenu = function () {
            var _this = this;
            var node = this.menu.domElement.parentNode;
            var menu = new dat_gui.GUI({ autoPlace: false });
            if (this.demos.size > 1) {
                var selection = menu.add(this, "demo", Array.from(this.demos.keys()));
                selection.onChange(function () { return _this.loadDemo(); });
            }
            node.removeChild(this.menu.domElement);
            node.appendChild(menu.domElement);
            this.menu.destroy();
            this.menu = menu;
            return menu;
        };
        DemoManager.prototype.startDemo = function (demo) {
            if (demo.id === this.demo) {
                demo.initialize();
                demo.registerOptions(this.resetMenu());
                demo.ready = true;
                load.demo = demo;
                this.dispatchEvent(load);
            }
        };
        DemoManager.prototype.loadDemo = function () {
            var _this = this;
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
                .then(function () { return _this.startDemo(nextDemo); })
                .catch(console.error);
        };
        DemoManager.prototype.addDemo = function (demo) {
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
        DemoManager.prototype.removeDemo = function (id) {
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
        DemoManager.prototype.setSize = function (width, height, updateStyle) {
            if (updateStyle === void 0) { updateStyle = true; }
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
        DemoManager.prototype.render = function (timestamp) {
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
