/*
 * Adds HTLM5 history support to history navigation, with the following provisos:
 * - History points must be added using the StateController.
 * - The page must not have been navigated to using NavigationMode.Server.
 * - Cross page posting not supported from a page with route parameters.
 */
(function (app, prm, win) {

    if (!(win.history && win.history.pushState)) return;

    app._onIdle = function () { };

    app._setState = function (entry, title) {
        if (app._enableHistory) {
            entry = entry || '';
            if (entry !== app._currentEntry) {
                app._currentEntry = entry;
                if (app._historyPointIsNew) {
                    win.history.pushState(entry, title, n1);
                    prm._form.action = win.location.href;
                    ready = true;
                }
                app._historyPointIsNew = false;
            }
        }
    };

    var ready = win.history.state;
    $addHandler(win, 'popstate', function (evt) {
        if (ready) {
            prm._form.action = win.location.href;
            app._historyPointIsNew = false;
            if (!evt.rawEvent.state && !app._state.__s)
                app.setServerState('0')
            app._navigate(evt.rawEvent.state);
        }
        ready = true;
    });

})(Sys.Application, Sys.WebForms.PageRequestManager.getInstance(), window);