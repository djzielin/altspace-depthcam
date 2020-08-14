/*!
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from './app';
export default class Button {
    private ourApp;
    private ourValue;
    private ourLabelOn;
    private ourLabelOff;
    doVisualUpdates: boolean;
    private buttonActor;
    private buttonText;
    ourHolder: MRE.Actor;
    constructor(ourApp: App);
    destroy(): void;
    setPos(pos: MRE.Vector3): void;
    createAsync(pos: MRE.Vector3, parentId: MRE.Guid, labelOn: string, labelOff: string, ourVal: boolean, callback: (b: boolean) => any, width?: number, height?: number): Promise<void>;
    setValue(val: boolean): void;
    getHolderPos(): MRE.Vector3;
    getValue(): boolean;
    private setGreen;
    private setRed;
    private updateDisplayValue;
}
//# sourceMappingURL=button.d.ts.map