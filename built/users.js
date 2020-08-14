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
class Users {
    constructor(ourApp) {
        this.ourApp = ourApp;
        this.allUsers = [];
        this.moderatorUsers = [];
    }
    isAuthorized(user) {
        const ourRoles = user.properties["altspacevr-roles"];
        if (ourRoles.includes("moderator") || ourRoles.includes("presenter") || ourRoles.includes("terraformer")) {
            return true;
        }
        return false;
    }
    isAuthorizedString(user) {
        if (this.moderatorUsers.includes(user)) {
            //this.ourConsole.logMessage("user is moderator based on GUID");
            return true;
        }
        //this.ourConsole.logMessage("user is NOT moderator based on GUID");
        return false;
    }
    userJoined(user) {
        this.ourApp.ourConsole.logMessage("user joined. name: " + user.name + " id: " + user.id);
        let isModerator = false;
        if (this.isAuthorized(user)) {
            isModerator = true;
        }
        const rHand = null;
        const lHand = null;
        const ourUser = {
            name: user.name,
            user: user,
            userID: user.id,
            authButton: null,
            handButton: null,
            rHand: rHand,
            lHand: lHand,
            isModerator: isModerator
        };
        this.allUsers.push(ourUser);
        if (isModerator) {
            this.moderatorUsers.push(user.id.toString());
        }
        this.addHands(ourUser);
    }
    findUserRecord(userID) {
        for (let i = 0; i < this.allUsers.length; i++) {
            const ourUser = this.allUsers[i];
            if (ourUser.userID === userID) {
                return ourUser;
            }
        }
        this.ourApp.ourConsole.logMessage("ERROR: can't find userID: " + userID);
        return null;
    }
    userLeft(user) {
        this.ourApp.ourConsole.logMessage("user left. name: " + user.name + " id: " + user.id);
        this.ourApp.ourConsole.logMessage("  user array pre-deletion is size: " + this.allUsers.length);
        for (let i = 0; i < this.allUsers.length; i++) {
            const ourUser = this.allUsers[i];
            if (ourUser.userID === user.id) {
                this.allUsers.splice(i, 1);
                if (ourUser.isModerator) {
                    const userString = user.id.toString();
                    const index = this.moderatorUsers.indexOf(userString);
                    if (index !== -1) {
                        this.moderatorUsers.splice(index, 1);
                        this.ourApp.ourConsole.logMessage("removed user from moderator string list");
                    }
                }
                //this.removeHands(ourUser);
                break;
            }
        }
        this.ourApp.ourConsole.logMessage("  user array is now size: " + this.allUsers.length);
    }
    addHands(ourUser) {
        this.ourApp.ourConsole.logMessage("creating hands for: " + ourUser.name);
        ourUser.rHand = this.createHand('right-hand', ourUser.userID, new MRE.Vector3(0, 0, 0.1), new MRE.Vector3(0.03, 0.03, 0.14));
        ourUser.lHand = this.createHand('left-hand', ourUser.userID, new MRE.Vector3(0, 0, 0.1), new MRE.Vector3(0.03, 0.03, 0.14));
    }
    createHand(aPoint, userID, handPos, handScale) {
        const hand = MRE.Actor.Create(this.ourApp.context, {
            actor: {
                name: 'SpawnerUserHand_' + userID.toString(),
                transform: {
                    local: {
                        position: handPos,
                        scale: handScale
                    }
                },
                attachment: {
                    attachPoint: aPoint,
                    userId: userID
                },
                appearance: {
                    meshId: this.ourApp.boxMesh.id,
                    enabled: true
                },
                collider: {
                    geometry: {
                        shape: MRE.ColliderType.Box
                    },
                    isTrigger: false
                },
                rigidBody: {
                    enabled: true,
                    isKinematic: true
                }
            }
        });
        //hand.subscribe('transform');
        //hand.subscribe('rigidbody');
        //hand.subscribe('collider');
        return hand;
    }
}
exports.default = Users;
//# sourceMappingURL=users.js.map