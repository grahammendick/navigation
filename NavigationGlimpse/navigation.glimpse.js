(function ($, pubsub) {
    var navigation = {};

    navigation.elements = (function () {
        var elements = {},
            find = function () {
                elements.scope = navigation.scope;
                elements.key = elements.scope.find('#navigation-key');
                elements.data = elements.scope.find('#navigation-data');
                elements.page = elements.scope.find('#navigation-page');
                elements.title = elements.scope.find('#navigation-title');
                elements.route = elements.scope.find('#navigation-route');
                elements.theme = elements.scope.find('#navigation-theme');
                elements.masters = elements.scope.find('#navigation-masters');
                elements.defaultTypes = elements.scope.find('#navigation-defaultTypes');
                elements.derived = elements.scope.find('#navigation-derived');
                elements.trackCrumbTrail = elements.scope.find('#navigation-trackCrumbTrail');
                elements.checkPhysicalUrlAccess = elements.scope.find('#navigation-checkPhysicalUrlAccess');
            };
        pubsub.subscribe('action.navigation.shell.loaded', find);
        return elements;
    })();

    (function () {
        var setup = function () {
            navigation.scope.html('<div style="display:table;width:98%;padding:10px"><div style="display:table-row">'
                + '<div style="display:table-cell"><canvas id="navigation-glimpse" style="border:1px solid #000"></canvas>'
                + '</div><div style="display:table-cell;width:100%;vertical-align:top">'
                + '<div id="navigation-key" class="glimpse-header" style="text-align:center;padding:0"></div>'
                + '<table style="margin-left:10px"><tbody class="glimpse-row-holder"><tr class="glimpse-row">'
                + '<th scope="row" style="width:140px">Data</th><td id="navigation-data"></td></tr>'
                + '<tr class="glimpse-row"><th scope="row">Page</th><td id="navigation-page"></td></tr>'
                + '<tr class="glimpse-row"><th scope="row">Title</th><td id="navigation-title"></td></tr>'
                + '<tr class="glimpse-row"><th scope="row">Route</th><td id="navigation-route"></td></tr>'
                + '<tr class="glimpse-row"><th scope="row">Theme</th><td id="navigation-theme"></td></tr>'
                + '<tr class="glimpse-row"><th scope="row">Masters</th><td id="navigation-masters"></td></tr>'
                + '<tr class="glimpse-row"><th scope="row">DefaultTypes</th><td id="navigation-defaultTypes"></td></tr>'
                + '<tr class="glimpse-row"><th scope="row">Derived</th><td id="navigation-derived"></td></tr>'
                + '<tr class="glimpse-row"><th scope="row">TrackCrumbTrail</th><td id="navigation-trackCrumbTrail"></td></tr>'
                + '<tr class="glimpse-row"><th scope="row">CheckPhysicalUrlAccess</th><td id="navigation-checkPhysicalUrlAccess"></td></tr>'
                + '</tbody></table></div></div></div>');
            navigation.canvas = $('#navigation-glimpse')[0];
            navigation.canvas.width = 750;
            navigation.canvas.height = 275;
            navigation.canvas.context = navigation.canvas.getContext('2d');
            navigation.font = '"Segoe UI Web Regular", "Segoe UI", "Helvetica Neue", Helvetica, Arial';
            pubsub.publish('action.navigation.shell.loaded');
        };
        pubsub.subscribe('trigger.navigation.shell.init', setup);
    })();

    (function () {
        var wireListeners = function () {
            var dragging = false;
            var x, y = 0;
            navigation.scope.delegate('#navigation-glimpse', 'click', function (e) {
                update(navigation.states, getPoint(e));
                render();
            });
            navigation.scope.delegate('#navigation-glimpse', 'mousedown', function (e) {
                if (!getState(navigation.states, getPoint(e))) {
                    e.preventDefault();
                    dragging = true;
                    x = e.pageX - navigation.x;
                    y = e.pageY - navigation.y;
                }
            });
            $(document).mouseup(function (e) {
                dragging = false;
            });
            $(document).mousemove(function (e) {
                if (dragging) {
                    navigation.x = Math.max(Math.min(0, e.pageX - x), -1 * navigation.w + navigation.canvas.width);
                    navigation.y = Math.max(Math.min(0, e.pageY - y), -1 * navigation.h + navigation.canvas.height);
                    render();
                } else {
                    if (e.target === navigation.canvas) {
                        if (getState(navigation.states, getPoint(e)))
                            navigation.canvas.style.cursor = 'pointer';
                        else
                            navigation.canvas.style.cursor = '';
                    }
                }
            });
            $(window).resize(function (e) {
                navigation.canvas.style.display = 'none';
                navigation.canvas.style.offsetHeight;
                navigation.canvas.style.display = 'block';
            });
        },
        getPoint = function (e) {
            return {
                x: (e.offsetX ? e.offsetX : e.pageX - $(navigation.canvas).offset().left) - navigation.x,
                y: (e.offsetY ? e.offsetY : e.pageY - $(navigation.canvas).offset().top) - navigation.y
            };
        },
        getState = function (states, point) {
            for (var i = 0; i < states.length; i++) {
                var state = states[i];
                if (state.x <= point.x && point.x <= state.x + state.w &&
                    state.y <= point.y && point.y <= state.y + state.h)
                    return state;
            }
            return null;
        },
        update = function (states, point) {
            var oldSelection,
                newSelection = null;
            for (var i = 0; i < states.length; i++) {
                var state = states[i];
                if (state.selected)
                    oldSelection = state;
                if (state.x <= point.x && point.x <= state.x + state.w &&
                    state.y <= point.y && point.y <= state.y + state.h) {
                    state.selected = true;
                    newSelection = state;
                }
            }
            if (newSelection && oldSelection && oldSelection !== newSelection)
                oldSelection.selected = false;
        },
        render = function () {
            navigation.canvas.context.save();
            navigation.canvas.context.clearRect(0, 0, navigation.canvas.width, navigation.canvas.height);
            navigation.canvas.context.translate(navigation.x, navigation.y);
            processStates(navigation.canvas.context, navigation.states, navigation.font);
            processTransitions(navigation.canvas.context, navigation.transitions, navigation.font);
            navigation.canvas.context.restore();
        },
        processStates = function (context, states, font) {
            for (var i = 0; i < states.length; i++) {
                var state = states[i];
                if (state.index === 0) {
                    context.font = '14px ' + font;
                    context.textAlign = 'left';
                    context.fillText(state.dialogKey, state.x + 10, state.y - 5, 2 * state.w);
                }
                context.save();
                context.fillStyle = '#fff';
                if (state.selected) {
                    context.fillStyle = '#e6f5e6';
                    processSelectedState(navigation.elements, state);
                }
                context.shadowOffsetX = 3;
                context.shadowOffsetY = 3;
                context.shadowBlur = 10;
                context.shadowColor = '#999';
                context.beginPath();
                context.rect(state.x, state.y, state.w, state.h);
                context.fill();
                context.restore();
                context.stroke();
                context.font = 'bold 12px ' + font;
                context.textAlign = 'center';
                context.fillText(state.key, state.x + state.w / 2, state.y + 30, state.w - 2);
                context.textAlign = 'left';
                context.font = '10px ' + font;
                if (state.navigationLinks) {
                    var linkText = state.navigationLinks.length > 1 ? ' links' : ' link';
                    context.fillText(state.navigationLinks.length + linkText, state.x + 5, state.y + 12);
                }
                context.textAlign = 'right';
                if (state.current)
                    context.fillText('current', state.x + state.w - 5, state.y + 12);
                if (state.previous) {
                    var previousText = state.back ? 'previous & back' : 'previous';
                    context.fillText(previousText, state.x + state.w - 5, state.y + 12);
                } else {
                    if (state.back)
                        context.fillText('back ' + state.back, state.x + state.w - 5, state.y + 12);
                }
            }
        },
        processSelectedState = function (elements, state) {
            elements.key.text(state.dialogKey + '-' + state.key);
            elements.data.text(convertDictionary(state.data));
            elements.page.text(state.page);
            elements.title.text(state.title);
            elements.route.text(state.route);
            elements.theme.text(state.theme);
            elements.masters.text(state.masters.join(', '));
            elements.defaultTypes.text(convertDictionary(state.defaultTypes));
            elements.derived.text(state.derived.join(', '));
            elements.trackCrumbTrail.text(state.trackCrumbTrail.toString());
            elements.checkPhysicalUrlAccess.text(state.checkPhysicalUrlAccess.toString());
        },
        convertDictionary = function (dictionary) {
            var arr = [];
            for (var key in dictionary) {
                var val = dictionary[key];
                arr.push(key + '=' + (JSON && JSON.stringify && $.isPlainObject(val) ? JSON.stringify(val) : val));
            }
            return arr.join(', ');
        },
        processTransitions = function (context, transitions, font) {
            context.font = 'italic 12px ' + font;
            context.beginPath();
            for (var i = 0; i < transitions.length; i++) {
                var transition = transitions[i];
                context.moveTo(transition.x1, transition.y);
                context.lineTo(transition.x1, transition.y + transition.h);
                context.lineTo(transition.x2, transition.y + transition.h);
                context.lineTo(transition.x2, transition.y);
                context.textAlign = 'center';
                context.fillText(transition.key, transition.x1 + (transition.x2 - transition.x1) / 2,
                    transition.y + transition.h + 12);
                context.moveTo(transition.x2 - 5, transition.y + 10);
                context.lineTo(transition.x2, transition.y);
                context.lineTo(transition.x2 + 5, transition.y + 10);
            }
            context.stroke();
        };
        pubsub.subscribe('trigger.navigation.shell.subscriptions', wireListeners);
        pubsub.subscribe('trigger.navigation.event.render', render);
    })();

    (function () {
        var init = function () {
            pubsub.publish('trigger.navigation.shell.init');
            pubsub.publish('trigger.navigation.shell.subscriptions');
            pubsub.publish('trigger.navigation.event.render');
        },
        prerender = function (args) {
            args.pluginData._data = args.pluginData.data;
            args.pluginData.data = 'Loading data, please wait...';
        },
        postrender = function (args) {
            args.pluginData.data = args.pluginData._data;
            args.pluginData._data = null;
            navigation.data = args.pluginData.data;
            navigation.states = navigation.data.states;
            navigation.transitions = navigation.data.transitions;
            navigation.x = navigation.data.x;
            navigation.y = navigation.data.y;
            navigation.w = navigation.data.w;
            navigation.h = navigation.data.h;
            navigation.scope = args.panel;
            pubsub.publishAsync('trigger.navigation.init');
        };
        pubsub.subscribe('trigger.navigation.init', init);
        pubsub.subscribe('action.panel.rendering.navigation_glimpse', prerender);
        pubsub.subscribe('action.panel.rendered.navigation_glimpse', postrender);
    })();
})(jQueryGlimpse, glimpse.pubsub);
