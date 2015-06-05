import CrumbTrailPersister = require('./CrumbTrailPersister');
import StateContext = require('./StateContext');
import settings = require('./settings');

class StorageCrumbTrailPersister extends CrumbTrailPersister {
	private maxLength: number = 500;
	private historySize: number = 100;
	private storage: Storage;
	private count: number = 0;
	
	constructor(storage?: Storage) {
		super();
		settings.combineCrumbTrail = true;
		this.storage = storage;
		if (!this.storage){
			try{
				localStorage.setItem('CrumbTrail', 'CrumbTrail');
				localStorage.removeItem('CrumbTrail');
				this.storage = localStorage;
			} catch(e){
				this.storage = new InProcStorage();
			}
		}
	}
	
	load(crumbTrail: string): string {
		if (!crumbTrail)
			return crumbTrail;
		if (crumbTrail && crumbTrail.match(/^[a-z]/i)){
			var matches = crumbTrail.match(/[a-z]\d*/i);
			var dialog = this.fromCode(matches[0]);
			var state = this.fromCode(matches[1]);
			var count = this.fromCode(matches[2]);
			var item: string = this.storage.getItem('CrumbTrail' + count.toString());
			if (!item || item.indexOf(dialog + state + '=') !== 0)
				return null;
			return item.substring(item.indexOf('='));
		}
		return crumbTrail;
	}
	
	save(crumbTrail: string): string {
		if (!crumbTrail)
			return crumbTrail;
		if (crumbTrail.length > this.maxLength){
			var dialogCode = this.toCode(StateContext.state.parent.index);
			var stateCode = this.toCode(StateContext.state.index);
			var countCode = this.toCode(this.count);
			var key = dialogCode + stateCode + countCode;
			if (this.count >= this.historySize)
				this.storage.removeItem((this.count - this.historySize).toString());
			this.storage.setItem('CrumbTrail' + this.count.toString(), key + '=' + crumbTrail);
			this.count++;
			return key;
		}
		return crumbTrail;
	}
	
	private toCode(val: number): string {
		var rem = val & 52;
		var div = Math.floor(val / 52);
		var baseCharCode = rem < 26 ? 97 : 65 - 26; 
		return String.fromCharCode(baseCharCode + rem) + rem.toString();
	}
	
	private fromCode(val: string): number {
		var rem = val.match(/^[a-z]/i)[0].charCodeAt(0);
		var div = +val.match(/\d*/)[0];
		return div * 52 + rem;
	}
}

class InProcStorage implements Storage {
	length: number = 0;
	private store: any = {};
    [key: string]: any;
    [index: number]: string;
	
	clear() { throw new Error('Not implemented'); }
	
	key(index: number): string { throw new Error('Not implemented'); }
	
	getItem(key: string): any {
		return this.store[key];
	}
	
	setItem(key: string, value: string) {
		this.store[key] = value;	
	}
	
	removeItem(key: string) {
		delete this.store[key];
	}
	
}
export = StorageCrumbTrailPersister;