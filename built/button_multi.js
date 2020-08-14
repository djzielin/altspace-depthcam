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
Object.defineProperty(exports, "__esModule", { value: true });
const MRE = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
class ButtonMulti {
    constructor(ourApp) {
        this.ourApp = ourApp;
        this.ourChoice = 0;
        this.ourLabels = [];
        this.buttonActor = null;
        this.buttonText = null;
        this.ourHolder = null;
    }
    destroy() {
        if (this.buttonActor) {
            this.buttonActor.destroy();
        }
        if (this.buttonText) {
            this.buttonText.destroy();
        }
        if (this.ourHolder) {
            this.ourHolder.destroy();
        }
    }
    setPos(pos) {
        this.ourHolder.transform.local.position = pos;
    }
    async createAsync(pos, parentId, labels, ourVal, callback, width = 0.75, height = 0.1) {
        this.ourLabels = labels;
        this.ourChoice = ourVal;
        this.ourHolder = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: parentId,
                name: "hold_elements",
                appearance: {},
                transform: {
                    local: {
                        position: pos
                    }
                }
            }
        });
        let mat = this.ourApp.redMat.id;
        if (ourVal > 0) {
            mat = this.ourApp.greenMat.id;
        }
        this.buttonActor = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: this.ourHolder.id,
                name: "toggleButton",
                appearance: {
                    meshId: this.ourApp.boxMesh.id,
                    materialId: mat
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } },
                transform: {
                    local: {
                        position: { x: 0, y: 0.00, z: 0.0 },
                        scale: new MRE.Vector3(width, 0.1, height)
                    }
                }
            }
        });
        await this.buttonActor.created();
        this.buttonText = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: this.ourHolder.id,
                name: "label",
                text: {
                    contents: this.ourLabels[ourVal],
                    height: 0.1,
                    anchor: MRE.TextAnchorLocation.MiddleCenter
                },
                transform: {
                    local: {
                        position: { x: 0, y: 0.051, z: 0.0 },
                        rotation: MRE.Quaternion.FromEulerAngles(this.ourApp.degToRad(90), 0, 0)
                    }
                }
            }
        });
        await this.buttonText.created();
        this.updateDisplayValue();
        // Set a click handler on the button.
        this.buttonActor.setBehavior(MRE.ButtonBehavior)
            .onButton("released", (user) => {
            const ourRoles = user.properties["altspacevr-roles"];
            if (ourRoles.includes("moderator") ||
                ourRoles.includes("presenter") || ourRoles.includes("terraformer")) {
                this.ourChoice = (this.ourChoice + 1) % this.ourLabels.length;
                this.updateDisplayValue();
                callback(this.ourChoice);
            }
        });
    }
    setValue(val) {
        this.ourChoice = val;
        this.updateDisplayValue();
    }
    getValue() {
        return this.ourChoice;
    }
    setGreen() {
        this.buttonActor.appearance.materialId = this.ourApp.greenMat.id;
    }
    setRed() {
        this.buttonActor.appearance.materialId = this.ourApp.redMat.id;
    }
    updateDisplayValue() {
        this.buttonText.text.contents = this.ourLabels[this.ourChoice];
        this.ourApp.ourConsole.logMessage("button ON. Label now: " + this.ourLabels[this.ourChoice]);
        if (this.ourChoice > 0) {
            this.setGreen();
        }
        else {
            this.setRed();
        }
    }
}
exports.default = ButtonMulti;
//# sourceMappingURL=button_multi.js.map