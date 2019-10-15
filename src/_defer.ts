/* globals setImmediate */
import 'setimmediate';

declare var setImmediate: Function;

var _defer = setImmediate;

export = _defer;
