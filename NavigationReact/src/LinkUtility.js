var Navigation = require('navigation');
var React = require('react');

var LinkUtility = (function () {
    function LinkUtility() {
    }
    LinkUtility.cloneProps = function (elem) {
        var props = {};
        for (var key in elem.props) {
            props[key] = elem.props[key];
        }
        return props;
    };

    LinkUtility.setLink = function (component, props, linkAccessor) {
        var _this = this;
        try  {
            props.href = Navigation.historyManager.getHref(linkAccessor());
            props.onClick = function (e) {
                return _this.onClick(e, component.getDOMNode());
            };
        } catch (e) {
            props.href = null;
        }
    };

    LinkUtility.getData = function (toData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys)
            toData = Navigation.StateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = Navigation.StateContext.includeCurrentData(toData);
        return toData;
    };

    LinkUtility.onClick = function (e, element) {
        if (!e.ctrlKey && !e.shiftKey) {
            if (element.href) {
                e.preventDefault();
                Navigation.StateController.navigateLink(Navigation.historyManager.getUrl(element));
            }
        }
    };

    LinkUtility.createElement = function (props) {
        delete props.action;
        delete props.toData;
        delete props.includeCurrentData;
        delete props.currentDataKeys;
        delete props.distance;
        return React.createElement(props.href ? 'a' : 'span', props);
    };
    return LinkUtility;
})();
module.exports = LinkUtility;
//# sourceMappingURL=LinkUtility.js.map
