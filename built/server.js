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
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
const app_1 = __importDefault(require("./app"));
const receiver_1 = require("./receiver");
/* eslint-disable no-console */
process.on('uncaughtException', err => console.log('uncaughtException', err));
process.on('unhandledRejection', reason => console.log('unhandledRejection', reason));
/* eslint-enable no-console */
// Read .env if file exists
dotenv_1.default.config();
// Start listening for connections, and serve static files
const server = new MRE.WebHost({
    //baseUrl: 'http://altspace-theremin.azurewebsites.net',
    //baseUrl: 'http://altspace-theremin.ngrok.io',
    baseUrl: 'http://45.55.43.77',
    port: process.env.PORT,
    baseDir: path_1.resolve(__dirname, '../public')
});
const ourReceiver = new receiver_1.PianoReceiver();
//const ourSender: OscSender = new OscSender();
//const ourReceiver: PianoReceiver=null;
//const ourSender: OscSender=null;
// Handle new application sessions
server.adapter.onConnection(context => {
    //const sessionId=context.sessionId;
    //const session=(server.adapter as MRE.MultipeerAdapter).sessions[sessionId];
    MRE.log.info("app", "about the create new App in server.ts");
    return new app_1.default(context, server.baseUrl, server.baseDir, ourReceiver);
});
//# sourceMappingURL=server.js.map