/*!
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { PianoReceiver } from './receiver';
import Console from './console';
import Button from './button';
import GrabButton from './grabbutton';
import Users from './users';
import GuiPanel from './gui_panel';
import MusicModule from './music_module';
interface PatchPointProperties {
    module: MusicModule;
    messageType: string;
    isSender: boolean;
    gui: GuiPanel;
    button: Button;
}
interface PatchProperties {
    sender: PatchPointProperties;
    receiver: PatchPointProperties;
    line: MRE.Actor;
}
export default class App {
    context: MRE.Context;
    baseUrl: string;
    baseDir: string;
    ourReceiver: PianoReceiver;
    assets: MRE.AssetContainer;
    showGUIs: boolean;
    allGUIs: GuiPanel[];
    ourConsole: Console;
    menuGrabber: GrabButton;
    boxMesh: MRE.Mesh;
    redMat: MRE.Material;
    greenMat: MRE.Material;
    whiteMat: MRE.Material;
    blackMat: MRE.Material;
    grayMat: MRE.Material;
    handMesh: MRE.Mesh;
    handTexture: MRE.Texture;
    handMaterial: MRE.Material;
    ourUsers: Users;
    private receiverCallback;
    private ourPatches;
    private potentialPatchStack;
    depthCubes: MRE.Actor[];
    isPatchPointEqual(patchP1: PatchPointProperties, patchP2: PatchPointProperties): boolean;
    isPatchEqual(patch1: PatchProperties, patch2: PatchProperties): boolean;
    getPatchPointWorldPosition(patchPoint: PatchPointProperties, isSender: boolean): MRE.Vector3;
    updatePatchLines(gui: GuiPanel): void;
    showPatchLines(): void;
    hidePatchLines(): void;
    applyPatch(sender: PatchPointProperties, receiver: PatchPointProperties): void;
    patcherClickEvent(module: MusicModule, messageType: string, isSender: boolean, gui: GuiPanel, button: Button): void;
    constructor(context: MRE.Context, baseUrl: string, baseDir: string, ourReceiver: PianoReceiver);
    private websocketReceiveCallback;
    degToRad(degrees: number): number;
    private doReset;
    vector2String(v: MRE.Vector3, precision: number): string;
    pad(value: number, maxWidth: number, padChar: string): string;
    showAllGuis(b: boolean): void;
    private loadAsyncItems;
    dIndex: number;
    timer: NodeJS.Timeout;
    PianoReceiveCallback(message: Buffer): void;
    private stopped;
    private started;
}
export {};
//# sourceMappingURL=app.d.ts.map