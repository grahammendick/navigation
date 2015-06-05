import CrumbTrailPersister = require('./CrumbTrailPersister');
import StateContext = require('./StateContext');
import settings = require('./settings');

class StorageCrumbTrailPersister extends CrumbTrailPersister {
	private maxLength: number = 500;
	private historySize: number = 50;
	private storage: Storage;
	private count: number = 0;
	
	constructor(storage?: Storage) {
		super();
		settings.combineCrumbTrail = true;
		this.storage = storage;
		if (!this.storage){
			try{
				localStorage.setItem('StorageCrumbTrailPersister', 'test');
				localStorage.removeItem('StorageCrumbTrailPersister');
				this.storage = localStorage;
			} catch(e){
				this.storage = new InProcStorage();
			}
		}
	}
	
	load(crumbTrail: string): string {
		return crumbTrail;
	}
	
	save(crumbTrail: string): string {
		if (!crumbTrail)
			return crumbTrail;
		if (crumbTrail.length > this.maxLength){
			var dialogCode = this.getCode(StateContext.state.parent.index);
			var stateCode = this.getCode(StateContext.state.index);
			var countCode = this.getCode(this.count);
			var key = dialogCode + stateCode + countCode;
			if (this.count >= this.historySize)
				this.storage.removeItem((this.count - this.historySize).toString());
			this.storage.setItem(this.count.toString(), key + '=' + crumbTrail);
			this.count++;
			return key;
		}
		return crumbTrail;
	}
	
	private getCode(val: number): string {
		var rem = val & 52;
		var div = Math.floor(val / 52);
		var baseCharCode = rem < 26 ? 97 : 65 - 26; 
		return String.fromCharCode(baseCharCode + rem) + rem.toString();
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