/*!
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from './app';
import GrabButton from './grabbutton';
export default class MusicModule {
    protected ourApp: App;
    ourGrabber: GrabButton;
    sendDestinations: MusicModule[];
    constructor(ourApp: App);
    getWorldPosFromMatrix(mPoint: MRE.Matrix): MRE.Vector3;
    getWorldPos(pos: MRE.Vector3): MRE.Vector3;
    hide(): void;
    show(): void;
    createGrabber(pos: MRE.Vector3, quat: MRE.Quaternion): void;
    receiveData(data: number[]): void;
    removeSendDestination(module: MusicModule): void;
    sendData(data: number[]): void;
}
//# sourceMappingURL=music_module.d.ts.map