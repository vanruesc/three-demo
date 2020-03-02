/**
 * three-demo v3.17.0 build Mon Mar 02 2020
 * https://github.com/vanruesc/three-demo
 * Copyright 2020 Raoul van Rüschen
 * @license Zlib
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('synthetic-event'), require('dat.gui')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three', 'synthetic-event', 'dat.gui'], factory) :
  (global = global || self, factory(global.THREEDEMO = {}, global.THREE, global.SYNTHETICEVENT, global.DAT.GUI));
}(this, (function (exports, three, syntheticEvent, dat_gui) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  var Demo = function () {
    function Demo() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "demo";

      _classCallCheck(this, Demo);

      this.id = id;
      this.renderer = null;
      this.loadingManager = new three.LoadingManager();
      this.assets = new Map();
      this.scene = new three.Scene();
      this.camera = null;
      this.controls = null;
      this.ready = false;
    }

    _createClass(Demo, [{
      key: "setRenderer",
      value: function setRenderer(renderer) {
        this.renderer = renderer;
        return this;
      }
    }, {
      key: "load",
      value: function load() {
        return Promise.resolve();
      }
    }, {
      key: "initialize",
      value: function initialize() {}
    }, {
      key: "render",
      value: function render(delta) {
        this.renderer.render(this.scene, this.camera);
      }
    }, {
      key: "registerOptions",
      value: function registerOptions(menu) {}
    }, {
      key: "reset",
      value: function reset() {
        this.scene = new three.Scene();
        this.camera = null;

        if (this.controls !== null) {
          this.controls.dispose();
          this.controls = null;
        }

        this.ready = false;
        return this;
      }
    }]);

    return Demo;
  }();

  var DemoManagerEvent = function (_Event) {
    _inherits(DemoManagerEvent, _Event);

    function DemoManagerEvent(type) {
      var _this;

      _classCallCheck(this, DemoManagerEvent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DemoManagerEvent).call(this, type));
      _this.previousDemo = null;
      _this.demo = null;
      return _this;
    }

    return DemoManagerEvent;
  }(syntheticEvent.Event);

  var change = new DemoManagerEvent("change");
  var load = new DemoManagerEvent("load");

  var DemoManager = function (_EventTarget) {
    _inherits(DemoManager, _EventTarget);

    function DemoManager(viewport) {
      var _this2;

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$aside = _ref.aside,
          aside = _ref$aside === void 0 ? viewport : _ref$aside,
          renderer = _ref.renderer;

      _classCallCheck(this, DemoManager);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(DemoManager).call(this));
      _this2.renderer = renderer !== undefined ? renderer : function () {
        var renderer = new three.WebGLRenderer();
        renderer.setSize(viewport.clientWidth, viewport.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        return renderer;
      }();
      viewport.appendChild(_this2.renderer.domElement);
      _this2.clock = new three.Clock();
      _this2.menu = new dat_gui.GUI({
        autoPlace: false
      });
      aside.appendChild(_this2.menu.domElement);
      _this2.demos = new Map();
      _this2.demo = null;
      _this2.currentDemo = null;
      return _this2;
    }

    _createClass(DemoManager, [{
      key: "resetMenu",
      value: function resetMenu() {
        var _this3 = this;

        var node = this.menu.domElement.parentNode;
        var menu = new dat_gui.GUI({
          autoPlace: false
        });

        if (this.demos.size > 1) {
          var selection = menu.add(this, "demo", Array.from(this.demos.keys()));
          selection.onChange(function () {
            return _this3.loadDemo();
          });
        }

        node.removeChild(this.menu.domElement);
        node.appendChild(menu.domElement);
        this.menu.destroy();
        this.menu = menu;
        return menu;
      }
    }, {
      key: "startDemo",
      value: function startDemo(demo) {
        if (demo.id === this.demo) {
          demo.initialize();
          demo.registerOptions(this.resetMenu());
          demo.ready = true;
          load.demo = demo;
          this.dispatchEvent(load);
        }
      }
    }, {
      key: "loadDemo",
      value: function loadDemo() {
        var _this4 = this;

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
        nextDemo.load().then(function () {
          return _this4.startDemo(nextDemo);
        })["catch"](console.error);
      }
    }, {
      key: "addDemo",
      value: function addDemo(demo) {
        var hash = window.location.hash.slice(1);
        var currentDemo = this.currentDemo;
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
    }, {
      key: "removeDemo",
      value: function removeDemo(id) {
        var demos = this.demos;
        var firstEntry;

        if (demos.has(id)) {
          demos["delete"](id);

          if (this.demo === id && demos.size > 0) {
            firstEntry = demos.entries().next().value;
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
    }, {
      key: "setSize",
      value: function setSize(width, height, updateStyle) {
        var demo = this.currentDemo;
        this.renderer.setSize(width, height, updateStyle);

        if (demo !== null && demo.camera !== null) {
          var camera = demo.camera;

          if (camera instanceof three.OrthographicCamera) {
            camera.left = width / -2.0;
            camera.right = width / 2.0;
            camera.top = height / 2.0;
            camera.bottom = height / -2.0;
            camera.updateProjectionMatrix();
          } else if (!(camera instanceof three.CubeCamera)) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          }
        }
      }
    }, {
      key: "render",
      value: function render(now) {
        var demo = this.currentDemo;
        var delta = this.clock.getDelta();

        if (demo !== null && demo.ready) {
          demo.render(delta);
        }
      }
    }]);

    return DemoManager;
  }(syntheticEvent.EventTarget);

  exports.Demo = Demo;
  exports.DemoManager = DemoManager;
  exports.DemoManagerEvent = DemoManagerEvent;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
