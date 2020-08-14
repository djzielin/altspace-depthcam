/*!
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from './app';
export default class GrabButton {
    private ourApp;
    private buttonActor;
    private lockButton;
    private unLocked;
    constructor(ourApp: App);
    setPos(pos: MRE.Vector3): void;
    setRot(rot: MRE.Quaternion): void;
    hide(): void;
    show(): void;
    destroy(): void;
    setUnlocked(b: boolean): void;
    setGrabReleaseCallback(callback: () => any): void;
    getGUID(): MRE.Guid;
    getPos(): MRE.Vector3;
    getRot(): MRE.Quaternion;
    create(pos: MRE.Vector3, rot?: MRE.Quaternion): void;
}
//# sourceMappingURL=grabbutton.d.ts.map