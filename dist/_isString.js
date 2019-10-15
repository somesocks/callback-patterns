"use strict";
function isString(val) {
    return (typeof val === 'string') || (val instanceof String);
}
;
module.exports = isString;
