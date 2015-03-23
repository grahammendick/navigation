import Dialog = require('config/Dialog');
import State = require('config/State');

class StateContext {
    static previousState: State;
    static previousDialog: Dialog;
    static state: State;
    static dialog: Dialog;
    static data: any;
    static url: string;

    static includeCurrentData(data: any, keys?: Array<string>): any {
        if (!keys) {
            keys = [];
            for (var key in this.data)
                keys.push(key);
        }
        var newData: any = {};
        for (var i = 0; i < keys.length; i++)
            newData[keys[i]] = this.data[keys[i]];
        for (var key in data)
            newData[key] = data[key];
        return newData;
    }

    static clear(key?: string) {
        if (key)
            this.data[key] = this.state.defaults[key];
        else {
            for (var key in this.data) {
                this.data[key] = this.state.defaults[key];
            }
        }
    }
}
export = StateContext;
