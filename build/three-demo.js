/**
 * three-demo v1.1.0 build May 31 2018
 * https://github.com/vanruesc/three-demo
 * Copyright 2018 Raoul van Rüschen, Zlib
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('dat.gui'), require('stats.js')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three', 'dat.gui', 'stats.js'], factory) :
  (factory((global.THREEDEMO = {}),global.THREE,global.dat,global.Stats));
}(this, (function (exports,three,dat,Stats) { 'use strict';

  dat = dat && dat.hasOwnProperty('default') ? dat['default'] : dat;
  Stats = Stats && Stats.hasOwnProperty('default') ? Stats['default'] : Stats;

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();









  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };











  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var Demo = function () {
  		function Demo() {
  				var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "demo";
  				classCallCheck(this, Demo);


  				this.id = id;

  				this.renderer = null;

  				this.loadingManager = new three.LoadingManager();

  				this.assets = new Map();

  				this.scene = new three.Scene();

  				this.camera = null;

  				this.controls = null;

  				this.ready = false;
  		}

  		createClass(Demo, [{
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

  						var fog = this.scene.fog;

  						this.scene = new three.Scene();
  						this.scene.fog = fog;
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

  var Event = function Event(type) {
  		classCallCheck(this, Event);


  		this.type = type;

  		this.target = null;
  };

  var EventTarget = function () {
  		function EventTarget() {
  				classCallCheck(this, EventTarget);


  				this.listenerFunctions = new Map();

  				this.listenerObjects = new Map();
  		}

  		createClass(EventTarget, [{
  				key: "addEventListener",
  				value: function addEventListener(type, listener) {

  						var m = typeof listener === "function" ? this.listenerFunctions : this.listenerObjects;

  						if (m.has(type)) {

  								m.get(type).add(listener);
  						} else {

  								m.set(type, new Set([listener]));
  						}
  				}
  		}, {
  				key: "removeEventListener",
  				value: function removeEventListener(type, listener) {

  						var m = typeof listener === "function" ? this.listenerFunctions : this.listenerObjects;

  						var listeners = void 0;

  						if (m.has(type)) {

  								listeners = m.get(type);
  								listeners.delete(listener);

  								if (listeners.size === 0) {

  										m.delete(type);
  								}
  						}
  				}
  		}, {
  				key: "dispatchEvent",
  				value: function dispatchEvent(event) {
  						var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;


  						var listenerFunctions = target.listenerFunctions;
  						var listenerObjects = target.listenerObjects;

  						var listeners = void 0;
  						var listener = void 0;

  						event.target = target;

  						if (listenerFunctions.has(event.type)) {

  								listeners = listenerFunctions.get(event.type);

  								var _iteratorNormalCompletion = true;
  								var _didIteratorError = false;
  								var _iteratorError = undefined;

  								try {
  										for (var _iterator = listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  												listener = _step.value;


  												listener.call(target, event);
  										}
  								} catch (err) {
  										_didIteratorError = true;
  										_iteratorError = err;
  								} finally {
  										try {
  												if (!_iteratorNormalCompletion && _iterator.return) {
  														_iterator.return();
  												}
  										} finally {
  												if (_didIteratorError) {
  														throw _iteratorError;
  												}
  										}
  								}
  						}

  						if (listenerObjects.has(event.type)) {

  								listeners = listenerObjects.get(event.type);

  								var _iteratorNormalCompletion2 = true;
  								var _didIteratorError2 = false;
  								var _iteratorError2 = undefined;

  								try {
  										for (var _iterator2 = listeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
  												listener = _step2.value;


  												listener.handleEvent(event);
  										}
  								} catch (err) {
  										_didIteratorError2 = true;
  										_iteratorError2 = err;
  								} finally {
  										try {
  												if (!_iteratorNormalCompletion2 && _iterator2.return) {
  														_iterator2.return();
  												}
  										} finally {
  												if (_didIteratorError2) {
  														throw _iteratorError2;
  												}
  										}
  								}
  						}
  				}
  		}]);
  		return EventTarget;
  }();

  var DemoManagerEvent = function (_Event) {
  		inherits(DemoManagerEvent, _Event);

  		function DemoManagerEvent(type) {
  				classCallCheck(this, DemoManagerEvent);

  				var _this = possibleConstructorReturn(this, (DemoManagerEvent.__proto__ || Object.getPrototypeOf(DemoManagerEvent)).call(this, type));

  				_this.previousDemo = null;

  				_this.demo = null;

  				return _this;
  		}

  		return DemoManagerEvent;
  }(Event);

  var change = new DemoManagerEvent("change");

  var load = new DemoManagerEvent("load");

  var initialHash = window.location.hash.slice(1);

  var DemoManager = function (_EventTarget) {
  		inherits(DemoManager, _EventTarget);

  		function DemoManager(viewport) {
  				var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  				classCallCheck(this, DemoManager);


  				var aside = options.aside !== undefined ? options.aside : viewport;

  				var _this = possibleConstructorReturn(this, (DemoManager.__proto__ || Object.getPrototypeOf(DemoManager)).call(this));

  				_this.renderer = options.renderer !== undefined ? options.renderer : function () {

  						var renderer = new three.WebGLRenderer();
  						renderer.setSize(viewport.clientWidth, viewport.clientHeight);
  						renderer.setPixelRatio(window.devicePixelRatio);

  						return renderer;
  				}();

  				viewport.appendChild(_this.renderer.domElement);

  				_this.clock = new three.Clock();

  				_this.menu = new dat.GUI({ autoPlace: false });

  				aside.appendChild(_this.menu.domElement);

  				_this.statistics = new Stats();
  				_this.statistics.dom.id = "statistics";

  				aside.appendChild(_this.statistics.domElement);

  				_this.demos = new Map();

  				_this.demo = null;

  				_this.currentDemo = null;

  				return _this;
  		}

  		createClass(DemoManager, [{
  				key: "resetMenu",
  				value: function resetMenu() {
  						var _this2 = this;

  						var node = this.menu.domElement.parentNode;
  						var menu = new dat.GUI({ autoPlace: false });

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

  						var id = this.demo;
  						var demos = this.demos;
  						var demo = demos.get(id);
  						var previousDemo = this.currentDemo;
  						var renderer = this.renderer;

  						window.location.hash = id;

  						if (previousDemo !== null) {

  								previousDemo.reset();
  						}

  						this.menu.domElement.style.display = "none";

  						renderer.clear();

  						change.previousDemo = previousDemo;
  						change.demo = demo;
  						this.currentDemo = demo;
  						this.dispatchEvent(change);

  						demo.load().then(function () {
  								return _this3.startDemo(demo);
  						}).catch(function (e) {
  								return console.error(e);
  						});
  				}
  		}, {
  				key: "addDemo",
  				value: function addDemo(demo) {

  						var currentDemo = this.currentDemo;

  						this.demos.set(demo.id, demo.setRenderer(this.renderer));

  						if (this.demo === null || demo.id === initialHash) {

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

  						var firstEntry = void 0;

  						if (demos.has(id)) {

  								demos.delete(id);

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
  				value: function setSize(width, height) {

  						var demo = this.currentDemo;

  						this.renderer.setSize(width, height);

  						if (demo !== null && demo.camera !== null) {

  								demo.camera.aspect = width / height;
  								demo.camera.updateProjectionMatrix();
  						}
  				}
  		}, {
  				key: "render",
  				value: function render(now) {

  						var demo = this.currentDemo;
  						var delta = this.clock.getDelta();

  						if (demo !== null && demo.ready) {

  								this.statistics.begin();
  								demo.render(delta);
  								this.statistics.end();
  						}
  				}
  		}]);
  		return DemoManager;
  }(EventTarget);

  exports.Demo = Demo;
  exports.DemoManager = DemoManager;
  exports.DemoManagerEvent = DemoManagerEvent;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
