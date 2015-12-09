import Dialog = require('./config/Dialog');
import State = require('./config/State');

class StateContext {
    static oldState: State = null;
    static oldDialog: Dialog = null;
    static oldData: any = {};
    static previousState: State = null;
    static previousDialog: Dialog = null;
    static previousData: any = {};
    static state: State = null;
    static dialog: Dialog = null;
    static data: any = {};
    static url: string = null;
    static title: string = null;

    static includeCurrentData(data: any, keys?: string[]): any {
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
            for (var dataKey in this.data) {
                this.data[dataKey] = this.state.defaults[dataKey];
            }
        }
    }
}
export = StateContext;
