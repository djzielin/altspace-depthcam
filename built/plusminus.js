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
class PlusMinus {
    // Label  -but  value +but
    constructor(ourApp) {
        this.ourApp = ourApp;
        this.ourValue = 0;
        this.ourLabel = "";
        this.ourChangeAmount = 0;
        this.buttonValueDisplay = null;
    }
    async createAsync(pos, parentId, label, ourVal, changeAmount, callback) {
        this.ourValue = ourVal;
        this.ourLabel = label;
        this.ourChangeAmount = changeAmount;
        const ourHolder = MRE.Actor.Create(this.ourApp.context, {
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
        const buttonLabel = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: ourHolder.id,
                name: 'label',
                text: {
                    contents: this.ourLabel,
                    height: 0.1,
                    anchor: MRE.TextAnchorLocation.MiddleLeft
                },
                transform: {
                    local: {
                        position: { x: 0, y: 0.001, z: 0.0 },
                        rotation: MRE.Quaternion.FromEulerAngles(this.ourApp.degToRad(90), 0, 0)
                    }
                }
            }
        });
        await buttonLabel.created();
        const buttonM = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: ourHolder.id,
                name: "minusButton",
                appearance: {
                    meshId: this.ourApp.boxMesh.id,
                    materialId: this.ourApp.redMat.id
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } },
                transform: {
                    local: {
                        position: { x: 0.4, y: 0.0, z: 0.0 },
                        scale: new MRE.Vector3(0.1, 0.05, 0.1)
                    }
                }
            }
        });
        await buttonM.created();
        const minusTextDisplay = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: ourHolder.id,
                name: 'label',
                text: {
                    contents: "-",
                    height: 0.1,
                    anchor: MRE.TextAnchorLocation.MiddleCenter
                },
                transform: {
                    local: {
                        position: { x: 0.4, y: 0.026, z: 0.0 },
                        rotation: MRE.Quaternion.FromEulerAngles(this.ourApp.degToRad(90), 0, 0)
                    }
                }
            }
        });
        await minusTextDisplay.created();
        this.buttonValueDisplay = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: ourHolder.id,
                name: 'label',
                text: {
                    contents: "",
                    height: 0.1,
                    anchor: MRE.TextAnchorLocation.MiddleCenter
                },
                transform: {
                    local: {
                        position: { x: 0.65, y: 0.001, z: 0.0 },
                        rotation: MRE.Quaternion.FromEulerAngles(this.ourApp.degToRad(90), 0, 0)
                    }
                }
            }
        });
        this.updateDisplayValue();
        await this.buttonValueDisplay.created();
        const buttonP = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: ourHolder.id,
                name: "plusButton",
                appearance: {
                    meshId: this.ourApp.boxMesh.id,
                    materialId: this.ourApp.greenMat.id
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } },
                transform: {
                    local: {
                        position: { x: 0.9, y: 0.0, z: 0.0 },
                        scale: new MRE.Vector3(0.1, 0.05, 0.1)
                    }
                }
            }
        });
        await buttonP.created();
        const plusTextDisplay = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: ourHolder.id,
                name: 'label',
                text: {
                    contents: "+",
                    height: 0.1,
                    anchor: MRE.TextAnchorLocation.MiddleCenter
                },
                transform: {
                    local: {
                        position: { x: 0.9, y: 0.026, z: 0.0 },
                        rotation: MRE.Quaternion.FromEulerAngles(this.ourApp.degToRad(90), 0, 0)
                    }
                }
            }
        });
        await plusTextDisplay.created();
        buttonM.setBehavior(MRE.ButtonBehavior)
            .onButton("released", (user) => {
            const ourRoles = user.properties["altspacevr-roles"];
            if (ourRoles.includes("moderator") ||
                ourRoles.includes("presenter") || ourRoles.includes("terraformer")) {
                this.ourValue -= this.ourChangeAmount;
                if (this.ourValue < 0) { //always prevent negative numbers?
                    this.ourValue = 0;
                }
                this.updateDisplayValue();
                callback(this.ourValue);
            }
        });
        buttonP.setBehavior(MRE.ButtonBehavior)
            .onButton("released", (user) => {
            const ourRoles = user.properties["altspacevr-roles"];
            if (ourRoles.includes("moderator") ||
                ourRoles.includes("presenter") || ourRoles.includes("terraformer")) {
                this.ourValue += this.ourChangeAmount;
                this.updateDisplayValue();
                callback(this.ourValue);
            }
        });
    }
    updateDisplayValue() {
        this.ourApp.ourConsole.logMessage(this.ourLabel + " is now: " + this.ourValue);
        this.buttonValueDisplay.text.contents = this.ourValue.toFixed(2);
    }
}
exports.default = PlusMinus;
//# sourceMappingURL=plusminus.js.map