"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import Delay from './Delay';
// import If from './If';
// import InOrder from './InOrder';
// import InParallel from './InParallel';
var InSeries_1 = __importDefault(require("./InSeries"));
var PassThrough_1 = __importDefault(require("./PassThrough"));
var SHORT_CHAIN = InSeries_1.default.apply(void 0, Array(1000).fill(PassThrough_1.default));
var LONG_CHAIN = InSeries_1.default.apply(void 0, Array(1000).fill(SHORT_CHAIN));
LONG_CHAIN(function () { }, 1, 2, 3);
