var LinkUtility = require('./LinkUtility');
var Navigation = require('navigation');
var ko = require('knockout');

var NavigationLink = ko.bindingHandlers['navigationLink'] = {
    init: function (element, valueAccessor, allBindings) {
        LinkUtility.addClickListener(element);
        LinkUtility.addNavigateHandler(element, function () {
            return setNavigationLink(element, valueAccessor, allBindings);
        });
    },
    update: function (element, valueAccessor, allBindings) {
        element.removeAttribute('data-state-context-url');
        setNavigationLink(element, valueAccessor, allBindings);
    }
};

function setNavigationLink(element, valueAccessor, allBindings) {
    LinkUtility.setLink(element, function () {
        return Navigation.StateController.getNavigationLink(ko.unwrap(valueAccessor()), LinkUtility.getData(allBindings.get('toData'), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')));
    });
}
module.exports = NavigationLink;
//# sourceMappingURL=NavigationLink.js.map
