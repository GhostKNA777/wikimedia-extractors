"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosInstance = void 0;
var axios_1 = require("axios");
exports.axiosInstance = axios_1.default.create({
    timeout: 10000,
});
