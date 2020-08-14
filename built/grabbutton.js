"use strict";
/*!
 * Licensed under the MIT License.
 */
/* eslint-disable no-warning-comments */
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
class GrabButton {
    constructor(ourApp) {
        this.ourApp = ourApp;
        this.buttonActor = null;
        this.lockButton = null;
        this.unLocked = false;
    }
    setPos(pos) {
        this.buttonActor.transform.local.position = pos;
    }
    setRot(rot) {
        this.buttonActor.transform.local.rotation = rot;
    }
    hide() {
        this.buttonActor.appearance.enabled = false;
    }
    show() {
        this.buttonActor.appearance.enabled = true;
    }
    destroy() {
        if (this.buttonActor) {
            this.buttonActor.destroy();
        }
        if (this.lockButton) {
            this.lockButton.destroy();
        }
    }
    setUnlocked(b) {
        this.unLocked = b;
        if (this.unLocked) {
            this.buttonActor.grabbable = true;
        }
        else {
            this.buttonActor.grabbable = false;
        }
    }
    setGrabReleaseCallback(callback) {
        this.buttonActor.onGrab("end", (user) => {
            setTimeout(() => { callback(); }, 1000); //wait a second so the pos is accurate
        });
    }
    getGUID() {
        return this.buttonActor.id;
    }
    getPos() {
        return this.buttonActor.transform.local.position;
    }
    getRot() {
        return this.buttonActor.transform.local.rotation;
    }
    create(pos, rot = new MRE.Quaternion()) {
        this.buttonActor = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                name: "grabberButton",
                transform: {
                    local: {
                        position: pos,
                        rotation: rot
                    }
                },
                appearance: {
                    meshId: this.ourApp.handMesh.id,
                    materialId: this.ourApp.handMaterial.id
                },
                collider: {
                    geometry: {
                        shape: MRE.ColliderType.Box
                    },
                    isTrigger: false
                },
                subscriptions: ["transform"]
            }
        });
        if (this.unLocked) {
            this.buttonActor.grabbable = true;
        }
        this.lockButton = new button_1.default(this.ourApp);
        this.lockButton.createAsync(new MRE.Vector3(0.0, 0.0, -0.25), this.buttonActor.id, "unlocked", "locked", this.unLocked, this.setUnlocked.bind(this), 0.45);
        /*this.buttonActor.setBehavior(MRE.ButtonBehavior)
            .onButton("pressed", (user: MRE.User) => {
                const ourRoles = user.properties["altspacevr-roles"];
                if (ourRoles.includes("moderator") ||
                    ourRoles.includes("presenter") || ourRoles.includes("terraformer")) {

                    this.ourApp.ourConsole.logMessage("grab button pressed!");
                    const ourUser = this.ourApp.findUserRecord(user.id);

                    if (ourUser) {
                        this.ourApp.ourConsole.logMessage("ourUser has enough permissions");
                    }
                }
            })
            .onButton("released", (user: MRE.User) => {
                const ourRoles = user.properties["altspacevr-roles"];
                if (ourRoles.includes("moderator") ||
                    ourRoles.includes("presenter") || ourRoles.includes("terraformer")) {

                    this.ourApp.ourConsole.logMessage("grab button released!");
                    //this.buttonActor.parentId=MRE.ZeroGuid; //is this how to unparent?
                }
            });*/
    }
}
exports.default = GrabButton;
//# sourceMappingURL=grabbutton.js.map