/*!
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from './app';
import GrabButton from './grabbutton';
export default class GuiPanel {
    protected ourApp: App;
    protected guiBackground: MRE.Actor;
    protected guiGrabber: GrabButton;
    protected backgroundHeight: number;
    constructor(ourApp: App);
    getBackgroundPos(): MRE.Vector3;
    hide(): void;
    show(): void;
    private halfWay;
    private getLength;
    transformPoint(point: MRE.Vector3): MRE.Vector3;
    createPatchLine(linePosition1: MRE.Vector3, linePosition2: MRE.Vector3): MRE.Actor;
    updatePatchLine(lineActor: MRE.Actor, linePosition1: MRE.Vector3, linePosition2: MRE.Vector3): void;
    createBackground(pos: MRE.Vector3, name: string, bgHeight: number): Promise<void>;
}
//# sourceMappingURL=gui_panel.d.ts.map