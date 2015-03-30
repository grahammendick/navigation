import IRouter = require('./IRouter');
import StateRouter = require('./StateRouter');

var router: IRouter = new StateRouter();
export = router;
