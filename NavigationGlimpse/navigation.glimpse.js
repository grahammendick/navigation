(function ($, pubsub, util) {
    var navigation = {};

    navigation.elements = (function () {
        var elements = {},
            find = function () {
                elements.scope = navigation.scope;
                elements.key = elements.scope.find('#navigation-key');
                elements.table = elements.scope.find('tbody');
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
                + '<table style="margin-left:10px"><tbody class="glimpse-row-holder"></tbody></table></div></div></div>');
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
                if (hitTest(state.text, point) || hitTest(state.linkText,point))
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
                if (hitTest(state.text, point) || hitTest(state.linkText, point)) {
                    state.selected = true;
                    state.showLinks = hitTest(state.linkText, point);
                    newSelection = state;
                }
            }
            if (newSelection && oldSelection && oldSelection !== newSelection)
                oldSelection.selected = false;
        },
        hitTest = function (region, point) {
            if (region) {
                if (region.x <= point.x && point.x <= region.x + region.w &&
                    region.y <= point.y && point.y <= region.y + region.h)
                    return true;
            }
            return false;
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
                context.save();
                context.font = '9pt ' + font;
                context.textAlign = 'center';
                context.fillStyle = '#2200C1';
                context.fillText(state.key, state.x + state.w / 2, state.y + 30, state.w - 2);
                state.text = {
                    x: state.x + state.w / 2 - context.measureText(state.key).width / 2,
                    y: state.y + 21,
                    w: context.measureText(state.key).width,
                    h: 11
                };
                context.beginPath();
                context.moveTo(state.text.x, state.text.y + state.text.h - .5);
                context.lineTo(state.text.x + state.text.w, state.text.y + state.text.h - .5);
                context.strokeStyle = '#2200C1';
                context.textAlign = 'left';
                context.font = '9pt ' + font;
                if (state.navigationLinks) {
                    var linkText = state.navigationLinks.length + (state.navigationLinks.length > 1 ? ' links' : ' link');
                    context.fillText(linkText, state.x + 5, state.y + 14);
                    state.linkText = {
                        x: state.x + 5,
                        y: state.y + 5,
                        w: context.measureText(linkText).width,
                        h: 11
                    };
                    context.moveTo(state.linkText.x, state.linkText.y + state.linkText.h - .5);
                    context.lineTo(state.linkText.x + state.linkText.w, state.linkText.y + state.text.h - .5);
                }
                context.stroke();
                context.closePath();
                context.restore();
                context.font = '10px ' + font;
                context.textAlign = 'center';
                var text = null;
                if (state.current)
                    text = !state.previous ? 'current' : 'previous & current';
                if (state.back)
                    text = !state.previous ? 'back ' + state.back : 'previous & back';
                if (!text && state.previous)
                    text = 'previous';
                if (text)
                    context.fillText(text, state.x + state.w / 2, state.y + 42, state.w - 2);
            }
        },
        processSelectedState = function (elements, state) {
            elements.key.text(state.dialogKey + '-' + state.key);
            var table = '';
            if (!state.showLinks) {
                table += getRow('Data', convertDictionary(state.data));
                table += getRow('Page', state.page);
                table += getRow('Controller', state.controller);
                table += getRow('ApiController', state.apiController);
                table += getRow('Action', state.action);
                table += getRow('Title', state.title);
                table += getRow('Route', state.route);
                table += getRow('Theme', state.theme);
                table += getRow('Masters', state.masters.join(', '));
                table += getRow('DefaultTypes', convertDictionary(state.defaultTypes));
                table += getRow('Derived', state.derived.join(', '));
                table += getRow('TrackCrumbTrail', state.trackCrumbTrail);
                table += getRow('CheckPhysicalUrlAccess', state.checkPhysicalUrlAccess);
            } else {
                for (var i = 0; i < state.navigationLinks.length; i++) {
                    var data = convertDictionary(state.navigationLinks[i].data);
                    table += '<tr class="glimpse-row"><td><a href="' + state.navigationLinks[i].link + '">'
                        + (data ? util.htmlEncode(data) : '&nbsp;&nbsp;&nbsp;') + '</a></td></tr>';
                }
            }
            elements.table.html(table);
        },
        getRow = function (key, value) {
            if ((typeof value !== 'boolean' && !value) || (typeof value === 'boolean' && value))
                return '';
            var row = '<tr class="glimpse-row"><th scope="row" style="width:140px">{0}</th><td>{1}</td></tr>';
            return row.replace('{0}', util.htmlEncode(key)).replace('{1}', util.htmlEncode(value.toString()));
        }
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
})(jQueryGlimpse, glimpse.pubsub, glimpse.util);
