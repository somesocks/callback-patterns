"use strict";
/* eslint-env node */
var nullCallback = function nullCallback(err) {
    if (err) {
        console.warn('callback-patterns ignored error\n', err);
    }
};
module.exports = nullCallback;
