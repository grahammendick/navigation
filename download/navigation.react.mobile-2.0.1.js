/**
 * Navigation React Mobile v2.0.1
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/
 * License: Apache-2.0
 */
var NavigationReactMobile = (function (exports,navigation,React,navigationReact) {
    'use strict';

    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    var MobileHistoryManager = /** @class */ (function (_super) {
        __extends(MobileHistoryManager, _super);
        function MobileHistoryManager(buildCurrentUrl, applicationPath) {
            var _this = _super.call(this, applicationPath || '') || this;
            _this.hash = false;
            _this.buildCurrentUrl = buildCurrentUrl;
            _this.hash = applicationPath === undefined;
            return _this;
        }
        MobileHistoryManager.prototype.getHref = function (url) {
            var queryIndex = url.indexOf('?');
            if (queryIndex >= 0) {
                var path = url.substring(0, queryIndex);
                var query = url.substring(queryIndex + 1);
                var params = query.split('&');
                var crumblessParams = [];
                for (var i = 0; i < params.length; i++) {
                    if (params[i].substring(0, 6) !== 'crumb=') {
                        crumblessParams.push(params[i]);
                    }
                }
                var crumblessQuery = crumblessParams.join('&');
                url = "" + path + (crumblessQuery && '?') + crumblessQuery;
            }
            return !this.hash ? _super.prototype.getHref.call(this, url) : '#' + url;
        };
        MobileHistoryManager.prototype.getUrl = function (hrefElement) {
            return !this.hash ? _super.prototype.getUrl.call(this, hrefElement) : hrefElement.hash.substring(1);
        };
        MobileHistoryManager.prototype.getCurrentUrl = function () {
            var url = this.getUrl(location);
            if (this.buildCurrentUrl)
                url = this.buildCurrentUrl(url);
            return url;
        };
        return MobileHistoryManager;
    }(navigation.HTML5HistoryManager));

    var Motion = /** @class */ (function (_super) {
        __extends(Motion, _super);
        function Motion(props) {
            var _this = _super.call(this, props) || this;
            _this.animate = _this.animate.bind(_this);
            _this.state = { items: [], restart: false };
            return _this;
        }
        Motion.getDerivedStateFromProps = function (props, _a) {
            var prevItems = _a.items;
            var tick = typeof performance !== 'undefined' ? performance.now() : 0;
            var _b = Motion.move(tick, prevItems, props), items = _b.items, moving = _b.moving;
            return { items: items, restart: moving };
        };
        Motion.prototype.componentDidMount = function () {
            this.animateId = requestAnimationFrame(this.animate);
        };
        Motion.prototype.componentDidUpdate = function () {
            if (!this.animateId && this.state.restart)
                this.animateId = requestAnimationFrame(this.animate);
        };
        Motion.prototype.componentWillUnmount = function () {
            cancelAnimationFrame(this.animateId);
        };
        Motion.prototype.animate = function (tick) {
            var _this = this;
            this.setState(function (_a) {
                var prevItems = _a.items;
                var _b = Motion.move(tick, prevItems, _this.props), items = _b.items, moving = _b.moving;
                _this.animateId = null;
                if (moving)
                    _this.animateId = requestAnimationFrame(_this.animate);
                return { items: items, restart: false };
            });
        };
        Motion.move = function (tick, prevItems, props) {
            var data = props.data, enter = props.enter, leave = props.leave, update = props.update, progress = props.progress, getKey = props.getKey, duration = props.duration, onRest = props.onRest;
            var dataByKey = data.reduce(function (acc, item, index) {
                var _a;
                return (__assign({}, acc, (_a = {}, _a[getKey(item)] = __assign({}, item, { index: index }), _a)));
            }, {});
            var itemsByKey = prevItems.reduce(function (acc, item) {
                var _a;
                return (__assign({}, acc, (_a = {}, _a[item.key] = item, _a)));
            }, {});
            var items = prevItems
                .map(function (item, index) {
                var matchedItem = dataByKey[item.key];
                var nextItem = { key: item.key, data: matchedItem || item.data, tick: tick };
                nextItem.end = !matchedItem ? (leave || update)(item.data) : update(matchedItem);
                nextItem.index = !matchedItem ? data.length + index : matchedItem.index;
                var unchanged = Motion.areEqual(item.end, nextItem.end);
                if (unchanged) {
                    nextItem.start = item.start;
                    nextItem.rest = item.progress === 1;
                    var progressDelta = (nextItem.tick - item.tick) / duration;
                    nextItem.progress = Math.min(item.progress + progressDelta, 1);
                }
                else {
                    nextItem.rest = false;
                    var reverse = !unchanged && Motion.areEqual(item.start, nextItem.end);
                    nextItem.start = reverse ? item.end : (!progress ? item.style : item.start);
                    nextItem.progress = reverse ? 1 - item.progress : progress;
                }
                nextItem.style = Motion.interpolateStyle(nextItem);
                if (onRest && nextItem.rest && !item.rest)
                    onRest(item.data);
                return nextItem;
            })
                .filter(function (item) { return dataByKey[item.key] || (!item.rest && leave); })
                .concat(data
                .filter(function (item) { return !itemsByKey[getKey(item)]; })
                .map(function (item) {
                var index = dataByKey[getKey(item)].index;
                var newItem = { key: getKey(item), data: item, tick: tick, rest: false, index: index };
                newItem.start = newItem.style = enter(item);
                newItem.end = update(item);
                newItem.progress = Motion.areEqual(newItem.start, newItem.end) ? 1 : 0;
                return newItem;
            }))
                .sort(function (a, b) { return a.index - b.index; });
            return { items: items, moving: items.filter(function (_a) {
                    var rest = _a.rest;
                    return !rest;
                }).length !== 0 };
        };
        Motion.areEqual = function (from, to) {
            if (from === void 0) { from = {}; }
            if (to === void 0) { to = {}; }
            if (Object.keys(from).length !== Object.keys(to).length)
                return false;
            for (var key in from) {
                if (from[key] !== to[key])
                    return false;
            }
            return true;
        };
        Motion.interpolateStyle = function (_a) {
            var start = _a.start, end = _a.end, progress = _a.progress;
            var style = {};
            for (var key in end)
                style[key] = start[key] + (progress * (end[key] - start[key]));
            return style;
        };
        Motion.prototype.render = function () {
            return this.props.children(this.state.items);
        };
        Motion.defaultProps = {
            progress: 0
        };
        return Motion;
    }(React.Component));

    var Scene = /** @class */ (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Scene.prototype.shouldComponentUpdate = function (_a) {
            var navigationEvent = _a.navigationEvent, stateNavigator = _a.stateNavigator;
            var index = navigationEvent.stateNavigator.stateContext.crumbs.length;
            return stateNavigator.stateContext.crumbs.length === index
                && navigationEvent !== this.props.navigationEvent;
        };
        Scene.prototype.render = function () {
            return (React.createElement(navigationReact.NavigationContext.Provider, { value: this.props.navigationEvent }, this.props.children));
        };
        return Scene;
    }(React.Component));

    var SharedElementRegistry = /** @class */ (function () {
        function SharedElementRegistry() {
            this.sharedElements = {};
        }
        SharedElementRegistry.prototype.registerSharedElement = function (scene, name, ref, data) {
            this.sharedElements[scene] = this.sharedElements[scene] || {};
            this.sharedElements[scene][name] = { ref: ref, data: data };
        };
        SharedElementRegistry.prototype.unregisterSharedElement = function (scene, name) {
            if (this.sharedElements[scene]) {
                if (name)
                    delete this.sharedElements[scene][name];
                else
                    delete this.sharedElements[scene];
            }
        };
        SharedElementRegistry.prototype.getSharedElements = function (scene, oldScene) {
            if (scene === oldScene)
                return [];
            var oldSharedElements = this.sharedElements[oldScene];
            var mountedSharedElements = this.sharedElements[scene];
            var sharedElements = [];
            for (var name in mountedSharedElements) {
                if (oldSharedElements && oldSharedElements[name]) {
                    sharedElements.push({
                        name: name,
                        oldElement: oldSharedElements[name],
                        mountedElement: mountedSharedElements[name]
                    });
                }
            }
            return sharedElements;
        };
        return SharedElementRegistry;
    }());

    var SharedElementContext = React.createContext(new SharedElementRegistry());

    var withStateNavigator = (function (Component) { return function (props) { return (React.createElement(navigationReact.NavigationContext.Consumer, null, function (navigationEvent) { return React.createElement(Component, __assign({ stateNavigator: navigationEvent.stateNavigator, navigationEvent: navigationEvent }, props)); })); }; });

    var NavigationMotion = /** @class */ (function (_super) {
        __extends(NavigationMotion, _super);
        function NavigationMotion(props) {
            var _a;
            var _this = _super.call(this, props) || this;
            _this.sharedElementRegistry = new SharedElementRegistry();
            var _b = _this.props, navigationEvent = _b.navigationEvent, stateNavigator = _b.stateNavigator;
            var _c = stateNavigator.stateContext, state = _c.state, crumbs = _c.crumbs;
            _this.state = { scenes: (_a = {}, _a[crumbs.length] = state && navigationEvent, _a), rest: false };
            return _this;
        }
        NavigationMotion.getDerivedStateFromProps = function (props, _a) {
            var _b;
            var scenes = _a.scenes;
            var navigationEvent = props.navigationEvent, stateNavigator = props.stateNavigator;
            var crumbs = stateNavigator.stateContext.crumbs;
            if (scenes[crumbs.length] === navigationEvent)
                return null;
            return { scenes: __assign({}, scenes, (_b = {}, _b[crumbs.length] = navigationEvent, _b)), rest: false };
        };
        NavigationMotion.prototype.getSharedElements = function () {
            var _a = this.props.stateNavigator.stateContext, crumbs = _a.crumbs, oldUrl = _a.oldUrl;
            if (oldUrl !== null && !this.state.rest) {
                var oldScene = oldUrl.split('crumb=').length - 1;
                return this.sharedElementRegistry.getSharedElements(crumbs.length, oldScene);
            }
            return [];
        };
        NavigationMotion.prototype.clearScene = function (index) {
            var _this = this;
            this.setState(function (_a) {
                var _b;
                var prevScenes = _a.scenes, prevRest = _a.rest;
                var scene = _this.getScenes().filter(function (scene) { return scene.key === index; })[0];
                if (!scene)
                    _this.sharedElementRegistry.unregisterSharedElement(index);
                var scenes = __assign({}, prevScenes, (_b = {}, _b[index] = scene ? prevScenes[index] : null, _b));
                var rest = prevRest || (scene && scene.mount);
                return (scenes[index] !== prevScenes[index] || rest !== prevRest) ? { scenes: scenes, rest: rest } : null;
            });
        };
        NavigationMotion.prototype.getScenes = function () {
            var stateNavigator = this.props.stateNavigator;
            var _a = stateNavigator.stateContext, crumbs = _a.crumbs, nextCrumb = _a.nextCrumb;
            return crumbs.concat(nextCrumb).map(function (_a, index, crumbsAndNext) {
                var state = _a.state, data = _a.data, url = _a.url;
                var preCrumbs = crumbsAndNext.slice(0, index);
                var _b = crumbsAndNext[index + 1] || { state: undefined, data: undefined }, nextState = _b.state, nextData = _b.data;
                return { key: index, state: state, data: data, url: url, crumbs: preCrumbs, nextState: nextState, nextData: nextData, mount: url === nextCrumb.url };
            });
        };
        NavigationMotion.prototype.getStyle = function (mounted, _a) {
            var state = _a.state, data = _a.data, crumbs = _a.crumbs, nextState = _a.nextState, nextData = _a.nextData, mount = _a.mount;
            var _b = this.props, unmountedStyle = _b.unmountedStyle, mountedStyle = _b.mountedStyle, crumbStyle = _b.crumbStyle;
            var styleProp = !mounted ? unmountedStyle : (mount ? mountedStyle : crumbStyle);
            return typeof styleProp === 'function' ? styleProp(state, data, crumbs, nextState, nextData) : styleProp;
        };
        NavigationMotion.prototype.render = function () {
            var _this = this;
            var _a = this.props, children = _a.children, duration = _a.duration, sharedElementMotion = _a.sharedElementMotion, stateNavigator = _a.stateNavigator;
            var _b = stateNavigator.stateContext, crumbs = _b.crumbs, oldState = _b.oldState, stateContext = stateNavigator.stateContext;
            return (stateContext.state &&
                React.createElement(SharedElementContext.Provider, { value: this.sharedElementRegistry },
                    React.createElement(Motion, { data: this.getScenes(), getKey: function (_a) {
                            var key = _a.key;
                            return key;
                        }, enter: function (scene) { return _this.getStyle(!oldState, scene); }, update: function (scene) { return _this.getStyle(true, scene); }, leave: function (scene) { return _this.getStyle(false, scene); }, onRest: function (_a) {
                            var key = _a.key;
                            return _this.clearScene(key);
                        }, duration: duration }, function (styles) { return (styles.map(function (_a) {
                        var _b = _a.data, key = _b.key, state = _b.state, data = _b.data, style = _a.style;
                        var navigationEvent = _this.state.scenes[key];
                        var scene = navigationEvent && (React.createElement(Scene, { navigationEvent: navigationEvent, stateNavigator: stateNavigator }, state.renderScene(data)));
                        return children(style, scene, key, crumbs.length === key, state, data);
                    }).concat(sharedElementMotion && sharedElementMotion({
                        key: 'sharedElements',
                        sharedElements: _this.getSharedElements(),
                        progress: styles[crumbs.length] && styles[crumbs.length].progress,
                        duration: duration
                    }))); })));
        };
        NavigationMotion.defaultProps = {
            duration: 300
        };
        return NavigationMotion;
    }(React.Component));
    var NavigationMotion$1 = withStateNavigator(NavigationMotion);

    var SharedElement = /** @class */ (function (_super) {
        __extends(SharedElement, _super);
        function SharedElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SharedElement.prototype.componentDidMount = function () {
            this.register();
        };
        SharedElement.prototype.componentDidUpdate = function (prevProps) {
            var _a = this.props, stateNavigator = _a.stateNavigator, sharedElementRegistry = _a.sharedElementRegistry;
            var scene = stateNavigator.stateContext.crumbs.length;
            sharedElementRegistry.unregisterSharedElement(scene, prevProps.name);
            this.register();
        };
        SharedElement.prototype.componentWillUnmount = function () {
            var _a = this.props, stateNavigator = _a.stateNavigator, sharedElementRegistry = _a.sharedElementRegistry;
            var scene = stateNavigator.stateContext.crumbs.length;
            sharedElementRegistry.unregisterSharedElement(scene, this.props.name);
        };
        SharedElement.prototype.register = function () {
            var _a = this.props, unshare = _a.unshare, name = _a.name, data = _a.data, stateNavigator = _a.stateNavigator, sharedElementRegistry = _a.sharedElementRegistry;
            var scene = stateNavigator.stateContext.crumbs.length;
            if (!unshare) {
                if (this.ref)
                    sharedElementRegistry.registerSharedElement(scene, name, this.ref, data);
            }
            else {
                sharedElementRegistry.unregisterSharedElement(scene, name);
            }
        };
        SharedElement.prototype.render = function () {
            var _this = this;
            return React.cloneElement(this.props.children, { ref: function (el) { return _this.ref = el; } });
        };
        return SharedElement;
    }(React.Component));
    var SharedElement$1 = withStateNavigator(function (props) { return (React.createElement(SharedElementContext.Consumer, null, function (sharedElementRegistry) { return (React.createElement(SharedElement, __assign({}, props, { sharedElementRegistry: sharedElementRegistry }))); })); });

    var SharedElementMotion = /** @class */ (function (_super) {
        __extends(SharedElementMotion, _super);
        function SharedElementMotion() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SharedElementMotion.prototype.componentDidUpdate = function (prevProps) {
            var prevSharedElements = this.getSharedElements(prevProps.sharedElements);
            var sharedElements = this.getSharedElements(this.props.sharedElements);
            this.diff(prevSharedElements, sharedElements, this.props.onAnimated);
            this.diff(sharedElements, prevSharedElements, this.props.onAnimating);
        };
        SharedElementMotion.prototype.diff = function (fromSharedElements, toSharedElements, action) {
            for (var name in fromSharedElements) {
                var from = fromSharedElements[name];
                var to = toSharedElements[name];
                if (!to || from.mountedElement.ref !== to.mountedElement.ref) {
                    if (action)
                        action(name, from.oldElement.ref, from.oldElement.data);
                    if (action)
                        action(name, from.mountedElement.ref, from.mountedElement.data);
                }
            }
        };
        SharedElementMotion.prototype.getSharedElements = function (sharedElements) {
            return sharedElements.reduce(function (elements, element) {
                var _a;
                return (__assign({}, elements, (_a = {}, _a[element.name] = element, _a)));
            }, {});
        };
        SharedElementMotion.prototype.getStyle = function (name, _a) {
            var ref = _a.ref, data = _a.data;
            var _b = ref.getBoundingClientRect(), top = _b.top, left = _b.left, width = _b.width, height = _b.height;
            return this.props.elementStyle(name, ref, __assign({ top: top, left: left, width: width, height: height }, data));
        };
        SharedElementMotion.prototype.getPropValue = function (prop, name) {
            return typeof prop === 'function' ? prop(name) : prop;
        };
        SharedElementMotion.prototype.render = function () {
            var _this = this;
            var _a = this.props, sharedElements = _a.sharedElements, children = _a.children, progress = _a.progress, duration = _a.duration;
            return (sharedElements.length !== 0 &&
                React.createElement(Motion, { data: sharedElements, getKey: function (_a) {
                        var name = _a.name;
                        return name;
                    }, enter: function (_a) {
                        var name = _a.name, oldElement = _a.oldElement;
                        return _this.getStyle(name, oldElement);
                    }, update: function (_a) {
                        var name = _a.name, mountedElement = _a.mountedElement;
                        return _this.getStyle(name, mountedElement);
                    }, progress: progress < 1 ? progress : 0, duration: duration }, function (styles) { return (styles.map(function (_a) {
                    var _b = _a.data, name = _b.name, oldElement = _b.oldElement, mountedElement = _b.mountedElement, style = _a.style, start = _a.start, end = _a.end;
                    return (children(style, name, __assign({}, start, oldElement.data), __assign({}, end, mountedElement.data)));
                })); }));
        };
        SharedElementMotion.defaultProps = {
            duration: 300,
            elementStyle: function (name, ref, data) { return data; }
        };
        return SharedElementMotion;
    }(React.Component));

    exports.MobileHistoryManager = MobileHistoryManager;
    exports.NavigationMotion = NavigationMotion$1;
    exports.SharedElement = SharedElement$1;
    exports.SharedElementMotion = SharedElementMotion;

    return exports;

}({},Navigation,React,NavigationReact));
