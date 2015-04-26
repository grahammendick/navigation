var Navigation = require('navigation');
var ko = require('knockout');

var LinkUtility = (function () {
    function LinkUtility() {
    }
    LinkUtility.setLink = function (element, linkAccessor) {
        if (element.getAttribute('data-state-context-url') !== Navigation.StateContext.url) {
            try  {
                element.href = Navigation.historyManager.getHref(linkAccessor());
            } catch (e) {
                element.removeAttribute('href');
            }
            element.setAttribute('data-state-context-url', Navigation.StateContext.url);
        }
    };

    LinkUtility.getData = function (toData, includeCurrentData, currentDataKeys) {
        var data = {};
        toData = ko.unwrap(toData);
        for (var key in toData) {
            data[key] = ko.unwrap(toData[key]);
        }
        includeCurrentData = ko.unwrap(includeCurrentData);
        currentDataKeys = ko.unwrap(currentDataKeys);
        if (currentDataKeys)
            data = Navigation.StateContext.includeCurrentData(data, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            data = Navigation.StateContext.includeCurrentData(data);
        return data;
    };

    LinkUtility.addClickListener = function (element) {
        var navigate = function (e) {
            if (!e.ctrlKey && !e.shiftKey) {
                if (element.href) {
                    if (e.preventDefault)
                        e.preventDefault();
                    else
                        e['returnValue'] = false;
                    Navigation.StateController.navigateLink(Navigation.historyManager.getUrl(element));
                }
            }
        };
        if (window.addEventListener)
            element.addEventListener('click', navigate);
        else
            element.attachEvent('onclick', navigate);
    };

    LinkUtility.addNavigateHandler = function (element, handler) {
        Navigation.StateController.onNavigate(handler);
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            return Navigation.StateController.offNavigate(handler);
        });
    };
    return LinkUtility;
})();
module.exports = LinkUtility;
//# sourceMappingURL=LinkUtility.js.map
