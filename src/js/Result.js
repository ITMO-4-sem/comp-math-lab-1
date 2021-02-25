"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
class Result {
    constructor(resultStatus, resultMessage) {
        this.status = resultStatus;
        this.message = resultMessage;
    }
    getStatus() {
        return this.status;
    }
    getMessage() {
        return this.message;
    }
}
exports.Result = Result;
//# sourceMappingURL=Result.js.map