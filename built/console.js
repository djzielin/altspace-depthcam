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
const button_1 = __importDefault(require("./button"));
class Console {
    constructor(ourApp) {
        this.ourApp = ourApp;
        this.consoleTextActor = null;
        this.consoleText = [];
        this.consoleOn = false;
        this.consoleParent = null;
        for (let i = 0; i < 25; i++) {
            this.consoleText.push("");
        }
    }
    setConsoleOn(b) {
        this.consoleOn = b;
        this.consoleParent.appearance.enabled = this.consoleOn;
    }
    async createAsyncItems(pos, ourParent) {
        this.ourParent = ourParent;
        this.consoleParent = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: this.ourParent,
                name: "parent",
                transform: {
                    local: {
                        position: pos,
                        scale: new MRE.Vector3(0.5, 0.5, 0.5)
                    }
                },
                appearance: {
                    enabled: this.consoleOn
                }
            }
        });
        await this.consoleParent.created();
        const consoleMat = this.ourApp.assets.createMaterial('consolemat', {
            color: new MRE.Color3(0, 0, 0)
        });
        await consoleMat.created;
        const consoleBackground = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: this.consoleParent.id,
                name: "consoleBackground",
                appearance: {
                    meshId: this.ourApp.boxMesh.id,
                    materialId: consoleMat.id
                },
                transform: {
                    local: {
                        position: { x: 0, y: 0.05, z: 0 },
                        scale: new MRE.Vector3(4.4, 0.1, 2.5)
                    }
                }
            }
        });
        await consoleBackground.created();
        this.consoleTextActor = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                parentId: this.consoleParent.id,
                name: 'consoleText',
                text: {
                    contents: "test",
                    height: 2.0 / 25,
                    anchor: MRE.TextAnchorLocation.TopLeft,
                    color: new MRE.Color3(1, 1, 1)
                },
                transform: {
                    local: {
                        position: { x: -(4.4 / 2) + 0.05, y: 0.101, z: (2.5 / 2) - 0.05 },
                        rotation: MRE.Quaternion.FromEulerAngles(this.ourApp.degToRad(90), 0, 0)
                    }
                }
            }
        });
        await this.consoleTextActor.created();
        this.logMessage("log initialized");
        const button = new button_1.default(this.ourApp);
        await button.createAsync(new MRE.Vector3(-0.7, 0, 0.3), this.ourParent, "Console On", "Console Off", this.consoleOn, this.setConsoleOn.bind(this));
    }
    logMessage(message) {
        MRE.log.info("app", message);
        if (this.consoleOn) {
            this.consoleText.push(message);
            this.consoleText.shift();
            if (this.consoleTextActor) {
                let combinedText = "";
                for (const s of this.consoleText) {
                    combinedText += s.substr(0, 80);
                    combinedText += "\n";
                }
                this.consoleTextActor.text.contents = combinedText;
            }
        }
    }
}
exports.default = Console;
//# sourceMappingURL=console.js.map