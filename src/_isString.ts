
function isString(val : any) {
	return (typeof val === 'string') || (val instanceof String);
};

export = isString;
