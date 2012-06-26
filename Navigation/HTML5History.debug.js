/*
 * Adds HTLM5 history support to history navigation, with the following provisos:
 * - History points must be added using the StateController.
 * - The page must not have been navigated to using NavigationMode.Server.
 * - Cross page posting not supported from a page with route parameters.
 */
(function (app, prm, win) {

    if (!(win.history && history.pushState)) return;

    app._onIdle = function () { };

    app._setState = function (entry, title) {
        entry = entry || '';
        if (app._enableHistory && entry !== app._currentEntry && app._historyPointIsNew) {
            history.pushState(entry, title, n1);
            fixFormAction();
            app._currentEntry = entry;
            app._historyPointIsNew = false;
            ready = true;
        }
    };

    var ready = win.history.state;
    $addHandler(win, 'popstate', function (evt) {
        if (ready) {
            fixFormAction();
            app._historyPointIsNew = false;
            if (!evt.rawEvent.state && !app._state.__s)
                app.setServerState('0')
            app._navigate(evt.rawEvent.state);
        }
        ready = true;
    });

    function fixFormAction() {
        prm._form.action = location.href.indexOf('#') == -1 ? location.href : location.href.substr(0, location.href.indexOf('#'));
    };

})(Sys.Application, Sys.WebForms.PageRequestManager.getInstance(), window);