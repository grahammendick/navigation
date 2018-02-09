/**
 * Navigation React Mobile v1.0.0
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/
 * License: Apache-2.0
 */
(function (exports,navigation,React,navigationReact) {
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

















function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}



function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

var MobileHistoryManager =  (function (_super) {
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

var Motion =  (function (_super) {
    __extends(Motion, _super);
    function Motion(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.move = _this.move.bind(_this);
        _this.state = { items: [] };
        return _this;
    }
    Motion.prototype.componentWillReceiveProps = function () {
        if (!this.moveId)
            this.moveId = requestAnimationFrame(this.move);
    };
    Motion.prototype.componentDidMount = function () {
        this.moveId = requestAnimationFrame(this.move);
    };
    Motion.prototype.componentWillUnmount = function () {
        cancelAnimationFrame(this.moveId);
    };
    Motion.prototype.move = function (tick) {
        var _this = this;
        this.setState(function (_a) {
            var prevItems = _a.items;
            var _b = _this.props, data = _b.data, enter = _b.enter, leave = _b.leave, update = _b.update, progress = _b.progress, getKey = _b.getKey, duration = _b.duration, onRest = _b.onRest;
            var dataByKey = data.reduce(function (acc, item, index) {
                return (__assign({}, acc, (_a = {}, _a[getKey(item)] = __assign({}, item, { index: index }), _a)));
                var _a;
            }, {});
            var itemsByKey = prevItems.reduce(function (acc, item) {
                return (__assign({}, acc, (_a = {}, _a[item.key] = item, _a)));
                var _a;
            }, {});
            var items = prevItems
                .map(function (item, index) {
                var matchedItem = dataByKey[item.key];
                var nextItem = { key: item.key, data: matchedItem || item.data, tick: tick };
                nextItem.end = !matchedItem ? (leave || update)(item.data) : update(matchedItem);
                nextItem.index = !matchedItem ? data.length + index : matchedItem.index;
                var unchanged = _this.areEqual(item.end, nextItem.end);
                if (unchanged) {
                    nextItem.start = item.start;
                    nextItem.rest = item.progress === 1;
                    var progressDelta = (nextItem.tick - item.tick) / duration;
                    nextItem.progress = Math.min(item.progress + progressDelta, 1);
                }
                else {
                    nextItem.rest = false;
                    var reverse = !unchanged && _this.areEqual(item.start, nextItem.end);
                    nextItem.start = reverse ? item.end : (!progress ? item.style : item.start);
                    nextItem.progress = reverse ? 1 - item.progress : progress;
                }
                nextItem.style = _this.interpolateStyle(nextItem);
                if (onRest && nextItem.rest && !item.rest)
                    onRest(item.data);
                return nextItem;
            })
                .filter(function (item) { return dataByKey[item.key] || (!item.rest && leave); })
                .concat(data
                .filter(function (item) { return !itemsByKey[getKey(item)]; })
                .map(function (item) {
                var index = dataByKey[getKey(item)].index;
                var newItem = { key: getKey(item), data: item, progress: progress, tick: tick, rest: false, index: index };
                newItem.start = newItem.style = enter(item);
                newItem.end = update(item);
                return newItem;
            }))
                .sort(function (a, b) { return a.index - b.index; });
            _this.moveId = null;
            if (items.filter(function (_a) {
                var rest = _a.rest;
                return !rest;
            }).length !== 0)
                _this.moveId = requestAnimationFrame(_this.move);
            return { items: items };
        });
    };
    Motion.prototype.areEqual = function (from, to) {
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
    Motion.prototype.interpolateStyle = function (_a) {
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

var Scene =  (function (_super) {
    __extends(Scene, _super);
    function Scene(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.index = props.stateNavigator.stateContext.crumbs.length;
        return _this;
    }
    Scene.prototype.shouldComponentUpdate = function (props) {
        return this.index === this.props.stateNavigator.stateContext.crumbs.length;
    };
    Scene.prototype.render = function () {
        return this.props.children;
    };
    return Scene;
}(React.Component));

var withStateNavigator = function (Link) { return function (props) { return (React.createElement(navigationReact.NavigationContext.Consumer, null, function (value) { return React.createElement(Link, __assign({ stateNavigator: value && value.stateNavigator }, props)); })); }; };

var NavigationMotion =  (function (_super) {
    __extends(NavigationMotion, _super);
    function NavigationMotion(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.sharedElements = {};
        _this.onNavigate = _this.onNavigate.bind(_this);
        _this.registerSharedElement = _this.registerSharedElement.bind(_this);
        _this.unregisterSharedElement = _this.unregisterSharedElement.bind(_this);
        var scenes = {};
        var stateNavigator = _this.getStateNavigator();
        var _a = stateNavigator.stateContext, state = _a.state, data = _a.data, crumbs = _a.crumbs;
        if (state)
            scenes[crumbs.length] = React.createElement(Scene, { stateNavigator: stateNavigator }, state.renderScene(data));
        _this.state = { scenes: scenes, rest: false };
        return _this;
    }
    NavigationMotion.prototype.getChildContext = function () {
        return {
            registerSharedElement: this.registerSharedElement,
            unregisterSharedElement: this.unregisterSharedElement
        };
    };
    NavigationMotion.prototype.getStateNavigator = function () {
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    NavigationMotion.prototype.componentDidMount = function () {
        this.getStateNavigator().onNavigate(this.onNavigate);
    };
    NavigationMotion.prototype.componentWillUnmount = function () {
        this.getStateNavigator().offNavigate(this.onNavigate);
    };
    NavigationMotion.prototype.onNavigate = function (oldState, state, data) {
        var _this = this;
        this.setState(function (_a) {
            var prevScenes = _a.scenes;
            var scenes = __assign({}, prevScenes);
            var stateNavigator = _this.getStateNavigator();
            var crumbs = stateNavigator.stateContext.crumbs;
            scenes[crumbs.length] = React.createElement(Scene, { stateNavigator: stateNavigator }, state.renderScene(data));
            return { scenes: scenes, rest: false };
        });
    };
    NavigationMotion.prototype.registerSharedElement = function (scene, name, ref, data) {
        this.sharedElements[scene] = this.sharedElements[scene] || {};
        this.sharedElements[scene][name] = { ref: ref, data: data };
    };
    NavigationMotion.prototype.unregisterSharedElement = function (scene, name) {
        if (this.sharedElements[scene])
            delete this.sharedElements[scene][name];
    };
    NavigationMotion.prototype.getSharedElements = function (crumbs, oldUrl) {
        if (oldUrl === null || crumbs.length === oldUrl.split('crumb=').length - 1)
            return [];
        var oldSharedElements = this.sharedElements[oldUrl.split('crumb=').length - 1];
        var mountedSharedElements = this.sharedElements[crumbs.length];
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
    NavigationMotion.prototype.clearScene = function (index) {
        var _this = this;
        this.setState(function (_a) {
            var prevScenes = _a.scenes, prevRest = _a.rest;
            var scenes = __assign({}, prevScenes);
            var scene = _this.getScenes().filter(function (scene) { return scene.key === index; })[0];
            if (!scene) {
                delete scenes[index];
                delete _this.sharedElements[index];
            }
            var rest = prevRest || (scene && scene.mount);
            return { scenes: scenes, rest: rest };
        });
    };
    NavigationMotion.prototype.getScenes = function () {
        var _this = this;
        var _a = this.getStateNavigator().stateContext, crumbs = _a.crumbs, nextCrumb = _a.nextCrumb;
        return crumbs.concat(nextCrumb).map(function (_a, index) {
            var state = _a.state, data = _a.data, url = _a.url;
            return ({ key: index, state: state, data: data, url: url, scene: _this.state.scenes[index], mount: url === nextCrumb.url });
        });
    };
    NavigationMotion.prototype.getPropValue = function (prop, state, data) {
        return typeof prop === 'function' ? prop(state, data) : prop;
    };
    NavigationMotion.prototype.render = function () {
        var _this = this;
        var _a = this.props, unmountedStyle = _a.unmountedStyle, mountedStyle = _a.mountedStyle, crumbStyle = _a.crumbStyle, style = _a.style, children = _a.children, duration = _a.duration, sharedElementMotion = _a.sharedElementMotion;
        var _b = this.getStateNavigator(), _c = _b.stateContext, crumbs = _c.crumbs, oldUrl = _c.oldUrl, oldState = _c.oldState, stateContext = _b.stateContext;
        return (stateContext.state &&
            React.createElement(Motion, { data: this.getScenes(), getKey: function (_a) {
                    var key = _a.key;
                    return key;
                }, enter: function (_a) {
                    var state = _a.state, data = _a.data;
                    return _this.getPropValue(oldState ? unmountedStyle : mountedStyle, state, data);
                }, update: function (_a) {
                    var mount = _a.mount, state = _a.state, data = _a.data;
                    return _this.getPropValue(mount ? mountedStyle : crumbStyle, state, data);
                }, leave: function (_a) {
                    var state = _a.state, data = _a.data;
                    return _this.getPropValue(unmountedStyle, state, data);
                }, duration: duration, onRest: function (_a) {
                    var key = _a.key;
                    return _this.clearScene(key);
                } }, function (tweenStyles) { return (tweenStyles.map(function (_a) {
                var key = _a.key, _b = _a.data, scene = _b.scene, state = _b.state, data = _b.data, url = _b.url, progress = _a.progress, tweenStyle = _a.style;
                return (children(tweenStyle, scene, key, crumbs.length === key, state, data));
            }).concat(sharedElementMotion && sharedElementMotion({
                key: 'sharedElements',
                sharedElements: !_this.state.rest ? _this.getSharedElements(crumbs, oldUrl) : [],
                progress: tweenStyles[crumbs.length] && tweenStyles[crumbs.length].progress,
                duration: duration
            }))); }));
    };
    NavigationMotion.defaultProps = {
        duration: 300
    };
    NavigationMotion.contextTypes = {
        stateNavigator: function () { }
    };
    NavigationMotion.childContextTypes = {
        registerSharedElement: function () { },
        unregisterSharedElement: function () { }
    };
    return NavigationMotion;
}(React.Component));
var NavigationMotion$1 = withStateNavigator(NavigationMotion);

var SharedElement =  (function (_super) {
    __extends(SharedElement, _super);
    function SharedElement(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.scene = _this.getStateNavigator().stateContext.crumbs.length;
        _this.register = _this.register.bind(_this);
        return _this;
    }
    SharedElement.prototype.getStateNavigator = function () {
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    SharedElement.prototype.componentDidMount = function () {
        this.register();
    };
    SharedElement.prototype.componentDidUpdate = function (prevProps) {
        this.context.unregisterSharedElement(this.scene, prevProps.name);
        this.register();
    };
    SharedElement.prototype.componentWillUnmount = function () {
        this.context.unregisterSharedElement(this.scene, this.props.name);
    };
    SharedElement.prototype.register = function () {
        var _a = this.getStateNavigator().stateContext, crumbs = _a.crumbs, oldUrl = _a.oldUrl;
        if (this.scene === crumbs.length || (oldUrl && this.scene === oldUrl.split('crumb=').length - 1)) {
            var _b = this.props, unshare = _b.unshare, name = _b.name, data = _b.data;
            if (!unshare) {
                if (this.ref)
                    this.context.registerSharedElement(this.scene, name, this.ref, data);
            }
            else {
                this.context.unregisterSharedElement(this.scene, name);
            }
        }
    };
    SharedElement.prototype.render = function () {
        var _this = this;
        return React.cloneElement(this.props.children, { ref: function (el) { return _this.ref = el; } });
    };
    SharedElement.contextTypes = {
        stateNavigator: function () { },
        registerSharedElement: function () { },
        unregisterSharedElement: function () { }
    };
    return SharedElement;
}(React.Component));
var SharedElement$1 = withStateNavigator(SharedElement);

var SharedElementMotion =  (function (_super) {
    __extends(SharedElementMotion, _super);
    function SharedElementMotion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SharedElementMotion.prototype.componentWillReceiveProps = function (nextProps) {
        var sharedElements = this.getSharedElements(nextProps.sharedElements);
        var prevSharedElements = this.getSharedElements(this.props.sharedElements);
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
            return (__assign({}, elements, (_a = {}, _a[element.name] = element, _a)));
            var _a;
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
        var _a = this.props, sharedElements = _a.sharedElements, style = _a.style, children = _a.children, progress = _a.progress, duration = _a.duration, easing = _a.easing;
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
                }, progress: progress, duration: duration }, function (tweenStyles) { return (tweenStyles.map(function (_a) {
                var _b = _a.data, name = _b.name, oldElement = _b.oldElement, mountedElement = _b.mountedElement, tweenStyle = _a.style;
                return (children(tweenStyle, name, oldElement.data, mountedElement.data));
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

}((this.NavigationReactMobile = this.NavigationReactMobile || {}),Navigation,React,NavigationReact));
