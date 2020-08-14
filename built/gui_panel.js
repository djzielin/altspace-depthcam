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
class GuiPanel {
    constructor(ourApp) {
        this.ourApp = ourApp;
        this.guiBackground = null;
        this.guiGrabber = null;
        this.backgroundHeight = 1.75;
    }
    getBackgroundPos() {
        return this.guiBackground.transform.local.position;
    }
    hide() {
        this.guiGrabber.hide();
    }
    show() {
        this.guiGrabber.show();
    }
    halfWay(a, b) {
        return (a.add(b)).multiplyByFloats(0.5, 0.5, 0.5);
    }
    getLength(a, b) {
        return (a.subtract(b)).length();
    }
    transformPoint(point) {
        this.ourApp.ourConsole.logMessage("trying to transform point: " + point);
        this.ourApp.ourConsole.logMessage("  gui grabber pos: " + this.guiGrabber.getPos());
        this.ourApp.ourConsole.logMessage("  panel pos: " + this.getBackgroundPos());
        const mGrabber = MRE.Matrix.Compose(new MRE.Vector3(1, 1, 1), this.guiGrabber.getRot(), this.guiGrabber.getPos());
        const mPanel = MRE.Matrix.Compose(new MRE.Vector3(1, 1, 1), MRE.Quaternion.Identity(), this.getBackgroundPos());
        const mPoint = MRE.Matrix.Compose(new MRE.Vector3(1, 1, 1), MRE.Quaternion.Identity(), point);
        const transformedPoint = mPoint.multiply(mPanel.multiply(mGrabber));
        const transformedPointPosition = transformedPoint.getTranslation();
        this.ourApp.ourConsole.logMessage("  computed: " + transformedPointPosition);
        return transformedPointPosition;
    }
    createPatchLine(linePosition1, linePosition2) {
        const halfwayLine = this.halfWay(linePosition1, linePosition2);
        const distance = this.getLength(linePosition1, linePosition2);
        const lineActor = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                name: "patcher_line",
                appearance: {
                    meshId: this.ourApp.boxMesh.id,
                    materialId: this.ourApp.blackMat.id,
                    enabled: true
                },
                transform: {
                    local: {
                        position: halfwayLine,
                        rotation: MRE.Quaternion.LookAt(linePosition1, linePosition2),
                        scale: new MRE.Vector3(0.01, 0.01, distance)
                    }
                }
            }
        });
        return lineActor;
    }
    updatePatchLine(lineActor, linePosition1, linePosition2) {
        const halfwayLine = this.halfWay(linePosition1, linePosition2);
        const distance = this.getLength(linePosition1, linePosition2);
        lineActor.transform.local.position = halfwayLine;
        lineActor.transform.local.rotation = MRE.Quaternion.LookAt(linePosition1, linePosition2);
        lineActor.transform.local.scale = new MRE.Vector3(0.01, 0.01, distance);
    }
    async createBackground(pos, name, bgHeight) {
        this.backgroundHeight = bgHeight;
        this.guiGrabber = new grabbutton_1.default(this.ourApp);
        this.guiGrabber.create(pos);
        const backGroundMesh = this.ourApp.assets.createBoxMesh('boxMesh', 1.1, 0.1, this.backgroundHeight);
        this.guiBackground = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: this.guiGrabber.getGUID(),
                name: "consoleBackground",
                appearance: {
                    meshId: backGroundMesh.id,
                    materialId: this.ourApp.grayMat.id
                },
                transform: {
                    local: {
                        position: { x: -0.85, y: 0.0, z: -0.25 },
                    }
                }
            }
        });
        await this.guiBackground.created();
        const guiTextActor = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: this.guiBackground.id,
                name: 'consoleText',
                text: {
                    contents: name,
                    height: 2.0 / 25,
                    anchor: MRE.TextAnchorLocation.TopCenter,
                    color: new MRE.Color3(1, 1, 1)
                },
                transform: {
                    local: {
                        position: new MRE.Vector3(0.0, 0.051, this.backgroundHeight * 0.5 - 0.05),
                        rotation: MRE.Quaternion.FromEulerAngles(this.ourApp.degToRad(90), 0, 0)
                    }
                }
            }
        });
        await guiTextActor.created();
    }
}
exports.default = GuiPanel;
//# sourceMappingURL=gui_panel.js.map