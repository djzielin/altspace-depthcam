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
const grabbutton_1 = __importDefault(require("./grabbutton"));
class MusicModule {
    constructor(ourApp) {
        this.ourApp = ourApp;
        this.ourGrabber = null;
        this.sendDestinations = [];
    }
    getWorldPosFromMatrix(mPoint) {
        const mGrabber = MRE.Matrix.Compose(new MRE.Vector3(1, 1, 1), this.ourGrabber.getRot(), this.ourGrabber.getPos());
        const transformedPoint = mPoint.multiply(mGrabber);
        const transformedPointPosition = transformedPoint.getTranslation();
        return transformedPointPosition;
    }
    getWorldPos(pos) {
        const mGrabber = MRE.Matrix.Compose(new MRE.Vector3(1, 1, 1), this.ourGrabber.getRot(), this.ourGrabber.getPos());
        const mPoint = MRE.Matrix.Compose(new MRE.Vector3(1, 1, 1), MRE.Quaternion.Identity(), pos);
        const transformedPoint = mPoint.multiply(mGrabber);
        const transformedPointPosition = transformedPoint.getTranslation();
        return transformedPointPosition;
    }
    hide() {
        this.ourGrabber.hide();
    }
    show() {
        this.ourGrabber.show();
    }
    createGrabber(pos, quat) {
        this.ourGrabber = new grabbutton_1.default(this.ourApp);
        this.ourGrabber.create(pos, quat);
    }
    receiveData(data) {
    }
    removeSendDestination(module) {
        const index = this.sendDestinations.indexOf(module);
        if (index > -1) {
            this.sendDestinations.splice(index, 1);
        }
    }
    sendData(data) {
        for (const singleModule of this.sendDestinations) {
            singleModule.receiveData(data);
        }
    }
}
exports.default = MusicModule;
//# sourceMappingURL=music_module.js.map