var StateHandler = require('StateHandler');

var State = (function () {
    function State() {
        this._transitions = [];
        this.transitions = {};
        this.defaults = {};
        this.defaultTypes = {};
        this.formattedDefaults = {};
        this.trackCrumbTrail = true;
        this.stateHandler = new StateHandler();
        this.dispose = function () {
        };
        this.navigated = function (data) {
        };
        this.navigating = function (data, url, navigate) {
            navigate();
        };
    }
    return State;
})();
module.exports = State;
//# sourceMappingURL=State.js.map
