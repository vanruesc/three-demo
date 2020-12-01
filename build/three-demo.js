/**
 * three-demo v4.0.5 build Tue Dec 01 2020
 * https://github.com/vanruesc/three-demo
 * Copyright 2020 Raoul van Rüschen
 * @license Zlib
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('dat.gui')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three', 'dat.gui'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.THREEDEMO = {}, global.THREE, global.DAT.GUI));
}(this, (function (exports, three, dat_gui) { 'use strict';

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

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
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

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  var Demo = function () {
    function Demo() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "demo";

      _classCallCheck(this, Demo);

      this.scene = new three.Scene();
      this.id = id;
      this.renderer = null;
      this.loadingManager = new three.LoadingManager();
      this.assets = new Map();
      this.scene = new three.Scene();
      this.camera = null;
      this.ready = false;
    }

    _createClass(Demo, [{
      key: "setRenderer",
      value: function setRenderer(renderer) {
        this.renderer = renderer;
        return this;
      }
    }, {
      key: "getCamera",
      value: function getCamera() {
        return this.camera;
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
      value: function render(deltaTime) {
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
        this.ready = false;
        return this;
      }
    }]);

    return Demo;
  }();

  var DemoManagerEvent = function DemoManagerEvent(type) {
    _classCallCheck(this, DemoManagerEvent);

    this.type = type;
    this.previousDemo = null;
    this.demo = null;
  };

  var change = new DemoManagerEvent("change");
  var load = new DemoManagerEvent("load");

  var MILLISECONDS_TO_SECONDS = 1 / 1e3;
  var DemoManager = function (_EventDispatcher) {
    _inherits(DemoManager, _EventDispatcher);

    var _super = _createSuper(DemoManager);

    function DemoManager(viewport, _ref) {
      var _this;

      var _ref$aside = _ref.aside,
          aside = _ref$aside === void 0 ? viewport : _ref$aside,
          renderer = _ref.renderer;

      _classCallCheck(this, DemoManager);

      _this = _super.call(this);
      _this.renderer = renderer;

      if (_this.renderer === void 0) {
        var renderer2 = new three.WebGLRenderer();
        renderer2.setSize(viewport.clientWidth, viewport.clientHeight);
        renderer2.setPixelRatio(window.devicePixelRatio);
        _this.renderer = renderer2;
      }

      _this.timestamp = 0;
      _this.menu = new dat_gui.GUI({
        autoPlace: false
      });
      _this.demos = new Map();
      _this.demo = null;
      _this.currentDemo = null;
      viewport.appendChild(_this.renderer.domElement);
      aside.appendChild(_this.menu.domElement);
      return _this;
    }

    _createClass(DemoManager, [{
      key: "resetMenu",
      value: function resetMenu() {
        var _this2 = this;

        var node = this.menu.domElement.parentNode;
        var menu = new dat_gui.GUI({
          autoPlace: false
        });

        if (this.demos.size > 1) {
          var selection = menu.add(this, "demo", Array.from(this.demos.keys()));
          selection.onChange(function () {
            return _this2.loadDemo();
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
        var _this3 = this;

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
          return _this3.startDemo(nextDemo);
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

        if (demos.has(id)) {
          demos["delete"](id);

          if (this.demo === id && demos.size > 0) {
            var entries = Array.from(demos.entries());
            var firstEntry = entries[0];
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
      value: function setSize(width, height) {
        var updateStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var demo = this.currentDemo;
        var camera = demo.getCamera();
        this.renderer.setSize(width, height, updateStyle);

        if (demo !== null && camera !== null) {
          if (camera instanceof three.OrthographicCamera) {
            camera.left = width / -2;
            camera.right = width / 2;
            camera.top = height / 2;
            camera.bottom = height / -2;
            camera.updateProjectionMatrix();
          } else if (camera instanceof three.PerspectiveCamera) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          }
        }
      }
    }, {
      key: "render",
      value: function render(timestamp) {
        var elapsed = (timestamp - this.timestamp) * MILLISECONDS_TO_SECONDS;
        this.timestamp = timestamp;
        var demo = this.currentDemo;

        if (demo !== null && demo.ready) {
          demo.render(elapsed);
        }
      }
    }]);

    return DemoManager;
  }(three.EventDispatcher);

  exports.Demo = Demo;
  exports.DemoManager = DemoManager;
  exports.DemoManagerEvent = DemoManagerEvent;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
