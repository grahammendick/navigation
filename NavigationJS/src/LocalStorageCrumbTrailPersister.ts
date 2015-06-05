import CrumbTrailPersister = require('./CrumbTrailPersister');

class LocalStorageCrumbTrailPersister extends CrumbTrailPersister {
	maxLength: number = 500;
	historySize: number = 50;
	
	load(crumbTrail: string): string {
		return crumbTrail;
	}
	
	save(crumbTrail: string): string {
		return crumbTrail;
	}
}
export = LocalStorageCrumbTrailPersister;