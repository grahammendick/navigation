import CrumbTrailPersister = require('./CrumbTrailPersister');

class LocalStorageCrumbTrailPersister extends CrumbTrailPersister {
	load(crumbTrail: string): string {
		return crumbTrail;
	}
	
	save(crumbTrail: string): string {
		return crumbTrail;
	}
}
export = LocalStorageCrumbTrailPersister;