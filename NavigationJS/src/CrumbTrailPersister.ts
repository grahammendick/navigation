import State = require('./config/State');

class CrumbTrailPersister {
	load(crumbTrail: string): string {
		return crumbTrail;
	}
	
	save(crumbTrail: string, state: State): string {
		return crumbTrail;
	}
}
export = CrumbTrailPersister;