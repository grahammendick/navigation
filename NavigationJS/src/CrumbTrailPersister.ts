import StateContext = require('./StateContext');

class CrumbTrailPersister {
	load(crumbTrail: string): string {
		return crumbTrail;
	}
	
	save(crumbTrail: string, stateContext: StateContext): string {
		return crumbTrail;
	}
}
export = CrumbTrailPersister;