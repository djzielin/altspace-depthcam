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
const MRE = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
//import * as MRE from '../../mixed-reality-extension-sdk/packages/sdk/';
const ws_1 = __importDefault(require("ws"));
class OscSender {
    constructor() {
        this.ourCallback = null;
        this.oscRemotes = [];
        const wss = new ws_1.default.Server({ port: 3903 });
        wss.on('connection', (ws) => {
            MRE.log.info("app", 'a remote osc forwarder has connected');
            this.oscRemotes.push(ws);
            ws.on('close', (code, reason) => {
                const index = this.oscRemotes.indexOf(ws);
                if (index > -1) {
                    this.oscRemotes.splice(index, 1);
                }
            });
        });
    }
    send(message) {
        for (const ws of this.oscRemotes) {
            ws.send(message);
        }
    }
}
exports.default = OscSender;
//# sourceMappingURL=sender.js.map