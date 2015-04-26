var LinkUtility = require('./LinkUtility');
var Navigation = require('navigation');
var ko = require('knockout');

var RefreshLink = ko.bindingHandlers['refreshLink'] = {
    init: function (element, valueAccessor, allBindings) {
        LinkUtility.addClickListener(element);
        LinkUtility.addNavigateHandler(element, function () {
            return setRefreshLink(element, valueAccessor, allBindings);
        });
    },
    update: function (element, valueAccessor, allBindings) {
        element.removeAttribute('data-state-context-url');
        setRefreshLink(element, valueAccessor, allBindings);
    }
};

function setRefreshLink(element, valueAccessor, allBindings) {
    LinkUtility.setLink(element, function () {
        return Navigation.StateController.getRefreshLink(LinkUtility.getData(valueAccessor(), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')));
    });
}
module.exports = RefreshLink;
//# sourceMappingURL=RefreshLink.js.map
