import CrumbTrailPersister = require('./CrumbTrailPersister');
import settings = require('./settings');

class StorageCrumbTrailPersister extends CrumbTrailPersister {
	private maxLength: number = 500;
	private historySize: number = 50;
	private storage: Storage;
	
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
		return crumbTrail;
	}
}

class InProcStorage implements Storage {
	length: number = 0;
	private store: any = {};
    [key: string]: any;
    [index: number]: string;
	
	getItem(key: string): any {
		return this.store[key];
	}
	
	setItem(key: string, value: string) {
		this.store[key] = value;	
	}
	
	removeItem(key: string) {
		delete this.store[key];
	}
	
	clear() { throw new Error('Not implemented'); }
	key(index: number): string { throw new Error('Not implemented'); }
}
export = StorageCrumbTrailPersister;