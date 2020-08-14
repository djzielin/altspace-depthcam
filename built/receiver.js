"use strict";
/*!
 * Licensed under the MIT License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PianoReceiver = void 0;
const MRE = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
//import * as MRE from '../../mixed-reality-extension-sdk/packages/sdk/';
const ws_1 = __importDefault(require("ws"));
class PianoReceiver {
    constructor() {
        this.ourCallbacks = [];
        this.lastNote = 0;
        this.lastVel = 0;
        this.lastChannel = 0;
        this.lastTime = 0;
        this.wss = new ws_1.default.Server({ port: 3902 });
        this.wss.on('connection', (ws) => {
            MRE.log.info("app", 'remote midi keyboard has connected!');
            ws.on('message', (message) => {
                for (const singleCallback of this.ourCallbacks) { //broadcast to all listeners
                    if (singleCallback) {
                        singleCallback(message);
                    }
                }
            });
        });
    }
    addReceiver(callback) {
        MRE.log.info("app", "adding receiver callback");
        this.ourCallbacks.push(callback);
        MRE.log.info("app", "size of callback array now: " + this.ourCallbacks.length);
    }
    removeReceiver(callback) {
        MRE.log.info("app", "attempting to remove receiver callback");
        const index = this.ourCallbacks.indexOf(callback);
        if (index > -1) {
            this.ourCallbacks.splice(index, 1);
        }
        MRE.log.info("app", "size of callback array now: " + this.ourCallbacks.length);
    }
}
exports.PianoReceiver = PianoReceiver;
//# sourceMappingURL=receiver.js.map