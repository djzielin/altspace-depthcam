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
const console_1 = __importDefault(require("./console"));
const button_1 = __importDefault(require("./button"));
const grabbutton_1 = __importDefault(require("./grabbutton"));
const users_1 = __importDefault(require("./users"));
class App {
    constructor(context, baseUrl, baseDir, ourReceiver) {
        this.context = context;
        this.baseUrl = baseUrl;
        this.baseDir = baseDir;
        this.ourReceiver = ourReceiver;
        this.showGUIs = false;
        this.allGUIs = [];
        this.ourConsole = null;
        this.menuGrabber = null;
        this.handMesh = null;
        this.handTexture = null;
        this.handMaterial = null;
        this.ourPatches = []; //TODO patcher could be its own class
        this.potentialPatchStack = [];
        this.depthCubes = [];
        this.dIndex = 0;
        this.ourConsole = new console_1.default(this);
        this.assets = new MRE.AssetContainer(context);
        this.boxMesh = this.assets.createBoxMesh('boxMesh', 1.0, 1.0, 1.0);
        this.redMat = this.assets.createMaterial('redmat', {
            color: new MRE.Color4(1, 0, 0)
        });
        this.greenMat = this.assets.createMaterial('redmat', {
            color: new MRE.Color4(0, 1, 0)
        });
        this.blackMat = this.assets.createMaterial('blackMat', {
            color: new MRE.Color4(0, 0, 0)
        });
        this.whiteMat = this.assets.createMaterial('whiteMat', {
            color: new MRE.Color4(1, 1, 1)
        });
        this.grayMat = this.assets.createMaterial('whiteMat', {
            color: new MRE.Color4(0.5, 0.5, 0.5)
        });
        const filename = `${this.baseUrl}/` + "hand_grey.png";
        this.handTexture = this.assets.createTexture("hand", {
            uri: filename
        });
        this.handMaterial = this.assets.createMaterial('handMat', {
            color: new MRE.Color4(1, 1, 1),
            mainTextureId: this.handTexture.id
        });
        this.handMesh = this.assets.createBoxMesh('boxMesh', 0.25, 0.1, 0.25);
        this.menuGrabber = new grabbutton_1.default(this);
        this.menuGrabber.create(new MRE.Vector3(3, 0.1, 0));
        this.ourUsers = new users_1.default(this);
        this.context.onStarted(() => this.started());
        this.context.onStopped(() => this.stopped());
        this.context.onUserLeft(user => this.ourUsers.userLeft(user));
        this.context.onUserJoined(user => this.ourUsers.userJoined(user));
    }
    isPatchPointEqual(patchP1, patchP2) {
        if (patchP1.gui !== patchP2.gui) {
            return false;
        }
        if (patchP1.isSender !== patchP2.isSender) {
            return false;
        }
        if (patchP1.messageType !== patchP2.messageType) {
            return false;
        }
        if (patchP1.module !== patchP2.module) {
            return false;
        }
        if (patchP1.button !== patchP2.button) {
            return false;
        }
        return true;
    }
    isPatchEqual(patch1, patch2) {
        if (!this.isPatchPointEqual(patch1.sender, patch2.sender)) {
            return false;
        }
        if (!this.isPatchPointEqual(patch1.receiver, patch2.receiver)) {
            return false;
        }
        return true;
    }
    getPatchPointWorldPosition(patchPoint, isSender) {
        const offset = new MRE.Vector3(0.75 / 2, 0.1 / 2, 0);
        if (!isSender) {
            offset.x = -0.75 / 2;
        }
        return patchPoint.gui.transformPoint(patchPoint.button.getHolderPos().add(offset));
    }
    updatePatchLines(gui) {
        this.ourConsole.logMessage("Grab Release happening. Updating Patcher Lines!");
        for (const existingPatch of this.ourPatches) {
            if (existingPatch.sender.gui === gui || existingPatch.receiver.gui === gui) {
                const pos1 = this.getPatchPointWorldPosition(existingPatch.sender, true);
                const pos2 = this.getPatchPointWorldPosition(existingPatch.receiver, false);
                existingPatch.sender.gui.updatePatchLine(existingPatch.line, pos1, pos2);
            }
        }
    }
    showPatchLines() {
        for (const existingPatch of this.ourPatches) {
            if (existingPatch.line) {
                existingPatch.line.appearance.enabled = true;
            }
        }
    }
    hidePatchLines() {
        for (const existingPatch of this.ourPatches) {
            if (existingPatch.line) {
                existingPatch.line.appearance.enabled = false;
            }
        }
    }
    applyPatch(sender, receiver) {
        const newPatch = {
            sender: sender,
            receiver: receiver,
            line: null
        };
        for (const existingPatch of this.ourPatches) {
            if (this.isPatchEqual(existingPatch, newPatch)) { //already exists! so DELETE
                this.ourConsole.logMessage("  patch already exists. deleting!");
                sender.module.removeSendDestination(receiver.module);
                if (existingPatch.line) {
                    existingPatch.line.destroy();
                }
                const index = this.ourPatches.indexOf(existingPatch);
                this.ourPatches.splice(index, 1);
                return;
            }
        }
        this.ourConsole.logMessage("  patch doesn't yet exist. adding!");
        sender.module.sendDestinations.push(receiver.module);
        if (newPatch.sender.gui && newPatch.receiver.gui) {
            const pos1 = this.getPatchPointWorldPosition(newPatch.sender, true);
            const pos2 = this.getPatchPointWorldPosition(newPatch.receiver, false);
            newPatch.line = sender.gui.createPatchLine(pos1, pos2);
        }
        this.ourPatches.push(newPatch);
    }
    patcherClickEvent(module, messageType, isSender, gui, button) {
        const patchType = isSender ? "sender" : "receiver";
        this.ourConsole.logMessage("received patch point: " + messageType + " " + patchType);
        const potentialPatchPoint = {
            module: module,
            messageType: messageType,
            isSender: isSender,
            gui: gui,
            button: button
        };
        this.potentialPatchStack.push(potentialPatchPoint);
        if (this.potentialPatchStack.length === 2) {
            this.ourConsole.logMessage("  have 2 pending patch points, checking if we have a match!");
            let sender = null;
            let receiver = null;
            for (const singlePatchPoint of this.potentialPatchStack) {
                if (singlePatchPoint.isSender) {
                    sender = singlePatchPoint;
                }
                else {
                    receiver = singlePatchPoint;
                }
            }
            if (sender && receiver) { //great, we got both a sender and a receiver
                if (sender.messageType === receiver.messageType) { //do message types match? ie both midi?
                    if (sender.gui !== receiver.gui) {
                        this.ourConsole.logMessage("  we have a match!");
                        this.applyPatch(sender, receiver);
                    }
                    else {
                        this.ourConsole.logMessage("  not allowing user to route back to self");
                    }
                }
                else {
                    this.ourConsole.logMessage("  incompatible message type");
                }
            }
            else {
                this.ourConsole.logMessage("  no match. both are senders or receivers");
            }
            sender.button.setValue(true);
            receiver.button.setValue(true);
            this.potentialPatchStack.pop();
            this.potentialPatchStack.pop();
        }
    }
    websocketReceiveCallback(info) {
    }
    degToRad(degrees) {
        const pi = Math.PI;
        return degrees * (pi / 180);
    }
    doReset() {
        process.exit(0);
    }
    vector2String(v, precision) {
        return "{X: " + v.x.toFixed(precision) +
            " Y: " + v.y.toFixed(precision) +
            " Z: " + v.z.toFixed(precision) + "}";
    }
    /*
        https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
    */
    pad(value, maxWidth, padChar) {
        const n = value.toString();
        return n.length >= maxWidth ? n : new Array(maxWidth - n.length + 1).join(padChar) + n;
    }
    showAllGuis(b) {
        for (const singlePanel of this.allGUIs) {
            if (b) {
                singlePanel.show();
            }
            else {
                singlePanel.hide();
            }
        }
        if (b) {
            this.showPatchLines();
        }
        else {
            this.hidePatchLines();
        }
    }
    async loadAsyncItems() {
        this.ourConsole.logMessage("creating console");
        await this.ourConsole.createAsyncItems(new MRE.Vector3(-0.7, 0, 0.9), this.menuGrabber.getGUID());
        this.ourConsole.logMessage("Creating Reset Button ");
        const button = new button_1.default(this);
        await button.createAsync(new MRE.Vector3(-0.7, 0, 0.5), this.menuGrabber.getGUID(), "Reset", "Reset", false, this.doReset.bind(this));
        this.ourConsole.logMessage("Creating ShowGUI Button ");
        const guiButton = new button_1.default(this);
        await guiButton.createAsync(new MRE.Vector3(-0.7, 0, 0.1), this.menuGrabber.getGUID(), "GUIs ON", "GUIs OFF", this.showGUIs, this.showAllGuis.bind(this));
        let xPos = 1.5;
        this.ourConsole.logMessage("Waiting for all patch lines to be created");
        for (const singlePatch of this.ourPatches) {
            await singlePatch.line.created();
        }
        const decimation = 16;
        const yMax = 480 / decimation;
        const xMax = 640 / decimation;
        for (let y = 0; y < yMax; y++) {
            for (let x = 0; x < xMax; x++) {
                const depthCube = MRE.Actor.Create(this.context, {
                    actor: {
                        //parentId: this.ourHolder.id,
                        name: "depthCube",
                        appearance: {
                            meshId: this.boxMesh.id
                            //materialId: mat
                        },
                        //collider: { geometry: { shape: MRE.ColliderType.Auto } },
                        transform: {
                            local: {
                                position: { x: x / decimation * 2.0 - 5, y: y / decimation * 2.0 + 1.0, z: 1000 },
                                scale: new MRE.Vector3(1 / decimation * 2.0, 1 / decimation * 2.0, 1 / decimation * 2.0)
                            }
                        }
                    }
                });
                this.depthCubes.push(depthCube);
            }
        }
        this.showAllGuis(false);
    }
    PianoReceiveCallback(message) {
        this.ourConsole.logMessage("we got data from remote: " + message.length);
        if (this.dIndex > 0) {
            this.ourConsole.logMessage("still processing old image");
            return;
        }
        this.timer = setInterval(() => {
            for (let i = 0; i < 600; i++) {
                //this.ourConsole.logMessage("i: " + this.dIndex);
                let zPos = message[this.dIndex];
                if (zPos > 0) {
                    this.depthCubes[this.dIndex].transform.local.position.z = -3 + (zPos / 255.0) * 4.0;
                }
                else {
                    this.depthCubes[this.dIndex].transform.local.position.z = 1000;
                }
                this.dIndex++;
                if (this.dIndex === message.length) {
                    clearInterval(this.timer);
                    this.dIndex = 0;
                    break;
                }
            }
        }, 1);
        /*for(let i=0;i<message.length;i++){
            
        }*/
    }
    stopped() {
        MRE.log.info("app", "stopped callback has been called");
        this.ourReceiver.removeReceiver(this.receiverCallback);
    }
    started() {
        this.ourConsole.logMessage("started callback has begun");
        this.loadAsyncItems().then(() => {
            this.ourConsole.logMessage("all async items created/loaded!");
            this.receiverCallback = this.PianoReceiveCallback.bind(this);
            this.ourReceiver.addReceiver(this.receiverCallback);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map