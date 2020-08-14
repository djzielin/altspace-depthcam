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
class Button {
    constructor(ourApp) {
        this.ourApp = ourApp;
        this.ourValue = true;
        this.ourLabelOn = "";
        this.ourLabelOff = "";
        this.doVisualUpdates = true;
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
    async createAsync(pos, parentId, labelOn, labelOff, ourVal, callback, width = 0.75, height = 0.1) {
        this.ourValue = ourVal;
        this.ourLabelOn = labelOn;
        this.ourLabelOff = labelOff;
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
        let mat = this.ourApp.greenMat.id;
        if (!ourVal) {
            mat = this.ourApp.redMat.id;
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
                        position: { x: 0, y: 0, z: 0 },
                        scale: new MRE.Vector3(width, 0.1, height)
                    }
                }
            }
        });
        await this.buttonActor.created();
        this.buttonText = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: this.ourHolder.id,
                name: 'label',
                text: {
                    contents: "",
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
                if (this.ourValue) {
                    this.ourValue = false;
                }
                else {
                    this.ourValue = true;
                }
                if (this.doVisualUpdates) {
                    this.updateDisplayValue();
                }
                callback(this.ourValue);
            }
        });
    }
    setValue(val) {
        this.ourValue = val;
        this.updateDisplayValue();
    }
    getHolderPos() {
        return this.ourHolder.transform.local.position;
    }
    getValue() {
        return this.ourValue;
    }
    setGreen() {
        this.buttonActor.appearance.materialId = this.ourApp.greenMat.id;
    }
    setRed() {
        this.buttonActor.appearance.materialId = this.ourApp.redMat.id;
    }
    updateDisplayValue() {
        if (this.ourValue) {
            this.buttonText.text.contents = this.ourLabelOn;
            this.ourApp.ourConsole.logMessage("button ON. Label now: " + this.ourLabelOn);
            this.setGreen();
        }
        else {
            this.buttonText.text.contents = this.ourLabelOff;
            this.ourApp.ourConsole.logMessage("button OFF. Label now: " + this.ourLabelOff);
            this.setRed();
        }
    }
}
exports.default = Button;
//# sourceMappingURL=button.js.map