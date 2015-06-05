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
export = StorageCrumbTrailPersister;