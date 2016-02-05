import CrumbTrailPersister = require('./CrumbTrailPersister');
import State = require('./config/State');

class StorageCrumbTrailPersister extends CrumbTrailPersister {
	private maxLength: number;
	private historySize: number;
	private storage: Storage;
	
	constructor(maxLength: number = 500, historySize: number = 100, storage?: Storage) {
		super();
		this.maxLength = maxLength;
		this.historySize = historySize;
		this.storage = storage;
		if (!this.storage) {
			try {
				localStorage.setItem('CrumbTrail', 'CrumbTrail');
				localStorage.removeItem('CrumbTrail');
				this.storage = localStorage;
			} catch(e) {
				this.storage = new InProcStorage();
			}
		}
	}
	
	load(crumbTrail: string): string {
		if (!crumbTrail)
			return crumbTrail;
		if (crumbTrail && crumbTrail.match(/^[a-z]/i)) {
			var codes = crumbTrail.match(/[a-z]\d*/ig);
			var item: string = this.storage.getItem('CrumbTrail' + codes[2]);
			if (!item || item.indexOf(codes[0] + codes[1] + '=') !== 0)
				return null;
			return item.substring(item.indexOf('=') + 1);
		}
		return crumbTrail;
	}
	
	save(crumbTrail: string, state: State): string {
		if (!crumbTrail)
			return crumbTrail;
		if (crumbTrail.length > this.maxLength) {
			var count = 0;
			if (this.storage.getItem('CrumbTrailCount') != null)
				count = +this.storage.getItem('CrumbTrailCount');
			var dialogCode = StorageCrumbTrailPersister.toCode(state.parent.index);
			var stateCode = StorageCrumbTrailPersister.toCode(state.index);
			var countCode = StorageCrumbTrailPersister.toCode(count % (10 * this.historySize));
			if (count >= this.historySize) {
				var purgeCode = StorageCrumbTrailPersister.toCode((count - this.historySize) % (10 * this.historySize));
				this.storage.removeItem('CrumbTrail' + purgeCode);
			}
			this.storage.setItem('CrumbTrail' + countCode, dialogCode + stateCode + '=' + crumbTrail);
			this.storage.setItem('CrumbTrailCount', (count + 1).toString());
			return dialogCode + stateCode + countCode;
		}
		return crumbTrail;
	}
	
	private static toCode(val: number): string {
		var rem = val % 52;
		var div = Math.floor(val / 52);
		return String.fromCharCode((rem < 26 ? 97 : 39) + rem) + (div ? div.toString() : '');
	}
}

class InProcStorage implements Storage {
	private store: any = {};
	length: number;
	remainingSpace: number;
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