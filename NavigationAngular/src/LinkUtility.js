var Navigation = require('navigation');

var LinkUtility = (function () {
    function LinkUtility() {
    }
    LinkUtility.setLink = function (element, attrs, linkAccessor) {
        try  {
            attrs.$set('href', Navigation.historyManager.getHref(linkAccessor()));
        } catch (e) {
            attrs.$set('href', null);
        }
    };

    LinkUtility.getData = function (toData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys)
            toData = Navigation.StateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = Navigation.StateContext.includeCurrentData(toData);
        return toData;
    };

    LinkUtility.addClickListener = function (element) {
        element.on('click', function (e) {
            var anchor = element[0];
            if (!e.ctrlKey && !e.shiftKey) {
                if (anchor.href) {
                    e.preventDefault();
                    Navigation.StateController.navigateLink(Navigation.historyManager.getUrl(anchor));
                }
            }
        });
    };

    LinkUtility.addNavigateHandler = function (element, handler) {
        Navigation.StateController.onNavigate(handler);
        element.on('$destroy', function () {
            return Navigation.StateController.offNavigate(handler);
        });
    };
    return LinkUtility;
})();
module.exports = LinkUtility;
//# sourceMappingURL=LinkUtility.js.map
